# Context — Product Definition

## Core Concepts

### Provider

A data source application or service that exposes data to the editor. A single provider can register **multiple context types**, each representing a different data access point.

Examples of providers:
- **Wix Stores** — registers Products (list), Current Product (object, primary), Store Locations (list)
- **CMS** — registers one context type per collection (Articles, Team Members, etc.)
- **Custom Code** — user-defined context types with custom items
- **System** — built-in global context types (Identity, Business Info, Page List, Locations)

### Context Type (the definition)

A reusable definition registered by a provider. It describes the **shape** of the data — what items (fields, arrays, functions) are available — but is not yet placed anywhere in the page.

A context type is a **logical component** built on React Context. It has no UI of its own, but exposes shared state and functionality via a hook (e.g., `useProductListContext()`). It includes:
- **Items** — a flat map of exposed values: fields, arrays, complex objects, functions
- **Data** — props for configuration in the editor (filters, sorting, limits, etc.)
- **Resources** — client bundle (runtime), optional editor bundle (mock data)

Think of a context type as a **class** — it defines behavior and structure, but doesn't exist on the page until instantiated. Each context type has a **component type** identifier (e.g., `wixStores.products`) that is unique across the platform.

All context items (fields, functions, metadata) live in a single flat `context.items` map. The categorization into Data fields, Actions, Metadata, and System fields is a **product-level UX grouping** — not a technical separation.

#### Data shapes

| Shape | Description | Example |
|-------|-------------|---------|
| **list** | A collection of items. Can be connected to a repeater. | Products, Articles, Locations |
| **object** | A single item with fields. | Business Info, Weather, Current Product |

### Context Instance (the placement)

When a context type is **added to a page or section**, a context instance is created. Each instance has:

| Property | Description | Example |
|----------|-------------|---------|
| **Instance ID** | Globally unique identifier for this specific placement | `ctx_a8f3e2`, `ctx_b91c4d` |
| **Context Type** | Which context type this is an instance of | `wixStores.products` |
| **Scope** | Where it lives — page or section | Section A |
| **Configuration** | Instance-specific data props (filters, sort, limits) | filter: featured = true |

The same context type can have **multiple instances** across the page — each with its own unique instance ID and its own configuration.

Example — two instances of the same CMS Articles type:

| Instance ID | Context Type | Scope | Configuration |
|-------------|-------------|-------|---------------|
| `ctx_a8f3e2` | `cms.articles` | Section "Featured" | filter: featured = true |
| `ctx_b91c4d` | `cms.articles` | Section "Latest" | sort: date desc, limit: 5 |

Both share the same items (title, body, author, image, ...) but return different data at runtime because of their configuration.

#### Default instance vs. configured instance

When a user adds a context type to a section for the first time, a **default instance** is created with no custom configuration. If the user duplicates it, a new **configured instance** is created — same context type, new instance ID, ready for different settings.

### Technical foundation

The concept is built on top of **React Context** — the same scoping and inheritance model applies. A context provider wraps a container (page, section, or component), and all descendants can consume its values. This means context naturally flows downward through the component tree, and a child container can access contexts from all of its ancestors.

Technically, a context provider is a **logical component** — it has no UI of its own. It exposes a React hook (e.g. `useWeatherContext()`) that child components call to access the context values. The provider has two bundles:
- **Client bundle** — runs at runtime, fetches real data
- **Editor bundle** (optional) — provides mock/sample data for the editor canvas

---

## Scoping

The level in the hierarchy where a context instance lives. A context provider can be attached to any container in the component tree:

| Scope | Meaning |
|-------|---------|
| **Page** | Available to all sections and their descendants |
| **Section** | Available to all elements and containers within that section |
| **Container** | Available only to elements within that container (e.g., a Box, Multi-State Box) |

The resolution follows standard React Context rules — a child component can access contexts from **all ancestors**, not just the immediate parent. A deeper scope narrows availability; a higher scope widens it.

Multiple contexts can be attached to the same container. A component can bind different properties to different contexts — for example, a Text component binding its `Value` to one context's field and its `Link` to another.

For hierarchy rules governing how instances can be placed, see [context-rules.md](./context-rules.md).

