export interface EventDetail {
  slug: string;
  title: string;
  category: string;
  pageNumber: "05" | "06" | "07";
  headlineWordPair: {
    blackWord: string;
    whiteWord: string;
  };
  description: string;
  /** External application form, shown as an "Apply Now" button. */
  applyUrl?: string;
}

export const eventsData: Record<string, EventDetail> = {
  spotlight: {
    slug: "spotlight",
    title: "Spotlight",
    category: "Keynote & Insights",
    pageNumber: "05",
    headlineWordPair: {
      blackWord: "EVENT",
      whiteWord: "SPOTLIGHT",
    },
    description:
      "Spotlight features talk sessions by industry experts covering the latest trends across various fields. It gives students valuable insights into emerging ideas, industry developments, and new opportunities.",
  },
  crossroads: {
    slug: "crossroads",
    title: "Crossroads",
    category: "Case Competition",
    pageNumber: "05",
    headlineWordPair: {
      blackWord: "CASE",
      whiteWord: "CROSSROADS",
    },
    description:
      "Crossroads is a business case-study competition where teams analyse real-world business challenges and develop practical strategies. It helps participants improve their problem-solving, decision-making, and business skills.",
  },
  "startup-expo": {
    slug: "startup-expo",
    title: "Startup Expo",
    category: "Exhibition",
    pageNumber: "05",
    headlineWordPair: {
      blackWord: "STARTUP",
      whiteWord: "EXPO",
    },
    description:
      "Startup Expo provides a platform for startups to showcase their products, business ideas, and solutions to students. It helps startups gain visibility while giving students an opportunity to explore new ideas and businesses.",
  },
  "brand-battles": {
    slug: "brand-battles",
    title: "Brand Battles",
    category: "Competitive Debate",
    pageNumber: "05",
    headlineWordPair: {
      blackWord: "BRAND",
      whiteWord: "BATTLES",
    },
    description:
      "Brand Battles is a competitive debate between teams representing rival brands from the same sector. Participants defend their brands using real-time examples, data, and case studies while challenging their opponents' strategies.",
  },
  "ipl-auction": {
    slug: "ipl-auction",
    title: "IPL Auction",
    category: "Strategic Simulation",
    pageNumber: "05",
    headlineWordPair: {
      blackWord: "IPL",
      whiteWord: "AUCTION",
    },
    description:
      "IPL Auction is a simulated cricket auction where participants take on the role of team owners. They bid for players, manage their budgets, and build their own teams through strategic decision-making.",
  },
  "hustle-mania": {
    slug: "hustle-mania",
    title: "Hustle Mania",
    category: "Marketing & Sales",
    pageNumber: "06",
    headlineWordPair: {
      blackWord: "HUSTLE",
      whiteWord: "MANIA",
    },
    description:
      "Hustle Mania is a student-organized stall event where students sell products of their choice. Participants compete with others while developing their communication, persuasion, and business skills.",
    applyUrl: "https://forms.gle/mMH1Ptvo1GyKiZyX9",
  },
  "internship-drive": {
    slug: "internship-drive",
    title: "Internship Drive",
    category: "Career & Recruitment",
    pageNumber: "06",
    headlineWordPair: {
      blackWord: "INTERNSHIP",
      whiteWord: "DRIVE",
    },
    description:
      "Internship Drive connects students with startups and companies offering internship opportunities. It helps students explore career options, gain practical experience, build professional connections, and develop useful skills.",
  },
  "startup-poly": {
    slug: "startup-poly",
    title: "Startup Poly",
    category: "Business Gaming",
    pageNumber: "06",
    headlineWordPair: {
      blackWord: "STARTUP",
      whiteWord: "POLY",
    },
    description:
      "Startup Poly is a fast-paced business simulation game inspired by Monopoly. Participants build startups, compete in markets, manage finances, handle risks, and make strategic decisions based on real-world business situations.",
  },
  "e-cell-meet": {
    slug: "e-cell-meet",
    title: "E-Cell Meet",
    category: "Leadership & Networking",
    pageNumber: "06",
    headlineWordPair: {
      blackWord: "E-CELL",
      whiteWord: "MEET",
    },
    description:
      "E-Cell Meet brings together E-Cells from different colleges to connect, share ideas, and exchange experiences. It provides opportunities for students to build relationships, collaborate, and explore partnerships across campuses.",
  },
  "pitch-deck": {
    slug: "pitch-deck",
    title: "Pitch Deck",
    category: "Startup Pitching",
    pageNumber: "06",
    headlineWordPair: {
      blackWord: "PITCH",
      whiteWord: "DECK",
    },
    description:
      "Pitch Deck is a startup pitching platform where students present their ideas to investors, startup mentors, and industry experts. Participants receive valuable feedback and insights to help improve and develop their ideas.",
  },
  "standup-comedy": {
    slug: "standup-comedy",
    title: "Standup Comedy",
    category: "Entertainment",
    pageNumber: "07",
    headlineWordPair: {
      blackWord: "STANDUP",
      whiteWord: "COMEDY",
    },
    description:
      "Standup Comedy is an evening of live comedy at Equinox. Sit back after a day of pitching, bidding, and hustling, and unwind with sharp sets, campus humour, and plenty of laughs.",
  },
  "musical-night": {
    slug: "musical-night",
    title: "Musical Night",
    category: "Entertainment",
    pageNumber: "07",
    headlineWordPair: {
      blackWord: "MUSICAL",
      whiteWord: "NIGHT",
    },
    description:
      "Musical Night is a live band performance that brings Equinox to a close on a high note. Join fellow participants, organisers, and guests for an evening of music and celebration.",
  },
};

export const canonicalSlugs = [
  "spotlight",
  "crossroads",
  "startup-expo",
  "brand-battles",
  "ipl-auction",
  "hustle-mania",
  "internship-drive",
  "startup-poly",
  "e-cell-meet",
  "pitch-deck",
  "standup-comedy",
  "musical-night",
] as const;

export type CanonicalSlug = (typeof canonicalSlugs)[number];
