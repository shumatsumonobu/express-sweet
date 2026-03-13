import express from 'express';
import {globSync} from 'glob';
import multer from 'multer';
import * as utils from '~/utils';
// @ts-ignore - router/lib/layer has no type definitions
import Layer from 'router/lib/layer';

/**
 * Configures file-based URL routing on the Express application.
 *
 * Scans the `routes/` directory (or the directory specified by `router_dir` in `config/config.js`)
 * and automatically maps each file to a URL endpoint based on its path:
 * - `routes/user.js` → `/user`
 * - `routes/api/users.js` → `/api/users`
 *
 * Also injects Multer middleware for `multipart/form-data` handling based on `config/upload.js`.
 * If `default_router` is configured, that route also handles the root URL (`/`).
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 * @example
 * ```js
 * // routes/user.js → responds to /user
 * import {Router} from 'express';
 * const router = Router();
 * router.get('/', (req, res) => res.json({name: 'Alice'}));
 * export default router;
 * ```
 * @example
 * ```js
 * // config/config.js - Set default route
 * export default {
 *   default_router: '/home'
 * };
 * ```
 */
export default async function router(app: express.Express): Promise<void> {
  const appConfig = await utils.loadAppConfig();
  const uploadConfig = await utils.loadUploadConfig();

  // Scan the routes directory and map each file to a URL endpoint
  for (const filePath of globSync(`${appConfig.router_dir}/**/*.js`, {nodir: false})) {
    const {default: routeModule} = await import(filePath);

    // Extract subdirectory and filename from the route file path
    // e.g., "/routes/api/users.js" → subDir="/api", filename="users"
    const pathMatch = filePath.match(/\/routes(?:(\/..*))?\/(..*)\.js/);
    if (!pathMatch)
      continue;

    const [, subDir, filename] = pathMatch;

    // Build the route URL from subdirectory and filename
    // e.g., subDir="/api" + filename="users" → "/api/users"
    const routeUrl = subDir ? `${subDir}/${filename.toLowerCase()}` : `/${filename.toLowerCase()}`;
    if (process.env.SWEET_DEBUG)
      console.log(`[Sweet] Mapping URL: ${routeUrl}`);

    // Inject multer middleware into each route's middleware stack
    // to handle multipart/form-data requests (file uploads, form submissions)
    const layers = (routeModule as any).stack;
    if (Array.isArray(layers)) {
      for (const layer of layers) {
        if (!layer.route || !Array.isArray(layer.route.stack))
          continue;

        // Build a middleware that detects multipart/form-data and applies multer
        const multipartHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
          // Skip non-multipart requests
          const contentType = req.get('Content-Type') || '';
          if (!contentType.includes('multipart/form-data'))
            return next();

          if (process.env.SWEET_DEBUG)
            console.log(`[Sweet] Processing multipart/form-data request: ${req.method} ${req.path}`);

          // When upload config is disabled, parse multipart body without file handling
          if (!uploadConfig.enabled) {
            if (process.env.SWEET_DEBUG)
              console.log('[Sweet] Upload config disabled, using multer().none()');

            return multer().none()(req, res, (err: any) => {
              if (err) {
                console.error('[Sweet] Multipart/form-data request error:', err);
                return next(err);
              }
              next();
            });
          }

          // Resolve custom upload middleware from config, or fall back to none()
          const customMiddleware = uploadConfig.resolve_middleware(req, multer);
          const resolvedMiddleware = customMiddleware || multer().none();

          if (process.env.SWEET_DEBUG)
            console.log(`[Sweet] Applying multer middleware: ${customMiddleware ? 'custom' : 'none()'}`);

          resolvedMiddleware(req, res, (err: any) => {
            if (err) {
              console.error('[Sweet] Multipart/form-data request error:', err);
              return next(err);
            }
            next();
          });
        };

        // Wrap in a Layer and prepend to the route's middleware stack
        const multipartLayer = Layer('/', {}, multipartHandler);
        multipartLayer.method = undefined; // applies to all HTTP methods
        layer.route.stack.unshift(multipartLayer);
      }
    }

    app.use(routeUrl, routeModule);

    // Also mount on root URL if this is the configured default router
    if (routeUrl === appConfig.default_router)
      app.use('/', routeModule);
  }
}
