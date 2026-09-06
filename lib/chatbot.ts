import {
  event,
  about,
  subEvents,
  studentCoordinators,
  contact,
  highlights,
} from "./content";

export interface ChatbotResponse {
  answer: string;
  suggestions?: string[];
  links?: { label: string; url: string }[];
}

export function getMockBrochureResponse(query: string): ChatbotResponse {
  const q = query.toLowerCase().trim();

  // 1. Sub-event queries
  if (q.includes("hustle") || q.includes("mania")) {
    const e = subEvents.find((s) => s.id === "hustle-mania")!;
    return {
      answer: `**Hustle Mania** (Page 06) gives students an opportunity to showcase their marketing and negotiation skills by selling products of their choice. Participants compete with others while developing their communication, persuasion, and business skills.`,
      suggestions: ["What is Startup Poly?", "Tell me about Pitch Deck", "Who are the coordinators?"],
      links: [{ label: "View Sub-Events", url: "#events" }],
    };
  }

  if (q.includes("startup poly") || q.includes("poly") || q.includes("monopoly")) {
    const e = subEvents.find((s) => s.id === "startup-poly")!;
    return {
      answer: `**Startup Poly** (Page 06) is a fast-paced business simulation game inspired by Monopoly! Participants build startups, compete in markets, manage finances, handle risks, and make strategic decisions based on real-world business situations.`,
      suggestions: ["How does Crossroads work?", "What is IPL Auction?", "Browse all 10 events"],
      links: [{ label: "Explore Events", url: "#events" }],
    };
  }

  if (q.includes("ipl") || q.includes("cricket") || q.includes("auction")) {
    const e = subEvents.find((s) => s.id === "ipl-auction")!;
    return {
      answer: `**IPL Auction** (Page 05) is a simulated cricket auction where participants take on the role of team owners. They bid for players, manage their budgets, and build their own teams through strategic decision-making.`,
      suggestions: ["What is Brand Battles?", "Tell me about Spotlight", "View Sub-Events"],
      links: [{ label: "Explore Sub-Events", url: "#events" }],
    };
  }

  if (q.includes("pitch") || q.includes("deck") || q.includes("investor")) {
    const e = subEvents.find((s) => s.id === "pitch-deck")!;
    return {
      answer: `**Pitch Deck** (Page 06) is a startup pitching platform where students present their ideas to investors, startup mentors, and industry experts. Participants receive valuable feedback and insights to help improve and develop their ideas.`,
      suggestions: ["What is Startup Expo?", "Who can attend?", "Contact coordinators"],
      links: [{ label: "View Pitch Deck Details", url: "#events" }],
    };
  }

  if (q.includes("spotlight") || q.includes("speaker") || q.includes("keynote")) {
    const e = subEvents.find((s) => s.id === "spotlight")!;
    return {
      answer: `**Spotlight** (Page 05) features presentations from industry experts on technology, entrepreneurship, and startups. It gives students valuable insights into emerging technologies, industry trends, and the future of entrepreneurship.`,
      suggestions: ["Tell me about Crossroads", "Internship Drive details", "When is Equinox?"],
      links: [{ label: "View Sub-Events", url: "#events" }],
    };
  }

  if (q.includes("crossroads") || q.includes("cross") || q.includes("case")) {
    const e = subEvents.find((s) => s.id === "crossroads")!;
    return {
      answer: `**Crossroads** (Page 05) is a business case-study competition where teams analyse real-world business challenges and develop practical strategies. It helps participants improve their problem-solving, decision-making, and business skills.`,
      suggestions: ["Tell me about Brand Battles", "Explore Sub-Events", "Contact details"],
      links: [{ label: "Sub-Events", url: "#events" }],
    };
  }

  if (q.includes("brand") || q.includes("battle") || q.includes("debate")) {
    const e = subEvents.find((s) => s.id === "brand-battles")!;
    return {
      answer: `**Brand Battles** (Page 05) is a competitive debate between teams representing rival brands from the same sector. Participants defend their brands using real-time examples, data, and case studies while challenging their opponents' strategies.`,
      suggestions: ["What is Hustle Mania?", "What is IPL Auction?", "View all events"],
      links: [{ label: "Sub-Events", url: "#events" }],
    };
  }

  if (q.includes("internship") || q.includes("job") || q.includes("career") || q.includes("hire")) {
    const e = subEvents.find((s) => s.id === "internship-drive")!;
    return {
      answer: `**Internship Drive** (Page 06) connects students with startups and companies offering internship opportunities. It helps students explore career options, gain practical experience, build professional connections, and develop useful skills.`,
      suggestions: ["Tell me about Startup Expo", "Who is organizing?", "View all events"],
      links: [{ label: "Sub-Events", url: "#events" }],
    };
  }

  if (q.includes("expo") || q.includes("stall") || q.includes("booth")) {
    const e = subEvents.find((s) => s.id === "startup-expo")!;
    return {
      answer: `**Startup Expo** (Page 05) provides a platform for startups to showcase their products, business ideas, and solutions to students. It helps startups gain visibility while giving students an opportunity to explore new ideas and businesses.`,
      suggestions: ["Tell me about Pitch Deck", "Internship Drive", "Contact CIE"],
      links: [{ label: "Sub-Events", url: "#events" }],
    };
  }

  if (q.includes("e-cell") || q.includes("ecell") || q.includes("meet") || q.includes("colleges")) {
    const e = subEvents.find((s) => s.id === "e-cell-meet")!;
    return {
      answer: `**E-Cell Meet** (Page 06) brings together E-Cells from different colleges to connect, share ideas, and exchange experiences. It provides opportunities for students to build relationships, collaborate, and explore partnerships across campuses.`,
      suggestions: ["Explore Sub-Events", "Contact organizers", "Summit Impact"],
      links: [{ label: "Sub-Events", url: "#events" }],
    };
  }

  // 2. Dates, Location & Venue
  if (q.includes("when") || q.includes("date") || q.includes("oct") || q.includes("timing")) {
    return {
      answer: `**The Equinox 2.0** is confirmed for **${event.date}** (30th & 31st October 2026) at **${event.venue}**.\n\nTagline: *"${event.tagline}"* (# WHERE PASSION MEETS PERSEVERANCE).`,
      suggestions: ["Where is the venue?", "List the 10 sub-events", "Contact info"],
      links: [{ label: "View Prospectus", url: "#top" }],
    };
  }

  if (q.includes("where") || q.includes("venue") || q.includes("location") || q.includes("mlrit") || q.includes("hyderabad")) {
    return {
      answer: `The summit will be hosted at:\n\n**${event.venueFull}**\n\nOrganized by the **Centre for Innovation & Entrepreneurship (CIE), MLRIT**.`,
      suggestions: ["How to reach?", "Who are the coordinators?", "List all sub-events"],
      links: [{ label: "Contact & Location", url: "#contact" }],
    };
  }

  // 3. Contacts and Organizers
  if (q.includes("contact") || q.includes("coordinator") || q.includes("phone") || q.includes("email") || q.includes("reach") || q.includes("shyam") || q.includes("mahima")) {
    const coords = studentCoordinators.map((c) => `• **${c.name}**: ${c.phone}`).join("\n");
    return {
      answer: `For doubts or queries regarding Equinox 2.0, you can contact the official Student Coordinators:\n\n${coords}\n\nOr drop a mail at: **${contact.email}**\nWebsite: **${contact.website}**`,
      suggestions: ["Where is the venue?", "Explore 10 Sub-Events", "Who Are We?"],
      links: [{ label: "Contact Us Section", url: "#contact" }],
    };
  }

  // 4. Sub-events general overview
  if (q.includes("event") || q.includes("sub-event") || q.includes("competition") || q.includes("list")) {
    return {
      answer: `The Equinox 2.0 features **10 official sub-events** from the brochure:\n\n**Page 05:**\n1. Spotlight\n2. Cross Roads\n3. Startup Expo\n4. Brand Battles\n5. IPL Auction\n\n**Page 06:**\n6. Hustle Mania\n7. Internship Drive\n8. Startup Poly\n9. E-Cell Meet\n10. Pitch Deck\n\nClick any event on the website to view rules and details!`,
      suggestions: ["Tell me about Hustle Mania", "What is Startup Poly?", "IPL Auction details"],
      links: [{ label: "Explore Sub-Events", url: "#events" }],
    };
  }

  // 5. About CIE / Equinox
  if (q.includes("about") || q.includes("cie") || q.includes("who are we") || q.includes("what is equinox")) {
    return {
      answer: `**${event.name} 2.0** is the flagship entrepreneurship summit of **MLR CIE** (Centre for Innovation & Entrepreneurship, MLRIT). Its mission is to bridge passionate student builders with persevering startup founders and investors under the motto: *"# WHERE PASSION MEETS PERSEVERANCE"*.`,
      suggestions: ["What are the 10 sub-events?", "When is the summit?", "Contact coordinators"],
      links: [{ label: "About Section", url: "#about" }],
    };
  }

  // Default fallback
  return {
    answer: `I am your **Equinox 2.0 Assistant**, grounded on the official prospectus brochure. I can help you with details on all **10 Sub-Events** (Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, Pitch Deck), dates (**30 - 31 OCT**), venue at **MLRIT Hyderabad**, and student coordinators.`,
    suggestions: ["List all 10 Sub-Events", "Tell me about Hustle Mania", "When and where?", "Student Coordinator Contacts"],
    links: [{ label: "Browse Sub-Events", url: "#events" }],
  };
}
