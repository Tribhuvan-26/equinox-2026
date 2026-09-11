import fs from 'fs';
import path from 'path';

const projectDir = path.resolve('ipl-auction-animation');
const sceneSvgPath = path.join(projectDir, 'scene.svg');
const indexHtmlPath = path.join(projectDir, 'index.html');
const themeCssPath = path.join(projectDir, 'styles/theme.css');
const animationsCssPath = path.join(projectDir, 'styles/animations.css');

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

// 2. scene.svg content checks
const svgContent = fs.readFileSync(sceneSvgPath, 'utf8');
assert(svgContent.includes('viewBox="0 0 1200 700"'), 'scene.svg has viewBox 0 0 1200 700');
assert(svgContent.includes('id="background"'), 'scene.svg has id="background"');
assert(svgContent.includes('id="decor-arcs"'), 'scene.svg has id="decor-arcs"');
assert(svgContent.includes('id="banner-left"'), 'scene.svg has id="banner-left"');
assert(svgContent.includes('id="banner-right"'), 'scene.svg has id="banner-right"');
assert(svgContent.includes('id="headline"'), 'scene.svg has id="headline"');
assert(svgContent.includes('id="budget-pill"'), 'scene.svg has id="budget-pill"');
assert(svgContent.includes('id="team-row"'), 'scene.svg has id="team-row"');
assert(svgContent.includes('id="stage-people"'), 'scene.svg has id="stage-people"');
assert(svgContent.includes('id="audience"'), 'scene.svg has id="audience"');
assert(svgContent.includes('data-team="1"'), 'scene.svg has data-team 1');
assert(svgContent.includes('data-team="10"'), 'scene.svg has data-team 10');
assert(svgContent.includes('data:image/png;base64,'), 'scene.svg contains base64 image data intact');
assert(!svgContent.includes('@keyframes'), 'scene.svg has NO embedded @keyframes (moved to styles/animations.css)');
assert(svgContent.includes("styles/animations.css"), 'scene.svg references styles/animations.css');

// 3. animations.css checks
const animContent = fs.readFileSync(animationsCssPath, 'utf8');
assert(animContent.includes('@keyframes sway'), 'animations.css contains sway keyframes');
assert(animContent.includes('#banner-left'), 'animations.css binds #banner-left to sway');
assert(animContent.includes('#banner-right'), 'animations.css binds #banner-right to sway');

assert(animContent.includes('@keyframes popIn'), 'animations.css contains popIn keyframes');
assert(animContent.includes('.team-slot'), 'animations.css binds .team-slot to popIn');
assert(animContent.includes('animation-delay: 0.50s') || animContent.includes('animation-delay: 0.5s'), 'animations.css contains 10-slot stagger');

assert(animContent.includes('@keyframes bob'), 'animations.css contains bob keyframes');
assert(animContent.includes('#stage-people'), 'animations.css binds #stage-people to bob');

assert(animContent.includes('@keyframes stageShadowPulse'), 'animations.css contains stageShadowPulse keyframes');
assert(animContent.includes('#stage-people image'), 'animations.css binds #stage-people image to stageShadowPulse');

assert(animContent.includes('@keyframes headlinePulse'), 'animations.css contains headlinePulse keyframes');
assert(animContent.includes('#headline'), 'animations.css binds #headline to headlinePulse');

// 4. theme.css checks
const themeContent = fs.readFileSync(themeCssPath, 'utf8');
assert(themeContent.includes('--bg: #faf3e3;'), 'theme.css defines --bg');
assert(themeContent.includes('--navy: #0d1b3e;'), 'theme.css defines --navy');
assert(themeContent.includes('--blue: #2450d8;'), 'theme.css defines --blue');
assert(themeContent.includes('--gold: #f2b73a;'), 'theme.css defines --gold');
assert(themeContent.includes('--pink: #e0357a;'), 'theme.css defines --pink');
assert(themeContent.includes('--white: #ffffff;'), 'theme.css defines --white');

// 5. index.html checks
const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
assert(htmlContent.includes('styles/theme.css'), 'index.html links styles/theme.css');
assert(htmlContent.includes('styles/animations.css'), 'index.html links styles/animations.css');
assert(htmlContent.includes('viewBox="0 0 1200 700"'), 'index.html renders SVG with viewBox');
assert(htmlContent.includes('width: 100%'), 'index.html container is full-width responsive');

if (failed) {
  console.error('VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
}
