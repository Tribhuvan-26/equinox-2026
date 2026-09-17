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

const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);
const rgCmds = parsePath(data.rightGreen.match(/d="([^"]+)"/)[1]);

console.log('=== RIGHT BLUE COMMANDS ===');
console.log('Count:', rbCmds.length);
rbCmds.forEach((c, i) => {
  console.log(`${i}: ${c.type} ${c.args.join(' ')}`);
});
