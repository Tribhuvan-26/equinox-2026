// Equinox 2026 / The Equinox 2.0 Official Brochure Content & Ground Truth

export interface EventSPOC {
  name: string;
  phone: string;
  email?: string;
}

export interface SubEvent {
  id: string;
  slug: string;
  name: string;
  pageNumber: string;
  tagline: string;
  category: string;
  description: string;
  skills: string[];
  format: string;
  timing: string;
  venueRoom: string;
  eligibility: string;
  registrationStatus: "Open Soon" | "Register Now" | "Details Pending";
  // Compatible legacy fields
  day: string;
  time: string;
  venue: string;
  teamSize: string;
  fee: string;
  prize: string;
  about: string[];
  rules: string[];
  spoc: EventSPOC;
}

export const event = {
  name: "The Equinox",
  edition: "2.0",
  year: "2026",
  tagline: "Where Passion Meets Perseverance",
  hashtagTagline: "# WHERE PASSION MEETS PERSEVERANCE",
  date: "30 - 31 OCT",
  datesFull: "30th & 31st October 2026",
  venue: "MLR Institute of Technology, Hyderabad",
  venueFull: "Centre for Innovation and Entrepreneurship, MLR Institute of Technology, Dundigal Police Station Road, Hyderabad – 500 043, Telangana, India",
  host: "Centre for Innovation & Entrepreneurship (CIE), MLRIT",
  hostShort: "MLR CIE",
  institution: "MLRIT",
  institutionMotto: "Engineering Ideas, Engineering Careers",
  ticketUrl: "/#events",
  rotatingWords: ["Builders", "Founders", "Hustlers", "Strategists"],
};

export const nav = [
  { label: "Prospectus", href: "/#top" },
  { label: "Contents", href: "/#contents" },
  { label: "About", href: "/#about" },
  { label: "Sub-Events", href: "/#events" },
  { label: "Impact", href: "/#impact" },
  { label: "Contact", href: "/#contact" },
];

export const contentsList = [
  { id: "who-are-we", label: "Who Are We?", href: "#about" },
  { id: "what-we-do", label: "What We Do", href: "#about" },
  { id: "what-is-equinox", label: "What Is Equinox?", href: "#about" },
  { id: "whats-in-store", label: "What’s In Store", href: "#events" },
  { id: "sub-events", label: "Sub-Events", href: "#events" },
  { id: "why-sponsor-us", label: "Why Sponsor Us", href: "#impact" },
  { id: "our-impact", label: "Our Impact", href: "#impact" },
  { id: "sponsorship-plans", label: "Sponsorship Plans", href: "#contact" },
  { id: "previous-sponsors", label: "Previous Sponsors", href: "#impact" },
  { id: "contact-us", label: "Contact Us", href: "#contact" },
];

export const about = {
  eyebrow: "E-Summit 2.0",
  heading: "Where Passion Meets Perseverance",
  whoAreWe:
    "The Centre for Innovation and Entrepreneurship (CIE) at MLR Institute of Technology is dedicated to nurturing student innovators, startup founders, and forward-thinking leaders through hands-on entrepreneurship.",
  whatWeDo:
    "CIE MLRIT creates an ecosystem where ambitious students transform theoretical ideas into viable ventures through mentorship, seed support, hackathons, and industry networking.",
  whatIsEquinox:
    "The Equinox is the flagship annual entrepreneurship summit organized by CIE MLRIT. A powerhouse two-day confluence uniting ambitious students, early-stage founders, angel investors, and tech pioneers across India.",
  body: [
    "The Equinox is designed to test grit, sharp business acumen, street hustle, and visionary thinking. Across two high-voltage days on 30 - 31 October at MLRIT Hyderabad, participants dive into 10 premier sub-events ranging from simulated live cricket bidding and Monopoly-style business conquer to high-stakes investor pitch decks.",
    "Whether you're marketing products on campus in Hustle Mania, dissecting corporate dilemmas in Crossroads, or defending your favourite enterprise in Brand Battles, Equinox is where collegiate passion transforms into real-world perseverance.",
  ],
};

