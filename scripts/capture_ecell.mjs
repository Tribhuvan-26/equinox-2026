import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const currentArtifactDir = 'C:\\Users\\nithy\\.gemini\\antigravity-ide\\brain\\117b167b-a9c8-427e-a061-df5c378fb654';

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function capture(url, outName, waitMs = 5000) {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,720',
    '--hide-scrollbars',
    url
  ]);

  try {
    let connected = false;
    let targets = null;
    for (let i = 0; i < 30; i++) {
      await sleep(200);
      try {
        targets = await fetchJson('http://127.0.0.1:9224/json/list');
        if (targets && targets.length > 0) {
          connected = true;
          break;
        }
      } catch (e) {}
    }

    if (!connected) throw new Error('Could not connect to Chrome on port 9224');

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    await sendCommand(ws, 'Page.enable');
    await sleep(waitMs);

    const ss = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(currentArtifactDir, outName);
    fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
    console.log(`Saved screenshot to ${outPath}`);

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

const url = process.argv[2] || 'http://localhost:3000/events/e-cell-meet';
const outName = process.argv[3] || 'ecell_settled.png';
const waitMs = parseInt(process.argv[4] || '5200', 10);

capture(url, outName, waitMs);
