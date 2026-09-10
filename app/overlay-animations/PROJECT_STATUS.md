# Equinox 2026 Overlay Animations — Project Status

Last updated: 2026-09-09 — Startup Expo scene alignment, anatomy, and layout collisions resolved: removed right ceiling lamp and wire colliding with the EXPO flag (ensuring clear headroom); corrected step label bounds and isometric flush alignment on all 5 stairs ("IDEAS", "PRODUCTS", "PEOPLE", "OPPORTUNITIES", "GROWTH"); sculpted climber legs and shoe anatomy with planted heels/soles and crisp white sole accents.

## Architecture (stable — update only if actually changed)
- **Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, GSAP 3 (TimelineMax/TweenMax/gsap.timeline), Tailwind CSS, CSS Modules.
- **Folder Structure**:
  - `app/overlay-animations/index.ts`: Public API export (`OverlayAnimationHost`, `triggerAnimation`, `animationRegistry`, `OVERLAY_EVENTS`).
  - `app/overlay-animations/data/events.ts`: Static registry of event IDs and display titles.
  - `app/overlay-animations/animations/core/`:
    - `animationTypes.ts`: Contract definitions (`AnimationComponentProps`, `AnimationRegistry`, `AnimationTriggerPayload`).
    - `animationRegistry.ts`: Central component registry, global event dispatcher, and `OverlayAnimationHost`.
  - `app/overlay-animations/animations/events/[EventName]/`:
    - `[EventName]Animation.tsx`: Overlay shell, exit handling, skip button, and DOM refs.
    - `[EventName]Animation.module.css`: Scoped overlay and typography styling.
    - `[eventName]Timeline.ts`: Pure GSAP timeline builder.
    - `assets/`: Inline or dedicated vector SVGs for the event.
  - `app/overlay-animations/animations/events/Placeholder/`: Fallback component used for unassigned/in-progress events.
- **Global Lifecycle Contract**:
  - `OverlayAnimationHost` is mounted in root `app/layout.tsx`.
  - Triggers listen for custom DOM event `equinox:trigger-animation` dispatched via `triggerAnimation({ type: "event", event: "<id>" })`.
  - On complete or skip click, fires `onComplete()` / `onDismiss()`, gracefully killing active GSAP tweens and unmounting the overlay.
- **Standard 6-Phase Timeline Pattern**:
  1. *Phase 1 — Setup / Entrance*: Initial property locks and scene container entrance (`scale: 0.96 -> 1`, `opacity: 0 -> 1`).
  2. *Phase 2 — Structure / Banners*: Main structural elements drop/expand (e.g. vertical banners unfolding `scaleY: 0 -> 1`).
  3. *Phase 3 — Interaction / Text Reveal*: Stagger-reveal copy, badges, speech bubbles, and micro-motion lines.
  4. *Phase 4 — Clash / Feature Pop*: Central action/accent pop (e.g. lightning bolt clash with radial impact lines).
  5. *Phase 5 — Title & Meta Punch*: Title punch upward, date/venue stamps, mini bar graphs, and tagline.
  6. *Phase 6 — Resolution Hold & Exit*: Brief reading window (~0.8s) followed by fast fade-out and `onComplete()`.

## Event Status

