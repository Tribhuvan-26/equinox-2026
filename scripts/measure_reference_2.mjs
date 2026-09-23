import sharp from 'sharp';
import fs from 'fs';

const refPath = 'c:/Users/nithy/.gemini/antigravity-ide/brain/2eeb35cc-3f42-4cd3-b583-9b14e93f0d49/.user_uploaded/media_1790188045395.png';

async function analyze() {
  const image = sharp(refPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const raw = await image.raw().toBuffer();

  function getPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return [0, 0, 0, 0];
    const idx = (y * width + x) * metadata.channels;
    return [raw[idx], raw[idx + 1], raw[idx + 2], raw[idx + 3]];
  }

  // Find pure white pixels (E-CELL) in central region
  let minWhiteX = width, maxWhiteX = 0, minWhiteY = height, maxWhiteY = 0;
  // Find blue pixels for MEET (channels: R ~ 116, G ~ 132, B ~ 254)
  let minMeetX = width, maxMeetX = 0, minMeetY = height, maxMeetY = 0;
  // Find green pixels for subtitle COLLABORATE or dots
  // Find Arc top (blue arc near top center)

  for (let y = 50; y < 450; y++) {
    for (let x = 200; x < 850; x++) {
      const [r, g, b] = getPixel(x, y);
      // Pure white text E-CELL
      if (r > 240 && g > 240 && b > 240 && y < 330) {
        if (x < minWhiteX) minWhiteX = x;
        if (x > maxWhiteX) maxWhiteX = x;
        if (y < minWhiteY) minWhiteY = y;
        if (y > maxWhiteY) maxWhiteY = y;
      }
      // Lavender-blue text MEET
      // MEET is roughly r: 100-140, g: 120-160, b: 230-255
      if (r > 90 && r < 145 && g > 110 && g < 165 && b > 220 && y > 260 && y < 430) {
        if (x < minMeetX) minMeetX = x;
        if (x > maxMeetX) maxMeetX = x;
        if (y < minMeetY) minMeetY = y;
        if (y > maxMeetY) maxMeetY = y;
      }
    }
  }

  console.log('E-CELL bounds (white):', {
    x: minWhiteX,
    y: minWhiteY,
    width: maxWhiteX - minWhiteX,
    height: maxWhiteY - minWhiteY,
    right: maxWhiteX,
    bottom: maxWhiteY,
    centerX: (minWhiteX + maxWhiteX) / 2
  });

  console.log('MEET bounds (blue):', {
    x: minMeetX,
    y: minMeetY,
    width: maxMeetX - minMeetX,
    height: maxMeetY - minMeetY,
    right: maxMeetX,
    bottom: maxMeetY,
    centerX: (minMeetX + maxMeetX) / 2
  });

  // Find green dot near Left Title (net-dot-2) and right title (net-dot-6)
  const greenDots = [];
  const blueDots = [];
  for (let y = 100; y < 450; y++) {
    for (let x = 200; x < 850; x++) {
      const [r, g, b] = getPixel(x, y);
      // Bright green dot (#33FF67: r ~ 51, g ~ 255, b ~ 103)
      if (r < 80 && g > 220 && b < 140) {
        greenDots.push({ x, y });
      }
      // Arc / line dots blue
      if (r > 100 && r < 140 && g > 115 && g < 155 && b > 230 && (y < 200 || x < 350 || x > 680)) {
        blueDots.push({ x, y });
      }
    }
  }

  // Find Subtitle baseline
  let minSubY = height, maxSubY = 0;
  for (let y = 390; y < 460; y++) {
    for (let x = 320; x < 700; x++) {
      const [r, g, b] = getPixel(x, y);
      if (r > 230 && g > 230 && b > 230) {
        if (y < minSubY) minSubY = y;
        if (y > maxSubY) maxSubY = y;
      }
    }
  }
  console.log('Subtitle Y range:', { minSubY, maxSubY, centerSubY: (minSubY + maxSubY) / 2 });

  // People Group image bounds (green & blue figures around x ~ 512, y ~ 60-150)
  let minPeopleY = height, maxPeopleY = 0, minPeopleX = width, maxPeopleX = 0;
  for (let y = 50; y < 180; y++) {
    for (let x = 430; x < 590; x++) {
      const [r, g, b] = getPixel(x, y);
      // Colored pixels (not background #222)
      if (r > 60 || g > 60 || b > 60) {
        if (x < minPeopleX) minPeopleX = x;
        if (x > maxPeopleX) maxPeopleX = x;
        if (y < minPeopleY) minPeopleY = y;
        if (y > maxPeopleY) maxPeopleY = y;
      }
    }
  }
  console.log('People Group bounds:', {
    x: minPeopleX,
    y: minPeopleY,
    width: maxPeopleX - minPeopleX,
    height: maxPeopleY - minPeopleY,
    right: maxPeopleX,
    bottom: maxPeopleY,
    centerX: (minPeopleX + maxPeopleX) / 2
  });

  // Arc top
  for (let y = 20; y < 100; y++) {
    for (let x = 490; x < 535; x++) {
      const [r, g, b] = getPixel(x, y);
      if (r < 80 && g > 220 && b < 140) {
        console.log('Arc top dot found at:', { x, y });
        break;
      }
    }
  }
}

analyze();
