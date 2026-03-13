import express from 'express';
import passport from 'passport';
import {Strategy as LocalStrategy, IVerifyOptions} from 'passport-local';
import session from 'express-session';
import AuthenticationConfig from '~/types/AuthenticationConfig';
import {RedisStore} from 'connect-redis';
import {createClient} from 'redis';
import * as utils from '~/utils';
import {mountBeforeRender} from '~/middleware/views';

/**
 * Checks whether the request URL is whitelisted for unauthenticated access.
 * Performs partial string matching for string patterns and regex matching for RegExp patterns.
 * @param {express.Request} req The Express request object.
 * @param {(string|RegExp)[]} allowPatterns URL patterns that bypass authentication.
 * @returns {boolean} `true` if the request URL matches any allowed pattern, or if the allowlist is empty.
 */
function isAllowedWithoutAuth(req: express.Request, allowPatterns: (string|RegExp)[]): boolean {
  // Strip trailing slash for consistent matching (e.g., "/api/" → "/api")
  const normalizedPath = req.path.replace(/\/$/, '');

  // Empty allowlist means all URLs are allowed without auth
  if (!allowPatterns.length)
    return true;

  // Check each pattern: string patterns use partial match, RegExp patterns use regex test
  for (const pattern of allowPatterns) {
    if (typeof pattern === 'string' && normalizedPath.indexOf(pattern) !== -1)
      return true;
    if (pattern instanceof RegExp && pattern.test(normalizedPath))
      return true;
  }
  return false;
}

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
export default async function auth(app: express.Express): Promise<void> {
  // Load authentication and basic configuration
  const authConfig: AuthenticationConfig = await utils.loadAuthenticationConfig();
  const appConfig = await utils.loadAppConfig();

  // Skip authentication setup if disabled
  if (!authConfig.enabled)
    // Still mount beforeRender middleware even when auth is disabled
    return void await mountBeforeRender(app);

  // Configure session options
  const sessionOptions: session.SessionOptions = {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    name: authConfig.cookie_name,
    cookie: {
      secure: authConfig.cookie_secure,
      httpOnly: authConfig.cookie_httpOnly,
      maxAge: authConfig.expiration
    }
  };

  // Set up Redis session store if configured (otherwise uses default MemoryStore)
  if (authConfig.session_store === 'redis') {
    const redisClient = createClient({url: authConfig.redis_host as string});
    redisClient.connect().catch(console.error);
    sessionOptions.store = new RedisStore({client: redisClient});
  }

  // Apply session middleware
  app.use(session(sessionOptions));

  // Configure Passport local strategy for username/password authentication
  passport.use(new LocalStrategy({
    usernameField: authConfig.username,
    passwordField: authConfig.password,
    session: true,
    // Enable passReqToCallback to receive request object in authentication callback
    passReqToCallback: true
  }, async (req: express.Request, username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => {
    // Authenticate user via configured authentication hook
    const user = <{[key: string]: any}|null> await authConfig.authenticate_user(username, password, req);

    // Warn about secure cookie misconfiguration: secure cookies require HTTPS
    const clientProtocol = req.headers['x-forwarded-proto'] || req.protocol;
    if (user && clientProtocol === 'http' && authConfig.cookie_secure)
      console.warn('[Sweet] Cookie security must be disabled for HTTP authentication (set cookie_secure to false in config/authentication.js)');

    // Complete authentication
    done(null, user || false);
  }));

  // Serialize user ID into session
  passport.serializeUser<number>((user: {[key: string]: any}, done: any) => {
    done(null, user.id || undefined);
  });

  // Deserialize user from session ID on each request
  passport.deserializeUser(async (id: any, done: any) => {
    // Load full user data via configured subscription hook
    const user = <{[key: string]: any}> await authConfig.subscribe_user(id as number);

    // Store user in req.user
    done(null, user);
  });

  // Initialize Passport middleware
  app.use(passport.initialize());

  // Enable session-based authentication
  // Reads session ID from cookie and deserializes user into req.user
  app.use(passport.session());

  // Mount beforeRender middleware for view rendering
  await mountBeforeRender(app);

  // Check authentication status and protect routes
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Allow unauthenticated access for whitelisted URLs
    if (authConfig.allow_unauthenticated && isAllowedWithoutAuth(req, authConfig.allow_unauthenticated))
      return void next();

    // Determine if this is an AJAX request
    const isAjax = appConfig.is_ajax?.(req) ?? false;

    // Resolve failure redirect URL (supports both static string and dynamic function)
    const loginUrl = (utils.isFunction(authConfig.failure_redirect)
      ? (authConfig.failure_redirect as (req: express.Request, res: express.Response) => string)(req, res)
      : authConfig.failure_redirect) as string;

    // Strip query parameters for path-only comparison
    const loginPath = loginUrl.replace(/\?.*/, '');

    // Handle authenticated users
    if (req.isAuthenticated()) {
      // Avoid redirect loop on login page
      if (req.path !== loginPath || isAjax) {
        // Make user data available in views via res.locals.session
        res.locals.session = req.user;
        next();
      } else
        // Redirect to success page if accessing login page while authenticated
        res.redirect(authConfig.success_redirect);
    } else if (!isAjax)
      // Redirect unauthenticated non-AJAX requests to login page
      if (req.path === loginPath)
        // Allow access to login page itself
        next();
      else
        res.redirect(loginUrl);
    else
      // Return 401 Unauthorized for unauthenticated AJAX requests
      res.status(401).end();
  });
}

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
export class Authentication {
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
  static authenticate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Invoke Passport's local strategy with a custom callback
      passport.authenticate('local', (error: any, user: any) => {
        if (error)
          return void reject(error);
        // Authentication failed (invalid credentials) — resolve false, not an error
        if (!user)
          return void resolve(false);
        // Establish login session for the authenticated user
        req.logIn(user, (loginError: any) => {
          if (loginError)
            return void reject(loginError);
          resolve(true);
        });
      })(req, res, next);
    });
  }

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
  static logout(req: express.Request): void {
    req.logout((error: any) => {});
  }

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
  static async successRedirect(res: express.Response): Promise<void> {
    const authConfig = await utils.loadAuthenticationConfig();
    res.redirect(authConfig.success_redirect!);
  }

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
  static async failureRedirect(req: express.Request, res: express.Response): Promise<void> {
    const authConfig = await utils.loadAuthenticationConfig();

    // Resolve login URL (supports both static string and dynamic function)
    const loginUrl = (utils.isFunction(authConfig.failure_redirect)
      ? (authConfig.failure_redirect as (req: express.Request, res: express.Response) => string)(req, res)
      : authConfig.failure_redirect) as string;
    res.redirect(loginUrl);
  }
}
