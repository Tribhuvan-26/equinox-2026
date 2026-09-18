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

// Let's print all points of RG with their command index
let cur = { x: 1672, y: 702 };
for (let i = 0; i < rgCmds.length; i++) {
  const c = rgCmds[i];
  if (c.type === 'M') {
    cur = { x: 1672 + c.args[0], y: 702 + c.args[1] };
  } else if (c.type === 'C') {
    cur = { x: 1672 + c.args[4], y: 702 + c.args[5] };
  }
  console.log(`cmd ${i}: ${c.type} -> (${cur.x.toFixed(2)}, ${cur.y.toFixed(2)})`);
}
