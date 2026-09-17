import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// Let's find all paths that have points with x < 600 and y > 500
// and let's see their fill colors, IDs, and positions
const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

console.log('leftBlue fill:', data.leftBlue.match(/fill="([^"]+)"/)[1]);
console.log('leftGreen fill:', data.leftGreen.match(/fill="([^"]+)"/)[1]);
console.log('rightBlue fill:', data.rightBlue.match(/fill="([^"]+)"/)[1]);
console.log('rightGreen fill:', data.rightGreen.match(/fill="([^"]+)"/)[1]);
