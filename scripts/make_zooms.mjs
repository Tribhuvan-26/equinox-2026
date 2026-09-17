import fs from 'fs';

// Let's create an SVG that renders ONLY the bottom-left corner at 2x zoom and bottom-right at 2x zoom
const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8')
  .replace('&', '&amp;'); // fix the & issue for clean xml

const leftZoomSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 550 500 390" width="1000" height="780">
  <defs>
    ${svg.match(/<defs>([\s\S]*?)<\/defs>/)[1]}
  </defs>
  <rect width="1672" height="940" fill="#F7F1E5" />
  ${svg.match(/<g id="layer-static-back">[\s\S]*?<\/g>/)[0]}
  ${svg.match(/<g id="group-left-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
</svg>`;

const rightZoomSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1172 550 500 390" width="1000" height="780">
  <defs>
    ${svg.match(/<defs>([\s\S]*?)<\/defs>/)[1]}
  </defs>
  <rect width="1672" height="940" fill="#F7F1E5" />
  ${svg.match(/<g id="layer-static-back">[\s\S]*?<\/g>/)[0]}
  ${svg.match(/<g id="group-right-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
</svg>`;

fs.writeFileSync('scripts/left_zoom.svg', leftZoomSvg, 'utf8');
fs.writeFileSync('scripts/right_zoom.svg', rightZoomSvg, 'utf8');
console.log('Saved zoom svgs');
