// Equinox 2026 / The Equinox 2.0 Official Content & Ground Truth

import { EVENT_SPOCS, OVERALL_COORDINATORS, EventSPOC } from "@/chatbot/data/events";
export type { EventSPOC };

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
  registrationStatus: "Register Now";
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
  spocs: EventSPOC[];
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
  { label: "Homepage", href: "/#top" },
  { label: "Sub-Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Registration", href: "/register" },
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
  { id: "current-sponsors", label: "Current Sponsors", href: "#impact" },
  { id: "gallery", label: "Event Gallery", href: "#gallery" },
  { id: "contact-us", label: "Contact Us", href: "#contact" },
];

export const about = {
  eyebrow: "E-Summit 2.0",
  heading: "Where Passion Meets Perseverance",
  whoAreWe:
    "Established in 2015, MLRIT-CIE is an entrepreneurship development cell dedicated to nurturing young innovators and supporting early-stage startups. We focus on building a strong and thriving ecosystem that encourages growth, collaboration, and innovation. By inspiring creativity and entrepreneurial spirit among students, alumni, faculty, and industry partners, we create opportunities for learning, development, and success. Through continuous support and guidance, we aim to drive innovation and turn ideas into reality.",
  whatWeDo:
    "We host high-impact hackathons, from MetaLoop, our biggest national-level AR/VR hackathon, to Inventron, our flagship 36-hour build challenge.",
  whatIsEquinox:
    "Equinox is an entrepreneurship summit organized by the Centre for Innovation and Entrepreneurship at MLR Institute of Technology, Hyderabad. It pictures a vibrant and engaging environment where students tackle real-world challenges and ignite their entrepreneurial spirit through sub-events Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, and Pitch Deck.",
  vision:
    "We envision creating an inclusive space where students, entrepreneurs, and investors come together to collaborate, learn, and shape impactful ideas. By fostering entrepreneurial thinking and encouraging practical problem-solving, we provide a platform for participants to showcase their ideas, experience real-world business scenarios, and build meaningful connections with industry leaders. Our event empowers emerging innovators and aspiring entrepreneurs to refine their concepts, gain visibility, and explore opportunities for growth, mentorship, and collaboration.",
  body: [
    "The Equinox is designed to test grit, sharp business acumen, street hustle, and visionary thinking. Across two high-voltage days on 30 - 31 October at MLRIT Hyderabad, participants dive into 10 premier sub-events ranging from simulated live cricket bidding and Monopoly-style business conquer to high-stakes investor pitch decks.",
    "Whether you're marketing products on campus in Hustle Mania, dissecting corporate dilemmas in Crossroads, or defending your favourite enterprise in Brand Battles, Equinox is where collegiate passion transforms into real-world perseverance.",
  ],
};

// Official Overall Equinox Coordinators
export const studentCoordinators = [
  { name: "Ghanashyam", phone: "+91 93900 06806", phoneRaw: "+919390006806", role: "Overall Equinox Coordinator" },
  { name: "Jaikar", phone: "+91 90324 10189", phoneRaw: "+919032410189", role: "Overall Equinox Coordinator" },
  { name: "Bhavana", phone: "+91 99895 32925", phoneRaw: "+919989532925", role: "Overall Equinox Coordinator" },
];

