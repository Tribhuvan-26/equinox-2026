import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// 1. inspect layer-static-back paths
const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];
console.log('--- staticBack paths ---');
staticPaths.forEach((p, i) => {
  console.log(`Path ${i}: fill=${p[2]}, transform=${p[3]}, d length=${p[1].length}`);
});

// 2. inspect group-left-arcs
const leftArcsMatch = svg.match(/<g id="group-left-arcs">([\s\S]*?)<\/g>\s*<\/g>/)[0];
console.log('\n--- group-left-arcs ---');
const leftPaths = [...leftArcsMatch.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];
leftPaths.forEach((p, i) => {
  console.log(`Left Arc ${i}: fill=${p[2]}, transform=${p[3]}, d length=${p[1].length}`);
});

// 3. inspect group-right-arcs
const rightArcsMatch = svg.match(/<g id="group-right-arcs">([\s\S]*?)<\/g>\s*<\/g>/)[0];
console.log('\n--- group-right-arcs ---');
const rightPaths = [...rightArcsMatch.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];
rightPaths.forEach((p, i) => {
  console.log(`Right Arc ${i}: fill=${p[2]}, transform=${p[3]}, d length=${p[1].length}`);
});
