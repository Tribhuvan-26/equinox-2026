// lib/rag/context.ts
// Multi-turn conversation context manager and coreference resolution for Equinox 2.0

import { resolveSubEvent, isFollowUpReference, ResolvedEntity } from "./entityResolution";

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
 * Searches recent messages backwards for the most recently referenced official sub-event
 */
export function extractLastEntityFromHistory(
  history: ChatHistoryMessage[]
): ResolvedEntity | undefined {
  if (!history || history.length === 0) return undefined;

  // Search from most recent to oldest
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (!msg || !msg.content) continue;
    const resolved = resolveSubEvent(msg.content);
    if (resolved) {
      return resolved;
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

  // 1. Check if current query explicitly specifies an entity
  const directEntity = resolveSubEvent(trimmed);
  const isFollowUp = !directEntity && isFollowUpReference(trimmed);

  let activeEntity = directEntity;
  let augmentedQuery = trimmed;

  // 2. If it's a follow-up or has no direct entity, check history
  if (!directEntity && history && history.length > 0) {
    const historyEntity = extractLastEntityFromHistory(history);
    if (historyEntity) {
      activeEntity = historyEntity;
      // Reframe query if it's a follow-up reference
      if (isFollowUp) {
        augmentedQuery = `${trimmed} (in the context of ${historyEntity.name})`;
      } else {
        // Even if not strictly regex-matched, if short and context exists
        augmentedQuery = `${trimmed} regarding ${historyEntity.name}`;
      }
    }
  }

  // 3. Extract the last N messages for model prompt
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
