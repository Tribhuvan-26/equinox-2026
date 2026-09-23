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

// Trace line segments: find where blue/green pixels form lines
// Let's print ASCII maps of specific regions:
// Region 1: Between Node 1 and Arc (x: 250-380, y: 130-190)
// Region 2: Between Node 1 and Node 2 (x: 150-250, y: 180-280)
// Region 3: Between Node 2 and E-CELL (x: 180-330, y: 260-310)
// Region 4: Between Node 2 and Node 3 (x: 150-240, y: 310-420)
// Region 5: Between Node 3 and MEET (x: 230-340, y: 370-450)
// Region 6: Between Node 5 and Arc (x: 640-770, y: 130-190)
// Region 7: Between Node 5 and Node 6 (x: 760-860, y: 180-280)
// Region 8: Between Node 6 and MEET (x: 680-820, y: 260-320)
// Region 9: Between Node 6 and Node 7 (x: 760-860, y: 310-420)
// Region 10: Between Node 7 and MEET (x: 670-800, y: 360-450)

function printRegion(label, minX, minY, maxX, maxY, step = 3) {
  console.log(`\n=== ${label} (X: ${minX}..${maxX}, Y: ${minY}..${maxY}) ===`);
  for (let y = minY; y <= maxY; y += step) {
    let line = `${y.toString().padStart(3)}: `;
    for (let x = minX; x <= maxX; x += step) {
      const p = getPixel(x, y);
      const isB = p.b > 180 && p.r > 60 && p.r < 170 && p.g > 80 && p.g < 180;
      const isG = p.g > 180 && p.r < 120 && p.b < 160;
      const isW = p.r > 200 && p.g > 200 && p.b > 200;
      if (isB) line += 'B';
      else if (isG) line += 'G';
      else if (isW) line += 'W';
      else line += ' ';
    }
    if (line.trim().length > 4) console.log(line);
  }
}

printRegion('1. Node 1 -> Arc', 250, 140, 380, 190, 4);
printRegion('2. Node 1 -> Node 2 (Dashed)', 160, 190, 250, 270, 3);
printRegion('3. Node 2 -> E-CELL', 190, 260, 340, 310, 4);
printRegion('4. Node 2 -> Node 3 (Dashed)', 160, 320, 240, 420, 3);
printRegion('5. Node 3 -> MEET', 240, 360, 350, 450, 4);
printRegion('6. Node 5 -> Arc', 640, 140, 770, 190, 4);
printRegion('7. Node 5 -> Node 6 (Dashed)', 770, 190, 860, 270, 3);
printRegion('8. Node 6 -> MEET', 680, 260, 810, 310, 4);
printRegion('9. Node 6 -> Node 7 (Dashed)', 770, 320, 860, 420, 3);
printRegion('10. Node 7 -> MEET', 670, 360, 780, 450, 4);
