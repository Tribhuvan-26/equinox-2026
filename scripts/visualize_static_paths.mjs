import fs from 'fs';

const svg = fs.readFileSync('ipl-auction-animation/scene.svg', 'utf8');

const staticBack = svg.match(/<g id="layer-static-back">([\s\S]*?)<\/g>/)[1];
const staticPaths = [...staticBack.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"/g)];

const colors = ['red', 'blue', 'green', 'orange'];
const html = `<!DOCTYPE html>
<html>
<head><style>svg{width:48%;border:1px solid #ccc;background:#faf3e3;}</style></head>
<body>
  <h2>Static Back Paths</h2>
  ${staticPaths.map((p, i) => `
    <div>
      <h3>Path ${i}: ${p[2]} ${p[3]}</h3>
      <svg viewBox="0 500 1672 440">
        <path d="${p[1]}" fill="${colors[i]}" transform="${p[3]}" />
      </svg>
    </div>
  `).join('')}
</body>
</html>`;

fs.writeFileSync('scripts/static_paths_vis.html', html, 'utf8');
console.log('Saved scripts/static_paths_vis.html');
