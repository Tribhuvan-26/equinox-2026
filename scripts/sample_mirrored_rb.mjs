import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

function parsePath(d) {
  const cmds = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    cmds.push({ type: match[1], args: match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) });
  }
  return cmds;
}

// Let's sample the top curve of rightBlue (mirrored to x=0)
// and bottom curve of rightBlue (mirrored to x=0)
// and bottom curve of rightGreen (mirrored to x=0)

const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);

// Absolute coordinates of mirrored Right Blue:
// rb: starts at (1672, 622). Mirrored: x_mirrored = -(x - 1672) = 1672 - x.
// Top curve goes from (0, 622) to (416, 896).
// Let's sample (x, y) along the top curve:
const allPts = [];
for (const cmd of rbCmds) {
  if (cmd.type === 'C') {
    allPts.push({ x: -cmd.args[4], y: cmd.args[5] + 622 });
  }
}

console.log('allPts length:', allPts.length);
// print every 3rd point of top edge
const minIdx = allPts.findIndex(p => p.x >= 415);
console.log('Top edge points:');
for (let i = allPts.length - 1; i >= minIdx; i -= 2) {
  console.log(`x=${allPts[i].x.toFixed(1)}, y=${allPts[i].y.toFixed(1)}`);
}

console.log('\nBottom edge of blue / Top edge of green:');
for (let i = 0; i <= minIdx; i += 2) {
  console.log(`x=${allPts[i].x.toFixed(1)}, y=${allPts[i].y.toFixed(1)}`);
}
