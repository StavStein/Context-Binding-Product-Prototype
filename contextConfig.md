# Context Configuration — Panel Specification

> Complements [context.md](./context.md) (which covers what contexts are, scoping, types, and binding). This document focuses on the **configuration panel** — what it shows, how it behaves, and how configuration properties interact with data binding.

---

## Architecture: Platform Capability vs. Context-Defined

The config panel is a **platform capability** — it renders configuration UI automatically based on what the context manifest declares. The platform doesn't hard-code config for each context. Instead, every context provider exposes its configurable properties in its manifest, and the platform renders the appropriate controls.

### Two layers of configuration

| Layer | Source | Known in advance? | Examples |
|-------|--------|-------------------|----------|
| **List Configuration** | Platform-provided | Yes — identical for all `list` contexts | Filter, Sort, Random order, Page size |
| **Context-specific Settings** | Declared by the context manifest | Depends on context type (see below) | Location, Units, Currency, Search radius |

### CMS contexts

For CMS collections, the configuration is **known and deterministic** — every CMS list context gets the same list configuration. The schema (fields) comes from the collection definition, and the platform knows how to render filter/sort for any CMS collection. This is a "one size fits all" approach for CMS.

> **Open question:** CMS will introduce additional collection types in the future — **Catalog collections** (Ecom-oriented) and **Categories collections**. These may require slightly different or extended configuration (e.g. catalog-specific pricing/inventory settings, category hierarchy options). TBD whether the list configuration remains fully uniform across all CMS collection types, or whether the platform needs to support collection-type-specific extensions while keeping the base list configuration consistent.

### Custom contexts

Any custom context can expose its own configuration properties via its **context manifest** (the `data` props in the provider spec — see [context.md](./context.md)). These are **not known to the platform in advance** — they are defined by the developer who built the context provider.

The platform reads the manifest and renders the config panel dynamically — the right input type, options, defaults, descriptions, and binding support. This means:
- A Weather App context might declare `location`, `units`, and `refresh`
- A Countdown Timer context might declare `targetDate` and `timezone`
- A developer can add new config properties by updating their manifest — the panel adapts automatically

### App contexts

Wix Apps (Stores, Bookings, etc.) behave like custom contexts — they define their own config properties in their manifest. The platform renders them the same way.

> **Open question:** Some app contexts may expose `list`-type data (e.g. Stores · Products, Bookings · Classes). It's TBD how list configuration applies to app-provided lists — do they get the full platform-level Filter/Sort/Page size like CMS collections? Or do apps control their own list behavior and expose it through their manifest? The answer affects whether the platform treats all `list` contexts uniformly, or whether the built-in list configuration is a CMS-specific feature that apps can opt into or replace with their own equivalents.

---

## Opening the Config Panel

Every context card in the settings panel can show a **gear icon** (⚙). Clicking it navigates into the context's configuration view.

The gear icon appears when:
- The context has explicit config properties (e.g. Weather App → Location, Units, Refresh), **or**
- The context is a `list` type (always has built-in list configuration)

A "Back to contexts" link returns to the context list.

---

## Panel Structure

The config panel has a **header** and one or more **sections**, followed by a source link.

### Header

| Element | Description |
|---------|-------------|
| Icon + Name | Context display name (respects aliases) |
| Field count | e.g. "9 fields" |
| Type badge | `list` or `object` |

### Sections (top to bottom)

| Section | Appears when | Contains |
|---------|-------------|----------|
| **List Configuration** | `type === 'list'` | Filter, Sort, Random order, Page size |
| **General Settings** | Context has config properties | Context-specific properties (Currency, Search radius, etc.) |
| **Source link** | Always | "Open Collection" / "Open in Dashboard" / "Open Source" |

### Source Link Labels

| Context source | Link label |
|---------------|------------|
| CMS | Open Collection |
| Wix Apps (Stores, Bookings) | Open in Dashboard |
| Custom Code / other | Open Source |

### Empty State

When a context has no config properties and is not a list (e.g. `stores-current-item`), the panel shows: "This context has no configurable properties. All settings are managed by the app."

---

## List Configuration (built-in)

Every `list`-type context gets the same four built-in configuration properties. These are **not** defined per-context — they are platform-level features that apply uniformly to any context of type `list`.

### Filter

| Aspect | Behavior |
|--------|----------|
| Default state | "No filters" |
| Interaction | Click `›` to open the Filter dialog |
| Bindable | Yes — can be connected to a context field or function |
| When bound | The static filter config is hidden; bound chip shows the source |
| Dialog | Shows applied filter rules as cards (field name + condition). Each rule has a `...` menu with Edit / Delete. "Add new filter" opens an edit sub-dialog with Field, Condition, Value selectors. Fields are derived from the context's schema. |

### Sort

