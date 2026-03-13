import express from 'express';

/**
 * User authentication configuration interface using Passport.js.
 * Defines configuration for user authentication, session management, and security settings.
 * @example
 * ```js
 * // config/authentication.js
 * export default {
 *   enabled: true,
 *   username: 'email',
 *   password: 'password',
 *   success_redirect: '/',
 *   failure_redirect: '/login',
 *   session_store: 'redis',
 *   redis_host: 'redis://localhost:6379',
 *   authenticate_user: async (username, password, req) => {
 *     const UserModel = require('../models/UserModel');
 *     return UserModel.findOne({
 *       where: { email: username, password },
 *       raw: true
 *     });
 *   },
 *   subscribe_user: async (id) => {
 *     const UserModel = require('../models/UserModel');
 *     return UserModel.findOne({
 *       where: { id },
 *       raw: true
 *     });
 *   },
 *   allow_unauthenticated: ['/api', /^\/public/],
 *   expiration: 24 * 3600000
 * };
 * ```
 */
export default interface AuthenticationConfig {
  /**
   * Enable user authentication, defaults to disabled (false).
   * @type {boolean}
   */
  enabled: boolean,

  /**
   * The session store instance, defaults to a new MemoryStore(memory) instance.
   * @type {'memory'|'redis'}
   */
  session_store: 'memory'|'redis',

  /**
   * The name of the session ID cookie to set in the response (and read from in the request).
   * The default value is 'connect.sid'.
   * @type {string|undefined}
   */
  cookie_name?: string,

  /**
   * Specifies the boolean value for the Secure Set-Cookie attribute.
   * The default is true, which sets the Secure attribute on the cookie.
   * @type {boolean|undefined}
   */
  cookie_secure?: boolean,

  /**
   * Specifies the boolean value for the HttpOnly Set-Cookie attribute. 
   * Defaults to true, which sets the HttpOnly attribute on the cookie.
   * @type {boolean|undefined}
   */
  cookie_httpOnly?: boolean,

  /**
   * If the session is stored in "redis", this field is required and should be set to the hostname of the Redis server.
   * For example, to connect to redis on localhost on port 6379, set "redis://localhost:6379".
   * To connect to a different host or port, use a connection string in the format "redis[s]://[[username][:password]@][host][:port][/db-number]".
   * For example, "redis://alice:foobared@awesome.redis.server:6380".
   * @type {string|undefined}
   */
  redis_host?: string,

  /**
   * Authentication user ID field name, defaults to `username`.
   * @type {string}
   */
  username: string,

  /**
   * Authentication password field name, defaults to `password`.
   * @type {string}
   */
  password: string,

  /**
   * URL to redirect after successful authentication, defaults to `/`.
   * @type {string}
   */
  success_redirect: string,

  /**
   * URL to redirect to on authentication failure, defaults to `/login`.
   * @type {string|((req: express.Request, res: express.Response) => string)}
   * @example
   * ```js
   * // Set the URL to redirect to in case of login failure as a string.
   * failure_redirect: '/login',
   *
   * // Dynamically set the url to redirect to on login failure.
   * failure_redirect: (req, res) => {
   *   // If the role stored in the cookie is admin, redirect to the admin login screen.
   *   return req.cookies.role === 'admin' ? '/adminlogin' : 'login';
   * },
   * ```
  */
  failure_redirect: string|((req: express.Request, res: express.Response) => string),

  /**
   * Hook called during user authentication.
   * Look up and return the user matching the given credentials, or `null` if not found.
   * The returned object must include an `id` property for session serialization.
   * @type {(username: string, password: string, req: express.Request) => Promise<{[key: string]: any}|null>}
   * @example
   * ```js
   * authenticate_user: async (username, password, req) => {
   *   const UserModel = require('../models/UserModel');
   *   return UserModel.findOne({
   *     where: {
   *       email: username,
   *       password
   *     },
   *     raw: true
   *   });
   * }
   * ```
   */
  authenticate_user: (username: string, password: string, req: express.Request) => Promise<{[key: string]: any}|null>,

  /**
   * Hook called on each request to deserialize the authenticated user from the session.
   * Look up and return the user data for the given ID.
   * The returned object is set on `req.user` and available in views as `session`.
   * @type {(id: number|string) => Promise<{[key: string]: any}>}
   * @example
   * ```js
   * subscribe_user: async (id) => {
   *   const UserModel = require('../models/UserModel');
   *   return UserModel.findOne({
   *     where: {id},
   *     raw: true
   *   });
   * }
   * ```
   */
  subscribe_user: (id: number|string) => Promise<{[key: string]: any}>,

  /**
   * URL patterns that bypass authentication. Requests matching any pattern (partial string match
   * or regex match) are allowed without authentication. Defaults to `[]` (all routes protected).
   * @type {(string|RegExp)[]}
   */
  allow_unauthenticated: (string|RegExp)[],

  /**
   * Session cookie max-age in milliseconds. Defaults to 24 hours (`24 * 3600000`).
   * @type {number}
   */
  expiration: number,
}