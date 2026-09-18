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

// Let's find the points of the top edge of rightGreen:
// In rightGreen, transform="translate(1672,702)"
// At the end of rightGreen, it returns along its top edge to (0, 0)!
// Let's print the last 10 points of rightGreen in global coordinates:
let cur = { x: 0, y: 0 };
const rgPts = [];
for (const cmd of rgCmds) {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4] + 1672, y: cmd.args[5] + 702 };
    rgPts.push({ ...cur });
  }
}

// And rightBlue bottom edge points in global coordinates:
// Starts at (1672, 702) and goes to (-416 + 1672, 274 + 622) = (1256, 896):
cur = { x: 1672, y: 702 };
const rbBottomPts = [{ ...cur }];
for (let i = 1; i <= 34; i++) {
  const cmd = rbCmds[i];
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4] + 1672, y: cmd.args[5] + 622 };
    rbBottomPts.push({ ...cur });
  }
}

console.log('rightBlue bottom edge start:', rbBottomPts[0], 'end:', rbBottomPts[rbBottomPts.length - 1]);
console.log('rightGreen end (returning to start):', rgPts[rgPts.length - 1]);
console.log('Compare points near x = 1400:');
const rbNear1400 = rbBottomPts.find(p => p.x < 1400);
const rgNear1400 = rgPts.slice(-20).find(p => p.x > 1390 && p.x < 1410);
console.log('rb:', rbNear1400);
console.log('rg:', rgNear1400);
