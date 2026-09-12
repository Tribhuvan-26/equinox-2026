// lib/chatbot.ts
// Grounded deterministic response engine for Equinox 2.0
// Serves as both an offline engine and a deterministic fallback

import {
  event,
  subEvents,
  studentCoordinators,
  contact,
  highlights,
} from "./content";
import { EQUINOX_SUB_EVENTS, SubEventInfo } from "@/chatbot/data/events";
import {
  resolveSubEvent,
  detectAttributeIntent,
  normalizeQueryString,
  ResolvedEntity,
} from "./rag/entityResolution";
import { evaluateGuardrails } from "./rag/guardrails";
import { resolveConversationContext, ChatHistoryMessage } from "./rag/context";

export interface ChatbotResponse {
  answer: string;
  eventCard?: SubEventInfo;
  suggestions?: string[];
  links?: { label: string; url: string }[];
  grounded?: boolean;
}

const OFFICIAL_CONTACTS_TEXT = `You can reach out to our official student coordinators:
• **Shyam**: +91 93900 06806
• **Mahima**: +91 94933 62006
• **Sanjana**: +91 82084 99746
• **Adithya**: +91 91822 40970
Or email: **cie@mlrinstitutions.ac.in**`;

/**
 * Generates an accurate, grounded answer for a specific sub-event based on requested attribute
 */
