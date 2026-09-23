import { spawn } from 'child_process';
import http from 'http';

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

async function run() {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
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
        targets = await fetchJson('http://127.0.0.1:9225/json/list');
        if (targets && targets.length > 0) break;
      } catch (e) {}
    }

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');
    for (let i = 0; i < 40; i++) {
      const chk = await sendCommand(ws, 'Runtime.evaluate', {
        expression: '!!document.getElementById("sub-word-connect")'
      });
      if (chk && chk.result && chk.result.value) {
        console.log(`Found element after ${i * 250}ms`);
        break;
      }
      await sleep(250);
    }

    const evalRes = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        function getBox(id) {
          const el = document.getElementById(id);
          if (!el) return null;
          const b = el.getBBox();
          return { id, x: b.x, y: b.y, width: b.width, height: b.height, right: b.x + b.width, bottom: b.y + b.height };
        }
        return JSON.stringify({
          connect: getBox('sub-word-connect'),
          collaborate: getBox('sub-word-collaborate'),
          create: getBox('sub-word-create'),
          subLineLeft: getBox('sub-line-left'),
          subLineRight: getBox('sub-line-right'),
          titleECell: getBox('title-ecell'),
          titleMeet: getBox('title-meet'),
          peopleImg: getBox('ecell-people-image'),
          upperArc: getBox('upper-arc-path')
        });
      })()`,
      returnByValue: true
    });

    console.log('MEASURED SVG BBOXES:', JSON.parse(evalRes.result.value));
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run();
