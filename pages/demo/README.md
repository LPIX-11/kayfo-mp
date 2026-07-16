# Demo Page

**Route:** `pages/demo/index`

A comprehensive component showcase demonstrating all major boilerplate patterns.

## What It Demonstrates

### Stepper Component
- Multi-step indicator with previous/next navigation
- `bind:change` event handling
- Dynamic step display

### Button States
- Loading state with spinner (`isSubmitting`)
- Disabled state
- Bottom sheet trigger

### EventBus (Helper Pattern)
- `createPageHelpers()` for automatic state sync
- `subscribe()` / `loadInitial()` / `unsubscribe()` lifecycle
- Displays user name from shared state

### WXS Filters
- `<wxs>` import at top of WXML
- Live output of `formatDate`, `formatPrice`, `truncate`, `statusClass`, `capitalize`, `timeAgo`
- Sample data passed from page data

### Loading Behavior
- `loadingBehavior` mixin via `behaviors: [loadingBehavior]`
- "Load Data" button → `withLoading()` demo with success
- "Trigger Error" button → `withLoading()` demo with error state
- Reactive UI showing `isLoading`, `hasError`, `errorMessage`, `behaviorResult`

### Bottom Sheet Modal
- `app-modal` with `placement="bottom"`
- Header/content/footer slots
- Overlay close + button close

## Components Used

Registered in `index.json`:
- `app-nav-bar`, `app-button`, `app-modal`, `app-stepper`, `app-typography`, `app-card`

## See Also

- [Home Page](../index/README.md) — Shows the manual EventBus subscription pattern
- [Components Overview](../../docs/08-components-overview.md) — Full component catalog
- [WXS Filters Guide](../../docs/10-wxs-filters.md)
- [Behaviors Guide](../../docs/11-behaviors-guide.md)
