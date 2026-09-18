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

// Boundary 3: Bottom of Green (from (0, 757) into the bottom area)
// In rightGreen (translate 1672, 702):
// Starts at (0, 55) -> (1672, 757).
// Let's trace all points from cmd 1 until it starts cutting around the audience:
let cur = { x: 0, y: 55 };
const b3_pts = [{ x: -0, y: 757 }];
for (let i = 1; i <= 25; i++) {
  const cmd = rgCmds[i];
  if (cmd.type === 'C') {
    b3_pts.push({ x: -cmd.args[4], y: cmd.args[5] + 702 });
  }
}

console.log('Boundary 3 samples:');
b3_pts.forEach((p, idx) => {
  if (idx % 2 === 0 || idx === b3_pts.length - 1) console.log(idx, p);
});
