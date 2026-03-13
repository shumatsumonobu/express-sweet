import sequelize from 'sequelize';
declare const Model_base: any;
/**
 * Abstract base class for database models, extending Sequelize.Model.
 * Provides convenient access to the shared database connection, query utilities,
 * transaction management, and Sequelize data types.
 *
 * @extends {sequelize.Model}
 * @example
 * ```js
 * // Creating a custom model
 * import * as expx from 'express-sweet';
 *
 * export default class extends expx.database.Model {
 *   static get table() {
 *     return 'user';
 *   }
 *
 *   static get attributes() {
 *     return {
 *       id: {
 *         type: this.DataTypes.INTEGER,
 *         primaryKey: true,
 *         autoIncrement: true
 *       },
 *       name: this.DataTypes.STRING,
 *       email: this.DataTypes.STRING,
 *       password: this.DataTypes.STRING,
 *       icon: this.DataTypes.STRING,
 *       created: this.DataTypes.DATE,
 *       modified: this.DataTypes.DATE
 *     };
 *   }
 * }
 * ```
 *
 * @example
 * ```js
 * // Basic CRUD operations
 * import BookModel from '../models/BookModel';
 *
 * // INSERT INTO book (title) VALUES ('Beautiful')
 * await BookModel.create({title: 'Beautiful'});
 *
 * // SELECT * FROM book
 * await BookModel.findAll();
 *
 * // UPDATE book SET title = 'Beautiful' WHERE id= 1
 * await BookModel.update({title: 'Beautiful'}, {where: {id: 1}});
 *
 * // DELETE FROM book WHERE id= 1
 * await BookModel.destroy({where: {id: 1}});
 * ```
 */
