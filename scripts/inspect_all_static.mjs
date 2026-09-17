import fs from 'fs';

const svg = fs.readFileSync('app/overlay-animations/animations/events/IplAuction/scene.svg', 'utf8');
const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const regex = /<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g;
let m;
let idx = 1;
while ((m = regex.exec(staticBack)) !== null) {
  console.log(`=== Path ${idx++} ===`);
  console.log(`Fill: ${m[2]}, Transform: ${m[3]}, Length: ${m[1].length}`);
  console.log(`Start: ${m[1].slice(0, 150)}`);
  console.log(`End: ${m[1].slice(-150)}`);
}
