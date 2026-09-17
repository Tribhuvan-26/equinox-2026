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

// In poster (1024x577), let's find the exact coordinates of the hanging sign:
// The sign has white suspension strings at top: where are the strings?
console.log('Searching for white strings at y=0..30, x=30..220:');
for (let y = 0; y < 30; y += 5) {
  const whiteX = [];
  for (let x = 30; x < 220; x++) {
    const idx = (y * poster.width + x) * 4;
    if (poster.pixels[idx] > 200 && poster.pixels[idx+1] > 200 && poster.pixels[idx+2] > 200) {
      whiteX.push(x);
    }
  }
  console.log(`y=${y}: white pixels at x:`, whiteX);
}

// Where is the blue sign body?
// Top of blue sign body, bottom of blue sign body, left, right:
let sTop = 9999, sBottom = 0, sLeft = 9999, sRight = 0;
for (let y = 20; y < 260; y++) {
  for (let x = 30; x < 220; x++) {
    const idx = (y * poster.width + x) * 4;
    const r = poster.pixels[idx], g = poster.pixels[idx+1], b = poster.pixels[idx+2];
    // Blue sign color in poster is roughly (65, 95, 235) to (75, 115, 255)
    if (b > 180 && r < 120 && g < 150) {
      if (y < sTop) sTop = y;
      if (y > sBottom) sBottom = y;
      if (x < sLeft) sLeft = x;
      if (x > sRight) sRight = y; // wait, x
    }
  }
}
console.log('Blue sign body approx: top', sTop, 'bottom', sBottom, 'left', sLeft);

// Now where is the canopy roof?
// Peak of canopy roof:
let cPeakX = 0, cPeakY = 9999;
for (let y = 180; y < 260; y++) {
  for (let x = 180; x < 260; x++) {
    const idx = (y * poster.width + x) * 4;
    const r = poster.pixels[idx], g = poster.pixels[idx+1], b = poster.pixels[idx+2];
    // Canopy blue
    if (b > 180 && r < 120 && g < 150) {
      if (y < cPeakY) {
        cPeakY = y;
        cPeakX = x;
      }
    }
  }
}
console.log('Canopy peak in poster:', { cPeakX, cPeakY });
