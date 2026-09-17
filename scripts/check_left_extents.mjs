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

const lbCmds = parsePath(data.leftBlue.match(/d="([^"]+)"/)[1]);
const lgCmds = parsePath(data.leftGreen.match(/d="([^"]+)"/)[1]);

console.log('--- Left Blue Extents ---');
let minX = 9999, maxX = -9999, minY = 9999, maxY = -9999;
for (const cmd of lbCmds) {
  if (cmd.type === 'M' || cmd.type === 'L' || cmd.type === 'C') {
    const x = cmd.args[cmd.args.length - 2];
    const y = cmd.args[cmd.args.length - 1] + 623;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
}
console.log(`LB bounds: X: [${minX}, ${maxX}], Y: [${minY}, ${maxY}]`);

console.log('--- Left Green Extents ---');
minX = 9999; maxX = -9999; minY = 9999; maxY = -9999;
for (const cmd of lgCmds) {
  if (cmd.type === 'M' || cmd.type === 'L' || cmd.type === 'C') {
    const x = cmd.args[cmd.args.length - 2];
    const y = cmd.args[cmd.args.length - 1] + 703;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
}
console.log(`LG bounds: X: [${minX}, ${maxX}], Y: [${minY}, ${maxY}]`);
