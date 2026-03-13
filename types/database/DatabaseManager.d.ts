import sequelize from 'sequelize';
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
    private static instance;
    /**
     * Cached database configuration
     */
    private static config;
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
    static getInstance(): Promise<sequelize.Sequelize>;
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
    static isConnected(): Promise<boolean>;
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
    static getConfig(): Promise<object>;
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
    static getSequelizeOptions(): Promise<object>;
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
    static close(): Promise<void>;
}
