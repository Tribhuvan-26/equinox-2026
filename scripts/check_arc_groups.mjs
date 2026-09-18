import fs from 'fs';

const svg = fs.readFileSync('app/overlay-animations/animations/events/IplAuction/scene.svg', 'utf8');

const leftGroup = svg.match(/<g id="group-left-arcs"[\s\S]*?<\/g>\s*<\/g>/);
console.log('LEFT GROUP:');
console.log(leftGroup ? leftGroup[0].slice(0, 500) : 'none');
