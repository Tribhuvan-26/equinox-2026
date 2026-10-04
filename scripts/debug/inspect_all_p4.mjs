import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];
const p4D = staticPaths[3][1];

function parsePath(d) {
  const cmds = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    cmds.push({ type: match[1], args: match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) });
  }
  return cmds;
}

const p4Cmds = parsePath(p4D);
let cur = { x: 0, y: 757 };
console.log('--- Path 4 all commands ---');
for (let i = 0; i < p4Cmds.length; i++) {
  const cmd = p4Cmds[i];
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] + 757 };
    console.log(`cmd ${i}: to (${cur.x.toFixed(1)}, ${cur.y.toFixed(1)})`);
  }
}
