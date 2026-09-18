import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

for (const [key, xml] of Object.entries(data)) {
  console.log(`=== ${key} ===`);
  const match = xml.match(/<path\s+d="([^"]+)"\s+fill="([^"]+)"(?:\s+transform="([^"]+)")?/);
  if (match) {
    const [, d, fill, transform] = match;
    console.log(`Fill: ${fill}, Transform: ${transform}`);
    console.log(`d length: ${d.length}`);
    // Print first 200 chars and last 200 chars of d
    console.log(`Start: ${d.slice(0, 180)}`);
    console.log(`End:   ${d.slice(-180)}`);
  }
}
