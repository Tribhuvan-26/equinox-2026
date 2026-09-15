const fs = require('fs');
let content = fs.readFileSync('components/JourneyPlanets.tsx', 'utf8');

// Undo the over-enthusiastic replacements
// Change any number of `</g>` followed by `)}` into exactly two `</g>` followed by `)}`
// Wait, the structure inside `index === X && (` is:
// <g>
//   <circle ... />
//   <g filter="...">
//     ...
//   </g>
// </g>
// So there should be exactly TWO </g> tags before `)}` for ALL 10 blocks!

content = content.replace(/(<\/g>\s*)+}\)/g, '</g>\n          </g>\n        )}');

fs.writeFileSync('components/JourneyPlanets.tsx', content);
console.log('Fixed tags');
