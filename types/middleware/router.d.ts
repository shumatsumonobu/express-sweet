import express from 'express';
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
export default function router(app: express.Express): Promise<void>;
