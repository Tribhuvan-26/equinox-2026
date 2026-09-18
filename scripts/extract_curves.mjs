import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

// In leftBlue:
// Starts at M0 0 (relative to translate(0, 623), so absolute (0, 623)).
// It goes to (393.63, 223.47) relative to 623 -> (393.63, 846.47).
// That is the TOP edge of the blue ribbon!
// Let's print the points along the top edge of leftBlue:
const lbD = data.leftBlue.match(/d="([^"]+)"/)[1];
const cmds = [];
const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
let match;
while ((match = regex.exec(lbD)) !== null) {
  cmds.push({ type: match[1], args: match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) });
}

// Top edge is from index 0 until furthest point (393.63, 223.47)
let cur = { x: 0, y: 0 };
const topPts = [{ x: 0, y: 623 }];
for (const cmd of cmds) {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] + 623 };
    topPts.push({ ...cur });
    if (Math.abs(cmd.args[4] - 393.63) < 0.1) break;
  }
}

console.log('Left Blue Top Edge Points (first 10):', topPts.slice(0, 10));
console.log('Left Blue Top Edge Points (total):', topPts.length);
console.log('Left Blue Top Edge End:', topPts[topPts.length - 1]);
