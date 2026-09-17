// chatbot/data/events.ts
// Official source of truth for the 10 Equinox 2026 sub-events from the program

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
  pageNumber: "05" | "06";
  category: string;
  tagline: string;
  description: string;
  skills: string[];
  format: string;
  timing: string;
  venueRoom: string;
  eligibility: string;
  registrationStatus: "Open Soon" | "Register Now" | "Details Pending";
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
    | "pitch-deck";
  badgeAccent: string;
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
      "Featuring inspiring presentations from industry experts on the latest trends in technology and entrepreneurship, Spotlight provides attendees with valuable insights into emerging technologies, industry trends, and the future of work. Participants hear firsthand personal stories of resilience and innovation from successful entrepreneurs.",
    skills: ["Tech Trends", "Industry Foresight", "Startup Insights", "Q&A Engagement"],
    format: "Keynote talks by proven tech leaders followed by audience interactive sessions",
    timing: "30 - 31 Oct (Session slots releasing soon)",
    venueRoom: "Main Stage Auditorium, MLRIT",
    eligibility: "Open to all summit delegate pass holders",
    registrationStatus: "Open Soon",
    animationType: "spotlight",
    badgeAccent: "#3b82f6",
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
      "An interactive business simulation where each team member takes on a specific role, such as CEO, CTO, or Marketing Manager. Teams face a challenging scenario and develop a strategic plan to overcome obstacles, with top teams awarded for creativity, feasibility, and teamwork.",
    skills: ["Case Breakdown", "Strategic Problem-Solving", "Risk Evaluation", "Business Acumen"],
    format: "Real-world dilemma dossier assigned to teams; live jury pitch & strategy defense",
    timing: "30 Oct (10:00 AM - 04:00 PM)",
    venueRoom: "CIE Seminar Hall B",
    eligibility: "Teams of 2–4 students from any college or department",
    registrationStatus: "Open Soon",
    animationType: "crossroads",
    badgeAccent: "#10b981",
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
      "The Startup Expo offers an exciting platform for students to showcase their innovative products and business ideas to a diverse audience. It is a great opportunity for creators to showcase their ideas and marketing skills to simulate a real-life market.",
    skills: ["Product Pitching", "Live Demonstrations", "Customer Feedback", "Networking"],
    format: "Dedicated exhibition stalls for prototypes, hardware demos, and software products",
    timing: "30 - 31 Oct (Full-Day Expo Pavilion)",
    venueRoom: "Central Innovation Pavilion, MLRIT",
    eligibility: "Student & early-stage startup ventures",
    registrationStatus: "Open Soon",
    animationType: "startup-expo",
    badgeAccent: "#f59e0b",
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
      "A competitive debate where two teams represent rival brands from the same sector. Participants present strong, well-researched arguments supported by real-time data, case studies, and relevant market examples to demonstrate why their chosen brand stands superior.",
    skills: ["Brand Defense", "Market Research", "Logical Rebuttal", "Competitive Countering"],
    format: "Head-to-head bracket debates pitting sector giants (e.g. Swiggy vs Zomato)",
    timing: "31 Oct (11:00 AM - 03:30 PM)",
    venueRoom: "Conference Hall 1",
    eligibility: "Teams of 2 participants",
    registrationStatus: "Open Soon",
    animationType: "brand-battles",
    badgeAccent: "#ef4444",
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
      "A competitive cricket draft experience where participants step into the shoes of team owners and build their own squads. Each team receives a fixed budget to bid on players in a fast-paced format as participants strategize, outbid rivals, and assemble the strongest lineup.",
    skills: ["Budget Allocation", "Live Bidding Discipline", "Squad Optimization", "Valuation"],
    format: "Live auctioneer with virtual budget purse, category quotas, and points calculation",
    timing: "31 Oct (Gavel strike at 10:00 AM)",
    venueRoom: "Indoor Sports Complex / Hall A",
    eligibility: "Teams of 3–4 participants",
    registrationStatus: "Open Soon",
    animationType: "ipl-auction",
    badgeAccent: "#8b5cf6",
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
      "A hands-on business and marketing challenge where participants set up stalls and sell their products to real customers. Every aspect of operations — expenditure, pricing, revenue, and profit — is tracked as teams apply marketing strategies and customer engagement skills.",
    skills: ["Direct Sales", "Persuasive Negotiation", "Pricing Margins", "Guerrilla Tactics"],
    format: "Live campus market day; teams pitch, negotiate, and sell within designated zones",
    timing: "30 Oct (Running throughout Day 1)",
    venueRoom: "Campus Promenade & CIE Courtyard",
    eligibility: "Teams of 2–3 or solo hustlers",
    registrationStatus: "Open Soon",
    animationType: "hustle-mania",
    badgeAccent: "#ec4899",
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
      "A unique platform designed for students to connect with companies and dynamic startups that may not traditionally engage with campus recruitment, exploring diverse career paths, gaining valuable experience, and building professional networks.",
    skills: ["Interviewing", "Resume Pitching", "Startup Readiness", "Professional Networking"],
    format: "Face-to-face founder interviews, portfolio reviews, and on-the-spot screening",
    timing: "31 Oct (10:00 AM - 03:00 PM)",
    venueRoom: "Placement & Training Cell, MLRIT",
    eligibility: "All enrolled college students seeking internships",
    registrationStatus: "Open Soon",
    animationType: "internship-drive",
    badgeAccent: "#06b6d4",
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
      "A Monopoly-inspired entrepreneurship challenge where participants roll a die and navigate through a board filled with startup-themed opportunities, challenges, rewards, and setbacks, testing business decision-making to remain until the end.",
    skills: ["Cashflow Management", "Risk Balancing", "Market Maneuvers", "Tabletop Strategy"],
    format: "Multi-table business board game tournament with market shock cards",
    timing: "30 Oct (11:00 AM - 04:00 PM)",
    venueRoom: "CIE Innovation Lounge",
    eligibility: "Solo players or pairs",
    registrationStatus: "Open Soon",
    animationType: "startup-poly",
    badgeAccent: "#eab308",
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
      "A networking event where E-Cells from different colleges come together to collaborate, share ideas, and exchange experiences, focusing on building relationships and fostering partnerships across campuses.",
    skills: ["Ecosystem Scaling", "Cross-Campus Collaboration", "Institutional Partnerships"],
    format: "Roundtable policy discussions, case sharing, and regional inter-college pacts",
    timing: "31 Oct (02:00 PM - 05:00 PM)",
    venueRoom: "Executive Boardroom, MLRIT",
    eligibility: "Official E-Cell representatives & campus startup leads",
    registrationStatus: "Open Soon",
    animationType: "e-cell-meet",
    badgeAccent: "#6366f1",
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
      "An idea presentation event where participants showcase their startup concepts to a panel of investors, venture capitalists, and industry experts. Teams present problem statement, solution, business model, and market potential through a structured pitch.",
    skills: ["Investor Pitching", "Financial Projections", "Value Proposition", "Venture Defense"],
    format: "5-minute pitch deck presentation + 5-minute interrogation by angel investors",
    timing: "31 Oct (Grand Finale Track - 10:30 AM onwards)",
    venueRoom: "Main Auditorium, MLRIT",
    eligibility: "Student founders with idea, prototype, or early traction",
    registrationStatus: "Open Soon",
    animationType: "pitch-deck",
    badgeAccent: "#14b8a6",
    spocs: EVENT_SPOCS["pitch-deck"],
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
