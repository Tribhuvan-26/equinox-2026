// lib/rag/entityResolution.ts
// Official entity resolution, typo normalization, and attribute intent parsing for Equinox 2.0

import { EQUINOX_SUB_EVENTS, SubEventInfo, OFFICIAL_COORDINATORS, EQUINOX_INFO } from "@/chatbot/data/events";
import { subEvents as contentSubEvents, event as summitInfo, studentCoordinators } from "@/lib/content";

export interface ResolvedEntity {
  id: string;
  slug: string;
  name: string;
  pageNumber: string;
  eventInfo: SubEventInfo;
  contentInfo?: any;
  confidence: number;
}

export type AttributeIntent =
  | "timing"
  | "venue"
  | "eligibility"
  | "rules"
  | "registration"
  | "prize"
  | "contact"
  | "overview";

export interface QueryAnalysis {
  normalizedQuery: string;
  entity?: ResolvedEntity;
  attributeIntent?: AttributeIntent;
  isFollowUp: boolean;
  rawPunctuationCleaned: string;
}

// Canonical sub-event configurations with grounded semantic phrases from the official brochure
interface EventEntityDef {
  slug: string;
  name: string;
  primaryKeywords: string[];
  semanticPhrases: string[];
}

const EVENT_DEFINITIONS: EventEntityDef[] = [
  {
    slug: "spotlight",
    name: "Spotlight",
    primaryKeywords: ["spotlight", "keynote", "keynotes", "speaker", "speakers", "talks"],
    semanticPhrases: [
      "tech trends",
      "visionary keynotes",
      "emerging tech",
      "industry experts",
      "talk sessions",
      "tech leaders",
    ],
  },
  {
    slug: "crossroads",
    name: "Cross Roads",
    primaryKeywords: ["crossroads", "cross", "roads", "crossroad"],
    semanticPhrases: [
      "business case",
      "case study",
      "case competition",
      "the business case one",
      "case breakdown",
      "corporate dilemmas",
      "strategy challenge",
    ],
  },
  {
    slug: "startup-expo",
    name: "Startup Expo",
    primaryKeywords: ["expo", "exhibition", "stalls", "stall", "booth", "booths"],
    semanticPhrases: [
      "startup expo",
      "showcase products",
      "exhibition floor",
      "startup ventures",
      "prototype demo",
      "product exhibition",
    ],
  },
  {
    slug: "brand-battles",
    name: "Brand Battles",
    primaryKeywords: ["brand", "brands", "battles", "battle", "debate", "debates"],
    semanticPhrases: [
      "brand battles",
      "brand debate",
      "rival brands",
      "brand clash",
      "swiggy vs zomato",
      "apple vs samsung",
      "competitive debate",
    ],
  },
  {
    slug: "ipl-auction",
    name: "IPL Auction",
    primaryKeywords: ["ipl", "auction", "cricket", "bidding", "purse"],
    semanticPhrases: [
      "the auction",
      "cricket auction",
      "ipl auction",
      "simulated cricket",
      "player bidding",
      "team valuation",
      "auctioneer",
    ],
  },
  {
    slug: "hustle-mania",
    name: "Hustle Mania",
    primaryKeywords: ["hustle", "mania", "hustler", "hustlers"],
    semanticPhrases: [
      "hustle mania",
      "sell products",
      "selling products",
      "the one where you sell products",
      "product selling",
      "live selling",
      "marketing and negotiation",
      "on-campus stall",
      "stall selling",
    ],
  },
  {
    slug: "internship-drive",
    name: "Internship Drive",
    primaryKeywords: ["internship", "internships", "intern", "interns", "drive"],
    semanticPhrases: [
      "the internship event",
      "internship drive",
      "job drive",
      "recruitment",
      "career opportunities",
      "hiring founders",
      "on-spot interview",
    ],
  },
  {
    slug: "startup-poly",
    name: "Startup Poly",
    primaryKeywords: ["poly", "monopoly", "startuppoly"],
    semanticPhrases: [
      "startup poly",
      "monopoly inspired",
      "board game",
      "business simulation game",
      "tabletop simulation",
      "monopoly startup",
    ],
  },
  {
    slug: "e-cell-meet",
    name: "E-Cell Meet",
    primaryKeywords: ["ecell", "e-cell", "conclave"],
    semanticPhrases: [
      "what's the one about networking",
      "the one about networking",
      "networking event",
      "e-cell meet",
      "ecell meet",
      "cross-campus conclave",
      "inter-college",
      "connect e-cells",
      "partnerships across campuses",
      "networking",
      "ecosystem conclave",
    ],
  },
  {
    slug: "pitch-deck",
    name: "Pitch Deck",
    primaryKeywords: ["pitch", "deck", "pitching", "investor", "investors", "angels"],
    semanticPhrases: [
      "pitch deck",
      "pitch ideas",
      "presenting to investors",
      "angel investors",
      "startup pitching",
      "5-minute pitch",
    ],
  },
];

/**
 * Standard Levenshtein distance for typo matching
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Cleans punctuation and normalizes string for matching
 */
export function normalizeQueryString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolves a query against the 10 official sub-events with typo tolerance and semantic phrases
 */
