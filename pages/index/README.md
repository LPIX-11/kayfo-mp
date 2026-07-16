# Home Page

**Route:** `pages/index/index`

The entry page of the application. Demonstrates core boilerplate patterns.

## What It Demonstrates

1. **initPromise pattern** — `await app.globalData.initPromise` in `onLoad()`
2. **Manual EventBus subscription** — Direct `Bus.onState()` call with cleanup in `onUnload()`
3. **Component usage** — Nav bar, button, modal, typography, card
4. **Navigation** — `wx.navigateTo` to the demo page

## Data Flow

```
onLoad()
  └─► await initPromise
  └─► Bus.getState(USER_DATA) → setData({ userName })
  └─► Bus.onState(USER_DATA, callback) → live updates
onUnload()
  └─► unsubscribe from EventBus
```

## Components Used

Registered in `index.json`:
- `app-nav-bar` — Custom navigation bar
- `app-button` — Action buttons
- `app-modal` — Dialog overlay
- `app-typography` — Styled text
- `app-card` — Content container

## See Also

- [Demo Page](../demo/README.md) — Shows the helper-based subscription pattern
- [App Lifecycle](../../docs/04-app-lifecycle.md) — initPromise explanation
- [EventBus Guide](../../docs/05-eventbus-guide.md) — Subscription patterns
