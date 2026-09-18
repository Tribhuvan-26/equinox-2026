import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];

// Path 1 (transform 0, 623) and Path 4 (transform 0, 757)
// Let's create an SVG showing only Path 1, only Path 4, and Left Arcs!
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 550 600 390" width="1200" height="780">
  <rect width="1672" height="940" fill="#F7F1E5" />
  <path d="${staticPaths[0][1]}" fill="red" opacity="0.5" transform="${staticPaths[0][3]}" />
  <path d="${staticPaths[3][1]}" fill="black" opacity="0.5" transform="${staticPaths[3][3]}" />
  ${svg.match(/<g id="group-left-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
</svg>`;

fs.writeFileSync('scripts/test_static_left.svg', testSvg, 'utf8');
console.log('Saved scripts/test_static_left.svg');