export function resolveSubEvent(query: string): ResolvedEntity | undefined {
  const clean = normalizeQueryString(query);
  if (!clean) return undefined;

  const tokens = clean.split(" ").filter((t) => t.length > 1);

  // 1. Check exact semantic phrase matches (e.g. "the one where you sell products", "the one about networking")
  for (const def of EVENT_DEFINITIONS) {
    for (const phrase of def.semanticPhrases) {
      if (clean.includes(phrase)) {
        const found = EQUINOX_SUB_EVENTS.find((e) => e.slug === def.slug);
        const contentInfo = contentSubEvents.find((e) => e.slug === def.slug);
        if (found) {
          return {
            id: found.id,
            slug: found.slug,
            name: found.name,
            pageNumber: found.pageNumber,
            eventInfo: found,
            contentInfo,
            confidence: 0.95,
          };
        }
      }
    }
  }

  // 2. Check exact slug or primary keyword matches
  for (const def of EVENT_DEFINITIONS) {
    for (const kw of def.primaryKeywords) {
      if (tokens.includes(kw) || clean.includes(kw)) {
        const found = EQUINOX_SUB_EVENTS.find((e) => e.slug === def.slug);
        const contentInfo = contentSubEvents.find((e) => e.slug === def.slug);
        if (found) {
          return {
            id: found.id,
            slug: found.slug,
            name: found.name,
            pageNumber: found.pageNumber,
            eventInfo: found,
            contentInfo,
            confidence: 0.9,
          };
        }
      }
    }
  }

  // 3. Typo-tolerant matching using Levenshtein distance on tokens
  // Handles e.g. "internshp" (dist 1 to "internship"), "pich" (dist 1 to "pitch"),
  // "crossrods" (dist 1 to "crossroads"), "hustl" (dist 1 to "hustle"),
  // "startp" (dist 1 to "startup"), "aucton" (dist 1 to "auction")
  let bestMatch: { def: EventEntityDef; dist: number } | null = null;

  for (const token of tokens) {
    if (token.length < 3) continue;
    for (const def of EVENT_DEFINITIONS) {
      for (const kw of def.primaryKeywords) {
        if (Math.abs(token.length - kw.length) > 2) continue;
        const dist = levenshteinDistance(token, kw);
        const maxDist = kw.length <= 4 ? 1 : 2;
        if (dist <= maxDist) {
          if (!bestMatch || dist < bestMatch.dist) {
            bestMatch = { def, dist };
          }
        }
      }
    }
  }

  if (bestMatch) {
    const found = EQUINOX_SUB_EVENTS.find((e) => e.slug === bestMatch!.def.slug);
    const contentInfo = contentSubEvents.find((e) => e.slug === bestMatch!.def.slug);
    if (found) {
      return {
        id: found.id,
        slug: found.slug,
        name: found.name,
        pageNumber: found.pageNumber,
        eventInfo: found,
        contentInfo,
        confidence: 0.85 - bestMatch.dist * 0.1,
      };
    }
  }

  return undefined;
}

/**
 * Detects attribute intent (timing, venue, eligibility, rules, registration, prize, coordinator, etc.)
 */
export function detectAttributeIntent(query: string): AttributeIntent | undefined {
  const q = normalizeQueryString(query);

  if (
    q.includes("what time") ||
    q.includes("when is") ||
    q.includes("when does") ||
    q.includes("time") ||
    q.includes("timing") ||
    q.includes("start time") ||
    q.includes("schedule") ||
    q.includes("date") ||
    q.includes("dates") ||
    q.includes("when")
  ) {
    return "timing";
  }

  if (
    q.includes("where is") ||
    q.includes("where will") ||
    q.includes("venue") ||
    q.includes("location") ||
    q.includes("room") ||
    q.includes("hall") ||
    q.includes("auditorium") ||
    q.includes("place")
  ) {
    return "venue";
  }

  if (
    q.includes("who can participate") ||
    q.includes("who can attend") ||
    q.includes("eligibility") ||
    q.includes("eligible") ||
    q.includes("team size") ||
    q.includes("how many members") ||
    q.includes("solo") ||
    q.includes("teams")
  ) {
    return "eligibility";
  }

  if (
    q.includes("rule") ||
    q.includes("rules") ||
    q.includes("guideline") ||
    q.includes("guidelines") ||
    q.includes("format") ||
    q.includes("how does it work") ||
    q.includes("rounds")
  ) {
    return "rules";
  }

  if (
    q.includes("how do i register") ||
    q.includes("how to register") ||
    q.includes("registration") ||
    q.includes("register") ||
    q.includes("fee") ||
    q.includes("fees") ||
    q.includes("ticket") ||
    q.includes("pass") ||
    q.includes("cost")
  ) {
    return "registration";
  }

  if (
    q.includes("prize") ||
    q.includes("prizes") ||
    q.includes("prize pool") ||
    q.includes("reward") ||
    q.includes("cash") ||
    q.includes("awards")
  ) {
    return "prize";
  }

  if (
    q.includes("contact") ||
    q.includes("coordinator") ||
    q.includes("coordinators") ||
    q.includes("spoc") ||
    q.includes("phone") ||
    q.includes("email") ||
    q.includes("who is in charge")
  ) {
    return "contact";
  }

  if (
    q.includes("what is") ||
    q.includes("tell me about") ||
    q.includes("about") ||
    q.includes("details") ||
    q.includes("explain")
  ) {
    return "overview";
  }

  return undefined;
}

/**
 * Checks if the user query is a follow-up pronoun/reference
 */
export function isFollowUpReference(query: string): boolean {
  const q = normalizeQueryString(query);
  const patterns = [
    /^(it|this|that|that one|this one)$/,
    /\b(who can participate|who is eligible|can i participate|team size)\b/,
    /\b(when is it|what time does it|timing|when does it start|start time)\b/,
    /\b(where is it|what venue|location)\b/,
    /\b(what are the rules|rules|guidelines|format)\b/,
    /\b(how do i register|how to register|what about registration|registration|fees|fee)\b/,
    /\b(what is the prize|prize|prizes)\b/,
    /\b(who is the coordinator|contact|spoc)\b/,
    /\b(tell me more|details)\b/,
  ];

  return patterns.some((p) => p.test(q));
}
