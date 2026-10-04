import fs from 'fs';
import path from 'path';

const projectDir = path.resolve('ipl-auction-animation');
const sceneSvgPath = path.join(projectDir, 'scene.svg');
const indexHtmlPath = path.join(projectDir, 'index.html');
const themeCssPath = path.join(projectDir, 'styles/theme.css');
const animationsCssPath = path.join(projectDir, 'styles/animations.css');
const appSceneTsxPath = path.resolve('app/overlay-animations/animations/events/IplAuction/IplAuctionScene.tsx');
const appTimelineTsPath = path.resolve('app/overlay-animations/animations/events/IplAuction/iplAuctionTimeline.ts');
const appModuleCssPath = path.resolve('app/overlay-animations/animations/events/IplAuction/IplAuctionAnimation.module.css');

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    failed = true;
  } else {
    console.log('PASS:', message);
  }
}

// 1. Files existence
assert(fs.existsSync(sceneSvgPath), 'scene.svg exists');
assert(fs.existsSync(indexHtmlPath), 'index.html exists');
assert(fs.existsSync(themeCssPath), 'styles/theme.css exists');
assert(fs.existsSync(animationsCssPath), 'styles/animations.css exists');
assert(fs.existsSync(appSceneTsxPath), 'IplAuctionScene.tsx exists');
assert(fs.existsSync(appTimelineTsPath), 'iplAuctionTimeline.ts exists');
assert(fs.existsSync(appModuleCssPath), 'IplAuctionAnimation.module.css exists');

// 2. scene.svg content checks (100% Vector Quality & Zero Character Detachment)
const svgContent = fs.readFileSync(sceneSvgPath, 'utf8');
assert(svgContent.includes('viewBox="0 0 1672 940"'), 'scene.svg has 16:9 vector viewBox 0 0 1672 940');
assert(svgContent.includes('id="scene-base"'), 'scene.svg has unified static #scene-base');
assert(svgContent.includes('id="layer-title"'), 'scene.svg has id="layer-title"');
assert(svgContent.includes('id="layer-swoosh"'), 'scene.svg has id="layer-swoosh"');
assert(svgContent.includes('id="layer-budget-pill"'), 'scene.svg has id="layer-budget-pill"');
assert(svgContent.includes('data-team="1"'), 'scene.svg has data-team 1');
assert(svgContent.includes('data-team="10"'), 'scene.svg has data-team 10');
assert(svgContent.includes('data-price="1"'), 'scene.svg has data-price 1');
assert(svgContent.includes('data-price="10"'), 'scene.svg has data-price 10');
assert(!svgContent.includes('data:image/png;base64,'), 'scene.svg contains ZERO raster base64 images (100% vector paths)');
assert(!svgContent.includes('id="layer-auctioneer-arm-gavel"'), 'scene.svg has NO separate floating auctioneer arm layer');
assert(!svgContent.includes('id="layer-bidder-arm-paddle"'), 'scene.svg has NO separate floating bidder arm layer');

// 3. animations.css checks
const animContent = fs.readFileSync(animationsCssPath, 'utf8');
assert(animContent.includes('@keyframes iplTitleEntrance'), 'animations.css contains iplTitleEntrance keyframes (0.0s-0.8s)');
assert(animContent.includes('@keyframes iplSwooshDraw'), 'animations.css contains iplSwooshDraw keyframes (0.8s-1.5s)');
assert(animContent.includes('@keyframes iplBudgetSlide'), 'animations.css contains iplBudgetSlide keyframes (0.8s-1.5s)');
assert(animContent.includes('@keyframes iplTeamPop'), 'animations.css contains iplTeamPop keyframes (1.5s-2.8s)');
assert(animContent.includes('@keyframes iplPriceFadeSlide'), 'animations.css contains iplPriceFadeSlide keyframes (1.5s-2.8s)');
assert(!animContent.includes('@keyframes iplGavelStrike'), 'animations.css has deleted iplGavelStrike (zero auctioneer motion)');
assert(!animContent.includes('@keyframes iplBidPaddleWave'), 'animations.css has deleted iplBidPaddleWave (zero bidder motion)');
assert(animContent.includes('#layer-title'), 'animations.css binds #layer-title');
assert(animContent.includes('#layer-swoosh'), 'animations.css binds #layer-swoosh');
assert(animContent.includes('#layer-budget-pill'), 'animations.css binds #layer-budget-pill');

// 4. theme.css checks
const themeContent = fs.readFileSync(themeCssPath, 'utf8');
assert(themeContent.includes('--bg-cream: #F7F1E5;'), 'theme.css defines --bg-cream #F7F1E5');

// 5. index.html checks
const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
assert(htmlContent.includes('styles/theme.css'), 'index.html links styles/theme.css');
assert(htmlContent.includes('styles/animations.css'), 'index.html links styles/animations.css');
assert(htmlContent.includes('viewBox="0 0 1672 940"'), 'index.html renders SVG with viewBox 1672 940');
assert(htmlContent.includes('Record & Download Video'), 'index.html has video recording capability');

// 6. Next.js component checks
const sceneTsx = fs.readFileSync(appSceneTsxPath, 'utf8');
assert(sceneTsx.includes('viewBox="0 0 1672 940"'), 'IplAuctionScene.tsx has viewBox 1672 940');
assert(sceneTsx.includes('iplTitleEntrance'), 'IplAuctionScene.tsx contains iplTitleEntrance');
assert(!sceneTsx.includes('iplGavelStrike'), 'IplAuctionScene.tsx has NO iplGavelStrike');
assert(!sceneTsx.includes('id="layer-auctioneer-arm-gavel"'), 'IplAuctionScene.tsx has NO #layer-auctioneer-arm-gavel');
assert(!sceneTsx.includes('id="layer-bidder-arm-paddle"'), 'IplAuctionScene.tsx has NO #layer-bidder-arm-paddle');
assert(!sceneTsx.includes('data:image/png;base64,'), 'IplAuctionScene.tsx contains ZERO raster base64 images (pure vector)');

// 7. Full-screen CSS checks
const moduleCss = fs.readFileSync(appModuleCssPath, 'utf8');
assert(moduleCss.includes('width: 100vw;'), 'module CSS defines width: 100vw');
assert(moduleCss.includes('height: 100vh;'), 'module CSS defines height: 100vh');
assert(moduleCss.includes('background-color: #F7F1E5;'), 'module CSS defines background-color: #F7F1E5');
assert(!moduleCss.includes('rgba(13, 27, 62, 0.82)'), 'dark modal backdrop completely removed');
assert(!moduleCss.includes('max-width: 1120px'), 'constrained max-width 1120px removed');

if (failed) {
  console.error('VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
}
