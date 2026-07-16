# Input

## Purpose

A versatile text input component that supports plain text entry and date-picker mode, with an optional trailing icon and a dropdown results panel. Internally uses `osn-icon` for icon rendering. Suitable for search bars, form fields, and date selectors.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `String` | `''` | Current input value (two-way via events). |
| `placeholder` | `String` | `''` | Placeholder text shown when the input is empty. |
| `type` | `String` | `'text'` | Input mode -- `'text'` for a standard text field or `'date'` for a native date picker. |
| `readonly` | `Boolean` | `false` | Makes the input non-editable. |
| `containerClass` | `String` | `''` | Additional CSS class(es) on the outer wrapper. |
| `icon` | `String` | `''` | Icon name passed to `osn-icon`. When set, an icon button is rendered to the right of the input. In `'date'` mode the icon also wraps a date picker. |
| `showResults` | `Boolean` | `false` | When `true`, displays the results dropdown panel below the input. |
| `resultClass` | `String` | `''` | CSS class for the results dropdown container. |
| `results` | `Array` | `[]` | Array of result items (rendered via the `result` slot). |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `input` | `{ value }` | Fired on every keystroke in `text` mode. |
| `iconTap` | -- | Fired when the trailing icon is tapped. |
| `selectResult` | (delegated event) | Fired when a result item inside the `result` slot is selected. |
| `dateChanged` | `{ value }` | Fired when the date picker value changes (in `date` mode or via the icon date picker). |

## Slots

| Slot | Description |
|------|-------------|
| `result` | Custom template for each item in the results dropdown. |

## Usage

```xml
<!-- WXML: text input with icon -->
<app-input
  value="{{ query }}"
  placeholder="Search..."
  icon="search"
  bind:input="onSearch"
  bind:iconTap="onIconTap"
/>

<!-- WXML: date picker -->
<app-input
  type="date"
  value="{{ selectedDate }}"
  placeholder="Select a date"
  bind:dateChanged="onDateChange"
/>

<!-- WXML: with results dropdown -->
<app-input
  value="{{ query }}"
  placeholder="Type to search"
  showResults="{{ results.length > 0 }}"
  bind:input="onSearch"
  bind:selectResult="onSelectResult"
>
  <view slot="result" wx:for="{{ results }}" wx:key="id" data-item="{{ item }}" bindtap="onSelectResult">
    {{ item.label }}
  </view>
</app-input>
```

```json
{
  "usingComponents": {
    "app-input": "/components/ui/input/index"
  }
}
```

## See Also

- [Icon component](../icons/base/README.md) -- used internally for the trailing icon
- [Input Spinner component](../input-spinner/README.md) -- numeric stepper input
- [Components Overview](../../../docs/08-components-overview.md)
- [Recipes: Adding a New Component](../../../docs/14-recipes.md#adding-a-new-component)
