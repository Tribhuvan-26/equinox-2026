import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

function parsePath(d) {
  const cmds = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    cmds.push({ type: match[1], args: match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) });
  }
  return cmds;
}

const rbCmds = parsePath(data.rightBlue.match(/d="([^"]+)"/)[1]);

// Let's get high-density sample points from rightBlue (mirrored)
// For every cubic bezier command C, we can evaluate B(t) for t in [0, 1]
function evalCubic(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x,
    y: mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y
  };
}

// Extract bottom curve of rightBlue (interface between blue and green):
// In rightBlue: commands 2 to 34 go from (0, 80) to (-416, 274) relative to (1672, 622)
// Mirrored: from (0, 702) to (416, 896)!
const midSamples = [];
let cur = { x: 0, y: 702 };
for (let i = 2; i <= 34; i++) {
  const c = rbCmds[i];
  if (c.type === 'C') {
    const p0 = { ...cur };
    const p1 = { x: -c.args[0], y: c.args[1] + 622 };
    const p2 = { x: -c.args[2], y: c.args[3] + 622 };
    const p3 = { x: -c.args[4], y: c.args[5] + 622 };
    for (let s = 0; s <= 5; s++) {
      midSamples.push(evalCubic(p0, p1, p2, p3, s / 5));
    }
    cur = p3;
  }
}

// Extract top curve of rightBlue:
// In rightBlue: commands 35 to 60 go from (-416, 274) back to (0, 0)
// Mirrored: from (416, 896) back to (0, 622)!
const topSamples = [];
cur = { x: 416, y: 896 };
for (let i = 35; i <= 60; i++) {
  const c = rbCmds[i];
  if (c.type === 'C') {
    const p0 = { ...cur };
    const p1 = { x: -c.args[0], y: c.args[1] + 622 };
    const p2 = { x: -c.args[2], y: c.args[3] + 622 };
    const p3 = { x: -c.args[4], y: c.args[5] + 622 };
    for (let s = 0; s <= 5; s++) {
      topSamples.push(evalCubic(p0, p1, p2, p3, s / 5));
    }
    cur = p3;
  }
}

console.log('midSamples count:', midSamples.length);
console.log('mid start:', midSamples[0], 'mid end:', midSamples[midSamples.length - 1]);
console.log('topSamples count:', topSamples.length);
console.log('top start:', topSamples[0], 'top end:', topSamples[topSamples.length - 1]);

// Let's find least-squares 2-segment cubic Béziers for both top and mid!
fs.writeFileSync('scripts/curve_samples.json', JSON.stringify({ midSamples, topSamples }, null, 2));
