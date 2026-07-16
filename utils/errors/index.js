// ============================================================================
// CUSTOM ERROR HIERARCHY
// Structured errors with status codes, error codes, and metadata.
// ============================================================================

/**
 * Base application error.
 * All custom errors extend this class for consistent structure.
 *
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error description
   * @param {Object} [options]
   * @param {number} [options.statusCode=500] - HTTP status code
   * @param {string} [options.code='APP_ERROR'] - Machine-readable error code
   * @param {Object} [options.metadata={}] - Additional context
   */
  constructor(message, { statusCode = 500, code = 'APP_ERROR', metadata = {} } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.metadata = metadata;
    this.timestamp = Date.now();
  }

  /**
   * Serializes the error for logging or API responses.
   * @returns {{ name: string, message: string, statusCode: number, code: string, metadata: Object, timestamp: number }}
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      metadata: this.metadata,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Validation error for invalid input, malformed data, or business rule violations.
 *
 * @extends AppError
 * @example
 * throw new ValidationError('Email is required', { field: 'email' });
 */
export class ValidationError extends AppError {
  /**
   * @param {string} message - What failed validation
   * @param {Object} [metadata] - Context (e.g. { field, expected, received })
   */
  constructor(message, metadata = {}) {
    super(message, { statusCode: 400, code: 'VALIDATION_ERROR', metadata });
  }
}

/**
 * Authorization error for authentication or permission failures.
 *
 * @extends AppError
 * @example
 * throw new AuthorizationError('Session expired');
 */
export class AuthorizationError extends AppError {
  /**
   * @param {string} message - What authorization failed
   * @param {Object} [metadata] - Context (e.g. { requiredRole, actualRole })
   */
  constructor(message, metadata = {}) {
    super(message, { statusCode: 401, code: 'AUTHORIZATION_ERROR', metadata });
  }
}

/**
 * Network error for connectivity, timeout, and HTTP transport failures.
 *
 * @extends AppError
 * @example
 * throw new NetworkError('Request timed out', { url: '/api/users', timeout: 5000 });
 */
export class NetworkError extends AppError {
  /**
   * @param {string} message - What network operation failed
   * @param {Object} [metadata] - Context (e.g. { url, method, timeout })
   */
  constructor(message, metadata = {}) {
    super(message, { statusCode: 0, code: 'NETWORK_ERROR', metadata });
  }
}

/**
 * Not-found error for missing resources.
 *
 * @extends AppError
 * @example
 * throw new NotFoundError('Product not found', { id: 'abc-123' });
 */
export class NotFoundError extends AppError {
  /**
   * @param {string} message - What resource was not found
   * @param {Object} [metadata] - Context (e.g. { id, type })
   */
  constructor(message, metadata = {}) {
    super(message, { statusCode: 404, code: 'NOT_FOUND', metadata });
  }
}

/**
 * External service error for third-party API or integration failures.
 *
 * @extends AppError
 * @example
 * throw new ExternalServiceError('Payment gateway unavailable', { service: 'stripe', statusCode: 503 });
 */
export class ExternalServiceError extends AppError {
  /**
   * @param {string} message - What external operation failed
   * @param {Object} [metadata] - Context (e.g. { service, endpoint, responseCode })
   */
  constructor(message, metadata = {}) {
    super(message, { statusCode: 502, code: 'EXTERNAL_SERVICE_ERROR', metadata });
  }
}
