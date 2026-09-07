"""
knowledge_base.py
Manages in-memory vector storage and semantic retrieval using numpy cosine similarity.
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np  # type: ignore
from google import genai  # type: ignore

EMBEDDING_MODELS = ["gemini-embedding-001", "gemini-embedding-2"]

class KnowledgeBase:
    def __init__(self, json_path: Optional[Path] = None):
        if json_path is None:
            json_path = Path(__file__).parent / "knowledge_base.json"
        
        if not json_path.exists():
            raise FileNotFoundError(f"Knowledge base file not found at {json_path}")
            
        with open(json_path, "r", encoding="utf-8") as f:
            self.chunks: List[Dict[str, Any]] = json.load(f)
            
        # Pre-extract embedding vectors into a normalized 2D numpy array for ultra-fast cosine similarity
        vectors = [c["embedding"] for c in self.chunks]
        self.embeddings_matrix = np.array(vectors, dtype=np.float32)
        # Normalize rows to unit vectors
        norms = np.linalg.norm(self.embeddings_matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        self.normalized_matrix = self.embeddings_matrix / norms

    def embed_query(self, query: str, client: genai.Client) -> np.ndarray:
        for model in EMBEDDING_MODELS:
            try:
                res = client.models.embed_content(
                    model=model,
                    contents=query
                )
                values = res.embeddings[0].values
                if values:
                    vec = np.array(values, dtype=np.float32)
                    norm = np.linalg.norm(vec)
                    return vec / (norm if norm > 0 else 1.0)
            except Exception:
                continue
        raise RuntimeError("Failed to generate query embedding using Gemini")

    def retrieve(self, query: str, client: genai.Client, top_k: int = 4) -> Dict[str, Any]:
        query_vector = self.embed_query(query, client)
        
        # Dot product of unit vectors equals cosine similarity
        scores = np.dot(self.normalized_matrix, query_vector)
        
        # Top-K indices sorted descending
        top_indices = np.argsort(scores)[::-1][:top_k]
        
        retrieved_chunks = []
        for idx in top_indices:
            c = self.chunks[idx]
            score = float(scores[idx])
            retrieved_chunks.append({
                "id": c["id"],
                "title": c["title"],
                "source": c["source"],
                "category": c["category"],
                "metadata": c.get("metadata", {}),
                "content": c["content"],
                "score": round(score, 4),
            })
            
        context_parts = []
        for i, c in enumerate(retrieved_chunks):
            context_parts.append(
                f"--- CONTEXT CHUNK {i+1} [{c['title']} | Source: {c['source']}] (Similarity: {c['score']*100:.1f}%) ---\n{c['content']}"
            )
            
        context_text = "\n\n".join(context_parts)
        top_score = retrieved_chunks[0]["score"] if retrieved_chunks else 0.0
        
        return {
            "chunks": retrieved_chunks,
            "context_text": context_text,
            "top_score": top_score
        }
