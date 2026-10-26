// chatbot/data/events.ts
// Official source of truth for the 12 Equinox 2026 sub-events (10 from the program + 2 evening shows)

export interface EventCoordinator {
  name: string;
  phone: string;
  phoneRaw: string;
}

export interface EventSPOC {
  name: string;
  phone: string;
  phoneRaw?: string;
  email?: string;
}

export interface SubEventInfo {
  id: string;
  slug: string;
  name: string;
  pageNumber: "05" | "06" | "07";
  category: string;
  tagline: string;
  description: string;
  skills: string[];
  format: string;
  timing: string;
  venueRoom: string;
  eligibility: string;
  registrationStatus: "Register Now";
  animationType:
    | "spotlight"
    | "crossroads"
    | "startup-expo"
    | "brand-battles"
    | "ipl-auction"
    | "hustle-mania"
    | "internship-drive"
    | "startup-poly"
    | "e-cell-meet"
    | "pitch-deck"
    | "standup-comedy"
    | "musical-night";
  badgeAccent: string;
  prize?: string;
  spocs?: EventSPOC[];
}

export const OVERALL_EQUINOX_COORDINATORS = {
  primary: [
    { name: "Ghanashyam", phone: "+91 93900 06806", phoneRaw: "+919390006806" },
    { name: "Jaikar", phone: "+91 90324 10189", phoneRaw: "+919032410189" },
  ],
  secondary: [
    { name: "Sanjana", phone: "+91 82084 99746", phoneRaw: "+918208499746" },
    { name: "Adithya Ganesh", phone: "+91 91822 40970", phoneRaw: "+919182240970" },
  ],
};

export const CHATBOT_CONTACTS: EventSPOC[] = [
  { name: "Ghanashyam", phone: "+91 93900 06806", phoneRaw: "+919390006806" },
  { name: "Jaikar", phone: "+91 90324 10189", phoneRaw: "+919032410189" },
  { name: "Bhavana", phone: "+91 99895 32925", phoneRaw: "+919989532925" },
];

export const OFFICIAL_COORDINATORS: EventCoordinator[] = [
  { name: "Ghanashyam", phone: "+91 93900 06806", phoneRaw: "+919390006806" },
  { name: "Jaikar", phone: "+91 90324 10189", phoneRaw: "+919032410189" },
];

export const OVERALL_COORDINATORS: EventSPOC[] = [
  ...OVERALL_EQUINOX_COORDINATORS.primary,
  ...OVERALL_EQUINOX_COORDINATORS.secondary,
];

export const EVENT_SPOCS: Record<string, EventSPOC[]> = {
  "spotlight": [
    { name: "Rithish Kumar", phone: "+91 93987 53113", phoneRaw: "+919398753113" },
    { name: "Yashwanth Abhishek", phone: "+91 96520 97857", phoneRaw: "+919652097857" },
  ],
  "crossroads": [
    { name: "Indu", phone: "+91 89197 51488", phoneRaw: "+918919751488" },
    { name: "Sadwika", phone: "+91 93477 15741", phoneRaw: "+919347715741" },
  ],
  "startup-expo": [
    { name: "Nikitha", phone: "+91 85002 07731", phoneRaw: "+918500207731" },
    { name: "Adithya Jadhav", phone: "+91 72869 05928", phoneRaw: "+917286905928" },
  ],
  "brand-battles": [
    { name: "Pranav Chandra", phone: "+91 95811 70601", phoneRaw: "+919581170601" },
    { name: "Hansika Jella", phone: "+91 83099 75984", phoneRaw: "+918309975984" },
  ],
  "ipl-auction": [
    { name: "Raja Vivek", phone: "+91 89857 11276", phoneRaw: "+918985711276" },
    { name: "Bhruhathi", phone: "+91 62812 77577", phoneRaw: "+916281277577" },
    { name: "Anamika Kumari", phone: "+91 86867 35562", phoneRaw: "+918686735562" },
  ],
  "hustle-mania": [
    { name: "Sai Vashist", phone: "+91 95156 40740", phoneRaw: "+919515640740" },
    { name: "Rithwik", phone: "+91 81214 51565", phoneRaw: "+918121451565" },
  ],
  "internship-drive": [
    { name: "Adithya Ganesh", phone: "+91 91822 40970", phoneRaw: "+919182240970" },
    { name: "Shiva", phone: "+91 93477 38868", phoneRaw: "+919347738868" },
  ],
  "startup-poly": [
    { name: "Tribhuvan", phone: "+91 73306 72121", phoneRaw: "+917330672121" },
    { name: "Abhinav Sai", phone: "+91 91336 94540", phoneRaw: "+919133694540" },
    { name: "Farhana", phone: "+91 83280 07810", phoneRaw: "+918328007810" },
  ],
  "e-cell-meet": [
    { name: "Sanjana", phone: "+91 82084 99746", phoneRaw: "+918208499746" },
    { name: "Adithya Ganesh", phone: "+91 91822 40970", phoneRaw: "+919182240970" },
  ],
  "pitch-deck": [
    { name: "Anuj Lomte", phone: "+91 93901 20510", phoneRaw: "+919390120510" },
  ],
  "standup-comedy": OFFICIAL_COORDINATORS,
  "musical-night": OFFICIAL_COORDINATORS,
};

