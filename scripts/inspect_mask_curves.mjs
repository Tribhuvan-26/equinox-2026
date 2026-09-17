import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

// Let's inspect the mask paths in defs:
// mask-left-blue:
// d="M -20 640 C 60 660 150 700 240 750 C 320 800 395 860 410 885" strokeWidth="240"
// mask-left-green:
// d="M -20 720 C 50 735 130 770 210 810 C 290 855 360 900 395 930" strokeWidth="240"

// mask-right-blue:
// d="M 1692 640 C 1612 660 1522 700 1432 750 C 1352 800 1277 860 1262 885" strokeWidth="240"
// mask-right-green:
// d="M 1692 720 C 1622 735 1542 770 1462 810 C 1382 855 1312 900 1277 930" strokeWidth="240"

console.log('The masks have simple 2-cubic-bezier curves!');
console.log('Left Blue mask centerline:');
console.log('Start: (-20, 640)');
console.log('C1: (60, 660), (150, 700), (240, 750)');
console.log('C2: (320, 800), (395, 860), (410, 885)');
