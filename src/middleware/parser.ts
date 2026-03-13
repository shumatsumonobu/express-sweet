import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import loadAppConfig from '~/utils/loadAppConfig';
import loadLoggingConfig from '~/utils/loadLoggingConfig';

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
export default async function parser(app: express.Express): Promise<void> {
  const appConfig = await loadAppConfig();
  const loggingConfig = await loadLoggingConfig();

  // Enable nested object/array parsing in query strings (e.g., ?filter[name]=value)
  app.set('query parser', 'extended');

  // HTTP request logging via Morgan (format and skip rules from config/logging.js)
  app.use(morgan(loggingConfig.format, {
    skip: loggingConfig.skip
  }));

  // Parse JSON request bodies (Content-Type: application/json)
  app.use(express.json({
    limit: appConfig.max_body_size,
  }));

  // Parse URL-encoded request bodies (Content-Type: application/x-www-form-urlencoded)
  app.use(express.urlencoded({
    extended: true,
    limit: appConfig.max_body_size
  }));

  // Parse Cookie header into req.cookies
  app.use(cookieParser());

  // Serve static files from the public/ directory
  const publicDir = path.join(process.cwd(), 'public');
  app.use(express.static(publicDir));
}
