import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// Let's create an SVG that shows:
// 1. The mirrored right blue curve in blue (#6979FB)
// 2. The mirrored right green curve in green (#46F788)
// 3. The people and podium on top!
// And see how it looks!

const data = JSON.parse(fs.readFileSync('scripts/arcs_dump.json', 'utf8'));

function parsePath(d) {
  const cmds = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    cmds.push({ type: match[1], args: match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) });
  }
  return cmds;
}

function mirrorPathX(d) {
  const cmds = parsePath(d);
  let res = '';
  for (const cmd of cmds) {
    res += cmd.type;
    if (cmd.type === 'Z' || cmd.type === 'z') {
      res += ' ';
      continue;
    }
    const newArgs = [...cmd.args];
    for (let i = 0; i < newArgs.length; i += 2) {
      newArgs[i] = -newArgs[i];
    }
    res += newArgs.join(' ') + ' ';
  }
  return res.trim();
}

const mirBlueD = mirrorPathX(data.rightBlue.match(/d="([^"]+)"/)[1]);
const mirGreenD = mirrorPathX(data.rightGreen.match(/d="([^"]+)"/)[1]);

const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 500 650 440" width="1300" height="880">
  <defs>
    ${svg.match(/<defs>([\s\S]*?)<\/defs>/)[1]}
  </defs>
  <rect width="1672" height="940" fill="#F7F1E5" />
  ${svg.match(/<g id="layer-static-back">[\s\S]*?<\/g>/)[0]}
  <g id="group-left-arcs">
    <g id="layer-left-blue-arc" class="arc-parallax-blue" mask="url(#mask-left-blue)">
      <path d="${mirBlueD}" fill="#6979FB" transform="translate(0, 622)" />
    </g>
    <g id="layer-left-green-arc" class="arc-parallax-green" mask="url(#mask-left-green)">
      <path d="${mirGreenD}" fill="#46F788" transform="translate(0, 702)" />
    </g>
  </g>
  ${svg.match(/<g id="layer-people-podium-static">[\s\S]*?<\/g>\s*<\/svg>/)[0].replace('</svg>', '')}
</svg>`;

fs.writeFileSync('scripts/test_mirrored_both.svg', testSvg, 'utf8');
console.log('Saved scripts/test_mirrored_both.svg');
