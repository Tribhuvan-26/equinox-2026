// chatbot/data/responses.ts
// Emergency client-side fallback engine grounded in the Equinox program.

import { SubEventInfo } from "./events";
import { getMockEquinoxResponse } from "@/lib/chatbot";
import { ChatHistoryMessage } from "@/lib/rag/context";

export interface BotReply {
  text: string;
  eventCard?: SubEventInfo;
  suggestions: string[];
}

/**
 * Emergency fallback delegating to the grounded Equinox response generator
 */
export function getBotResponse(userQuery: string, history: ChatHistoryMessage[] = []): BotReply {
  const res = getMockEquinoxResponse(userQuery, history);
  return {
    text: res.answer,
    eventCard: res.eventCard,
    suggestions: res.suggestions || [],
  };
}
