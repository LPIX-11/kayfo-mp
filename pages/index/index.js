// ============================================================================
// KAYFO PLAY — HOME (mini game portal)
// Lists the Kayfo H5 games and launches them inside a native web-view page.
// ============================================================================

import { GAMES } from '../../utils/games';

const app = getApp();

Page({
  data: {
    games: GAMES,
    isLoading: true,
  },

  async onLoad() {
    // Non-blocking: wait for app init, but the catalog is static so the
    // portal is usable immediately.
    await app.globalData.initPromise;
    this.setData({ isLoading: false });
  },

  /**
   * Launch a game: navigate to the web-view page, passing the game id.
   * @param {WechatMiniprogram.TouchEvent} e
   */
  handlePlay(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) return;
    // Card tap and the inner button both fire this; guard against a
    // double navigateTo (which would stack the game page twice).
    if (this._navigating) return;
    this._navigating = true;
    wx.navigateTo({
      url: `/pages/game/index?id=${id}`,
      complete: () => { this._navigating = false; },
    });
  },
});
