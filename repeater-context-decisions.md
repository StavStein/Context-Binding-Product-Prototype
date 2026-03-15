# Repeater & Context — Product Decisions

> Final decisions after stakeholder alignment. Option A selected: **Context lives on the repeater.**

---

## 1. Where Will the Context Live

**Decision: Repeater is a context provider — contexts can be attached directly to it.**

Rationale:
- Reduces reparenting issues on drag & drop — context moves with the repeater
- Allows 2 repeaters with the same context type but different configurations on the same section (each owns its own instance)
- Follows the same UX pattern as sections — same add/remove/represent experience

When a `list` context is attached to a repeater and the Items property is unbound, the Items property is **automatically bound** to the context's array field — no extra step needed.

The user can **also** bind Items to a context that lives on a parent (section/page) — the repeater doesn't have to own a context.

> **TBD:** UX to make it clear that a coupled context is not mandatory — avoid confusion between "repeater owns context" vs. "repeater consumes parent context."

---

## 2. Context Picker (Items Property)

When binding the Items property, the context picker should:
- Show the repeater's own context as an option (if it has one)
- Use it as the **default selection**
- Display a scope badge: **"This repeater"**
- Also show parent contexts (section/page) as alternatives

---

## 3. Shadowing (Same Context on Parent and Child)

**Decision: Allowed.** The same context type can exist at both parent and child levels. The **closest instance wins** (proximity resolution).

- When adding a context that already exists on a parent → informational message, not blocked
- Elements bind to the nearest instance automatically
- Promote flow remains available as an alternative

---

## 4. Copy & Paste

| Scenario | Behavior |
|---|---|
| Repeater with coupled context | Context is **duplicated** (new instance) |
| Repeater consuming parent context | Context is **not** duplicated — binding references the parent |

---

## 5. Drag & Drop (Reparenting)

| Scenario | Behavior |
|---|---|
| Context coupled with repeater | Context moves with the repeater. No impact on other elements. Bindings stay intact. |
| Context inherited from parent | **TBD.** Suggestion: context stays in the original section. User must choose: **copy context to new section** / **promote to page** / **disconnect**. |

---

## 6. Sort, Filter & Page Size

- Configured on the **context instance** (not on the repeater directly)
- Accessed via repeater settings → **"Edit context instance"** (floating panel)
- If the repeater uses a parent context → also accessible via section settings → context configuration
- Applies only to the **main records array** (e.g., `items`). Other arrays (e.g., nested `tags`) are not affected by context-level sort/filter

---

## 7. Array Binding

**Decision: Users can bind any array, including non-records / item-level arrays.**

- Inner elements can bind to **two levels of fields**:
  - **Item-level fields** (from the bound array) — unique per repeater item
  - **Context-level fields** (from the parent context) — same value across all items. The binding UI should clearly indicate this distinction (e.g., "Same value across all rows")
- Sub-arrays do **not** have context-level sort/filter/page size — if the user needs that, they bind to a **function** that returns a filtered/sorted array

### 7a. Nested Repeaters

A repeater inside a repeater item — e.g., a tags repeater inside each article item. The inner repeater binds to a sub-array field (e.g., `items › tags`).

**Field dropdown behavior:**
- The Items dropdown recursively collects all array and multiReference fields, including nested ones
- Nested fields show a hierarchy path: `items › tags`
- When a nested array is selected, inner elements expose the sub-array's own fields (e.g., `tag value`), not the parent context's top-level fields

**Per-item scope:**
- Each inner repeater instance can have a **different item count** based on the data of its parent item (e.g., article 1 has 3 tags, article 2 has 2 tags, article 3 has 4 tags)
- Context-level fields (e.g., `totalItems`) show the **same value** across all inner items

