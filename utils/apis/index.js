// ============================================================================
// BACKEND API SERVICE
// Business logic layer for your application's API operations
// ============================================================================

import { httpClient } from './http.js';
import { authenticate } from './auth.js';
import { sculpt } from '../json-sculpt/sculpt.js';
// import { ExampleSchema } from '../mappers/example.sculpt.js';

// ============================================================================
// API ENDPOINTS - Define your API paths here
// ============================================================================

const ENDPOINTS = {
  // Example: USERS: '/users',
  // Example: PRODUCTS: '/products',
};

// ============================================================================
// BACKEND API CLASS
// ============================================================================

/**
 * Service for your application's API operations.
 * All methods automatically handle authentication.
 *
 * Pattern from eSIM:
 * 1. Call authenticate() before each request
 * 2. Use httpClient for HTTP operations
 * 3. Use sculpt for response transformation
 *
 * @class BackendAPI
 */
class BackendAPI {
  /** @type {import('./http').HttpClient} */
  #client = httpClient;

  // ==========================================================================
  // EXAMPLE: READ OPERATIONS
  // ==========================================================================

  /**
   * Example: Fetch a list of items from the API.
   * Replace this with your actual service methods.
   *
   * @async
   * @param {Object} [params] - Query parameters
   * @param {number} [params.limit=10] - Number of items to fetch
   * @param {number} [params.offset=0] - Pagination offset
   * @returns {Promise<{items: Array, total: number}>}
   *
   * @example
   * const { items, total } = await backendAPI.getItems({ limit: 5 });
   */
  async getItems(params = {}) {
    await authenticate();

    const query = {
      limit: params.limit || 10,
      offset: params.offset || 0,
    };

    const res = await this.#client.get(ENDPOINTS.ITEMS || '/items', { query });

    if (!res.success) {
      throw new Error(res.error?.message || 'Failed to fetch items');
    }

    // Example: Transform response with sculpt
    // const items = sculpt.data({ data: res.data.content, to: ExampleSchema });
    // return { items, total: res.data.total };

    return { items: res.data?.content || [], total: res.data?.total || 0 };
  }

  // ==========================================================================
  // EXAMPLE: WRITE OPERATIONS
  // ==========================================================================

  /**
   * Example: Create a new item.
   * Replace this with your actual service methods.
   *
   * @async
   * @param {Object} payload - Item data
   * @returns {Promise<Object>} Created item
   */
  async createItem(payload) {
    await authenticate();

    const res = await this.#client.post(ENDPOINTS.ITEMS || '/items', payload);

    if (!res.success) {
      const err = new Error(res.error?.message || 'Failed to create item');
      err.statusCode = res.status;
      throw err;
    }

    return res.data;
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Resets the HTTP client session.
   * Call when starting a new user flow.
   */
  resetSession() {
    this.#client.resetSession();
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/** @type {BackendAPI} */
export const backendAPI = new BackendAPI();

export { BackendAPI };
