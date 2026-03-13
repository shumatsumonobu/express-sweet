/**
 * Initializes global variables used throughout the application.
 *
 * Sets `global.APP_DIR` to the current working directory (`process.cwd()`),
 * making the application root path accessible from any module.
 *
 * @example
 * ```js
 * // After mounting, access the application root directory anywhere:
 * const configPath = `${global.APP_DIR}/config/custom.json`;
 * ```
 */
export default function globals() {
  // Set application root directory (where app.js is located)
  global.APP_DIR = process.cwd();
  if (process.env.SWEET_DEBUG) {
    console.log(`[Sweet] Setting global variable APP_DIR to ${global.APP_DIR}`);
  }
}
