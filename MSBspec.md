# Multi-State Box — Product Specification

## Overview

The Multi-State Box (MSB) is a container component that displays one of several **views** at a time. Each view is a fully-designed graphical state with its own child components. On the canvas, the user controls which view is visible for design purposes. At runtime (on the live site), the active view is determined by the bound data field's value.

The MSB requires a new data type — `states` — which represents an enum-like field that returns one of a finite set of known string values at runtime.

---

## Core Concepts

| Term | Definition |
|------|-----------|
| **Physical view** | A graphical state of the MSB. Contains actual child components and designs. Always labeled with a serial name: State 1, State 2, State 3… |
| **Logical state** | A value coming from a `states` data field (e.g. `loading`, `ready`, `hasItems`). Only exists when connected. |
| **Mapping** | The assignment of one or more logical states to a physical view. Determines which view renders for which data value. |
| **Default view** | An optional fallback view that displays when the runtime state doesn't match any mapped logical state. |
| **Connected mode** | The MSB's `Active State` property is bound to a `states` field from a context. Views switch automatically based on data. |
| **Static mode** | No data binding. The user designs views freely. At runtime, the first view is always displayed. |

---

## Data Type: `states`

A new field type available in context definitions. Represents a finite set of mutually exclusive values — only one state is active at any given time. The logic that determines which state is active is defined and managed by the context provider (e.g. an app or integration), not by the user. The user's role is to design what each state looks like visually.

**Properties:**
- `type: 'states'`
- `enumValues: string[]` — the list of possible values (e.g. `['loading', 'empty', 'hasItems']`). These are mutually exclusive — exactly one is active at runtime.
- `sample: string` — a representative value for preview

**Compatibility:** The `states` type is compatible with the MSB's `Active State` property. It also cross-compatible with `enum` fields for binding flexibility.

**Example context fields:**

| Field name | Values | Use case |
|-----------|--------|----------|
| `itemsStatus` | `loading`, `empty`, `hasItems` | 3-state list display |
| `loadState` | `loading`, `ready` | Simple binary loading indicator |
| `displayState` | `loading`, `noItems`, `noResults`, `hasItems` | 4-state search results |

---

## User Intents

### 1. Design multiple views without data

**Who:** A user building the visual states of a component before connecting data.

**Behavior (static mode):**
- MSB starts with a set of physical views (e.g. State 1, State 2, State 3)
- User clicks a view in the settings panel → canvas switches to show that view for editing
- User designs each view independently with different child components and layouts
- Canvas buttons show serial names: **State 1**, **State 2**, **State 3**

**Available actions:**
| Action | How | Notes |
|--------|-----|-------|
| Switch view | Click a state card in the panel, or a canvas button | Canvas updates immediately |
| Add view | Click **+ Add state** below the list | Creates an empty new view at the end |
| Delete view | Click **✕** on a state card | Allowed as long as at least 1 view remains |
| Duplicate view | Click **⧉** on a state card | Copies the view's design into a new view inserted after the source |
| Reorder views | Click **↑ / ↓** arrows on a state card | Swaps the view with its neighbor; renumbers serially |
| Set default | Click **default** badge on a state card | Marks it as the fallback view |

---

### 2. Connect to a data source

**Who:** A user ready to make the MSB respond to live data.

**Flow:**
1. User clicks the bind button (⚡) on the **Active State** property
2. A binding dropdown shows compatible `states` fields from available contexts
3. User selects a field (e.g. `itemsStatus` with values `loading`, `empty`, `hasItems`)

**What happens on connect:**

1. **Smart auto-mapping** — the system maps logical states to existing physical views:
   - First pass: match by ID (view ID matches a state value, case-insensitive)
   - Second pass: fill remaining unmapped views sequentially with leftover states
2. **If more logical states than views** — new empty views are created automatically for each unmapped state
3. **If more views than logical states** — extra views become **unmapped** (shown as "won't be triggered" with a dashed border)
4. View names in the panel remain serial (State 1, State 2, State 3…)
5. Logical state chips (e.g. `loading`, `empty`) appear inside each view card
6. Canvas buttons update to show **data-driven labels** (e.g. "Loading", "Empty", "HasItems")

**Info line:** When connected, the States section header shows:
> **3** data states from `itemsStatus` · Click to switch, drag to remap.

---

### 3. Remap states between views (drag & drop)

**Who:** A user who wants to change which logical state triggers which physical view.

**Flow:**
1. In the settings panel, each state card shows colored chips for its mapped logical states
2. User grabs a chip (mousedown + drag) → a ghost element follows the cursor
3. All drop zones highlight to indicate valid targets
4. User drops the chip on a different state card

