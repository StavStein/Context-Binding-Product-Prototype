/**
 * Captures step 6: Full canvas view (hero + weather + Articles repeater) after adding Articles from Add panel.
 * Viewport: 1366x768
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML_PATH = `file://${path.join(__dirname, 'binding-platform-demo.html')}`;
const OUTPUT = path.join(__dirname, 'screenshots', 'step6-full-canvas-view.png');

async function capture() {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  try {
    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // 1. Click "+" to open Add Elements panel
    await page.click('#add-el-toggle');
    await page.waitForSelector('.add-el-panel.open', { timeout: 2000 });
    await page.waitForTimeout(300);

    // 2. Click Articles under REPEATERS
    await page.locator('.add-el-panel.open .add-el-item').nth(1).click();
    await page.waitForTimeout(1000);

    // 3. Wait for repeater to be added (article cards appear)
    await page.waitForSelector('[id^="repeater-add-"]', { timeout: 3000 });
    await page.waitForTimeout(500);

    // 4. Scroll canvas UP and scale content to fit hero, weather, and repeater in one view
    const canvas = page.locator('.canvas');
    await canvas.evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.waitForTimeout(200);

    // Scale the canvas content so all sections fit in viewport
    await page.evaluate(() => {
      const inner = document.querySelector('#demo262-page') || document.querySelector('.canvas-inner:not(.hidden-page)');
      if (inner) {
        inner.style.transform = 'scale(0.45)';
        inner.style.transformOrigin = 'top center';
      }
    });
    await page.waitForTimeout(400);

    // 5. Take screenshot
    await page.screenshot({ path: OUTPUT, fullPage: false });
    console.log('Saved:', OUTPUT);
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
