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

const poster = decodePng('C:/Users/nithy/.gemini/antigravity-ide/brain/6e3df3a3-2c3a-4cd8-b6aa-087b205e5f23/.user_uploaded/media_1789666453254.png');

// Find the hanging sign in the poster (blue rectangle at top left):
// What are its coordinates in 1024x577?
// The sign has color ~RGB(67, 97, 238) or similar blue.
let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
for (let y = 0; y < 300; y++) {
  for (let x = 0; x < 300; x++) {
    const idx = (y * poster.width + x) * 4;
    const r = poster.pixels[idx];
    const g = poster.pixels[idx+1];
    const b = poster.pixels[idx+2];
    // Blue sign board
    if (b > 180 && r < 120 && g < 150) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log('Blue hanging sign in original poster:');
console.log({ minX, maxX, minY, maxY });

// Also check the canopy tent blue:
let cMinX = 9999, cMaxX = 0, cMinY = 9999, cMaxY = 0;
for (let y = 180; y < 350; y++) {
  for (let x = 0; x < 400; x++) {
    const idx = (y * poster.width + x) * 4;
    const r = poster.pixels[idx];
    const g = poster.pixels[idx+1];
    const b = poster.pixels[idx+2];
    if (b > 180 && r < 120 && g < 150) {
      // Exclude the hanging sign area if x < maxX and y < maxY
      if (x >= minX && x <= maxX && y <= maxY) continue;
      if (x < cMinX) cMinX = x;
      if (x > cMaxX) cMaxX = x;
      if (y < cMinY) cMinY = y;
      if (y > cMaxY) cMaxY = y;
    }
  }
}
console.log('Canopy tent roof bounds:');
console.log({ cMinX, cMaxX, cMinY, cMaxY });
