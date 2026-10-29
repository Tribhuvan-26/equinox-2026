export type PassType = "premium" | "ipl";

export const PREMIUM_PASS_FEE = 769;
export const IPL_PASS_FEE = 569;

/** Default fallback registration fee: ₹769 for Premium Pass */
export const REGISTRATION_FEE = PREMIUM_PASS_FEE;

export type PassFeature = {
  text: string;
  included: boolean;
};

export type PassOption = {
  id: PassType;
  name: string;
  price: number;
  badge: string;
  tagline: string;
  description: string;
  includedEvents: string[];
  features: PassFeature[];
  accessScope: string;
};

export const PASS_OPTIONS: Record<PassType, PassOption> = {
  premium: {
    id: "premium",
    name: "Premium Pass",
    price: PREMIUM_PASS_FEE,
    badge: "ALL-ACCESS",
    tagline: "All 10 Sub-Events + Night Events",
    description:
      "Full summit all-access pass covering all 10 official competitions, keynote talks, and expo exhibits.",
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
    features: [
      {
        text: "Access to all sub-events (Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, Pitch Deck)",
        included: true,
      },
      {
        text: "Stand-up comedy & musical night access included",
        included: true,
      },
      {
        text: "Full 2-day summit delegate kit & certification eligibility",
        included: true,
      },
    ],
    accessScope: "All 10 Sub-Events + Night Events",
  },
  ipl: {
    id: "ipl",
    name: "IPL Pass",
    price: IPL_PASS_FEE,
    badge: "SPECIALIZED PASS",
    tagline: "IPL Auction + Stand-up Comedy + Musical Night",
    description:
      "Tailored pass giving exclusive access to the IPL Auction along with the evening entertainment events.",
    includedEvents: ["IPL Auction", "Stand-Up Comedy", "Musical Night"],
    features: [
      {
        text: "Participation in the simulated IPL Auction bidding battle",
        included: true,
      },
      {
        text: "Access to stand-up comedy show",
        included: true,
      },
      {
        text: "Access to musical night",
        included: true,
      },
      {
        text: "No participation in other sub-events (Spotlight, Crossroads, Pitch Deck, Hustle Mania, etc.)",
        included: false,
      },
    ],
    accessScope: "IPL Auction + Stand-up Comedy + Musical Night",
  },
};

export const ACTIVE_PASS_TYPES: PassType[] = ["premium", "ipl"];

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
