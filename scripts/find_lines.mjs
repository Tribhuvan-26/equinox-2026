import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');
const lines = svg.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('layer-people-podium-static')) {
    console.log(`layer-people-podium-static on line ${i + 1}`);
  }
}