// Official Student Coordinators from Page 12
export const studentCoordinators = [
  { name: "Shyam", phone: "+91 93900 06806", phoneRaw: "+919390006806", role: "Student Coordinator" },
  { name: "Mahima", phone: "+91 94933 62006", phoneRaw: "+919493362006", role: "Student Coordinator" },
  { name: "Sanjana", phone: "+91 82084 99746", phoneRaw: "+918208499746", role: "Student Coordinator" },
  { name: "Adithya", phone: "+91 91822 40970", phoneRaw: "+919182240970", role: "Student Coordinator" },
];

// The 10 Official Sub-Events from Pages 05 & 06 of the Brochure
export const subEvents: SubEvent[] = [
  // Page 05
  {
    id: "spotlight",
    slug: "spotlight",
    name: "Spotlight",
    pageNumber: "05",
    tagline: "Visionary Keynotes & Emerging Tech Insights",
    category: "Keynote & Insights",
    description:
      "Spotlight features presentations from industry experts on technology, entrepreneurship, and startups. It gives students valuable insights into emerging technologies, industry trends, and the future of entrepreneurship.",
    skills: ["Tech Trends Analysis", "Strategic Foresight", "Startup Insights", "Networking"],
    format: "Expert keynote presentations followed by interactive audience Q&A",
    timing: "30 - 31 Oct (Session slots releasing soon)",
    venueRoom: "Main Auditorium, MLRIT",
    eligibility: "Open to all summit attendees",
    registrationStatus: "Open Soon",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "Detailed slots releasing soon",
    venue: "Main Auditorium, MLRIT",
    teamSize: "Individual or open entry",
    fee: "Free with summit pass",
    prize: "Exclusive mentor connections",
    about: [
      "Spotlight features presentations from industry experts on technology, entrepreneurship, and startups. It gives students valuable insights into emerging technologies, industry trends, and the future of entrepreneurship.",
      "Get up close with industry founders sharing real-world playbooks, lessons learned from scaling companies, and what technologies will dominate the next decade.",
    ],
    rules: [
      "Open to all registered summit delegates",
      "Audience Q&A follows each keynote session",
      "Priority seating for early arrivals",
    ],
    spoc: { name: "Shyam", phone: "+91 93900 06806", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "crossroads",
    slug: "crossroads",
    name: "Cross Roads",
    pageNumber: "05",
    tagline: "Business Case-Study Strategy Challenge",
    category: "Case Competition",
    description:
      "Crossroads is a business case-study competition where teams analyse real-world business challenges and develop practical strategies. It helps participants improve their problem-solving, decision-making, and business skills.",
    skills: ["Case Analysis", "Strategic Problem Solving", "Risk Management", "Business Strategy"],
    format: "Team case challenge: problem breakdown, strategy formulation & jury defense",
    timing: "30 Oct (Detailed schedule releasing soon)",
    venueRoom: "CIE Seminar Hall B",
    eligibility: "Teams of 2–4 students from any branch or college",
    registrationStatus: "Open Soon",
    day: "Day 1 (30 Oct)",
    time: "10:00 AM - 04:00 PM",
    venue: "CIE Seminar Hall B",
    teamSize: "Teams of 2–4",
    fee: "Announcing soon",
    prize: "Exciting awards & certificates",
    about: [
      "Crossroads is a business case-study competition where teams analyse real-world business challenges and develop practical strategies. It helps participants improve their problem-solving, decision-making, and business skills.",
      "Teams are handed complex corporate case dilemmas and must construct comprehensive operational, marketing, and financial action plans under time pressure.",
    ],
    rules: [
      "Teams of 2 to 4 students",
      "Case dossier provided on event morning",
      "Presentation deck submission within 3 hours",
      "7-min presentation + 3-min judge questions",
    ],
    spoc: { name: "Mahima", phone: "+91 94933 62006", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "startup-expo",
    slug: "startup-expo",
    name: "Startup Expo",
    pageNumber: "05",
    tagline: "Showcasing Solutions, Products & Ventures",
    category: "Exhibition",
    description:
      "Startup Expo provides a platform for startups to showcase their products, business ideas, and solutions to students. It helps startups gain visibility while giving students an opportunity to explore new ideas and businesses",
    skills: ["Product Demonstration", "Customer Validation", "Early Traction", "Founder Networking"],
    format: "Live exhibitor stalls, live user feedback, and investor walk-ins",
    timing: "30 - 31 Oct (All-day expo floor)",
    venueRoom: "Central Innovation Pavilion, MLRIT",
    eligibility: "Student & early-stage startup ventures",
    registrationStatus: "Open Soon",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "09:30 AM - 05:30 PM",
    venue: "Central Innovation Pavilion, MLRIT",
    teamSize: "Stall for up to 4 members",
    fee: "Free for student ventures",
    prize: "Investor visibility & user signups",
    about: [
      "Startup Expo provides a platform for startups to showcase their products, business ideas, and solutions to students. It helps startups gain visibility while giving students an opportunity to explore new ideas and businesses",
      "Hundreds of students, academicians, and visiting angels explore live prototypes, demo hardware, and test SaaS solutions.",
    ],
    rules: [
      "Working prototype, demo app, or product sample required",
      "Each venture receives a dedicated exhibition booth",
      "Founders must be present during expo hours",
    ],
    spoc: { name: "Adithya", phone: "+91 91822 40970", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "brand-battles",
    slug: "brand-battles",
    name: "Brand Battles",
    pageNumber: "05",
    tagline: "The Ultimate Rival Brand Defense Debate",
    category: "Competitive Debate",
    description:
      "Brand Battles is a competitive debate between teams representing rival brands from the same sector. Participants defend their brands using real-time examples, data, and case studies while challenging their opponents' strategies.",
    skills: ["Brand Strategy", "Market Research", "Argumentation & Rebuttal", "Competitive Analysis"],
    format: "Head-to-head debate rounds defending iconic market rivalries",
    timing: "31 Oct (Slot allocations releasing soon)",
    venueRoom: "Conference Hall 1",
    eligibility: "Teams of 2",
    registrationStatus: "Open Soon",
    day: "Day 2 (31 Oct)",
    time: "11:00 AM - 03:30 PM",
    venue: "Conference Hall 1",
    teamSize: "Teams of 2",
    fee: "Announcing soon",
    prize: "Cash prizes & trophies",
    about: [
      "Brand Battles is a competitive debate between teams representing rival brands from the same sector. Participants defend their brands using real-time examples, data, and case studies while challenging their opponents' strategies.",
      "Defend Apple vs Samsung, Swiggy vs Zomato, Coca-Cola vs Pepsi, or Nike vs Adidas in fierce knockout clash rounds.",
    ],
    rules: [
      "Teams of 2 members",
      "Brands randomly paired per debate bracket",
      "Strict timekeeping for arguments, cross-examination, and closing statements",
      "Scoring based on data backing, poise, and logical rebuttals",
    ],
    spoc: { name: "Sanjana", phone: "+91 82084 99746", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "ipl-auction",
    slug: "ipl-auction",
    name: "IPL Auction",
    pageNumber: "05",
    tagline: "Simulated Cricket Bidding & Team Strategy",
    category: "Strategic Simulation",
    description:
      "IPL Auction is a simulated cricket auction where participants take on the role of team owners. They bid for players, manage their budgets, and build their own teams through strategic decision-making.",
    skills: ["Budget Allocation", "Dynamic Auction Bidding", "Statistical Valuation", "Squad Strategy"],
    format: "Simulated live auction with virtual purse budget & squad composition rules",
    timing: "31 Oct (Auction hammer drops 10:00 AM)",
    venueRoom: "Indoor Sports Complex / Hall A",
    eligibility: "Teams of 3–4",
    registrationStatus: "Open Soon",
    day: "Day 2 (31 Oct)",
    time: "10:00 AM - 04:30 PM",
    venue: "Indoor Sports Complex / Hall A",
    teamSize: "Teams of 3–4",
    fee: "Announcing soon",
    prize: "Champion purse & team medals",
    about: [
      "IPL Auction is a simulated cricket auction where participants take on the role of team owners. They bid for players, manage their budgets, and build their own teams through strategic decision-making.",
      "Experience the intense rush of the auctioneer's hammer! Calculate player points, maintain purse discipline, and assemble a championship-winning playing XI.",
    ],
    rules: [
      "Teams of 3–4 participants representing a franchise",
      "Equal virtual purse allocated to all teams at start",
      "Mandatory player category quotas (batsmen, bowlers, all-rounders, wicketkeepers)",
      "Final team score calculated using official performance ratings",
    ],
    spoc: { name: "Shyam", phone: "+91 93900 06806", email: "cie@mlrinstitutions.ac.in" },
  },

  // Page 06
  {
    id: "hustle-mania",
    slug: "hustle-mania",
    name: "Hustle Mania",
    pageNumber: "06",
    tagline: "On-Ground Marketing, Selling & Negotiation",
    category: "Marketing & Sales",
    description:
      "Hustle Mania gives students an opportunity to showcase their marketing and negotiation skills by selling products of their choice. Participants compete with others while developing their communication, persuasion, and business skills.",
    skills: ["Direct Selling", "Persuasion & Pitching", "Product Margins", "Customer Psychology"],
    format: "Live on-campus selling showdown with allocated seed stock or chosen products",
    timing: "30 Oct (Running throughout Day 1)",
    venueRoom: "Campus Promenade & CIE Courtyard",
    eligibility: "Teams of 2–3 or solo hustlers",
    registrationStatus: "Open Soon",
    day: "Day 1 (30 Oct)",
    time: "10:30 AM - 04:30 PM",
    venue: "Campus Promenade & CIE Courtyard",
    teamSize: "Teams of 2–3 or solo",
    fee: "Announcing soon",
    prize: "Retain profits + Winner Trophy",
    about: [
      "Hustle Mania gives students an opportunity to showcase their marketing and negotiation skills by selling products of their choice. Participants compete with others while developing their communication, persuasion, and business skills.",
      "Get out on the floor and prove your selling chops. Strategize product pricing, invent guerrilla marketing hooks, and maximize revenue before the closing bell.",
    ],
    rules: [
      "Permitted products verified by CIE coordinators",
      "Selling restricted to designated campus zones",
      "Strict ethical marketing and accounting practices enforced",
      "Winner decided by net margin, sales volume, and customer feedback",
    ],
    spoc: { name: "Mahima", phone: "+91 94933 62006", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "internship-drive",
    slug: "internship-drive",
    name: "Internship Drive",
    pageNumber: "06",
    tagline: "Fast-Track Career Opportunities with Startups",
    category: "Career & Recruitment",
    description:
      "Internship Drive connects students with startups and companies offering internship opportunities. It helps students explore career options, gain practical experience, build professional connections, and develop useful skills.",
    skills: ["Interviewing", "Resume Pitching", "Startup Readiness", "Professional Networking"],
    format: "On-spot resumes, screening rounds, and founder interviews",
    timing: "31 Oct (Morning to Afternoon)",
    venueRoom: "Placement & Training Cell, MLRIT",
    eligibility: "Enrolled college students seeking internships",
    registrationStatus: "Open Soon",
    day: "Day 2 (31 Oct)",
    time: "10:00 AM - 03:00 PM",
    venue: "Placement & Training Cell, MLRIT",
    teamSize: "Individual candidates",
    fee: "Free for summit registrants",
    prize: "Paid internship offers",
    about: [
      "Internship Drive connects students with startups and companies offering internship opportunities. It helps students explore career options, gain practical experience, build professional connections, and develop useful skills.",
      "Skip months of cold outreach. Meet hiring founders, software teams, and growth leads face-to-face for immediate internship screening.",
    ],
    rules: [
      "Carry printed resumes and digital portfolio/GitHub links",
      "Dress code: Smart casual / formal",
      "Attend pre-screening briefing at 09:30 AM",
    ],
    spoc: { name: "Adithya", phone: "+91 91822 40970", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "startup-poly",
    slug: "startup-poly",
    name: "Startup Poly",
    pageNumber: "06",
    tagline: "Monopoly-Inspired Fast-Paced Business Simulation",
    category: "Business Gaming",
    description:
      "Startup Poly is a fast-paced business simulation game inspired by Monopoly. Participants build startups, compete in markets, manage finances, handle risks, and make strategic decisions based on real-world business situations.",
    skills: ["Resource Management", "Risk Assessment", "Market Maneuvering", "Financial Acumen"],
    format: "Custom board-game business simulation with market shock cards & rounds",
    timing: "30 Oct (Multi-table tournament)",
    venueRoom: "CIE Innovation Lounge",
    eligibility: "Solo or pairs",
    registrationStatus: "Open Soon",
    day: "Day 1 (30 Oct)",
    time: "11:00 AM - 04:00 PM",
    venue: "CIE Innovation Lounge",
    teamSize: "Individual or pairs",
    fee: "Announcing soon",
    prize: "Equinox Board Champion Shield",
    about: [
      "Startup Poly is a fast-paced business simulation game inspired by Monopoly. Participants build startups, compete in markets, manage finances, handle risks, and make strategic decisions based on real-world business situations.",
      "Navigate venture rounds, regulatory hurdles, runway burn rates, and hostile takeovers in this high-energy tabletop simulation.",
    ],
    rules: [
      "Each table operates with standardized game rules",
      "Shock cards introduce unpredictable market events every round",
      "Highest venture enterprise valuation after 10 rounds advances to finals",
    ],
    spoc: { name: "Sanjana", phone: "+91 82084 99746", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "e-cell-meet",
    slug: "e-cell-meet",
    name: "E-Cell Meet",
    pageNumber: "06",
    tagline: "Inter-College Entrepreneurship Leaders Conclave",
    category: "Leadership & Networking",
    description:
      "E-Cell Meet brings together E-Cells from different colleges to connect, share ideas, and exchange experiences. It provides opportunities for students to build relationships, collaborate, and explore partnerships across campuses.",
    skills: ["Ecosystem Building", "Cross-Campus Collaboration", "Event Scaling", "Leadership"],
    format: "Roundtable discussions, best practice sharing, and MOU partnerships",
    timing: "31 Oct (Afternoon conclave)",
    venueRoom: "Executive Boardroom, MLRIT",
    eligibility: "E-Cell leaders and representatives",
    registrationStatus: "Open Soon",
    day: "Day 2 (31 Oct)",
    time: "02:00 PM - 05:00 PM",
    venue: "Executive Boardroom, MLRIT",
    teamSize: "1–3 delegates per E-Cell",
    fee: "Invite / Delegate pass",
    prize: "Institutional collaboration MOUs",
    about: [
      "E-Cell Meet brings together E-Cells from different colleges to connect, share ideas, and exchange experiences. It provides opportunities for students to build relationships, collaborate, and explore partnerships across campuses.",
      "Share proven event frameworks, solve volunteer engagement challenges, and establish co-incubation and cross-promotion pacts.",
    ],
    rules: [
      "Open to officially recognized college E-Cell leads or members",
      "Participating teams present a 3-minute campus ecosystem snapshot",
      "Collaborative policy resolution drafted at conclave close",
    ],
    spoc: { name: "Shyam", phone: "+91 93900 06806", email: "cie@mlrinstitutions.ac.in" },
  },
  {
    id: "pitch-deck",
    slug: "pitch-deck",
    name: "Pitch Deck",
    pageNumber: "06",
    tagline: "Pitching Real Ventures to Investors & Mentors",
    category: "Startup Pitching",
    description:
      "Pitch Deck is a startup pitching platform where students present their ideas to investors, startup mentors, and industry experts. Participants receive valuable feedback and insights to help improve and develop their ideas.",
    skills: ["Pitch Deck Design", "Financial Projections", "Value Proposition", "Investor Defense"],
    format: "5-min pitch + 5-min Q&A before angel investors and CIE mentors",
    timing: "31 Oct (Grand Finale track)",
    venueRoom: "Main Stage Auditorium",
    eligibility: "Student founders with idea, prototype, or early traction",
    registrationStatus: "Open Soon",
    day: "Day 2 (31 Oct)",
    time: "10:30 AM - 04:00 PM",
    venue: "Main Stage Auditorium",
    teamSize: "Teams of 1–4 founders",
    fee: "Announcing soon",
    prize: "Seed funding & incubation support",
    about: [
      "Pitch Deck is a startup pitching platform where students present their ideas to investors, startup mentors, and industry experts. Participants receive valuable feedback and insights to help improve and develop their ideas.",
      "Step onto the main stage in front of active investors and seasoned mentors. Convince the jury of your market sizing, unit economics, and execution capability.",
    ],
    rules: [
      "Pitch deck submission (max 10 slides, PDF format) prior to the event",
      "Strict 5 minutes pitch window followed by 5 minutes jury interrogation",
      "Evaluated on problem severity, market size, unfair advantage, and execution clarity",
    ],
    spoc: { name: "Mahima", phone: "+91 94933 62006", email: "cie@mlrinstitutions.ac.in" },
  },
];

// For backward compatibility where code references `events`
export const events = subEvents;

// Summit Highlights (Grounded in brochure scope)
export const highlights = [
  { value: "10", label: "Official Sub-Events", detail: "Across strategy, auctions, debates, and pitching" },
  { value: "2", label: "Action-Packed Days", detail: "30 & 31 October at MLRIT Hyderabad" },
  { value: "1,000+", label: "Student Innovators", detail: "Builders, founders, and leaders across campuses" },
  { value: "50+", label: "College E-Cells", detail: "Represented in the national E-Cell conclave" },
];

// Official Contact Information from Page 12
export const contact = {
  eyebrow: "Contact",
  heading: "Get in touch",
  title: "Contact Us",
  lead: "Thanks for going through the content and checking out our plans. We are looking forward to onboarding you super soon. For any doubts/queries, drop us a mail at: cie@mlrinstitutions.ac.in",
  body: "Thanks for going through the content and checking out our plans. We are looking forward to onboarding you super soon. For any doubts/queries, drop us a mail at cie@mlrinstitutions.ac.in",
  subheading: "Further details, contact :",
  email: "cie@mlrinstitutions.ac.in",
  website: "mlritcie.in",
  websiteUrl: "https://mlritcie.in",
  addressLines: [
    "Centre for Innovation and Entrepreneurship,",
    "MLR Institute of Technology,",
    "Dundigal Police Station Road,",
    "Hyderabad – 500 043, Telangana, India.",
  ],
  socials: [
    { platform: "Instagram", handle: "mlritcie", url: "https://instagram.com/mlritcie" },
    { platform: "LinkedIn", handle: "MLRIT CIE", url: "https://linkedin.com/company/mlritcie" },
    { platform: "X", handle: "ciemlrit", url: "https://x.com/ciemlrit" },
    { platform: "Facebook", handle: "mlrit_cie", url: "https://facebook.com/mlrit_cie" },
  ],
};

export const socials = [
  { label: "Instagram", href: "https://instagram.com/mlritcie" },
  { label: "LinkedIn", href: "https://linkedin.com/company/mlritcie" },
  { label: "X", href: "https://x.com/ciemlrit" },
  { label: "Facebook", href: "https://facebook.com/mlrit_cie" },
];

export const board = studentCoordinators.map((c) => ({
  name: c.name,
  role: c.role,
  email: contact.email,
  phone: c.phone,
}));

export const registration = {
  eyebrow: "Registration",
  heading: "Register for Equinox 2.0",
  body: "Registrations for The Equinox 2.0 (30 - 31 October 2026) will open shortly. Reach out to our student coordinators or mail cie@mlrinstitutions.ac.in for team reservations.",
  formUrl: "#contact",
  steps: [
    { title: "Select Sub-Events", body: "Pick from the 10 official competitions and exhibitions across tech, strategy, and business." },
    { title: "Form Your Team", body: "Assemble your squad or enter solo depending on event criteria." },
    { title: "Submit Details", body: "Register online or via CIE MLRIT campus desk." },
    { title: "Compete & Win", body: "Arrive at MLRIT Hyderabad on 30 - 31 October to pitch, hustle, and conquer." },
  ],
};

// Fallback arrays for backward compatibility
export const audience = {
  eyebrow: "Confluence",
  heading: "Who Joins The Equinox",
  groups: [
    { name: "Students & Hustlers", what: "Compete in Hustle Mania, Startup Poly, and the IPL Auction." },
    { name: "Founders & Builders", what: "Pitch to angel investors in Pitch Deck and showcase at the Startup Expo." },
    { name: "Strategists & Debaters", what: "Solve corporate cases in Crossroads and defend brands in Brand Battles." },
    { name: "E-Cell Leaders", what: "Collaborate and form regional partnerships in the national E-Cell Meet." },
  ],
};

export const hosts = {
  eyebrow: "Organizers",
  heading: "Run by CIE MLRIT",
  body: "Centre for Innovation and Entrepreneurship at MLR Institute of Technology drives student entrepreneurship, incubation, and startup acceleration.",
};

export const tickets = [
  {
    name: "Summit Pass",
    description: "Full access pass for both days covering all 10 sub-events, keynotes, and expo floor.",
    perks: ["Access to all sub-events", "Startup Expo badge", "Kit & participation certificate", "Networking access"],
    badge: "Opening Soon",
    price: "Stay Tuned",
    unit: "Individual Pass",
    href: "#contact",
  },
];

export const faqs = [
  {
    q: "When and where is The Equinox 2.0 taking place?",
    a: "The summit is scheduled for 30 - 31 October at MLR Institute of Technology, Dundigal Police Station Road, Hyderabad – 500 043, Telangana.",
  },
  {
    q: "How many sub-events are part of Equinox 2.0?",
    a: "There are 10 confirmed sub-events: Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, and Pitch Deck.",
  },
  {
    q: "Who can participate in Equinox 2.0?",
    a: "Students from any college, department, or year can participate. Diverse events cater to strategists, coders, marketers, cricket enthusiasts, and startup founders.",
  },
  {
    q: "How can I contact the event coordinators?",
    a: "You can reach student coordinators Shyam (+91 93900 06806), Mahima (+91 94933 62006), Sanjana (+91 82084 99746), or Adithya (+91 91822 40970), or email cie@mlrinstitutions.ac.in.",
  },
];

export const speakerCount = "Visionary Founders & Mentors";
export const marquee = ["Spotlight", "Crossroads", "Startup Expo", "Brand Battles", "IPL Auction", "Hustle Mania", "Internship Drive", "Startup Poly", "E-Cell Meet", "Pitch Deck"];
export const partners = ["CIE MLRIT", "MLR Institute of Technology"];
export const sponsors = ["MLRIT CIE", "Equinox 2.0"];
export const communities = ["Campus E-Cells", "Student Startups", "Tech Clubs"];
