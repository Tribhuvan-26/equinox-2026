import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];

const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 550 600 390" width="1200" height="780">
  <rect width="1672" height="940" fill="#F7F1E5" />
  <path d="${staticPaths[3][1]}" fill="purple" transform="${staticPaths[3][3]}" />
</svg>`;

fs.writeFileSync('scripts/test_path4.svg', testSvg, 'utf8');
