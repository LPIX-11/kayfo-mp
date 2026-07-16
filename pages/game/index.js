// ============================================================================
// KAYFO PLAY — GAME (web-view host)
// Hosts a Kayfo PlayCanvas H5 game inside a mini-app <web-view>.
//
// Integration notes
// -----------------
// • The game build is a self-contained PlayCanvas/WebGL app. It sends no
//   X-Frame-Options / CSP, so it renders inside a web-view unmodified.
// • Served through the Orange Sonatel Apigee gateway (see utils/config.js).
// • The build speaks a native-webview bridge: it probes
//   `window.flutter_inappwebview.callHandler(fn, placementId)` to REQUEST a
//   rewarded ad and calls back `window.rewardReceived(...)`. A mini-app can't
//   inject JS into a web-view; the seam is `wx.miniProgram.postMessage(...)`
//   delivered to `onMessage` below. See README.
// ============================================================================

import { getGameById, buildGameUrl } from '../../utils/games';

Page({
  data: {
    url: '',
    error: false,
    errMsg: '',    // human-readable reason surfaced on the error screen
    retries: 0,    // bumped to force the web-view to re-mount on retry
    loaded: false, // set once the game document has loaded at least once
  },

  onLoad(query) {
    const game = getGameById(query.id) || getGameById('afrokick-tournament');

    if (!game) {
      this.setData({ error: true, errMsg: 'Unknown game id: ' + (query.id || '(none)') });
      return;
    }

    this._baseUrl = buildGameUrl(game);
    wx.setNavigationBarTitle({ title: game.title });
    this.setData({ url: this._baseUrl });
  },

  /**
   * Messages posted by the game via `wx.miniProgram.postMessage`.
   * This is where rewarded-ad requests would land.
   * @param {WechatMiniprogram.WebViewMessage} e
   */
  onMessage(e) {
    const messages = (e && e.detail && e.detail.data) || [];
    console.log('[game] web-view message(s):', messages);
  },

  onWebLoad(e) {
    console.log('[game] web-view LOADED:', e && e.detail);
    // The game document is up. Any error after this is a secondary resource
    // (e.g. a blocked ad domain) and must NOT tear down the running game.
    this.setData({ loaded: true, error: false, errMsg: '' });
  },

  /**
   * web-view reported an error. Surface the exact offending URL + message.
   *
   * Not every error is fatal: this host domain-checks resources loaded *inside*
   * the web-view, so a blocked ad/analytics domain fires here even though the
   * game itself loaded fine. If the document already loaded, we keep the game
   * running and just log/toast the blocked resource instead of showing the
   * fatal error screen.
   */
  onWebError(e) {
    const detail = (e && e.detail) || {};
    const blockedUrl = detail.url || detail.fullUrl || detail.src || '';
    const errMsg =
      (detail.errMsg || 'web-view error') + (blockedUrl ? '\n→ ' + blockedUrl : '');
    console.error('[game] web-view error. full detail:', JSON.stringify(detail));

    if (this.data.loaded) {
      // Non-fatal: the game is already running. Just surface what got blocked.
      wx.showToast({ title: 'Blocked: ' + (blockedUrl || detail.errMsg || 'resource'), icon: 'none', duration: 3000 });
      return;
    }

    // Fatal: the document itself never loaded.
    this.setData({ error: true, errMsg });
  },

  /** Copy the URL so it can be pasted into mobile Safari to isolate the cause. */
  handleCopyUrl() {
    wx.setClipboardData({
      data: this._baseUrl || this.data.url || '(no url)',
      success: () => wx.showToast({ title: 'URL copied', icon: 'none' }),
    });
  },

  /** Re-mount the web-view with a cache-busting param so it truly reloads. */
  handleRetry() {
    const n = this.data.retries + 1;
    const sep = this._baseUrl.indexOf('?') === -1 ? '?' : '&';
    this.setData({
      error: false,
      errMsg: '',
      loaded: false,
      retries: n,
      url: this._baseUrl + sep + '_r=' + n,
    });
  },

  handleBack() {
    wx.navigateBack({ delta: 1 });
  },
});
