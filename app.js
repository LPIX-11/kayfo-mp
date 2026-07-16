// ============================================================================
// APP - Main Application Entry Point
// Handles initialization, user data, and global state management
// ============================================================================

import { Bus } from './utils/event/index';
import { nativeService } from './utils/apis/native';

/**
 * EventBus State Keys
 * Add your app-specific state keys here
 * @constant
 */
const STATE_KEYS = {
  APP_INITIALIZED: 'app.initialized',
  APP_LOADING: 'app.loading',
  NETWORK_CONNECTED: 'network.connected',
  NETWORK_TYPE: 'network.type',
  USER_DATA: 'user.data',
  USER_NAME: 'user.name',
};

/**
 * EventBus Event Names
 * Add your app-specific events here
 * @constant
 */
const EVENTS = {
  USER_LOADED: 'user.loaded',
  USER_NOT_FOUND: 'user.not_found',
  DATA_REFRESH: 'data.refresh',
  NETWORK_CHANGE: 'network.change',
  APP_ERROR: 'app.error',
};

App({
  /**
   * App launch handler
   * Stores initialization as a promise - pages await it when they need data
   * Pattern: non-blocking launch, no race conditions
   */
  onLaunch() {
    console.log('[App] Launching...');

    // Bus.setDebug(true);
    Bus.setState(STATE_KEYS.APP_LOADING, true);
    Bus.setState(STATE_KEYS.APP_INITIALIZED, false);

    // Force-update check: mini programs are cached on-device,
    // without this users can be stuck on stale versions indefinitely
    this.checkForUpdates();

    // Network status: track connectivity so pages/services can react
    this.setupNetworkListener();

    // Store init as a promise - pages can: await getApp().globalData.initPromise
    this.globalData.initPromise = this.initializeApp()
      .catch((error) => {
        console.error('[App] Initialization failed:', error);
      })
      .finally(() => {
        Bus.setState(STATE_KEYS.APP_LOADING, false);
      });
  },

  /**
   * Main initialization flow
   * Customize this for your app's startup sequence:
   * 1. Get user info from native layer
   * 2. Load user data from API
   * 3. Setup background tasks
   */
  async initializeApp() {
    // Step 1: Get user info from native layer (with retry + backoff)
    const userInfos = await nativeService.getUserInfos()
      .catch((error) => {
        console.warn('[App] getUserInfos failed:', error.message);
        return { msisdn: null, fullName: null };
      });

    const { msisdn, fullName } = userInfos;

    if (!msisdn) {
      console.log('[App] No user found, emitting user.not_found');
      Bus.emit(EVENTS.USER_NOT_FOUND);
      // Optionally redirect to onboarding:
      // wx.reLaunch({ url: '/pages/onboarding/index' });
      return;
    }

    // Store user info in EventBus
    Bus.setState(STATE_KEYS.USER_DATA, { msisdn, fullName });
    Bus.setState(STATE_KEYS.USER_NAME, fullName);
    console.log('[App] User:', fullName, '| ID:', msisdn);

    // Step 2: Load additional data (customize for your app)
    // await this.loadUserData(msisdn);

    // Mark app as initialized
    Bus.setState(STATE_KEYS.APP_INITIALIZED, true);
    Bus.emit(EVENTS.USER_LOADED);

    console.log('[App] Initialization complete');
  },

  /**
   * App show handler - resume background tasks
   */
  onShow() {
    if (Bus.getState(STATE_KEYS.APP_INITIALIZED)) {
      // Resume background tasks here (e.g., periodic data refresh)
    }
  },

  /**
   * App hide handler - cleanup timers and listeners
   */
  onHide() {
    // Cleanup background tasks here (e.g., clear intervals)
  },

  // ==========================================================================
  // ERROR HANDLERS
  // ==========================================================================

  /**
   * Global JS error handler
   * Catches uncaught synchronous errors from any page or component
   * @param {string} msg - Error message
   */
  onError(msg) {
    console.error('[App] Uncaught error:', msg);
    Bus.emit(EVENTS.APP_ERROR, { type: 'error', message: msg });
    // TODO: send to your error monitoring service
  },

  /**
   * Unhandled Promise rejection handler
   * Catches forgotten .catch() on Promises anywhere in the app
   * @param {Object} res - { reason, promise }
   */
  onUnhandledRejection(res) {
    console.error('[App] Unhandled rejection:', res.reason);
    Bus.emit(EVENTS.APP_ERROR, { type: 'unhandledRejection', reason: res.reason });
    // TODO: send to your error monitoring service
  },

  /**
   * 404 handler — user navigates to a page that doesn't exist
   * @param {Object} res - { path, query, isEntryPage }
   */
  onPageNotFound(res) {
    console.warn('[App] Page not found:', res.path);
    wx.redirectTo({ url: '/pages/index/index' });
  },

  // ==========================================================================
  // UPDATE MANAGER
  // ==========================================================================

  /**
   * Checks for a new version and, the moment one is ready, wipes all local
   * caches and force-restarts into it — no prompt.
   *
   * Why so aggressive: the mini-app package (incl. the baked-in web-view
   * business-domain whitelist) and any cached state/config are snapshotted
   * per version. If the device keeps stale caches, a re-published build won't
   * take effect and web-view loads keep failing with "not in domain list".
   * Forcing an update + full cache clean guarantees the new whitelist applies.
   */
  checkForUpdates() {
    if (!wx.getUpdateManager) return; // Not supported in all environments

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      console.log('[App] Update check — hasUpdate:', res && res.hasUpdate);
    });

    updateManager.onUpdateReady(() => {
      console.log('[App] New version ready — clearing caches and applying update');
      this.clearAllCaches();
      // Restart into the new version immediately. This is what makes a
      // re-published build (new domain whitelist, etc.) actually take effect.
      updateManager.applyUpdate();
    });

    updateManager.onUpdateFailed(() => {
      console.warn('[App] Update download failed — will retry on next launch');
    });
  },

  /**
   * Best-effort wipe of on-device caches so nothing stale survives across
   * versions (tokens, cached API responses, EventBus persisted state, and any
   * files written to the mini-app sandbox).
   */
  clearAllCaches() {
    try {
      wx.clearStorageSync();
    } catch (e) {
      console.warn('[App] clearStorageSync failed:', e);
    }

    // Clear the user file sandbox if the FS API is available.
    try {
      const fs = wx.getFileSystemManager && wx.getFileSystemManager();
      const dir = (wx.env && wx.env.USER_DATA_PATH) || '';
      if (fs && dir) {
        (fs.readdirSync(dir) || []).forEach((name) => {
          try { fs.unlinkSync(`${dir}/${name}`); } catch (_) { /* dirs/locked files: skip */ }
        });
      }
    } catch (e) {
      console.warn('[App] file cache clear skipped:', e);
    }
  },

  // ==========================================================================
  // NETWORK STATUS
  // ==========================================================================

  /**
   * Monitors network connectivity changes and stores status in EventBus.
   * Pages can subscribe to STATE_KEYS.NETWORK_CONNECTED to react to
   * online/offline transitions (e.g., show banner, queue requests).
   */
  setupNetworkListener() {
    // Get initial status
    wx.getNetworkType({
      success: (res) => {
        Bus.setState(STATE_KEYS.NETWORK_TYPE, res.networkType);
        Bus.setState(STATE_KEYS.NETWORK_CONNECTED, res.networkType !== 'none');
      },
    });

    // Listen for changes
    wx.onNetworkStatusChange((res) => {
      console.log('[App] Network changed:', res.networkType, '| connected:', res.isConnected);
      Bus.setState(STATE_KEYS.NETWORK_TYPE, res.networkType);
      Bus.setState(STATE_KEYS.NETWORK_CONNECTED, res.isConnected);
      Bus.emit(EVENTS.NETWORK_CHANGE, {
        type: res.networkType,
        connected: res.isConnected,
      });
    });
  },

  /**
   * Global data accessible via getApp().globalData
   */
  globalData: {
    /** @type {EventBus} Event bus for cross-page communication */
    eventBus: Bus,

    /** @type {Promise} Resolves when app initialization completes */
    initPromise: null,

    /** State keys for convenience */
    STATE_KEYS,

    /** Event names for convenience */
    EVENTS,
  },
});
