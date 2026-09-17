import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));
const d = data.rightGreen.match(/d="([^"]+)"/)[1];
const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
let match, idx = 0;
while ((match = regex.exec(d)) !== null) {
  const args = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
  if (match[1] === 'C') {
    const x = args[4] + 1672;
    const y = args[5] + 702;
    console.log(`${idx}: to (${x.toFixed(1)}, ${y.toFixed(1)})`);
  }
  idx++;
}