// The 10 Official Sub-Events from Pages 05 & 06 of the Program & Blueprint
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
      "Spotlight is an interactive session that brings students closer to entrepreneurs, industry professionals, and thought leaders. The event creates a platform for meaningful conversations about business, innovation, technology, leadership, and professional growth. Participants get the opportunity to hear about real experiences, understand the challenges faced by industry professionals, and explore how ideas develop into practical ventures. Through engaging discussions and personal insights, the session encourages curiosity and provides a broader understanding of the entrepreneurial and professional world. Whether you're interested in entrepreneurship, career development, or emerging industry trends, Spotlight offers an opportunity to learn from experienced individuals and gain perspectives that extend beyond the classroom.",
    skills: ["Tech Trends Analysis", "Strategic Foresight", "Startup Insights", "Networking"],
    format: "Expert keynote presentations followed by interactive audience Q&A",
    timing: "30 - 31 Oct (Sessions across both days)",
    venueRoom: "Main Auditorium, MLRIT",
    eligibility: "Open to all summit attendees",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "Sessions on both days",
    venue: "Main Auditorium, MLRIT",
    teamSize: "Individual or open entry",
    fee: "Free with summit pass",
    prize: "Exclusive mentor connections",
    about: [
      "Featuring inspiring presentations from industry experts on the latest trends in technology and entrepreneurship, the e-Summit will provide attendees with valuable insights into emerging technologies, industry trends, and the future of work.",
      "These talks will not only inform but also motivate and inspire, as participants hear firsthand how successful entrepreneurs overcame challenges and built thriving ventures. The personal stories of resilience and innovation will empower attendees to pursue their own ambitions with renewed determination, helping them stay focused and driven in the long run.",
    ],
    rules: [
      "Open to all registered summit delegates",
      "Audience Q&A follows each keynote session",
      "Priority seating for early arrivals",
    ],
    spocs: EVENT_SPOCS["spotlight"],
    spoc: EVENT_SPOCS["spotlight"][0],
  },
  {
    id: "crossroads",
    slug: "crossroads",
    name: "Cross Roads",
    pageNumber: "05",
    tagline: "Business Case-Study Strategy Challenge",
    category: "Case Competition",
    description:
      "Crossroads is a business case-study competition that places participants in real-world business situations. Teams step into the roles of decision-makers and work together to understand challenges, identify opportunities, and develop practical strategies. Participants may take on roles such as CEO, CTO, Marketing Manager, or Finance Head, allowing them to examine a business problem from different perspectives. Each team must analyse the given situation, evaluate possible approaches, and prepare a solution that addresses the central challenge. The competition concludes with teams presenting their strategies and defending their decisions. Through this experience, participants explore the complexities of business management, teamwork, and strategic thinking in a competitive environment.",
    skills: ["Case Analysis", "Strategic Problem Solving", "Risk Management", "Business Strategy"],
    format: "Team case challenge: problem breakdown, strategy formulation & jury defense",
    timing: "30 Oct (10:00 AM - 04:00 PM)",
    venueRoom: "CIE Seminar Hall B",
    eligibility: "Teams of 4–5 students from any branch or college",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "10:00 AM - 04:00 PM",
    venue: "CIE Seminar Hall B",
    teamSize: "Teams of 4–5",
    fee: "Included in ₹869 summit pass",
    prize: "Exciting awards & certificates",
    about: [
      "An interactive business simulation where each team member will take on a specific role, such as CEO, CTO, or Marketing Manager. They will face a challenging scenario and will be tasked with developing a strategic plan to overcome the obstacles.",
      "The top three teams will be awarded prizes for their exceptional performance based on creativity, feasibility, and teamwork.",
    ],
    rules: [
      "Teams of 4 to 5 students",
      "Case dossier provided on event morning",
      "Presentation deck submission within 3 hours",
      "7-min presentation + 3-min judge questions",
    ],
    spocs: EVENT_SPOCS["crossroads"],
    spoc: EVENT_SPOCS["crossroads"][0],
  },
  {
    id: "startup-expo",
    slug: "startup-expo",
    name: "Startup Expo",
    pageNumber: "05",
    tagline: "Showcasing Solutions, Products & Ventures",
    category: "Exhibition",
    description:
      "Startup Expo provides a platform for startups and emerging ventures to present their products, services, and innovative ideas to a wider audience. The event allows participants to interact directly with founders, understand the problems their startups are addressing, and learn how different businesses develop solutions for their customers. It creates an environment where innovation can be explored through conversations and demonstrations. For startups, the expo offers an opportunity to increase visibility, receive audience feedback, and connect with students and members of the entrepreneurial ecosystem. For visitors, it offers a closer look at the ideas and businesses being developed around them.",
    skills: ["Product Demonstration", "Customer Validation", "Early Traction", "Founder Networking"],
    format: "Live exhibitor stalls, live user feedback, and investor walk-ins",
    timing: "30 - 31 Oct (All-day expo floor)",
    venueRoom: "Central Innovation Pavilion, MLRIT",
    eligibility: "Student & early-stage startup ventures (Teams of 4–5)",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "09:30 AM - 05:30 PM",
    venue: "Central Innovation Pavilion, MLRIT",
    teamSize: "Stall for up to 4–5 members",
    fee: "Free for student ventures",
    prize: "Investor visibility & user signups",
    about: [
      "The Startup Expo at the summit offers an exciting platform for students to showcase their innovative products and business ideas to a diverse audience. It is a great opportunity for people who want to showcase their ideas and their marketing skills to simulate a real-life market.",
      "Hundreds of students, academicians, and visiting angels explore live prototypes, demo hardware, and test SaaS solutions.",
    ],
    rules: [
      "Working prototype, demo app, or product sample required",
      "Each venture receives a dedicated exhibition booth",
      "Founders must be present during expo hours",
    ],
    spocs: EVENT_SPOCS["startup-expo"],
    spoc: EVENT_SPOCS["startup-expo"][0],
  },
  {
    id: "brand-battles",
    slug: "brand-battles",
    name: "Brand Battles",
    pageNumber: "05",
    tagline: "The Ultimate Rival Brand Defense Debate",
    category: "Competitive Debate",
    description:
      "Brand Battles is a competitive debate where participants represent rival brands from the same industry. Teams must defend their chosen brand by using research, relevant data, real-world examples, and well-structured arguments. The event encourages participants to examine how brands compete, communicate their value, attract customers, and establish their position in the market. Teams must understand their own brand as well as the strategies of their competitors. As the debate progresses, participants present their viewpoints, challenge opposing arguments, and respond to questions. The event combines brand analysis, business reasoning, and persuasive communication in an engaging competitive format.",
    skills: ["Brand Strategy", "Market Research", "Argumentation & Rebuttal", "Competitive Analysis"],
    format: "Head-to-head debate rounds defending iconic market rivalries",
    timing: "31 Oct (11:00 AM - 03:30 PM)",
    venueRoom: "Conference Hall 1",
    eligibility: "Teams of 4–5",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "11:00 AM - 03:30 PM",
    venue: "Conference Hall 1",
    teamSize: "Teams of 4–5",
    fee: "Included in ₹869 summit pass",
    prize: "Cash prizes & trophies",
    about: [
      "A competitive debate where two teams represent rival brands from the same sector. Participants present strong, well-researched arguments supported by real-time data, case studies, and relevant market examples to demonstrate why their chosen brand stands superior. Teams with the most compelling arguments and impactful presentations will be awarded.",
      "Defend Apple vs Samsung, Swiggy vs Zomato, Coca-Cola vs Pepsi, or Nike vs Adidas in fierce knockout clash rounds.",
    ],
    rules: [
      "Teams of 4–5 members",
      "Brands randomly paired per debate bracket",
      "Strict timekeeping for arguments, cross-examination, and closing statements",
      "Scoring based on data backing, poise, and logical rebuttals",
    ],
    spocs: EVENT_SPOCS["brand-battles"],
    spoc: EVENT_SPOCS["brand-battles"][0],
  },
  {
    id: "ipl-auction",
    slug: "ipl-auction",
    name: "IPL Auction",
    pageNumber: "05",
    tagline: "Simulated Cricket Bidding & Team Strategy",
    category: "Strategic Simulation",
    description:
      "IPL Auction is a simulated cricket auction in which participants take on the role of franchise owners and compete to build their ideal cricket team. Each team must make careful decisions while working within a limited budget. Participants evaluate available players, decide when to place bids, and manage their finances throughout the auction. Every purchase affects the remaining budget and the team's ability to acquire other players, making planning an important part of the experience. The event combines cricket knowledge with strategic thinking, financial management, and competitive bidding. Participants must balance their preferences with their budget while working towards building a strong and well-planned squad.",
    skills: ["Budget Allocation", "Dynamic Auction Bidding", "Statistical Valuation", "Squad Strategy"],
    format: "Simulated live auction with virtual purse budget & squad composition rules",
    timing: "31 Oct (Auction hammer drops 10:00 AM)",
    venueRoom: "Indoor Sports Complex / Hall A",
    eligibility: "Teams of 4–5",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "10:00 AM - 04:30 PM",
    venue: "Indoor Sports Complex / Hall A",
    teamSize: "Teams of 4–5",
    fee: "Included in ₹869 summit pass",
    prize: "Champion purse & team medals",
    about: [
      "The IPL Auction is a competitive cricket draft experience where participants step into the shoes of team owners and build their own squads. Just like the official auction, each team is given a fixed budget to bid on players. The event runs in a fast-paced, high-energy format as participants strategize, outbid rivals, and assemble the strongest lineup for their team.",
      "Experience the intense rush of the auctioneer's hammer! Calculate player points, maintain purse discipline, and assemble a championship-winning playing XI.",
    ],
    rules: [
      "Teams of 4–5 participants representing a franchise",
      "Equal virtual purse allocated to all teams at start",
      "Mandatory player category quotas (batsmen, bowlers, all-rounders, wicketkeepers)",
      "Final team score calculated using official performance ratings",
    ],
    spocs: EVENT_SPOCS["ipl-auction"],
    spoc: EVENT_SPOCS["ipl-auction"][0],
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
      "Hustle Mania is an interactive selling and marketing event where participants operate stalls and sell products of their choice. It gives students an opportunity to experience the practical side of business by engaging directly with potential customers. Participants decide how to present their products, attract attention, communicate value, and respond to customer questions. They must adjust their approach based on customer reactions while working to generate sales in a competitive environment. The event transforms selling into a hands-on experience, allowing participants to explore the realities of customer interaction, marketing, negotiation, and business communication. Every conversation becomes an opportunity to understand customer preferences and improve the selling approach.",
    skills: ["Direct Selling", "Persuasion & Pitching", "Product Margins", "Customer Psychology"],
    format: "Live on-campus selling showdown with allocated seed stock or chosen products",
    timing: "30 Oct (Running throughout Day 1)",
    venueRoom: "Campus Promenade & CIE Courtyard",
    eligibility: "Teams of 4–5",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "10:30 AM - 04:30 PM",
    venue: "Campus Promenade & CIE Courtyard",
    teamSize: "Teams of 4–5",
    fee: "₹2,999 onwards",
    prize: "Retain profits + Winner Trophy",
    about: [
      "Hustle Mania is a hands-on business and marketing challenge where participants set up stalls and sell their products to real customers. Every aspect of their operations — expenditure, pricing, revenue, and profit — is tracked throughout the event. Teams must apply marketing strategies, customer engagement skills, and smart budgeting to maximize performance.",
      "Get out on the floor and prove your selling chops. Strategize product pricing, invent guerrilla marketing hooks, and maximize revenue before the closing bell.",
    ],
    rules: [
      "Permitted products verified by CIE coordinators",
      "Selling restricted to designated campus zones",
      "Strict ethical marketing and accounting practices enforced",
      "Winner decided by net margin, sales volume, and customer feedback",
    ],
    spocs: EVENT_SPOCS["hustle-mania"],
    spoc: EVENT_SPOCS["hustle-mania"][0],
  },
  {
    id: "internship-drive",
    slug: "internship-drive",
    name: "Internship Drive",
    pageNumber: "06",
    tagline: "Fast-Track Career Opportunities with Startups",
    category: "Career & Recruitment",
    description:
      "Internship Drive brings students and participating startups or organisations together to explore internship and career opportunities. The event provides a platform for students to learn about different professional roles, understand workplace expectations, and interact with organisations from various industries. Participating organisations can introduce their work, explain available opportunities, and connect with students who are interested in gaining practical experience. Students can discuss potential roles, understand relevant requirements, and learn more about the skills needed in professional environments. By bringing employers and students into one space, Internship Drive encourages meaningful interaction and helps participants explore possible career directions beyond their academic studies.",
    skills: ["Interviewing", "Resume Pitching", "Startup Readiness", "Professional Networking"],
    format: "On-spot resumes, screening rounds, and founder interviews",
    timing: "31 Oct (Morning to Afternoon)",
    venueRoom: "Placement & Training Cell, MLRIT",
    eligibility: "Enrolled college students seeking internships",
    registrationStatus: "Register Now",
    day: "Day 2 (31 Oct)",
    time: "10:00 AM - 03:00 PM",
    venue: "Placement & Training Cell, MLRIT",
    teamSize: "Individual candidates",
    fee: "Free for summit registrants",
    prize: "Paid internship offers",
    about: [
      "The Internship Drive is a unique platform designed for students to connect with companies that may not traditionally engage with campus recruitment. This event provides an opportunity to explore diverse career paths while gaining valuable experience with dynamic startups and mid-level firms. Participants can enhance their professional network and acquire essential skills to thrive in today’s competitive job market.",
      "Skip months of cold outreach. Meet hiring founders, software teams, and growth leads face-to-face for immediate internship screening.",
    ],
    rules: [
      "Carry printed resumes and digital portfolio/GitHub links",
      "Dress code: Smart casual / formal",
      "Attend pre-screening briefing at 09:30 AM",
    ],
    spocs: EVENT_SPOCS["internship-drive"],
    spoc: EVENT_SPOCS["internship-drive"][0],
  },
  {
    id: "startup-poly",
    slug: "startup-poly",
    name: "Startup Poly",
    pageNumber: "06",
    tagline: "Monopoly-Inspired Fast-Paced Business Simulation",
    category: "Business Gaming",
    description:
      "Startup Poly is a live, startup-themed business simulation inspired by the mechanics of a board game. Teams compete to build and manage a valuable business portfolio within a fixed gameplay period. Participants begin with available funds and move across a specially designed board, where they encounter opportunities to acquire and upgrade businesses. Throughout the game, teams must manage their finances, evaluate investments, respond to changing situations, and make decisions that influence their business growth. The simulation introduces participants to business concepts through an engaging and competitive format. Instead of simply discussing entrepreneurship, teams experience the challenges of managing resources, taking risks, responding to competition, and making decisions within limited time and money.",
    skills: ["Resource Management", "Risk Assessment", "Market Maneuvering", "Financial Acumen"],
    format: "Custom board-game business simulation with market shock cards & rounds",
    timing: "30 Oct (Multi-table tournament)",
    venueRoom: "CIE Innovation Lounge",
    eligibility: "Teams of 4–5",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "11:00 AM - 04:00 PM",
    venue: "CIE Innovation Lounge",
    teamSize: "Teams of 4–5",
    fee: "Included in ₹869 summit pass",
    prize: "Equinox Board Champion Shield",
    about: [
      "Startup Poly is a Monopoly-inspired entrepreneurship challenge where participants roll a die and navigate through a board filled with startup-themed opportunities, challenges, rewards, and setbacks. Every move tests their business skills, creativity, and decision-making as they tackle real-world entrepreneurial scenarios. The participants who successfully overcome the challenges and remain in the game until the end will be declared the winners.",
      "Navigate venture rounds, regulatory hurdles, runway burn rates, and hostile takeovers in this high-energy tabletop simulation.",
    ],
    rules: [
      "Each table operates with standardized game rules",
      "Shock cards introduce unpredictable market events every round",
      "Highest venture enterprise valuation after 10 rounds advances to finals",
    ],
    spocs: EVENT_SPOCS["startup-poly"],
    spoc: EVENT_SPOCS["startup-poly"][0],
  },
  {
    id: "e-cell-meet",
    slug: "e-cell-meet",
    name: "E-Cell Meet",
    pageNumber: "06",
    tagline: "Inter-College Entrepreneurship Leaders Conclave",
    category: "Leadership & Networking",
    description:
      "E-Cell Meet is an inter-college gathering that brings together entrepreneurship cells, student leaders, and innovation communities from different institutions. The event provides a space for participants to exchange experiences, discuss initiatives, and explore opportunities for collaboration. Representatives from different E-Cells can share their approaches to organising events, engaging students, supporting innovation, and promoting entrepreneurship on their campuses. The gathering encourages open discussions about common challenges and possible ways to strengthen student-led initiatives. Through conversations and networking, E-Cell Meet aims to build stronger connections between campus entrepreneurship communities and create opportunities for future partnerships and collaborative activities.",
    skills: ["Ecosystem Building", "Cross-Campus Collaboration", "Event Scaling", "Leadership"],
    format: "Roundtable discussions, best practice sharing, and MOU partnerships",
    timing: "31 Oct (Afternoon conclave)",
    venueRoom: "Executive Boardroom, MLRIT",
    eligibility: "E-Cell leaders and representatives",
    registrationStatus: "Register Now",
    day: "Day 2 (31 Oct)",
    time: "02:00 PM - 05:00 PM",
    venue: "Executive Boardroom, MLRIT",
    teamSize: "4–5 delegates per E-Cell",
    fee: "Invite / Delegate pass",
    prize: "Institutional collaboration MOUs",
    about: [
      "The E-Cell Meet is a networking event where E-Cells from different colleges come together to collaborate and share ideas. It provides a platform for students to connect, exchange experiences, and explore potential partnerships. The focus is on building relationships and fostering collaboration across campuses.",
      "Share proven event frameworks, solve volunteer engagement challenges, and establish co-incubation and cross-promotion pacts.",
    ],
    rules: [
      "Open to officially recognized college E-Cell leads or members",
      "Participating teams present a 3-minute campus ecosystem snapshot",
      "Collaborative policy resolution drafted at conclave close",
    ],
    spocs: EVENT_SPOCS["e-cell-meet"],
    spoc: EVENT_SPOCS["e-cell-meet"][0],
  },
  {
    id: "pitch-deck",
    slug: "pitch-deck",
    name: "Pitch Deck",
    pageNumber: "06",
    tagline: "Pitching Real Ventures to Investors & Mentors",
    category: "Startup Pitching",
    description:
      "Pitch Deck is a startup pitching platform where selected teams present their business ideas before investors, mentors, and industry professionals. The event gives aspiring entrepreneurs an opportunity to explain their ventures and receive feedback from experienced members of the business ecosystem. Participants present important aspects of their startup, including the problem they aim to solve, their proposed solution, target customers, business model, market opportunity, and future plans. They must communicate their ideas clearly while responding to questions from the panel. The session provides exposure to the pitching process and helps participants understand how business ideas are presented and evaluated. Through feedback and interaction with the panel, teams can gain new perspectives on their concepts and identify areas for further improvement.",
    skills: ["Pitch Deck Design", "Financial Projections", "Value Proposition", "Investor Defense"],
    format: "5-min pitch + 5-min Q&A before angel investors and CIE mentors",
    timing: "31 Oct (Grand Finale track)",
    venueRoom: "Main Stage Auditorium",
    eligibility: "Student founders with idea, prototype, or early traction",
    registrationStatus: "Register Now",
    day: "Day 1 & 2 (30–31 Oct)",
    time: "10:30 AM - 04:00 PM",
    venue: "Main Stage Auditorium",
    teamSize: "Teams of 4–5 founders",
    fee: "Included in ₹869 summit pass",
    prize: "Seed funding & incubation support",
    about: [
      "Pitch Deck is an idea presentation event where participants showcase their startup concepts to a panel of investors, venture capitalists, and industry experts. Teams present their problem statement, solution, business model, and market potential through a structured pitch. Selected ideas receive constructive feedback, mentorship opportunities, and potential support from the panel.",
      "Step onto the main stage in front of active investors and seasoned mentors. Convince the jury of your market sizing, unit economics, and execution capability.",
    ],
    rules: [
      "Pitch deck submission (max 10 slides, PDF format) prior to the event",
      "Strict 5 minutes pitch window followed by 5 minutes jury interrogation",
      "Evaluated on problem severity, market size, unfair advantage, and execution clarity",
    ],
    spocs: EVENT_SPOCS["pitch-deck"],
    spoc: EVENT_SPOCS["pitch-deck"][0],
  },
];

