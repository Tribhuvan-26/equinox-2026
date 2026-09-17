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

const lbCmds = parsePath(data.leftBlue.match(/d="([^"]+)"/)[1]);
const lgCmds = parsePath(data.leftGreen.match(/d="([^"]+)"/)[1]);
const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);
const rgCmds = parsePath(data.rightGreen.match(/d="([^"]+)"/)[1]);

console.log('leftBlue commands:', lbCmds.length);
console.log('leftGreen commands:', lgCmds.length);
console.log('rightBlue commands:', rbCmds.length);
console.log('rightGreen commands:', rgCmds.length);

console.log('\n--- rightBlue structure ---');
// RB starts at (1672, 622) -> (0,0)
// RB cmd 0: M0 0
// RB cmd 1: C0 26.4 0 52.8 0 80 (goes down the right edge from 0 to 80!)
// RB cmd 2 to 34: bottom curve of blue from (0, 80) to (-416, 274)
// RB cmd 35 to 60: top curve of blue from (-416, 274) back to (0, 0)!
// RB cmd 61: Z
console.log('RB cmd 1:', rbCmds[1]);
console.log('RB cmd 34:', rbCmds[34]);
console.log('RB cmd 60:', rbCmds[60]);

console.log('\n--- rightGreen structure ---');
// RG starts at (1672, 702) -> (0,0)
// RG cmd 0: M0 0
// RG cmd 1: C0 18.15 0 36.3 0 55 (goes down the right edge from 0 to 55!)
// RG cmd 2 to 32: bottom curve of green from (0, 55) to (-340, 238)
// RG cmd 33: bottom flat line / audience interface to (-489, 238)
// ... wait, let's see where RG goes!
for (let i = 0; i < rgCmds.length; i++) {
  const c = rgCmds[i];
  if (c.type === 'C') {
    if (i < 5 || i > rgCmds.length - 6 || i === 32 || i === 33 || i === 34) {
      console.log(`RG cmd ${i}: to (${c.args[4]}, ${c.args[5]})`);
    }
  }
}
