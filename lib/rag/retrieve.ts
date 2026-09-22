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
 * Collects configured and backup Gemini API keys
 */
export function getAvailableApiKeys(): string[] {
  const keys: string[] = [];
  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  if (process.env.GEMINI_API_KEY_BACKUP) keys.push(process.env.GEMINI_API_KEY_BACKUP);

  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf-8").split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const varName = match[1];
          const val = match[2]?.trim().replace(/^['"]|['"]$/g, "");
          if (val && (varName === "GEMINI_API_KEY" || varName === "GEMINI_API_KEY_BACKUP")) {
            if (!keys.includes(val)) {
              keys.push(val);
            }
          }
        }
      }
    }
  } catch {
    // Ignore in environments where fs is restricted
  }

  return keys;
}

/**
 * Gets primary Google Gen AI client.
 */
function getAiClient(): GoogleGenAI {
  const keys = getAvailableApiKeys();
  if (keys.length === 0) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
  }
  return new GoogleGenAI({ apiKey: keys[0] });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Generates an embedding vector for a given query using the configured Gemini model with backup key failover.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const keys = getAvailableApiKeys();
  let lastErr: any = null;

  for (const key of keys) {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await withTimeout(
        ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: query,
        }),
        3500,
        "Embedding"
      );

      const values = response.embeddings?.[0]?.values;
      if (values && values.length > 0) {
        return values;
      }
    } catch (err) {
      lastErr = err;
      console.warn("Embedding generation with key failed, trying backup if available:", err);
    }
  }

  throw lastErr || new Error(`Failed to generate embedding for query: "${query}"`);
}

/**
 * Fallback token-based similarity score if embedding is unavailable
 */
function computeKeywordScore(query: string, chunk: any, preferredSlug?: string): number {
  const qTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const contentLower = (chunk.title + " " + chunk.content).toLowerCase();
  let matches = 0;
  for (const token of qTokens) {
    if (contentLower.includes(token)) {
      matches++;
    }
  }
  let score = qTokens.length > 0 ? matches / qTokens.length : 0;
  if (preferredSlug && chunk.metadata?.slug === preferredSlug) {
    score += 0.5;
  }
  return score;
}

/**
 * Scans the in-memory knowledge base, computes cosine similarities,
 * and returns the top K most semantically relevant chunks.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK: number = 4,
  preferredSlug?: string
): Promise<RetrievalResult> {
  let scoredChunks: RetrievedChunk[] = [];

  try {
    const queryEmbedding = await embedQuery(query);

    scoredChunks = (knowledgeBaseData as any[]).map((item) => {
      let similarity = cosineSimilarity(queryEmbedding, item.embedding);
      // Boost preferred slug if explicitly resolved
      if (preferredSlug && item.metadata?.slug === preferredSlug) {
        similarity = Math.min(1.0, similarity + 0.25);
      }
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
  } catch (err) {
    console.warn("Embedding generation failed, using keyword fallback for retrieval:", err);
    scoredChunks = (knowledgeBaseData as any[]).map((item) => {
      const score = computeKeywordScore(query, item, preferredSlug);
      return {
        id: item.id,
        title: item.title,
        source: item.source,
        category: item.category,
        metadata: item.metadata,
        content: item.content,
        score,
      };
    });
  }

  // Sort descending by similarity score
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
