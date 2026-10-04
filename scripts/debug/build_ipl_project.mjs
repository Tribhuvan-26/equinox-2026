import fs from 'fs';
import path from 'path';

const projectDir = path.resolve('ipl-auction-animation');
const stylesDir = path.join(projectDir, 'styles');
const srcSvgPath = path.resolve('app/overlay-animations/animations/events/IplAuction/scene.svg');

if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });
if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true });

// 1. theme.css
const themeCss = `/* ==========================================================================
   IPL Auction Animation Theme Tokens
   ========================================================================== */
:root {
  --bg: #faf3e3;
  --navy: #0d1b3e;
  --blue: #2450d8;
  --gold: #f2b73a;
  --pink: #e0357a;
  --white: #ffffff;
}

.bg { fill: var(--bg); }
.navy { fill: var(--navy); }
.blue { fill: var(--blue); }
.gold { fill: var(--gold); }
.pink { fill: var(--pink); }
.white { fill: var(--white); }
`;

fs.writeFileSync(path.join(stylesDir, 'theme.css'), themeCss, 'utf8');
console.log('Created styles/theme.css');

// 2. animations.css
const animationsCss = `/* ==========================================================================
   IPL Auction Animation Keyframes & Bindings
   All timing, easing, and keyframes are isolated here.
   ========================================================================== */

/* 1. Hanging Pennants Sway */
@keyframes sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(1.5deg);
  }
}

#banner-left {
  transform-origin: 100px 30px;
  animation: sway 4s ease-in-out infinite;
}

#banner-right {
  transform-origin: 1100px 30px;
  animation: sway 4s ease-in-out infinite reverse;
}

/* 2. Team Slots Sequential Pop-In */
@keyframes popIn {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.team-slot {
  transform-origin: center;
  animation: popIn 0.5s ease-out both;
}

.team-slot:nth-child(1),
.team-slot-pos:nth-child(1) .team-slot,
.team-slot[data-team="1"] {
  animation-delay: 0.05s;
}

.team-slot:nth-child(2),
.team-slot-pos:nth-child(2) .team-slot,
.team-slot[data-team="2"] {
  animation-delay: 0.10s;
}

.team-slot:nth-child(3),
.team-slot-pos:nth-child(3) .team-slot,
.team-slot[data-team="3"] {
  animation-delay: 0.15s;
}

.team-slot:nth-child(4),
.team-slot-pos:nth-child(4) .team-slot,
.team-slot[data-team="4"] {
  animation-delay: 0.20s;
}

.team-slot:nth-child(5),
.team-slot-pos:nth-child(5) .team-slot,
.team-slot[data-team="5"] {
  animation-delay: 0.25s;
}

.team-slot:nth-child(6),
.team-slot-pos:nth-child(6) .team-slot,
.team-slot[data-team="6"] {
  animation-delay: 0.30s;
}

.team-slot:nth-child(7),
.team-slot-pos:nth-child(7) .team-slot,
.team-slot[data-team="7"] {
  animation-delay: 0.35s;
}

.team-slot:nth-child(8),
.team-slot-pos:nth-child(8) .team-slot,
.team-slot[data-team="8"] {
  animation-delay: 0.40s;
}

.team-slot:nth-child(9),
.team-slot-pos:nth-child(9) .team-slot,
.team-slot[data-team="9"] {
  animation-delay: 0.45s;
}

.team-slot:nth-child(10),
.team-slot-pos:nth-child(10) .team-slot,
.team-slot[data-team="10"] {
  animation-delay: 0.50s;
}

/* 3. Stage People Vertical Floating Bob */
@keyframes bob {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

#stage-people {
  animation: bob 3.2s ease-in-out infinite;
}

/* 4. Stage People Subtle Looping Drop-Shadow Elevation Pulse */
@keyframes stageShadowPulse {
  0%, 100% {
    filter: drop-shadow(0 4px 8px rgba(13, 27, 62, 0.15));
  }
  50% {
    filter: drop-shadow(0 12px 18px rgba(13, 27, 62, 0.34));
  }
}

#stage-people image {
  animation: stageShadowPulse 3.2s ease-in-out infinite;
}

/* 5. Headline Breathing Opacity Pulse */
@keyframes headlinePulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

#headline {
  animation: headlinePulse 3s ease-in-out infinite;
}
`;

fs.writeFileSync(path.join(stylesDir, 'animations.css'), animationsCss, 'utf8');
console.log('Created styles/animations.css');

// 3. Process scene.svg
const rawSvg = fs.readFileSync(srcSvgPath, 'utf8');

// Replace the keyframes from the inline <style> block in scene.svg with an import to styles/animations.css
// Finding the <style>...</style> content
const styleStart = rawSvg.indexOf('<style>');
const styleEnd = rawSvg.indexOf('</style>');

if (styleStart === -1 || styleEnd === -1) {
  throw new Error('Could not find <style> block in source scene.svg');
}

const cleanStyleContent = `<style>
:root{
  --bg:#faf3e3;
  --navy:#0d1b3e;
  --blue:#2450d8;
  --gold:#f2b73a;
  --pink:#e0357a;
  --white:#ffffff;
}
.bg{fill:var(--bg)}
.navy{fill:var(--navy)}
.blue{fill:var(--blue)}
.gold{fill:var(--gold)}
.pink{fill:var(--pink)}
.white{fill:var(--white)}

@import url('styles/theme.css');
@import url('styles/animations.css');
</style>`;

let newSvg = rawSvg.substring(0, styleStart) + cleanStyleContent + rawSvg.substring(styleEnd + '</style>'.length);