export function getEventSPOCs(eventIdentifier: string): EventSPOC[] {
  if (!eventIdentifier) return [];
  const normalized = eventIdentifier
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

  const slugMap: Record<string, string> = {
    spotlight: "spotlight",
    crossroads: "crossroads",
    crossroad: "crossroads",
    "cross-roads": "crossroads",
    startupexpo: "startup-expo",
    expo: "startup-expo",
    brandbattles: "brand-battles",
    brandbattle: "brand-battles",
    iplauction: "ipl-auction",
    ipl: "ipl-auction",
    auction: "ipl-auction",
    hustlemania: "hustle-mania",
    hustle: "hustle-mania",
    internshipdrive: "internship-drive",
    internship: "internship-drive",
    startuppoly: "startup-poly",
    poly: "startup-poly",
    ecellmeet: "e-cell-meet",
    ecell: "e-cell-meet",
    pitchdeck: "pitch-deck",
    pitch: "pitch-deck",
    standupcomedy: "standup-comedy",
    standup: "standup-comedy",
    comedy: "standup-comedy",
    musicalnight: "musical-night",
    musical: "musical-night",
    band: "musical-night",
    music: "musical-night",
  };

  const targetSlug = slugMap[normalized] || eventIdentifier.toLowerCase().trim().replace(/\s+/g, "-");
  return EVENT_SPOCS[targetSlug] || [];
}

