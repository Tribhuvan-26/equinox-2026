import fs from 'fs';

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

// Function to mirror a path horizontally around x=0
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
    // In commands like M, L, C, etc., x coordinates are at even indices (0, 2, 4...)
    for (let i = 0; i < newArgs.length; i += 2) {
      newArgs[i] = -newArgs[i];
    }
    res += newArgs.join(' ') + ' ';
  }
  return res.trim();
}

const mirroredRightBlueD = mirrorPathX(data.rightBlue.match(/d="([^"]+)"/)[1]);

const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 500 700 440" width="1400" height="880">
  <rect width="1672" height="940" fill="#F7F1E5" />
  
  <!-- Mirrored Right Blue -->
  <g transform="translate(0, 622)">
    <path d="${mirroredRightBlueD}" fill="#6A79FC" />
  </g>
</svg>`;

fs.writeFileSync('scripts/test_mirrored_rb.svg', testSvg, 'utf8');
console.log('Saved scripts/test_mirrored_rb.svg');
