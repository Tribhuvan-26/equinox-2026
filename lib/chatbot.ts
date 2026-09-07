import {
  event,
  about,
<<<<<<< HEAD
  audience,
  speakers,
  speakerCount,
  agenda,
  faqs,
  tickets,
  hosts,
  contact,
  registration,
  events,
  board,
  sponsors,
  partners,
  communities,
} from "./content";

export interface ChatbotContextResult {
  context: string;
  links?: { label: string; url: string }[];
  suggestions?: string[];
}

export interface ChatbotDirectResponse {
  answer: string;
  links?: { label: string; url: string }[];
  suggestions?: string[];
}

// ---------------------------------------------------------------------------
// 1. Off-Topic Handling
// ---------------------------------------------------------------------------
const OFF_TOPIC_FALLBACKS = [
  "🌌 That's outside my Equinox universe! I'm here to help you explore Equinox 2026. Try asking about events, speakers, agenda, tickets or registration.",
  "🪐 My radar only tracks Equinox 2026! I can guide you through our flagship events, keynote speakers, session agenda, or summit passes.",
  "✨ Looks like that question drifted past our event horizon! I specialize in all things Equinox 2026—from the overnight Hackathon to speaker sessions and registration.",
  "🚀 I'm tuned specifically to Equinox 2026 at MLRIT! Ask me about event rules, passes, timings, or who's speaking on the main stage.",
];

const EQUINOX_TOPIC_WORDS = new Set([
  "equinox", "summit", "cie", "mlrit", "hyderabad", "march",
  "hackathon", "ideathon", "robo", "race", "sprint", "code", "coding", "design", "jam", "expo", "startup",
  "event", "events", "agenda", "schedule", "session", "sessions", "keynote", "panel", "panelist", "fireside",
  "speaker", "speakers", "speaking", "speech", "talk", "talks", "guest", "lineup",
  "ticket", "tickets", "pass", "passes", "price", "pricing", "fee", "fees", "cost", "free",
  "register", "registration", "registered", "book", "booking", "entry", "apply", "form",
  "venue", "location", "hall", "where", "when", "date", "dates", "timing", "timings", "time", "day",
  "rule", "rules", "team", "teams", "prize", "prizes", "pool", "award", "awards",
  "spoc", "contact", "email", "phone", "organizer", "organisers", "convenor", "board", "lead",
  "faq", "faqs", "question", "questions", "sponsor", "sponsors", "partner", "partners", "audience",
  "student", "founder", "developer", "designer", "investor", "dress", "stream", "online", "kit",
  "scale", "systems", "public", "campus", "table", "years", "future", "prototype", "build", "builder", "building", "demo", "expo", "stall"
]);

const TOPIC_STEMS = [
  "speak", "hack", "sched", "regist", "ticket", "pass", "event", "prize", "build", "attend", "organ", "system", "track"
];

const STRICT_OFF_TOPIC_PATTERNS = [
  /\b(weather|temperature|forecast|rain|climate)\b/i,
  /\b(recipe|cook|bake|ingredients|food recipe)\b/i,
  /\b(cricket|football|fifa|ipl|nba|world cup|score)\b/i,
  /\b(movie|cinema|actor|netflix|series|hollywood|bollywood)\b/i,
  /\b(write a python code|write code for leetcode|binary tree|bubble sort|sql query for)\b/i,
  /\b(joke|riddle|funny story|tell me a joke)\b/i,
  /\b(capital of|president of|prime minister of|who is trump|who is modi)\b/i,
  /\b(stock price|crypto|bitcoin|ethereum)\b/i,
  /\b(translate|french|spanish|german|hindi|telugu) (into|to|sentence)\b/i,
];