export default class Model extends Model_base {
    /**
     * The name of the table that the model accesses.
     * This member must be defined in a subclass.
     * @type {string}
     * @example
     * ```js
     * import * as expx from 'express-sweet';
     *
     * export default class extends expx.database.Model {
     *   static get table() {
     *     return 'user';
     *   }
     * }
     * ```
     */
    protected static table: string;
    /**
     * List of columns in the table accessed by this model.
     * This member must be defined in a subclass.
     * @type {sequelize.ModelAttributes}
     * @example
     * ```js
     * import * as expx from 'express-sweet';
     *
     * export default class extends expx.database.Model {
     *   static get attributes() {
     *     return {
     *       id: {
     *         type: this.DataTypes.INTEGER,
     *         primaryKey: true,
     *         autoIncrement: true
     *       },
     *       name: this.DataTypes.STRING,
     *       email: this.DataTypes.STRING,
     *       password: this.DataTypes.STRING,
     *       icon: this.DataTypes.STRING,
     *       created: this.DataTypes.DATE,
     *       modified: this.DataTypes.DATE
     *     };
     *   }
     * }
     * ```
     */
    protected static attributes: sequelize.ModelAttributes;
    /**
     * Database instance.
     * Shared Sequelize instance managed by DatabaseManager.
     * @type {sequelize.Sequelize}
     */
    protected static db: sequelize.Sequelize;
    /**
     * A convenience class holding commonly used data types.
     * This is an alias for `sequelize.DataTypes`.
     * @type {sequelize.DataTypes}
     * @example
     * ```js
     * {id: this.DataTypes.INTEGER}
     * ```
     */
    static readonly DataTypes: {
        [key: string]: any;
    };
    /**
     * An enum of query types used by sequelize.query.
     * @type {sequelize.QueryTypes}
     */
    static readonly QueryTypes: {
        [key: string]: string;
    };
    /**
     * Sequelize query operators for building WHERE conditions.
     * @type {sequelize.Op}
     * @example
     * ```js
     * // Sequelize provides several operators.
     * Post.findAll({
     *   where: {
     *     [this.Op.and]: [{a: 5}, {b: 6}],            // (a = 5) AND (b = 6)
     *     [this.Op.or]: [{a: 5}, {b: 6}],             // (a = 5) OR (b = 6)
     *     someAttribute: {
     *       // Basics
     *       [this.Op.eq]: 3,                              // = 3
     *       [this.Op.ne]: 20,                             // != 20
     *       [this.Op.is]: null,                           // IS NULL
     *       [this.Op.not]: true,                          // IS NOT TRUE
     *       [this.Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)
     *
     *       // Using dialect specific column identifiers (PG in the following example):
     *       [this.Op.col]: 'user.organization_id',        // = "user"."organization_id"
     *
     *       // Number comparisons
     *       [this.Op.gt]: 6,                              // > 6
     *       [this.Op.gte]: 6,                             // >= 6
     *       [this.Op.lt]: 10,                             // < 10
     *       [this.Op.lte]: 10,                            // <= 10
     *       [this.Op.between]: [6, 10],                   // BETWEEN 6 AND 10
     *       [this.Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15
     *
     *       // Other operators
     *       [this.Op.all]: this.literal('SELECT 1'),      // > ALL (SELECT 1)
     *       [this.Op.in]: [1, 2],                         // IN [1, 2]
     *       [this.Op.notIn]: [1, 2],                      // NOT IN [1, 2]
     *       [this.Op.like]: '%hat',                       // LIKE '%hat'
     *       [this.Op.notLike]: '%hat',                    // NOT LIKE '%hat'
     *       [this.Op.startsWith]: 'hat',                  // LIKE 'hat%'
     *       [this.Op.endsWith]: 'hat',                    // LIKE '%hat'
     *       [this.Op.substring]: 'hat',                   // LIKE '%hat%'
     *       [this.Op.iLike]: '%hat',                      // ILIKE '%hat' (case insensitive) (PG only)
     *       [this.Op.notILike]: '%hat',                   // NOT ILIKE '%hat'  (PG only)
     *       [this.Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
     *       [this.Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
     *       [this.Op.iRegexp]: '^[h|a|t]',                // ~* '^[h|a|t]' (PG only)
     *       [this.Op.notIRegexp]: '^[h|a|t]',             // !~* '^[h|a|t]' (PG only)
     *       [this.Op.any]: [2, 3],                        // ANY ARRAY[2, 3]::INTEGER (PG only)
     *       // In Postgres, this.Op.like/this.Op.iLike/this.Op.notLike can be combined to this.Op.any:
     *       [this.Op.like]: {[this.Op.any]: ['cat', 'hat']}  // LIKE ANY ARRAY['cat', 'hat']
     *       // There are more postgres-only range operators, see below
     *     }
     *   }
     * });
     * ```
     */
    static readonly Op: {
        [key: string]: any;
    };
    /**
     * Creates an object representing a database function for use in queries (WHERE, ORDER BY, etc.)
     * and as column default values. Use {@link col} to reference columns within function arguments.
     * @type {sequelize.fn}
     * @example
     * ```js
     * import BookModel from '../models/BookModel';
     *
     * // SELECT upper(`title`) AS `title` FROM `book` AS `book`;
     * const books = await BookModel.findAll({
     *   attributes: [[BookModel.fn('upper', BookModel.col('title')), 'title']],
     *   raw: true
     * });
     * ```
     */
    static readonly fn: (fn: string, ...args: unknown[]) => any;
    /**
     * Creates an object representing a database column reference.
     * Useful with {@link fn} to prevent column names from being escaped as strings.
     * @type {sequelize.col}
     */
    static readonly col: (col: string) => any;
    /**
     * Creates an object representing a raw SQL literal that will not be escaped.
     * @type {sequelize.literal}
     * @example
     * ```js
     * import BookModel from '../models/BookModel';
     *
     * // SELECT `id`, `title`, (SELECT COUNT(*) FROM comment WHERE comment.bookId = book.id) AS `count` FROM `book` AS `book`;
     * const books = await BookModel.findAll({
     *   attributes: [
     *     'id',
     *     'title',
     *     [BookModel.literal(`(SELECT COUNT(*) FROM comment WHERE comment.bookId = book.id)`), 'count']
     *   ],
     *   raw: true
     * });
     * ```
     */
    static readonly literal: (val: string) => any;
    /**
     * Creates a WHERE condition comparing an attribute (or function result) against a value.
     * The attribute can be a raw attribute from the model or a Sequelize utility like {@link fn}.
     * @type {sequelize.where}
     * @example
     * ```js
     * import BookModel from '../models/BookModel';
     *
     * // SELECT `title` FROM `book` AS `book` WHERE CHAR_LENGTH(`title`) <= 10;
     * const books = await BookModel.findAll({
     *   attributes: ['title'],
     *   where: BookModel.where(
     *     BookModel.fn('CHAR_LENGTH', BookModel.col('title')),
     *     {[BookModel.Op.lte]: 10}
     *   ),
     *   raw: true
     * });
     * ```
     */
    static readonly where: (attr: sequelize.AttributeType, comparator: string, logic: sequelize.LogicType) => sequelize.Utils.Where;
    /**
     * Reference to the Sequelize Transaction class.
     * Use this to access isolation level enums and transaction type constants.
     * @type {sequelize.Transaction}
     * @example
     * ```js
     * BookModel.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED // "READ UNCOMMITTED"
     * BookModel.Transaction.ISOLATION_LEVELS.READ_COMMITTED // "READ COMMITTED"
     * BookModel.Transaction.ISOLATION_LEVELS.REPEATABLE_READ  // "REPEATABLE READ"
     * BookModel.Transaction.ISOLATION_LEVELS.SERIALIZABLE // "SERIALIZABLE"
     * ```
     */
    static readonly Transaction: (typeof sequelize.Transaction);
    /**
     * Initializes the model with attributes and options.
     * This method is called automatically from within the "express-sweet.mount" method.
     * @override
     * @returns {Promise<any>} Returns this model class itself.
     */
    static init(): Promise<any>;
    /**
     * Defines associations with other models (hasOne, hasMany, belongsTo, belongsToMany).
     * Override this method in subclasses to declare relationships.
     * Called automatically by `express-sweet.mount()` after all models are initialized.
     * @example
     * ```js
     * import * as expx from 'express-sweet';
     * import ProfileModel from './ProfileModel';
     *
     * export default class extends expx.database.Model {
     *   static association() {
     *     // User has one profile.
     *     this.hasOne(ProfileModel, {
     *       foreignKey: 'userId', // profile.userId
     *       sourceKey: 'id', // user.id
     *       as: 'profile'
     *     });
     *   }
     * }
     * ```
     */
    static association(): void;
    /**
     * Starts a new database transaction.
     * @param {sequelize.TransactionOptions} options Transaction options (isolation level, type, etc.).
     * @returns {Promise<sequelize.Transaction>} The transaction object for use in subsequent queries.
     * @example
     * ```js
     * // Simple transaction usage example.
     * let transaction;
     * try {
     *   transaction = await BookModel.begin();
     *   const book = await BookModel.create({title: 'When Im Gone'}, {transaction});
     *   await transaction.commit();
     * } catch {
     *   if (transaction)
     *     await transaction.rollback();
     * }
     *
     * // You can also use transaction options.
     * let transaction;
     * try {
     *   transaction = await BookModel.begin({
     *     isolationLevel: BookModel.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
     *     type: BookModel.Transaction.TYPES.DEFERRED,
     *   });
     *   const book = await BookModel.findOne({where: {id: 1}}, {transaction});
     *   book.title = 'When Im Gone';
     *   await book.save({transaction});
     *   await transaction.commit();
     *
     *   // Load updated data.
     *   await book.reload();
     * } catch (error) {
     *   if (transaction)
     *     await transaction.rollback();
     * }
     * ```
     */
    static begin(options?: sequelize.TransactionOptions): Promise<sequelize.Transaction>;
    /**
     * Finds a single record by its primary key (`id` column).
     * Convenience wrapper around `findOne({where: {id}, raw: true})`.
     * @param {number} id The primary key value to search for.
     * @returns {Promise<object|null>} The raw record object, or `null` if not found.
     * @example
     * ```js
     * import BookModel from '../models/BookModel';
     *
     * // SELECT * FROM book WHERE id = 1 LIMIT 1;
     * const book = await BookModel.findById(1);
     * ```
     */
    static findById(id: number): Promise<{} | null>;
    /**
     * Executes a raw SQL query against the database.
     * By default returns `[results, metadata]`. Pass a `type` option (e.g., `QueryTypes.SELECT`)
     * to receive formatted results directly.
     * @param {string} sql The SQL query string.
     * @param {object} options Query options including query type, replacements, etc.
     * @returns {Promise<any>} Query results (format depends on the `type` option).
     * @example
     * ```js
     * // By default the function will return two arguments - a results array, and an object containing metadata (such as amount of affected rows, etc).
     * // Note that since this is a raw query, the metadata are dialect specific.
     * const [results, metadata] = await BookModel.query("UPDATE book SET title = 'When Im Gone' WHERE id = 1");
     *
     * // In cases where you don't need to access the metadata you can pass in a query type to tell sequelize how to format the results. For example, for a simple select query you could do:
     * // We didn't need to destructure the result here - the results were returned directly
     * const users = await BookModel.query("SELECT * FROM book", {type: BookModel.QueryTypes.SELECT});
     * ```
     */
    static query(sql: string, options: sequelize.QueryOptionsWithType<sequelize.QueryTypes.UPDATE> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.BULKUPDATE> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.INSERT> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.UPSERT> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.DELETE> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.BULKDELETE> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.SHOWTABLES> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.DESCRIBE> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.SELECT> | sequelize.QueryOptionsWithType<sequelize.QueryTypes.RAW>): Promise<any>;
}
export {};
