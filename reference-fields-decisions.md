# Reference & Multi-Reference Fields — Decisions & Dilemmas

## Overview

This document captures all design decisions, dilemmas, and trade-offs made during the prototyping of reference fields in the Context Binding system. Reference fields allow one CMS collection to link to another (e.g., books to authors, team members to roles).

---

## 1. Data Model — How Reference Fields Are Represented

### Dilemma
How should a reference field (a foreign key to another collection) appear in the context model?

### Options Considered
| Option | Description |
|--------|-------------|
| **A — Auto-resolve** | Context provider resolves references automatically; user sees sub-fields in the binding dropdown (e.g. `role.roleName`) |
| **B — Separate context** | Reference stays as an ID; user must add a separate context for the referenced collection |
| **C — Auto-add context** | Reference appears as a link; system adds the referenced collection context automatically |

### Decision: **Option A — Auto-resolve**
The context provider auto-resolves references. The user sees referenced collection fields as nested sub-fields in the binding dropdown, without needing to manually add another context.

> **User:** "אפשרות A היא הנכונה לנו."

### Implementation
Three field types in `CTX_DEFS`:

```
reference        — Single reference (one-to-many), e.g. teamMember.role → one Role
multiReference   — Many-to-many reference, e.g. book.authors → multiple Authors
array + isReverseRef — Computed reverse reference, e.g. role.teamMembers → all members with this role
```

Each reference field includes `referencedCollection` (the target collection ID) and `refFields` (the sub-fields exposed from the target).

---

## 2. Binding Inside Repeaters — Generic vs Indexed Paths

### Dilemma
When binding inner elements of a repeater to fields of an array/multiReference, should the binding path include a specific item index?

### Options
| Path | Meaning |
|------|---------|
| `relatedBooks.1.genre` | Bound to the genre of the **second** specific item — static |
| `relatedBooks.genre` | Bound to the genre field **generically** — dynamic per item |

### Decision: **Generic paths (no index)**
Bindings inside repeaters are always generic. `relatedBooks.genre` means "the genre of whichever item this repeater row represents." This is the core difference between static and dynamic binding.

> **User:** "אני רואה שהוספת כאן מספר שמייצג כנראה את האייטם בarray? נראה לי שזה טעות להכניס את זה, כי הרי בסוף החיבור פה הוא גנרי"

---

## 3. Reverse References on Item Pages — Approach A vs Approach B

### Dilemma
On a Role Item page, how should a repeater of "Team Members with this role" be set up?

### Option A — Bind to page context array field
The repeater binds to the page context's `teamMembers` field (a reverse-ref array on `cms-role-current`). Inner elements bind to sub-fields of that array.

**Pros:** Simple, single context, less setup.
**Cons:** No independent pagination, sorting, or filtering on the repeater.

### Option B — Separate filtered context
The repeater binds to a separate `Team Members` list context, filtered by `role = Current Role` (dynamic filter).

**Pros:** Full pagination, sort, and filter support; consistent with list pages.
**Cons:** More setup; requires the "filter by current item" concept.

### Decision: **Both approaches coexist**
Both options are available for now. The user chooses based on their needs. A future decision may consolidate to one approach.

> **User:** "אני חושבת ש-2 אפשרויות צריכות להיות זמינות כרגע, ושהיוזר ישתמש במה שנוח לו... ובהמשך נוכל להחליט להוריד אחת מהאפשרויות כשנדון בכל המורכביות שעוד יעלו."

---

## 4. Filtering by Reference Field — Field-Level vs Sub-Field

### Dilemma
When filtering by `role` (a reference to the Roles collection), is the filter on the reference field itself or on a sub-field like `role.roleName`?

### Options
1. Filter by sub-fields (e.g. `role.roleName = "UX Designer"`)
2. Filter by the reference field itself (e.g. `role = "UX Designer"`)

### Decision: **Filter by the reference field itself**
For simplicity, filtering is done on the reference field as a whole. The display value of the referenced item is used as the filter value. Sub-field filtering is not supported in phase 1.

> **User:** "לדעתי צריך להתחיל מהאפשרות השנייה — לפלטר רק לפי השדה שמחובר, ולא כל אחד מהשדות שבקולקשיין של roles."

### Display
The filter field selector shows: `role (Reference to Roles collection)` to make it clear this is a reference field.

---

## 5. Filter Value Input — Dynamic Page Context Selection

### Dilemma
For filters like "role = Current Role" on a dynamic item page, how should the user select the value?

### Options
1. **Toggle static/dynamic** — separate button to switch between text input and binding picker
2. **Smart dropdown** — dropdown showing "Current Item" as an option alongside static values
3. **Auto-detect** — system suggests the filter automatically

### Decision: **Smart dropdown (Option 2)**
When dynamic page contexts are available, the filter value input becomes a dropdown with:
- Dynamic options: `"⚡ Current Role (current item)"`
- Static option: `"Enter a static value…"`

This applies **consistently to all field types**, not just reference fields.

> **User:** "צריך שהפתרון של current role ואיך בוחרים אותו יהיה אותו דבר כמו שהגדרנו קודם ברפיטר של הteam members. זה מנגנון שצריך להיות עקבי."

---

## 6. "Not In" Filter — Excluding Items from a Dynamic Array

### Dilemma
On the Book Item page, "All Other Books" should exclude both the current book AND the related books. How to filter by membership in a dynamic array?

### Decision: **New `not_in` condition type**
A new filter condition `is not in` was added. When selected, the value dropdown shows **array/multiReference fields** from the dynamic page context (e.g., `⚡ Current Book · relatedBooks`).

