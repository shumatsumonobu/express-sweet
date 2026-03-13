/**
 * Loads environment variables from a `.env` file into `process.env`.
 *
 * Reads the file path specified by `env_path` in `config/config.js`, parses it with dotenv,
 * and populates `process.env`. A global flag prevents duplicate loading across multiple calls.
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
 */
export default function env(): Promise<void>;
