// lib/rag/context.ts
// Multi-turn conversation context manager and coreference resolution for Equinox 2.0

import {
  resolveSubEvent,
  isFollowUpReference,
  normalizeQueryString,
  ResolvedEntity,
} from "./entityResolution";

export interface ChatHistoryMessage {
  role: "user" | "assistant" | "bot";
  content: string;
}

export interface ContextualizedQuery {
  rawQuery: string;
  augmentedQuery: string;
  resolvedEntity?: ResolvedEntity;
  isFollowUp: boolean;
  recentTurns: { role: "user" | "model"; text: string }[];
}

const MAX_HISTORY_MESSAGES = 8; // Sensible window limit (4 turns)

/**
 * Checks if a message indicates an explicit context break or switch to general summit inquiry
 */
function isContextBreakingMessage(content: string): boolean {
  const q = normalizeQueryString(content);
  return (
    q.includes("ignore that") ||
    q.includes("forget that") ||
    q.includes("nevermind") ||
    q.includes("who won") ||
    q.includes("last year") ||
    q.includes("wifi") ||
    q.includes("judge") ||
    q.includes("chief guest") ||
    q.includes("prize pool") ||
    q.includes("python")
  );
}

/**
 * Searches recent USER messages backwards for the most recently referenced official sub-event
 */
export function extractLastEntityFromHistory(
  history: ChatHistoryMessage[]
): ResolvedEntity | undefined {
  if (!history || history.length === 0) return undefined;

  // Search from most recent to oldest
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (!msg || !msg.content) continue;

    // If we hit a context-breaking message, do not search further into older history
    if (isContextBreakingMessage(msg.content)) {
      return undefined;
    }

    // Only inspect user messages for intent
    if (msg.role === "user") {
      const resolved = resolveSubEvent(msg.content);
      if (resolved) {
        return resolved;
      }
    }
  }

  return undefined;
}

/**
 * Resolves pronoun/follow-up references and augments the query with conversational context
 */
export function resolveConversationContext(
  query: string,
  history: ChatHistoryMessage[] = []
): ContextualizedQuery {
  const trimmed = (query || "").trim();
  const qClean = normalizeQueryString(trimmed);

  // Check if current message explicitly resets or breaks context
  const isBreak = isContextBreakingMessage(trimmed);

  // 1. Check if current query explicitly specifies an entity
  const directEntity = resolveSubEvent(trimmed);

  // 2. Follow-up is valid ONLY if there is no direct entity, no context break, and query matches follow-up patterns
  const isFollowUp = !directEntity && !isBreak && isFollowUpReference(trimmed);

  let activeEntity = directEntity;
  let augmentedQuery = trimmed;

  // 3. ONLY inherit active entity if this query is a genuine follow-up reference!
  // Standalone questions (e.g. "Who won Equinox last year?", "What is the WiFi password?")
  // must NEVER inherit a previous sub-event entity.
  if (!directEntity && isFollowUp && history && history.length > 0) {
    const historyEntity = extractLastEntityFromHistory(history);
    if (historyEntity) {
      activeEntity = historyEntity;
      augmentedQuery = `${trimmed} (in the context of ${historyEntity.name})`;
    }
  }

  // 4. Extract the last N messages for model prompt
  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);
  const recentTurns = recentHistory.map((m) => ({
    role: (m.role === "user" ? "user" : "model") as "user" | "model",
    text: m.content.trim(),
  }));

  return {
    rawQuery: trimmed,
    augmentedQuery,
    resolvedEntity: activeEntity,
    isFollowUp,
    recentTurns,
  };
}
