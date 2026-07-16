/**
 * Tab Bar Component
 * Horizontal tab switcher with active state tracking and customizable styling.
 * Supports multiple slots for tab content panels.
 *
 * @example
 * <app-tab-bar
 *   tabs="{{ [{ key: 'info', label: 'Info' }, { key: 'reviews', label: 'Reviews' }] }}"
 *   default="info"
 *   bind:changedActive="onTabChange"
 * />
 *
 * @property {Array<{key: string, label: string}>} tabs - Tab items
 * @property {string} default - Initial active tab key
 * @property {string} containerClass - Tabs wrapper CSS class
 * @property {string} itemContainerClass - Each tab item CSS class
 * @property {string} activeItemContainerClass - Active tab item CSS class
 *
 * @fires changedActive - On tab switch (detail: { key })
 */
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    default: {
      type: String,
      value: ''
    },
    containerClass: { // For the main tabs wrapper
      type: String,
      value: ''
    },
    itemContainerClass: { // For each tab item
      type: String,
      value: ''
    },
    activeItemContainerClass: { // For each active tab item
      type: String,
      value: ''
    }
  },
  data: {
    activeKey: ''
  },
  lifetimes: {
    attached() {
      const tabs = this.data.tabs;
      this.setData({
        activeKey: this.data.default || (tabs[0] ? tabs[0].key : '')
      });
    }
  },
  methods: {
    onTabClick(e) {
      const key = e.currentTarget.dataset.key;
      this.setData({ activeKey: key });
      this.triggerEvent('changedActive', { key });
    }
  }
});