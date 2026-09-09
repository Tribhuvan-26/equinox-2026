// lib/rag/retrieve.ts
// In-memory semantic retrieval grounded in Equinox 2026 knowledge base

import { GoogleGenAI } from "@google/genai";
import knowledgeBaseData from "./knowledge-base.json";

export interface RetrievedChunk {
  id: string;
  title: string;
  source: string;
  category: string;
  metadata?: Record<string, any>;
  content: string;
  score: number;
}

export interface RetrievalResult {
  query: string;
  chunks: RetrievedChunk[];
  contextText: string;
  topScore: number;
}

const EMBEDDING_MODEL = "gemini-embedding-001";

/**
 * Computes standard cosine similarity between two vector embeddings.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Gets or initializes the Google Gen AI client with GEMINI_API_KEY.
 */
function getAiClient(): GoogleGenAI {
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
      // Ignore in environments where fs is restricted
    }
  }

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Generates an embedding vector for a given query using the configured Gemini model.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const ai = getAiClient();
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: query,
  });

  const values = response.embeddings?.[0]?.values;
  if (!values || values.length === 0) {
    throw new Error(`Failed to generate embedding for query: "${query}"`);
  }
  return values;
}

/**
 * Scans the in-memory knowledge base, computes cosine similarities,
 * and returns the top K most semantically relevant chunks.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK: number = 4
): Promise<RetrievalResult> {
  const queryEmbedding = await embedQuery(query);

  const scoredChunks: RetrievedChunk[] = (knowledgeBaseData as any[]).map((item) => {
    const similarity = cosineSimilarity(queryEmbedding, item.embedding);
    return {
      id: item.id,
      title: item.title,
      source: item.source,
      category: item.category,
      metadata: item.metadata,
      content: item.content,
      score: similarity,
    };
  });

  // Sort descending by cosine similarity score
  scoredChunks.sort((a, b) => b.score - a.score);

  const topChunks = scoredChunks.slice(0, topK);
  const topScore = topChunks[0]?.score ?? 0;

  // Build formatted context prompt block
  const contextText = topChunks
    .map(
      (c, index) =>
        `--- CONTEXT CHUNK ${index + 1} [${c.title} | Source: ${c.source}] (Relevance: ${(c.score * 100).toFixed(1)}%) ---\n${c.content}`
    )
    .join("\n\n");

  return {
    query,
    chunks: topChunks,
    contextText,
    topScore,
  };
}
