// chatbot/data/events.ts
// Official source of truth for the 10 Equinox 2026 sub-events from the brochure

export interface EventCoordinator {
  name: string;
  phone: string;
  phoneRaw: string;
}

export interface BrochureSubEvent {
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
}

export const OFFICIAL_COORDINATORS: EventCoordinator[] = [
  { name: "Shyam", phone: "+91 93900 06806", phoneRaw: "+919390006806" },
  { name: "Mahima", phone: "+91 94933 62006", phoneRaw: "+919493362006" },
  { name: "Sanjana", phone: "+91 82084 99746", phoneRaw: "+918208499746" },
  { name: "Adithya", phone: "+91 91822 40970", phoneRaw: "+919182240970" },
];

export const BROCHURE_EVENTS: BrochureSubEvent[] = [
  // Page 05 Sub-Events
  {
    id: "spotlight",
    slug: "spotlight",
    name: "Spotlight",
    pageNumber: "05",
    category: "Keynote & Insights",
    tagline: "Industry Experts on Tech, Startups & Emerging Trends",
    description:
      "Spotlight features presentations from industry experts on technology, entrepreneurship, and startups. It gives students valuable insights into emerging technologies, industry trends, and the future of entrepreneurship.",
    skills: ["Tech Trends", "Industry Foresight", "Startup Insights", "Q&A Engagement"],
    format: "Keynote talks by proven tech leaders followed by audience interactive sessions",
    timing: "30 - 31 Oct (Session slots releasing soon)",
    venueRoom: "Main Stage Auditorium, MLRIT",
    eligibility: "Open to all summit delegate pass holders",
    registrationStatus: "Open Soon",
    animationType: "spotlight",
    badgeAccent: "#3b82f6",
  },
  {
    id: "crossroads",
    slug: "crossroads",
    name: "Cross Roads",
    pageNumber: "05",
    category: "Case Competition",
    tagline: "Business Case-Study Strategy & Practical Solutions",
    description:
      "Crossroads is a business case-study competition where teams analyse real-world business challenges and develop practical strategies. It helps participants improve their problem-solving, decision-making, and business skills.",
    skills: ["Case Breakdown", "Strategic Problem-Solving", "Risk Evaluation", "Business Acumen"],
    format: "Real-world dilemma dossier assigned to teams; live jury pitch & strategy defense",
    timing: "30 Oct (10:00 AM - 04:00 PM)",
    venueRoom: "CIE Seminar Hall B",
    eligibility: "Teams of 2–4 students from any college or department",
    registrationStatus: "Open Soon",
    animationType: "crossroads",
    badgeAccent: "#10b981",
  },
  {
    id: "startup-expo",
    slug: "startup-expo",
    name: "Startup Expo",
    pageNumber: "05",
    category: "Product Exhibition",
    tagline: "Showcase Solutions, Products & Innovative Ideas",
    description:
      "Startup Expo provides a platform for startups to showcase their products, business ideas, and solutions to students. It helps startups gain visibility while giving students an opportunity to explore new ideas and businesses",
    skills: ["Product Pitching", "Live Demonstrations", "Customer Feedback", "Networking"],
    format: "Dedicated exhibition stalls for prototypes, hardware demos, and software products",
    timing: "30 - 31 Oct (Full-Day Expo Pavilion)",
    venueRoom: "Central Innovation Pavilion, MLRIT",
    eligibility: "Student & early-stage startup ventures",
    registrationStatus: "Open Soon",
    animationType: "startup-expo",
    badgeAccent: "#f59e0b",
  },
  {
    id: "brand-battles",
    slug: "brand-battles",
    name: "Brand Battles",
    pageNumber: "05",
    category: "Competitive Debate",
    tagline: "Rival Brands Defense & Strategy Clash",
    description:
      "Brand Battles is a competitive debate between teams representing rival brands from the same sector. Participants defend their brands using real-time examples, data, and case studies while challenging their opponents' strategies.",
    skills: ["Brand Defense", "Market Research", "Logical Rebuttal", "Competitive Countering"],
    format: "Head-to-head bracket debates pitting sector giants (e.g. Swiggy vs Zomato)",
    timing: "31 Oct (11:00 AM - 03:30 PM)",
    venueRoom: "Conference Hall 1",
    eligibility: "Teams of 2 participants",
    registrationStatus: "Open Soon",
    animationType: "brand-battles",
    badgeAccent: "#ef4444",
  },
  {
    id: "ipl-auction",
    slug: "ipl-auction",
    name: "IPL Auction",
    pageNumber: "05",
    category: "Strategic Simulation",
    tagline: "Live Simulated Cricket Bidding & Team Valuation",
    description:
      "IPL Auction is a simulated cricket auction where participants take on the role of team owners. They bid for players, manage their budgets, and build their own teams through strategic decision-making.",
    skills: ["Budget Allocation", "Live Bidding Discipline", "Squad Optimization", "Valuation"],
    format: "Live auctioneer with virtual budget purse, category quotas, and points calculation",
    timing: "31 Oct (Gavel strike at 10:00 AM)",
    venueRoom: "Indoor Sports Complex / Hall A",
    eligibility: "Teams of 3–4 participants",
    registrationStatus: "Open Soon",
    animationType: "ipl-auction",
    badgeAccent: "#8b5cf6",
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
      "Hustle Mania gives students an opportunity to showcase their marketing and negotiation skills by selling products of their choice. Participants compete with others while developing their communication, persuasion, and business skills.",
    skills: ["Direct Sales", "Persuasive Negotiation", "Pricing Margins", "Guerrilla Tactics"],
    format: "Live campus market day; teams pitch, negotiate, and sell within designated zones",
    timing: "30 Oct (Running throughout Day 1)",
    venueRoom: "Campus Promenade & CIE Courtyard",
    eligibility: "Teams of 2–3 or solo hustlers",
    registrationStatus: "Open Soon",
    animationType: "hustle-mania",
    badgeAccent: "#ec4899",
  },
  {
    id: "internship-drive",
    slug: "internship-drive",
    name: "Internship Drive",
    pageNumber: "06",
    category: "Career & Recruitment",
    tagline: "Connect with Startups for Real-World Opportunities",
    description:
      "Internship Drive connects students with startups and companies offering internship opportunities. It helps students explore career options, gain practical experience, build professional connections, and develop useful skills.",
    skills: ["Interviewing", "Resume Pitching", "Startup Readiness", "Professional Networking"],
    format: "Face-to-face founder interviews, portfolio reviews, and on-the-spot screening",
    timing: "31 Oct (10:00 AM - 03:00 PM)",
    venueRoom: "Placement & Training Cell, MLRIT",
    eligibility: "All enrolled college students seeking internships",
    registrationStatus: "Open Soon",
    animationType: "internship-drive",
    badgeAccent: "#06b6d4",
  },
  {
    id: "startup-poly",
    slug: "startup-poly",
    name: "Startup Poly",
    pageNumber: "06",
    category: "Business Gaming",
    tagline: "Fast-Paced Monopoly-Inspired Startup Simulation",
    description:
      "Startup Poly is a fast-paced business simulation game inspired by Monopoly. Participants build startups, compete in markets, manage finances, handle risks, and make strategic decisions based on real-world business situations.",
    skills: ["Cashflow Management", "Risk Balancing", "Market Maneuvers", "Tabletop Strategy"],
    format: "Multi-table business board game tournament with market shock cards",
    timing: "30 Oct (11:00 AM - 04:00 PM)",
    venueRoom: "CIE Innovation Lounge",
    eligibility: "Solo players or pairs",
    registrationStatus: "Open Soon",
    animationType: "startup-poly",
    badgeAccent: "#eab308",
  },
  {
    id: "e-cell-meet",
    slug: "e-cell-meet",
    name: "E-Cell Meet",
    pageNumber: "06",
    category: "Leadership & Ecosystem",
    tagline: "Cross-Campus Conclave for Entrepreneurship Leaders",
    description:
      "E-Cell Meet brings together E-Cells from different colleges to connect, share ideas, and exchange experiences. It provides opportunities for students to build relationships, collaborate, and explore partnerships across campuses.",
    skills: ["Ecosystem Scaling", "Cross-Campus Collaboration", "Institutional Partnerships"],
    format: "Roundtable policy discussions, case sharing, and regional inter-college pacts",
    timing: "31 Oct (02:00 PM - 05:00 PM)",
    venueRoom: "Executive Boardroom, MLRIT",
    eligibility: "Official E-Cell representatives & campus startup leads",
    registrationStatus: "Open Soon",
    animationType: "e-cell-meet",
    badgeAccent: "#6366f1",
  },
  {
    id: "pitch-deck",
    slug: "pitch-deck",
    name: "Pitch Deck",
    pageNumber: "06",
    category: "Startup Pitching",
    tagline: "Presenting Ventures to Investors & Mentors",
    description:
      "Pitch Deck is a startup pitching platform where students present their ideas to investors, startup mentors, and industry experts. Participants receive valuable feedback and insights to help improve and develop their ideas.",
    skills: ["Investor Pitching", "Financial Projections", "Value Proposition", "Venture Defense"],
    format: "5-minute pitch deck presentation + 5-minute interrogation by angel investors",
    timing: "31 Oct (Grand Finale Track - 10:30 AM onwards)",
    venueRoom: "Main Auditorium, MLRIT",
    eligibility: "Student founders with idea, prototype, or early traction",
    registrationStatus: "Open Soon",
    animationType: "pitch-deck",
    badgeAccent: "#14b8a6",
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
