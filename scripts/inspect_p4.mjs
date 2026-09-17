import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// Let's check the top boundary of Path 4 in layer-static-back:
// Path 4: transform="translate(0,757)" fill="#242524"
// Starts at (0, 757).
// Let's print its points:
const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];
const p4D = staticPaths[3][1];

function parsePath(d) {
  const cmds = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    cmds.push({ type: match[1], args: match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) });
  }
  return cmds;
}

const p4Cmds = parsePath(p4D);
let cur = { x: 0, y: 757 };
const p4Pts = [{ ...cur }];
for (const cmd of p4Cmds) {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] + 757 };
    p4Pts.push({ ...cur });
    if (cmd.args[4] > 300) break;
  }
}

console.log('Path 4 (translate 0, 757) top points:');
console.log(p4Pts.slice(0, 10));
