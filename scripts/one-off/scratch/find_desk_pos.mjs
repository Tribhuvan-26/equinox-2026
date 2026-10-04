import fs from 'fs';
import zlib from 'zlib';

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  const idatChunks = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
      bitDepth = buf.readUInt8(offset + 16);
      colorType = buf.readUInt8(offset + 17);
    } else if (type === 'IDAT') idatChunks.push(buf.slice(offset + 8, offset + 8 + len));
    else if (type === 'IEND') break;
    offset += 12 + len;
  }
  const idat = Buffer.concat(idatChunks);
  const raw = zlib.inflateSync(idat);
  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
  const stride = width * bytesPerPixel + 1;
  const pixels = Buffer.alloc(width * height * 4);
  let prevRow = Buffer.alloc(width * bytesPerPixel);
  for (let y = 0; y < height; y++) {
    const rowStart = y * stride;
    const filterType = raw[rowStart];
    const currentRow = Buffer.alloc(width * bytesPerPixel);
    for (let i = 0; i < width * bytesPerPixel; i++) {
      const rawByte = raw[rowStart + 1 + i];
      const a = i >= bytesPerPixel ? currentRow[i - bytesPerPixel] : 0;
      const b = prevRow[i];
      const c = i >= bytesPerPixel ? prevRow[i - bytesPerPixel] : 0;
      let val = 0;
      if (filterType === 0) val = rawByte;
      else if (filterType === 1) val = (rawByte + a) & 0xff;
      else if (filterType === 2) val = (rawByte + b) & 0xff;
      else if (filterType === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        val = (rawByte + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
      }
      currentRow[i] = val;
    }
    for (let x = 0; x < width; x++) {
      const pIdx = (y * width + x) * 4;
      const cIdx = x * bytesPerPixel;
      if (bytesPerPixel === 4) {
        pixels[pIdx] = currentRow[cIdx];
        pixels[pIdx + 1] = currentRow[cIdx + 1];
        pixels[pIdx + 2] = currentRow[cIdx + 2];
        pixels[pIdx + 3] = currentRow[cIdx + 3];
      } else if (bytesPerPixel === 3) {
        pixels[pIdx] = currentRow[cIdx];
        pixels[pIdx + 1] = currentRow[cIdx + 1];
        pixels[pIdx + 2] = currentRow[cIdx + 2];
        pixels[pIdx + 3] = 255;
      }
    }
    prevRow = currentRow;
  }
  return { width, height, pixels };
}

const base = decodePng('public/assets/events/ecell/1_base_scene.png');
const desk = decodePng('public/assets/events/ecell/test_desk_face.png');

console.log('Base:', base.width, base.height);
console.log('Desk:', desk.width, desk.height);

// Find best match position for desk in base
let bestX = 0, bestY = 0, minDiff = Infinity;
for (let by = 600; by <= 750; by += 2) {
  for (let bx = 180; bx <= 300; bx += 2) {
    let diff = 0;
    let samples = 0;
    for (let dy = 20; dy < desk.height - 20; dy += 10) {
      for (let dx = 20; dx < desk.width - 20; dx += 10) {
        const dIdx = (dy * desk.width + dx) * 4;
        if (desk.pixels[dIdx + 3] > 200) {
          const bIdx = ((by + dy) * base.width + (bx + dx)) * 4;
          diff += Math.abs(desk.pixels[dIdx] - base.pixels[bIdx]) +
                  Math.abs(desk.pixels[dIdx+1] - base.pixels[bIdx+1]) +
                  Math.abs(desk.pixels[dIdx+2] - base.pixels[bIdx+2]);
          samples++;
        }
      }
    }
    const avgDiff = diff / samples;
    if (avgDiff < minDiff) {
      minDiff = avgDiff;
      bestX = bx;
      bestY = by;
    }
  }
}
console.log('Desk best position in base:', { bestX, bestY, minDiff });
