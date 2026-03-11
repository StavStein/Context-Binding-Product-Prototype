const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:8777/binding-platform-demo.html';
const OUT_DIR = path.join(__dirname, 'demo-screens', 'repeater-flows');

const CURSOR_SVG = `<svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_503_20154)">
<g filter="url(#filter0_d_503_20154)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.9225 20.158V18.6906H28.4613V23.0924H26.9763V17.2235H24.0061V21.6252H22.5453V15.7798H18.8325V21.6252H17.3713V8.46729H14.4013V28.2044H12.9165V23.0924H11.4553V21.6252H8.48511V25.2698H9.97011V26.7366H11.4553V29.6479H12.9165V32.5824H14.4013V35.4929H15.8863V38.4275H28.4613V35.4929H29.9225V31.115H31.4075V20.158H29.9225Z" fill="#FEFEFE"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.4011 8.46741H17.3711V7H14.4011V8.46741Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.9163 23.0927V28.2045H14.4011V8.46753H12.9163V21.6252H11.4551V23.0927H12.9163Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.8325 21.6252V15.78H22.5451V14.3126H18.8325V8.46729H17.3713V21.6252H18.8325Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7 20.1582V25.27H8.4852V21.6254H11.4552V20.1582H7Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.48511 26.7368H9.97011V25.27H8.48511V26.7368Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.96997 29.6481H11.455V26.7368H9.96997V29.6481Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.4551 32.5826H12.9163V29.6479H11.4551V32.5826Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.9165 35.493H14.4013V32.5825H12.9165V35.493Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.9224 20.1581H31.4074V18.6907H29.9224V20.1581Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.4613 23.0927V18.6908H29.9225V17.2236H26.9763V23.0927H28.4613Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.4075 31.1152H32.8923V20.1582H31.4075V31.1152Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.0062 21.6252V17.2235H26.9764V15.78H22.5452V21.6252H24.0062Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.9224 35.4931H31.4074V31.115H29.9224V35.4931Z" fill="#231F20"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.4611 35.4932V38.4278H15.8861V35.4932H14.4011V39.8952H29.9223V35.4932H28.4611Z" fill="#231F20"/>
</g></g>
<defs>
<filter id="filter0_d_503_20154" x="3" y="5" width="33.8923" height="40.8953" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/><feGaussianBlur stdDeviation="2"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_503_20154"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_503_20154" result="shape"/>
</filter>
<clipPath id="clip0_503_20154"><rect width="40" height="40" fill="white"/></clipPath>
</defs></svg>`;

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
async function snap(page, filename) {
  await delay(400);
  await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
  console.log(`  ✓ ${filename}`);
}
async function addCursorAt(page, x, y) {
  await page.evaluate((cx, cy, svgStr) => {
    let existing = document.getElementById('fake-cursor');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.id = 'fake-cursor';
    div.style.cssText = `position:fixed;left:${cx - 16}px;top:${cy - 6}px;z-index:999999;pointer-events:none;`;
    div.innerHTML = svgStr;
    document.body.appendChild(div);
  }, x, y, CURSOR_SVG);
  await delay(100);
}
async function addCursorOnElement(page, selector, offX, offY) {
  const pos = await page.evaluate((sel, ox, oy) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width * ox, y: rect.top + rect.height * oy };
  }, selector, offX || 0.5, offY || 0.5);
  if (pos) {
    console.log(`    cursor at (${Math.round(pos.x)}, ${Math.round(pos.y)}) on ${selector}`);
    await addCursorAt(page, pos.x, pos.y);
    return true;
  }
  console.log(`    ⚠ NOT FOUND: ${selector}`);
  return false;
}
async function removeCursor(page) {
  await page.evaluate(() => { const el = document.getElementById('fake-cursor'); if (el) el.remove(); });
}

