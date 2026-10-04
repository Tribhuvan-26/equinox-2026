import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];

function parsePath(d) {
  const cmds = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    cmds.push({ type: match[1], args: match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) });
  }
  return cmds;
}

const p0Cmds = parsePath(staticPaths[0][1]);
console.log('Path 0 commands count:', p0Cmds.length);

let cur = { x: 0, y: 623 };
p0Cmds.forEach((cmd, idx) => {
  if (cmd.type === 'C') {
    cur = { x: cmd.args[4], y: cmd.args[5] + 623 };
    if (idx < 30 || idx > p0Cmds.length - 10) {
      console.log(`cmd ${idx}: to (${cur.x}, ${cur.y})`);
    }
  }
});
