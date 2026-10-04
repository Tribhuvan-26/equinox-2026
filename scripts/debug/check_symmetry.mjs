import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// Let's check the masks!
// mask-left-blue:
// <path d="M -20 640 C 60 660 150 700 240 750 C 320 800 395 860 410 885" stroke="white" strokeWidth="240" ... />
// mask-left-green:
// <path d="M -20 720 C 50 735 130 770 210 810 C 290 855 360 900 395 930" stroke="white" strokeWidth="240" ... />
// mask-right-blue:
// <path d="M 1692 640 C 1612 660 1522 700 1432 750 C 1352 800 1277 860 1262 885" stroke="white" strokeWidth="240" ... />
// mask-right-green:
// <path d="M 1692 720 C 1622 735 1542 770 1462 810 C 1382 855 1312 900 1277 930" stroke="white" strokeWidth="240" ... />

console.log('Notice the mask paths:');
console.log('mask-left-blue:', 'M -20 640 C 60 660 150 700 240 750 C 320 800 395 860 410 885');
console.log('mask-right-blue:', 'M 1692 640 C 1612 660 1522 700 1432 750 C 1352 800 1277 860 1262 885');
console.log('Notice that 1672 - (-20) = 1692!');
console.log('1672 - 60 = 1612! 1672 - 150 = 1522! 1672 - 240 = 1432! 1672 - 320 = 1352! 1672 - 395 = 1277! 1672 - 410 = 1262!');
console.log('THE RIGHT MASKS ARE EXACT HORIZONTAL REFLECTIONS OF THE LEFT MASKS AROUND THE 1672 WIDTH!');
