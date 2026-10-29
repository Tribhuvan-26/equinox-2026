export type PassType = "ipl" | "entertainment" | "premium";

export const IPL_PASS_FEE = 569;

/** Default fallback registration fee: ₹569 for IPL Auction Pass */
export const REGISTRATION_FEE = IPL_PASS_FEE;

export type PassOption = {
  id: PassType;
  name: string;
  price: number;
  badge: string;
  tagline: string;
  description: string;
  includedEvents: string[];
  highlights: string[];
  accessScope: string;
};

export const PASS_OPTIONS: Record<PassType, PassOption> = {
  ipl: {
    id: "ipl",
    name: "IPL Auction Pass",
    price: IPL_PASS_FEE,
    badge: "Official Pass",
    tagline: "IPL Auction + Musical Night + Stand-Up Comedy",
    description:
      "The IPL Auction Pass includes access to all three entertainment events: IPL Auction, Musical Night, and Stand-Up Comedy.",
    includedEvents: ["IPL Auction", "Musical Night", "Stand-Up Comedy"],
    highlights: [
      "Participation in the simulated IPL Auction bidding battle",
      "Access to Stand-Up Comedy (Day 1 · 30 Oct Evening)",
      "Access to Musical Night live band show (Day 2 · 31 Oct Evening)",
      "Register as a team (1–5 members) or individually",
    ],
    accessScope: "IPL Auction + Musical Night + Stand-Up Comedy",
  },
  entertainment: {
    id: "entertainment",
    name: "IPL Auction Pass",
    price: IPL_PASS_FEE,
    badge: "Official Pass",
    tagline: "IPL Auction + Musical Night + Stand-Up Comedy",
    description:
      "The IPL Auction Pass includes access to all three entertainment events: IPL Auction, Musical Night, and Stand-Up Comedy.",
    includedEvents: ["IPL Auction", "Musical Night", "Stand-Up Comedy"],
    highlights: [
      "Participation in the simulated IPL Auction bidding battle",
      "Access to Stand-Up Comedy (Day 1 · 30 Oct Evening)",
      "Access to Musical Night live band show (Day 2 · 31 Oct Evening)",
      "Register as a team (1–5 members) or individually",
    ],
    accessScope: "IPL Auction + Musical Night + Stand-Up Comedy",
  },
  premium: {
    id: "premium",
    name: "IPL Auction Pass",
    price: IPL_PASS_FEE,
    badge: "Official Pass",
    tagline: "IPL Auction + Musical Night + Stand-Up Comedy",
    description:
      "The IPL Auction Pass includes access to all three entertainment events: IPL Auction, Musical Night, and Stand-Up Comedy.",
    includedEvents: ["IPL Auction", "Musical Night", "Stand-Up Comedy"],
    highlights: [
      "Participation in the simulated IPL Auction bidding battle",
      "Access to Stand-Up Comedy (Day 1 · 30 Oct Evening)",
      "Access to Musical Night live band show (Day 2 · 31 Oct Evening)",
      "Register as a team (1–5 members) or individually",
    ],
    accessScope: "IPL Auction + Musical Night + Stand-Up Comedy",
  },
};

export const ACTIVE_PASS_TYPES: PassType[] = ["ipl"];

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
