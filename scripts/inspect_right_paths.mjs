import fs from 'fs';

// Let's inspect the exact segments of rightBlue and rightGreen
const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

// rightBlue is transform="translate(1672,622)"
// rightGreen is transform="translate(1672,702)"

console.log('rightBlue path raw:');
console.log(data.rightBlue);

console.log('\nrightGreen path raw:');
console.log(data.rightGreen);
