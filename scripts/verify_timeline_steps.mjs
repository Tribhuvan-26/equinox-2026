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

async function main() {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
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
        targets = await fetchJson('http://127.0.0.1:9227/json/list');
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

    const evalCurrentState = async (label) => {
      const res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
          const getOpacity = id => {
            const el = document.getElementById(id);
            if (!el) return 0;
            return parseFloat(window.getComputedStyle(el).opacity);
          };
          const getClipWidth = id => {
            const el = document.getElementById(id);
            if (!el) return 0;
            return parseFloat(el.getAttribute('width') || '0');
          };
          return {
            label: '${label}',
            blueChevron: getOpacity('bl-chevron-blue'),
            greenChevron: getOpacity('bl-chevron-green'),
            node1: getOpacity('college-node-1'),
            node5: getOpacity('college-node-5'),
            clipDot1: getClipWidth('clip-rect-dot-1'),
            clipDot3: getClipWidth('clip-rect-dot-3'),
            node2: getOpacity('college-node-2'),
            node6: getOpacity('college-node-6'),
            clipDot2: getClipWidth('clip-rect-dot-2'),
            clipDot4: getClipWidth('clip-rect-dot-4'),
            node3: getOpacity('college-node-3'),
            node7: getOpacity('college-node-7'),
            titleECell: getOpacity('title-ecell'),
            titleMeet: getOpacity('title-meet'),
            subWord: getOpacity('sub-word-connect'),
            triInner: getOpacity('tri-inner-1'),
            triOuter: getOpacity('tri-outer-1'),
          };
        })()`,
        returnByValue: true
      });
      return res.result.value;
    };

    console.log('\n--- SAMPLING CONTINUOUS POLISHED FLOW ---');
    await sleep(150);
    console.log(await evalCurrentState('Step 1a: Blue Outer Triangle Active (~0.15s)'));
    await sleep(160);
    console.log(await evalCurrentState('Step 1b: Green Inner Triangle Active (~0.31s)'));
    await sleep(300);
    console.log(await evalCurrentState('Step 2: Level 1 Connections Active (~0.61s)'));
    await sleep(350);
    console.log(await evalCurrentState('Step 3: Level 2 Connections Active (~0.96s)'));
    await sleep(350);
    console.log(await evalCurrentState('Step 4: Level 3 Connections Active (~1.31s)'));
    await sleep(350);
    console.log(await evalCurrentState('Step 5: Title Entrance Active (~1.66s)'));
    await sleep(300);
    console.log(await evalCurrentState('Step 6: Subtitle Active (~1.96s)'));
    await sleep(250);
    console.log(await evalCurrentState('Step 7a: Inner Triangles Active (~2.21s)'));
    await sleep(200);
    console.log(await evalCurrentState('Step 7b: Outer Triangles Active (~2.41s)'));
    await sleep(250);
    const settled1 = await evalCurrentState('Settled State (~2.66s)');
    console.log(settled1);
    await sleep(1000);
    const settled2 = await evalCurrentState('Static Stability Check (~3.66s)');
    console.log(settled2);

    const isIdentical = JSON.stringify(settled1) === JSON.stringify({ ...settled2, label: settled1.label });
    console.log(`\nFinal State Completely Static: ${isIdentical ? 'PASS ✓ (No secondary movement)' : 'FAIL ✗'}`);

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

main();
