/**
 * Nav Bar Component
 * Custom navigation bar with safe area handling, back button, and title.
 * Reads system status bar height to position content below the notch.
 *
 * @example
 * <app-nav-bar title="Settings" showBack />
 *
 * @property {string} title - Navigation bar title text
 * @property {boolean} showBack - Show back arrow (default: true)
 * @property {boolean} transparent - Use transparent background
 */
Component({
  properties: {
    title: { type: String, value: '' },
    showBack: { type: Boolean, value: true },
    transparent: { type: Boolean, value: false },
  },

  data: {
    statusBarHeight: 0,
    navHeight: 44,
  },

  lifetimes: {
    attached() {
      const sysInfo = wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: sysInfo.statusBarHeight || 20,
      });
    },
  },

  methods: {
    goBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      }
    },
  },
});
