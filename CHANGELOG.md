# Context Binding Product Prototype — Changelog

**Prototype URL:** https://stavstein.github.io/Context-Binding-Product-Prototype/binding-platform-demo.html  
**Repo:** https://github.com/StavStein/Context-Binding-Product-Prototype

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
