import express from 'express';
/**
 * Enables Cross-Origin Resource Sharing (CORS) on the Express application.
 *
 * When enabled via `cors_enabled: true` in `config/config.js`, this middleware sets
 * the appropriate CORS headers on all responses and handles preflight `OPTIONS` requests.
 * The `Access-Control-Allow-Origin` header is dynamically set to the request's origin.
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 * @example
 * ```js
 * // Enable CORS in config/config.js
 * export default {
 *   cors_enabled: true
 * };
 * ```
 */
export default function cors(app: express.Express): Promise<void>;