---

## Context Sources

| Source | Data shape | Example |
|--------|-----------|---------|
| **CMS** | `list` — an array of items with shared fields | Articles, My Team, Categories |
| **Custom Code** | `object` — a single record with known fields | Weather App, UpcomingClassCountdown |
| **Apps** | `list` or `object` | Stores · Products, Stores · Locations |
| **Dynamic Page** | `object` — locked to page, URL-driven | The current product, article, or team member |
| **System** | `object` — always available, no user action | Identity, Business Info |

### System Contexts

System contexts are **always available** on every page, regardless of page type or configuration. They are not added or removed by the user. They do not occupy a scope — they exist globally.

| Context Type | Category | Items |
|-------------|----------|-------|
| Identity | object | logged-in status, user name, email, role, avatar |
| Page List | list | page name, URL, is current |
| Business Info | object | business name, logo, phone, email, address |
| Locations | list | location name, address, hours, phone |

In the binding dropdown, system contexts appear in a **collapsed group** at the bottom of the source list. They do not display a scope badge.

### Primary Context (Dynamic Page)

An `object` context instance that comes built-in with a **dynamic page**. It represents the page's identity — the URL determines which item the provider resolves to at runtime.

- It is **locked** — cannot be removed or moved
- It always lives at **page scope**
- Example: on a Product Page, the primary context is an instance of `wixStores.currentProduct` — it defines "which product this page is about"

**Dual nature:**
- **For components** (binding): behaves as `object` — always a single item. Components bind to fields like `name`, `price`, `image` and receive one value.
- **For page generation** (configuration): behaves as a filtered list. The user can define filters that determine which items from the source get their own page.

The filter is a **gate at the page-generation level** — it decides which items get a page at all, not which item is shown on a given page. Once a visitor is on the page, the context always resolves to exactly one item.

---

## Context Structure

Every context can expose both **data** and **functions**:

- **Data fields** — values the user can bind to component properties (e.g. `city`, `temperature`, `image`)
- **Functions** — actions the user can bind to component events (e.g. button click)

A list-type context can expose up to four categories of bindable content:

| Category | What it contains | Scope | Example |
|----------|-----------------|-------|---------|
| **Data fields** | Data values from the source | Per item | `name`, `description`, `icon`, `articleCount` |
| **Actions** | Functions — both item-level and collection-level | Varies | `Navigate to item page`, `Apply filters`, `Load more`, `Refresh data` |
| **Metadata** | Computed read-only values about the current state of the context | Collection level | `Total items`, `Items on page`, `Is loading`, `Active filter count` |
| **System fields** | Auto-generated fields managed by the platform | Per item | `_id`, `_createdDate`, `_updatedDate`, `_owner` |

An object-type context typically exposes data fields and actions only.

Users can also **add custom fields** to a context (e.g. adding a new field to a CMS collection directly from the context panel).

### Properties

**Product-level properties (UX):**

| Property | Description |
|----------|-------------|
| `name` / `displayName` | Display name (e.g. "Weather App") |
| `icon` | Visual identifier shown in pills and chips |
| `type` | Data shape — `object` (single record) or `list` (array of items) |
| `source` | Where the data comes from (e.g. "CMS", "Custom Code", "Wix Stores") |
| `group` | Category in the context picker (CMS, Custom, Apps, System) |

**UX grouping of context items:**

| Category | Description |
|----------|-------------|
| **Data fields** | Bindable data points per item |
| **Actions** | Functions — item-level (e.g. navigate, edit) and collection-level (e.g. filter, sort, load more) |
| **Metadata** | Computed values about the context state (e.g. total items, is loading) |
| **System fields** | Platform-managed fields (e.g. `_id`, `_createdDate`, `_owner`) |

**Technical-level properties (from context provider spec):**

