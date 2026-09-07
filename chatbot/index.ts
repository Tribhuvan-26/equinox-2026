// chatbot/index.ts
// Public API and entry point for the Equinox 2026 self-contained chatbot overlay

export { ChatbotOverlay } from "./components/ChatbotOverlay";
export { ChatWindow } from "./components/ChatWindow";
export { EventCard } from "./components/EventCard";
export { EventDetail } from "./components/EventDetail";
export { EQUINOX_SUB_EVENTS, OFFICIAL_COORDINATORS, EQUINOX_INFO } from "./data/events";
export type { SubEventInfo, EventCoordinator } from "./data/events";
export { getBotResponse } from "./data/responses";
export type { BotReply } from "./data/responses";
