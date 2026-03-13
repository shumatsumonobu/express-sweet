import express from 'express';
/**
 * Configures Passport.js authentication middleware with session management and route protection.
 *
 * Sets up username/password authentication using Passport's local strategy,
 * session storage (memory or Redis), and automatic route protection.
 * Unauthenticated users accessing protected routes are redirected to `failure_redirect`
 * (or receive a 401 response for AJAX requests).
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 * @example
 * ```js
 * // config/authentication.js
 * import UserModel from '../models/UserModel.js';
 *
 * export default {
 *   enabled: true,
 *   session_store: 'memory',
 *   username: 'email',
 *   password: 'password',
 *   success_redirect: '/',
 *   failure_redirect: '/login',
 *   authenticate_user: async (username, password, req) => {
 *     return UserModel.findOne({where: {email: username, password}, raw: true});
 *   },
 *   subscribe_user: async (id) => {
 *     return UserModel.findOne({where: {id}, raw: true});
 *   },
 *   allow_unauthenticated: ['/api/login'],
 *   expiration: 24 * 3600000,
 * };
 * ```
 */
export default function auth(app: express.Express): Promise<void>;
/**
 * User authentication service using Passport.js.
 *
 * Provides static methods for user authentication, logout, and redirect handling.
 * Works with Passport.js local strategy configured in authentication middleware.
 *
 * @example
 * ```js
 * // Basic authentication with JSON response
 * import {Router} from 'express';
 * import * as expx from 'express-sweet';
 *
 * const router = Router();
 * router.post('/api/login', async (req, res, next) => {
 *   const isAuthenticated = await expx.Authentication.authenticate(req, res, next);
 *   res.json({success: isAuthenticated});
 * });
 *
 * export default router;
 * ```
 * @example
 * ```js
 * // Authentication with redirect handling
 * import {Router} from 'express';
 * import * as expx from 'express-sweet';
 *
 * const router = Router();
 * router.post('/login', async (req, res, next) => {
 *   const isAuthenticated = await expx.Authentication.authenticate(req, res, next);
 *   if (isAuthenticated)
 *     await expx.Authentication.successRedirect(res);
 *   else
 *     await expx.Authentication.failureRedirect(req, res);
 * });
 *
 * export default router;
 * ```
 */
export declare class Authentication {
    /**
     * Authenticate user using username and password from request body.
     *
     * Uses Passport.js local strategy configured via authentication middleware.
     * Expects `req.body.username` and `req.body.password` to be present.
     *
     * @param {express.Request} req HTTP request object containing user credentials in body
     * @param {express.Response} res HTTP response object
     * @param {express.NextFunction} next Next middleware function
     * @returns {Promise<boolean>} Returns true if authentication successful, false otherwise
     * @example
     * ```js
     * import {Router} from 'express';
     * import * as expx from 'express-sweet';
     *
     * const router = Router();
     * router.post('/login', async (req, res, next) => {
     *   try {
     *     const isAuthenticated = await expx.Authentication.authenticate(req, res, next);
     *     if (isAuthenticated) {
     *       res.json({success: true, user: req.user});
     *     } else {
     *       res.status(401).json({success: false, message: 'Invalid credentials'});
     *     }
     *   } catch (error) {
     *     next(error);
     *   }
     * });
     *
     * export default router;
     * ```
     */
    static authenticate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<boolean>;
    /**
     * Log out the current user.
     *
     * Removes req.user property and clears the login session.
     * This method is synchronous and does not require await.
     *
     * @param {express.Request} req HTTP request object containing the user session
     * @example
     * ```js
     * import {Router} from 'express';
     * import * as expx from 'express-sweet';
     *
     * const router = Router();
     * router.get('/logout', (req, res) => {
     *   expx.Authentication.logout(req);
     *   res.redirect('/');
     * });
     *
     * export default router;
     * ```
     */
    static logout(req: express.Request): void;
    /**
     * Redirect to success page after successful authentication.
     *
     * Uses the URL specified in `success_redirect` option of config/authentication.js.
     * Should be called after successful authentication.
     *
     * @param {express.Response} res HTTP response object
     * @returns {Promise<void>}
     * @example
     * ```js
     * import {Router} from 'express';
     * import * as expx from 'express-sweet';
     *
     * const router = Router();
     * router.post('/login', async (req, res, next) => {
     *   const isAuthenticated = await expx.Authentication.authenticate(req, res, next);
     *   if (isAuthenticated) {
     *     await expx.Authentication.successRedirect(res);
     *   } else {
     *     await expx.Authentication.failureRedirect(req, res);
     *   }
     * });
     *
     * export default router;
     * ```
     */
    static successRedirect(res: express.Response): Promise<void>;
    /**
     * Redirect to failure page after authentication failure.
     *
     * Uses the URL specified in `failure_redirect` option of config/authentication.js.
     * Supports both static URLs and dynamic URL functions.
     * Should be called after failed authentication.
     *
     * @param {express.Request} req HTTP request object
     * @param {express.Response} res HTTP response object
     * @returns {Promise<void>}
     * @example
     * ```js
     * import {Router} from 'express';
     * import * as expx from 'express-sweet';
     *
     * const router = Router();
     * router.post('/login', async (req, res, next) => {
     *   const isAuthenticated = await expx.Authentication.authenticate(req, res, next);
     *   if (isAuthenticated) {
     *     await expx.Authentication.successRedirect(res);
     *   } else {
     *     await expx.Authentication.failureRedirect(req, res);
     *   }
     * });
     *
     * export default router;
     * ```
     */
    static failureRedirect(req: express.Request, res: express.Response): Promise<void>;
}
