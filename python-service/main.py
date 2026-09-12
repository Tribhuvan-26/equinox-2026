"""
main.py
FastAPI microservice for Equinox 2026 RAG-based chatbot retrieval and generation.
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
from dotenv import load_dotenv  # type: ignore

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent / ".env.local")
load_dotenv(Path(__file__).parent.parent / ".env.local")

from google import genai  # type: ignore
from knowledge_base import KnowledgeBase

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY is not set. Service will fail generation until configured.", file=sys.stderr)

app = FastAPI(
    title="Equinox 2026 RAG Chatbot Service",
    description="In-memory semantic retrieval and response generation for The Equinox 2.0 summit",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (local dev and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize knowledge base and GenAI client
kb = KnowledgeBase()
client = genai.Client(api_key=API_KEY) if API_KEY else None

GENERATION_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
]

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class SourceItem(BaseModel):
    title: str
    score: float
    source: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceItem]
    retrievedChunks: Optional[List[SourceItem]] = None
    eventCard: Optional[Dict[str, Any]] = None
    suggestions: List[str] = []
    links: List[Dict[str, str]] = []
    grounded: bool = True
    service: str = "python-fastapi"

def derive_suggestions(top_chunks: List[Dict[str, Any]], query: str) -> List[str]:
    q = query.lower()
    if top_chunks and top_chunks[0]["category"] == "subevent":
        slug = top_chunks[0].get("metadata", {}).get("slug", "")
        if slug == "hustle-mania":
            return ["What is Startup Poly?", "Pitch Deck details", "Contact coordinators"]
        elif slug == "ipl-auction":
            return ["What is Brand Battles?", "Spotlight sessions", "Dates & Venue"]
        elif slug == "crossroads":
            return ["Explore Brand Battles", "Registration steps", "Coordinator contacts"]
    if "venue" in q or "date" in q or "when" in q:
        return ["List all 10 Sub-Events", "How to register?", "Who are the coordinators?"]
    if "who won" in q or "past" in q or "winner" in q:
        return ["What is Equinox 2.0?", "Explore Sub-Events", "Contact Coordinators"]
    return ["Tell me about Hustle Mania", "What is Startup Poly?", "IPL Auction details"]

def match_event_card(top_chunks: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not top_chunks:
        return None
    top = top_chunks[0]
    if top.get("category") == "subevent" and top.get("score", 0) >= 0.58:
        meta = top.get("metadata", {})
        slug = meta.get("slug")
        if slug:
            return {
                "id": slug,
                "slug": slug,
                "name": meta.get("name", top["title"]),
                "pageNumber": meta.get("pageNumber", "05"),
                "category": meta.get("category", "Sub-Event"),
                "venueRoom": meta.get("venue", "MLRIT"),
                "timing": meta.get("timing", "30 - 31 Oct"),
                "registrationStatus": "Open Soon",
            }
    return None

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "equinox-rag-python",
        "chunks_loaded": len(kb.chunks),
        "api_key_configured": bool(os.environ.get("GEMINI_API_KEY"))
    }

@app.get("/")
def root():
    return {
        "service": "Equinox 2.0 RAG Backend",
        "health": "/health",
        "docs": "/docs",
        "chat": "POST /chat"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    query = req.message.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    current_key = os.environ.get("GEMINI_API_KEY")
    if not current_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on service")
        
    ai_client = client or genai.Client(api_key=current_key)
    
    # 1. Semantic Retrieval
    try:
        retrieval = kb.retrieve(query, ai_client, top_k=4)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval error: {str(e)}")
        
    system_instruction = """You are the official Equinox 2.0 AI Assistant for the flagship entrepreneurship summit organized by the Centre for Innovation and Entrepreneurship (CIE) at MLRIT Hyderabad on 30 - 31 October 2026.
Motto: "# WHERE PASSION MEETS PERSEVERANCE".

STRICT GROUNDING RULES:
1. Answer the user's question using ONLY the provided official Equinox brochure and event context.
2. If the context does not contain the answer, state clearly and politely:
   "I don't have that information in the official Equinox 2.0 program."
   Then suggest reaching out to the student coordinators:
   - Shyam: +91 93900 06806
   - Mahima: +91 94933 62006
   - Sanjana: +91 82084 99746
   - Adithya: +91 91822 40970
   Or email: cie@mlrinstitutions.ac.in.
3. Absolutely DO NOT speculate, invent, or hallucinate event rules, past winners, dates, or details not present in the context.
4. Format your answer with clean, readable Markdown (bullet points, bold highlights, headers where appropriate). Keep responses concise and direct."""

    prompt = f"""User Question: {query}

Official Equinox 2.0 Knowledge Base Context:
{retrieval['context_text']}

Answer:"""

    # 2. Generation with resilient model fallback
    answer_text = ""
    last_err = None
    for model in GENERATION_MODELS:
        try:
            res = ai_client.models.generate_content(
                model=model,
                contents=prompt,
                config={
                    "system_instruction": system_instruction,
                    "temperature": 0.2,
                }
            )
            if res.text:
                answer_text = res.text.strip()
                break
        except Exception as err:
            last_err = err
            print(f"Model {model} failed: {err}", file=sys.stderr)
            
    if not answer_text:
        raise HTTPException(status_code=502, detail=f"Generation failed across models: {last_err}")
        
    sources = [
        SourceItem(
            title=c["title"],
            score=c["score"],
            source=c["source"]
        )
        for c in retrieval["chunks"]
    ]
    
    event_card = match_event_card(retrieval["chunks"])
    suggestions = derive_suggestions(retrieval["chunks"], query)
    
    return ChatResponse(
        answer=answer_text,
        sources=sources,
        retrievedChunks=sources,
        eventCard=event_card,
        suggestions=suggestions,
        links=[{"label": "Browse Sub-Events", "url": "#events"}],
        grounded=True,
        service="python-fastapi"
    )

if __name__ == "__main__":
    import uvicorn  # type: ignore
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
