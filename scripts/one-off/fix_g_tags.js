const fs = require('fs');
let content = fs.readFileSync('components/JourneyPlanets.tsx', 'utf8');

// Replace exactly `</g>` followed by spaces and `)}` with `</g>\n          </g>\n        )}`
content = content.replace(/<\/g>\s*?}\)/g, '</g>\n          </g>\n        )}');

fs.writeFileSync('components/JourneyPlanets.tsx', content);
