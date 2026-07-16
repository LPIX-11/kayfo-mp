/**
 * Input Component
 * Text input with optional trailing icon, date picker mode, and search
 * results dropdown. Supports multiple slots for flexible layout.
 *
 * @example
 * <app-input
 *   value="{{ query }}"
 *   placeholder="Search..."
 *   icon="search"
 *   bind:input="onInput"
 *   bind:iconTap="onSearch"
 * />
 *
 * @property {string} value - Current input value
 * @property {string} placeholder - Placeholder text
 * @property {'text'|'number'|'idcard'|'digit'} type - Input type (default: 'text')
 * @property {boolean} readonly - Disable editing
 * @property {string} containerClass - Wrapper CSS class
 * @property {string} icon - Icon name for trailing action
 * @property {boolean} showResults - Show search results dropdown
 * @property {string} resultClass - Results dropdown CSS class
 * @property {Array} results - Search result items
 *
 * @fires input - On text input (detail: { value })
 * @fires iconTap - When trailing icon is tapped
 * @fires selectResult - When a search result is selected
 * @fires dateChanged - On date picker change (detail: { value })
 */
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    value: String,
    placeholder: String,
    type: { type: String, value: 'text' },
    readonly: { type: Boolean, value: false },
    containerClass: String,
    icon: String,
    showResults: { type: Boolean, value: false },
    resultClass: String,
    results: { type: Array, value: [] }
  },
  methods: {
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value });
    },
    onIconTap() {
      this.triggerEvent('iconTap');
    },
    onSelectResult(e) {
      // delegate to parent, pass data attributes
      this.triggerEvent('selectResult', e);
    },
    onDateChange(e) {
      this.triggerEvent('dateChanged', { value: e.detail.value });
    }
  }
});