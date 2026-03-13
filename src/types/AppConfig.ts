import express from 'express';

/**
 * Express Sweet application configuration interface.
 * Defines configuration options for environment, CORS, routing, error handling, and more.
 * @example
 * ```js
 * // config/config.js
 * export default {
 *   env_path: '.env',
 *   cors_enabled: true,
 *   max_body_size: '100kb',
 *   router_dir: 'routes',
 *   default_router: '/blog',
 *   rewrite_base_url: baseUrl => `${baseUrl}/admin`,
 *   is_ajax: req => /^\/api/.test(req.path),
 *   hook_handle_error: (error, req, res, next) => {
 *     if (error.status === 404) res.render('error/404');
 *     else res.render('error/500');
 *   }
 * };
 * ```
 */
export default interface AppConfig {
  /**
   * Environment variable file (.env) path, defaults to none (undefined).
   * @type {string}
   */
  env_path?: string,

  /**
   * CORS permission, defaults to disabled (false).
   * @type {boolean}
   */
  cors_enabled?: boolean,

  /**
   * Maximum body size you can request, defaults to `100kb`.
   * @type {string|number}
   */
  max_body_size?: string|number,

  /**
   * Absolute path to the router directory, defaults to `<application root directory>/routes`.
   * @type {string}
   */
  router_dir?: string,

  /**
   * The endpoint to run when the root URL is requested, defaults to none (undefined).
   * @type {string}
   */
  default_router?: string,

  /**
   * Hook to transform the auto-detected base URL (`app.locals.baseUrl`).
   * Receives `undefined` if URL construction fails (e.g., invalid Host header).
   * @type {(baseUrl: string | undefined) => string | undefined}
   * @example
   * ```js
   * rewrite_base_url: baseUrl => {
   *   if (!baseUrl) return 'http://localhost:3000'; // Fallback for undefined
   *   return `${baseUrl}/admin`;
   * }
   * ```
   */
  rewrite_base_url?: (baseUrl: string | undefined) => string | undefined,

  /**
   * Determines whether a request should be treated as an AJAX/API request.
   * Defaults to checking `req.xhr` (X-Requested-With: XMLHttpRequest).
   * Override this to customize AJAX detection (e.g., by URL prefix).
   * @type {(req: express.Request) => boolean}
   * @example
   * ```js
   * is_ajax: req => /^\/api/.test(req.path)
   * ```
   */
  is_ajax?: (req: express.Request) => boolean,

  /**
   * Custom error handler hook. Overrides the default behavior of responding with
   * `res.status(error.status || 500).end()`.
   * @type {(error: any, req: express.Request, res: express.Response, next: express.NextFunction) => void}
   * @example
   * ```js
   * hook_handle_error: (error, req, res, next) => {
   *   if (error.status === 404)
   *     res.render('error/404');
   *   else
   *     res.render('error/500');
   * }
   * ```
   */
  hook_handle_error?: (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => void,
}