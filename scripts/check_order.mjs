import fs from 'fs';

const svg = fs.readFileSync('app/overlay-animations/animations/events/IplAuction/scene.svg', 'utf8');

const regex = /id="([^"]+)"/g;
let m;
while ((m = regex.exec(svg)) !== null) {
  console.log(`id="${m[1]}" index=${m.index}`);
}