| Aspect | Behavior |
|--------|----------|
| Default state | "No sorting" |
| Interaction | Click `›` to open the Sort dialog |
| Bindable | Yes — one binding covers all sort behavior |
| When bound | Static sort config hidden; Random order toggle disabled |
| Dialog | Shows sort rules as cards with drag handles (::), bold field name, direction label (A → Z, High → Low, Newest → Oldest — adapts to field type). Each rule has `...` menu with Edit / Delete. Fields are derived from the context's schema. |

### Random Order

| Aspect | Behavior |
|--------|----------|
| Type | Toggle (Off / On) |
| Relationship to Sort | Sub-control of Sort — no separate binding |
| When ON | Sort row shows "Random", sort dialog is not clickable, sort-by is disabled. Info note appears: "Your items will be displayed in a random order. The order will stay the same until the site cache resets." |
| When Sort is bound | Random order toggle is disabled (binding takes over) |

### Page Size

| Aspect | Behavior |
|--------|----------|
| Type | Number input |
| Default | 10 |
| Bindable | Yes — field type filtering shows only `number` fields |
| Description | Max items loaded per page in the repeater |

---

## General Settings (context-specific)

These are properties declared by the **context manifest** — the platform reads them and renders the UI automatically. They vary per context and are not known to the platform in advance (except for CMS, where the platform provides them).

The panel is an **auto-panel**: given a manifest with typed config properties, it generates the appropriate controls, binding support, tooltips, and defaults without any context-specific code.

Examples:
- **Weather App** (custom): Location (select), Units (toggle °C/°F), Refresh (select)
- **Products** (app): Currency (select)
- **Locations** (app): Search radius (select)
- **Identity** (system): Login redirect (select)

### Config Property Definition

Each config property has:

| Field | Description |
|-------|-------------|
| `key` | Unique identifier |
| `label` | Display label |
| `input` | Input type: `select`, `toggle`, or `number` |
| `options` | For `select`/`toggle` — array of allowed values |
| `default` | Default value (enables reset) |
| `description` | Optional — shown as `(?)` tooltip on hover |

---

## Bindable Configuration

Every config property (both built-in dataset settings and context-specific) can be **bound to data** using the standard binding controller.

### Visual Pattern

Each config row follows the same visual pattern as element property binding:

| State | Appearance |
|-------|-----------|
| **Unbound** | Input control (select / toggle / number) visible inside a rounded row, bind button to the right |
| **Bound** | Input control hidden, pink chip appears (context name + field name with ✕ to unbind), bind button turns green |

### Type Filtering

When opening the binding dropdown for a config property, fields are filtered by compatibility:

| Config input type | Shows fields of type |
|-------------------|---------------------|
| `number` | `number` only |
| `select` | `string`, `number`, `enum`, `dateTime`, `boolean` |
| `toggle` | `string`, `number`, `enum`, `dateTime`, `boolean` |
| Filter / Sort (built-in) | All types (accepts functions or dynamic data) |

### Reset to Default

A `↺` icon appears on hover when a config value differs from its default. Clicking it resets to the default. Hidden when:
- The value matches the default
- The property is bound (binding takes over)

### Info Tooltips

Properties with a `description` show a `(?)` icon next to the label. Hovering reveals a tooltip with the description text.

---

## Interaction Between Controls

### Sort binding overrides static controls

```
Sort bound → Random order: disabled
           → Sort dialog: hidden (bound chip shown)
           → Sort-by (if any): disabled
```

### Random order overrides sort dialog

```
Random ON  → Sort row shows "Random" (not clickable)
           → Info note visible
Random OFF → Sort row restored to previous state
```

### Binding overrides static value

```
Any config bound → Static input hidden
                 → Bound chip visible
                 → Reset button hidden
Unbind           → Static input restored with preserved value
```

---

## Sort & Filter Dialogs

Both dialogs share the same UX pattern:

### Sort Dialog

- Header: "Sort ▾"
- Empty state: "No sorting applied" + "Add new sort"
- Each rule: drag handle `::` | **Field name** (bold) | Direction label (adapts to type) | `...` menu
- Direction labels: A → Z / Z → A (string), Low → High / High → Low (number), Oldest → Newest / Newest → Oldest (dateTime)
- Adding/editing opens a sub-dialog with Field + Direction selectors
- Footer: Cancel / Apply

### Filter Dialog

- Header: "Filter (count) ▾"
- Empty state: "No filters applied" + "Add new filter"
- Each rule: **Field name** (bold) | Condition description (e.g. "contains N") | `...` menu
- `...` menu: Edit / Delete
- Adding/editing opens a sub-dialog with Field + Condition + Value selectors
- Footer: Cancel / Apply

### Field Options

Both dialogs derive their field options from the **context's schema** — the fields defined in the context definition. This means different contexts will show different fields in the sort/filter dialogs based on their own data structure.
