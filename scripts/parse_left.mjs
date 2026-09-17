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

function getPoints(d) {
  const cmds = parsePath(d);
  let cur = { x: 0, y: 0 };
  const pts = [{ ...cur }];
  for (const cmd of cmds) {
    if (cmd.type === 'C') {
      cur = { x: cmd.args[4], y: cmd.args[5] };
      pts.push({ ...cur });
    }
  }
  return pts;
}

console.log('--- LEFT BLUE ---');
const lbPts = getPoints(data.leftBlue.match(/d="([^"]+)"/)[1]);
console.log('First 5:', lbPts.slice(0, 5));
console.log('Furthest x:', lbPts.reduce((max, p) => p.x > max.x ? p : max, lbPts[0]));
console.log('Last 5:', lbPts.slice(-5));

console.log('\n--- LEFT GREEN ---');
const lgPts = getPoints(data.leftGreen.match(/d="([^"]+)"/)[1]);
console.log('First 5:', lgPts.slice(0, 5));
console.log('Furthest x:', lgPts.reduce((max, p) => p.x > max.x ? p : max, lgPts[0]));
console.log('Last 5:', lgPts.slice(-5));
