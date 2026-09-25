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

async function evalJson(ws, js) {
  const res = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      try {
        return ${js};
      } catch (e) {
        return { __err: e.message };
      }
    })())`,
    returnByValue: true
  });
  return res.result && res.result.value ? JSON.parse(res.result.value) : null;
}

async function run() {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1400,900',
    'http://localhost:3000'
  ]);

  try {
    let targets = null;
    for (let i = 0; i < 25; i++) {
      await sleep(250);
      try {
        targets = await fetchJson('http://127.0.0.1:9232/json/list');
        if (targets && targets.length > 0) break;
      } catch (e) {}
    }

    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(res => ws.addEventListener('open', res));

    await sendCommand(ws, 'Runtime.enable');
    await sendCommand(ws, 'Page.enable');

    console.log('Waiting for localhost navigation...');
    for (let i = 0; i < 20; i++) {
      const urlRes = await sendCommand(ws, 'Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
      if (urlRes?.result?.value?.includes('localhost:3000')) {
        console.log('Loaded:', urlRes.result.value);
        break;
      }
      await sleep(300);
    }

    console.log('--- TEST 1: Initial load and intro completion ---');
    for (let i = 0; i < 30; i++) {
      const val = await evalJson(ws, `({
        scrollY: window.scrollY,
        introDone: sessionStorage.getItem('equinox_intro_done'),
        bodyOverflow: document.body.style.overflow
      })`);
      if (val && !val.__err && val.introDone === 'true' && val.bodyOverflow !== 'hidden') {
        console.log('Intro completed naturally:', val);
        break;
      }
      if (i > 15) {
        await evalJson(ws, `(() => {
          sessionStorage.setItem('equinox_intro_done', 'true');
          window.dispatchEvent(new Event('equinox:intro-done'));
          return true;
        })()`);
      }
      await sleep(500);
    }

    console.log('--- TEST 2: Scroll to Spotlight (Target ~2200px) and click ---');
    await evalJson(ws, `(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(2200, { immediate: true });
      }
      window.scrollTo({ top: 2200, behavior: 'instant' });
      return window.scrollY;
    })()`);
    await sleep(500);

    const pos1 = await evalJson(ws, `window.scrollY`);
    console.log('Homepage scroll before navigating:', pos1);

    // Click Spotlight link
    const click1 = await evalJson(ws, `(() => {
      const a = document.querySelector('div a[href="/events/spotlight"]') || document.querySelector('a[href="/events/spotlight"]');
      if (a) {
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return { clicked: true, href: a.getAttribute('href') };
      }
      return { clicked: false };
    })()`);
    console.log('Click 1 result:', click1);

    await sleep(2500);

    const onEventPage1 = await evalJson(ws, `({ path: window.location.pathname, scrollY: window.scrollY })`);
    console.log('Current page after click 1:', onEventPage1);

    console.log('--- TEST 3: Click Home / BACK TO HOMEPAGE from Spotlight ---');
    const returnClick1 = await evalJson(ws, `(() => {
      const links = Array.from(document.querySelectorAll('main a, header a'));
      const homeLink = links.find(a => 
        (a.getAttribute('href') === '/' && a.closest('main')) ||
        a.textContent.includes('Back to Homepage') ||
        a.textContent.trim() === 'Home'
      ) || links.find(a => a.getAttribute('href') === '/');
      if (homeLink) {
        homeLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return { clicked: true, text: homeLink.textContent.trim(), href: homeLink.getAttribute('href') };
      }
      return { clicked: false };
    })()`);
    console.log('Return click result:', returnClick1);

    // Wait for homepage to mount and restore scroll
    await sleep(2000);

    const restoredState1 = await evalJson(ws, `({ path: window.location.pathname, scrollY: window.scrollY, saved: sessionStorage.getItem('equinox_home_scroll') })`);
    console.log('Restored state on Homepage:', restoredState1);

    const isMatch1 = Math.abs(restoredState1.scrollY - pos1) < 50;
    console.log('TEST 1 RESULT (Spotlight restoration):', isMatch1 ? 'PASSED ✅' : 'FAILED ❌', `(expected ${pos1}, got ${restoredState1.scrollY})`);

    console.log('--- TEST 4: Scroll deeper to IPL Auction (Target ~6500px) and click ---');
    await evalJson(ws, `(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(6500, { immediate: true });
      }
      window.scrollTo({ top: 6500, behavior: 'instant' });
      return window.scrollY;
    })()`);
    await sleep(500);

    const pos2 = await evalJson(ws, `window.scrollY`);
    console.log('Homepage scroll before navigating 2:', pos2);

    const click2 = await evalJson(ws, `(() => {
      const a = document.querySelector('div a[href="/events/ipl-auction"]') || document.querySelector('a[href="/events/ipl-auction"]');
      if (a) {
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return { clicked: true, href: a.getAttribute('href') };
      }
      return { clicked: false };
    })()`);
    console.log('Click 2 result:', click2);

    await sleep(2500);

    const onEventPage2 = await evalJson(ws, `({ path: window.location.pathname, scrollY: window.scrollY })`);
    console.log('Current page after click 2:', onEventPage2);

    console.log('--- TEST 5: Return to Homepage from IPL Auction ---');
    const returnClick2 = await evalJson(ws, `(() => {
      const links = Array.from(document.querySelectorAll('main a, header a'));
      const homeLink = links.find(a => 
        (a.getAttribute('href') === '/' && a.closest('main')) ||
        a.textContent.includes('Back to Homepage') ||
        a.textContent.trim() === 'Home'
      ) || links.find(a => a.getAttribute('href') === '/');
      if (homeLink) {
        homeLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return { clicked: true, text: homeLink.textContent.trim(), href: homeLink.getAttribute('href') };
      }
      return { clicked: false };
    })()`);
    console.log('Return click 2 result:', returnClick2);

    await sleep(2000);

    const restoredState2 = await evalJson(ws, `({ path: window.location.pathname, scrollY: window.scrollY, saved: sessionStorage.getItem('equinox_home_scroll') })`);
    console.log('Restored state 2 on Homepage:', restoredState2);

    const isMatch2 = Math.abs(restoredState2.scrollY - pos2) < 50;
    console.log('TEST 2 RESULT (IPL Auction restoration):', isMatch2 ? 'PASSED ✅' : 'FAILED ❌', `(expected ${pos2}, got ${restoredState2.scrollY})`);

    console.log('--- TEST 6: Browser Back button test ---');
    await evalJson(ws, `(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(4200, { immediate: true });
      }
      window.scrollTo({ top: 4200, behavior: 'instant' });
      return window.scrollY;
    })()`);
    await sleep(500);

    const pos3 = await evalJson(ws, `window.scrollY`);
    console.log('Homepage scroll before navigating 3:', pos3);

    await evalJson(ws, `(() => {
      const a = document.querySelector('div a[href="/events/crossroads"]') || document.querySelector('a[href="/events/crossroads"]');
      if (a) {
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
      return true;
    })()`);
    await sleep(2500);

    console.log('Navigating Back via History...');
    await sendCommand(ws, 'Runtime.evaluate', { expression: `window.history.back()` });
    await sleep(2000);

    const restoredState3 = await evalJson(ws, `({ path: window.location.pathname, scrollY: window.scrollY })`);
    console.log('Browser Back restored state:', restoredState3);
    const isMatch3 = Math.abs(restoredState3.scrollY - pos3) < 50;
    console.log('TEST 3 RESULT (Browser Back restoration):', isMatch3 ? 'PASSED ✅' : 'FAILED ❌', `(expected ${pos3}, got ${restoredState3.scrollY})`);

    console.log('--- TEST 7: Intentional Fresh visit via navbar Home ---');
    const navClick = await evalJson(ws, `(() => {
      const links = Array.from(document.querySelectorAll('header a'));
      const homeLink = links.find(a => a.textContent.includes('Home') || a.getAttribute('href') === '/#top');
      if (homeLink) {
        homeLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return { clicked: true };
      }
      return { clicked: false };
    })()`);
    console.log('Navbar Home click:', navClick);
    await sleep(1500);

    const freshState = await evalJson(ws, `({ scrollY: window.scrollY, saved: sessionStorage.getItem('equinox_home_scroll') })`);
    console.log('Fresh visit state:', freshState);
    const isMatch4 = freshState.scrollY < 50 && freshState.saved === null;
    console.log('TEST 4 RESULT (Navbar fresh visit to top):', isMatch4 ? 'PASSED ✅' : 'FAILED ❌');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
