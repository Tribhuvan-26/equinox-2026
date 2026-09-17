import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

function getElement(id) {
  const match = svg.match(new RegExp(`<g[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/g>`));
  return match ? match[1].trim() : '';
}

fs.writeFileSync('scripts/arcs_dump.json', JSON.stringify({
  leftBlue: getElement('layer-left-blue-arc'),
  leftGreen: getElement('layer-left-green-arc'),
  rightBlue: getElement('layer-right-blue-arc'),
  rightGreen: getElement('layer-right-green-arc')
}, null, 2));

console.log('Saved to scripts/arcs_dump.json');
