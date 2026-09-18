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

const rgCmds = parsePath(data.rightGreen.match(/d="([^"]+)"/)[1]);

let cur = { x: 0, y: 0 };
let minIdx = -1;
let minX = 0;
rgCmds.forEach((cmd, idx) => {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] };
    if (cur.x < minX) {
      minX = cur.x;
      minIdx = idx;
    }
  }
});

console.log(`rightGreen minX: ${minX} at idx: ${minIdx}`);
// Print points from minIdx onwards (the top edge of green returning to 0,0)
const returnPts = [];
for (let i = minIdx; i < rgCmds.length; i++) {
  const cmd = rgCmds[i];
  if (cmd.type === 'C') {
    returnPts.push({ x: cmd.args[4] + 1672, y: cmd.args[5] + 702 });
  }
}
console.log('Return points count:', returnPts.length);
console.log('First 5:', returnPts.slice(0, 5));
console.log('Last 5:', returnPts.slice(-5));
