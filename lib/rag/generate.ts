// lib/rag/generate.ts
// End-to-end RAG response generation grounded in Equinox 2026 knowledge base

import { GoogleGenAI } from "@google/genai";
import { retrieveRelevantChunks, RetrievedChunk } from "./retrieve";
import { EQUINOX_SUB_EVENTS, SubEventInfo } from "@/chatbot/data/events";
import { getMockEquinoxResponse } from "@/lib/chatbot";

export interface RagChatResponse {
  answer: string;
  eventCard?: SubEventInfo;
  suggestions?: string[];
  links?: { label: string; url: string }[];
  retrievedChunks: {
    title: string;
    score: number;
    source: string;
  }[];
  grounded: boolean;
  source: "rag-gemini" | "mock-fallback";
}

const GENERATION_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

function getAiClient(): GoogleGenAI | null {
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, "utf-8").split("\n");
        for (const line of lines) {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match && match[1] === "GEMINI_API_KEY") {
            apiKey = match[2].trim().replace(/^['"]|['"]$/g, "");
            process.env.GEMINI_API_KEY = apiKey;
            break;
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

/**
 * Derives contextual follow-up suggestions based on top retrieved chunks.
 */
function deriveSuggestions(topChunks: RetrievedChunk[], query: string): string[] {
  const q = query.toLowerCase();
  const suggestions: string[] = [];

  const top = topChunks[0];
  if (top && top.category === "subevent" && top.metadata?.slug) {
    const slug = top.metadata.slug;
    if (slug === "hustle-mania") {
      suggestions.push("What is Startup Poly?", "Pitch Deck details", "Contact coordinators");
    } else if (slug === "ipl-auction") {
      suggestions.push("What is Brand Battles?", "Spotlight sessions", "Dates & Venue");
    } else if (slug === "crossroads") {
      suggestions.push("Explore Brand Battles", "Registration steps", "Coordinator contacts");
    } else {
      suggestions.push("Browse all 10 events", "When and where?", "Contact coordinators");
    }
  } else if (q.includes("venue") || q.includes("date") || q.includes("when")) {
    suggestions.push("List all 10 Sub-Events", "How to register?", "Who are the coordinators?");
  } else if (q.includes("who won") || q.includes("history") || q.includes("past")) {
    suggestions.push("What is Equinox 2.0?", "Explore Sub-Events", "Contact Coordinators");
  } else {
    suggestions.push("Tell me about Hustle Mania", "What is Startup Poly?", "IPL Auction details");
  }

  return suggestions.slice(0, 3);
}

/**
 * Checks if the query or top chunk points to a specific sub-event card for rich UI rendering.
 */
function matchEventCard(topChunks: RetrievedChunk[]): SubEventInfo | undefined {
  const top = topChunks[0];
  if (top && top.category === "subevent" && top.score >= 0.58 && top.metadata?.slug) {
    const found = EQUINOX_SUB_EVENTS.find((e) => e.slug === top.metadata?.slug);
    if (found) return found;
  }
  return undefined;
}

/**
 * Generates an in-memory RAG response using Gemini and the Equinox 2026 knowledge base.
 */
export async function generateRagChatResponse(message: string): Promise<RagChatResponse> {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      answer: "Please ask a question regarding The Equinox 2.0 summit, sub-events, schedule, or coordinators.",
      suggestions: ["List all 10 Sub-Events", "When & Where?", "Coordinator Contacts"],
      retrievedChunks: [],
      grounded: false,
      source: "mock-fallback",
    };
  }

  const ai = getAiClient();
  if (!ai) {
    console.warn("GEMINI_API_KEY not found; using structured fallback.");
    const mock = getMockEquinoxResponse(trimmed);
    return {
      answer: mock.answer,
      suggestions: mock.suggestions,
      links: mock.links,
      retrievedChunks: [],
      grounded: false,
      source: "mock-fallback",
    };
  }

  try {
    // 1. Semantic Retrieval (Top 4 chunks from in-memory knowledge base)
    const retrieval = await retrieveRelevantChunks(trimmed, 4);

    const systemInstruction = `You are the official Equinox 2.0 AI Assistant for the flagship entrepreneurship summit organized by the Centre for Innovation and Entrepreneurship (CIE) at MLRIT Hyderabad on 30 - 31 October 2026.
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
4. Format your answer with clean, readable Markdown (bullet points, bold highlights, headers where appropriate). Keep responses concise and direct.`;

    const prompt = `User Question: ${trimmed}

Official Equinox 2.0 Knowledge Base Context:
${retrieval.contextText}

Answer:`;

    // 2. Generation with model fallback
    let answerText = "";
    let lastError: any = null;

    for (const model of GENERATION_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });
        if (response.text) {
          answerText = response.text.trim();
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed:`, err?.status || err?.message || err);
      }
    }

    if (!answerText) {
      throw lastError || new Error("All Gemini generation models failed");
    }

    const eventCard = matchEventCard(retrieval.chunks);
    const suggestions = deriveSuggestions(retrieval.chunks, trimmed);

    return {
      answer: answerText,
      eventCard,
      suggestions,
      links: [{ label: "Browse Sub-Events", url: "#events" }],
      retrievedChunks: retrieval.chunks.map((c) => ({
        title: c.title,
        score: Number(c.score.toFixed(4)),
        source: c.source,
      })),
      grounded: true,
      source: "rag-gemini",
    };
  } catch (error) {
    console.error("RAG pipeline error, falling back to mock:", error);
    const mock = getMockEquinoxResponse(trimmed);
    return {
      answer: mock.answer,
      suggestions: mock.suggestions,
      links: mock.links,
      retrievedChunks: [],
      grounded: false,
      source: "mock-fallback",
    };
  }
}
