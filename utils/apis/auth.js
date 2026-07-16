// ============================================================================
// AUTHENTICATION
// OAuth2 token management with caching and auto-refresh
// ============================================================================

import { httpClient } from './http.js';
import { config } from '../config.js';
import { STORAGE_KEYS, AUTH_CONFIG } from '../constants/index.js';

/**
 * Authenticates with the backend API using OAuth2 client credentials.
 * Caches the token in local storage and refreshes it before expiry.
 *
 * @returns {Promise<string>} Access token
 *
 * @example
 * await authenticate();
 * // httpClient now has the token set - make API calls normally
 * const res = await httpClient.get('/api/data');
 */
export async function authenticate() {
  const now = Date.now();
  const storedToken = wx.getStorageSync(STORAGE_KEYS.ACCESS_TOKEN);
  const storedExp = wx.getStorageSync(STORAGE_KEYS.TOKEN_EXPIRY);

  // Return cached token if still valid
  if (storedToken && storedExp && now < storedExp) {
    httpClient.setToken(storedToken);
    return storedToken;
  }

  // Request a new token
  const body = `grant_type=${config.GRANT_TYPE}&client_id=${config.CLIENT_ID}&client_secret=${config.CLIENT_SECRET}`;

  const res = await new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: `${config.BASE_URL}${config.AUTH_URL}`,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: body,
      success: ({ data, statusCode }) => {
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Auth failed: ${statusCode}`));
        }
      },
      fail: reject,
    });
  });

  const { access_token, expires_in } = res;
  const expiresInSec = expires_in || AUTH_CONFIG.DEFAULT_EXPIRY_SEC;
  const expiry = now + (expiresInSec * 1000) - AUTH_CONFIG.REFRESH_BUFFER_MS;

  // Cache token
  wx.setStorageSync(STORAGE_KEYS.ACCESS_TOKEN, access_token);
  wx.setStorageSync(STORAGE_KEYS.TOKEN_EXPIRY, expiry);
  httpClient.setToken(access_token);

  return access_token;
}
