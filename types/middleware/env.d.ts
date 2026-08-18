/**
 * Loads environment variables from a `.env` file into `process.env`.
 *
 * Reads the file path specified by `env_path` in `config/config.js`, parses it with dotenv,
 * and populates `process.env`. Then runs the `hook_after_env_load` hook from the same config
 * file, giving the application a chance to post-process environment variables before database
 * models and the rest of the middleware stack read them. The hook runs even when `env_path`
 * is unset, so it can also be used to build `process.env` from a secret manager.
 *
 * A global flag prevents duplicate execution across multiple calls.
 *
 * @returns {Promise<void>}
 * @example
 * ```js
 * // Automatically called by express-sweet.mount()
 * // To configure, set env_path in config/config.js:
 * export default {
 *   env_path: '.env'
 * };
 * ```
 * @example
 * ```bash
 * # .env file example
 * NODE_ENV=development
 * DATABASE_URL=mysql://localhost/mydb
 * SECRET_KEY=mysecret
 * ```
 * @example
 * ```js
 * // Post-process environment variables in config/config.js
 * export default {
 *   env_path: '.env',
 *   hook_after_env_load: () => {
 *     if (process.env.DB_PASSWORD_B64)
 *       process.env.DB_PASSWORD = Buffer.from(process.env.DB_PASSWORD_B64, 'base64').toString();
 *   }
 * };
 * ```
 */
export default function env(): Promise<void>;
