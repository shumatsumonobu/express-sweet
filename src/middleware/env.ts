import fs from 'node:fs';
import dotenv from 'dotenv';
import * as utils from '~/utils';

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
export default async function env(): Promise<void> {
  // Skip if environment variables already loaded
  if (global.loadedEnv) {
    return;
  }

  // Load application configuration
  const appConfig = await utils.loadAppConfig();

  // Skip if no .env file path configured
  if (!appConfig.env_path)
    return;

  // Parse .env file and populate process.env with key-value pairs
  const parsed = dotenv.parse(fs.readFileSync(appConfig.env_path!));
  for (const key of Object.keys(parsed)) {
    process.env[key] = parsed[key];
  }

  // Mark as loaded to prevent duplicate loading
  global.loadedEnv = true;
}
