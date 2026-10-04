# IPL Auction Animation Component

This directory contains the componentized, animatable SVG banner for the **IPL AUCTION** scene (viewBox `0 0 1200 700`).

## File Structure

```
ipl-auction-animation/
  ├── index.html            -- Full-width, responsive web presentation scaling via SVG viewBox
  ├── scene.svg             -- Standalone componentized SVG file
  ├── styles/
  │   ├── theme.css         -- Color variables (--bg, --navy, --blue, --gold, --pink, --white)
  │   └── animations.css    -- All isolated @keyframes and animation rules
  └── README.md             -- Architecture and animation reference
```

## Component Breakdown (scene.svg)

| Element ID / Class | Object Description | Visual Treatment |
|---|---|---|
| `#background` (`.bg`) | Cream base rectangle (`1200x700`) | Filled with `var(--bg)` (`#faf3e3`) |
| `#decor-arcs` | Sweeping accent curves | Stroked with `var(--gold)` at `opacity="0.55"` |
| `#banner-left` | "10 TEAMS" left pennant | Royal blue banner with white typography and gold bar |
| `#banner-right` | "1 CHAMPION" right pennant | Royal blue banner with white typography and gold bar |
| `#headline` | "IPL AUCTION" display title | Bold navy display text with gold curved swoosh |
| `#budget-pill` | "BUDGET ₹120 CR PER TEAM" | Rounded pill container (`rx="29"`) with gold amount |
| `#team-row` | 10 team slots (`data-team="1"` to `"10"`) | Badges with gold trim ring and "₹120 Cr" price pills |
| `#stage-people` | Stage group with auctioneer, podium, bidder | Atomic base64 illustration (`513x216`) |
| `#audience` | Crowd row at bottom edge | Navy head silhouettes with blue stadium railing |

## Active Animations (styles/animations.css)

| Animation Name | Target Selector | Timing & Easing | Behavior |
|---|---|---|---|
| `sway` | `#banner-left`, `#banner-right` | `4s ease-in-out infinite` (right reversed) | Subtle hanging banner pendulum rotation (`0° -> 1.5° -> 0°`) from pole top |
| `popIn` | `.team-slot` (`data-team="1"..."10"`) | `0.5s ease-out both`, staggered `0.05s - 0.50s` | Upward scale and opacity reveal for all 10 team slots |
| `bob` | `#stage-people` | `3.2s ease-in-out infinite` | Subtle vertical bobbing translation (`0 -> -6px -> 0`) |
| `stageShadowPulse` | `#stage-people image` | `3.2s ease-in-out infinite` | Dynamic drop-shadow pulse synchronized with bob height for 3D elevation depth |
| `headlinePulse` | `#headline` | `3s ease-in-out infinite` | Gentle breathing opacity pulse (`1.0 -> 0.85 -> 1.0`) |

## Maintainability Guide

- **Change animation speed / angle / timing**: Edit [`styles/animations.css`](file:///styles/animations.css). No need to touch `scene.svg` or `index.html`.
- **Change color palette**: Edit [`styles/theme.css`](file:///styles/theme.css) to adjust `--bg`, `--navy`, `--blue`, `--gold`, `--pink`, or `--white`.
- **Standalone rendering**: Both [`scene.svg`](file:///scene.svg) and [`index.html`](file:///index.html) render standalone with zero external network dependencies.