**Behavior on drop:**
- The logical state is **removed** from the source view and **added** to the target view
- If a view now has multiple chips → both logical states trigger the same physical view (**join**)
- Canvas switches to the target view
- Toast confirms: `✓ "loading" → State 2`
- The panel and canvas immediately reflect the new mapping

**Join behavior:**
When two or more logical states map to the same view, a "joined" badge appears. At runtime, any of those values will display the same graphical view.

**Unjoin:** Click the **✕** on an individual chip to unassign it from a joined view. The state returns to its own new view.

**Reset:** When joins exist, a "Reset — undo all joins" link appears below the state list. Clicking it restores the 1:1 mapping.

---

### 4. Disconnect from data

**Who:** A user who wants to change the data source or go back to static design mode.

**Flow:**
1. User clicks **✕** on the binding chip in the Active State property

**What happens on disconnect:**
- All graphical views are **preserved** — no designs are lost
- Logical state mappings (`enumValues`) are cleared from all views
- View names revert to serial: State 1, State 2, State 3…
- Canvas buttons revert to serial names
- A warning banner appears: "Not connected to data — Views won't switch automatically."
- The MSB border changes to **dashed** to indicate disconnected state
- All static-mode actions become available again (add, delete, duplicate)

**Key principle: disconnecting never destroys designs.**

---

### 5. Delete a physical view

**Who:** A user who has too many views and wants to reduce.

**Rules by mode:**

