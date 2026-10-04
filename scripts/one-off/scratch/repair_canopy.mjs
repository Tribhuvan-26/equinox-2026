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
  const bytesPerPixel = colorType === 6 ? 4 : 3;
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

function encodePng(width, height, pixels, destPath) {
  const stride = width * 4 + 1;
  const outRaw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    outRaw[y * stride] = 0;
    pixels.copy(outRaw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(outRaw);
  function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
    return ~c;
  }
  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const crc = crc32(chunk.slice(4, 8 + len));
    chunk.writeInt32BE(crc, 8 + len);
    return chunk;
  }
  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  fs.writeFileSync(destPath, Buffer.concat([
    header,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0))
  ]));
}

const base = decodePng('public/assets/events/ecell/1_base_scene.png');
const poster = decodePng('C:/Users/nithy/.gemini/antigravity-ide/brain/6e3df3a3-2c3a-4cd8-b6aa-087b205e5f23/.user_uploaded/media_1789666453254.png');

// In poster (1024x577), let's find the canopy roof:
// The canopy roof in poster is between x=50..360, y=210..300
// Let's sample a pixel from poster:
function samplePoster(bx, by) {
  const px = Math.round(bx * (poster.width / base.width));
  const py = Math.round(by * (poster.height / base.height));
  if (px >= 0 && px < poster.width && py >= 0 && py < poster.height) {
    const idx = (py * poster.width + px) * 4;
    return [poster.pixels[idx], poster.pixels[idx+1], poster.pixels[idx+2], poster.pixels[idx+3]];
  }
  return [0, 0, 0, 0];
}

// In base (1670x942), the canopy roof ridge is around x=200..450, y=340..420
// Let's see if there are pixels in base that are black or anomalous compared to the smooth blue canopy
// In poster, the canopy is blue (B > 180, R < 120, G < 150)
// If a pixel in that area is blue in poster, copy it to base!
let repairedPixels = 0;
for (let y = 330; y <= 450; y++) {
  for (let x = 150; x <= 450; x++) {
    const pColor = samplePoster(x, y);
    // If poster is blue canopy
    if (pColor[2] > 180 && pColor[0] < 120 && pColor[1] < 150) {
      const bIdx = (y * base.width + x) * 4;
      // If base is NOT blue (e.g. black patch or smudge), restore it!
      const bR = base.pixels[bIdx], bG = base.pixels[bIdx+1], bB = base.pixels[bIdx+2];
      if (bB < 160 || bR > 140 || (Math.abs(bR - bG) < 10 && bB < 200)) {
        base.pixels[bIdx] = pColor[0];
        base.pixels[bIdx+1] = pColor[1];
        base.pixels[bIdx+2] = pColor[2];
        base.pixels[bIdx+3] = 255;
        repairedPixels++;
      }
    }
  }
}
console.log('Repaired canopy pixels in 1_base_scene:', repairedPixels);

encodePng(base.width, base.height, base.pixels, 'public/assets/events/ecell/1_base_scene.png');
console.log('Saved repaired 1_base_scene.png!');
