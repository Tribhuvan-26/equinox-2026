import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8')
  .replace('&', '&amp;');

// Let's create an SVG that renders ONLY the left side (viewBox 0 500 650 440)
// with the entire SVG (defs, static-back, arcs, people-podium)
const fullLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 500 650 440" width="1300" height="880">
  <defs>
    ${svg.match(/<defs>([\s\S]*?)<\/defs>/)[1]}
  </defs>
  <rect width="1672" height="940" fill="#F7F1E5" />
  ${svg.match(/<g id="layer-static-back">[\s\S]*?<\/g>/)[0]}
  ${svg.match(/<g id="group-left-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
  ${svg.match(/<g id="layer-people-podium-static">[\s\S]*?<\/g>\s*<\/svg>/)[0].replace('</svg>', '')}
</svg>`;

fs.writeFileSync('scripts/full_left_original.svg', fullLeftSvg, 'utf8');
console.log('Saved scripts/full_left_original.svg');