function navToOptA() {
  return `selectPage(document.querySelector('.pp-sub[onclick*="Option A"]'), 'Option A · On Repeater');`;
}
function selectEl(id) {
  return `
    S.sel = '${id}';
    document.querySelectorAll('.sel').forEach(n => n.classList.remove('sel'));
    var n = document.getElementById('${id}');
    if (n) { n.classList.add('sel'); n.scrollIntoView({block:'center',behavior:'instant'}); }
    S.inspectorOpen = true;
    S.tab = 'settings';
    renderRP();
    renderActionBar();
  `;
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: 1366, height: 768, deviceScaleFactor: 2 }
  });
  const page = await browser.newPage();
  page.on('dialog', async dialog => { await dialog.accept(); });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(1000);

  // Navigate to Option A page
  await page.evaluate(new Function(navToOptA()));
  await delay(500);

  // ========== FLOW 1: Pre-bound Repeater Overview ==========
  console.log('\nFlow 1: Pre-bound Repeater');

  // Step 1: View the page with pre-bound repeater
  await page.evaluate(() => { S.sel = null; S.inspectorOpen = false; renderRP(); });
  await delay(300);
  await snap(page, 'r1-step1.png');

  // Step 2: Select the pre-bound repeater
  await page.evaluate(new Function(selectEl('repeater-opta-prebound')));
  await delay(500);
  await addCursorOnElement(page, '#repeater-opta-prebound .rep-header', 0.5, 0.5);
  await snap(page, 'r1-step2.png'); await removeCursor(page);

  // Step 3: View the repeater settings in inspector (Items connected)
  await delay(200);
  await snap(page, 'r1-step3.png');

  // Step 4: Click on an element inside repeater to see its bindings
  await page.evaluate(new Function(selectEl('el-opta-pb-title-1')));
  await delay(500);
  await addCursorOnElement(page, '#el-opta-pb-title-1', 0.5, 0.5);
  await snap(page, 'r1-step4.png'); await removeCursor(page);

  // Step 5: Element inspector showing bound field
  await snap(page, 'r1-step5.png');

  // ========== FLOW 2: Blank Repeater → Connect Data ==========
  console.log('\nFlow 2: Blank Repeater → Connect Data');

  // Step 1: View the blank repeater section
  await page.evaluate(() => {
    S.sel = null; S.inspectorOpen = false; renderRP();
    document.getElementById('sec-opta-blank').scrollIntoView({block:'start', behavior:'instant'});
  });
  await delay(500);
  await snap(page, 'r2-step1.png');

  // Step 2: Select the blank repeater - see "not connected" state
  await page.evaluate(new Function(selectEl('repeater-opta-blank')));
  await delay(500);
  await addCursorOnElement(page, '#repeater-opta-blank .rep-header', 0.5, 0.5);
  await snap(page, 'r2-step2.png'); await removeCursor(page);

  // Step 3: Repeater settings inspector showing unconnected state
  await snap(page, 'r2-step3.png');

  // Step 4: Click "Connect data →" notice
  await addCursorOnElement(page, '#repeater-opta-blank .rep-notice span', 0.5, 0.5);
  await snap(page, 'r2-step4.png'); await removeCursor(page);

  // Step 5: Trigger add context modal for the repeater
  await page.evaluate(() => { openModal('repeater-opta-blank'); });
  await delay(500);
  await addCursorOnElement(page, '#modal-list .modal-item:first-child .modal-check', 0.5, 0.5);
  await snap(page, 'r2-step5.png'); await removeCursor(page);

  // Step 6: Select a context and apply
  await page.evaluate(() => {
    if (!S.modal.pending.includes('cms-articles')) S.modal.pending.push('cms-articles');
    renderModalList(); checkModalReady();
  });
  await delay(300);
  await addCursorOnElement(page, '#modal-ok', 0.5, 0.5);
  await snap(page, 'r2-step6.png'); await removeCursor(page);

  // Step 7: After applying - repeater now connected
  await page.evaluate(() => { confirmCtx(); });
  await delay(500);
  await page.evaluate(new Function(selectEl('repeater-opta-blank')));
  await delay(300);
  await snap(page, 'r2-step7.png');

  // ========== FLOW 3: Add Repeater from Add Panel ==========
  console.log('\nFlow 3: Add Repeater from Add Panel');

  // Reset state and navigate fresh
  await page.evaluate(new Function(navToOptA()));
  await delay(300);

  // Step 1: Select a section on the canvas
  await page.evaluate(new Function(selectEl('sec-opta-blank')));
  await delay(300);
  await addCursorOnElement(page, '#sec-opta-blank', 0.3, 0.1);
  await snap(page, 'r3-step1.png'); await removeCursor(page);

  // Step 2: Click the Add Elements button (+ icon in toolbar)
  await addCursorOnElement(page, '#add-el-toggle', 0.5, 0.5);
  await snap(page, 'r3-step2.png'); await removeCursor(page);

  // Step 3: Add panel opens showing repeater presets
  await page.evaluate(() => { toggleAddElementsPanel(); });
  await delay(400);
  await snap(page, 'r3-step3.png');

  // Step 4: Click Articles preset
  await addCursorOnElement(page, '.add-el-item[onclick*="articles"]', 0.5, 0.5);
  await snap(page, 'r3-step4.png'); await removeCursor(page);

  // Step 5: Articles repeater added with data
  await page.evaluate(() => { addRepeaterPreset('articles'); });
  await delay(800);
  await snap(page, 'r3-step5.png');

  // ========== FLOW 4: Bind Repeater Items via Dropdown ==========
  console.log('\nFlow 4: Bind Repeater Items');

  // Navigate fresh
  await page.evaluate(new Function(navToOptA()));
  await delay(300);

  // Step 1: Select the blank repeater
  await page.evaluate(new Function(selectEl('repeater-opta-blank')));
  await delay(500);
  await snap(page, 'r4-step1.png');

  // Step 2: Click the bind button on Items property row
  await addCursorOnElement(page, '#repeater-opta-blank .rep-bind-btn', 0.5, 0.5);
  await snap(page, 'r4-step2.png'); await removeCursor(page);

  // Step 3: Open the data dropdown
  await page.evaluate((id) => {
    const btn = document.querySelector('#repeater-opta-blank .rep-bind-btn');
    if (btn) btn.click();
  });
  await delay(600);
  await snap(page, 'r4-step3.png');

  // Step 4: Close dropdown
  await page.evaluate(() => { closeDd(); });
  await delay(200);

  // ========== FLOW 5: UoU – External Controls with Promoted Context ==========
  console.log('\nFlow 5: UoU – External Controls');

  // Step 1: Scroll to UoU section and view it
  await page.evaluate(() => {
    S.sel = null; S.inspectorOpen = false; renderRP();
    document.getElementById('sec-opta-uou').scrollIntoView({block:'start', behavior:'instant'});
  });
  await delay(500);
  await snap(page, 'r5-step1.png');

  // Step 2: Select the section - shows search/sort + repeater together
  await page.evaluate(new Function(selectEl('sec-opta-uou')));
  await delay(500);
  await snap(page, 'r5-step2.png');

  // Step 3: Select the search input - needs binding
  await page.evaluate(new Function(selectEl('el-opta-search')));
  await delay(500);
  await addCursorOnElement(page, '#el-opta-search', 0.5, 0.5);
  await snap(page, 'r5-step3.png'); await removeCursor(page);

  // Step 4: View inspector for search element
  await snap(page, 'r5-step4.png');

  // Step 5: Select repeater in same section - has data
  await page.evaluate(new Function(selectEl('repeater-opta-uou')));
  await delay(500);
  await addCursorOnElement(page, '#repeater-opta-uou .rep-header', 0.5, 0.5);
  await snap(page, 'r5-step5.png'); await removeCursor(page);

  // Step 6: Repeater settings showing context
  await snap(page, 'r5-step6.png');

  // ========== FLOW 6: Blank Repeater – Add via Preset (Team Members) ==========
  console.log('\nFlow 6: Add Team Repeater');

  await page.evaluate(new Function(navToOptA()));
  await delay(300);
  await page.evaluate(new Function(selectEl('sec-opta-prebound')));
  await delay(300);

  // Step 1: Open Add panel
  await page.evaluate(() => {
    var p = document.getElementById('add-el-panel');
    if (!p.classList.contains('open')) toggleAddElementsPanel();
  });
  await delay(400);
  await snap(page, 'r6-step1.png');

  // Step 2: Click Blank Repeater
  await addCursorOnElement(page, '.add-el-item[onclick*="blank"]', 0.5, 0.5);
  await snap(page, 'r6-step2.png'); await removeCursor(page);

  // Step 3: After adding blank
  await page.evaluate(() => { addRepeaterPreset('blank'); });
  await delay(800);
  await snap(page, 'r6-step3.png');

  // Step 4: Click Team Members preset
  await page.evaluate(() => {
    var p = document.getElementById('add-el-panel');
    if (!p.classList.contains('open')) toggleAddElementsPanel();
  });
  await delay(300);
  await addCursorOnElement(page, '.add-el-item[onclick*="team"]', 0.5, 0.5);
  await snap(page, 'r6-step4.png'); await removeCursor(page);

  // Step 5: Team repeater added
  await page.evaluate(() => { addRepeaterPreset('team'); });
  await delay(800);
  await snap(page, 'r6-step5.png');

  console.log('\n✅ All Repeater screenshots captured!');
  await browser.close();
})().catch(err => { console.error('Error:', err.message); process.exit(1); });