export function detectOffTopic(question: string): string | null {
  const q = question.toLowerCase().trim();

  // Pattern check for explicit off-topic questions
  for (const pattern of STRICT_OFF_TOPIC_PATTERNS) {
    if (pattern.test(q)) {
      const idx = Math.floor(Math.random() * OFF_TOPIC_FALLBACKS.length);
      return OFF_TOPIC_FALLBACKS[idx];
    }
  }

  // Check if query contains any speaker name, event name, or session title from content
  const matchesContentEntity =
    events.some((e) => q.includes(e.slug) || q.includes(e.name.toLowerCase())) ||
    speakers.some((s) => q.includes(s.name.toLowerCase())) ||
    agenda.some((a) =>
      a.sessions.some((s) => q.includes(s.title.toLowerCase()))
    );

  if (matchesContentEntity) {
    return null; // Clearly on-topic
  }

  // Word token analysis
  const words = q.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  if (words.length > 0) {
    const hasOnTopicWord = words.some(
      (w) => EQUINOX_TOPIC_WORDS.has(w) || TOPIC_STEMS.some((stem) => w.startsWith(stem))
    );
    if (!hasOnTopicWord && words.length >= 3) {
      const idx = Math.floor(Math.random() * OFF_TOPIC_FALLBACKS.length);
      return OFF_TOPIC_FALLBACKS[idx];
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// 2. Ambiguity Detection
// ---------------------------------------------------------------------------
export function detectAmbiguity(question: string): ChatbotDirectResponse | null {
  const q = question.toLowerCase().trim().replace(/[?!.,]+$/, "");

  // Ambiguous fee / cost inquiry
  const isFeeInquiry = /\b(fee|cost|price|pricing|how much|charges|entry fee|registration fee)\b/i.test(q);
  const mentionsSpecificEvent = events.some(e => q.includes(e.slug) || q.includes(e.name.toLowerCase()));
  const mentionsSpecificPass = tickets.some(t => q.includes(t.name.toLowerCase()));

  if (isFeeInquiry && !mentionsSpecificEvent && !mentionsSpecificPass) {
    return {
      answer: "Are you asking about **Summit Passes** (₹499 to ₹1,999) or entry fees for a **specific event** like the Hackathon or Robo Race? Let me know which one you'd like to check!",
      links: [
        { label: "View Passes", url: "/register" },
        { label: "All Events", url: "/events" },
      ],
      suggestions: [
        "Summit Pass prices",
        "Hackathon fee",
        "Code Sprint fee",
        "Ideathon fee"
      ]
    };
  }

  // Ambiguous registration inquiry
  const isGeneralRegisterInquiry = /^(how (can i|to|do i) register|where (do i|to) register|registration process)$/i.test(q);
  if (isGeneralRegisterInquiry) {
    return {
      answer: "Summit passes and individual events have separate registration paths. Are you looking to buy a summit pass or register a team for a specific competition?",
      links: [
        { label: "Register for Passes", url: "/register" },
        { label: "Browse Events", url: "/events" },
      ],
      suggestions: [
        "How do Summit Passes work?",
        "How to register for Hackathon?",
        "Who is the registration SPOC?"
      ]
    };
  }

  // Ambiguous rules inquiry
  const isGeneralRules = /^(what are the rules|rules|give me rules)$/i.test(q);
  if (isGeneralRules) {
    return {
      answer: "Each of our 6 competitions has its own specific rulebook. Which event's rules would you like to see?",
      links: [
        { label: "All Events", url: "/events" },
      ],
      suggestions: [
        "Hackathon rules",
        "Robo Race rules",
        "Code Sprint rules",
        "Design Jam rules"
      ]
    };
  }

  // Ambiguous schedule/timing inquiry
  const isGeneralTiming = /^(what is the (schedule|timing|agenda)|when does it start|timing)$/i.test(q);
  if (isGeneralTiming) {
    return {
      answer: `Equinox 2026 takes place across three days (${event.date}) at ${event.venue}. Would you like the agenda for Day 1, Day 2, Day 3, or a specific event's timing?`,
      links: [
        { label: "Full Agenda", url: "/#agenda" },
      ],
      suggestions: [
        "Day 1 Agenda",
        "Day 2 Agenda",
        "Day 3 Agenda"
      ]
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// 3. Fast-Path Direct Answers (High-confidence instant answers)
// ---------------------------------------------------------------------------
export function getFastAnswer(question: string): ChatbotDirectResponse | null {
  const q = question.toLowerCase().trim().replace(/[?!.,]+$/, "");

  // Summit Dates & Venue
  if (/^(when is equinox|what (are the )?dates?( of equinox)?|event dates?)$/i.test(q)) {
    return {
      answer: `${event.name} ${event.year} will take place on **${event.date}** at **${event.venue}**.`,
      links: [{ label: "View Home", url: "/" }],
      suggestions: ["What's on the agenda?", "Ticket prices", "Explore events"]
    };
  }

  if (/^(where is equinox|where is the venue|venue details|what is the location)$/i.test(q)) {
    return {
      answer: `The summit is hosted at **${event.venue}** by the ${event.host}.`,
      links: [{ label: "Venue Info", url: "/#venue" }, { label: "Contact Us", url: "/contact" }],
      suggestions: ["Event dates", "Explore events", "Ticket prices"]
    };
  }

  // Organizers / Host
  if (/^(who is organizing|who is the host|who conducts equinox)$/i.test(q)) {
    return {
      answer: `Equinox is organized by the **${hosts.heading}** (${event.host}), bringing together student innovators, founders, and engineers.`,
      links: [{ label: "Contact Board", url: "/contact" }],
      suggestions: ["Meet the speakers", "Explore events"]
    };
  }

  // Contact / Email
  if (/^(what is the (contact|email)|how to contact|contact info)$/i.test(q)) {
    return {
      answer: `You can email the organizing team at **${contact.email}** or call convenor ${board[0].name} at ${board[0].phone}.`,
      links: [{ label: "Contact Page", url: "/contact" }],
      suggestions: ["Explore events", "How do I register?"]
    };
  }

  // Ticket Passes Summary
  if (/^(ticket prices?|how much are passes|summit pass prices?|show me tickets)$/i.test(q)) {
    return {
      answer: `Summit passes are available in three tiers: **General Admission** (${tickets[0].price}), **VIP Pass** (${tickets[1].price}), and **Team Pass** for 5 (${tickets[2].price}). You can grab passes on the registration page.`,
      links: [{ label: "Register for Passes", url: "/register" }],
      suggestions: ["How do I register?", "Explore events", "What's on the agenda?"]
    };
  }

  // All events summary
  if (/^(explore events|list all events|what events are there|all events)$/i.test(q)) {
    return {
      answer: `Equinox 2026 features **6 events**: Hack the Equinox (24hr hackathon), Ideathon, Robo Race, Code Sprint, Design Jam, and Startup Expo. Let me know which one you'd like to explore!`,
      links: [{ label: "View All Events", url: "/events" }],
      suggestions: ["Hackathon details", "Robo Race fee", "Code Sprint rules", "Ticket prices"]
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// 4. Synonym Expansion & Chunk Retrieval
// ---------------------------------------------------------------------------
const SYNONYMS: Record<string, string[]> = {
  fee: ["cost", "price", "pricing", "charge", "amount", "rupees", "inr", "entry", "pay", "rate"],
  prize: ["reward", "winnings", "cash", "award", "pool", "money"],
  event: ["competition", "track", "contest", "subevent", "challenge"],
  hackathon: ["hack the equinox", "hack", "coding sprint", "24 hours"],
  ideathon: ["pitch", "pitching", "idea"],
  roborace: ["robo race", "robot", "track", "obstacles"],
  codesprint: ["code sprint", "competitive programming", "dsa", "problems"],
  designjam: ["design jam", "ui", "ux", "figma", "interface"],
  startupexpo: ["startup expo", "expo", "stall", "booth", "showcase"],
  speaker: ["speakers", "talk", "keynote", "panel", "panelist", "guest", "lineup"],
  agenda: ["schedule", "timing", "timings", "session", "sessions", "program", "day 1", "day 2", "day 3"],
  pass: ["ticket", "tickets", "admission", "early bird", "vip", "passes"],
  register: ["registration", "apply", "signup", "enroll", "book"],
  venue: ["location", "place", "where", "address", "mlrit", "hyderabad", "room", "hall"],
  rules: ["rule", "guidelines", "regulations", "criteria", "requirements", "eligibility"],
  spoc: ["coordinator", "contact person", "lead", "phone", "email"],
};

function expandQuery(query: string): Set<string> {
  const words = query.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  const expanded = new Set(words);

  for (const word of words) {
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (word === key || syns.includes(word)) {
        expanded.add(key);
        syns.forEach(s => expanded.add(s));
      }
    }
  }

  return expanded;
}

interface ContentChunk {
  id: string;
  category: "event" | "agenda" | "speaker" | "ticket" | "faq" | "general" | "registration" | "contact";
  title: string;
  text: string;
  link?: { label: string; url: string };
}

function buildAllChunks(): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  // 1. Events
  for (const e of events) {
    chunks.push({
      id: `event-${e.slug}`,
      category: "event",
      title: e.name,
      text: `EVENT: ${e.name} (${e.category})
Tagline: ${e.tagline}
Slug: ${e.slug}
Day & Timing: ${e.day} (${e.time})
Venue: ${e.venue}
Team Size: ${e.teamSize}
Registration Fee: ${e.fee}
Prize Pool: ${e.prize}
About: ${e.about.join(" ")}
Rules: ${e.rules.join(" | ")}
Student Point of Contact (SPOC): ${e.spoc.name} (Email: ${e.spoc.email}, Phone: ${e.spoc.phone})
Page Link: /events/${e.slug}`,
      link: { label: e.name, url: `/events/${e.slug}` }
    });
  }

  // 2. Agenda
  for (const day of agenda) {
    const sessionDetails = day.sessions.map(s => {
      let extra = "";
      if (s.speaker) extra = ` (Speaker: ${s.speaker.name}, ${s.speaker.role})`;
      if (s.panel) extra = ` (Panelists: ${s.panel.map(p => `${p.name} - ${p.role}`).join(", ")})`;
      return `• [${s.time}] ${s.title}${extra}: ${s.body}`;
    }).join("\n");

    chunks.push({
      id: `agenda-${day.tag.toLowerCase()}`,
      category: "agenda",
      title: day.title,
      text: `AGENDA (${day.tag}): ${day.title}
Date/Event: Equinox 2026
Sessions:
${sessionDetails}`,
      link: { label: "Agenda", url: "/#agenda" }
    });
  }

  // 3. Speakers
  const speakerList = speakers.map(s => `• ${s.name} (${s.role})`).join("\n");
  chunks.push({
    id: "speakers-list",
    category: "speaker",
    title: "Speakers Lineup",
    text: `SPEAKERS LINEUP (${speakerCount}):
${speakerList}
Keynote and panel topics cover Building in Public, Systems That Scale, Campus to Cap Table, and The Next Ten Years.`,
    link: { label: "Speakers", url: "/#speakers" }
  });

  // 4. Tickets / Passes
  for (const t of tickets) {
    chunks.push({
      id: `ticket-${t.name.toLowerCase().replace(/\s+/g, "-")}`,
      category: "ticket",
      title: `${t.name} Pass`,
      text: `TICKET PASS: ${t.name}
Badge: ${t.badge}
Price: ${t.price} (${t.unit})
Description: ${t.description}
Perks: ${t.perks.join(", ")}
Registration URL: /register`,
      link: { label: "Register", url: "/register" }
    });
  }

  // 5. Registration
  chunks.push({
    id: "registration-flow",
    category: "registration",
    title: "Registration Process",
    text: `REGISTRATION PROCESS:
${registration.heading}
Summary: ${registration.body}
Steps:
${registration.steps.map((st, i) => `Step ${i + 1} (${st.title}): ${st.body}`).join("\n")}
Registration Page: /register`,
    link: { label: "Registration", url: "/register" }
  });

  // 6. FAQs
  for (const [idx, f] of faqs.entries()) {
    chunks.push({
      id: `faq-${idx}`,
      category: "faq",
      title: `FAQ: ${f.q}`,
      text: `FAQ:
Question: ${f.q}
Answer: ${f.a}`,
      link: { label: "FAQs", url: "/#about" }
    });
  }

  // 7. General Summit Info, Venue, Hosts, and Board Contacts
  chunks.push({
    id: "general-summit-info",
    category: "general",
    title: "Equinox 2026 Overview",
    text: `SUMMIT OVERVIEW:
Name: ${event.name} ${event.year}
Tagline: ${event.tagline} for every Builder, Founder, Developer, Designer
Dates: ${event.date}
Venue: ${event.venue}
Host: ${event.host}
About: ${about.heading} - ${about.body.join(" ")}
Organisers: ${hosts.heading} - ${hosts.body}
Target Audience:
${audience.groups.map(g => `• ${g.name}: ${g.what}`).join("\n")}
Sponsors: ${sponsors.join(", ")}
Partners: ${partners.join(", ")}
Communities: ${communities.join(", ")}`,
    link: { label: "Home", url: "/" }
  });

  chunks.push({
    id: "contact-board",
    category: "contact",
    title: "Organising Board Contacts",
    text: `CONTACT INFORMATION:
General Inquiries Email: ${contact.email}
Venue: ${event.venue}
Organising Board:
${board.map(b => `• ${b.name}, ${b.role} | Email: ${b.email} | Phone: ${b.phone}`).join("\n")}
Contact Page: /contact`,
    link: { label: "Contact Us", url: "/contact" }
  });

  return chunks;
}

const ALL_CHUNKS = buildAllChunks();

export function searchChatbotContext(question: string): ChatbotContextResult {
  const q = question.toLowerCase().trim();
  const expandedTokens = expandQuery(q);

  const scored: { score: number; chunk: ContentChunk }[] = [];

  for (const chunk of ALL_CHUNKS) {
    const chunkLower = chunk.text.toLowerCase();
    let score = 0;

    // Exact query matching in chunk
    if (chunkLower.includes(q)) {
      score += 8;
    }

    // Title match
    if (chunk.title.toLowerCase().includes(q)) {
      score += 10;
    }

    // Token scoring
    for (const token of expandedTokens) {
      if (chunkLower.includes(token)) {
        score += 1.5;
      }
      if (chunk.title.toLowerCase().includes(token)) {
        score += 3;
      }
    }

    if (score > 0) {
      scored.push({ score, chunk });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const topChunks = scored.slice(0, 2).map(s => s.chunk);

  if (topChunks.length === 0) {
    // If no specific match, include general info
    const generalChunk = ALL_CHUNKS.find(c => c.id === "general-summit-info")!;
    topChunks.push(generalChunk);
  }

  const context = topChunks.map(c => c.text).join("\n\n---\n\n");
  const links: { label: string; url: string }[] = [];
  const seenUrls = new Set<string>();

  for (const chunk of topChunks) {
    if (chunk.link && !seenUrls.has(chunk.link.url)) {
      links.push(chunk.link);
      seenUrls.add(chunk.link.url);
    }
  }

  return { context, links };
=======
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

/**
 * @deprecated Replaced by the RAG pipeline in `lib/rag/generate.ts`.
 * Retained as an offline fallback when API keys or network are unavailable.
 */
export function getMockEquinoxResponse(query: string): ChatbotResponse {
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
      links: [{ label: "View Overview", url: "#top" }],
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
      answer: `The Equinox 2.0 features **10 official sub-events** from the program:\n\n**Page 05:**\n1. Spotlight\n2. Cross Roads\n3. Startup Expo\n4. Brand Battles\n5. IPL Auction\n\n**Page 06:**\n6. Hustle Mania\n7. Internship Drive\n8. Startup Poly\n9. E-Cell Meet\n10. Pitch Deck\n\nClick any event on the website to view rules and details!`,
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
    answer: `I am your **Equinox 2.0 Assistant**, grounded on the official event program. I can help you with details on all **10 Sub-Events** (Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, Pitch Deck), dates (**30 - 31 OCT**), venue at **MLRIT Hyderabad**, and student coordinators.`,
    suggestions: ["List all 10 Sub-Events", "Tell me about Hustle Mania", "When and where?", "Student Coordinator Contacts"],
    links: [{ label: "Browse Sub-Events", url: "#events" }],
  };
>>>>>>> ChatBot
}
