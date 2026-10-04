import fs from 'fs';
import zlib from 'zlib';

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.toString('ascii', 1, 4) !== 'PNG') throw new Error('Not PNG');
  
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
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(offset + 8, offset + 8 + len));
    } else if (type === 'IEND') {
      break;
    }
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
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        val = (rawByte + pr) & 0xff;
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

// Check where 1_base_scene and 1_base_scene_clean differ
const base = decodePng('public/assets/events/ecell/1_base_scene.png');
const baseClean = decodePng('public/assets/events/ecell/1_base_scene_clean.png');

let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
for (let y = 0; y < base.height; y++) {
  for (let x = 0; x < base.width; x++) {
    const idx = (y * base.width + x) * 4;
    if (Math.abs(base.pixels[idx] - baseClean.pixels[idx]) > 5 ||
        Math.abs(base.pixels[idx+1] - baseClean.pixels[idx+1]) > 5 ||
        Math.abs(base.pixels[idx+2] - baseClean.pixels[idx+2]) > 5) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log('Diff bounding box between 1_base_scene and 1_base_scene_clean:');
console.log({ minX, maxX, minY, maxY });

// Also check original master
const orig = decodePng('public/assets/events/ecell/ecell-master.original.png');
console.log('ecell-master.original dimensions:', orig.width, orig.height);

// Also check ecell_unified_base.png
const unif = decodePng('public/assets/events/ecell/ecell_unified_base.png');
console.log('ecell_unified_base dimensions:', unif.width, unif.height);

// Check if 1_base_scene has the canopy roof patch at x=100..300, y=320..400
// What color is base vs orig at (200, 360)?
console.log('Base at (200, 360):', base.pixels.slice((360 * base.width + 200)*4, (360 * base.width + 200)*4 + 4));
console.log('BaseClean at (200, 360):', baseClean.pixels.slice((360 * baseClean.width + 200)*4, (360 * baseClean.width + 200)*4 + 4));
console.log('Unif at (200, 360):', unif.pixels.slice((360 * unif.width + 200)*4, (360 * unif.width + 200)*4 + 4));
console.log('Orig at (200, 360):', orig.pixels.slice((360 * orig.width + 200)*4, (360 * orig.width + 200)*4 + 4));
