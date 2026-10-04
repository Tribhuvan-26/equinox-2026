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

// Check 1_base_scene.png
const base = decodePng('public/assets/events/ecell/1_base_scene.png');
console.log('1_base_scene loaded:', base.width, base.height);

// Check user image media_1789666453254.png
const userPoster = decodePng('C:/Users/nithy/.gemini/antigravity-ide/brain/6e3df3a3-2c3a-4cd8-b6aa-087b205e5f23/.user_uploaded/media_1789666453254.png');
console.log('userPoster loaded:', userPoster.width, userPoster.height);

// Let's find the canopy in userPoster:
// In userPoster (1024x577), the booth canopy peak is around x = 200..250, y = 200..250
// Let's sample colors in userPoster at x=200..250, y=210..240:
console.log('User poster canopy roof:');
for (let y = 210; y <= 240; y += 10) {
  for (let x = 200; x <= 250; x += 15) {
    const idx = (y * userPoster.width + x) * 4;
    console.log(`UserPoster (${x},${y}): RGB(${userPoster.pixels[idx]}, ${userPoster.pixels[idx+1]}, ${userPoster.pixels[idx+2]})`);
  }
}

// Now let's check 1_base_scene at corresponding scaled coordinates:
// Scale factor: x * (1670/1024) = x * 1.6308, y * (942/577) = y * 1.6325
console.log('1_base_scene at scaled canopy coordinates:');
for (let y = 210; y <= 240; y += 10) {
  for (let x = 200; x <= 250; x += 15) {
    const bx = Math.round(x * 1.6308);
    const by = Math.round(y * 1.6325);
    const idx = (by * base.width + bx) * 4;
    console.log(`BaseScene (${bx},${by}): RGB(${base.pixels[idx]}, ${base.pixels[idx+1]}, ${base.pixels[idx+2]})`);
  }
}
