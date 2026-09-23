import fs from 'fs';
import zlib from 'zlib';

const buf = fs.readFileSync('public/assets/events/ecell/network/reference_design.png');
let pos = 8;
const idatChunks = [];
let width = 0, height = 0;
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(pos + 8);
    height = buf.readUInt32BE(pos + 12);
  } else if (type === 'IDAT') {
    idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
  }
  pos += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const bpp = 4;
const img = Buffer.alloc(width * height * bpp);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

let srcPos = 0;
for (let y = 0; y < height; y++) {
  const filter = raw[srcPos++];
  const rowStart = y * width * bpp;
  const prevRowStart = (y - 1) * width * bpp;
  for (let x = 0; x < width * bpp; x++) {
    const rawByte = raw[srcPos++];
    const a = x >= bpp ? img[rowStart + x - bpp] : 0;
    const b = y > 0 ? img[prevRowStart + x] : 0;
    const c = (x >= bpp && y > 0) ? img[prevRowStart + x - bpp] : 0;
    let val = 0;
    if (filter === 0) val = rawByte;
    else if (filter === 1) val = (rawByte + a) & 0xff;
    else if (filter === 2) val = (rawByte + b) & 0xff;
    else if (filter === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) val = (rawByte + paeth(a, b, c)) & 0xff;
    img[rowStart + x] = val;
  }
}

function getPixel(x, y) {
  if (x < 0 || x >= width || y < 0 || y >= height) return { r: 0, g: 0, b: 0, a: 0 };
  const idx = (y * width + x) * 4;
  return {
    r: img[idx],
    g: img[idx + 1],
    b: img[idx + 2],
    a: img[idx + 3]
  };
}

// Let's sample along lines:
// 1. Dashed line between Node 1 (TL) and Node 2 (ML):
// Start at Node 1 edge, go to Node 2 edge
console.log('--- Dashed line 1 (Node 1 -> Node 2) ---');
for (let t = 0; t <= 1; t += 0.05) {
  const x = Math.round(230 + t * (165 - 230));
  const y = Math.round(155 + t * (290 - 155));
  // check a small 5x5 window
  let found = 'none';
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const p = getPixel(x + dx, y + dy);
      if (p.b > 180 && p.r > 60 && p.r < 170 && p.g > 80 && p.g < 180) found = 'blue';
      if (p.g > 180 && p.r < 120 && p.b < 160) found = 'green';
    }
  }
  console.log(`t=${t.toFixed(2)} (${x}, ${y}): ${found}`);
}

// 2. Dashed line between Node 2 (ML) and Node 3 (BL):
console.log('\n--- Dashed line 2 (Node 2 -> Node 3) ---');
for (let t = 0; t <= 1; t += 0.05) {
  const x = Math.round(165 + t * (220 - 165));
  const y = Math.round(290 + t * (435 - 290));
  let found = 'none';
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const p = getPixel(x + dx, y + dy);
      if (p.b > 180 && p.r > 60 && p.r < 170 && p.g > 80 && p.g < 180) found = 'blue';
      if (p.g > 180 && p.r < 120 && p.b < 160) found = 'green';
    }
  }
  console.log(`t=${t.toFixed(2)} (${x}, ${y}): ${found}`);
}
