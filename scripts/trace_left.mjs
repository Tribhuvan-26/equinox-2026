import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

function tracePath(name, d, tx, ty) {
  console.log(`\n=== ${name} ===`);
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match, idx = 0;
  while ((match = regex.exec(d)) !== null) {
    const args = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (match[1] === 'C') {
      const x = args[4] + tx;
      const y = args[5] + ty;
      console.log(`${idx}: to (${x.toFixed(1)}, ${y.toFixed(1)})`);
    } else if (match[1] === 'M') {
      console.log(`${idx}: M (${(args[0] + tx).toFixed(1)}, ${(args[1] + ty).toFixed(1)})`);
    }
    idx++;
  }
}

tracePath('leftBlue', data.leftBlue.match(/d="([^"]+)"/)[1], 0, 623);
tracePath('leftGreen', data.leftGreen.match(/d="([^"]+)"/)[1], 0, 703);
