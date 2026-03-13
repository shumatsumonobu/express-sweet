import express from 'express';
/**
 * Configures HTTP request processing middleware on the Express application.
 *
 * Sets up the following middleware stack:
 * - **Morgan** for HTTP request logging (configured via `config/logging.js`)
 * - **JSON body parser** (`application/json`)
 * - **URL-encoded body parser** (`application/x-www-form-urlencoded`)
 * - **Cookie parser**
 * - **Static file serving** from the `public/` directory
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 * @example
 * ```js
 * // config/config.js - Body size limit
 * export default {
 *   max_body_size: '10mb'
 * };
 * ```
 * @example
 * ```js
 * // config/logging.js - Request logging
 * export default {
 *   format: 'dev',
 *   skip: (req, res) => req.path === '/health'
 * };
 * ```
 */
export default function parser(app: express.Express): Promise<void>;
