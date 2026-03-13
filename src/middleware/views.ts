import express from 'express';
import {engine} from 'express-handlebars';
import * as helpers from '~/helpers';
import * as utils from '~/utils';

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
export default async function views(app: express.Express): Promise<void> {
  // Load view configuration
  const viewConfig = await utils.loadViewConfig();

  // Configure Handlebars template engine with custom helpers
  app.engine(viewConfig.extension || '.hbs', engine({
    partialsDir: viewConfig.partials_dir,
    layoutsDir: viewConfig.layouts_dir,
    defaultLayout: viewConfig.default_layout,
    extname: viewConfig.extension,
    // Flatten all helper modules into a single helpers object
    helpers: Object.entries(helpers).reduce((merged, [_, helperModule]) => {
      for (const [name, fn] of Object.entries(helperModule))
        merged[name] = fn;
      return merged;
    }, {} as Record<string, Handlebars.HelperDelegate>),
  }));
  app.set('view engine', viewConfig.extension || '.hbs');
  // Disable view caching for development (enables template hot-reloading)
  app.disable('view cache');
  app.set('views', viewConfig.views_dir);

  // NOTE: beforeRender mounting is deferred to after authentication middleware
  // to ensure req.user is available. See mountBeforeRender() called from auth.
}

/**
 * Mounts the `beforeRender` hook middleware from `config/view.js`.
 *
 * This is called after the authentication middleware to ensure `req.user`
 * is available in the hook. Supports both synchronous and async hook functions.
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 */
export async function mountBeforeRender(app: express.Express): Promise<void> {
  // Load view configuration
  const viewConfig = await utils.loadViewConfig();

  // Execute beforeRender hook before each request
  app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (viewConfig.beforeRender) {
      // Call beforeRender hook (handle both sync and async functions)
      if (utils.isAsyncFunction(viewConfig.beforeRender))
        await viewConfig.beforeRender(req, res);
      else
        viewConfig.beforeRender(req, res);
    }
    next();
  });
}