// Also insert xml-stylesheet processing instructions right after the xml declaration
const xmlDeclEnd = newSvg.indexOf('?>');
if (xmlDeclEnd !== -1) {
  const pIs = `\n<?xml-stylesheet type="text/css" href="styles/theme.css"?>\n<?xml-stylesheet type="text/css" href="styles/animations.css"?>`;
  newSvg = newSvg.substring(0, xmlDeclEnd + 2) + pIs + newSvg.substring(xmlDeclEnd + 2);
}

fs.writeFileSync(path.join(projectDir, 'scene.svg'), newSvg, 'utf8');
console.log('Created ipl-auction-animation/scene.svg');

// 4. Create index.html
// Extract the <svg ...> to </svg> body for responsive inlining, or serve via responsive container
const svgTagStart = newSvg.indexOf('<svg');
const svgTagEnd = newSvg.lastIndexOf('</svg>') + '</svg>'.length;
const inlineSvgContent = newSvg.substring(svgTagStart, svgTagEnd);

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IPL Auction Banner Animation</title>
  <link rel="stylesheet" href="styles/theme.css">
  <link rel="stylesheet" href="styles/animations.css">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      height: 100%;
      min-height: 100vh;
      background-color: var(--bg, #faf3e3);
      color: var(--navy, #0d1b3e);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow-x: hidden;
    }

    /* Full-width responsive container scaling strictly by SVG viewBox (1200x700) */
    .banner-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* SVG scales responsively to container width while preserving 1200:700 aspect ratio */
    .scene-svg {
      width: 100%;
      height: auto;
      max-width: 100%;
      display: block;
      aspect-ratio: 1200 / 700;
    }
  </style>
</head>
<body>
  <main class="banner-container">
    ${inlineSvgContent}
  </main>
</body>
</html>
`;

fs.writeFileSync(path.join(projectDir, 'index.html'), indexHtml, 'utf8');
console.log('Created ipl-auction-animation/index.html');

// 5. Create README.md
const readmeMd = `# IPL Auction Animation Component

This directory contains the componentized, animatable SVG banner for the **IPL AUCTION** scene (viewBox \`0 0 1200 700\`).

## File Structure

\`\`\`
ipl-auction-animation/
  ├── index.html            -- Full-width, responsive web presentation scaling via SVG viewBox
  ├── scene.svg             -- Standalone componentized SVG file
  ├── styles/
  │   ├── theme.css         -- Color variables (--bg, --navy, --blue, --gold, --pink, --white)
  │   └── animations.css    -- All isolated @keyframes and animation rules
  └── README.md             -- Architecture and animation reference
\`\`\`

## Component Breakdown (scene.svg)

| Element ID / Class | Object Description | Visual Treatment |
|---|---|---|
| \`#background\` (\`.bg\`) | Cream base rectangle (\`1200x700\`) | Filled with \`var(--bg)\` (\`#faf3e3\`) |
| \`#decor-arcs\` | Sweeping accent curves | Stroked with \`var(--gold)\` at \`opacity="0.55"\` |
| \`#banner-left\` | "10 TEAMS" left pennant | Royal blue banner with white typography and gold bar |
| \`#banner-right\` | "1 CHAMPION" right pennant | Royal blue banner with white typography and gold bar |
| \`#headline\` | "IPL AUCTION" display title | Bold navy display text with gold curved swoosh |
| \`#budget-pill\` | "BUDGET ₹120 CR PER TEAM" | Rounded pill container (\`rx="29"\`) with gold amount |
| \`#team-row\` | 10 team slots (\`data-team="1"\` to \`"10"\`) | Badges with gold trim ring and "₹120 Cr" price pills |
| \`#stage-people\` | Stage group with auctioneer, podium, bidder | Atomic base64 illustration (\`513x216\`) |
| \`#audience\` | Crowd row at bottom edge | Navy head silhouettes with blue stadium railing |

## Active Animations (styles/animations.css)

| Animation Name | Target Selector | Timing & Easing | Behavior |
|---|---|---|---|
| \`sway\` | \`#banner-left\`, \`#banner-right\` | \`4s ease-in-out infinite\` (right reversed) | Subtle hanging banner pendulum rotation (\`0° -> 1.5° -> 0°\`) from pole top |
| \`popIn\` | \`.team-slot\` (\`data-team="1"..."10"\`) | \`0.5s ease-out both\`, staggered \`0.05s - 0.50s\` | Upward scale and opacity reveal for all 10 team slots |
| \`bob\` | \`#stage-people\` | \`3.2s ease-in-out infinite\` | Subtle vertical bobbing translation (\`0 -> -6px -> 0\`) |
| \`stageShadowPulse\` | \`#stage-people image\` | \`3.2s ease-in-out infinite\` | Dynamic drop-shadow pulse synchronized with bob height for 3D elevation depth |
| \`headlinePulse\` | \`#headline\` | \`3s ease-in-out infinite\` | Gentle breathing opacity pulse (\`1.0 -> 0.85 -> 1.0\`) |

## Maintainability Guide

- **Change animation speed / angle / timing**: Edit [\`styles/animations.css\`](file:///styles/animations.css). No need to touch \`scene.svg\` or \`index.html\`.
- **Change color palette**: Edit [\`styles/theme.css\`](file:///styles/theme.css) to adjust \`--bg\`, \`--navy\`, \`--blue\`, \`--gold\`, \`--pink\`, or \`--white\`.
- **Standalone rendering**: Both [\`scene.svg\`](file:///scene.svg) and [\`index.html\`](file:///index.html) render standalone with zero external network dependencies.
`;

fs.writeFileSync(path.join(projectDir, 'README.md'), readmeMd, 'utf8');
console.log('Created ipl-auction-animation/README.md');
console.log('Setup complete!');
