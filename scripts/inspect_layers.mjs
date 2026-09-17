import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

// Let's create an inspection HTML file that renders each layer with toggles or side-by-side
const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #333; color: white; font-family: sans-serif; padding: 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    svg { width: 100%; border: 1px solid #555; background: #faf3e3; }
    h3 { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>Arc & Background Layer Inspection</h1>
  <div class="grid">
    <div>
      <h3>Current Left Side (Full Composition)</h3>
      <svg viewBox="0 500 600 440">
        ${svg.match(/<g id="layer-static-back">[\s\S]*?<\/g>/)[0]}
        ${svg.match(/<g id="group-left-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
      </svg>
    </div>
    <div>
      <h3>Current Right Side (Mirrored for comparison)</h3>
      <svg viewBox="1072 500 600 440">
        ${svg.match(/<g id="layer-static-back">[\s\S]*?<\/g>/)[0]}
        ${svg.match(/<g id="group-right-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
      </svg>
    </div>
    <div>
      <h3>Left Arcs Only (No background silhouettes)</h3>
      <svg viewBox="0 500 600 440">
        ${svg.match(/<g id="group-left-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
      </svg>
    </div>
    <div>
      <h3>Right Arcs Only</h3>
      <svg viewBox="1072 500 600 440">
        ${svg.match(/<g id="group-right-arcs">[\s\S]*?<\/g>\s*<\/g>/)[0]}
      </svg>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('scripts/inspect_layers.html', html, 'utf8');
console.log('Saved scripts/inspect_layers.html');
