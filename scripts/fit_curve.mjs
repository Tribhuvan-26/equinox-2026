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

// Right Blue mirrored points:
const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);

// Top of blue (Boundary 1) from x=0 to x=416:
// In rightBlue, command 61 is (0, 0) -> mirrored (0, 622).
// Tracing backwards from 61 down to 34:
const topPts = [];
let cur = { x: 0, y: 0 };
// Compute all points of rightBlue in absolute coords:
const allPts = [];
let c = { x: 0, y: 0 };
for (const cmd of rbCmds) {
  if (cmd.type === 'C') {
    c = { x: -cmd.args[4], y: cmd.args[5] + 622 };
    allPts.push({ ...c, cp1: { x: -cmd.args[0], y: cmd.args[1] + 622 }, cp2: { x: -cmd.args[2], y: cmd.args[3] + 622 } });
  }
}

// The top edge is in the second half of allPts (from minX back to x=0)
const minIdx = allPts.findIndex(p => p.x >= 415);
const topEdge = allPts.slice(minIdx);
console.log('Top edge points count:', topEdge.length);
console.log('Start (tip):', topEdge[0]);
console.log('End (x=0):', topEdge[topEdge.length - 1]);

// Bottom edge of blue is in the first half of allPts (from x=0 to minX)
const bottomEdge = allPts.slice(0, minIdx + 1);
console.log('\nBottom edge points count:', bottomEdge.length);
console.log('Start (x=0):', bottomEdge[0]);
console.log('End (tip):', bottomEdge[bottomEdge.length - 1]);