This allows the user to configure: `title is not in ⚡ Current Book · relatedBooks`

### Data Model
```js
{
  field: 'title',
  condition: 'not_in',
  value: 'Current Book · relatedBooks',
  isDynamic: true,
  dynamicCtxId: 'cms-book-current',
  dynamicField: 'relatedBooks'
}
```

> **User:** "נראה לי שזה משהו שיוזר צריך להיות מסוגל להגדיר, בוא נראה איך יש עוד פילטר שמוגדר על הרפיטר הזה שמחריג החוצה ספרים שמופיעים בarray של related books"

---

## 7. Context Instances — Separate Contexts per Repeater

### Dilemma
Two repeaters on the same page were sharing a context, making independent filter configuration impossible.

### Decision: **Each repeater gets its own context instance**
When a repeater needs its own filter, it gets a dedicated context definition (e.g., `cms-team-members-filtered` separate from `cms-team-members`). This is reflected in `S.filterRules` which is now keyed by `ctxId`.

> **User:** "יכול להיות ש-2 הרפיטרים מחוברים לאותו קונטקסט? לדעתי צריך להיות לכל אחד מהם קונטקסט נפרד..."

---

## 8. Context Naming & Aliases

### Dilemma
Multiple context instances with the same name (e.g., two "Team Members" contexts) are indistinguishable.

### Decision
- Contexts are auto-numbered by name (e.g., "Team Members #1", "Team Members #2")
- Users can set a custom name via an editable "Context Name" field in settings
- Aliases are stored in `S.ctxAliases` and resolved everywhere via `resolveCtxName(ctxId)`

> **User:** "בsettings של הקונטקסט תוסיף שדה context name? ואז לאחד מהם תוסיף ׳1׳ בסוף?"
>
> **User:** "השם הזה צריך להיות משוקף בכל מקום שאני רואה לאיזה קונטסט אני חוברת"

---

## 9. Filter Display — Context Card vs Static Badge

### Dilemma
How should an active filter on a repeater's context be represented?

### Options
1. Static badge on the canvas (e.g., "Filter: role = UX Designer")
2. Filter toggle on the context card in the properties panel

### Decision: **Filter toggle on the context card**
Active filters appear as a toggleable row on the context card, using `S.ctxRelationships` with scoped keys (e.g., `repeater-id::context-id`).

> **User:** "אני רוצה לראות שהקונטקסט אליו הרפיטר מחוברת בעצם מפולטר לפי הrole"

---

## 10. Add Elements Panel — Suggested Repeaters per Dynamic Page

### Dilemma
How should a user discover and add reference-related repeaters to a dynamic item page?

### Decision
The Add Elements panel shows a **"Suggested for [Page]"** section on dynamic pages, listing pre-configured elements:
- Repeaters for multiReference/reverse-reference fields (e.g., "Authors", "Related Books")
- Cards for single reference fields (e.g., "Role Details")
- Separate-context repeaters for "all other items" (e.g., "All Other Books")

Each click creates a **new instance** (not reusing existing ones), pre-bound with the correct context and field bindings. The item count and sample data match the actual data.

> **User:** "אחרי שהוספתי רפיטר מסויים, אפשר לשנות לו את הסטייט ככה שהיוזר יבין שזה כבר בדף. אם היוזר יגרור את הרפיטר לדף, הוא יגיע כבר מחובר כמו שהגדרנו בדפים לדוגמא."

---

## 11. Repeater Inner Elements — Selectable & Bound

### Dilemma
Inner elements of repeaters (text, images) were not selectable or bindable.

### Decision
Every inner element gets:
- A `c-el` wrapper with unique ID
- `onclick` handler for selection
- `EL_DEFS` entry with `repTemplate` for shared binding
- `S.bindings` entry for each property

---

## Use Cases Implemented

| Page | UC | What's Shown | Approach |
|------|----|-------------|----------|
| Team Members List | UC1 | Role name as sub-field in repeater | Auto-resolved reference |
| Team Members List | UC2 | Filtered by role (static filter) | Separate context instance |
| Team Member Item | UC3 | Role details (name, description) | Dot-notation binding to refFields |
| Role Item | UC4a | Team members (reverse ref) | Approach A — page context array |
| Role Item | UC4b | Team members (filtered context) | Approach B — separate filtered context |
| Role Item | UC5 | Other roles (≠ current) | Separate context + dynamic filter |
| Book Item | UC6 | Authors (multi-ref) | Repeater bound to `authors` field |
| Book Item | UC7 | Related books (self-ref) | Repeater bound to `relatedBooks` field |
| Book Item | UC8 | All other books | Separate context + `not_equals` + `not_in` filters |
| Author Item | UC9 | Books by author (reverse multi-ref) | Repeater bound to `books` array |

---

## Open Questions / Future Considerations

| Topic | Status | Notes |
|-------|--------|-------|
| Approach A vs B consolidation | Deferred | Both coexist; decision depends on real usage patterns |
| Sub-field filtering | Not in Phase 1 | Filter by `role.roleName` vs filter by `role` — started with the simpler option |
| Reference field in "Add Element" | Not in Phase 1 | Pre-bound elements from reference fields |
| Collection deletion protection | Not started | Prevent deleting collections used as references |
| Inline creation of referenced items | Not started | Create new referenced items from a dropdown |
| Reverse references scope | Open | Always automatic, or only on item pages? |
| Self-reference edge cases | Partially addressed | `relatedBooks` works; circular references not fully explored |
| Drag-and-drop for suggested elements | In progress | Click works; drag-to-canvas has browser compatibility issues |
