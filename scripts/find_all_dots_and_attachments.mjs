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

// 7 nodes:
const nodes = [
  { id: 1, name: 'Node 1 (TL, Blue)', cx: 230, cy: 155 },
  { id: 2, name: 'Node 2 (ML, Green)', cx: 165, cy: 290 },
  { id: 3, name: 'Node 3 (BL, Blue)', cx: 220, cy: 435 },
  { id: 4, name: 'Node 4 (BC, Blue)', cx: 512, cy: 495 },
  { id: 5, name: 'Node 5 (TR, Green)', cx: 794, cy: 155 },
  { id: 6, name: 'Node 6 (MR, Blue)', cx: 859, cy: 290 },
  { id: 7, name: 'Node 7 (BR, Green)', cx: 804, cy: 435 },
];

// For each node, let's print a high-res ASCII grid around it (radius 55px)
nodes.forEach(node => {
  console.log(`\n======================================================`);
  console.log(`ANALYSIS OF ${node.name} at (~${node.cx}, ~${node.cy})`);
  console.log(`======================================================`);
  
  for (let y = node.cy - 50; y <= node.cy + 50; y += 4) {
    let line = `${y.toString().padStart(3)}: `;
    for (let x = node.cx - 55; x <= node.cx + 55; x += 3) {
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
});
