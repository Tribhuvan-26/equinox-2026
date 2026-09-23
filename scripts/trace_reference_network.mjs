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

// Check the 7 circles
// TL: x ~ 230, y ~ 155
// ML: x ~ 165, y ~ 290
// BL: x ~ 220, y ~ 435
// BC: x ~ 512, y ~ 495
// TR: x ~ 794, y ~ 155 (or 750)
// MR: x ~ 859, y ~ 290 (or 830)
// BR: x ~ 804, y ~ 435 (or 780)

function analyzeCircle(name, approxX, approxY, radius = 50) {
  let minX = approxX + radius, maxX = approxX - radius;
  let minY = approxY + radius, maxY = approxY - radius;
  let rCount = 0;
  let color = '';

  for (let y = approxY - radius; y <= approxY + radius; y++) {
    for (let x = approxX - radius; x <= approxX + radius; x++) {
      const p = getPixel(x, y);
      const isBlue = p.b > 200 && p.r > 70 && p.r < 160 && p.g > 90 && p.g < 170;
      const isGreen = p.g > 200 && p.r < 100 && p.b < 150;
      if (isBlue || isGreen) {
        if (!color) color = isBlue ? 'blue (#7484FE)' : 'green (#33FF67)';
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        rCount++;
      }
    }
  }
  const cx = Math.round((minX + maxX) / 2);
  const cy = Math.round((minY + maxY) / 2);
  const r = Math.round(((maxX - minX) + (maxY - minY)) / 4);
  console.log(`${name}: color=${color}, bbox=[${minX}, ${minY}, ${maxX}, ${maxY}], center=(${cx}, ${cy}), radius=${r}`);
}

console.log('=== BUILDING CIRCLES ===');
analyzeCircle('Node 1 (TL)', 230, 160);
analyzeCircle('Node 2 (ML)', 165, 300);
analyzeCircle('Node 3 (BL)', 220, 440);
analyzeCircle('Node 4 (BC)', 512, 495);
analyzeCircle('Node 5 (TR)', 750, 160);
analyzeCircle('Node 6 (MR)', 830, 290);
analyzeCircle('Node 7 (BR)', 775, 435);

// Let's also check for dots near each circle (especially ABOVE or on the perimeter)
console.log('\n=== DOTS NEAR CIRCLES ===');
function findDotsNear(approxX, approxY, r = 70) {
  const found = [];
  for (let y = approxY - r; y <= approxY + r; y++) {
    for (let x = approxX - r; x <= approxX + r; x++) {
      const p = getPixel(x, y);
      const isBlue = p.b > 200 && p.r > 70 && p.r < 160 && p.g > 90 && p.g < 170;
      const isGreen = p.g > 200 && p.r < 100 && p.b < 150;
      if (isBlue || isGreen) {
        // check if isolated small patch
      }
    }
  }
}
