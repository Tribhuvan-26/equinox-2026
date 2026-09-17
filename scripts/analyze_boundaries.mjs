import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

// In rightBlue:
// Starts at (1672, 622) -> (0, 0) relative to (1672, 622).
// (0, 0) to (0, 80) is the right border.
// Then from (0, 80) to (-416, 274) is Boundary 2 (the bottom of blue, interface blue/green)!
// Then from (-416, 274) back to (0, 0) is Boundary 1 (the top of blue)!

// Let's print the exact commands of Boundary 2 and Boundary 1:
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

console.log('Total commands in rightBlue:', rbCmds.length);

// Let's trace all points
let cur = { x: 0, y: 0 };
let minIdx = -1;
let minX = 0;
rbCmds.forEach((cmd, idx) => {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] };
    if (cur.x < minX) {
      minX = cur.x;
      minIdx = idx;
    }
  }
});

console.log(`Min X is ${minX} at command index ${minIdx}`);
// Commands 0 to minIdx form the bottom edge of rightBlue (Boundary 2)
// Commands minIdx+1 to end form the top edge of rightBlue (Boundary 1)
