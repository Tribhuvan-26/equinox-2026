import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetHtmlUrl = 'file:///c:/Users/nithy/OneDrive/Desktop/testing/equinox-2026/ipl-auction-animation/index.html';
const targetSvgUrl = 'file:///c:/Users/nithy/OneDrive/Desktop/testing/equinox-2026/ipl-auction-animation/scene.svg';
const artifactsDir = 'C:\\Users\\nithy\\.gemini\\antigravity-ide\\brain\\65dea150-622d-4148-ba51-2b3e21d5e452';

if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

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

    // Initial inspection
    await sleep(300);

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
            animationDelay: cs.animationDelay,
            transform: cs.transform,
            opacity: cs.opacity,
            clipPath: cs.clipPath
          };
        };

        const teams = Array.from(document.querySelectorAll('.team-logo-group')).map((el, i) => {
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

        const prices = Array.from(document.querySelectorAll('.team-price-group')).map((el, i) => {
          const cs = window.getComputedStyle(el);
          return {
            index: i + 1,
            animationDelay: cs.animationDelay,
            opacity: cs.opacity
          };
        });

        return {
          title: getStyle('#layer-title'),
          swoosh: getStyle('#layer-swoosh'),
          budgetPill: getStyle('#layer-budget-pill'),
          wavesLeft: getStyle('#layer-waves-left'),
          wavesRight: getStyle('#layer-waves-right'),
          gavelArm: getStyle('#layer-auctioneer-arm-gavel'),
          podium: getStyle('#layer-podium'),
          paddleArm: getStyle('#layer-bidder-arm-paddle'),
          teamsCount: teams.length,
          pricesCount: prices.length,
          teamsSummary: teams,
          pricesSummary: prices
        };
      })()
    `;

    const evalResult = await sendCommand(ws, 'Runtime.evaluate', {
      expression: evalScript,
      returnByValue: true
    });

    const data = evalResult.result.value;
    console.log('\n--- LIVE COMPUTED STYLE INSPECTION IN CHROME ---');
    console.log('1. #layer-title:', data.title.animationName, 'duration:', data.title.animationDuration);
    console.log('2. #layer-swoosh:', data.swoosh.animationName, 'clipPath:', data.swoosh.clipPath);
    console.log('3. #layer-budget-pill:', data.budgetPill.animationName, 'delay:', data.budgetPill.animationDelay);
    console.log('4. Team Logos count:', data.teamsCount, 'stagger check:', data.teamsSummary.map(t => t.animationDelay).join(', '));
    console.log('5. Price Tags count:', data.pricesCount, 'stagger check:', data.pricesSummary.map(p => p.animationDelay).join(', '));
    console.log('6. #layer-waves-left:', data.wavesLeft.animationName, '#layer-waves-right:', data.wavesRight.animationName);
    console.log('7. #layer-auctioneer-arm-gavel:', data.gavelArm.animationName, 'delay:', data.gavelArm.animationDelay);
    console.log('8. #layer-podium:', data.podium.animationName);
    console.log('9. #layer-bidder-arm-paddle:', data.paddleArm.animationName, 'delay:', data.paddleArm.animationDelay);

    // Capture screenshots across the timeline
    // t=0.4s: Title pop
    console.log('\nCapturing timeline verification screenshots...');
    const ss1 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, `${label}_t0_4s.png`), Buffer.from(ss1.data, 'base64'));
    console.log(`Saved screenshot: ${label}_t0_4s.png`);

    // Wait to t=1.1s (swoosh & budget pill)
    await sleep(700);
    const ss2 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, `${label}_t1_1s.png`), Buffer.from(ss2.data, 'base64'));
    console.log(`Saved screenshot: ${label}_t1_1s.png`);

    // Wait to t=2.1s (team logo circles & price tags)
    await sleep(1000);
    const ss3 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, `${label}_t2_1s.png`), Buffer.from(ss3.data, 'base64'));
    console.log(`Saved screenshot: ${label}_t2_1s.png`);

    // Wait to t=3.0s (wave ripple)
    await sleep(900);
    const ss4 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, `${label}_t3_0s.png`), Buffer.from(ss4.data, 'base64'));
    console.log(`Saved screenshot: ${label}_t3_0s.png`);

    // Wait to t=3.75s (gavel strike & paddle wave)
    await sleep(750);
    const ss5 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, `${label}_t3_75s.png`), Buffer.from(ss5.data, 'base64'));
    console.log(`Saved screenshot: ${label}_t3_75s.png`);

    // Wait to t=4.4s (clean freeze frame ending)
    await sleep(650);
    const ss6 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, `${label}_t4_4s_freeze.png`), Buffer.from(ss6.data, 'base64'));
    console.log(`Saved screenshot: ${label}_t4_4s_freeze.png`);

    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

async function main() {
  await testPage(targetHtmlUrl, 'ipl_auction_player');
  console.log('\nAll timeline screenshots and computed style inspections complete!');
}

main().catch(err => {
  console.error('CDP test failed:', err);
  process.exit(1);
});
