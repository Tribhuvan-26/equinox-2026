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

console.log('--- Right Blue Extents ---');
let minX = 9999, maxX = -9999, minY = 9999, maxY = -9999;
let cur = { x: 1672, y: 622 };
for (const cmd of rbCmds) {
  if (cmd.type === 'M' || cmd.type === 'L' || cmd.type === 'C') {
    const x = cmd.args[cmd.args.length - 2] + 1672;
    const y = cmd.args[cmd.args.length - 1] + 622;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
}
console.log(`RB bounds: X: [${minX}, ${maxX}], Y: [${minY}, ${maxY}]`);

console.log('--- Right Green Extents ---');
minX = 9999; maxX = -9999; minY = 9999; maxY = -9999;
for (const cmd of rgCmds) {
  if (cmd.type === 'M' || cmd.type === 'L' || cmd.type === 'C') {
    const x = cmd.args[cmd.args.length - 2] + 1672;
    const y = cmd.args[cmd.args.length - 1] + 702;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
}
console.log(`RG bounds: X: [${minX}, ${maxX}], Y: [${minY}, ${maxY}]`);
