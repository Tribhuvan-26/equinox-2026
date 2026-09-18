import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// Let's inspect Path 0 in layer-static-back:
const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];

console.log('Path 0 start:');
console.log(staticPaths[0][1].slice(0, 300));

console.log('Path 0 end:');
console.log(staticPaths[0][1].slice(-300));
