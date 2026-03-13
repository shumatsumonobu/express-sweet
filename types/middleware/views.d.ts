import express from 'express';
/**
 * Configures the Handlebars view engine on the Express application.
 *
 * Registers all built-in Handlebars helpers, sets up layout/partial directories,
 * and configures the template file extension based on `config/view.js`.
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 * @example
 * ```js
 * // config/view.js
 * import path from 'node:path';
 *
 * export default {
 *   views_dir: path.join(process.cwd(), 'views'),
 *   partials_dir: path.join(process.cwd(), 'views/partials'),
 *   layouts_dir: path.join(process.cwd(), 'views/layout'),
 *   default_layout: path.join(process.cwd(), 'views/layout/default.hbs'),
 *   extension: '.hbs',
 *   beforeRender: (req, res) => {
 *     res.locals.siteName = 'My App';
 *   }
 * };
 * ```
 */
export default function views(app: express.Express): Promise<void>;
/**
 * Mounts the `beforeRender` hook middleware from `config/view.js`.
 *
 * This is called after the authentication middleware to ensure `req.user`
 * is available in the hook. Supports both synchronous and async hook functions.
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 */
export declare function mountBeforeRender(app: express.Express): Promise<void>;
