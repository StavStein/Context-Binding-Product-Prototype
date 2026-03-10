# Context Binding Platform — Use Cases Map

> A comprehensive map of user scenarios the platform needs to support.
> Each use case represents a distinct user intent — what they want to achieve, which platform capabilities are involved, and what the prototype status is.

---

## How to read this

Each use case follows this structure:
- **Number** — sequential ID
- **User intent** — what the user is trying to do (in their words)
- **Tags** — which platform capabilities/areas are involved
- **Status** — `✅ Prototyped` | `🔶 Partially` | `⬜ Not started`

---

## A — Adding & Managing Data Sources

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| A01 | I want to add a data source (context) to my page or section | `Add context` `CMS` | ✅ |
| A02 | I want to use my own content instead of the placeholder | `Replace collection` `CMS` | ✅ |
| A03 | I want to switch a list's data to a different context | `Replace context` `Rebind` | 🔶 |
| A04 | I want to add a second data source to the same section | `Add context` `Multiple contexts` | 🔶 |
| A05 | I want to add a pre-connected section from the Add Panel (context already on page) | `Add Panel` `Pre-connected` `Existing context` | ⬜ |
| A06 | I want to add a pre-connected section from the Add Panel (context doesn't exist yet) | `Add Panel` `Pre-connected` `New context` | ⬜ |
| A07 | I want to use a Wix App as my data source (Stores, Bookings) | `Add context` `App context` | ⬜ |
| A08 | I want to add a custom code context (Weather, Countdown) | `Add context` `Custom context` | ⬜ |
| A09 | I want to detach a context from my page or section | `Remove context` `Detach` `Cleanup` | 🔶 |
| A10 | I want to rename a context instance to something meaningful | `Context alias` `Naming` | ✅ |
| A11 | I want to know what data a context exposes (fields, actions) | `Context card` `Field discovery` | ✅ |
| A12 | I want to see which elements are using a specific context | `Usage indicator` `In-use state` | ✅ |
| A13 | I want to share a context across all sections on the page | `Promote context` `Scope change` | 🔶 |
| A14 | I want two different views of the same collection on one page | `Multiple instances` `Scope rules` | ✅ |
| A15 | I want to add a context to a section when the same collection already exists on the page (shadowing) | `Shadowing` `Section override` `Scope rules` | 🔶 |
| A16 | I want to use data in the header/footer (global section) | `Global context` `Site-level scope` | ⬜ |
| A17 | I want to extend an app's data with my own custom fields | `Data extension` `Context augmentation` | ⬜ |

---

## B — Binding Properties to Data

> **Priority:** `CNF` = cannot fail · `High` = important · `NTH` = nice to have

### Core Binding Actions

| # | User Intent | Tags | Status | Pri |
|---|------------|------|--------|-----|
| B01 | I want to connect a property to a data field | `Bind property` `Connect` | ✅ | CNF |
| B02 | I want to disconnect a property and return to static content | `Unbind` `Disconnect` `Restore static` | ✅ | CNF |
| B03 | I want to see which context and field a property is connected to | `Bound indicator` `Property chip` | ✅ | CNF |
| B04 | I want to navigate from a bound property to its context settings | `Bound chip` `Navigate to context` | ✅ | CNF |
| B05 | I want to understand on the canvas which elements are connected and which are static | `Canvas pills` `Visual feedback` `Bound vs static` | ✅ | CNF |
| B06 | I want to bind a property from an ancestor context (cross-context) | `Cross-context` `Ancestor binding` | 🔶 | CNF |
| B07 | I want to bind a property to an entire object (not a single field) | `Object binding` `Compound` | ⬜ | High |

### Editing Bound Content

| # | User Intent | Tags | Status | Pri |
|---|------------|------|--------|-----|
| B08 | I want to edit the content of a property bound to a collection (table data) | `Edit content` `CMS editor` `Table data` | ✅ | CNF |
| B09 | I want to understand what I see when content is computed (function result) | `Computed content` `Read-only` `Function result` | 🔶 | High |

### Binding Without Context

| # | User Intent | Tags | Status | Pri |
|---|------------|------|--------|-----|
| B10 | I want to bind a property when no context is available — add context from binding flow | `No context` `Add from binding` `Guidance` | ✅ | CNF |

### Functions & Formatters

| # | User Intent | Tags | Status | Pri |
|---|------------|------|--------|-----|
| B11 | I want to connect a property to a function that transforms or computes data | `Function binding` `Transform` | ✅ | CNF |
| B12 | I want to pass parameters to a function (static values or bound fields) | `Function params` `Static input` `Bound param` | ✅ | High |
| B13 | I want to format a date, time, or date+time field | `Formatter` `Date` `Time` `DateTime` | ⬜ | High |
| B14 | I want to format a link / URL field | `Formatter` `Link` `URL` | ⬜ | High |
| B15 | I want to connect navigation to a dynamic page | `Navigation` `Dynamic page link` | ⬜ | High |

### Binding Panel UX

| # | User Intent | Tags | Status | Pri |
|---|------------|------|--------|-----|
| B16 | I want to choose the right context from the source dropdown | `Panel UX` `Context dropdown` `Source picker` | ✅ | CNF |
| B17 | I want to choose the right field from the values dropdown | `Panel UX` `Value dropdown` `Field picker` | ✅ | CNF |
| B18 | I want to understand which fields are compatible with my property type | `Type filtering` `Compatibility` `Panel UX` | ✅ | CNF |
| B19 | I want to understand what happens when no fields are compatible with my property | `No compatible fields` `Empty state` `Panel UX` | ⬜ | High |
| B20 | I want to see a sample / preview of the data when I select a binding | `Sample data` `Preview` `Panel UX` | ✅ | NTH |

### Specific Property Types

| # | User Intent | Tags | Status | Pri |
|---|------------|------|--------|-----|
| B21 | I want to control whether an element shows or hides based on data | `Show/hide` `Visibility` `Boolean binding` | 🔶 | High |
| B22 | I want to bind alt text for image accessibility | `Image alt` `Accessibility` `Auto-bind` | ✅ | High |
| B23 | I want to mark an image as decorative (no alt text needed) | `Image settings` `Decorative` `Accessibility` | 🔶 | NTH |
| B24 | I want to manage what happens when a bound field is empty | `Empty fields` `Fallback behavior` | ⬜ | High |

---

## C — Repeater & List Renderers

### Repeater Core

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| C01 | I want to add a repeater and connect it to my collection | `Add repeater` `Bind Items` | ✅ |
| C02 | I want to connect inner elements of the repeater to fields | `Inner binding` `Per-item fields` | ✅ |
| C03 | I want to connect inner elements when "Items" is not bound (no repeater data yet) | `Inner binding` `No Items` `Static repeater` | ⬜ |
| C04 | I want to switch the repeater to a different data source | `Rebind Items` `Stale bindings dialog` | 🔶 |
| C05 | I want to disconnect the repeater from data | `Unbind Items` `Remove inner bindings` | 🔶 |
| C06 | I want "Items" to auto-bind when I attach a context to the repeater | `Auto-bind` `Items` `Context attach` | ✅ |
| C07 | I want to understand the canvas difference between "Items unbound" and "no context at all" | `Canvas indication` `Unbound Items` `No context` | ⬜ |
| C08 | I want to understand when "Items" is connected to a different context than the repeater's own | `Items mismatch` `Cross-context Items` | ⬜ |

### Repeater Design & Layout

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| C09 | I want to add a blank repeater and design it before connecting data | `Blank repeater` `Static design` | ⬜ |
| C10 | I want to add a pre-designed repeater (preset/template) | `Add from preset` `Pre-bound repeater` | ⬜ |
| C11 | I want two repeaters with the same data but different filters | `Multiple instances` `Per-repeater config` | ✅ |
| C12 | I want to bind a repeater to a nested array (e.g. tags, reviews) | `Array binding` `Sub-context` | ⬜ |
| C13 | I want to use a repeater with A/B alternating layout pattern | `Repeater` `A/B pattern` | ⬜ |
| C14 | I want a repeater inside a repeater (nested lists) | `Nested repeater` `Repeater in repeater` | ⬜ |

### Repeater Operations

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| C15 | I want to copy-paste a repeater and keep its bindings | `Copy/paste` `Duplicate instance` | ⬜ |
| C16 | I want to drag a repeater to a different section | `Reparenting` `Context migration` | ⬜ |

### More List Components

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| C17 | I want to use a Gallery as a data-driven list (not just static images) | `Gallery` `List renderer` `Dual-mode` | ⬜ |
| C18 | I want to use a Table component to display list data | `Table` `List renderer` | ⬜ |
| C19 | I want to use Accordion/Tabs to display list data | `Accordion` `Tabs` `List renderer` | ⬜ |
| C20 | I want to use a Slideshow driven by list data | `Slideshow` `List renderer` | ⬜ |
| C21 | I want to use Google Maps driven by a list of locations | `Maps` `List renderer` `Dual-mode` | ⬜ |

---

## D — Context Configuration (Filter, Sort, Page Size)

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| D01 | I want to filter the list to show only specific items | `Filter` `Static filter` | ✅ |
| D02 | I want to sort my list by a specific field | `Sort` `Static sort` | ✅ |
| D03 | I want to show items in a random order | `Random order` `Sort override` | ⬜ |
| D04 | I want to limit how many items load per page | `Page size` `Pagination` | 🔶 |
| D05 | I want to add multiple filter rules (AND logic) | `Filter dialog` `Multiple rules` | 🔶 |
| D06 | I want to edit or delete an existing filter rule | `Filter dialog` `Edit/Delete rule` | 🔶 |
| D07 | I want to sort by multiple fields (primary + secondary) | `Sort dialog` `Multiple rules` | ⬜ |
| D08 | I want to configure app-specific settings (currency, units) | `General settings` `Custom config` | ⬜ |
| D09 | I want to bind a config property to data (dynamic filter) | `Bindable config` `Dynamic config` | ⬜ |
| D10 | I want to filter by a value from the current page context | `Dynamic filter` `Current item filter` | ✅ |
| D11 | I want to reset a config property to its default | `Reset to default` `Config UX` | ⬜ |

---

## E — Reference Fields

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| E01 | I want to show a referenced field in a repeater (e.g. role name) | `Single reference` `Auto-resolve` | ✅ |
| E02 | I want to show details from a referenced item on an item page | `Reference` `Dot-notation binding` | ✅ |
| E03 | I want to show a list of multi-referenced items (e.g. authors of a book) | `Multi-reference` `Array binding` | ✅ |
| E04 | I want to show reverse-referenced items (e.g. members with this role) | `Reverse reference` `Computed array` | ✅ |
| E05 | I want to filter by a reference field | `Reference filter` `Foreign key` | ✅ |
| E06 | I want to show "All other items" excluding the current and related | `Not-in filter` `Dynamic exclusion` | ✅ |
| E07 | I want to filter a list by the current page's item (dynamic) | `Dynamic filter` `Current item` | ✅ |
| E08 | I want to show self-referencing items (e.g. related books) | `Self-reference` `Multi-ref` | ✅ |

---

## F — Functions, Actions & Event Handlers

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| F01 | I want to bind a text to a function that formats/transforms data | `Function binding` `Return value` | ✅ |
| F02 | I want to pass parameters to a function (static values) | `Function params` `Static input` | ✅ |
| F03 | I want to pass a context field as a parameter to a function | `Function params` `Bound param` | ✅ |
| F04 | I want to bind a button click to an action (e.g. addToCart) | `Event handler` `Action binding` | ⬜ |
| F05 | I want to bind a page event (onViewportEnter) to a function | `Event handler` `Page events` | ⬜ |
| F06 | I want to see which function libraries are available | `Function discovery` `Binding dropdown` | ✅ |
| F07 | I want to use a function that combines values from multiple contexts | `Cross-context` `Function params` | ⬜ |
| F08 | I want to bind a repeater event (onItemClick) to a navigation function | `Event handler` `Repeater events` | ⬜ |
| F09 | I want to chain multiple actions on one event (click → addToCart + showToast) | `Action chaining` `Sequential actions` | ⬜ |
| F10 | I want to use an OOTB Wix function library (date formatter, currency) | `System functions` `OOTB library` | ⬜ |
| F11 | I want to understand how a custom action interacts with a component's built-in behavior | `Action conflict` `Native vs custom` | ⬜ |

---

## G — UoU Interactions (User-on-User — Visitor Controls)

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| G01 | I want to add a search input that filters the repeater | `UoU` `Search` `Bound filter` | ⬜ |
| G02 | I want to add sort buttons that let visitors sort the list | `UoU` `Sort control` `Bound sort` | ⬜ |
| G03 | I want to add pagination (next/prev) to my repeater | `UoU` `Pagination` `Page-based` | ⬜ |
| G04 | I want to show the total number of items | `UoU` `Metadata binding` `Total items` | ⬜ |
| G05 | I want to add a "Load more" button | `UoU` `Pagination` `Action binding` | 🔶 |
| G06 | I want to add category filter tabs/buttons | `UoU` `Filter control` `Dynamic filter` | ⬜ |
| G07 | I want to show a loading state while data loads | `UoU` `Metadata` `Is loading` | ⬜ |
| G08 | I want to show "No results" when filters return empty | `UoU` `Empty state` `Conditional display` | ⬜ |
| G09 | I want to promote the repeater's context so external controls can access it | `Promote context` `Scope change` | ⬜ |
| G10 | I want infinite scroll that loads items as the visitor scrolls | `UoU` `Pagination` `Infinite scroll` | 🔶 |
| G11 | I want a filter dropdown where options update based on other active filters | `UoU` `Conditional filtering` `Dependent inputs` | ⬜ |
| G12 | I want to use an Input component as a filter for the list | `Input role` `Filter mode` `Context controller` | ⬜ |
| G13 | I want to use an Input component as a sort control for the list | `Input role` `Sort mode` `Context controller` | ⬜ |

---

## H — Multi-State Box (MSB)

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| H01 | I want to design multiple views/states for a component | `MSB` `Static mode` `Design views` | ✅ |
| H02 | I want to connect the MSB to a states field from data | `MSB` `Bind Active State` `Connected mode` | ✅ |
| H03 | I want to remap which data state shows which design | `MSB` `Drag remap` `State mapping` | ✅ |
| H04 | I want to join two data states to show the same design | `MSB` `Join states` `Merge views` | ✅ |
| H05 | I want to set a fallback/default view for unexpected states | `MSB` `Default view` `Fallback` | ✅ |
| H06 | I want to disconnect the MSB from data and go back to static | `MSB` `Disconnect` `Preserve designs` | ✅ |
| H07 | I want to add/delete/duplicate/reorder views | `MSB` `View management` `Static mode` | ✅ |
| H08 | I want to switch to a different states field | `MSB` `Reconnect` `Re-mapping` | 🔶 |
| H09 | I want to see which view is active for each state on the canvas | `MSB` `Canvas dropdown` `View selector` | ✅ |

---

## I — Dynamic Pages (Item Pages)

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| I01 | I want to create an item page for each product/article/member | `Dynamic page` `Primary context` | ✅ |
| I02 | I want to bind elements on the item page to the current item's fields | `Primary context` `Object binding` | ✅ |
| I03 | I want to add a repeater of related items on the item page | `Dynamic page` `Reverse reference` `Related list` | ✅ |
| I04 | I want to filter which items get their own page | `Dynamic page` `Page generation filter` | ⬜ |
| I05 | I want to show "Other items" excluding the current one | `Dynamic page` `Dynamic filter` `Exclusion` | ✅ |
| I06 | I want to navigate from a list to an item page | `Dynamic page` `Navigation function` | ⬜ |
| I07 | I want to add suggested repeaters from the Add Elements panel | `Add Elements` `Suggested elements` `Pre-bound` | ✅ |
| I08 | I want the item page URL to be based on a field from my data (SEO slug) | `Dynamic page` `URL binding` `Routing` | ⬜ |
| I09 | I want different layouts for the same dynamic page based on item data | `Page variants` `Layout states` | ⬜ |
| I10 | I want an app-owned dynamic page (Product Page) to use the app's context | `App dynamic page` `Vertical-owned` | ⬜ |

---

## J — Scope, Hierarchy & Context Lifecycle

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| J01 | I want to understand which data sources are available to my element | `Scope resolution` `Proximity` `Binding dropdown` | ✅ |
| J02 | I want to override a page-level context with a section-specific one | `Shadowing` `Closest wins` | 🔶 |
| J03 | I want to promote a context from repeater to section level | `Promote` `Scope change` | ⬜ |
| J04 | I want to remove a context and understand what will break | `Remove context` `Impact warning` | ⬜ |
| J05 | I want to move a section to another page and keep its data working | `Section move` `Context migration` | ⬜ |
| J06 | I want to duplicate a section with its data connections | `Section copy` `Instance duplication` | ⬜ |
| J07 | I want to use a system context (Identity, Business Info) | `System context` `Global data` | ⬜ |
| J08 | I want to bind to a system field like the logged-in user's name | `System context` `Identity` `Binding` | ⬜ |
| J09 | I want to use data inside a Lightbox | `Lightbox` `Context provider` | ⬜ |
| J10 | I want a component that needs a context to show guidance when context is missing | `Missing context` `Empty state` `Guidance` | ⬜ |

---

## K — Add Elements Panel & Presets

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| K01 | I want to see suggested elements based on my page's data | `Add Elements` `Suggestions` `Dynamic page` | ✅ |
| K02 | I want to drag a suggested element and have it pre-connected | `Add Elements` `Pre-bound` `Drag to canvas` | 🔶 |
| K03 | I want to add a pre-designed repeater from a gallery of presets | `Add Elements` `Preset gallery` `Templates` | ⬜ |
| K04 | I want to create a new collection from a preset schema | `Add Elements` `New collection` `Quick setup` | ⬜ |
| K05 | I want to see a contextual add panel with elements relevant to the active context | `Contextual add panel` `Context-aware suggestions` | ⬜ |

---

## L — Canvas & Visual Feedback

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| L01 | I want to see pills on bound elements showing what they're connected to | `Canvas pills` `Visual indicator` | ✅ |
| L02 | I want to click a bound chip and navigate to the context settings | `Chip navigation` `Drill-in` | ✅ |
| L03 | I want to see MSB states switching on the canvas | `MSB canvas` `View selector` | ✅ |
| L04 | I want to see which repeater items are bound vs static | `Canvas feedback` `Bound vs static` | 🔶 |
| L05 | I want to see scope badges (This repeater / Section / Page) | `Scope badges` `Visual hierarchy` | ✅ |
| L06 | I want to see the MSB border style reflect its connection state | `MSB border` `Connected vs disconnected` | ✅ |
| L07 | I want to preview my page with live data (Live Preview) | `Live preview` `Runtime preview` | ⬜ |

---

## M — Design Variants & Conditional Styling

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| M01 | I want to change an element's design based on data (e.g. "out of stock" style) | `Design variants` `Conditional styling` | ⬜ |
| M02 | I want to apply different CSS/animation based on a field value | `Variant binding` `Style switching` | ⬜ |
| M03 | I want to show a "Sale" badge only when a product has a discount | `Render property` `Boolean binding` `Conditional display` | ⬜ |
| M04 | I want to switch layout variants based on item state | `Layout variants` `Container variants` | ⬜ |

---

## N — Write Mode & Forms

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| N01 | I want to create a form that submits data to a collection | `Write mode` `Form` `Submit action` | ⬜ |
| N02 | I want to bind an input field to a collection field for data entry | `Input binding` `Write mode` `Field mapping` | ⬜ |
| N03 | I want visitors to submit a review that gets saved to my data | `Write mode` `UGC` `Review submission` | ⬜ |
| N04 | I want visitors to update their own profile information | `Write mode` `Update record` `Members` | ⬜ |
| N05 | I want input validation rules to come from the data schema automatically | `Validation` `Schema-driven` `Write mode` | ⬜ |
| N06 | I want to compose a custom form from individual input components | `Custom form` `Input composition` | ⬜ |
| N07 | I want to distinguish between read and write permissions on the same data | `Permissions` `Read/Write mode` | ⬜ |

---

## O — Custom Components & Developer Extensibility

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| O01 | I want to create a custom component that can bind to any ancestor context | `Custom component` `Binding support` | ⬜ |
| O02 | I want my custom component to come with its own context | `Custom component` `Built-in context` | ⬜ |
| O03 | I want to build a custom context via Velo/React that exposes data and actions | `Developer` `Custom context` `Code` | ⬜ |
| O04 | I want to add a new field to a CMS collection directly from the binding flow | `CMS` `Inline field creation` `Binding flow` | ⬜ |
| O05 | I want AI to handle the complex wiring and setup for me | `AI-first` `Auto-configuration` | ⬜ |

---

## P — CMS-Specific Flows

| # | User Intent | Tags | Status |
|---|------------|------|--------|
| P02 | I want to add a new field to my collection from the context panel | `CMS` `Add field` `Schema editing` | ⬜ |
| P03 | I want to see which collections are connected to which pages/sections | `CMS` `Usage overview` `Site map` | ⬜ |

---

## Summary

| Area | Total | ✅ Done | 🔶 Partial | ⬜ Not Started |
|------|-------|---------|------------|----------------|
| **A** — Data Sources | 17 | 6 | 5 | 6 |
| **B** — Binding | 24 | 14 | 4 | 6 |
| **C** — Repeater & List Renderers | 21 | 4 | 2 | 15 |
| **D** — Configuration | 11 | 3 | 3 | 5 |
| **E** — References | 8 | 8 | 0 | 0 |
| **F** — Functions & Actions | 11 | 4 | 0 | 7 |
| **G** — UoU Interactions | 13 | 0 | 2 | 11 |
| **H** — Multi-State Box | 9 | 8 | 1 | 0 |
| **I** — Dynamic Pages | 10 | 5 | 0 | 5 |
| **J** — Scope & Lifecycle | 10 | 1 | 1 | 8 |
| **K** — Add Elements | 5 | 1 | 1 | 3 |
| **L** — Canvas Feedback | 7 | 5 | 0 | 2 |
| **M** — Design Variants | 4 | 0 | 0 | 4 |
| **N** — Write Mode & Forms | 7 | 0 | 0 | 7 |
| **O** — Custom Components & Dev | 5 | 0 | 0 | 5 |
| **P** — CMS-Specific | 2 | 0 | 0 | 2 |
| **TOTAL** | **164** | **59** | **19** | **86** |

---

### Out of Scope (This Phase)

- **DB Drivers** — Backend data connectivity layer. Mentioned in the high-level overview but not part of the current context binding product scope. Will be addressed in a future phase.

---

### Key Takeaway

**59 out of 164 use cases are prototyped (~36%), with 19 partially done.**

Entire untouched areas:
- **N — Write Mode & Forms** (7 use cases) — data collection, form submission, input validation, update records
- **O — Custom Components & Dev** (5 use cases) — custom components with binding, Velo contexts, AI wiring
- **M — Design Variants** (4 use cases) — conditional styling, variant switching, layout states
- **P — CMS-Specific** (2 use cases) — inline field creation, usage overview

Critical areas with significant remaining work:
- **G — UoU Interactions** (0/13 done, 2 partial) — search, sort, pagination, infinite scroll, empty states, loading, conditional filtering
- **C — Repeater & List Renderers** (4/21 done) — Gallery, Table, Accordion, Tabs, Slideshow, Maps, nested repeaters, presets
- **J — Scope & Lifecycle** (1/10) — promote, lightbox, missing context guidance, system contexts
- **I — Dynamic Pages** (5/10) — URL binding, page variants, app dynamic pages
- **F — Functions & Actions** (4/11) — event handlers, action chaining, OOTB libraries, conflict resolution
