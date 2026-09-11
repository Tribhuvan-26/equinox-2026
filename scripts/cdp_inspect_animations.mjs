import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetHtmlUrl = 'file:///c:/Users/nithy/OneDrive/Desktop/testing/equinox-2026/ipl-auction-animation/index.html';
const targetSvgUrl = 'file:///c:/Users/nithy/OneDrive/Desktop/testing/equinox-2026/ipl-auction-animation/scene.svg';
const artifactsDir = 'C:\\Users\\nithy\\.gemini\\antigravity-ide\\brain\\53ac7f3f-50e7-47a0-94e9-a60cd723b0b2';

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
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
        if (msg.error) {
          reject(msg.error);
        } else {
          resolve(msg.result);
        }
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function testPage(url, label) {
  console.log(`\n======================================================`);
  console.log(`TESTING WITH REAL CHROME: ${label} (${url})`);
  console.log(`======================================================`);

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,800',
    '--hide-scrollbars',
    url
  ]);

  try {
    let connected = false;
    let targets = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        targets = await fetchJson('http://127.0.0.1:9222/json/list');
        if (targets && targets.length > 0) {
          connected = true;
          break;
        }
      } catch (e) {
        // waiting for chrome to listen
      }
    }

    if (!connected || !targets) {
      throw new Error('Could not connect to Chrome DevTools port 9222');
    }

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    console.log('Target found:', pageTarget.title, pageTarget.url);

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });
    console.log('Connected to Chrome DevTools Protocol!');

    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');
    await sendCommand(ws, 'Console.enable');

    const consoleLogs = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded' || msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push(msg.params);
      }
    });

    // Wait for initial render
    await sleep(600);

    // Evaluate animations and styles in the live DOM
    const evalScript = `
      (() => {
        const getStyle = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return { found: false };
          const cs = window.getComputedStyle(el);
          return {
            found: true,
            tagName: el.tagName,
            animationName: cs.animationName,
            animationDuration: cs.animationDuration,
            animationTimingFunction: cs.animationTimingFunction,
            animationIterationCount: cs.animationIterationCount,
            animationDelay: cs.animationDelay,
            transform: cs.transform,
            opacity: cs.opacity,
            filter: cs.filter
          };
        };

        const slots = Array.from(document.querySelectorAll('.team-slot')).map((el, i) => {
          const cs = window.getComputedStyle(el);
          return {
            index: i + 1,
            dataTeam: el.getAttribute('data-team'),
            animationName: cs.animationName,
            animationDelay: cs.animationDelay,
            transform: cs.transform,
            opacity: cs.opacity
          };
        });

        const imageEl = document.querySelector('#stage-people image');
        const imgLoaded = imageEl ? (imageEl.getAttribute('href') || imageEl.getAttribute('xlink:href') || '').substring(0, 30) : null;

        return {
          bannerLeft: getStyle('#banner-left'),
          bannerRight: getStyle('#banner-right'),
          headline: getStyle('#headline'),
          budgetPill: getStyle('#budget-pill'),
          stagePeople: getStyle('#stage-people'),
          stagePeopleImage: getStyle('#stage-people image'),
          audience: getStyle('#audience'),
          slotsCount: slots.length,
          slotsSummary: slots,
          imageSnippet: imgLoaded,
          url: window.location.href,
          title: document.title
        };
      })()
    `;

    const evalResult = await sendCommand(ws, 'Runtime.evaluate', {
      expression: evalScript,
      returnByValue: true
    });

    console.log('\n--- LIVE COMPUTED STYLE INSPECTION IN CHROME ---');
    const data = evalResult.result.value;
    console.log('1. #banner-left sway animation:');
    console.log('   - Name:', data.bannerLeft.animationName);
    console.log('   - Duration:', data.bannerLeft.animationDuration);
    console.log('   - Current transform:', data.bannerLeft.transform);

    console.log('2. #banner-right sway animation:');
    console.log('   - Name:', data.bannerRight.animationName);
    console.log('   - Duration:', data.bannerRight.animationDuration);
    console.log('   - Current transform:', data.bannerRight.transform);

    console.log('3. .team-slot popIn stagger animation:');
    console.log('   - Slots found:', data.slotsCount);
    data.slotsSummary.forEach(s => {
      console.log(`     Slot ${s.index} (data-team="${s.dataTeam}"): name=${s.animationName}, delay=${s.animationDelay}, opacity=${s.opacity}`);
    });

    console.log('4. #stage-people bob animation:');
    console.log('   - Name:', data.stagePeople.animationName);
    console.log('   - Duration:', data.stagePeople.animationDuration);
    console.log('   - Current transform:', data.stagePeople.transform);

    console.log('5. #stage-people image subtle drop-shadow pulse:');
    console.log('   - Name:', data.stagePeopleImage.animationName);
    console.log('   - Duration:', data.stagePeopleImage.animationDuration);
    console.log('   - Filter:', data.stagePeopleImage.filter);

    console.log('6. #headline pulse animation:');
    console.log('   - Name:', data.headline.animationName);
    console.log('   - Duration:', data.headline.animationDuration);
    console.log('   - Current opacity:', data.headline.opacity);

    console.log('7. Base64 illustration image:');
    console.log('   - Loaded in DOM:', !!data.imageSnippet);
    console.log('   - Snippet:', data.imageSnippet);

    console.log('8. Console errors count:', consoleLogs.length);
    if (consoleLogs.length > 0) {
      console.log('Console logs:', JSON.stringify(consoleLogs, null, 2));
    }

    // Capture screenshot at t=1s
    const screenshot1 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    const img1Path = path.join(artifactsDir, `${label}_t1.png`);
    fs.writeFileSync(img1Path, Buffer.from(screenshot1.data, 'base64'));
    console.log(`Captured live Chrome screenshot: ${img1Path}`);

    // Wait 1.5s and take second screenshot to verify frame changes
    await sleep(1500);
    const screenshot2 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    const img2Path = path.join(artifactsDir, `${label}_t2.png`);
    fs.writeFileSync(img2Path, Buffer.from(screenshot2.data, 'base64'));
    console.log(`Captured live Chrome screenshot (motion check): ${img2Path}`);

    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

async function main() {
  await testPage(targetHtmlUrl, 'index_html');
  await testPage(targetSvgUrl, 'scene_svg');
}

main().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
