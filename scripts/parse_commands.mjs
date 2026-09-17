import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

function parsePath(d) {
  const commands = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    const type = match[1];
    const args = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    commands.push({ type, args });
  }
  return commands;
}

const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);
const lbCmds = parsePath(data.leftBlue.match(/d="([^"]+)"/)[1]);

console.log('rightBlue command count:', rbCmds.length);
console.log('leftBlue command count:', lbCmds.length);

// Calculate endpoints along rightBlue
let cur = { x: 0, y: 0 };
const rbPoints = [{ ...cur }];
for (const cmd of rbCmds) {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] };
    rbPoints.push({ ...cur });
  }
}
console.log('rightBlue points count:', rbPoints.length);
console.log('First 5 points:', rbPoints.slice(0, 5));
console.log('Middle point (furthest):', rbPoints.reduce((min, p) => p.x < min.x ? p : min, rbPoints[0]));
console.log('Last 5 points:', rbPoints.slice(-5));
