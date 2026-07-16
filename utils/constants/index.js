// ============================================================================
// APPLICATION CONSTANTS
// Centralized configuration values - No magic numbers/strings
// ============================================================================

// ============================================================================
// ENVIRONMENT
// ============================================================================

/**
 * Development mode flag
 * @readonly
 * @type {boolean}
 */
export const __DEV__ = true; // Set to false for production

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * Local storage key names
 * @readonly
 * @enum {string}
 */
export const STORAGE_KEYS = {
  /** OAuth access token */
  ACCESS_TOKEN: 'app_access_token',

  /** Token expiry timestamp */
  TOKEN_EXPIRY: 'app_token_expiry',

  /** Cached user data */
  USER_DATA: 'app_user_data',
};

// ============================================================================
// AUTH CONFIGURATION
// ============================================================================

/**
 * Authentication constants
 * @readonly
 */
export const AUTH_CONFIG = {
  /** Refresh token before expiry (milliseconds) */
  REFRESH_BUFFER_MS: 5000,

  /** Default token expiry if not provided (seconds) */
  DEFAULT_EXPIRY_SEC: 200,

  /** OAuth2 grant type */
  GRANT_TYPE: 'client_credentials',
};

// ============================================================================
// HTTP CONFIGURATION
// ============================================================================

/**
 * HTTP client constants
 * @readonly
 */
export const HTTP_CONFIG = {
  /** Default request timeout (milliseconds) */
  DEFAULT_TIMEOUT_MS: 30000,

  /** Session ID prefix for tracking */
  SESSION_PREFIX: 'APP',

  /** Custom header for session tracking */
  HEADER_CLIENT_REF: 'X-Client-Ref',

  /** Custom header for request tracking */
  HEADER_REQUEST_ID: 'X-Request-Id',
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * User-facing error messages
 * @readonly
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Connection error. Please try again.',
  AUTH_FAILED: 'Authentication failed.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  TIMEOUT: 'Request timed out. Please try again.',
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

/**
 * User-facing success messages
 * @readonly
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Saved successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  SUBMITTED: 'Submitted successfully.',
};
