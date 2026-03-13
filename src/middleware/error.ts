import express from 'express';
import createError from 'http-errors';
import * as utils from '~/utils';

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
export default async function errorHandler(app: express.Express): Promise<void> {
  // Load basic configuration
  const appConfig = await utils.loadAppConfig();

  // Catch all unhandled routes as 404 errors
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404));
  });

  // Global error handler (must be defined last)
  app.use(async (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (appConfig.hook_handle_error)
      // Delegate error handling to custom hook function
      appConfig.hook_handle_error(error, req, res, next);
    else {
      // Log error to console
      console.error(error);

      // Send HTTP status code (404, 500, etc.) without body
      res.status(error.status||500).end();
    }
  });
}