| Event | Owner | Status | Notes |
|---|---|---|---|
| Spotlight | Me | Done | Full 6-phase GSAP timeline, mic/stage vector scene, skip button |
| Startup Poly | Me | Done | Isometric Monopoly board, dice roll, property cards, badge reveal |
| Hustle Mania | Me | Done | Repurposed expo scene with custom text, dual banner unfold, booth pulses |
| Crossroads | Unassigned | Done | Street/intersection arrows, directional signpost reveals |
| Pitch Deck | Unassigned | Done | Pitch presentation deck motif, chart bars, slide transitions |
| Startup Expo | Teammate | Done | Stairs-build concept (step 1-5), authentic vector person+flag, flush riser banners, restored dual side columns |
| Brand Battles | Teammate | Done | Mirrored podiums/speakers (#scene-base static), dual banner unfold, Space Grotesk text lines top-to-bottom, central lightning+VS pop with 6 impact lines, BRAND (black) + BATTLES (blue) upward punch, stamps & mini graphs, 0.8s hold |
| IPL Auction | Teammate | Done | Gavel strike, bidding paddle raise, player card reveal |
| Internship Drive | Teammate | Not Started | Currently mapped to placeholder animation |
| E-Cell Meet | Teammate | Not Started | Currently mapped to placeholder animation |

## Known Bugs Fixed (so we don't repeat them)
- [2026-09-06] Two-tone title text overlap — caused by hardcoded x-coordinates on separate text elements instead of a single text run with tspans. Fixed by using `text-anchor="middle"` + `getBBox()` for clip-path sizing.
- [2026-09-06] Animation not playing when triggered from event page — overlay host wasn't mounted globally in layout.tsx. Fixed by moving host to root layout.
- [2026-09-07] Double-vision text ghosting on auto-traced SVGs — auto-vectorizer generated duplicate anti-aliased edge paths. Fixed by cleaning duplicate ghost paths and enforcing spacing in asset generation.
- [2026-09-07] Inconsistent title wipe origins across events — Hustle Mania originally used converging fly-ins from opposite edges. Standardized to single text run wiping from same origin with ~0.1s stagger.
- [2026-09-09] Homepage hero illustration & ground shadow animated together — entire wrapper had `.animate-float`, causing ground shadow to bob. Fixed by moving shadow outside group as static element and animating illustration independently with increased vertical hover gap.
- [2026-09-09] Startup Expo booth scene replaced with stairs-build concept — restructured Base_Startup_expo.svg into named <g> layers (step-1...step-5, crack-debris, plant-left, plant-right, lamp-fixture, light-cone, person-flag-group). Enforced bottom-to-top scaleY with zero initial flash, staggered banner expansions with drop bounce, and synchronized light cone with person-flag landing.
- [2026-09-09] Startup Expo figure & banner alignment fix — extracted original vector line art for person+flag (backpack, raised arm, flagpole with EXPO flag, flat blue jacket, black pants, motion lines) directly from reference asset; eliminated semi-transparent rectangle glitch near top step; nested banner plates flush on step risers; restored dual side banner columns.
- [2026-09-09] Brand Battles layer ordering and SVG isolation — extracted static stage/speaker/plant paths for `#scene-base`, built dual vertical banners `#banner-left` / `#banner-right` that roll down behind floor plants without occluding leaf line art, replaced auto-vectorized banner text slivers with clean `Space Grotesk` `<text>` lines for smooth staggered top-to-bottom reveals, and connected full 6-phase GSAP timeline in `animationRegistry.ts`.
- [2026-09-09] Brand Battles typography & contrast fix — banner text originally fell back to black (#000000) due to unmapped CSS class names; tagline, date stamps, and corner badge had jagged/warped contours from raster auto-tracing. Fixed by setting explicit inline `fill="#FFFFFF"` on all banner lines and replacing auto-traced letter paths in `#tagline`, `#meta-left`, and `#meta-right` with crisp, anti-aliased `Space Grotesk` SVG `<text>` elements.
- [2026-09-09] Brand Battles speech bubble speaker overlap & title typography — previous auto-traced speech bubble paths extended into speakers' heads/faces (left bubble cut 28px into speaker head and rendered solid black; right bubble crossed speaker face by 25px). Reconstructed clean geometric speech bubbles in outer corridors with tails pointing towards speakers and 3 debate dots each (zero overlap). Replaced wobbly vector blobs for "BRAND BATTLES" with bold, razor-sharp `Space Grotesk` 900 typography tilted at -7.5deg.
- [2026-09-09] Startup Expo lamp collision, banner bounds, and climber anatomy — removed right ceiling lamp and wire hanging over the flag, ensuring 100% clear headroom; realigned bottom step banner ("IDEAS") flush inside isometric front riser; reduced fourth step banner ("OPPORTUNITIES") from 280px to 220px to eliminate overhang beyond step riser edges; sculpted climber feet to eliminate severed/distorted jagged spikes and loops, planting both feet cleanly on step treads with crisp white shoe soles.

## Open Questions / Pending Decisions
- Assets and creative direction pending for remaining placeholder events: `internship-drive` and `e-cell-meet`.

## Explicitly Out of Scope Right Now
- Mobile responsiveness (paused project-wide)
- AI/Gemini/Groq integration (not started)
- Any event not listed above