function generateSubEventAttributeAnswer(
  entity: ResolvedEntity,
  query: string,
  isFollowUp: boolean
): ChatbotResponse {
  const info = entity.eventInfo;
  const content = entity.contentInfo || subEvents.find((s) => s.slug === entity.slug);
  const q = normalizeQueryString(query);
  const attribute = detectAttributeIntent(query);

  // Suggestions tailored to the event
  const defaultSuggestions = [
    `Who can participate in ${info.name}?`,
    `When is ${info.name}?`,
    "Browse all 10 events",
  ];

  // 1. Timing / Schedule
  if (attribute === "timing" || q.includes("time") || q.includes("when")) {
    const timeDetail = content?.time || info.timing;
    const dayDetail = content?.day || "";
    return {
      answer: `**${info.name}** Timing & Schedule:\n\n• **Date/Day**: ${dayDetail || "30–31 October 2026"}\n• **Time**: ${timeDetail}\n• **Venue**: ${info.venueRoom}`,
      eventCard: isFollowUp ? undefined : info,
      suggestions: [`Rules for ${info.name}`, `Who can participate?`, "Dates & Venue"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 2. Venue / Location
  if (attribute === "venue" || q.includes("where") || q.includes("room") || q.includes("hall")) {
    const venue = content?.venue || info.venueRoom;
    return {
      answer: `**${info.name}** Venue:\n\n• **Location**: ${venue}\n• **Campus**: MLR Institute of Technology, Hyderabad`,
      eventCard: isFollowUp ? undefined : info,
      suggestions: [`When does ${info.name} start?`, `Who can participate?`, "Summit Venue"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 3. Eligibility / Team size / Who can participate
  if (
    attribute === "eligibility" ||
    q.includes("participate") ||
    q.includes("eligibility") ||
    q.includes("eligible") ||
    q.includes("team")
  ) {
    const elig = content?.eligibility || info.eligibility;
    const teamSize = content?.teamSize ? ` (Team Size: ${content.teamSize})` : "";
    return {
      answer: `**${info.name}** Participation & Eligibility:\n\n• **Eligibility**: ${elig}${teamSize}\n• **Format**: ${info.format}`,
      eventCard: isFollowUp ? undefined : info,
      suggestions: [`What are the rules for ${info.name}?`, `When is it?`, "How to register?"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 4. Rules & Format
  if (attribute === "rules" || q.includes("rule") || q.includes("guideline") || q.includes("format")) {
    const rulesList = content?.rules && content.rules.length > 0
      ? content.rules.map((r: string) => `• ${r}`).join("\n")
      : `• Format: ${info.format}`;

    return {
      answer: `**${info.name}** Rules & Guidelines:\n\n${rulesList}\n\n• **Skills Evaluated**: ${info.skills.join(", ")}`,
      eventCard: isFollowUp ? undefined : info,
      suggestions: [`Who can participate?`, `When is it?`, "Register Now"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 5. Registration / Fees / Tickets
  if (
    attribute === "registration" ||
    q.includes("register") ||
    q.includes("registration") ||
    q.includes("fee") ||
    q.includes("ticket")
  ) {
    const feeDetail = content?.fee || "Summit Delegate Pass";
    return {
      answer: `**${info.name}** Registration & Fees:\n\n• **Registration Status**: ${info.registrationStatus}\n• **Fee**: ${feeDetail}\n• Registration will be processed online through the official Equinox portal.`,
      eventCard: isFollowUp ? undefined : info,
      suggestions: [`Tell me about ${info.name}`, `Dates & Venue`, "Contact coordinators"],
      links: [{ label: "Register on Website", url: "#events" }],
      grounded: true,
    };
  }

  // 6. Prize & Awards
  if (attribute === "prize" || q.includes("prize") || q.includes("award") || q.includes("cash")) {
    const prizeDetail = content?.prize || "Exclusive awards, recognition, and certificates";
    return {
      answer: `**${info.name}** Prizes & Rewards:\n\n• **Prize/Incentive**: ${prizeDetail}`,
      eventCard: isFollowUp ? undefined : info,
      suggestions: [`Rules for ${info.name}`, `Who can participate?`, "View all events"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 7. Coordinator / Contact
  if (attribute === "contact" || q.includes("contact") || q.includes("coordinator") || q.includes("spoc")) {
    const spoc = content?.spoc;
    const spocText = spoc
      ? `• **Event SPOC**: ${spoc.name} (${spoc.phone}) - ${spoc.email || "cie@mlrinstitutions.ac.in"}\n\n`
      : "";
    return {
      answer: `**${info.name}** Coordinator & Contact:\n\n${spocText}${OFFICIAL_CONTACTS_TEXT}`,
      eventCard: isFollowUp ? undefined : info,
      suggestions: [`Tell me about ${info.name}`, `When is it?`, "Main Venue"],
      links: [{ label: "Contact Us", url: "#contact" }],
      grounded: true,
    };
  }

  // Default: Event Overview
  return {
    answer: `**${info.name}** (Page ${info.pageNumber})\n\n${info.description}\n\n• **Category**: ${info.category}\n• **Key Skills**: ${info.skills.join(", ")}\n• **Format**: ${info.format}`,
    eventCard: info,
    suggestions: [
      `Who can participate in ${info.name}?`,
      `When is ${info.name}?`,
      `Rules for ${info.name}`,
    ],
    links: [{ label: "Explore Event", url: `#events` }],
    grounded: true,
  };
}

/**
 * Main grounded response generator
 */
export function getMockEquinoxResponse(
  query: string,
  history: ChatHistoryMessage[] = []
): ChatbotResponse {
  const trimmed = (query || "").trim();

  // 1. Guardrail evaluation
  const guard = evaluateGuardrails(trimmed);
  if (guard.type === "injection") {
    return {
      answer: guard.response,
      suggestions: ["List all 10 Sub-Events", "Dates & Venue", "Contact details"],
      grounded: true,
    };
  }

  if (guard.type === "garbage") {
    return {
      answer: guard.response,
      suggestions: ["List all 10 Sub-Events", "Dates & Venue", "Student Coordinators"],
      grounded: true,
    };
  }

  if (guard.type === "off_topic") {
    return {
      answer: guard.response,
      suggestions: ["List all 10 Sub-Events", "When & Where?", "How to register?"],
      grounded: true,
    };
  }

  // 2. Conversation Context & Coreference Resolution
  const context = resolveConversationContext(trimmed, history);
  const q = normalizeQueryString(trimmed);

  // 3. If an active entity is identified (either in current query or from previous turn)
  if (context.resolvedEntity) {
    return generateSubEventAttributeAnswer(
      context.resolvedEntity,
      trimmed,
      context.isFollowUp
    );
  }

  // 4. Check for ungrounded Equinox-related questions (Case B)
  // Check for queries asking for information not present in the program
  if (
    q.includes("who won") ||
    q.includes("winner") ||
    q.includes("last year") ||
    q.includes("previous edition") ||
    q.includes("past winners") ||
    q.includes("how many teams participated last year")
  ) {
    return {
      answer: `I don't have that information in the official Equinox 2.0 program.\n\n${OFFICIAL_CONTACTS_TEXT}`,
      suggestions: ["List all 10 Sub-Events", "When is Equinox 2.0?", "About CIE MLRIT"],
      grounded: true,
    };
  }

  if (q.includes("wifi") || q.includes("wi-fi") || q.includes("password")) {
    return {
      answer: `I don't have that information in the official Equinox 2.0 program.\n\nCampus network access and WiFi details will be provided at the registration desk during event check-in.`,
      suggestions: ["Dates & Venue", "List all 10 Sub-Events", "Contact coordinators"],
      grounded: true,
    };
  }

  if (q.includes("judge") || q.includes("judges") || q.includes("jury")) {
    return {
      answer: `I don't have that information in the official Equinox 2.0 program.\n\nJury panels and guest judges are announced closer to the event days.\n\n${OFFICIAL_CONTACTS_TEXT}`,
      suggestions: ["List all 10 Sub-Events", "Who are the coordinators?", "Dates & Venue"],
      grounded: true,
    };
  }

  if (q.includes("chief guest") || q.includes("guest of honour") || q.includes("dignitary")) {
    return {
      answer: `I don't have that information in the official Equinox 2.0 program.\n\nKeynote speakers and dignitaries will be announced on official social channels and the summit website.\n\n${OFFICIAL_CONTACTS_TEXT}`,
      suggestions: ["Spotlight Keynotes", "Dates & Venue", "Contact coordinators"],
      grounded: true,
    };
  }

  if (q.includes("prize pool") || q.includes("total prize") || (q.includes("prize") && !context.resolvedEntity)) {
    return {
      answer: `I don't have the overall summit prize pool figure in the official Equinox 2.0 program.\n\nHowever, individual sub-events feature dedicated awards, including:\n• **Pitch Deck**: Seed funding & incubation support\n• **Hustle Mania**: Retain sales profits + Winner Trophy\n• **IPL Auction**: Champion purse & team medals\n• **Startup Poly**: Equinox Board Champion Shield\n• **Cross Roads**: Strategy trophies & certificates\n\n${OFFICIAL_CONTACTS_TEXT}`,
      suggestions: ["Pitch Deck prizes", "Hustle Mania details", "Explore Sub-Events"],
      links: [{ label: "Explore Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 5. Summit Dates, Timing & Schedule
  if (
    q.includes("when") ||
    q.includes("date") ||
    q.includes("dates") ||
    q.includes("october") ||
    q.includes("schedule") ||
    q.includes("day")
  ) {
    return {
      answer: `**The Equinox 2.0** is confirmed for **${event.date}** (30th & 31st October 2026).\n\n• **Day 1 (30 Oct)**: Crossroads, Startup Expo, Hustle Mania, Startup Poly, Spotlight sessions\n• **Day 2 (31 Oct)**: Brand Battles, IPL Auction, Internship Drive, E-Cell Meet, Pitch Deck Grand Finale\n\nTagline: *"${event.tagline}"* (# WHERE PASSION MEETS PERSEVERANCE).`,
      suggestions: ["Where is the venue?", "List the 10 sub-events", "How to register?"],
      links: [{ label: "View Overview", url: "#top" }],
      grounded: true,
    };
  }

  // 6. Summit Venue & Location
  if (
    q.includes("where") ||
    q.includes("venue") ||
    q.includes("location") ||
    q.includes("mlrit") ||
    q.includes("hyderabad") ||
    q.includes("address") ||
    q.includes("reach")
  ) {
    return {
      answer: `The summit will be hosted at:\n\n**${event.venueFull}**\n\nOrganized by the **Centre for Innovation & Entrepreneurship (CIE), MLRIT**.`,
      suggestions: ["Dates & Schedule", "List all 10 sub-events", "Coordinator contacts"],
      links: [{ label: "Contact & Location", url: "#contact" }],
      grounded: true,
    };
  }

  // 7. General Registration
  if (q.includes("register") || q.includes("registration") || q.includes("pass") || q.includes("ticket") || q.includes("fee")) {
    return {
      answer: `Registration for **The Equinox 2.0** is opening soon! Delegates can register through the official summit portal to gain access to sub-events, keynote talks, the startup expo floor, and internship drives.\n\nFor queries regarding registrations or bulk college passes, contact:\n${OFFICIAL_CONTACTS_TEXT}`,
      suggestions: ["List all 10 sub-events", "Dates & Venue", "Student Coordinators"],
      links: [{ label: "Register on Website", url: "#events" }],
      grounded: true,
    };
  }

  // 8. Coordinators & Contact Info
  if (
    q.includes("contact") ||
    q.includes("coordinator") ||
    q.includes("coordinators") ||
    q.includes("phone") ||
    q.includes("email") ||
    q.includes("shyam") ||
    q.includes("mahima") ||
    q.includes("sanjana") ||
    q.includes("adithya")
  ) {
    return {
      answer: `Official Equinox 2.0 Student Coordinators:\n\n${OFFICIAL_CONTACTS_TEXT}`,
      suggestions: ["Where is the venue?", "Explore 10 Sub-Events", "When is the summit?"],
      links: [{ label: "Contact Us Section", url: "#contact" }],
      grounded: true,
    };
  }

  // 9. Sub-events List / Overview
  if (
    q.includes("event") ||
    q.includes("sub-event") ||
    q.includes("sub event") ||
    q.includes("competition") ||
    q.includes("list") ||
    q.includes("all events")
  ) {
    return {
      answer: `The Equinox 2.0 features **10 official sub-events** from the program:\n\n**Page 05:**\n1. **Spotlight**: Keynotes from tech & startup leaders\n2. **Cross Roads**: Business case-study challenge\n3. **Startup Expo**: Live product & venture exhibition\n4. **Brand Battles**: Head-to-head brand defense debate\n5. **IPL Auction**: Simulated cricket bidding & squad strategy\n\n**Page 06:**\n6. **Hustle Mania**: On-campus product selling showdown\n7. **Internship Drive**: Direct recruitment with startups\n8. **Startup Poly**: Monopoly-inspired business board game\n9. **E-Cell Meet**: Inter-college entrepreneurship leaders conclave\n10. **Pitch Deck**: Live investor pitch for student startups\n\nAsk about any event for rules, timing, and eligibility!`,
      suggestions: ["Tell me about Hustle Mania", "What is Startup Poly?", "IPL Auction details"],
      links: [{ label: "Explore Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 10. About CIE / Equinox
  if (q.includes("about") || q.includes("cie") || q.includes("who are we") || q.includes("what is equinox")) {
    return {
      answer: `**The Equinox 2.0** is the flagship entrepreneurship summit of **MLR CIE** (Centre for Innovation & Entrepreneurship, MLRIT). Its mission is to bridge passionate student builders with persevering startup founders and investors under the motto: *"# WHERE PASSION MEETS PERSEVERANCE"*.\n\nDates: **30 - 31 October 2026** at MLRIT Hyderabad.`,
      suggestions: ["What are the 10 sub-events?", "When is the summit?", "Contact coordinators"],
      links: [{ label: "About Section", url: "#about" }],
      grounded: true,
    };
  }

  // Case B Fallback for any unknown query:
  // Do NOT dump the full introduction. Explicitly state the information is not in the program.
  return {
    answer: `I don't have that information in the official Equinox 2.0 program.\n\n${OFFICIAL_CONTACTS_TEXT}`,
    suggestions: [
      "List all 10 Sub-Events",
      "Dates & Venue",
      "Student Coordinators",
    ],
    links: [{ label: "Browse Sub-Events", url: "#events" }],
    grounded: true,
  };
}