| Mode | Rule | Minimum views |
|------|------|---------------|
| **Static** | Can always delete | 1 (can't delete the last view) |
| **Connected** | Can only delete if `physical views > logical states` | Equal to the number of logical states |

**If deletion is blocked (connected mode):**
Toast message: "Can't delete — need at least N views for N data states"

**On delete:**
- The view's DOM element is hidden
- Remaining views are renumbered: State 1, State 2, State 3…
- If the deleted view was active, the first available mapped view becomes active
- If the deleted view was the default, the default designation is removed

---

### 6. Add a physical view

**Who:** A user who needs more graphical states.

**Rules by mode:**

| Mode | Available | Notes |
|------|-----------|-------|
| **Static** | Yes — **+ Add state** button | Creates a new empty view at the end |
| **Connected** | No — button is hidden | New views are auto-created when connecting to a field with more states |

**On add:**
- A new empty view is appended with placeholder content: `◫ Empty view — design it in the canvas`
- The new view becomes the active view for editing
- Serial names update automatically

---

### 7. Set a default / fallback view

**Who:** A user who wants to handle edge cases at runtime (e.g. an unexpected state value).

**How:** Click the **default** badge on any state card (available in both modes).

**Behavior:**
- Clicking toggles the default on/off
- Only one view can be the default at a time
- When set, the badge appears highlighted (yellow)
- At runtime, if the data value doesn't match any mapped logical state, the default view is displayed

---

### 8. Reorder physical views

**Who:** A user who wants to organize views in a specific order.

**How:** Click **↑** or **↓** arrows on a state card.

**Behavior:**
- Swaps the view with its immediate neighbor
- Serial names recalculate: State 1, State 2, State 3…
- Canvas button order updates to match
- DOM order of the actual view elements also swaps (so canvas reflects the new order)
- Available in both static and connected modes

---

### 9. Duplicate a physical view

**Who:** A user who wants to create a new view based on an existing design.

**Rules by mode:**

| Mode | Available | Notes |
|------|-----------|-------|
| **Static** | Yes — **⧉** button | Copies the view's inner HTML into a new view |
| **Connected** | No — button is hidden | To avoid ambiguity in mapping |

**On duplicate:**
- A new view is inserted immediately after the source view
- The new view has the same design (copied DOM content)
- The new view has no logical state mapping (`enumValues: []`)
- Serial names recalculate
- The new view becomes the active view for editing

---

## Settings Panel Layout

### When connected

```
┌──────────────────────────────────────────────────┐
│ Active State                                      │
│ ┌──────────────────────────────────────────────┐ │
│ │ Active State                                  │ │
│ │ [📎 CMS · Articles] [itemsStatus  ✕]         │ │
│ └──────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│ States                                            │
│ 3 data states from itemsStatus ·                  │
│ Click to switch, drag to remap.                   │
│                                                   │
│ ┌────────────────────────────────────────────┐   │
│ │ ◫ State 1  editing    [default] [↑][↓] [✕] │   │
│ │ [loading]                                   │   │
│ ├────────────────────────────────────────────┤   │
│ │ ◫ State 2             [default] [↑][↓] [✕] │   │
│ │ [empty]                                     │   │
│ ├────────────────────────────────────────────┤   │
│ │ ◫ State 3             [default] [↑][↓] [✕] │   │
│ │ [hasItems]                                  │   │
│ └────────────────────────────────────────────┘   │
│            Reset — undo all joins                 │
└──────────────────────────────────────────────────┘
```

### When disconnected (static)

```
┌──────────────────────────────────────────────────┐
│ Active State                                      │
│ ┌────────────────────────────────────────────┐   │
│ │ ⚠️ Not connected to data                    │   │
│ │    Views won't switch automatically.        │   │
│ └────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────┐ │
│ │ Active State                                  │ │
│ │ Connect to a states field →                ⚡ │ │
│ └──────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│ States                                            │
│ Your designs are preserved. Click to preview      │
│ each view.                                        │
│                                                   │
│ ┌────────────────────────────────────────────┐   │
│ │ ◫ State 1  editing  [default][↑][↓][⧉][✕]  │   │
│ ├────────────────────────────────────────────┤   │
│ │ ◫ State 2           [default][↑][↓][⧉][✕]  │   │
│ ├────────────────────────────────────────────┤   │
│ │ ◫ State 3           [default][↑][↓][⧉][✕]  │   │
│ └────────────────────────────────────────────┘   │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  │
│   + Add state                                    │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │
└──────────────────────────────────────────────────┘
```

---

## Canvas Behavior

### View selector dropdown

A dropdown trigger appears on hover over the MSB on the canvas (top-right area).

**Trigger button:** Shows the name of the currently active view.

| Mode | Trigger label | Example |
|------|--------------|---------|
| **Connected** | First mapped logical state, capitalized | `Loading` |
| **Disconnected** | Serial name | `State 1` |

**Dropdown items:** Each item shows:
- **Physical name** (always): State 1, State 2, State 3…
- **Logical name** (when connected and mapped): `Loading`, `HasItems`, etc.
- **"unmapped"** label when connected but no state is assigned
- **"editing"** badge on the active view
- Active item highlighted with accent dot

Clicking an item switches the canvas to that view.

### MSB border

| State | Border style |
|-------|-------------|
| Connected, not selected | Solid accent |
| Connected, selected | Solid accent + shadow |
| Disconnected, not selected | Dashed subtle |
| Disconnected, selected | Dashed accent + shadow |
| Unbound (no views) | Default element border |

---

## Mismatch Scenarios

### More logical states than physical views

**Example:** 4 data states (`loading`, `noItems`, `noResults`, `hasItems`) → 3 existing views

**Behavior:**
- First 3 states are mapped to existing views (by ID match, then sequentially)
- The 4th state (`noResults`) triggers creation of a new empty **State 4**
- User sees a new empty view card and can design it

### Fewer logical states than physical views

**Example:** 2 data states (`loading`, `ready`) → 3 existing views

**Behavior:**
- States are mapped to the first 2 views
- State 3 becomes **unmapped**: dashed border, "won't be triggered" label
- User can delete State 3 (since `3 views > 2 states`)
- Or user can drag a logical state chip to State 3 to remap

### Reconnecting to a different field

**Example:** Was connected to `itemsStatus` (3 states), now connecting to `loadState` (2 states)

**Behavior:**
- All existing mappings are cleared
- New smart auto-mapping runs with the new field's values
- Extra views become unmapped
- Designs are never lost

---

## Permissions Matrix

| Action | Static mode | Connected mode |
|--------|:-----------:|:--------------:|
| Switch active view | ✅ | ✅ |
| Add view | ✅ | ❌ (auto-created on connect) |
| Delete view | ✅ (min 1) | ✅ only if `views > states` |
| Duplicate view | ✅ | ❌ |
| Reorder views | ✅ | ✅ |
| Set default view | ✅ | ✅ |
| Drag-remap chips | N/A (no chips) | ✅ |
| Unjoin chip (✕) | N/A | ✅ (when joined) |
| Reset joins | N/A | ✅ (when joins exist) |
| Connect to field | ✅ | ✅ (switch field) |
| Disconnect | N/A | ✅ |

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Delete the active view | First remaining mapped view (or first view) becomes active |
| Delete the default view | Default designation is removed |
| All chips dragged to one view | All other views show "won't be triggered" |
| Connect with 0 existing views | Views are created for each logical state |
| Disconnect then reconnect same field | Smart mapping runs again; views may re-map differently if reordered |
| Duplicate when only 1 view exists | Creates a 2nd identical view; both can be edited independently |
| Reorder while connected | Logical state mappings stay with their views (they move together) |
