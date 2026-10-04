const fs = require('fs');
let content = fs.readFileSync('components/JourneyPlanets.tsx', 'utf8');

// The file has:
// </g>
// )}
// We need to replace it with:
// </g>
// </g>
// )}
// BUT only for index blocks 1 through 9.
// index === 0 already has it correctly? Let's check.
// If index === 0 is `</g>\n          </g>\n        )}`, then it won't match `</g>\n        )}` if we are strict.

content = content.replace(/<\/g>\s*\)\}/g, '</g>\n          </g>\n        )}');

fs.writeFileSync('components/JourneyPlanets.tsx', content);
console.log('Fixed syntax errors');
