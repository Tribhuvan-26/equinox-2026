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

// In leftBlue, bottom boundary is commands 28 to 61 (from 378, 883 to 0, 703)
// In leftGreen, top boundary is commands 1 to 38 (from 0, 703 to 377, 883)
console.log('--- Compare Left Blue bottom vs Left Green top ---');
// Let's print the endpoints of leftBlue bottom commands in reverse (from 0, 703 up to 378, 883)
const lbBottom = [];
for (let i = lbCmds.length - 3; i >= 28; i--) {
  const c = lbCmds[i];
  if (c.type === 'C') {
    lbBottom.push({ idx: i, to: [c.args[4], c.args[5] + 623] });
  }
}

const lgTop = [];
for (let i = 1; i <= 38; i++) {
  const c = lgCmds[i];
  if (c.type === 'C') {
    lgTop.push({ idx: i, to: [c.args[4], c.args[5] + 703] });
  }
}

console.log('lbBottom count:', lbBottom.length, 'lgTop count:', lgTop.length);
console.log('First 5 of lbBottom (starting from left):');
console.log(lbBottom.slice(0, 5));
console.log('First 5 of lgTop (starting from left):');
console.log(lgTop.slice(0, 5));