**Disconnect / reconnect lifecycle:**
- Disconnecting the inner repeater's Items is a cascading action — removes all inner element bindings
- After disconnect: all inner repeaters normalize to **3 default placeholder items** (the standard empty state)
- A yellow warning appears **only on the first (template) inner repeater**: "Repeater is not connected to data. Connect Items to an array."
- The full state (DOM, bindings, per-item counts) is saved on disconnect and **restored on reconnect** — the user gets back exactly what they had before

**Visual behavior:**
- Nested repeaters have a **transparent border by default** — they don't clutter the canvas
- Border appears on **hover** (subtle gray), **direct selection** (accent), or **child selection** (faded accent)
- This avoids the "pink rectangles everywhere" problem in deeply nested layouts

---

## 8. Add Repeater from CMS Presets

**Option 1 — Preset without data (blank):**
- Repeater is added unbound
- **TBD:** Live site behavior — recommendation: collapse unconfigured repeater

**Option 2 — Preset with unconfigured state:**
- Repeater is collapsed in live site until configured
- User chooses:
  - **Use existing collection** → if context does not exist on any parent, add to repeater
  - **Create new collection** → create from preset schema, attach context to repeater
  - **Use as blank** → keep unbound, no context

---

## 9. Add Blank Repeater

- User drags a repeater (e.g., from quick add) that is **not connected**
- User can design and drag elements into it freely
- If user tries to bind inner elements before the repeater's Items has data → **suggest auto-binding the repeater** to the selected array alongside the element
- When binding the Items property, the context picker shows:
  - **Parent contexts** → "Use from page/section." Repeater references parent's context
  - **"+ Add context"** → Context created on the repeater. Exists only for it

**TBD:**
- Default items when unbound — how many items to show in editor? What content? (coordinate with Viewer team)
- Live site behavior before bound — collapse? Show placeholder? Hide entirely?

---

## 10. Add Pre-Bound Repeater (e.g., Products Gallery)

| Scenario | Behavior |
|---|---|
| Relevant context exists on parent | **Inherit from parent.** No context added to the repeater. |
| No relevant context on parent | **Context added on the repeater.** Repeater owns it. |

---

## 11. UoU Interactions (Sort, Filter, Pagination, Total Items)

- Context **must be promoted to section first** — then external controls can bind to it
- Same requirement for any context-level data outside repeater items (e.g., `itemsCount`)
- Promote suggestion appears:
  - In **repeater settings** — message suggesting to promote when context is coupled
  - In **binding dropdown** for external elements — shows the repeater's context with a "Promote to section" action

**Promote is a move, not a copy.** After promoting, the context is removed from the repeater's scope and exists **only** on the section. The repeater then inherits the context from its parent section, like any other element in that section.

### ⚠️ Filter ceiling principle (requires R&D approval)

Context-level filters set by the site builder define the **maximum dataset boundary**. When UoU filters are applied at runtime by the site visitor (e.g., search bar, filter dropdown), they operate **within** the context filter — they can only **narrow** the results, never **widen** them.

**Example:** If the builder filtered the context to show only "Tech" articles, a visitor using a UoU search bar can search within Tech articles only — they cannot discover or access articles from other categories.

**Implication for R&D:** The runtime query pipeline must enforce context-level filters as a hard constraint that UoU filters cannot override. The UoU filter is applied **on top of** (intersected with) the context filter — not as a replacement.

> **TBD:** Exact UX for the promote suggestion in the binding dropdown.

### ⚠️ Disconnect confirmation modal

Disconnecting a repeater's "Items" binding is a **high-impact action** — it cascades to all inner element bindings. Unlike most properties (where disconnect is silent), the repeater **should trigger a confirmation modal** before proceeding.

**Open question (R&D + Product):** Is this a **component-level opt-in** (the repeater declares that its disconnect needs confirmation) or should the platform **automatically detect** high-impact disconnects? See [Binding Controller spec — Open TBD #5](binding-platform-demo.html#spec=binding-controller).

---

## 12. System Contexts

System contexts (User, Site, Router) appear **only at page level** — not on sections or repeaters. Always available, cannot be removed.
