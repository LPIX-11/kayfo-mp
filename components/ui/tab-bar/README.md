# Tab Bar

## Purpose

A tabbed navigation component that renders a horizontal row of tabs and shows/hides corresponding content panels. Each tab is defined as an object with a `key`, a `slotName` for the tab label, and a `contentSlot` for the tab's body content. Uses `multipleSlots` to support the dynamic named-slot pattern.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tabs` | `Array` | `[]` | Array of tab definitions. Each object should have `{ key, slotName, contentSlot }` where `key` is the unique identifier, `slotName` is the named slot for the tab header, and `contentSlot` is the named slot for the tab content panel. |
| `default` | `String` | `''` | The `key` of the initially active tab. Falls back to the first tab's `key` if not specified. |
| `containerClass` | `String` | `''` | CSS class(es) on the tabs header row wrapper. |
| `itemContainerClass` | `String` | `''` | CSS class(es) applied to each tab item in the header. |
| `activeItemContainerClass` | `String` | `''` | CSS class(es) applied to the currently active tab item in the header. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `changedActive` | `{ key }` | Fired when the user taps a tab. `key` is the selected tab's key. |

## Slots

| Slot | Description |
|------|-------------|
| `<tab.slotName>` | Named slot for each tab's header label (one per tab, matching the `slotName` in the `tabs` array). |
| `<tab.contentSlot>` | Named slot for each tab's body content (one per tab, matching the `contentSlot` in the `tabs` array). |

## Usage

```xml
<!-- WXML -->
<app-tab-bar
  tabs="{{ tabs }}"
  default="overview"
  activeItemContainerClass="tab-active"
  bind:changedActive="onTabChange"
>
  <!-- Tab headers -->
  <view slot="tab-overview">Overview</view>
  <view slot="tab-details">Details</view>

  <!-- Tab content panels -->
  <view slot="content-overview">
    <text>Overview content goes here.</text>
  </view>
  <view slot="content-details">
    <text>Details content goes here.</text>
  </view>
</app-tab-bar>
```

```js
// JS
Page({
  data: {
    tabs: [
      { key: 'overview', slotName: 'tab-overview', contentSlot: 'content-overview' },
      { key: 'details', slotName: 'tab-details', contentSlot: 'content-details' }
    ]
  },
  onTabChange(e) {
    console.log('Active tab:', e.detail.key);
  }
});
```

```json
{
  "usingComponents": {
    "app-tab-bar": "/components/ui/tab-bar/index"
  }
}
```

## See Also

- [Components Overview](../../../docs/08-components-overview.md)
- [Recipes: Adding a New Component](../../../docs/14-recipes.md#adding-a-new-component)
