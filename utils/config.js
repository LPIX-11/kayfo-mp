// ============================================================================
// ENVIRONMENT CONFIGURATION
// Switch ENV to change target API environment
// ============================================================================

const ENV = 'development'; // 'development' | 'production'

const CONFIG = {
  development: {
    ASSETS_URL: 'https://api.example.com/assets',
    BASE_URL: 'http://localhost:3000/api',
    CLIENT_ID: 'your-client-id',
    CLIENT_SECRET: 'your-client-secret',
    GRANT_TYPE: 'client_credentials',
    AUTH_URL: '/oauth/token',

    // --- Kayfo integration ---------------------------------------------------
    // The game is served through the Orange Sonatel Apigee gateway (not
    // play.kayfo.games directly), so web-view traffic is host-proxied/whitelisted.
    // buildGameUrl() appends the game's `path` to this base.
    KAYFO_PLAY_HOST: 'https://api.sandbox.orange-sonatel.com/api/productOrdering/v1/providers/miniapp/kayfo/v1',
    // Portal / brand site.
    KAYFO_PORTAL_HOST: 'https://www.kayfo.games',
  },
  production: {
    ASSETS_URL: 'https://api.example.com/assets',
    BASE_URL: 'https://api.example.com',
    CLIENT_ID: 'your-client-id',
    CLIENT_SECRET: 'your-client-secret',
    GRANT_TYPE: 'client_credentials',
    AUTH_URL: '/oauth/token',

    // TODO: swap for the production Apigee gateway when available.
    KAYFO_PLAY_HOST: 'https://api.sandbox.orange-sonatel.com/api/productOrdering/v1/providers/miniapp/kayfo/v1',
    KAYFO_PORTAL_HOST: 'https://www.kayfo.games',
  },
};

export const config = CONFIG[ENV];

/**
 * Business domains that MUST be added to the TCMPP mini-app's web-view
 * allow-list (业务域名 / webview whitelist) before the game will load in a
 * production build. In TCMPP DevTools this check is bypassed while
 * `project.config.json -> setting.urlCheck` is `false`.
 */
export const KAYFO_WEBVIEW_DOMAINS = [
  // Game is now served through the Apigee gateway — this is the only host the
  // web-view hits for game HTML + all relative assets.
  'https://api.sandbox.orange-sonatel.com',
  // Rewarded-ad provider still loaded via absolute URLs inside the game build
  // (Google AdSense adBreak) — these bypass the proxy, so whitelist or strip them:
  'https://pagead2.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
];
