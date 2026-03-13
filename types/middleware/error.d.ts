import express from 'express';
/**
 * Registers error handling middleware on the Express application.
 *
 * Catches unmatched routes as 404 errors and delegates all errors to a custom hook
 * (`hook_handle_error` in `config/config.js`) if configured, or responds with the
 * appropriate HTTP status code.
 *
 * This middleware must be mounted last (after all routes) to function correctly.
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 * @example
 * ```js
 * // Custom error handling in config/config.js
 * export default {
 *   hook_handle_error: (error, req, res, next) => {
 *     if (error.status === 404)
 *       res.render('error/404');
 *     else
 *       res.render('error/500');
 *   }
 * };
 * ```
 */
export default function errorHandler(app: express.Express): Promise<void>;
