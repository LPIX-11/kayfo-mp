# Nav Bar

## Purpose

A custom navigation bar that handles status-bar safe-area insets, displays a configurable title, and provides an optional back button that calls `wx.navigateBack()`. Supports a transparent mode for hero/image pages.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `String` | `''` | Text displayed in the centre of the navigation bar. |
| `showBack` | `Boolean` | `true` | When `true`, renders a back arrow that navigates to the previous page. |
| `transparent` | `Boolean` | `false` | When `true`, applies a transparent background style to the bar. |

## Events

None (the back button navigates via `wx.navigateBack()` internally).

## Slots

None.

## Usage

```xml
<!-- WXML -->
<app-nav-bar title="My Page" />

<!-- Transparent nav bar without back button (e.g., home page) -->
<app-nav-bar title="Home" showBack="{{false}}" transparent="{{true}}" />
```

```json
{
  "usingComponents": {
    "app-nav-bar": "/components/ui/nav-bar/index"
  }
}
```

## Internal Behaviour

- On `attached`, the component reads `wx.getSystemInfoSync().statusBarHeight` and applies it as top padding so the bar sits below the device status bar.
- The fixed nav content height is `44px`.

## See Also

- [Components Overview](../../../docs/08-components-overview.md)
- [Recipes: Adding a New Component](../../../docs/14-recipes.md#adding-a-new-component)
