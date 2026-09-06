// chatbot/data/responses.ts
// Offline mock intelligence engine grounded exclusively in the Equinox brochure

import { BROCHURE_EVENTS, BrochureSubEvent, EQUINOX_INFO, OFFICIAL_COORDINATORS } from "./events";

export interface BotReply {
  text: string;
  eventCard?: BrochureSubEvent;
  suggestions: string[];
}

export function getBotResponse(userQuery: string): BotReply {
  const q = userQuery.toLowerCase().trim();

  // 1. Hustle Mania
  if (q.includes("hustle") || q.includes("mania") || q.includes("selling")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "hustle-mania")!;
    return {
      text: `Here is **Hustle Mania** (Page 06 of the brochure). It tests live on-campus selling, negotiation, and guerrilla marketing!`,
      eventCard: event,
      suggestions: ["What is Startup Poly?", "Tell me about IPL Auction", "Who are the coordinators?"],
    };
  }

  // 2. Startup Poly
  if (q.includes("poly") || q.includes("monopoly") || q.includes("board")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "startup-poly")!;
    return {
      text: `**Startup Poly** (Page 06) is our Monopoly-inspired business simulation game where you navigate real-world market situations!`,
      eventCard: event,
      suggestions: ["Tell me about Crossroads", "Explore Pitch Deck", "When is the summit?"],
    };
  }

  // 3. IPL Auction
  if (q.includes("ipl") || q.includes("auction") || q.includes("cricket") || q.includes("bidding")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "ipl-auction")!;
    return {
      text: `**IPL Auction** (Page 05) puts you in the hot seat as team franchise owners bidding with a real-time virtual purse!`,
      eventCard: event,
      suggestions: ["What is Brand Battles?", "Spotlight speaker details", "Coordinator contacts"],
    };
  }

  // 4. Pitch Deck
  if (q.includes("pitch") || q.includes("deck") || q.includes("investor") || q.includes("funding")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "pitch-deck")!;
    return {
      text: `**Pitch Deck** (Page 06) is the premier startup pitching platform before angels, VCs, and CIE mentors.`,
      eventCard: event,
      suggestions: ["Startup Expo details", "Internship Drive", "Browse all events"],
    };
  }

  // 5. Spotlight
  if (q.includes("spotlight") || q.includes("keynote") || q.includes("speaker") || q.includes("talk")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "spotlight")!;
    return {
      text: `**Spotlight** (Page 05) features high-impact presentations by industry pioneers on emerging technologies and the future of startups.`,
      eventCard: event,
      suggestions: ["Crossroads details", "Brand Battles", "Dates & Venue"],
    };
  }

  // 6. Crossroads
  if (q.includes("crossroad") || q.includes("cross roads") || q.includes("case study") || q.includes("case")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "crossroads")!;
    return {
      text: `**Cross Roads** (Page 05) is an intensive business case-study challenge where teams formulate and defend operational strategies.`,
      eventCard: event,
      suggestions: ["What is Brand Battles?", "Tell me about Hustle Mania", "Who can attend?"],
    };
  }

  // 7. Brand Battles
  if (q.includes("brand") || q.includes("battle") || q.includes("debate") || q.includes("rival")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "brand-battles")!;
    return {
      text: `**Brand Battles** (Page 05) is a head-to-head competitive debate defending rival industry leaders using real-time data!`,
      eventCard: event,
      suggestions: ["IPL Auction details", "Startup Poly", "Explore all 10 events"],
    };
  }

  // 8. Internship Drive
  if (q.includes("internship") || q.includes("job") || q.includes("career") || q.includes("hire") || q.includes("drive")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "internship-drive")!;
    return {
      text: `**Internship Drive** (Page 06) bridges students with fast-growing startups for on-the-spot interviews and roles.`,
      eventCard: event,
      suggestions: ["Startup Expo", "Pitch Deck", "Student coordinators"],
    };
  }

  // 9. Startup Expo
  if (q.includes("expo") || q.includes("booth") || q.includes("stall") || q.includes("showcase")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "startup-expo")!;
    return {
      text: `**Startup Expo** (Page 05) offers live exhibition booths for startups to demo products and gather user validation across campus.`,
      eventCard: event,
      suggestions: ["Pitch Deck", "E-Cell Meet", "Summit dates"],
    };
  }

  // 10. E-Cell Meet
  if (q.includes("e-cell") || q.includes("ecell") || q.includes("meet") || q.includes("conclave")) {
    const event = BROCHURE_EVENTS.find((e) => e.id === "e-cell-meet")!;
    return {
      text: `**E-Cell Meet** (Page 06) brings together student leaders from college E-Cells across India to forge partnerships and exchange playbooks.`,
      eventCard: event,
      suggestions: ["Who Are We?", "Contact details", "List 10 sub-events"],
    };
  }

  // Dates & Venue
  if (q.includes("when") || q.includes("date") || q.includes("oct") || q.includes("timing")) {
    return {
      text: `**The Equinox 2.0** will take place on **${EQUINOX_INFO.dates}** at **${EQUINOX_INFO.venue}**.\n\nTagline: *${EQUINOX_INFO.hashtag}*`,
      suggestions: ["Where is MLRIT located?", "List all 10 sub-events", "Coordinator phones"],
    };
  }

  if (q.includes("where") || q.includes("venue") || q.includes("location") || q.includes("address") || q.includes("mlrit")) {
    return {
      text: `**Summit Venue:**\n${EQUINOX_INFO.address}\n\nOrganized by the **${EQUINOX_INFO.host}**.`,
      suggestions: ["When is it?", "Who can participate?", "Coordinator contacts"],
    };
  }

  // Coordinators & Contact
  if (q.includes("contact") || q.includes("phone") || q.includes("coordinator") || q.includes("email") || q.includes("shyam") || q.includes("mahima")) {
    const list = OFFICIAL_COORDINATORS.map((c) => `• **${c.name}**: ${c.phone}`).join("\n");
    return {
      text: `**Official Student Coordinators:**\n${list}\n\n**Official Email:** ${EQUINOX_INFO.email}\n**Website:** ${EQUINOX_INFO.website}`,
      suggestions: ["List all 10 sub-events", "When is Equinox?", "Tell me about Hustle Mania"],
    };
  }

  // General events query
  if (q.includes("event") || q.includes("sub-event") || q.includes("competition") || q.includes("all")) {
    return {
      text: `The Equinox 2.0 features **10 official sub-events** from the brochure:\n\n**Page 05:**\n1. Spotlight\n2. Cross Roads\n3. Startup Expo\n4. Brand Battles\n5. IPL Auction\n\n**Page 06:**\n6. Hustle Mania\n7. Internship Drive\n8. Startup Poly\n9. E-Cell Meet\n10. Pitch Deck\n\nTap on any event below to preview its card and animation!`,
      suggestions: ["Hustle Mania", "Startup Poly", "IPL Auction", "Brand Battles", "Pitch Deck"],
    };
  }

  // Default welcome / fallback
  return {
    text: `I am your **Equinox AI Assistant**, grounded directly in the official brochure.\n\nAsk me about any of the **10 sub-events**, dates (**30 - 31 OCT**), MLRIT venue, or coordinators!`,
    suggestions: [
      "Tell me about Hustle Mania",
      "What is Startup Poly?",
      "How does IPL Auction work?",
      "Summit dates & venue",
      "Coordinator contacts",
    ],
  };
}
