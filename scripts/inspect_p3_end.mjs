import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];

// Path 0 is staticPaths[0]
// Path 3 is staticPaths[3]
// Let's see: from command 19 of Path 0:
// Cmd 19 is at (392, 843).
// From (392, 843) to (493, 931) is the audience silhouette to the left of the podium!
// And Path 3 ends at (180, 940)!
console.log('Path 3 end commands:');
const p3 = staticPaths[3][1];
console.log(p3.slice(-300));
