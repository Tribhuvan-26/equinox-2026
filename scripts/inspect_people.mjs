import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const people = svg.match(/<g id="layer-people-podium-static">([\s\S]*?)<\/g>\s*<\/svg>/)[1];

console.log('people layer length:', people.length);
const paths = [...people.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];
console.log('people paths count:', paths.length);
paths.slice(0, 10).forEach((p, i) => {
  console.log(`Path ${i}: fill=${p[2]}, transform=${p[3]}`);
});