export const EQUINOX_SUB_EVENTS: SubEventInfo[] = [
  // Page 05 Sub-Events
  {
    id: "spotlight",
    slug: "spotlight",
    name: "Spotlight",
    pageNumber: "05",
    category: "Keynote & Insights",
    tagline: "Industry Experts on Tech, Startups & Emerging Trends",
    description:
      "Spotlight is an interactive session that brings students closer to entrepreneurs, industry professionals, and thought leaders. The event creates a platform for meaningful conversations about business, innovation, technology, leadership, and professional growth. Participants get the opportunity to hear about real experiences, understand the challenges faced by industry professionals, and explore how ideas develop into practical ventures. Through engaging discussions and personal insights, the session encourages curiosity and provides a broader understanding of the entrepreneurial and professional world. Whether you're interested in entrepreneurship, career development, or emerging industry trends, Spotlight offers an opportunity to learn from experienced individuals and gain perspectives that extend beyond the classroom.",
    skills: ["Tech Trends", "Industry Foresight", "Startup Insights", "Q&A Engagement"],
    format: "Keynote talks by proven tech leaders followed by audience interactive sessions",
    timing: "30 - 31 Oct (Sessions across both days)",
    venueRoom: "Main Stage Auditorium, MLRIT",
    eligibility: "Open to all summit delegate pass holders",
    registrationStatus: "Register Now",
    animationType: "spotlight",
    badgeAccent: "#3b82f6",
    prize: "Exclusive mentor connections",
    spocs: EVENT_SPOCS["spotlight"],
  },
  {
    id: "crossroads",
    slug: "crossroads",
    name: "Cross Roads",
    pageNumber: "05",
    category: "Case Competition",
    tagline: "Business Case-Study Strategy & Practical Solutions",
    description:
      "Crossroads is a business case-study competition that places participants in real-world business situations. Teams step into the roles of decision-makers and work together to understand challenges, identify opportunities, and develop practical strategies. Participants may take on roles such as CEO, CTO, Marketing Manager, or Finance Head, allowing them to examine a business problem from different perspectives. Each team must analyse the given situation, evaluate possible approaches, and prepare a solution that addresses the central challenge. The competition concludes with teams presenting their strategies and defending their decisions. Through this experience, participants explore the complexities of business management, teamwork, and strategic thinking in a competitive environment.",
    skills: ["Case Breakdown", "Strategic Problem-Solving", "Risk Evaluation", "Business Acumen"],
    format: "Real-world dilemma dossier assigned to teams; live jury pitch & strategy defense",
    timing: "30 Oct (10:00 AM - 04:00 PM)",
    venueRoom: "CIE Seminar Hall B",
    eligibility: "Teams of 2–4 students from any college or department",
    registrationStatus: "Register Now",
    animationType: "crossroads",
    badgeAccent: "#10b981",
    prize: "Exciting awards & certificates",
    spocs: EVENT_SPOCS["crossroads"],
  },
  {
    id: "startup-expo",
    slug: "startup-expo",
    name: "Startup Expo",
    pageNumber: "05",
    category: "Product Exhibition",
    tagline: "Showcase Solutions, Products & Innovative Ideas",
    description:
      "Startup Expo provides a platform for startups and emerging ventures to present their products, services, and innovative ideas to a wider audience. The event allows participants to interact directly with founders, understand the problems their startups are addressing, and learn how different businesses develop solutions for their customers. It creates an environment where innovation can be explored through conversations and demonstrations. For startups, the expo offers an opportunity to increase visibility, receive audience feedback, and connect with students and members of the entrepreneurial ecosystem. For visitors, it offers a closer look at the ideas and businesses being developed around them.",
    skills: ["Product Pitching", "Live Demonstrations", "Customer Feedback", "Networking"],
    format: "Dedicated exhibition stalls for prototypes, hardware demos, and software products",
    timing: "30 - 31 Oct (Full-Day Expo Pavilion)",
    venueRoom: "Central Innovation Pavilion, MLRIT",
    eligibility: "Student & early-stage startup ventures",
    registrationStatus: "Register Now",
    animationType: "startup-expo",
    badgeAccent: "#f59e0b",
    prize: "Investor visibility & user signups",
    spocs: EVENT_SPOCS["startup-expo"],
  },
  {
    id: "brand-battles",
    slug: "brand-battles",
    name: "Brand Battles",
    pageNumber: "05",
    category: "Competitive Debate",
    tagline: "Rival Brands Defense & Strategy Clash",
    description:
      "Brand Battles is a competitive debate where participants represent rival brands from the same industry. Teams must defend their chosen brand by using research, relevant data, real-world examples, and well-structured arguments. The event encourages participants to examine how brands compete, communicate their value, attract customers, and establish their position in the market. Teams must understand their own brand as well as the strategies of their competitors. As the debate progresses, participants present their viewpoints, challenge opposing arguments, and respond to questions. The event combines brand analysis, business reasoning, and persuasive communication in an engaging competitive format.",
    skills: ["Brand Defense", "Market Research", "Logical Rebuttal", "Competitive Countering"],
    format: "Head-to-head bracket debates pitting sector giants (e.g. Swiggy vs Zomato)",
    timing: "31 Oct (11:00 AM - 03:30 PM)",
    venueRoom: "Conference Hall 1",
    eligibility: "Teams of 2 participants",
    registrationStatus: "Register Now",
    animationType: "brand-battles",
    badgeAccent: "#ef4444",
    prize: "Cash prizes & trophies",
    spocs: EVENT_SPOCS["brand-battles"],
  },
  {
    id: "ipl-auction",
    slug: "ipl-auction",
    name: "IPL Auction",
    pageNumber: "05",
    category: "Strategic Simulation",
    tagline: "Live Simulated Cricket Bidding & Team Valuation",
    description:
      "IPL Auction is a simulated cricket auction in which participants take on the role of franchise owners and compete to build their ideal cricket team. Each team must make careful decisions while working within a limited budget. Participants evaluate available players, decide when to place bids, and manage their finances throughout the auction. Every purchase affects the remaining budget and the team's ability to acquire other players, making planning an important part of the experience. The event combines cricket knowledge with strategic thinking, financial management, and competitive bidding. Participants must balance their preferences with their budget while working towards building a strong and well-planned squad.",
    skills: ["Budget Allocation", "Live Bidding Discipline", "Squad Optimization", "Valuation"],
    format: "Live auctioneer with virtual budget purse, category quotas, and points calculation",
    timing: "31 Oct (Gavel strike at 10:00 AM)",
    venueRoom: "Indoor Sports Complex / Hall A",
    eligibility: "Teams of 3–4 participants",
    registrationStatus: "Register Now",
    animationType: "ipl-auction",
    badgeAccent: "#8b5cf6",
    prize: "Champion purse & team medals",
    spocs: EVENT_SPOCS["ipl-auction"],
  },

  // Page 06 Sub-Events
  {
    id: "hustle-mania",
    slug: "hustle-mania",
    name: "Hustle Mania",
    pageNumber: "06",
    category: "Marketing & Sales",
    tagline: "On-Ground Product Marketing & Live Selling Showdown",
    description:
      "Hustle Mania is an interactive selling and marketing event where participants operate stalls and sell products of their choice. It gives students an opportunity to experience the practical side of business by engaging directly with potential customers. Participants decide how to present their products, attract attention, communicate value, and respond to customer questions. They must adjust their approach based on customer reactions while working to generate sales in a competitive environment. The event transforms selling into a hands-on experience, allowing participants to explore the realities of customer interaction, marketing, negotiation, and business communication. Every conversation becomes an opportunity to understand customer preferences and improve the selling approach.",
    skills: ["Direct Sales", "Persuasive Negotiation", "Pricing Margins", "Guerrilla Tactics"],
    format: "Live campus market day; teams pitch, negotiate, and sell within designated zones",
    timing: "30 Oct (Running throughout Day 1)",
    venueRoom: "Campus Promenade & CIE Courtyard",
    eligibility: "Teams of 2–3 or solo hustlers",
    registrationStatus: "Register Now",
    animationType: "hustle-mania",
    badgeAccent: "#ec4899",
    prize: "Retain profits + Winner Trophy",
    spocs: EVENT_SPOCS["hustle-mania"],
  },
  {
    id: "internship-drive",
    slug: "internship-drive",
    name: "Internship Drive",
    pageNumber: "06",
    category: "Career & Recruitment",
    tagline: "Connect with Startups for Real-World Opportunities",
    description:
      "Internship Drive brings students and participating startups or organisations together to explore internship and career opportunities. The event provides a platform for students to learn about different professional roles, understand workplace expectations, and interact with organisations from various industries. Participating organisations can introduce their work, explain available opportunities, and connect with students who are interested in gaining practical experience. Students can discuss potential roles, understand relevant requirements, and learn more about the skills needed in professional environments. By bringing employers and students into one space, Internship Drive encourages meaningful interaction and helps participants explore possible career directions beyond their academic studies.",
    skills: ["Interviewing", "Resume Pitching", "Startup Readiness", "Professional Networking"],
    format: "Face-to-face founder interviews, portfolio reviews, and on-the-spot screening",
    timing: "31 Oct (10:00 AM - 03:00 PM)",
    venueRoom: "Placement & Training Cell, MLRIT",
    eligibility: "All enrolled college students seeking internships",
    registrationStatus: "Register Now",
    animationType: "internship-drive",
    badgeAccent: "#06b6d4",
    prize: "Paid internship offers",
    spocs: EVENT_SPOCS["internship-drive"],
  },
  {
    id: "startup-poly",
    slug: "startup-poly",
    name: "Startup Poly",
    pageNumber: "06",
    category: "Business Gaming",
    tagline: "Fast-Paced Monopoly-Inspired Startup Simulation",
    description:
      "Startup Poly is a live, startup-themed business simulation inspired by the mechanics of a board game. Teams compete to build and manage a valuable business portfolio within a fixed gameplay period. Participants begin with available funds and move across a specially designed board, where they encounter opportunities to acquire and upgrade businesses. Throughout the game, teams must manage their finances, evaluate investments, respond to changing situations, and make decisions that influence their business growth. The simulation introduces participants to business concepts through an engaging and competitive format. Instead of simply discussing entrepreneurship, teams experience the challenges of managing resources, taking risks, responding to competition, and making decisions within limited time and money.",
    skills: ["Cashflow Management", "Risk Balancing", "Market Maneuvers", "Tabletop Strategy"],
    format: "Multi-table business board game tournament with market shock cards",
    timing: "30 Oct (11:00 AM - 04:00 PM)",
    venueRoom: "CIE Innovation Lounge",
    eligibility: "Solo players or pairs",
    registrationStatus: "Register Now",
    animationType: "startup-poly",
    badgeAccent: "#eab308",
    prize: "Equinox Board Champion Shield",
    spocs: EVENT_SPOCS["startup-poly"],
  },
  {
    id: "e-cell-meet",
    slug: "e-cell-meet",
    name: "E-Cell Meet",
    pageNumber: "06",
    category: "Leadership & Ecosystem",
    tagline: "Cross-Campus Conclave for Entrepreneurship Leaders",
    description:
      "E-Cell Meet is an inter-college gathering that brings together entrepreneurship cells, student leaders, and innovation communities from different institutions. The event provides a space for participants to exchange experiences, discuss initiatives, and explore opportunities for collaboration. Representatives from different E-Cells can share their approaches to organising events, engaging students, supporting innovation, and promoting entrepreneurship on their campuses. The gathering encourages open discussions about common challenges and possible ways to strengthen student-led initiatives. Through conversations and networking, E-Cell Meet aims to build stronger connections between campus entrepreneurship communities and create opportunities for future partnerships and collaborative activities.",
    skills: ["Ecosystem Scaling", "Cross-Campus Collaboration", "Institutional Partnerships"],
    format: "Roundtable policy discussions, case sharing, and regional inter-college pacts",
    timing: "31 Oct (02:00 PM - 05:00 PM)",
    venueRoom: "Executive Boardroom, MLRIT",
    eligibility: "Official E-Cell representatives & campus startup leads",
    registrationStatus: "Register Now",
    animationType: "e-cell-meet",
    badgeAccent: "#6366f1",
    prize: "Institutional collaboration MOUs",
    spocs: EVENT_SPOCS["e-cell-meet"],
  },
  {
    id: "pitch-deck",
    slug: "pitch-deck",
    name: "Pitch Deck",
    pageNumber: "06",
    category: "Startup Pitching",
    tagline: "Presenting Ventures to Investors & Mentors",
    description:
      "Pitch Deck is a startup pitching platform where selected teams present their business ideas before investors, mentors, and industry professionals. The event gives aspiring entrepreneurs an opportunity to explain their ventures and receive feedback from experienced members of the business ecosystem. Participants present important aspects of their startup, including the problem they aim to solve, their proposed solution, target customers, business model, market opportunity, and future plans. They must communicate their ideas clearly while responding to questions from the panel. The session provides exposure to the pitching process and helps participants understand how business ideas are presented and evaluated. Through feedback and interaction with the panel, teams can gain new perspectives on their concepts and identify areas for further improvement.",
    skills: ["Investor Pitching", "Financial Projections", "Value Proposition", "Venture Defense"],
    format: "5-minute pitch deck presentation + 5-minute interrogation by angel investors",
    timing: "31 Oct (Grand Finale Track - 10:30 AM onwards)",
    venueRoom: "Main Auditorium, MLRIT",
    eligibility: "Student founders with idea, prototype, or early traction",
    registrationStatus: "Register Now",
    animationType: "pitch-deck",
    badgeAccent: "#14b8a6",
    prize: "Seed funding & incubation support",
    spocs: EVENT_SPOCS["pitch-deck"],
  },
  {
    id: "standup-comedy",
    slug: "standup-comedy",
    name: "Standup Comedy",
    pageNumber: "07",
    category: "Entertainment",
    tagline: "Live Comedy Evening at Equinox",
    description:
      "Standup Comedy is an evening of live comedy at Equinox. Sit back after a day of pitching, bidding, and hustling, and unwind with sharp sets, campus humour, and plenty of laughs.",
    skills: [],
    format: "Live standup comedy sets",
    timing: "30 Oct (Evening)",
    venueRoom: "MLRIT Campus",
    eligibility: "Open to all summit attendees",
    registrationStatus: "Register Now",
    animationType: "standup-comedy",
    badgeAccent: "#33FF67",
    spocs: EVENT_SPOCS["standup-comedy"],
  },
  {
    id: "musical-night",
    slug: "musical-night",
    name: "Musical Night",
    pageNumber: "07",
    category: "Entertainment",
    tagline: "Live Band Musical Night",
    description:
      "Musical Night is a live band performance that brings Equinox to a close on a high note. Join fellow participants, organisers, and guests for an evening of music and celebration.",
    skills: [],
    format: "Live band performance",
    timing: "31 Oct (Evening)",
    venueRoom: "MLRIT Campus",
    eligibility: "Open to all summit attendees",
    registrationStatus: "Register Now",
    animationType: "musical-night",
    badgeAccent: "#7484FE",
    spocs: EVENT_SPOCS["musical-night"],
  },
];

export const EQUINOX_INFO = {
  name: "The Equinox 2.0",
  edition: "2.0",
  tagline: "Where Passion Meets Perseverance",
  hashtag: "# WHERE PASSION MEETS PERSEVERANCE",
  dates: "30 - 31 OCT 2026",
  venue: "MLR Institute of Technology, Hyderabad",
  address:
    "Centre for Innovation and Entrepreneurship, MLR Institute of Technology, Dundigal Police Station Road, Hyderabad – 500 043, Telangana, India.",
  email: "cie@mlrinstitutions.ac.in",
  website: "mlritcie.in",
  host: "Centre for Innovation & Entrepreneurship (CIE), MLRIT",
};
