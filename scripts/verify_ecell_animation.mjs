import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const currentArtifactDir = 'C:\\Users\\nithy\\.gemini\\antigravity-ide\\brain\\2eeb35cc-3f42-4cd3-b583-9b14e93f0d49';

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
    '--remote-debugging-port=9226',
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
        targets = await fetchJson('http://127.0.0.1:9226/json/list');
        if (targets && targets.length > 0) break;
      } catch (e) {}
    }

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');

    // Wait for element to mount
    console.log('Waiting for animation overlay to mount...');
    for (let i = 0; i < 40; i++) {
      const chk = await sendCommand(ws, 'Runtime.evaluate', {
        expression: '!!document.getElementById("sub-word-connect")'
      });
      if (chk && chk.result && chk.result.value) {
        console.log(`Mounted after ${i * 250}ms`);
        break;
      }
      await sleep(250);
    }

    // Measure geometric bounding boxes at settled time
    console.log('Seeking to settled position (~4.6s)...');
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        // Find GSAP timeline if accessible or let it play
        const root = document.querySelector('[role="dialog"]');
        if (window.gsap) {
          window.gsap.globalTimeline.time(4.6);
          window.gsap.globalTimeline.pause();
        }
      })()`
    });

    // Wait for animation to reach settled state naturally (~2.0s)
    await sleep(2500);

    const evalBoxes = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        function getBox(id) {
          const el = document.getElementById(id);
          if (!el) return null;
          const b = el.getBBox();
          return { id, x: Math.round(b.x * 10)/10, y: Math.round(b.y * 10)/10, width: Math.round(b.width * 10)/10, height: Math.round(b.height * 10)/10, right: Math.round((b.x + b.width) * 10)/10, bottom: Math.round((b.y + b.height) * 10)/10 };
        }
        return JSON.stringify({
          arc: getBox('upper-arc-path'),
          arcDotTop: getBox('arc-dot-top'),
          peopleImg: getBox('ecell-people-image'),
          ecell: getBox('title-ecell'),
          meet: getBox('title-meet'),
          connect: getBox('sub-word-connect'),
          collaborate: getBox('sub-word-collaborate'),
          create: getBox('sub-word-create'),
          subLineLeft: getBox('sub-line-left'),
          subLineRight: getBox('sub-line-right'),
          subDot1: getBox('sub-dot-1'),
          subDot2: getBox('sub-dot-2')
        });
      })()`,
      returnByValue: true
    });

    const boxes = JSON.parse(evalBoxes.result.value);
    console.log('\n======================================================');
    console.log('EXACT RENDERED BOUNDING BOXES:');
    console.log('======================================================');
    console.dir(boxes, { depth: null });

    // Verify clearances
    console.log('\n--- VERIFICATION CHECKS ---');
    const arcApexY = boxes.arc.y; // 40
    const peopleTopY = boxes.peopleImg.y; // 96
    const verticalClearance = peopleTopY - arcApexY;
    console.log(`1. People vs Arc Vertical Clearance: ${verticalClearance}px (required: comfortably inside, positive > 30px) -> ${verticalClearance > 30 ? 'PASS ✓' : 'FAIL ✗'}`);

    const leftLineRight = boxes.subLineLeft.right;
    const connectLeft = boxes.connect.x;
    const leftGap = connectLeft - leftLineRight;
    console.log(`2. Left Line to CONNECT gap: ${leftGap}px (required: positive gap, no touch) -> ${leftGap > 5 ? 'PASS ✓' : 'FAIL ✗'}`);

    const createRight = boxes.create.right;
    const rightLineLeft = boxes.subLineRight.x;
    const rightGap = rightLineLeft - createRight;
    console.log(`3. CREATE to Right Line gap: ${rightGap}px (required: positive gap, no touch) -> ${rightGap > 5 ? 'PASS ✓' : 'FAIL ✗'}`);

    const dot1X = boxes.subDot1.x + boxes.subDot1.width / 2;
    const connectRight = boxes.connect.right;
    const colLeft = boxes.collaborate.x;
    console.log(`4. Spacing around Bullet 1: CONNECT to Dot1 = ${Math.round((dot1X - connectRight)*10)/10}px, Dot1 to COLLABORATE = ${Math.round((colLeft - dot1X)*10)/10}px`);

    const dot2X = boxes.subDot2.x + boxes.subDot2.width / 2;
    const colRight = boxes.collaborate.right;
    const createLeft = boxes.create.x;
    console.log(`5. Spacing around Bullet 2: COLLABORATE to Dot2 = ${Math.round((dot2X - colRight)*10)/10}px, Dot2 to CREATE = ${Math.round((createLeft - dot2X)*10)/10}px`);

    // Capture settled screenshot
    const ss = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(currentArtifactDir, 'ecell_settled_verified.png');
    fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
    console.log(`\nSaved verified screenshot to ${outPath}`);

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

main();
