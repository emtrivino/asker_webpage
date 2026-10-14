const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:8000';

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    for (const width of [375,1440]) {
      const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      let requests = 0, mode = 'failure', submitted;
      await page.route('https://formsubmit.co/ajax/**', async route => {
        requests++;
        submitted = route.request().postDataJSON();
        await route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},
          body:JSON.stringify(mode === 'success' ? {success:'true',message:'The form was submitted successfully.'} : {success:'false',message:'This form needs Activation.'})});
      });
      await page.goto(base + '/');
      const form = page.locator('#member-form');
      assert.equal(await form.evaluate(e=>e.checkValidity()),false);
      await page.locator('#member-name').fill('Test Musiker');
      await page.locator('#member-email').fill('musiker@example.com');
      await page.locator('#member-message').fill('Fiolin og kammermusikk.');
      await form.locator('button[type="submit"]').click();
      await page.waitForFunction(()=>!document.querySelector('#member-form').hasAttribute('aria-busy'));
      assert((await page.locator('.member-form-status').textContent()).includes('Kunne ikke sende'));
      assert.equal(await page.locator('#member-message').inputValue(),'Fiolin og kammermusikk.');
      assert(await page.locator('.member-email-fallback').isVisible());
      assert((await page.locator('.member-email-fallback').getAttribute('href')).startsWith('mailto:trivinoeduards@gmail.com?'));
      mode = 'success';
      await form.locator('button[type="submit"]').click();
      await page.waitForFunction(()=>!document.querySelector('#member-form').hasAttribute('aria-busy'));
      assert((await page.locator('.member-form-status').textContent()).includes('Takk!'));
      assert.equal(submitted['E-post'],'musiker@example.com');
      assert.equal(submitted._replyto,'musiker@example.com');
      assert.equal(submitted._subject,'Ny melding om medlemskap fra asym.no');
      assert.equal(submitted.Melding,'Fiolin og kammermusikk.');
      assert.equal(await page.locator('#member-name').inputValue(),'');
      assert.equal(requests,2);
      assert.equal(page.url(),base+'/');
      assert(!(await page.locator('.member-form-alternative').isVisible()));
      await page.close();
    }
    console.log('Membership validation, failed activation, retained fields, email fallback and successful submission passed on mobile and desktop. No email sent by this test.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
