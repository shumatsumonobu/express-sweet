/**
 * Express middleware components for Express Sweet.
 *
 * Provides a collection of middleware functions that handle various aspects of Express applications
 * including CORS, authentication, view templating, error handling, and environment setup.
 * These middleware are automatically mounted by the main mount function.
 *
 * @example
 * ```js
 * // Manual middleware mounting (usually not needed)
 * import * as expx from 'express-sweet';
 *
 * const app = express();
 * expx.middleware.globals();
 * await expx.middleware.env();
 * await expx.middleware.parser(app);
 * ```
 */
/**
 * Cross-Origin Resource Sharing (CORS) middleware
 */
export { default as cors } from './cors';
/**
 * Environment variables loading middleware
 */
export { default as env } from './env';
/**
 * Global variables setup middleware
 */
export { default as globals } from './globals';
/**
 * HTTP parsing and static file serving middleware
 */
export { default as parser } from './parser';
/**
 * Local template variables middleware
 */
export { default as locals } from './locals';
/**
 * Handlebars view engine middleware
 */
export { default as views, mountBeforeRender } from './views';
/**
 * Error handling middleware
 */
export { default as errorHandler } from './error';
/**
 * Passport.js authentication middleware
 */
export { default as auth } from './auth';
/**
 * File-based routing middleware
 */
export { default as router } from './router';
