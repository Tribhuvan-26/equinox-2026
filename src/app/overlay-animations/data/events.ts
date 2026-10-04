// app/overlay-animations/data/events.ts

export interface OverlayEventMetadata {
  id: string;
  title: string;
}

export const OVERLAY_EVENTS: Record<string, OverlayEventMetadata> = {
  spotlight: {
    id: "spotlight",
    title: "Spotlight",
  },
  "startup-poly": {
    id: "startup-poly",
    title: "Startup Poly",
  },
  "ipl-auction": {
    id: "ipl-auction",
    title: "IPL Auction",
  },
  "hustle-mania": {
    id: "hustle-mania",
    title: "Hustle Mania",
  },
  crossroads: {
    id: "crossroads",
    title: "Cross Roads",
  },
  "pitch-deck": {
    id: "pitch-deck",
    title: "Pitch Deck",
  },
  "startup-expo": {
    id: "startup-expo",
    title: "Startup Expo",
  },
  "brand-battles": {
    id: "brand-battles",
    title: "Brand Battles",
  },
  "e-cell-meet": {
    id: "e-cell-meet",
    title: "E-Cell Meet",
  },
  "internship-drive": {
    id: "internship-drive",
    title: "Internship Drive",
  },
};
