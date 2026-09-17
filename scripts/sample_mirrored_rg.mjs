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

// Let's sample commands 1 to 24 of rightGreen:
console.log('RG bottom edge (commands 1 to 24):');
for (let i = 1; i <= 24; i++) {
  const c = rgCmds[i];
  if (c.type === 'C') {
    const x = -(c.args[4]); // mirrored
    const y = c.args[5] + 702;
    console.log(`cmd ${i}: x=${x.toFixed(1)}, y=${y.toFixed(1)}`);
  }
}
