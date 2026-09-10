# Equinox 2026 — Master Context & Project Status

## Overview
This document serves as the persistent context transfer file for Equinox 2026. It preserves the complete project architecture, overlay animation system, coding standards, and event roadmap across AI sessions.

---

## 1. System Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack, React 19)
- **Language**: TypeScript (strict type checking)
- **Styling**: Tailwind CSS + CSS Modules for animations
- **Motion/Animation**: GSAP 3 (Core + Timeline + ScrollTrigger), Framer Motion (for page micro-interactions)
- **Global Event Dispatch**: Custom DOM Events on `window` (`equinox:trigger-animation`)

### Folder Structure
```
equinox-2026/
├── app/
│   ├── layout.tsx                 # Root layout containing global OverlayAnimationHost
│   ├── page.tsx                   # Main editorial cover / homepage
│   ├── EventGraphics.tsx          # Shared editorial SVG vector artwork
│   ├── globals.css                # Global design system & keyframe rules
│   └── overlay-animations/        # Full overlay animation subsystem
│       ├── PROJECT_STATUS.md      # Living status log (updated after every task)
│       ├── index.ts               # Public exports
│       ├── data/
│       │   └── events.ts          # Static event IDs and titles
│       └── animations/
│           ├── core/
│           │   ├── animationTypes.ts      # TypeScript interfaces and props
│           │   └── animationRegistry.ts  # Component registry & OverlayAnimationHost
│           └── events/
│               ├── Spotlight/             # [Done]
│               ├── StartupPoly/           # [Done]
│               ├── HustleMania/           # [Done]
│               ├── Crossroads/            # [Done]
│               ├── PitchDeck/             # [Done]
│               ├── StartupExpo/           # [Done]
│               ├── IplAuction/            # [Done]
│               ├── BrandBattles/          # [Done]
│               ├── InternshipDrive/       # [Placeholder]
│               ├── ECellMeet/             # [Placeholder]
│               └── Placeholder/           # Fallback component for pending events
```

---

## 2. Overlay Animation Subsystem Lifecycle & Rules

### Lifecycle Contract
1. **Triggering**:
   Trigger any animation anywhere in client components via:
   ```ts
   import { triggerAnimation } from "@/app/overlay-animations";
   triggerAnimation({ type: "event", event: "spotlight" });
   ```
2. **Mounting**:
   `OverlayAnimationHost` in `app/layout.tsx` catches the event, mounts the corresponding component in a full-screen, high `z-index` (`z-50`) overlay container.
3. **Props Passed**:
   - `onComplete`: Callback invoked when timeline finishes to dismiss overlay.
   - `isDismissed`: Boolean flag indicating whether exit has been requested.
   - `onDismiss`: Dismiss handler for manual exit / skip button.
   - `skip`: Boolean to immediately abort/skip.

### Standard 6-Phase GSAP Timeline Pattern
Every event timeline (`*Timeline.ts`) strictly adheres to this structure:
- **Phase 1 — Setup**: Zero-duration property locks (`gsap.set`) on all elements (`opacity: 0`, clip-paths, transforms).
- **Phase 2 — Scene / Structure Entrance**: Background framing, trusses, banners, or stalls deploy with physical bounces/overshoots.
- **Phase 3 — Interaction / Detail Accents**: Bubbles pop in, glows/pulses activate, cards flip.
- **Phase 4 — Title Reveal**: Consistent single text run with `tspan`s wiping from a single origin (staggered ~0.1s).
- **Phase 5 — Resolution / Hold**: Brief static hold (~0.7s to 1.0s) for readability.
- **Phase 6 — Exit**: Fast fade/slide out, followed by invoking `onComplete()`.

---

## 3. Event Status Matrix

