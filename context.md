# Context — Product Definition

## What is a Context?

A context is a **data source definition** that gets attached to a section on the page, making its fields available for binding to the components inside that section.

A context is **not the data itself** — it describes what data is available: its fields, types, and structure. The actual values are provided at runtime by the context provider (an app, CMS collection, custom code, etc.).

### Technical foundation

The concept is built on top of **React Context** — the same scoping and inheritance model applies. A context provider wraps a container (page, section, or component), and all descendants can consume its values. This means context naturally flows downward through the component tree, and a child container can access contexts from all of its ancestors.

Technically, a context provider is a **logical component** — it has no UI of its own. It exposes a React hook (e.g. `useWeatherContext()`) that child components call to access the context values. The provider has two bundles:
- **Client bundle** — runs at runtime, fetches real data
- **Editor bundle** (optional) — provides mock/sample data for the editor canvas

All context items (fields, functions, metadata) live in a single flat `context.items` map. The categorization into Fields, Item Actions, Context Actions, Metadata, and System Fields is a **product-level UX grouping** — not a technical separation.

---

## Scoping

Contexts are **scoped to containers**. A container can be a **page**, a **section**, or any other **container component** (e.g. a Box or a Multi-State Box). When a context is attached to a container, all components inside it can bind their properties to the context's fields. Components outside the container cannot access it.

Contexts **inherit downward** — a context attached to a page is available to all sections and components within that page. A context attached to a section is available to all components within that section.

Multiple contexts can be attached to the same container. A component can bind different properties to different contexts — for example, a Text component binding its `Value` to one context's field and its `Link` to another.

---

## Context Types

| Type | Source | Data shape | Example |
|------|--------|-----------|---------|
| **CMS** | Wix CMS collections | `list` — an array of items with shared fields | Articles, My Team, Categories |
| **Custom** | Developer-defined via custom code | `object` — a single record with known fields | Weather App, UpcomingClassCountdown |
| **Apps** | Wix apps (Stores, Bookings, etc.) | `list` or `object` | Stores · Current Item, Stores · Locations |
| **Dynamic Page** | Comes with the dynamic page, cannot be removed | `object` | The current item this page represents (e.g. a specific product, article, or team member) |
| **System** | Always available at the page level, no user action needed | `object` | Identity (logged-in user info) |

### System Context

System contexts are **always available** — the user doesn't need to add them. They appear at the page level automatically and provide platform-level data that any component on the page can bind to.

Examples: Identity (current user info — name, email, login state, role).

**Open question (TBD):** Should system context configuration be **per page** or **per site**? Need to explore use cases — e.g. does a user ever need different Identity settings on different pages, or is it always site-wide?

### Dynamic Page Context

A dynamic page is a page template that renders a different item based on the URL. The **Dynamic Page context** comes with the dynamic page and represents the current item being displayed.

For example, a "Product Item" dynamic page displays a specific product. When a visitor navigates to `/products/sunny-day-tee`, the Dynamic Page context provides that product's fields (name, description, image, price, etc.) to all components on the page.

The data source doesn't have to be CMS — it can come from any provider (an app, an external API, etc.).

**Dual nature:**
- **For components** (binding): behaves as `object` — always a single item. Components bind to fields like `name`, `price`, `image` and receive one value.
- **For page generation** (configuration): behaves as a filtered list. The user can define filters that determine which items from the source get their own page. Items that don't pass the filter won't have a page generated for them.

The filter is a **gate at the page-generation level** — it decides which items get a page at all, not which item is shown on a given page. Once a visitor is on the page, the context always resolves to exactly one item.

Key characteristics:
- Comes with the dynamic page — cannot be removed by the user
- Type `object` for binding — components always see a single item
- Has list-level filter configuration — controls which items get their own page
- The current item is determined by the URL at runtime

---

## Context Structure

Every context can expose both **data** and **functions**:

- **Data fields** — values the user can bind to component properties (e.g. `city`, `temperature`, `image`)
- **Functions** — actions the user can bind to component events (e.g. button click)

A list-type context can expose up to five layers of bindable content:

| Layer | What it contains | Scope | Example |
|-------|-----------------|-------|---------|
| **Fields** | Data values from the source | Per item | `name`, `description`, `icon`, `articleCount` |
| **Item Actions** | Functions that operate on a specific item | Per item (inside a repeater) | `Navigate to item page`, `Open in editor` |
| **Context Actions** | Functions that operate on the collection as a whole | Collection level | `Apply filters`, `Reset filters`, `Sort`, `Load more`, `Refresh data` |
| **Metadata** | Computed read-only values about the current state of the context | Collection level | `Total items`, `Items on page`, `Is loading`, `Active filter count` |
| **System Fields** | Auto-generated fields managed by the platform | Per item | `_id`, `_createdDate`, `_updatedDate`, `_owner` |

An object-type context typically exposes fields and item-level actions only.

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
| **Fields** | Bindable data points per item |
| **Item Actions** | Functions that operate on a specific item (e.g. navigate, edit) |
| **Context Actions** | Functions that operate on the collection (e.g. filter, sort, load more) |
| **Metadata** | Computed values about the context state (e.g. total items, is loading) |
| **System Fields** | Platform-managed fields (e.g. `_id`, `_createdDate`, `_owner`) |

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

Binding is the act of connecting a component property to a context field. When bound:

- The canvas shows a preview using the field's `sample` value
- At runtime, the live data value from the context provider replaces the preview
- A binding chip appears on the component showing the context icon and field name

### Binding Compatibility

Not every field can bind to every property. The system checks type compatibility:

| Property type | Compatible field types |
|---------------|----------------------|
| `string` | `string`, `number`, `dateTime`, `enum` |
| `image` | `image` |
| `url` | `url` |
| `boolean` | `boolean` |
| `action` | Functions only |
| `list` | `array` |
| `states` | `states`, `enum` |

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
- Type badge (`object` / `list`)
- Source label (e.g. "from Custom Code")
- Field usage count (e.g. "2/9 fields connected")
- Configuration settings (if available)

### Binding Dropdown
When binding a property, only fields from contexts attached to the component's parent section are shown. Fields are filtered by type compatibility.

### Canvas Pills
Bound components show a pill with the context icon and field name, providing at-a-glance visibility of what's connected to what.