| Property | Technical key | Description |
|----------|--------------|-------------|
| Component type | `type` | Namespaced identifier (e.g. `wixElements.weatherContext`) |
| Context items | `context.items` | Flat map of all exposed items (fields, functions, metadata — all together) |
| Configuration props | `data` | Props the provider receives for user configuration (e.g. °C/°F, refresh interval) |
| Client bundle | `resources.client` | ESM bundle URL for runtime |
| Editor bundle | `resources.editor` | Optional ESM bundle for editor mock data |
| React hook | `resources.contextSpecifier.hook` | The hook child components call (e.g. `useWeatherContext`) |
| Settings override | `settings` | Optional — custom settings panel action |

---

## Fields

Each field in a context has:

| Property | Description |
|----------|-------------|
| `name` | Field identifier (e.g. `city`, `temperature`, `items`) |
| `type` | Data type — determines which component properties it can bind to |
| `sample` | A representative value for canvas preview |

### Field Types

| Product type | Technical `dataType` | Description | Binds to |
|-------------|---------------------|-------------|----------|
| `string` | `text` | Text value | Text Value, Button Label, Alt Text |
| `number` | `number` | Numeric value | Text Value (displayed as text) |
| `boolean` | `booleanValue` | True/false | Visible toggle |
| `image` | `image` | Image URL | Image Source |
| `url` | `url` | Link URL | Link property |
| `email` | `email` | Email address | Link, Text Value |
| `dateTime` | `dateTime` | Date/time value | Text Value (formatted) |
| `enum` / `states` | `textEnum` | One of a predefined set of values, with explicit options | Enum properties, MSB Active State |
| `array` | `arrayItems` | Nested list of items, each with a defined item schema | Repeater Items |
| `object` | `data` | Complex nested object with named sub-fields | Composite binding |
| `function` | `function` | Callable action with optional parameters and return value | Click Action, form events |

### The `states` Type

A special field type used by the Multi-State Box. Represents a finite set of **mutually exclusive** values — exactly one state is active at any given time.

The logic that determines which state is active is **defined and managed by the context provider**, not by the user. The user's role is purely visual — designing what each state looks like.

Technically this is a `textEnum` with predefined options, each having a `value` and a `displayName`.

Example: `itemsStatus` with values `['loading', 'empty', 'hasItems']`

See [MSBspec.md](./MSBspec.md) for the full Multi-State Box specification.

### Functions

Context items with `dataType: "function"` are bindable actions. Functions can have:

| Property | Description |
|----------|-------------|
| `parameters` | Array of typed parameters the function accepts (each with `dataType`, `displayName`, and optional `description`) |
| `returns` | Optional — the return value type (can be a complex object) |
| `async` | Whether the function is asynchronous |

Example: a shopping cart context might expose `addItem(productId: text, quantity?: number)` and `checkout(paymentMethod: text) → {success, orderId}`.

When a user binds a component event (e.g. button click) to a function, the parameters become **sub-properties** that are also bindable — to other context fields or to static values. See the function binding implementation in the prototype.

### Complex Objects

The `data` dataType allows nesting — a context item can be a structured object with its own named sub-fields. This enables binding to deeply nested values (e.g. `profile.firstName`, `location.address`).

Arrays can also contain complex objects — e.g. a list of locations where each item has `latitude`, `longitude`, and `address` fields.

### Context Delegation (contextImplementor)

A context item can delegate its implementation to another context provider component. This allows composition — e.g. an Auth context can delegate its `user` item to a separate User Profile context provider. The parent context specifies which component type to delegate to and which prop to pass the value through.

---

## Binding

Binding connects a **component property** to a **data source** — a context field or a function library function. Once bound, the property's value comes from data instead of being static.

### Anatomy of a binding

| Part | What it is | Example |
|------|-----------|---------|
| **Target** | The component property being bound | Text → `Value`, Image → `Source`, Button → `onClick` |
| **Source** | The context or function library providing the value | `Articles`, `Weather App`, `myFunctions` |
| **Field/Function** | The specific item from the source | `title`, `temperature`, `formatDate()` |

### Property states

| State | Appearance | Behavior |
|-------|-----------|----------|
| **Unbound** | Text input visible, bind button (snake icon) to the right | User can type a static value |
| **Bound** | Pink chip replaces the input: source name + field name, ✕ to unbind | Static input hidden, canvas shows sample/live data |
| **Active** | Bind button highlighted, dropdown open | User is selecting a source/field |

