// lib/rag/guardrails.ts
// Security guardrails, prompt injection defense, garbage/emoji handling, and off-topic detection

import { normalizeQueryString, resolveSubEvent } from "./entityResolution";

export type GuardrailResult =
  | { type: "safe" }
  | { type: "injection"; reason: string; response: string }
  | { type: "garbage"; response: string }
  | { type: "off_topic"; response: string };

const INJECTION_PATTERNS = [
  /\b(ignore|forget|disregard|override)\b.*\b(instructions|instruction|rules|system|prompt|constraints|restrictions)\b/i,
  /\b(reveal|show|display|print|leak|tell me|give me|output)\b.*\b(system prompt|prompt|api key|apikey|api_key|token|secret|env|environment variable|developer instructions|hidden instructions|internal instructions)\b/i,
  /\b(you are no longer|you're no longer|act as|pretend to be|dan mode|jailbreak|unfiltered)\b/i,
  /\b(tell me a joke|write me a poem|write a song|roleplay)\b/i,
  /\b(invent|fabricate|make up|imagine|hallucinate)\b.*\b(prize|rule|winner|schedule|event)\b/i,
  /\b(system prompt|api key|environment variables)\b/i,
];

const OFF_TOPIC_PATTERNS = [
  /\b(write (me )?a (python|javascript|java|c\+\+|rust|go|code|program|script))\b/i,
  /\b(who is the (president|prime minister|king|queen|chief minister))\b/i,
  /\b(capital of|weather in|tallest building|solve this math|quantum physics|black hole)\b/i,
  /\b(recipe for|movie recommendation|who directed|meaning of life)\b/i,
];

/**
 * Checks if input is purely emojis, gibberish characters, or repeated words with no substance
 */
function isGarbageInput(raw: string, clean: string): boolean {
  // 1. Raw string is only emojis, whitespace, or symbols
  // Emoji regex range
  const emojiRegex = /^[\s\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}\uFE0F\u200D!?,.-]+$/u;
  if (emojiRegex.test(raw.trim())) {
    return true;
  }

  // 2. Character repetition like "aaaaaaaaaaaaa"
  const noSpaces = clean.replace(/\s+/g, "");
  if (noSpaces.length >= 4 && /^([a-z])\1+$/.test(noSpaces)) {
    return true;
  }

  // 3. Short repetitive nonsense without content like "what is what is what is what" or "broooooooo"
  const tokens = clean.split(" ");
  if (tokens.length > 0) {
    const uniqueTokens = new Set(tokens);
    // e.g. "what is what is what is what" has 8 tokens but only 2 unique ("what", "is")
    if (tokens.length >= 4 && uniqueTokens.size <= 2) {
      return true;
    }
  }

  if (clean.length > 3 && /^(bro+|bruh+|yo+|he+y+|du+de+|ha+ha+)+$/.test(noSpaces)) {
    return true;
  }

  // If query is basically empty after cleaning
  if (clean.length === 0) {
    return true;
  }

  return false;
}

export function evaluateGuardrails(rawMessage: string): GuardrailResult {
  const trimmed = (rawMessage || "").trim();

  // If literally empty
  if (!trimmed) {
    return {
      type: "garbage",
      response: "How can I help you with Equinox 2.0? You can ask about our 10 sub-events, dates (30–31 Oct), venue at MLRIT, or student coordinators.",
    };
  }

  // 1. Check for prompt injection / secrets extraction first
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        type: "injection",
        reason: "Prompt injection or sensitive info request detected",
        response:
          "I am the official Equinox 2.0 Assistant and can only provide information from the official Equinox 2.0 program. I cannot disclose system prompts, API keys, or internal configuration, nor deviate from verified event details.",
      };
    }
  }

  // 2. Check for recognized entity first before treating as garbage
  // (e.g. "HUSTLE MANIA?????" contains recognizable entity "hustle-mania")
  const resolved = resolveSubEvent(trimmed);
  if (resolved) {
    return { type: "safe" };
  }

  // 3. Check for garbage / meaningless input
  const clean = normalizeQueryString(trimmed);
  if (isGarbageInput(trimmed, clean)) {
    return {
      type: "garbage",
      response:
        "How can I help you with Equinox 2.0? You can ask about our 10 sub-events, dates (30–31 Oct), venue at MLRIT, or student coordinators.",
    };
  }

  // 4. Check for off-topic non-Equinox queries (Case C)
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        type: "off_topic",
        response:
          "I'm here to help with Equinox 2.0, its events, registration, and related information.",
      };
    }
  }

  return { type: "safe" };
}
