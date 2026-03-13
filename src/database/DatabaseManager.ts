import sequelize from 'sequelize';
import loadDatabaseConfig from '~/utils/loadDatabaseConfig';

/**
 * Singleton manager for the Sequelize database connection.
 *
 * Ensures a single shared Sequelize instance is used across all models and services.
 * The instance is lazily created on the first call to {@link getInstance} and reused thereafter.
 *
 * @example
 * ```js
 * import * as expx from 'express-sweet';
 *
 * // Get the shared Sequelize instance
 * const db = await expx.database.DatabaseManager.getInstance();
 *
 * // Check if the database is reachable
 * if (await expx.database.DatabaseManager.isConnected()) {
 *   console.log('Database OK');
 * }
 *
 * // Graceful shutdown
 * await expx.database.DatabaseManager.close();
 * ```
 */
export default class DatabaseManager {
  /**
   * Singleton Sequelize instance
   */
  private static instance: sequelize.Sequelize | null = null;

  /**
   * Cached database configuration
   */
  private static config: any = null;

  /**
   * Gets the singleton Sequelize database instance.
   * Creates a new instance on first call, returns cached instance on subsequent calls.
   * @returns {Promise<sequelize.Sequelize>} The Sequelize database instance
   * @throws {Error} When database configuration loading fails
   * @example
   * ```js
   * const sequelize = await DatabaseManager.getInstance();
   * const users = await sequelize.models.User.findAll();
   * ```
   */
  static async getInstance(): Promise<sequelize.Sequelize> {
    // Create new instance if not exists (singleton pattern)
    if (!this.instance) {
      this.config = await loadDatabaseConfig();
      if (process.env.SWEET_DEBUG) {
        console.log(`[Sweet] Connecting to database "${this.config.database}" using ${this.config.dialect}`);
      }
      // Initialize Sequelize with database credentials
      this.instance = new sequelize.Sequelize(
        this.config.database!,
        this.config.username!,
        this.config.password || undefined,
        this.config
      );
    }
    return this.instance;
  }

  /**
   * Tests the database connection.
   * @returns {Promise<boolean>} Returns true if connection is successful, false otherwise
   * @example
   * ```js
   * const canConnect = await DatabaseManager.isConnected();
   * if (canConnect) {
   *   console.log('Database is accessible');
   * } else {
   *   console.error('Cannot connect to database');
   * }
   * ```
   */
  static async isConnected(): Promise<boolean> {
    const sequelize = await this.getInstance();
    try {
      // Attempt to authenticate with database
      await sequelize.authenticate();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the original database configuration loaded from config files.
   * This returns the raw configuration before Sequelize processing.
   * @returns {Promise<object>} Database configuration object containing all loaded options
   * @throws {Error} When configuration loading fails
   * @example
   * ```js
   * const config = await DatabaseManager.getConfig();
   * console.log('Database name:', config.database);
   * console.log('Host:', config.host);
   * console.log('Port:', config.port);
   * ```
   */
  static async getConfig(): Promise<object> {
    // Load config if not already cached
    if (!this.config) {
      this.config = await loadDatabaseConfig();
    }
    return this.config;
  }

  /**
   * Gets the runtime Sequelize options after initialization.
   * This returns the actual options used by the Sequelize instance,
   * which may include defaults and processed values.
   * @returns {Promise<object>} Sequelize runtime options object
   * @example
   * ```js
   * const options = await DatabaseManager.getSequelizeOptions();
   * console.log('Connection pool settings:', options.pool);
   * console.log('Dialect:', options.dialect);
   * ```
   */
  static async getSequelizeOptions(): Promise<object> {
    const sequelize = await this.getInstance();
    return (sequelize as any).options;
  }

  /**
   * Closes the database connection and resets the singleton instance.
   * Useful for testing or graceful application shutdown.
   * @returns {Promise<void>}
   * @example
   * ```js
   * // Graceful shutdown
   * process.on('SIGTERM', async () => {
   *   await DatabaseManager.close();
   *   process.exit(0);
   * });
   * ```
   */
  static async close(): Promise<void> {
    if (this.instance) {
      // Close database connection
      await this.instance.close();
      // Reset singleton state
      this.instance = null;
      this.config = null;
    }
  }
}