### Binding flow

1. User clicks the **bind button** (snake icon) next to a property
2. **Source selection** — dropdown shows available contexts and function libraries
3. **Field selection** — after selecting a source, its compatible fields appear
4. **Binding applied** — pink chip appears, canvas updates with sample data
5. **Unbind** — clicking ✕ on the chip removes the binding, static value is restored

### Bound chip

The chip shows two clickable parts:

| Part | Display | Click action |
|------|---------|-------------|
| **Source** | Icon + context name (e.g., `⚡ myFunctions`) | Navigates to the container settings where this source lives |
| **Field** | Field or function name + ✕ (e.g., `title ✕`) | ✕ unbinds the property |

### Binding Compatibility

Not every field can bind to every property. The system checks type compatibility:

| Property type | Compatible field types |
|---------------|----------------------|
| `string` | `string`, `number`, `dateTime`, `enum` |
| `image` | `image` |
| `url` | `url` |
| `boolean` | `boolean` |
| `action` | Functions (void — event handlers) |
| `list` | `array` |
| `states` | `states`, `enum` |

Function library functions follow the same rules based on their **return type** — a function returning `string` can bind to a `string` property, etc.

### Function binding with parameters

When a function with parameters is bound to a property:

1. The function chip appears on the property row (source + function name)
2. A **Parameters** section appears below the property, with one row per parameter
3. Each parameter is independently bindable:
   - **Static value** — user types directly in the input
   - **Bound to context field** — user clicks the parameter's bind button and selects a field
4. The function evaluates at runtime with the resolved parameter values

Example: `twoValuesConcat()` bound to a Text `Value`:
- Parameter `text1` → bound to `Articles · title`
- Parameter `text2` → static value `"Read more"`
- Result on canvas: `"The Future of AI · Read more"`

### Canvas behavior

| Binding type | Canvas shows |
|-------------|-------------|
| **Context field** | The field's `sample` value |
| **Function (no params)** | The function's `sample` return value |
| **Function (with params)** | Template rendered with parameter values |
| **Unbound** | Static value or placeholder |

### Unbinding

Clicking ✕ on a bound chip:
- Removes the binding and restores the previous static value (preserved during binding)
- For functions with parameters: all parameter bindings are also removed

### Open questions

- **Static parameter input:** How does the user define static values for function parameters? Free text input? Type-specific controls (number stepper, date picker)? Should there be validation against the parameter's declared type?
- **Function chip navigation:** When a property is bound to a context field, clicking the source name navigates to the container where the context lives. But function libraries are not attached to any container — where should clicking the source name navigate? To the Velo code file? Nowhere (disable navigation)? To a dedicated function library panel?

---

## Context Lifecycle

1. **Attach** — User adds a context to a container (page, section, or container component) via the Add Context modal
2. **Configure** — User optionally adjusts context settings (e.g. units, refresh interval, filters)
3. **Bind** — User connects component properties to context fields, actions, or metadata
4. **Promote** — User moves the context from a container to its parent (e.g. section → page), broadening its scope
5. **Runtime** — Context provider supplies live data; bound components display real values
6. **Disconnect** — User can remove the context; all bindings are cleared, components revert to static values

### Promote (move to parent)

Promotes a context from its current container to the parent container, making it available to a wider scope of components.

**What happens:**
- All existing bindings inside the original container stay intact — they still resolve normally
- Components in sibling containers now also gain access to the context
- The context card moves from the current container's settings to the parent's settings

