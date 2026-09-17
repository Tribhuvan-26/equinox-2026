import fs from 'fs';

// Let's test placing the clean mirrored curves on top of layer-static-back
// and see if any part of layer-static-back pokes out above the curves!

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

// Let's see: what if we construct:
// 1. Clean Left Blue curve
// 2. Clean Left Green curve
// Let's check how they look against the full scene!
console.log('Testing clean left curves construction...');
