import fs from 'fs';

// Let's sample the points from the actual right curves (mirrored) and left curves:
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

// In rightBlue:
// Global coords: x = 1672 + x_rel, y = 622 + y_rel
// Mirrored to left: x_left = -(x_rel), y_left = 622 + y_rel

// Boundary 1: Top of Blue
// In rightBlue, from cmd 34 to 61:
const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);
const b1_pts = [];
for (let i = 34; i < rbCmds.length; i++) {
  const cmd = rbCmds[i];
  if (cmd.type === 'C') {
    b1_pts.push({ x: -cmd.args[4], y: cmd.args[5] + 622 });
  }
}

// Boundary 2: Bottom of Blue (interface with Green)
// In rightBlue, from cmd 1 to 34:
const b2_pts = [];
for (let i = 1; i <= 34; i++) {
  const cmd = rbCmds[i];
  if (cmd.type === 'C') {
    b2_pts.push({ x: -cmd.args[4], y: cmd.args[5] + 622 });
  }
}

console.log('Boundary 1 (Top of Blue) samples:');
[0, 5, 10, 15, 20, b1_pts.length-1].forEach(i => console.log(b1_pts[i]));

console.log('\nBoundary 2 (Bottom of Blue) samples:');
[0, 5, 10, 15, 20, b2_pts.length-1].forEach(i => console.log(b2_pts[i]));
