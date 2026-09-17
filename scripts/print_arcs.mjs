import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

function getElement(id) {
  const match = svg.match(new RegExp(`<g[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/g>`));
  return match ? match[1] : '';
}

console.log('--- LEFT BLUE ---');
console.log(getElement('layer-left-blue-arc'));

console.log('--- LEFT GREEN ---');
console.log(getElement('layer-left-green-arc'));

console.log('--- RIGHT BLUE ---');
console.log(getElement('layer-right-blue-arc'));

console.log('--- RIGHT GREEN ---');
console.log(getElement('layer-right-green-arc'));
