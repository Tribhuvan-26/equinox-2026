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

// Find small connected components of blue and green pixels
const isBlue = (r, g, b) => b > 200 && r > 70 && r < 160 && g > 90 && g < 170;
const isGreen = (r, g, b) => g > 200 && r < 100 && b < 150;

console.log('Image dimensions:', width, height);

// Find dots by connected component labeling
const visited = new Uint8Array(width * height);
const components = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x;
    if (visited[idx]) continue;
    const { r, g, b, a } = getPixel(x, y);
    if (a > 100 && (isBlue(r, g, b) || isGreen(r, g, b))) {
      const type = isBlue(r, g, b) ? 'blue' : 'green';
      const queue = [[x, y]];
      visited[idx] = 1;
      let minX = x, maxX = x, minY = y, maxY = y, count = 0;
      let sumX = 0, sumY = 0;
      
      while (queue.length > 0) {
        const [qx, qy] = queue.pop();
        sumX += qx;
        sumY += qy;
        count++;
        if (qx < minX) minX = qx;
        if (qx > maxX) maxX = qx;
        if (qy < minY) minY = qy;
        if (qy > maxY) maxY = qy;
        
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = qx + dx, ny = qy + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nidx = ny * width + nx;
            if (!visited[nidx]) {
              const np = getPixel(nx, ny);
              if (np.a > 100 && ((type === 'blue' && isBlue(np.r, np.g, np.b)) || (type === 'green' && isGreen(np.r, np.g, np.b)))) {
                visited[nidx] = 1;
                queue.push([nx, ny]);
              }
            }
          }
        }
      }
      
      components.push({
        type,
        count,
        cx: Math.round(sumX / count),
        cy: Math.round(sumY / count),
        minX, maxX, minY, maxY,
        w: maxX - minX + 1,
        h: maxY - minY + 1
      });
    }
  }
}

console.log('Total blue/green components:', components.length);
// Sort by size
const dots = components.filter(c => c.count >= 10 && c.count <= 300 && c.w <= 20 && c.h <= 20);
console.log('\n--- DETECTED SMALL DOTS / NODES ---');
dots.forEach(d => console.log(`${d.type} dot at (${d.cx}, ${d.cy}) size: ${d.w}x${d.h}, pixel count: ${d.count}`));

const largeRings = components.filter(c => c.w > 40 && c.h > 40);
console.log('\n--- DETECTED LARGE RINGS / ARCS / LINES ---');
largeRings.forEach(d => console.log(`${d.type} large feature at bbox [${d.minX}, ${d.minY}, ${d.maxX}, ${d.maxY}] size: ${d.w}x${d.h}, count: ${d.count}`));
