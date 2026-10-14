// Requires Playwright and Chrome; use the same environment variables as check-responsive.cjs.
// LIVE_VIDEO_PLAYBACK=1 additionally streams each recording and verifies playback progress.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:8000';
const supplied = ['sMVAiCz0D3U', '3dWpDRrjYIo', 'H15EEgzzeFc', '_TFt8pRIo2k', 'rPnUEgZmB5s'];

(async () => {
  const browser = await chromium.launch({channel:process.env.RESPONSIVE_BROWSER || 'chrome',headless:true});
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (!process.env.LIVE_VIDEO_PLAYBACK) await page.route('https://www.youtube-nocookie.com/embed/**', route => route.fulfill({contentType:'text/html',body:'<title>Embedded player test</title>'}));
    await page.goto(base + '/');
    const ids = await page.locator('.video-choice').evaluateAll(choices => choices.map(c => c.dataset.videoId));
    assert.equal(ids.length, new Set(ids).size, 'No duplicate videos');
    supplied.forEach(id => assert(ids.includes(id), `Missing supplied video ${id}`));
    assert.equal(ids.at(-1), 'sMVAiCz0D3U', 'New recording appended last');

    for (const width of [375, 1440]) {
      await page.setViewportSize({width,height:900});
      for (const [index, id] of ids.entries()) {
        await page.locator(`[data-video-id="${id}"]`).click();
        assert.equal(await page.locator('.video-stage iframe').count(), 0, 'Switching selection stops previous player');
        assert.equal(await page.locator('.video-launch').getAttribute('href'), 'https://www.youtube.com/watch?v=' + id);
        assert.equal(await page.locator('.video-now a').count(), 0, 'Caption has no extra navigation links');
        assert.equal(await page.locator('.video-counter').textContent(), `${String(index + 1).padStart(2,'0')} / ${String(ids.length).padStart(2,'0')}`);
        assert.equal(await page.locator('.video-choice[aria-current="true"]').count(), 1);
        await page.locator('.video-launch').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const image = document.querySelector('.video-launch img');
          return image && image.complete && image.naturalWidth > 0;
        });
        assert(await page.locator('.video-launch img').evaluate(img => img.naturalWidth > 0), 'Thumbnail loads');
        await page.locator('.video-launch').click();
        const iframe = page.locator('.video-stage iframe');
        assert((await iframe.getAttribute('src')).startsWith('https://www.youtube-nocookie.com/embed/' + id + '?'));
        assert.equal(await iframe.getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin');
        if (process.env.LIVE_VIDEO_PLAYBACK && (width === 1440 || id === 'sMVAiCz0D3U')) {
          await page.waitForFunction(() => document.querySelector('.video-stage iframe')?.contentWindow !== null);
          const frame = await iframe.elementHandle().then(e => e.contentFrame());
          await frame.waitForFunction(() => {
            const video = document.querySelector('video');
            return video && !video.paused && video.readyState >= 2 && video.currentTime > .5 && !video.error;
          }, null, {timeout:30000});
          console.log(`Playback confirmed: ${id} @ ${width}px`);
        }
      }
      await page.locator('.video-choice').first().focus();
      await page.keyboard.press('End');
      assert.equal(await page.locator('.video-choice[aria-current="true"]').getAttribute('data-video-id'), ids.at(-1));
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowDown');
      assert.equal(await page.locator('.video-choice[aria-current="true"]').getAttribute('data-video-id'), ids[1]);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
    await page.goto(base + '/repertoar/');
    for (const id of ids) assert.equal(await page.locator(`.recording-grid a[href="https://www.youtube.com/watch?v=${id}"]`).count(), 1);
    assert.deepEqual(errors, []);
    console.log(`${ids.length} unique recordings passed selection, thumbnails, embed setup, keyboard navigation and repertoire checks.`);
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
