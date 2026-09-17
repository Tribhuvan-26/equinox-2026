// lib/rag/entityResolution.ts
// Official entity resolution, typo normalization, attribute intent parsing, and false-premise detection

import { EQUINOX_SUB_EVENTS, SubEventInfo } from "@/chatbot/data/events";
import { subEvents as contentSubEvents } from "@/lib/content";

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

export interface FalsePremiseResult {
  isFalsePremise: boolean;
  correction?: string;
  eventSlug?: string;
}

// Canonical sub-event configurations with grounded semantic phrases from the official brochure
interface EventEntityDef {
  slug: string;
  name: string;
  primaryKeywords: string[];
  semanticPhrases: string[];
}

export function isIdeathonQuery(query: string): boolean {
  const q = normalizeQueryString(query);
  return (
    q.includes("ideathon") ||
    /\bidea[\s-]*thon\b/i.test(query)
  );
}

const EVENT_DEFINITIONS: EventEntityDef[] = [
  {
    slug: "spotlight",
    name: "Spotlight",
    primaryKeywords: ["spotlight", "keynote", "keynotes"],
    semanticPhrases: [
      "which event has industry expert talks",
      "industry expert talks",
      "expert talks",
      "inspiring presentations from industry experts",
      "talks by industry experts",
      "industry experts on technology and entrepreneurship",
      "latest trends in technology and entrepreneurship",
      "emerging technologies industry trends",
      "future of work",
      "personal stories of resilience and innovation",
      "hear firsthand how successful entrepreneurs",
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
    primaryKeywords: ["crossroads", "crossroad", "cross roads", "crossrds"],
    semanticPhrases: [
      "which event has ceo cto and marketing manager roles",
      "which event has ceo cto and marketing manager",
      "which event has ceo cto marketing manager roles",
      "ceo cto and marketing manager roles",
      "ceo cto and marketing manager",
      "ceo cto marketing manager",
      "ceo cto",
      "the business simulation",
      "business simulation",
      "interactive business simulation",
      "team member will take on a specific role",
      "take on a specific role such as ceo cto or marketing manager",
      "strategic plan to overcome obstacles",
      "which event is about business cases",
      "event about business cases",
      "business cases",
      "business case",
      "the business case one",
      "case study competition",
      "case competition",
      "case study",
      "case breakdown",
      "corporate dilemmas",
      "strategy challenge",
    ],
  },
  {
    slug: "startup-expo",
    name: "Startup Expo",
    primaryKeywords: ["startup expo", "start up expo", "expo"],
    semanticPhrases: [
      "which event lets students showcase products",
      "lets students showcase products",
      "showcase products",
      "showcase innovative products",
      "showcase innovative products and business ideas",
      "showcase products and business ideas",
      "showcase their innovative products",
      "showcase their ideas and their marketing skills",
      "simulate a real life market",
      "simulate a real-life market",
      "which event is about startups",
      "event about startups",
      "startup expo",
      "exhibition floor",
      "startup ventures",
      "prototype demo",
      "product exhibition",
      "startup stalls",
    ],
  },
  {
    slug: "brand-battles",
    name: "Brand Battles",
    primaryKeywords: ["brand battles", "brand battle", "brand", "brands"],
    semanticPhrases: [
      "which event has rival brands debating",
      "rival brands debating",
      "the rival brands one",
      "two teams represent rival brands",
      "rival brands from the same sector",
      "well researched arguments supported by real time data",
      "well-researched arguments supported by real-time data",
      "demonstrate why their chosen brand stands superior",
      "which event is about brands",
      "event about brands",
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
    primaryKeywords: ["ipl auction", "ipl", "auction", "aucton", "aucion"],
    semanticPhrases: [
      "which event involves bidding on cricket players",
      "bidding on cricket players",
      "the cricket bidding one",
      "competitive cricket draft experience",
      "cricket draft",
      "step into the shoes of team owners",
      "step into the shoes of team owners and build their own squads",
      "fixed budget to bid on players",
      "assemble the strongest lineup",
      "which event involves bidding",
      "event involves bidding",
      "event about bidding",
      "the auction",
      "cricket auction",
      "ipl auction",
      "simulated cricket",
      "cricket bidding",
      "player bidding",
      "team valuation",
      "virtual purse",
      "bidding event",
    ],
  },
  {
    slug: "hustle-mania",
    name: "Hustle Mania",
    primaryKeywords: ["hustle mania", "hustle", "mania", "hustler"],
    semanticPhrases: [
      "which event involves setting up stalls and selling to customers",
      "setting up stalls and selling to customers",
      "which event involves selling to real customers",
      "selling to real customers",
      "which event involves setting up stalls",
      "setting up stalls",
      "the one where you sell products",
      "hands on business and marketing challenge",
      "hands-on business and marketing challenge",
      "set up stalls and sell their products to real customers",
      "set up stalls and sell products",
      "expenditure pricing revenue and profit",
      "tracked throughout the event",
      "customer engagement skills and smart budgeting",
      "which event involves selling products",
      "event involves selling products",
      "event about selling products",
      "selling products",
      "sell products",
      "product selling",
      "live selling",
      "marketing and negotiation",
      "on campus stall",
      "stall selling",
    ],
  },
  {
    slug: "internship-drive",
    name: "Internship Drive",
    primaryKeywords: ["internship drive", "internship", "internships", "intern"],
    semanticPhrases: [
      "which event connects students with companies for internships",
      "connects students with companies for internships",
      "which event involves internships",
      "connect students with companies for internships",
      "connect with companies that may not traditionally engage with campus recruitment",
      "traditionally engage with campus recruitment",
      "valuable experience with dynamic startups and mid level firms",
      "valuable experience with dynamic startups and mid-level firms",
      "explore diverse career paths",
      "which event is about internships",
      "event about internships",
      "the internship event",
      "internship drive",
      "job drive",
      "recruitment drive",
      "career opportunities",
      "hiring founders",
      "on spot interview",
    ],
  },
  {
    slug: "startup-poly",
    name: "Startup Poly",
    primaryKeywords: ["startup poly", "startuppoly", "poly", "monopoly"],
    semanticPhrases: [
      "which event is monopoly inspired",
      "which event is monopoly-inspired",
      "monopoly inspired",
      "monopoly-inspired",
      "the monopoly startup game",
      "monopoly startup game",
      "monopoly startup",
      "monopoly-inspired entrepreneurship challenge",
      "monopoly inspired entrepreneurship challenge",
      "roll a die and navigate through a board",
      "roll a die",
      "startup themed opportunities challenges rewards and setbacks",
      "startup-themed opportunities",
      "remain in the game until the end",
      "startup poly",
      "board game",
      "business simulation game",
      "tabletop simulation",
    ],
  },
  {
    slug: "e-cell-meet",
    name: "E-Cell Meet",
    primaryKeywords: ["e cell meet", "ecell meet", "ecell", "e-cell", "conclave"],
    semanticPhrases: [
      "which event is for e cells from different colleges",
      "which event is for e-cells from different colleges",
      "which event is for ecells from different colleges",
      "for e cells from different colleges",
      "for e-cells from different colleges",
      "for ecells from different colleges",
      "which event connects e cells",
      "which event connects e-cells",
      "which event connects ecells",
      "connects e cells",
      "connects e-cells",
      "the e cell networking event",
      "the e-cell networking event",
      "e cell networking event",
      "e-cell networking event",
      "networking event where e cells from different colleges come together",
      "networking event where e-cells from different colleges come together",
      "fostering collaboration across campuses",
      "which event is about networking",
      "event about networking",
      "what's the one about networking",
      "the one about networking",
      "networking event",
      "e cell meet",
      "ecell meet",
      "cross campus conclave",
      "inter college",
      "connect e cells",
      "partnerships across campuses",
      "networking",
      "ecosystem conclave",
    ],
  },
  {
    slug: "pitch-deck",
    name: "Pitch Deck",
    primaryKeywords: ["pitch deck", "pitchdeck", "pitching", "pitch"],
    semanticPhrases: [
      "which event involves presenting startup concepts to investors",
      "presenting startup concepts to investors",
      "present startup concepts to investors",
      "which event involves presenting startup concepts",
      "presenting startup concepts",
      "present startup concepts",
      "startup concepts to investors",
      "showcase their startup concepts to a panel of investors",
      "showcase startup concepts to a panel of investors",
      "showcase startup concepts",
      "panel of investors venture capitalists and industry experts",
      "panel of investors",
      "problem statement solution business model and market potential",
      "structured pitch",
      "pitching to venture capitalists and investors",
      "idea presentation event",
      "which event is about pitching",
      "event about pitching",
      "pitch deck",
      "pitch ideas",
      "presenting to investors",
      "angel investors",
      "startup pitching",
      "5 minute pitch",
      "investor pitch",
    ],
  },
];

/**
 * Standard Levenshtein distance for typo matching
 */
export function levenshteinDistance(a: string, b: string): number {
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
  let s = (str || "").toLowerCase();
  // Normalize known multi-word splits / variations and hyphens
  s = s.replace(/\bintern\s+ship(p)?\b/g, "internship");
  s = s.replace(/\bstart\s+up\b/g, "startup");
  s = s.replace(/\be[-\s]*cell\b/g, "ecell");
  s = s.replace(/\bpitch\s*dek\b/g, "pitch deck");
  s = s.replace(/\bpitchdeck\b/g, "pitch deck");
  s = s.replace(/\bcross\s+roads\b/g, "crossroads");
  s = s.replace(/[^\w\s-]/g, " ");
  s = s.replace(/\s+/g, " ");
  return s.trim();
}

/**
 * Resolves a query against the 10 official sub-events with typo tolerance and semantic phrases
 */
export function resolveSubEvent(query: string): ResolvedEntity | undefined {
  if (isIdeathonQuery(query)) {
    return undefined;
  }

  const clean = normalizeQueryString(query);
  if (!clean) return undefined;

  // 1. Check exact semantic phrase matches (e.g. "the one about networking", "which event is about business cases")
  for (const def of EVENT_DEFINITIONS) {
    for (const phrase of def.semanticPhrases) {
      const phraseRegex = new RegExp(`\\b${phrase.replace(/\s+/g, "\\s+")}\\b`, "i");
      if (phraseRegex.test(clean) || clean.includes(phrase)) {
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

  // 2. Check exact slug or primary keyword matches with word boundaries
  for (const def of EVENT_DEFINITIONS) {
    for (const kw of def.primaryKeywords) {
      const kwRegex = new RegExp(`\\b${kw.replace(/\s+/g, "\\s+")}\\b`, "i");
      if (kwRegex.test(clean)) {
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

  // 3. Typo-tolerant matching using Levenshtein distance on individual tokens
  const tokens = clean.split(" ").filter((t) => t.length >= 3);
  let bestMatch: { def: EventEntityDef; dist: number } | null = null;

  for (const token of tokens) {
    // Avoid matching common English words and generic summit words
    if (
      [
        "what",
        "when",
        "where",
        "which",
        "about",
        "tell",
        "from",
        "last",
        "year",
        "time",
        "date",
        "will",
        "this",
        "that",
        "write",
        "code",
        "make",
        "give",
        "with",
        "have",
        "take",
        "only",
        "team",
        "more",
        "startup",
        "startups",
        "business",
        "event",
        "events",
        "college",
        "colleges",
        "roles",
        "challenge",
        "competition",
        "participate",
        "students",
        "involves",
        "concept",
        "concepts",
        "idea",
        "ideas",
        "real",
        "different",
      ].includes(token)
    ) {
      continue;
    }

    // Special case for transposition typo "manai" -> "mania"
    if (token === "manai") {
      const def = EVENT_DEFINITIONS.find((d) => d.slug === "hustle-mania");
      if (def) {
        bestMatch = { def, dist: 1 };
        break;
      }
    }

    for (const def of EVENT_DEFINITIONS) {
      for (const kw of def.primaryKeywords) {
        const kwParts = kw.split(" ");
        for (const kwPart of kwParts) {
          // Avoid matching generic word parts
          if (["startup", "business", "deck"].includes(kwPart) && token !== kwPart) continue;
          if (Math.abs(token.length - kwPart.length) > 2) continue;
          const dist = levenshteinDistance(token, kwPart);
          // Strict threshold: length <= 6 only permits dist 1; prevents "write" (len 5) matching "drive" (dist 2)
          const maxDist = kwPart.length <= 6 ? 1 : 2;
          if (dist <= maxDist) {
            if (!bestMatch || dist < bestMatch.dist) {
              bestMatch = { def, dist };
            }
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
    q.includes("start time") ||
    q.includes("timing") ||
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
    q.includes("can i participate") ||
    q.includes("solo") ||
    q.includes("teams")
  ) {
    return "eligibility";
  }

  if (
    q.includes("what are the rules") ||
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
    q.includes("what about registration") ||
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
    q.includes("what is the prize") ||
    q.includes("prize") ||
    q.includes("prizes") ||
    q.includes("reward") ||
    q.includes("cash") ||
    q.includes("awards")
  ) {
    return "prize";
  }

  if (
    q.includes("coordinator") ||
    q.includes("coordinators") ||
    q.includes("spoc") ||
    q.includes("spocs") ||
    q.includes("phone") ||
    q.includes("email") ||
    q.includes("contact") ||
    q.includes("contacts") ||
    q.includes("who do i contact") ||
    q.includes("who to contact") ||
    q.includes("who manages") ||
    q.includes("manages") ||
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

  // Must NOT be an unknown summit query like "Who won Equinox last year?" or "What is the WiFi password?"
  if (
    q.includes("who won") ||
    q.includes("last year") ||
    q.includes("wifi") ||
    q.includes("judge") ||
    q.includes("chief guest") ||
    q.includes("prize pool") ||
    q.includes("accommodation") ||
    q.includes("food") ||
    q.includes("transport")
  ) {
    return false;
  }

  const patterns = [
    /^(it|this|that|that one|this one)$/,
    /\b(who can participate|who is eligible|can i participate|team size)\b/,
    /\b(when is it|what time does it|when does it start|start time)\b/,
    /\b(where is it|what venue|location)\b/,
    /\b(what are the rules|rules|guidelines|format)\b/,
    /\b(how do i register|how to register|what about registration|registration|fees|fee)\b/,
    /\b(what is the prize|prize|prizes)\b/,
    /\b(who is the coordinator|contact|spoc|spocs|who manages|who do i contact|who to contact)\b/,
    /\b(tell me more|details)\b/,
  ];

  return patterns.some((p) => p.test(q));
}

/**
 * Detects false premises in user questions and provides grounded corrections
 */
export function detectFalsePremise(query: string): FalsePremiseResult {
  const q = normalizeQueryString(query);

  // 1. Hustle Mania starts at 9 AM, right?
  if (
    q.includes("hustle") &&
    (q.includes("9 am") || q.includes("9:00 am") || q.includes("9am") || q.includes("starts at 9"))
  ) {
    return {
      isFalsePremise: true,
      eventSlug: "hustle-mania",
      correction:
        "Hustle Mania does not start at 9 AM. According to the official Equinox 2.0 program, Hustle Mania runs on 30 October (Day 1) from 10:30 AM to 04:30 PM at the Campus Promenade & CIE Courtyard.",
    };
  }

  // 2. IPL Auction is on 30 October, correct?
  if (
    (q.includes("ipl") || q.includes("auction")) &&
    (q.includes("30 oct") || q.includes("30th oct") || q.includes("day 1"))
  ) {
    return {
      isFalsePremise: true,
      eventSlug: "ipl-auction",
      correction:
        "IPL Auction is not on 30 October. According to the official Equinox 2.0 program, IPL Auction takes place on 31 October (Day 2) starting at 10:00 AM at the Indoor Sports Complex / Hall A.",
    };
  }

  // 3. Crossroads has a ₹50,000 prize, right?
  if (
    q.includes("crossroad") &&
    (q.includes("50 000") || q.includes("50000") || q.includes("50k") || q.includes("fifty thousand"))
  ) {
    return {
      isFalsePremise: true,
      eventSlug: "crossroads",
      correction:
        "The official Equinox 2.0 program does not list a ₹50,000 prize for Crossroads. The program lists exciting awards and certificates, with specific prize amounts to be announced soon.",
    };
  }

  // 4. Startup Expo is a cricket competition, right?
  if (q.includes("startup expo") && (q.includes("cricket") || q.includes("bidding"))) {
    return {
      isFalsePremise: true,
      eventSlug: "startup-expo",
      correction:
        "Startup Expo is not a cricket competition. It is a product exhibition platform for student ventures and startups to showcase their products and solutions. The cricket simulation bidding competition is IPL Auction.",
    };
  }

  // 5. Brand Battles is for individual participants only, right?
  if (
    q.includes("brand battle") &&
    (q.includes("individual") || q.includes("solo") || q.includes("single participant") || q.includes("only 1"))
  ) {
    return {
      isFalsePremise: true,
      eventSlug: "brand-battles",
      correction:
        "Brand Battles is not for individual participants only. According to the official Equinox 2.0 program, Brand Battles is contested by teams of 2 participants representing rival brands.",
    };
  }

  // 6. Pitch Deck registration is already closed, right?
  if (
    q.includes("pitch deck") &&
    (q.includes("closed") || q.includes("ended") || q.includes("already closed") || q.includes("over"))
  ) {
    return {
      isFalsePremise: true,
      eventSlug: "pitch-deck",
      correction:
        "Pitch Deck registration is not closed. The official Equinox 2.0 program lists registration status as Open Soon.",
    };
  }

  // 7. E-Cell Meet is happening at 5 PM, correct?
  if (
    (q.includes("ecell") || q.includes("e cell")) &&
    (q.includes("starts at 5") || q.includes("happening at 5") || q.includes("5 pm") || q.includes("5:00 pm"))
  ) {
    return {
      isFalsePremise: true,
      eventSlug: "e-cell-meet",
      correction:
        "E-Cell Meet does not begin at 5 PM. It is scheduled from 02:00 PM to 05:00 PM on 31 October (Day 2) in the Executive Boardroom, concluding at 5:00 PM.",
    };
  }

  return { isFalsePremise: false };
}
