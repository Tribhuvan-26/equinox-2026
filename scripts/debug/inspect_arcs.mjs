import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

function extractTag(svg, tagId) {
  const regex = new RegExp(`(<(g|mask)\\s+[^>]*id=["']${tagId}["'][^>]*>[\\s\\S]*?<\\/\\2>)`, 'i');
  const match = svg.match(regex);
  return match ? match[1] : 'NOT FOUND';
}

console.log('=== mask-left-blue ===\n', extractTag(svg, 'mask-left-blue'));
console.log('=== mask-left-green ===\n', extractTag(svg, 'mask-left-green'));
console.log('=== mask-right-blue ===\n', extractTag(svg, 'mask-right-blue'));
console.log('=== mask-right-green ===\n', extractTag(svg, 'mask-right-green'));
console.log('=== group-left-arcs ===\n', extractTag(svg, 'group-left-arcs'));
console.log('=== group-right-arcs ===\n', extractTag(svg, 'group-right-arcs'));
console.log('=== layer-static-back ===\n', extractTag(svg, 'layer-static-back'));
