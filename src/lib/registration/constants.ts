export type PassType = "single" | "combo" | "entertainment" | "premium" | "ipl";

export type SingleEventChoice = "musical-night" | "standup-comedy";

export const SINGLE_PASS_FEE = 299;
export const COMBO_PASS_FEE = 499;
export const ENTERTAINMENT_PASS_FEE = 569;
export const PREMIUM_PASS_FEE = 769;
export const IPL_PASS_FEE = ENTERTAINMENT_PASS_FEE;

/** Default fallback registration fee */
export const REGISTRATION_FEE = SINGLE_PASS_FEE;

export type PassOption = {
  id: PassType;
  name: string;
  price: number;
  badge: string;
  tagline: string;
  description: string;
  includedEvents: string[];
  highlights: string[];
  requiresEventSelection?: boolean;
};

export const SINGLE_EVENT_CHOICES: {
  id: SingleEventChoice;
  name: string;
  day: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: "musical-night",
    name: "Musical Night",
    day: "Day 2 (31 Oct) · Evening",
    tagline: "Live Band Musical Night",
    description: "High-energy live band performance and celebration bringing Equinox to an unforgettable close.",
  },
  {
    id: "standup-comedy",
    name: "Stand-Up Comedy",
    day: "Day 1 (30 Oct) · Evening",
    tagline: "Live Comedy Evening",
    description: "Sharp stand-up comedy sets, campus humour, and plenty of laughs to unwind after summit activities.",
  },
];

export const PASS_OPTIONS: Record<PassType, PassOption> = {
  single: {
    id: "single",
    name: "Single Pass",
    price: SINGLE_PASS_FEE,
    badge: "Single Show",
    tagline: "Musical Night OR Stand-Up Comedy",
    description: "Access to either Musical Night OR Stand-Up Comedy. Select your preferred show below.",
    includedEvents: ["Musical Night OR Stand-Up Comedy"],
    highlights: [
      "Access to 1 live evening show of your choice",
      "Live campus entry & designated seating for the chosen performance",
      "Official Equinox delegate badge",
    ],
    requiresEventSelection: true,
  },
  combo: {
    id: "combo",
    name: "Combo Pass",
    price: COMBO_PASS_FEE,
    badge: "Both Shows · Best Value",
    tagline: "Musical Night AND Stand-Up Comedy",
    description: "Complete evening entertainment package with full access to both evening shows.",
    includedEvents: ["Musical Night", "Stand-Up Comedy"],
    highlights: [
      "Stand-Up Comedy (Day 1 · 30 Oct Evening)",
      "Musical Night live band show (Day 2 · 31 Oct Evening)",
      "Save ₹99 compared to two single show passes",
    ],
  },
  entertainment: {
    id: "entertainment",
    name: "Entertainment Pass",
    price: ENTERTAINMENT_PASS_FEE,
    badge: "All Entertainment + IPL",
    tagline: "IPL Auction + Musical Night + Stand-Up Comedy",
    description: "The ultimate entertainment combo: participate in the simulated IPL Auction plus access both evening shows.",
    includedEvents: ["IPL Auction", "Musical Night", "Stand-Up Comedy"],
    highlights: [
      "Participation in simulated IPL Auction bidding battle",
      "Stand-Up Comedy access (Day 1 · 30 Oct Evening)",
      "Musical Night access (Day 2 · 31 Oct Evening)",
    ],
  },
  // Backward compatibility aliases
  ipl: {
    id: "ipl",
    name: "Entertainment Pass",
    price: ENTERTAINMENT_PASS_FEE,
    badge: "All Entertainment + IPL",
    tagline: "IPL Auction + Musical Night + Stand-Up Comedy",
    description: "The ultimate entertainment combo: participate in the simulated IPL Auction plus access both evening shows.",
    includedEvents: ["IPL Auction", "Musical Night", "Stand-Up Comedy"],
    highlights: [
      "Participation in simulated IPL Auction bidding battle",
      "Stand-Up Comedy access (Day 1 · 30 Oct Evening)",
      "Musical Night access (Day 2 · 31 Oct Evening)",
    ],
  },
  premium: {
    id: "premium",
    name: "Summit Pass",
    price: PREMIUM_PASS_FEE,
    badge: "All-Access Summit",
    tagline: "All 10 Sub-Events + Night Shows",
    description: "Full summit all-access pass covering all 10 official competitions, keynote talks, and expo exhibits.",
    includedEvents: [
      "Spotlight",
      "Crossroads",
      "Startup Expo",
      "Brand Battles",
      "IPL Auction",
      "Hustle Mania",
      "Internship Drive",
      "Startup Poly",
      "E-Cell Meet",
      "Pitch Deck",
      "Stand-Up Comedy",
      "Musical Night",
    ],
    highlights: [
      "Access to all 10 official sub-events",
      "Stand-up comedy and musical night access included",
      "Summit delegate kit & certification eligibility",
    ],
  },
};

