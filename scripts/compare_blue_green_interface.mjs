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

const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);
const rgCmds = parsePath(data.rightGreen.match(/d="([^"]+)"/)[1]);

// Bottom boundary of RB: commands 1 to 34
// Top boundary of RG: commands 57 to 85 (reversed, returning to 0,0)
const rbPts = [];
let cur = { x: 1672, y: 622 + 80 };
rbPts.push({ ...cur });
for (let i = 2; i <= 34; i++) {
  const c = rbCmds[i];
  if (c.type === 'C') {
    cur = { x: 1672 + c.args[4], y: 622 + c.args[5] };
    rbPts.push({ ...cur });
  }
}

const rgTopPts = [];
cur = { x: 1672, y: 702 };
for (let i = rgCmds.length - 2; i >= 57; i--) {
  const c = rgCmds[i];
  // c is C dx1 dy1 dx2 dy2 dx3 dy3
  // in reverse, previous end point was...
}

// Let's sample both at various X values to see their Y values!
console.log('RB bottom points (first 10):');
console.log(rbPts.slice(0, 10));
console.log('RB bottom points (last 10):');
console.log(rbPts.slice(-10));
