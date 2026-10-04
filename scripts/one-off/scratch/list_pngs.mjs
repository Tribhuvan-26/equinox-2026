import fs from 'fs';

const dir = 'public/assets/events/ecell';
const files = fs.readdirSync(dir);
files.filter(f => f.endsWith('.png')).forEach(f => {
  const buf = fs.readFileSync(dir + '/' + f);
  if (buf.toString('ascii', 1, 4) === 'PNG') {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    console.log(f.padEnd(35), `${w}x${h}`);
  }
});
