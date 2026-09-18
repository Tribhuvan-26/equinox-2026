import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];

console.log('static-back paths:');
staticPaths.forEach((p, idx) => {
  console.log(`Path ${idx+1}: fill=${p[2]} transform=${p[3]} d_len=${p[1].length}`);
});
