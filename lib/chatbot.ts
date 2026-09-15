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
  detectFalsePremise,
  isIdeathonQuery,
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

const OFFICIAL_CONTACTS_TEXT = `Official Student Coordinators:
• **Shyam**: +91 93900 06806
• **Mahima**: +91 94933 62006
• **Sanjana**: +91 82084 99746
• **Adithya**: +91 91822 40970
Email: **cie@mlrinstitutions.ac.in**`;

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

  // 1. Check for false premises first
  const fp = detectFalsePremise(query);
  if (fp.isFalsePremise && fp.correction) {
    return {
      answer: fp.correction,
      eventCard: undefined,
      suggestions: [`Rules for ${info.name}`, `Who can participate?`, "Dates & Venue"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 2. Timing / Schedule
  if (
    attribute === "timing" ||
    q.includes("what time") ||
    q.includes("start time") ||
    q.includes("timing") ||
    q.includes("when does") ||
    q.includes("when is")
  ) {
    const timeDetail = content?.time || info.timing;
    const dayDetail = content?.day || "30–31 October 2026";
    return {
      answer: `**${info.name}** Timing & Schedule:\n\n• **Date**: ${dayDetail}\n• **Time**: ${timeDetail}\n• **Venue**: ${info.venueRoom}`,
      eventCard: undefined, // Do not attach cards on specific attribute queries
      suggestions: [`Who can participate in ${info.name}?`, `Rules for ${info.name}`, "Dates & Venue"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 3. Venue / Location
  if (attribute === "venue" || q.includes("where is") || q.includes("room") || q.includes("hall")) {
    const venue = content?.venue || info.venueRoom;
    return {
      answer: `**${info.name}** Venue:\n\n• **Location**: ${venue}\n• **Campus**: MLR Institute of Technology, Dundigal, Hyderabad`,
      eventCard: undefined,
      suggestions: [`When is ${info.name}?`, `Who can participate?`, "View Sub-Events"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 4. Eligibility / Team size
  if (
    attribute === "eligibility" ||
    q.includes("participate") ||
    q.includes("eligibility") ||
    q.includes("eligible") ||
    q.includes("team") ||
    q.includes("solo")
  ) {
    const elig = content?.eligibility || info.eligibility;
    const teamSize = content?.teamSize ? ` (Team Size: ${content.teamSize})` : "";
    return {
      answer: `**${info.name}** Eligibility & Team Size:\n\n• **Eligibility**: ${elig}${teamSize}\n• **Format**: ${info.format}`,
      eventCard: undefined,
      suggestions: [`What are the rules for ${info.name}?`, `When is it?`, "Registration status"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 5. Rules & Format
  if (attribute === "rules" || q.includes("rule") || q.includes("guideline") || q.includes("format")) {
    const rulesList = content?.rules && content.rules.length > 0
      ? content.rules.map((r: string) => `• ${r}`).join("\n")
      : `• Format: ${info.format}`;

    return {
      answer: `**${info.name}** Rules & Guidelines:\n\n${rulesList}\n\n• **Key Skills**: ${info.skills.join(", ")}`,
      eventCard: undefined,
      suggestions: [`Who can participate?`, `When is it?`, "How to register?"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 6. Registration & Fees
  if (
    attribute === "registration" ||
    q.includes("register") ||
    q.includes("registration") ||
    q.includes("fee") ||
    q.includes("ticket")
  ) {
    const feeDetail = content?.fee || "Included in Summit Pass / Free for participants";
    return {
      answer: `**${info.name}** Registration & Details:\n\n• **Status**: ${info.registrationStatus}\n• **Fee**: ${feeDetail}\n• Registration will be available online through the official Equinox portal.`,
      eventCard: undefined,
      suggestions: [`Tell me about ${info.name}`, `Dates & Venue`, "Contact coordinators"],
      links: [{ label: "Register on Website", url: "#events" }],
      grounded: true,
    };
  }

  // 7. Prize & Awards
  if (attribute === "prize" || q.includes("prize") || q.includes("award") || q.includes("cash")) {
    const prizeDetail = content?.prize || "Exclusive awards, certificates, and recognition";
    return {
      answer: `**${info.name}** Prizes & Awards:\n\n• **Prize**: ${prizeDetail}`,
      eventCard: undefined,
      suggestions: [`Rules for ${info.name}`, `Who can participate?`, "View all events"],
      links: [{ label: "View Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 8. Coordinator / Contact
  if (attribute === "contact" || q.includes("coordinator") || q.includes("spoc")) {
    const spoc = content?.spoc;
    const spocText = spoc
      ? `• **Event SPOC**: ${spoc.name} (${spoc.phone}) - ${spoc.email || "cie@mlrinstitutions.ac.in"}\n\n`
      : "";
    return {
      answer: `**${info.name}** Coordinator Contact:\n\n${spocText}${OFFICIAL_CONTACTS_TEXT}`,
      eventCard: undefined,
      suggestions: [`Tell me about ${info.name}`, `When is it?`, "Venue details"],
      links: [{ label: "Contact Us", url: "#contact" }],
      grounded: true,
    };
  }

  // Default: Event Overview (ONLY place where eventCard is attached for this event)
  return {
    answer: `**${info.name}** (Page ${info.pageNumber})\n\n${info.description}\n\n• **Category**: ${info.category}\n• **Skills Evaluated**: ${info.skills.join(", ")}\n• **Format**: ${info.format}`,
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

  // 1. Ideathon Exclusion Check
  if (isIdeathonQuery(trimmed)) {
    return {
      answer:
        "Ideathon is not part of the Equinox 2.0 chatbot's supported event information. Equinox 2.0 officially features 10 sub-events: Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, and Pitch Deck.",
      suggestions: ["List all 10 Sub-Events", "Dates & Venue", "Registration details"],
      links: [{ label: "Browse Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 2. Guardrail evaluation
  const guard = evaluateGuardrails(trimmed);
  if (guard.type === "injection") {
    return {
      answer: guard.response,
      suggestions: ["Explore Sub-Events", "Dates & Venue", "Registration"],
      grounded: true,
    };
  }

  if (guard.type === "garbage") {
    return {
      answer: guard.response,
      suggestions: ["Explore Sub-Events", "Dates & Venue", "Registration"],
      grounded: true,
    };
  }

  if (guard.type === "off_topic") {
    return {
      answer: guard.response,
      suggestions: ["Explore Sub-Events", "Dates & Venue", "Registration"],
      grounded: true,
    };
  }

  // 3. Check for false premise before context resolution
  const fp = detectFalsePremise(trimmed);
  if (fp.isFalsePremise && fp.correction) {
    return {
      answer: fp.correction,
      suggestions: ["Explore Sub-Events", "Dates & Venue", "Registration"],
      grounded: true,
    };
  }

  // 3. Conversation Context & Coreference Resolution
  const context = resolveConversationContext(trimmed, history);
  const q = normalizeQueryString(trimmed);

  // 4. If an active entity is identified
  if (context.resolvedEntity) {
    return generateSubEventAttributeAnswer(
      context.resolvedEntity,
      trimmed,
      context.isFollowUp
    );
  }

  // 5. UNGROUNDED / UNAVAILABLE TOPICS (Case B)
  // Check for questions asking for information not present in the official brochure
  if (
    q.includes("who won") ||
    q.includes("winner") ||
    q.includes("last year") ||
    q.includes("2025") ||
    q.includes("previous edition") ||
    q.includes("previous winner") ||
    q.includes("past winners") ||
    q.includes("which college won") ||
    q.includes("who came second") ||
    q.includes("how many people attended last year") ||
    q.includes("how many teams participated last year")
  ) {
    return {
      answer:
        "I don't have information about past editions or last year's winners in the official Equinox 2.0 program. You can contact the organizers for more information.",
      suggestions: ["What is Equinox 2.0?", "Dates & Venue", "Explore Sub-Events"],
      grounded: true,
    };
  }

  if (q.includes("judge") || q.includes("judges") || q.includes("jury")) {
    return {
      answer:
        "I don't have information about the judges in the official Equinox 2.0 program. Jury panels and evaluators are announced closer to the event days.",
      suggestions: ["Explore Sub-Events", "Dates & Venue", "Registration"],
      grounded: true,
    };
  }

  if (q.includes("chief guest") || q.includes("guest of honour") || q.includes("dignitary")) {
    return {
      answer:
        "I don't have information about the chief guest in the official Equinox 2.0 program. Dignitaries and keynote speakers will be announced on the official summit website.",
      suggestions: ["Spotlight Keynotes", "Dates & Venue", "Explore Sub-Events"],
      grounded: true,
    };
  }

  if (
    q.includes("total prize pool") ||
    q.includes("overall prize money") ||
    q.includes("how much money can i win") ||
    (q.includes("prize pool") && !context.resolvedEntity)
  ) {
    return {
      answer:
        "I don't have information about an overall summit prize pool in the official Equinox 2.0 program. Individual sub-events feature dedicated prizes such as seed funding and incubation (Pitch Deck), winner trophies and retaining sales profits (Hustle Mania), and champion purses and medals (IPL Auction).",
      suggestions: ["Pitch Deck prizes", "Hustle Mania prizes", "Explore Sub-Events"],
      links: [{ label: "Explore Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  if (q.includes("registration fee") || q.includes("cost to attend") || q.includes("ticket price")) {
    return {
      answer:
        "I don't have information about the exact registration fee in the official Equinox 2.0 program. Delegate pass registration and pricing will be announced soon on the official summit website.",
      suggestions: ["Explore Sub-Events", "Dates & Venue", "About CIE"],
      grounded: true,
    };
  }

  if (q.includes("wifi") || q.includes("wi fi") || q.includes("password")) {
    return {
      answer:
        "I don't have the WiFi password in the official Equinox 2.0 program. Campus network access details will be provided at the registration desk during check-in.",
      suggestions: ["Dates & Venue", "Explore Sub-Events", "Registration"],
      grounded: true,
    };
  }

  if (
    q.includes("food") ||
    q.includes("lunch") ||
    q.includes("accommodation") ||
    q.includes("stay") ||
    q.includes("hotel") ||
    q.includes("transport") ||
    q.includes("bus") ||
    q.includes("cab")
  ) {
    return {
      answer:
        "I don't have information about food, accommodation, or transport arrangements in the official Equinox 2.0 program. You can contact the organizers at cie@mlrinstitutions.ac.in for more information.",
      suggestions: ["Dates & Venue", "Explore Sub-Events", "Registration"],
      grounded: true,
    };
  }

  // 6. Summit Dates & Timing
  if (
    q.includes("when is equinox") ||
    q.includes("summit dates") ||
    q.includes("when is the summit") ||
    q.includes("dates") ||
    (q.includes("when") && !context.resolvedEntity)
  ) {
    return {
      answer: `**The Equinox 2.0** is confirmed for **${event.date}** (30th & 31st October 2026) at **MLRIT Hyderabad**.\n\n• **Day 1 (30 Oct)**: Crossroads, Startup Expo, Hustle Mania, Startup Poly, Spotlight sessions\n• **Day 2 (31 Oct)**: Brand Battles, IPL Auction, Internship Drive, E-Cell Meet, Pitch Deck Grand Finale`,
      suggestions: ["Where is the venue?", "Explore Sub-Events", "How to register?"],
      links: [{ label: "View Overview", url: "#top" }],
      grounded: true,
    };
  }

  // 7. Summit Venue & Location
  if (
    q.includes("where is equinox") ||
    q.includes("where is the summit") ||
    q.includes("venue") ||
    q.includes("location") ||
    q.includes("mlrit") ||
    q.includes("address")
  ) {
    return {
      answer: `The summit will be hosted at:\n\n**${event.venueFull}**\n\nOrganized by the **Centre for Innovation & Entrepreneurship (CIE), MLRIT**.`,
      suggestions: ["Dates & Schedule", "Explore Sub-Events", "Contact details"],
      links: [{ label: "Contact & Location", url: "#contact" }],
      grounded: true,
    };
  }

  // 8. Coordinators & Contact Info
  if (
    q.includes("coordinator") ||
    q.includes("coordinators") ||
    q.includes("contact") ||
    q.includes("phone") ||
    q.includes("email") ||
    q.includes("shyam") ||
    q.includes("mahima")
  ) {
    return {
      answer: OFFICIAL_CONTACTS_TEXT,
      suggestions: ["Where is the venue?", "Explore Sub-Events", "When is the summit?"],
      links: [{ label: "Contact Us Section", url: "#contact" }],
      grounded: true,
    };
  }

  // 9. Sub-events List
  if (
    q.includes("list all events") ||
    q.includes("list of events") ||
    q.includes("what are the 10 events") ||
    q.includes("all 10 sub events") ||
    q.includes("what are the sub events") ||
    q.includes("what are all the sub events") ||
    q.includes("what are all the sub-events") ||
    q.includes("all the sub events") ||
    q.includes("all sub events") ||
    q.includes("sub events") ||
    q.includes("sub-events") ||
    q.includes("subevents") ||
    q.includes("what events are there")
  ) {
    return {
      answer: `The Equinox 2.0 features **10 official sub-events** from the program:\n\n**Page 05:**\n1. **Spotlight**: Visionary keynotes from tech & startup leaders\n2. **Cross Roads**: Business case-study strategy challenge\n3. **Startup Expo**: Live product & venture exhibition\n4. **Brand Battles**: Rival brand defense debate\n5. **IPL Auction**: Simulated cricket bidding & squad valuation\n\n**Page 06:**\n6. **Hustle Mania**: On-campus product selling & negotiation\n7. **Internship Drive**: Direct recruitment with startups\n8. **Startup Poly**: Monopoly-inspired business board game\n9. **E-Cell Meet**: Inter-college entrepreneurship leaders conclave\n10. **Pitch Deck**: Live investor pitch for student ventures`,
      suggestions: ["Tell me about Hustle Mania", "What is Startup Poly?", "IPL Auction details"],
      links: [{ label: "Explore Sub-Events", url: "#events" }],
      grounded: true,
    };
  }

  // 10. Vision & Objectives
  if (q.includes("vision") || q.includes("mission") || q.includes("objective")) {
    return {
      answer: `**The Equinox 2.0 Vision**:\n\nWe envision creating an inclusive space where students, entrepreneurs, and investors come together to collaborate, learn, and shape impactful ideas. By fostering entrepreneurial thinking and encouraging practical problem-solving, we provide a platform for participants to showcase their ideas, experience real-world business scenarios, and build meaningful connections with industry leaders. Our event empowers emerging innovators and aspiring entrepreneurs to refine their concepts, gain visibility, and explore opportunities for growth, mentorship, and collaboration.`,
      suggestions: ["Explore Sub-Events", "Dates & Venue", "About CIE"],
      links: [{ label: "About Section", url: "#about" }],
      grounded: true,
    };
  }

  // 11. About CIE / Equinox
  if (q.includes("about equinox") || q.includes("what is equinox") || q.includes("who are we") || q.includes("about cie")) {
    return {
      answer: `**The Equinox 2.0** is organized by the Centre for Innovation and Entrepreneurship (CIE) at MLR Institute of Technology, Hyderabad. It envisions creating a vibrant and engaging environment where students tackle real-world challenges and ignite their entrepreneurial spirit through 10 premier sub-events: Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, and Pitch Deck.\n\n• **Tagline**: *"# WHERE PASSION MEETS PERSEVERANCE"*\n• **Dates**: **30 - 31 October 2026** at MLRIT Hyderabad.`,
      suggestions: ["Explore Sub-Events", "When is the summit?", "Venue details"],
      links: [{ label: "About Section", url: "#about" }],
      grounded: true,
    };
  }

  // Clean Case B Fallback for any unknown query:
  return {
    answer:
      "I don't have that information in the official Equinox 2.0 program. You can contact the organizers for more information.",
    suggestions: ["Explore Sub-Events", "Dates & Venue", "Registration details"],
    links: [{ label: "Browse Sub-Events", url: "#events" }],
    grounded: true,
  };
}
