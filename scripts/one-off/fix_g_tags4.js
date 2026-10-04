const fs = require('fs');
let content = fs.readFileSync('components/JourneyPlanets.tsx', 'utf8');

// Replace any sequence of closing g tags followed by `)}` with EXACTLY two closing g tags.
content = content.replace(/(<\/g>\s*)+}\)/g, '</g>\n          </g>\n        )}');

fs.writeFileSync('components/JourneyPlanets.tsx', content);
console.log('Fixed tags');
