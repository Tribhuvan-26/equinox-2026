import fs from 'fs';

const content = fs.readFileSync('app/overlay-animations/animations/events/IplAuction/scene.svg', 'utf8');

const unit1 = content.match(/<g id="team-unit-1"[\s\S]*?(?=<g id="team-unit-2")/);
if (unit1) {
  console.log('Unit 1 length:', unit1[0].length);
  const paths = [...unit1[0].matchAll(/<path\s+[^>]*>/g)].map(m => m[0]);
  console.log('Unit 1 paths count:', paths.length);
  console.log('First 5 paths of Unit 1:');
  paths.slice(0, 5).forEach(p => console.log(p.slice(0, 120)));
  
  // Also check layer-price-1
  const price1 = unit1[0].match(/<g id="layer-price-1"[\s\S]*?<\/g>/);
  if (price1) {
    console.log('\nlayer-price-1:');
    console.log(price1[0].slice(0, 500));
  }
}
