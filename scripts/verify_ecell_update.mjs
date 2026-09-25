import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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

async function main() {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,720',
    'http://localhost:3000/events/e-cell-meet'
  ]);

  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      await sleep(200);
      try {
        targets = await fetchJson('http://127.0.0.1:9229/json/list');
        if (targets && targets.length > 0) break;
      } catch (e) {}
    }

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');

    // Wait for element to mount
    for (let i = 0; i < 40; i++) {
      const chk = await sendCommand(ws, 'Runtime.evaluate', {
        expression: '!!document.getElementById("sub-word-connect")'
      });
      if (chk && chk.result && chk.result.value) break;
      await sleep(250);
    }

    // Wait 3.5 seconds for animation to reach settled state
    console.log('Waiting for animation to reach settled state...');
    await sleep(3500);

    const screenshotData = await sendCommand(ws, 'Page.captureScreenshot', {
      format: 'png'
    });

    const buffer = Buffer.from(screenshotData.data, 'base64');
    fs.writeFileSync('c:\\Users\\nithy\\OneDrive\\Desktop\\testing\\equinox-2026\\scratch\\ecell_new_settled.png', buffer);
    console.log('Screenshot saved to scratch/ecell_new_settled.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
