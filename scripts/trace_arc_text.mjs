import sharp from 'sharp';

const refPath = 'c:/Users/nithy/.gemini/antigravity-ide/brain/2eeb35cc-3f42-4cd3-b583-9b14e93f0d49/.user_uploaded/media_1790188045395.png';

async function traceArcAndText() {
  const image = sharp(refPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const raw = await image.raw().toBuffer();

  function getPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return [0, 0, 0, 0];
    const idx = (y * width + x) * metadata.channels;
    return [raw[idx], raw[idx + 1], raw[idx + 2], raw[idx + 3]];
  }

  // Find exact pixels of the white letters in E-CELL
  // Let's sample along horizontal lines to find text width
  let textWhiteSamples = [];
  for (let y = 170; y < 290; y += 5) {
    let minX = 1000, maxX = 0;
    for (let x = 280; x < 740; x++) {
      const [r, g, b] = getPixel(x, y);
      if (r > 240 && g > 240 && b > 240) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    if (maxX > minX) {
      textWhiteSamples.push({ y, minX, maxX, width: maxX - minX });
    }
  }

  // Find the exact top and bottom of E-CELL
  let ecellTop = 1000, ecellBottom = 0, ecellLeft = 1000, ecellRight = 0;
  for (let y = 100; y < 350; y++) {
    for (let x = 300; x < 720; x++) {
      const [r, g, b] = getPixel(x, y);
      if (r > 235 && g > 235 && b > 235) {
        if (y < ecellTop) ecellTop = y;
        if (y > ecellBottom) ecellBottom = y;
        if (x < ecellLeft) ecellLeft = x;
        if (x > ecellRight) ecellRight = x;
      }
    }
  }

  // Find the exact top and bottom of MEET
  let meetTop = 1000, meetBottom = 0, meetLeft = 1000, meetRight = 0;
  for (let y = 250; y < 450; y++) {
    for (let x = 300; x < 720; x++) {
      const [r, g, b] = getPixel(x, y);
      // Lavender-blue #7484FE (r ~ 116, g ~ 132, b ~ 254)
      if (r > 95 && r < 140 && g > 115 && g < 155 && b > 225) {
        if (y < meetTop) meetTop = y;
        if (y > meetBottom) meetBottom = y;
        if (x < meetLeft) meetLeft = x;
        if (x > meetRight) meetRight = x;
      }
    }
  }

  console.log('E-CELL text exact:', { ecellLeft, ecellRight, width: ecellRight - ecellLeft, ecellTop, ecellBottom, height: ecellBottom - ecellTop });
  console.log('MEET text exact:', { meetLeft, meetRight, width: meetRight - meetLeft, meetTop, meetBottom, height: meetBottom - meetTop });

  // People group exact:
  let pTop = 1000, pBottom = 0, pLeft = 1000, pRight = 0;
  for (let y = 80; y < 180; y++) {
    for (let x = 440; x < 580; x++) {
      const [r, g, b] = getPixel(x, y);
      // people heads are green (#33FF67) or blue (#7484FE)
      if ((r < 80 && g > 220 && b < 140) || (r > 95 && r < 140 && g > 115 && g < 155 && b > 225)) {
        if (y < pTop) pTop = y;
        if (y > pBottom) pBottom = y;
        if (x < pLeft) pLeft = x;
        if (x > pRight) pRight = x;
      }
    }
  }
  console.log('People heads exact:', { pLeft, pRight, width: pRight - pLeft, pTop, pBottom, height: pBottom - pTop });

  // Arc stroke exact: find blue arc pixels
  const arcPoints = [];
  for (let x = 340; x <= 680; x += 10) {
    for (let y = 50; y < 220; y++) {
      const [r, g, b] = getPixel(x, y);
      // Arc is blue #7484FE
      if (r > 90 && r < 140 && g > 110 && g < 155 && b > 220) {
        // Check if adjacent pixels are dark background to confirm stroke
        const [rb, gb, bb] = getPixel(x, y - 4);
        if (rb < 50 && gb < 50 && bb < 50) {
          arcPoints.push({ x, y });
          break;
        }
      }
    }
  }
  console.log('Arc points sampled (top of stroke):', arcPoints);
}

traceArcAndText();
