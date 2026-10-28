// Run against a local HTTP server. Requires Playwright and an installed Chrome.
// PLAYWRIGHT_MODULE_PATH can point to a bundled Playwright installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:8000';
const widths = [320, 375, 480, 650, 760, 768, 900, 901, 1024, 1440, 1920, 2560, 4704];
const root = path.resolve(__dirname, '..');
const routes = [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/asym\.no([^<]*)<\/loc>/g)].map(match => match[1]);

async function checkLayout(page, label) {
  const result = await page.evaluate(() => {
    const visible = e => e.getClientRects().length && !e.closest('[inert]');
    return {
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll('h1,h2,h3,p,dd,figcaption,.button')]
        .filter(e => visible(e) && e.scrollWidth > e.clientWidth + 2)
        .map(e => e.textContent.trim().slice(0, 60)),
    };
  });
  assert(result.scroll <= result.width + 1, `${label}: page overflows ${JSON.stringify(result)}`);
  assert.deepEqual(result.overflow, [], `${label}: text clips`);
}

(async () => {
  const browser = await chromium.launch({ channel: process.env.RESPONSIVE_BROWSER || 'chrome', headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.addInitScript(() => localStorage.setItem('asym-media-consent-v1', JSON.stringify({allowed:true,expires:Date.now()+86400000})));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let checks = 0;
    for (const route of routes) {
      for (const width of route === '/' ? widths : [320, 768, 1440, 2560]) {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(base + route);
        assert.equal(response.status(), 200, route);
        await checkLayout(page, `${route} @ ${width}`);
        checks++;
      }
    }
    console.log(`${checks} page/viewport layouts passed.`);

    for (const viewport of [{width:320,height:568}, {width:844,height:390}, {width:1440,height:900}]) {
      await page.setViewportSize(viewport);
      await page.goto(base + '/');
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await checkLayout(page, `200% text @ ${viewport.width}`);
    }
    console.log('Enlarged text and phone landscape reflow passed.');

    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto(base + '/');
    await page.locator('.nav-toggle').click();
    await page.setViewportSize({ width: 850, height: 600 });
    assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'false');
    await page.locator('.nav-toggle').click();
    await page.setViewportSize({ width: 1024, height: 600 });
    await page.waitForFunction(() => document.querySelector('.nav-toggle').getAttribute('aria-expanded') === 'false');

    for (const viewport of [{width:320,height:568}, {width:844,height:390}, {width:1440,height:900}]) {
      await page.setViewportSize(viewport);
      await page.goto(base + '/');
      const carousel = page.locator('.upcoming-carousel');
      await carousel.scrollIntoViewIfNeeded();
      const first = await page.locator('.upcoming-card:not([inert]) h3').first().textContent();
      await carousel.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(first => document.querySelector('.upcoming-card:not([inert]) h3').textContent !== first, first);
      await page.locator('.upcoming-card:not([inert]) [data-event]').first().click();
      const dialog = page.locator('#event-dialog');
      assert(await dialog.isVisible());
      assert(await dialog.evaluate(e => e.scrollWidth <= e.clientWidth + 1));
      await page.locator('.event-dialog-ticket').scrollIntoViewIfNeeded();
      assert(await page.locator('.event-dialog-ticket').isVisible());
      await page.locator('.event-dialog-close').click();
      assert(!(await dialog.isVisible()));
      await page.locator('.gallery-feature').click();
      assert(await page.locator('.image-viewer').isVisible());
      await page.keyboard.press('ArrowRight');
      await page.locator('.viewer-close').click();
      assert(!(await page.locator('.image-viewer').isVisible()));
    }
    assert.deepEqual(errors, [], 'Browser JavaScript errors');
    console.log('Menu resizing/Escape, carousel navigation, ticket dialog and gallery passed.');

    const touch = await browser.newPage({ hasTouch: true, isMobile: true, viewport: {width:375,height:667}, reducedMotion:'reduce' });
    await touch.addInitScript(() => localStorage.setItem('asym-media-consent-v1', JSON.stringify({allowed:true,expires:Date.now()+86400000})));
    await touch.goto(base + '/');
    await touch.locator('.nav-toggle').tap();
    assert.equal(await touch.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
    await touch.locator('.nav-toggle').tap();
    await touch.locator('.upcoming-carousel').scrollIntoViewIfNeeded();
    const beforeSwipe = await touch.locator('.upcoming-card:not([inert]) h3').first().textContent();
    const bounds = await touch.locator('.upcoming-carousel').boundingBox();
    const session = await touch.context().newCDPSession(touch);
    const point = x => ({x, y:bounds.y + 80});
    await session.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[point(bounds.x + bounds.width * .8)]});
    await session.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[point(bounds.x + bounds.width * .5)]});
    await session.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[point(bounds.x + bounds.width * .2)]});
    await session.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
    await touch.waitForFunction(title => document.querySelector('.upcoming-card:not([inert]) h3').textContent !== title, beforeSwipe);
    await checkLayout(touch, 'Touch mobile after swipe');
    console.log('Mobile touch menu and horizontal concert swipe passed.');

    const fallback = await browser.newPage({ javaScriptEnabled: false, viewport: {width:320,height:568} });
    await fallback.goto(base + '/');
    assert(await fallback.locator('.nav-menu').isVisible());
    assert.equal(await fallback.locator('.upcoming-card').count(), 5);
    assert.equal(await fallback.locator('.upcoming-carousel').evaluate(e => getComputedStyle(e).overflowX), 'visible');
    await checkLayout(fallback, 'Without JavaScript');
    console.log('Navigation and all concert cards remain available without JavaScript.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