export const ACTIVE_PASS_TYPES: PassType[] = ["single", "combo", "entertainment"];

export const DEPARTMENTS = [
  "CSE",
  "CSM",
  "CSD",
  "Cyber Security",
  "MBA",
  "BBA",
  "EEE",
  "Mechanical",
  "Aeronautical",
  "Civil",
  "IT",
  "CSIT",
  "ECE",
  "Other",
] as const;

export const COLLEGES = [
  "MLR Institute of Technology - MLID",
  "MLR Institute of Technology and Management - MLRS",
  "Institute of Aeronautical Engineering - IARE",
  "IIT Hyderabad - IITH",
  "IIIT Hyderabad - IIITH",
  "JNTU, Hyderabad",
  "Osmania University - OU",
  "University of Hyderabad - HU",
  "Chaitanya Bharathi Institute of Technology - CBIT",
  "VNR Vignana Jyothi Institute of Engineering and Technology - VNR VJIET",
  "Vidya Jyothi Institute of Technology - VJIT",
  "Vasavi College of Engineering - VASV",
  "Narsimha Reddy Engineering College - NRCM",
  "DRK Institute of Science and Technology - DRK",
  "St. Peter's Engineering College - SPEC",
  "Sreenidhi Institute of Science and Technology - SNIST",
  "Keshav Memorial Institute of Technology - KMIT",
  "Gokaraju Rangaraju Institute of Engineering and Technology - GRIET",
  "Mahatma Gandhi Institute of Technology - MGIT",
  "CVR College of Engineering - CVR",
  "Vardhaman College of Engineering",
  "B.V. Raju Institute of Technology - BVRIT",
  "BVRIT Hyderabad College of Engineering for Women - BVRITH",
  "CMR Engineering College - CMREC",
  "CMR Technical Campus - CMRTC",
  "CMR Institute of Technology - CMRIT",
  "CMR College of Engineering & Technology - CMRCET",
  "Malla Reddy Deemed to be University - MRDU",
  "Malla Reddy College of Engineering and Technology - MRCET",
  "Malla Reddy Engineering College for Women - MRECW",
  "Malla Reddy Institute of Technology and Science - MRITS",
  "Malla Reddy College of Engineering - MRCE",
  "Guru Nanak Institutions Technical Campus - GNITC",
  "Rishi MS Institute of Engineering and Technology for Women - MS Rishi",
  "ICFAI",
  "G. Narayanamma Institute of Technology and Science - GNITS",
  "Sridevi Women's Engineering College - SWEC",
  "Kommuri Pratap Reddy Institute of Technology - KPRIT",
  "CR Rao Advanced Institute of Mathematics, Statistics and Computer Science - AIMSCS",
  "London Management Academy - LMA",
  "Avinash College of Commerce - ACC",
  "Mahindra University",
  "Anurag University",
  "Aurora University",
  "Maturi Venkata Subba Rao Engineering College - MVSR",
  "Woxen University",
  "BITS Pilani Hyderabad",
  "Chaitanya (Deemed to be University)",
  "Hyderabad Institute of Technology and Management - HITAM",
  "Gandhi Institute of Technology and Management - GITAM",
  "Matrusri Engineering College - MECS",
  "Nalla Malla Reddy Engineering College - NMREC",
  "TKR College of Engineering and Technology - TKRC",
  "JB Institute of Engineering and Technology - JBIET",
  "Geethanjali College of Engineering and Technology - GCET",
  "Scient Institute of Technology - SCIENT",
  "Kalasalingam University",
  "Sathyabhama University",
  "Parul University",
  "SRM University",
  "Other",
] as const;

export const MAX_TEAM_SIZE = 5;

/** Where the browser keeps the private registration token between visits. */
export const TOKEN_STORAGE_KEY = "equinox_registration_token";
