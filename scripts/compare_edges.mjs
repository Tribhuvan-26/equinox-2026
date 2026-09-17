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

// In rightBlue:
// Starts at (1672, 622).
// Goes down to (-416, 274) along bottom edge, then returns from (-416, 274) back to (0, 0) along TOP edge.
// So the second half of rightBlue commands is the TOP edge!
const rbD = data.rightBlue.match(/d="([^"]+)"/)[1];
const rbCmds = parsePath(rbD);

let cur = { x: 0, y: 0 };
let passedMin = false;
const rbTopPts = [];

for (const cmd of rbCmds) {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] };
    if (cur.x <= -415) {
      passedMin = true;
    }
    if (passedMin) {
      // Mirrored to left side: x_mirror = -cur.x, y_mirror = cur.y + 622
      rbTopPts.push({ x: -cur.x, y: cur.y + 622 });
    }
  }
}

console.log('Right Blue Top Edge (mirrored, from far end back to x=0):');
console.log('Count:', rbTopPts.length);
console.log('First 5 (at far end):', rbTopPts.slice(0, 5));
console.log('Last 5 (at x=0):', rbTopPts.slice(-5));