**Open questions (to be decided):**
- **Duplicate context**: What if the parent already has the same context attached? Should we merge, block, or warn?
- **Demote (reverse)**: Should we also support moving a context from a parent down to a specific child container to restrict its scope? If so, what happens to bindings in sibling containers that lose access?
- **Configuration inheritance**: Does promoting affect any filter/sort configuration tied to the context, or does it carry over as-is?
- **Dynamic Page context**: The Dynamic Page context cannot be promoted (it's locked to the page level)

---

## Context in the UI

### Context Picker (Add Context modal)
Contexts are grouped by type (CMS, Custom, Apps, System). The user selects which contexts to attach to the current section.

### Section Settings Panel
Shows attached contexts as cards with:
- Context name and icon
- Type badge (`object` / `list`) — for `list` contexts, also shows item count (e.g. `list · 24 items`)
- Source label (e.g. "from Custom Code")
- Usage indicator — **"In use"** (pink) when at least one field/action is bound, **"Not connected"** (gray) when nothing is bound. Hover highlights all bound elements from this context on the canvas
- **"What this context exposes"** — expandable section (clicking the indicator expands it) showing categorized lists: Data fields (N), Actions (N), Metadata (N), System fields (N). Each row shows "In use" or "+ Add" per item
- Configuration settings (if available)

### Binding Dropdown

A floating panel that opens when the user clicks the bind button on any property.

**Source selection panel** — three collapsible sections:

| Section | Default state | Contents |
|---------|--------------|----------|
| **Available Contexts (N)** | Expanded | All non-system contexts available to this element, ordered by proximity |
| **System (N)** | Collapsed | System contexts (Identity, Business Info, Page List, Locations) |
| **Function Libraries (N)** | Collapsed | Reusable function libraries |

Each context shows a **scope badge** indicating where it comes from: `This repeater` (orange), `Section` (green), `Page` (blue).

Contexts are ordered **closest-first** (repeater → section → page). If the same context type exists at multiple levels, only the closest instance is shown.

**"+ Add context"** — link at the bottom of Available Contexts. Opens the Add Context modal scoped to the current container. After adding, the new context is auto-selected.

**Promote suggestion** — when a child repeater has a context not available at the current scope, a card appears offering to promote it to the section level.

**Field selection panel** — after selecting a source, shows compatible fields filtered by type. Each field row shows type icon, name, and sample value.

See [context-rules.md](./context-rules.md) for scope resolution priority.

### Canvas Pills
Bound components show a pill with the context icon and field name, providing at-a-glance visibility of what's connected to what.

---

## Function Libraries

### What it is

A function library is a **code file** in the site's Velo files that exports reusable functions. These functions become available in the binding dropdown alongside context fields, allowing users to bind component properties and events to custom logic without writing code inline.

### Relationship to contexts

Function libraries are **not** contexts. They don't hold data or state — they transform, compute, or trigger actions.

| | Contexts | Function Libraries |
|--|---------|-------------------|
| **Purpose** | Provide data | Transform data / trigger actions |
| **State** | Have state, configuration, fields | Stateless — pure functions |
| **Scope** | Attached to a container | Available site-wide |
| **Source** | CMS, Apps, Custom Code | Velo files |

### Library structure

Each library exposes:

| Property | Description |
|----------|-------------|
| **name** | File/module name (e.g., `myFunctions`, `Formatting`) |
| **description** | Short description of the library's purpose |
| **functions** | Array of exported functions |

Each function has:

| Property | Description |
|----------|-------------|
| **name** | Function name (e.g., `formatDate()`, `calcDiscount()`) |
| **type** | Return type — determines binding compatibility |
| **parameters** | Optional — typed parameters, each independently bindable |
| **description** | What the function does |

### Function types

| Function type | Example | Bindable to |
|--------------|---------|-------------|
| **Returns a value** (string, number, boolean...) | `formatDate()`, `calcDiscount()`, `twoValuesConcat()` | Any property with a compatible type — same rules as context fields |
| **Performs an action** (void — no return value) | `goToNextState()`, `autoRotate()`, `addToCart()` | Event handler properties only (onClick, onTimeout, etc.) |

Both types can accept **parameters**. When a function with parameters is selected, each parameter becomes a sub-binding — connectable to a context field or a static value.

### Number of libraries

No limit. Each Velo file that follows the export pattern becomes a separate library in the binding dropdown.

### Open questions

- **Discovery:** How does the platform detect which Velo files are function libraries? Convention-based (specific folder/naming)? Explicit registration?
- **Typing:** How are parameter types and return types declared? JSDoc? TypeScript? A manifest file?
- **Scope:** Currently available site-wide. Should libraries support scoping to specific pages or sections?
- **Versioning:** What happens when a developer changes a function signature that's already bound to components?
