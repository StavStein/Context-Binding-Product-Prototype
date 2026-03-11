# Context Binding Product Prototype — Changelog

**Prototype URL:** https://stavstein.github.io/Context-Binding-Product-Prototype/binding-platform-demo.html  
**Repo:** https://github.com/StavStein/Context-Binding-Product-Prototype

---

## 2026-03-11

### PR — `stavs/cursor-to-figma` — Demo viewer UX overhaul, cursor assets & screenshot capture tooling

**Branch:** `stavs/cursor-to-figma`  
**Status:** In Progress

#### Demo Viewer — All-Frames Layout
- Spec demo viewer now renders **all steps at once** in a vertical stack (`.all-frames` layout) instead of showing one step at a time
- Each step is wrapped in a **labeled frame** (`.demo-step-frame`) showing its caption as a header
- Active step gets a highlighted border + auto-scrolls into view (`scrollIntoView`)
- Timeline dots now show **numbered indicators** (1, 2, 3…) instead of plain circles
- Applied to both the main spec demo and scoped (per-section) demos

#### Cursor Overhaul
- Replaced inline SVG cursor with a **PNG cursor asset** (`demo-screens/cursor-pointer.png`)
- Removed the old `_cursorSvg` inline SVG and `demo-click` ring animation
- Cursor now uses `background-image` with cleaner positioning via `translate(-50%, -8%)`
- Adjusted cursor positions on the Add Context Panel demo steps for accuracy

#### Spec Status Updates
- Changed 3 specs from `implemented` → `in-progress`:
  - **Connect · Value Panel** (`connect-value-panel`)
  - **Repeater & Context** (`repeater-context`)
  - **Add Context Panel** (`add-context-panel`)

#### Product Mode Fix
- Removed premature early-return in `toggleProductMode()` that prevented the toggle from working correctly when the panel was already open

#### Minor Polish
- Spec status dropdown: slightly higher hover opacity (`.85` → `.92`), stays fully opaque when open
- Dropdown background uses fallback color (`var(--sur, #ffffff)`) and deeper shadow

#### New Files — Screenshot Capture Scripts
- **`add-cursors.js`** — Puppeteer script to capture context-flow demo screenshots with cursor overlays. Outputs to `demo-screens/ctx-final/` and `demo-screens/ctx-hand/`
- **`capture-repeater.js`** — Puppeteer script to capture repeater-flow demo screenshots. Outputs to `demo-screens/repeater-flows/`

#### New Demo Screenshots
- `demo-screens/context-flows/` — 46 screenshots covering 5 context binding flows (f1–f5, with v4 variants)
- `demo-screens/ctx-final/` — 23 final context-flow screenshots with cursors baked in
- `demo-screens/ctx-hand/` — 23 hand-cursor variant screenshots
- `demo-screens/repeater-flows/` — 31 screenshots covering 3 repeater flows (r1–r3)
- `demo-screens/cursor-pointer.png` — pointer cursor asset used in demos
- `demo-screens/click-cursor.png` — click cursor asset

**Files changed:**
- `binding-platform-demo.html` — demo viewer UX, cursor swap, status updates, product mode fix
- `add-cursors.js` — new capture script for context flows
- `capture-repeater.js` — new capture script for repeater flows
- `demo-screens/` — ~125 new screenshot assets + 2 cursor PNGs

**Risk:** Low–Medium — visual/demo UX changes only, no core binding logic affected

---

## 2026-02-25

### PR #9 — `ui: remove selector item icons for cleaner layout`
**Branch:** `stavs/cleanup-selector-icons`  
**Status:** Merged

**What changed:**
- Removed all `dd-sel-item-icon` elements from selector item templates across the binding drawer
- Removed from: main source selector, param selector, repeater selector (5 template instances)
- Removed 2 CSS rules (`.dd-sel-item-icon` and `.dd-sel-item.sel .dd-sel-item-icon`)
- Selector rows now display text-only (name + subtitle) for a cleaner look

**Why:**
- The icon boxes (24x24px squares with emoji/text) added visual clutter without conveying useful information
- Cleaner rows improve scannability when picking a data source

**Files changed:**
- `binding-platform-demo.html` — removed icon divs from 5 template literals + 2 CSS rules

**Risk:** Low — visual-only cleanup, no logic changes

---

## Prior history (before changelog tracking)

| PR | Title | Date |
|----|-------|------|
| #8 | msb: simplify states panel and add item navigation with hero updates | pre-tracking |
| #7 | noym/fix-repeater-click | pre-tracking |
| #6 | function-binding: add parameterized function binding with static values | pre-tracking |
| #5 | stavs/add-elements-panel | pre-tracking |
