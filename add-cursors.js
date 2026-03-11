const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:8777/binding-platform-demo.html';
const OUT_DIR = path.join(__dirname, 'demo-screens', 'ctx-final');

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
</g>
</g>
<defs>
<filter id="filter0_d_503_20154" x="3" y="5" width="33.8923" height="40.8953" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_503_20154"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_503_20154" result="shape"/>
</filter>
<clipPath id="clip0_503_20154">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>`;

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
  await page.evaluate(() => {
    const el = document.getElementById('fake-cursor');
    if (el) el.remove();
  });
}

function selectSection(id) {
  return `
    S.sel = '${id}';
    document.querySelectorAll('.sel').forEach(n => n.classList.remove('sel'));
    var n = document.getElementById('${id}');
    if (n) n.classList.add('sel');
    S.inspectorOpen = true;
    S.tab = 'settings';
    renderRP();
  `;
}

(async () => {
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

  // ========== FLOW 1 ==========
  console.log('\nFlow 1: Happy Path');
  await page.evaluate(new Function(selectSection('sec-articles')));
  await delay(500);
  await addCursorOnElement(page, '.add-ctx-btn', 0.5, 0.5);
  await snap(page, 'f1-step1.png'); await removeCursor(page);

  await page.evaluate(() => { openModal('sec-articles'); }); await delay(500);
  await addCursorOnElement(page, '#mi-cms-articles .modal-check', 0.5, 0.5);
  await snap(page, 'f1-step2.png'); await removeCursor(page);

  await page.evaluate(() => { if (!S.modal.pending.includes('cms-articles')) S.modal.pending.push('cms-articles'); renderModalList(); checkModalReady(); }); await delay(300);
  await addCursorOnElement(page, '#modal-ok', 0.5, 0.5);
  await snap(page, 'f1-step3.png'); await removeCursor(page);

  await page.evaluate(() => { confirmCtx(); }); await delay(500);
  await page.evaluate(new Function(selectSection('sec-articles'))); await delay(300);
  await snap(page, 'f1-step4.png');

  await page.evaluate(() => { S.openCats.attachedCtx = true; renderRP(); }); await delay(300);
  await snap(page, 'f1-step5.png');

  // ========== FLOW 2 ==========
  console.log('\nFlow 2: Shadowing');
  await page.evaluate(() => { S.ctxMap['page-home'] = ['cms-articles']; S.ctxMap['sec-articles'] = []; }); await delay(200);
  await page.evaluate(new Function(selectSection('sec-articles'))); await delay(500);
  await addCursorOnElement(page, '.add-ctx-btn', 0.5, 0.5);
  await snap(page, 'f2-step1.png'); await removeCursor(page);

  await page.evaluate(() => { openModal('sec-articles'); }); await delay(500);
  await addCursorOnElement(page, '#mi-cms-articles .modal-check', 0.5, 0.5);
  await snap(page, 'f2-step2.png'); await removeCursor(page);

  await page.evaluate(() => { if (!S.modal.pending.includes('cms-articles')) S.modal.pending.push('cms-articles'); renderModalList(); checkModalReady(); }); await delay(300);
  await addCursorOnElement(page, '#modal-ok', 0.5, 0.5);
  await snap(page, 'f2-step3.png'); await removeCursor(page);

  await page.evaluate(() => { confirmCtx(); }); await delay(500);
  await page.evaluate(new Function(selectSection('sec-articles'))); await delay(300);
  await snap(page, 'f2-step4.png');

  // ========== FLOW 3 ==========
  console.log('\nFlow 3: Promote to Page');
  await page.evaluate(() => { S.ctxMap['page-home'] = []; S.ctxMap['sec-articles'] = ['cms-articles']; }); await delay(200);
  await page.evaluate(() => { openModal('page-home'); }); await delay(500);
  await addCursorOnElement(page, '[onclick*="promoteCtxToPage"]', 0.5, 0.5);
  await snap(page, 'f3-step1.png'); await removeCursor(page);

  await page.evaluate(() => { if (!S.modal.promotes) S.modal.promotes = []; S.modal.promotes.push({ ctxId: 'cms-articles', fromSection: 'sec-articles' }); if (!S.modal.pending.includes('cms-articles')) S.modal.pending.push('cms-articles'); renderModalList(); checkModalReady(); }); await delay(300);
  await addCursorOnElement(page, '#modal-ok', 0.5, 0.5);
  await snap(page, 'f3-step2.png'); await removeCursor(page);

  await page.evaluate(() => { confirmCtx(); }); await delay(500);
  await page.evaluate(new Function(selectSection('page-home'))); await delay(300);
  await snap(page, 'f3-step3.png');

  // ========== FLOW 4 ==========
  console.log('\nFlow 4: Multi-Select');
  await page.evaluate(() => { S.ctxMap['page-home'] = ['cms-articles']; S.ctxMap['sec-weather'] = ['weather']; }); await delay(200);
  await page.evaluate(() => { openModal('sec-weather'); }); await delay(500);
  await addCursorOnElement(page, '#modal-list .modal-item.attached .modal-check', 0.5, 0.5);
  await snap(page, 'f4-step1.png'); await removeCursor(page);

  await page.evaluate(() => { S.modal.pending = S.modal.pending.filter(id => id !== 'weather'); if (!S.modal.pending.includes('cms-articles')) S.modal.pending.push('cms-articles'); if (!S.modal.pending.includes('cms-my-team')) S.modal.pending.push('cms-my-team'); renderModalList(); checkModalReady(); }); await delay(300);
  await addCursorOnElement(page, '#modal-ok', 0.5, 0.5);
  await snap(page, 'f4-step2.png'); await removeCursor(page);

  await page.evaluate(() => { S.ctxMap[S.modal.target] = [...S.modal.pending]; closeModal(); }); await delay(500);
  await page.evaluate(new Function(selectSection('sec-weather'))); await delay(300);
  await snap(page, 'f4-step3.png');

  // ========== FLOW 5 ==========
  console.log('\nFlow 5: Create New Context');
  await page.evaluate(() => { S.ctxMap['sec-empty'] = []; openModal('sec-empty'); }); await delay(500);
  await addCursorOnElement(page, '.modal-create-btn', 0.5, 0.5);
  await snap(page, 'f5-step1.png'); await removeCursor(page);

  await page.evaluate(() => { var newCtx = { id: 'cms-reviews', name: 'Reviews', type: 'list', source: 'CMS', group: 'CMS', fields: [{name:'title',type:'string',sample:'"Great product"'},{name:'rating',type:'number',sample:'5'}]}; CTX_DEFS.push(newCtx); if (!S.modal.pending.includes('cms-reviews')) S.modal.pending.push('cms-reviews'); renderModalList(); checkModalReady(); }); await delay(400);
  await snap(page, 'f5-step2.png');
  await page.evaluate(() => { closeModal(); }); await delay(200);

  // ========== FLOW 6 ==========
  console.log('\nFlow 6: Discard Changes');
  await page.evaluate(() => { S.ctxMap['sec-hero'] = ['custom-countdown']; openModal('sec-hero'); }); await delay(300);
  await page.evaluate(() => { if (!S.modal.pending.includes('cms-articles')) S.modal.pending.push('cms-articles'); renderModalList(); checkModalReady(); }); await delay(300);
  await addCursorOnElement(page, '.modal-x', 0.5, 0.5);
  await snap(page, 'f6-step1.png'); await removeCursor(page);

  await page.evaluate(() => { closeModalSafe(); }); await delay(500);
  await addCursorOnElement(page, '#confirm-ok-btn', 0.5, 0.5);
  await snap(page, 'f6-step2.png'); await removeCursor(page);
  await page.evaluate(() => { cancelConfirm(); closeModal(); }); await delay(300);

  // ========== FLOW 7 ==========
  console.log('\nFlow 7: Restore Inherited');
  await page.evaluate(() => { S.ctxMap['page-home'] = ['cms-articles']; S.ctxMap['sec-hero'] = ['custom-countdown']; S.removedInherited['sec-hero'] = ['cms-articles']; }); await delay(200);
  await page.evaluate(() => { openModal('sec-hero'); }); await delay(500);
  await addCursorOnElement(page, '[onclick*="restoreInheritedCtx"]', 0.5, 0.5);
  await snap(page, 'f7-step1.png'); await removeCursor(page);

  await page.evaluate(() => { restoreInheritedCtx('cms-articles'); }); await delay(300);
  await snap(page, 'f7-step2.png');
  await page.evaluate(() => { closeModal(); }); await delay(200);

  // ========== FLOW 8 ==========
  console.log('\nFlow 8: Primary Lock');
  await page.evaluate(() => { S.removedInherited = {}; }); await delay(300);
  await page.evaluate(() => { openModal('page-rel-detail'); }); await delay(600);
  await page.evaluate(() => { var list = document.getElementById('modal-list'); if (list) { list.style.maxHeight = '500px'; list.style.overflow = 'visible'; } var box = document.querySelector('#modal .modal-box'); if (box) box.style.maxHeight = '95vh'; }); await delay(400);
  await snap(page, 'f8-step1.png');

  await page.evaluate(() => { if (!S.modal.pending.includes('cms-articles')) S.modal.pending.push('cms-articles'); renderModalList(); checkModalReady(); var list = document.getElementById('modal-list'); if (list) { list.style.maxHeight = '500px'; list.style.overflow = 'visible'; } var box = document.querySelector('#modal .modal-box'); if (box) box.style.maxHeight = '95vh'; }); await delay(400);
  await addCursorOnElement(page, '.modal-item.locked .modal-check', 0.5, 0.5);
  await snap(page, 'f8-step2.png'); await removeCursor(page);
  await page.evaluate(() => { closeModal(); });

  console.log('\n✅ Done!');
  await browser.close();
})().catch(err => { console.error('Error:', err.message); process.exit(1); });
