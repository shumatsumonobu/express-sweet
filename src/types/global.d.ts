/**
 * Global type declarations for Express Sweet.
 * 
 * Extends the global namespace with Express Sweet specific variables
 * that are accessible throughout the application runtime.
 * 
 * @example
 * // Accessing global variables anywhere in the application
 * console.log(global.APP_DIR);     // "/path/to/your/app"
 * console.log(global.loadedEnv);   // true or false
 */
declare global {
  /**
   * Application root directory path.
   * Set by the Global middleware during application initialization.
   * Contains the absolute path to the directory where the main application file is located.
   * @type {string}
   * @example
   * // Access in routes or models
   * const configPath = `${global.APP_DIR}/config/custom.json`;
   * const publicPath = `${global.APP_DIR}/public/uploads`;
   */
  var APP_DIR: string;

  /**
   * Environment step completion flag.
   * Set by the Environment middleware to prevent the .env file from being parsed
   * and the `hook_after_env_load` hook from being run more than once.
   * True once the environment step has finished, whether or not a .env file was configured.
   * @type {boolean}
   * @example
   * // Check if the environment step has already run
   * if (global.loadedEnv) {
   *   console.log('Environment variables already loaded');
   * }
   */
  var loadedEnv: boolean;
}
export {}