// For backward compatibility where code references `events`
export const events = subEvents;

// Summit Highlights (Grounded in official program scope)
export const highlights = [
  { value: "2,000+", label: "Students", detail: "Builders, founders, and leaders across campuses" },
  { value: "15+", label: "Startups", detail: "Exhibiting and networking across the two days" },
  { value: "10", label: "Official Sub-Events", detail: "Across strategy, auctions, debates, and pitching" },
  { value: "2", label: "Action-Packed Days", detail: "30 & 31 October at MLRIT Hyderabad" },
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
  mapsUrl: "https://maps.app.goo.gl/D5zN2u45HjAdk4sKA",
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
  body: "Registrations for The Equinox 2.0 (30 - 31 October 2026) are now live! Secure your team spot to participate in our flagship sub-events across strategy, tech, and business.",
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

export const whatsInStore = {
  eyebrow: "What's In Store",
  heading: "An Experience Beyond the Classroom",
  body: "Equinox brings together diverse experiences designed to challenge the way you think, create, and compete.",
  pillars: [
    { step: "01", title: "Compete", body: "Take on business challenges, simulations, debates, auctions, and high-pressure competitions." },
    { step: "02", title: "Create", body: "Turn ideas into solutions, startups, pitches, and possibilities." },
    { step: "03", title: "Connect", body: "Meet entrepreneurs, startups, investors, industry professionals, and E-Cells from across campuses." },
    { step: "04", title: "Learn", body: "Gain insights from industry experts and discover the realities of entrepreneurship, business, and innovation." },
  ],
};

export const whyEquinox = {
  eyebrow: "Why Equinox?",
  heading: "More Than an Event",
  body: "Equinox is a platform built for people who want to experience entrepreneurship rather than simply learn about it. Whether you're an aspiring entrepreneur, a business enthusiast, a student looking for opportunities, or someone who simply loves a good challenge, Equinox gives you a space to explore your potential.",
  reasons: [
    { title: "Learn from the Best", body: "Gain perspectives from entrepreneurs, industry professionals, and experts." },
    { title: "Challenge Yourself", body: "Step into competitions and experiences that test your strategy, creativity, communication, and decision-making." },
    { title: "Meet Your People", body: "Connect with ambitious students, startups, E-Cells, mentors, and professionals." },
    { title: "Find Opportunities", body: "Discover startups, internships, pitching opportunities, collaborations, and pathways to turn ideas into action." },
  ],
};

export const whySponsor = {
  eyebrow: "Why Sponsor Equinox?",
  heading: "Put Your Brand Where Future Leaders Gather",
  body: "Equinox offers brands an opportunity to engage with a highly driven community of students, aspiring entrepreneurs, innovators, and future professionals. As MLRIT-CIE's flagship E-Summit, Equinox combines scale, engagement, and meaningful interaction through competitions, startup showcases, industry sessions, and networking opportunities.",
  reasons: [
    { title: "Brand Visibility", body: "Position your brand in front of a large and engaged student audience." },
    { title: "Direct Engagement", body: "Create meaningful interactions with participants through event experiences and activations." },
    { title: "Talent Access", body: "Connect with ambitious students and discover potential talent for internships and future opportunities." },
    { title: "Innovation & Entrepreneurship", body: "Associate your brand with a platform focused on innovation, entrepreneurship, and future-ready talent." },
    { title: "Community Presence", body: "Build stronger connections with students, startups, E-Cells, and the wider entrepreneurial ecosystem." },
  ],
};

export const currentSponsors = {
  eyebrow: "Current Sponsors",
  heading: "Backing the Future of Entrepreneurship",
  body: "We are grateful to the organisations and brands that support Equinox and MLRIT-CIE in building a stronger entrepreneurial ecosystem.",
  logos: [
    { name: "Fortune Toyota", src: "/logos/sponsors/fortune-toyota.svg" },
    { name: "Student Tribe", src: "/logos/sponsors/student-tribe.svg" },
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
    a: "You can reach Overall Equinox Coordinators Ghanashyam (+91 93900 06806), Jaikar (+91 90324 10189), or Bhavana (+91 99895 32925), or email cie@mlrinstitutions.ac.in.",
  },
];

export const speakerCount = "Visionary Founders & Mentors";
export const marquee = ["Spotlight", "Crossroads", "Startup Expo", "Brand Battles", "IPL Auction", "Hustle Mania", "Internship Drive", "Startup Poly", "E-Cell Meet", "Pitch Deck"];
export const partners = ["CIE MLRIT", "MLR Institute of Technology"];
export const sponsors = ["MLRIT CIE", "Equinox 2.0"];
export const communities = ["Campus E-Cells", "Student Startups", "Tech Clubs"];
