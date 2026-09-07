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
};
