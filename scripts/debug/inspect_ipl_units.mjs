import fs from 'fs';

const content = fs.readFileSync('app/overlay-animations/animations/events/IplAuction/scene.svg', 'utf8');

// Let's find:
// 1. All groups with team
console.log('=== SEARCH FOR TEAM / BADGE / CIRCLE / LOGO ===');
const teams = [...content.matchAll(/<g[^>]*id="([^"]*team[^"]*)"[^>]*>/gi)].map(m => m[1]);
console.log('Team IDs:', teams);

// 2. All groups with price / pill / cr
const prices = [...content.matchAll(/<g[^>]*id="([^"]*price[^"]*)"[^>]*>/gi)].map(m => m[1]);
console.log('Price IDs:', prices);

// 3. Curved bands or arcs or swoosh
const curves = [...content.matchAll(/<g[^>]*id="([^"]*(?:arc|curve|band|swoosh)[^"]*)"[^>]*>/gi)].map(m => m[1]);
console.log('Curve / Arc IDs:', curves);

// Let's inspect team-unit-1 to team-unit-10
for (let i = 1; i <= 10; i++) {
  const unitMatch = content.match(new RegExp(`<g[^>]*id="team-unit-${i}"[\\s\\S]*?(?=<g id="team-unit-${i+1}"|<g id="layer-people|$)`));
  if (unitMatch) {
    // Find circle in unit
    const circles = [...unitMatch[0].matchAll(/<circle[^>]*>/g)].map(m => m[0]);
    // Find rects
    const rects = [...unitMatch[0].matchAll(/<rect[^>]*>/g)].map(m => m[0]);
    // Find text
    const texts = [...unitMatch[0].matchAll(/<text[^>]*>([\\s\\S]*?)<\/text>/g)].map(m => m[1].trim());
    console.log(`Team Unit ${i}: circles=${circles.length}, rects=${rects.length}, texts=${texts.join(' | ')}`);
    if (circles.length > 0) console.log(`  Circles: ${circles.join(', ')}`);
  }
}