| Event Key | Event Name | Status | Details |
|---|---|---|---|
| `spotlight` | Spotlight | **Done** | Stage spotlight, microphone vector, full 6-phase timeline |
| `startup-poly` | Startup Poly | **Done** | Monopoly board 3D isometric layout, dice roll, property cards |
| `hustle-mania` | Hustle Mania | **Done** | Custom expo scene, dual unfolding banners, booth pulses, title wipe |
| `crossroads` | Crossroads | **Done** | Directional road signposts, animated arrows, street layout |
| `pitch-deck` | Pitch Deck | **Done** | Presentation slides, growth chart bars, investor pitch motifs |
| `startup-expo` | Startup Expo | **Done** | Stairs-build concept (steps 1-5); top-left lamp with clean headroom over flag (right lamp/wire eliminated); all 5 step labels flush-aligned within riser bounds without overhang; climber feet firmly planted with clean soles and zero distortion |
| `ipl-auction` | IPL Auction | **Done** | Gavel hit, bidding paddle raise, cricket player card reveal |
| `brand-battles` | Brand Battles | **Done** | Mirrored podiums/speakers (#scene-base static), dual banner unfold, Space Grotesk text lines top-to-bottom, central lightning+VS pop with 6 impact lines, BRAND (black) + BATTLES (blue) upward punch, stamps & mini graphs, 0.8s hold |
| `internship-drive` | Internship Drive | *Pending* | Mapped to placeholder, waiting for creative assets |
| `e-cell-meet` | E-Cell Meet | *Pending* | Mapped to placeholder, waiting for creative assets |

---

## 4. Key Design & Development Rules

1. **Title Pattern Consistency**:
   All event titles must be authored as a single text run with `tspan` elements wiping in from the **same origin** (staggered ~0.1s), not converging from opposite screen edges.
2. **Animation Decoupling (Object vs. Ground Shadow)**:
   When creating or refining floating illustrations with ground shadows (like the homepage hero book), never group the shadow ellipse under the floating `translateY` animation. Shadows must remain static on the ground while the object floats with a clear vertical gap.
3. **No Unstructured Path Fusions in SVGs**:
   Always ensure distinct elements (booths, figures, speech bubbles, steps) have independent IDs or separate `<g>` tags rather than being collapsed into a single giant path.
4. **Clean GSAP Teardown**:
   Always clean up and `.kill()` all active tweens and idle loops on component unmount or exit.
5. **Persistent Status Maintenance**:
   `app/overlay-animations/PROJECT_STATUS.md` and this `context.md` must be updated at the end of **every single prompt/task** before concluding.

---

## 5. Known Historical Fixes
- **Two-Tone Title Text Overlap**: Fixed by using `text-anchor="middle"` + `getBBox()` on a single text run with `tspan` elements instead of hardcoded coordinates on separate `<text>` tags.
- **Root Overlay Mounting**: Fixed animation trigger failure by elevating `OverlayAnimationHost` to `app/layout.tsx`.
- **Double-Vision SVG Ghosting**: Traced SVGs with anti-aliasing created duplicate faint paths; eliminated by enforcing vector path deduplication.
- **Hero Floating Illustration Ground Shadow**: Fixed by separating the static ground ellipse from the bobbing book group in `EventGraphics.tsx` and moving container down via `lg:mt-24` in `page.tsx`.
- **Startup Expo Stairs-Build Architecture**: Restructured raw SVG into 5 layered stairs (`step-1` to `step-5`), lamp-fixture, newly injected `light-cone`, crack-debris, side plants, date-tag, logo-badge, single-origin title-text, and `person-flag-group`. Prevented any pop-in flash by locking `scaleY: 0` from bottom baseline, enforced strict sequential bottom-to-top stair build, guaranteed each banner's text only appears after its banner shape settles, and synchronized light cone shine with the character-flag landing on step 5.
- **Startup Expo Vector Figure Extraction & Flush Riser Alignment**: Extracted the exact flat-vector line art for the person+flag figure directly from the reference asset without redrawing, including backpack, raised arm, flagpole with blue triangular "EXPO" flag, flat blue jacket, black pants, shoes, and motion lines, positioned flush on the step-5 top landing under the lamp. Nested banner plates flush against step risers, eliminated the floating semi-transparent rectangle glitch near the top step, and restored the dual side banner columns as authentic SVG hanging banners.
- **Brand Battles SVG Sequence & Layer Isolation**: Extracted and isolated 12 discrete layers (`#scene-base`, `#banner-left`, `#banner-right`, `#banner-text-left`, `#banner-text-right`, `#lightning-vs`, `#title-brand`, `#title-battles`, `#tagline`, `#meta-left`, `#meta-right`, `#stats-graphs`). Preserved pristine `#scene-base` artwork (mirrored podiums, speakers, floor blue runners, plants, hanging lamps) completely static. Layered vertical banners behind floor plant line art, replaced auto-vectorized banner text slivers with clean `Space Grotesk` `<text>` lines with top-to-bottom `0.08s` stagger, animated central lightning clashing bolt with 6 radial impact lines, punched up BRAND and BATTLES titles, popped corner stamps and mini bar graphs, held for `0.8s`, and connected into `animationRegistry.ts`.
- **Brand Battles Clean Typography & High-Contrast Banner Polish**: Eliminated dark text fallback on deep blue banners by enforcing explicit inline `fill="#FFFFFF"` on all text and underline elements (`IDEAS`, `STRATEGY`, `CREATIVITY`, `PERSUASION`, `IMPACT` and `THINK`, `PITCH`, `DEBATE`, `COMPETE`, `WIN`). Replaced raster-traced, distorted path blobs in `#tagline` with clean, crisp `Space Grotesk` text (`IDEAS CLASH   BRANDS GROW`, rotated -7.5° under BATTLES), modernized top-left stamp `#meta-left` (`THE EQUINOX 2.0`), and sharpened top-right date/venue stamp `#meta-right` (`30 - 31 OCT / MLRIT`).
- **Brand Battles Speech Bubble Speaker Clearance & Title Reconstruction**: Rebuilt the debate speech bubbles in `#stats-graphs` as clean geometric rounded-pill SVG callouts with directional tails and 3 white debate dots. Fixed left speech bubble which previously cut 28px into the left speaker's head/hair and rendered as a solid black wedge. Fixed right speech bubble which cut 25px across the right speaker's forehead and face. Repositioned both speech bubbles into natural negative space corridors (`x: 215..305` and `x: 1150..1237`) with tails pointing directly at each speaker (zero speaker/banner overlap). Replaced jagged auto-traced letter paths for "BRAND BATTLES" with bold, punchy `Space Grotesk` 900 display typography (`font-weight: 900`, `stroke-width: 5px`, `paint-order: stroke fill`, rotated -7.5° to match tagline rhythm).

