# Equinox 2026 AI Chatbot Overlay

A self-contained, modular, floating chatbot overlay designed specifically for **The Equinox 2026 (E-Summit 2.0)** at MLRIT Hyderabad. It embodies the official event brochure aesthetic (Electric Royal Cobalt Blue, Bold Editorial Black, and Stark White) and features custom **GSAP animations** for in-chat event card reveals.

---

## 📁 Architecture & File Structure

All chatbot code is completely isolated within this directory:

```
chatbot/
├── components/
│   ├── ChatbotOverlay.tsx     # Root floating trigger button + window container lifecycle
│   ├── ChatWindow.tsx         # Main chat window with header, scroller, loading state
│   ├── ChatMessage.tsx        # Message bubble with markdown formatting & embedded event card
│   ├── ChatInput.tsx          # Text input bar with Enter detection & send trigger
│   ├── QuickActions.tsx       # Prompt suggestion chips for instant event exploration
│   ├── EventCard.tsx          # In-chat interactive card with embedded GSAP event animation
│   └── EventDetail.tsx        # Full slide-over drawer showing confirmed brochure event particulars
├── animations/
│   ├── chatAnimations.ts      # GSAP open/close window, trigger pulse, and message entry timelines
│   └── eventAnimations.ts     # 10 custom GSAP event animations (Spotlight beam, IPL counter, etc.)
├── data/
│   ├── events.ts              # Local source of truth for the 10 official brochure sub-events
│   └── responses.ts           # Offline mock intelligence engine matching brochure queries
├── styles/
│   └── chatbot.css            # Scoped design tokens, risograph print texture, and animations
├── index.ts                   # Public exports (`export { ChatbotOverlay } from './components/...'`)
└── README.md                  # This documentation & integration guide
```

---

## 🚀 How to Transfer & Integrate Into Any Website

This feature is **100% self-contained**. To use it in any React or Next.js application:

### Step 1: Copy the `chatbot/` directory
Copy the entire `chatbot/` folder directly into your project's root or `components/` directory.

### Step 2: Ensure Peer Dependencies
Ensure you have `gsap` and `lucide-react` installed:
```bash
npm install gsap @gsap/react lucide-react
```

### Step 3: Mount in Layout or Page
Import and mount `<ChatbotOverlay />` in your root layout or main page:

```tsx
import { ChatbotOverlay } from "@/chatbot";

export default function Layout({ children }) {
  return (
    <div>
      <main>{children}</main>
      
      {/* Floating Equinox AI Overlay */}
      <ChatbotOverlay />
    </div>
  );
}
```

---

## 🎨 Design System & Visual Direction

- **Primary Ground:** Electric Royal Cobalt Blue (`#174ae8`), Deep Navy (`#0c2b94`), Stark White (`#ffffff`), and Bold Editorial Black (`#0d0e15`).
- **Textures:** Custom risograph print grain, subtle blueprint line accents, and the `# WHERE PASSION MEETS PERSEVERANCE` badge.
- **No generic purple SaaS/AI styling** and **no generic ChatGPT clones**.

---

## ⚡ GSAP Micro-Animations

Each sub-event has its own signature visual animation when rendered inside a chat card:

| Event | GSAP Signature Animation | Visual Concept |
| :--- | :--- | :--- |
| **Spotlight** | `playSpotlightAnimation` | Radial cone beam sweeps across from -32° to +32° with glow pulse |
| **Crossroads** | `playCrossroadsAnimation` | Horizontal and vertical strategy axes cross with an impact flash |
| **Startup Expo** | `playStartupExpoAnimation` | Exhibition booth door unfolds with an ascending rocket propulsion spark |
| **Brand Battles** | `playBrandBattlesAnimation` | Opposing brand shields slide together and clash at the center strike |
| **IPL Auction** | `playIPLAuctionAnimation` | Real-time bid counter rapidly rolls up (₹20L → ₹12Cr!) with gavel strike |
| **Hustle Mania** | `playHustleManiaAnimation` | Stacked product price-tag cards shuffle and snap into place |
| **Internship Drive**| `playInternshipDriveAnimation`| Connecting tracer line links candidate to startup company node |
| **Startup Poly** | `playStartupPolyAnimation` | 3D isometric dice tumbles down and lands on enterprise board tile |
| **E-Cell Meet** | `playECellMeetAnimation` | Distributed network nodes sequentially illuminate around central hub |
| **Pitch Deck** | `playPitchDeckAnimation` | Ascending valuation bar chart surges up with slide tilt & star highlight |

---

## 💡 Grounded Event Information (Brochure Source of Truth)

All event cards and mock intelligence strictly adhere to the official brochure:
- **Confirmed Dates:** 30 - 31 OCT 2026
- **Confirmed Venue:** MLR Institute of Technology, Dundigal, Hyderabad
- **Student Coordinators:** Shyam (+91 93900 06806), Mahima (+91 94933 62006), Sanjana (+91 82084 99746), Adithya (+91 91822 40970)
- **10 Official Sub-Events:** Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, Pitch Deck.
- *Unannounced details are clearly tagged as "Releasing soon" rather than invented.*

---

## 🔌 Future AI / Backend Hookup

When you are ready to connect Google Gemini or Groq:
1. Open `chatbot/data/responses.ts`.
2. Replace `getBotResponse(query)` with an async fetch call to your `/api/chat` backend endpoint.
3. Pass through the structured `eventCard` metadata from the API response to preserve the GSAP interactive card triggers.
