import fs from 'fs';

// Let's write a small script that extracts the exact path of:
// 1. layer-static-back (path 1: transform 0,623 and path 4: transform 0,757)
// 2. layer-left-blue-arc
// 3. layer-left-green-arc
// 4. layer-right-blue-arc
// 5. layer-right-green-arc

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// Let's create an isolated test SVG containing ONLY the background, static-back, left arcs, right arcs, and audience,
// so we can see it clearly and inspect what is going on!
const maskDefs = svg.match(/<defs>([\s\S]*?)<\/defs>/)[1];

const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1672 940" width="1672" height="940">
  <defs>
    ${maskDefs}
  </defs>
  <rect width="1672" height="940" fill="#F7F1E5" />
  ${svg.match(/<g id="layer-static-back">[\s\S]*?<\/g>/)[0]}
  ${svg.match(/<g id="group-left-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
  ${svg.match(/<g id="group-right-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
</svg>`;

fs.writeFileSync('scripts/isolated_arcs.svg', testSvg, 'utf8');
console.log('Saved scripts/isolated_arcs.svg');
