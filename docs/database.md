# Database & Models

Express Sweet provides a Sequelize-based ORM layer with two core classes:

- **`DatabaseManager`** — Singleton that manages the shared Sequelize connection
- **`Model`** — Base class for your models with convenience methods

## DatabaseManager

Manages a single shared Sequelize instance across your entire application. You rarely need to use it directly — models handle it internally.

```js
import * as expx from 'express-sweet';

// Get the shared Sequelize instance
const db = await expx.database.DatabaseManager.getInstance();

// Check if the database is reachable
const ok = await expx.database.DatabaseManager.isConnected();

// Get the loaded database configuration
const config = await expx.database.DatabaseManager.getConfig();

// Get the runtime Sequelize options (includes defaults)
const options = await expx.database.DatabaseManager.getSequelizeOptions();

// Graceful shutdown
await expx.database.DatabaseManager.close();
```

| Method | Returns | Description |
|--------|---------|-------------|
| `getInstance()` | `Promise<Sequelize>` | Returns the singleton Sequelize instance (creates on first call). |
| `isConnected()` | `Promise<boolean>` | Tests the database connection. |
| `getConfig()` | `Promise<object>` | Returns the raw config loaded from `config/database.js`. |
| `getSequelizeOptions()` | `Promise<object>` | Returns the runtime Sequelize options. |
| `close()` | `Promise<void>` | Closes the connection and resets the singleton. |

## Defining a Model

Create model files in your `models/` directory. Each model extends `expx.database.Model` and defines `table` and `attributes`:

```js
// models/UserModel.js
import * as expx from 'express-sweet';

export default class extends expx.database.Model {
  static get table() {
    return 'user';
  }

  static get attributes() {
    return {
      id: {
        type: this.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name:     this.DataTypes.STRING,
      email:    this.DataTypes.STRING,
      password: this.DataTypes.STRING,
      created:  this.DataTypes.DATE,
      modified: this.DataTypes.DATE,
    };
  }
}
```

Models are automatically loaded and initialized by `expx.mount()`. No manual registration needed.

## CRUD Operations

All standard Sequelize query methods are available:

```js
import UserModel from '../models/UserModel.js';

// CREATE
await UserModel.create({ name: 'Alice', email: 'alice@example.com' });

// READ
const users = await UserModel.findAll();
const user  = await UserModel.findById(1);    // convenience method
const admin = await UserModel.findOne({ where: { role: 'admin' }, raw: true });

// UPDATE
await UserModel.update({ name: 'Bob' }, { where: { id: 1 } });

// DELETE
await UserModel.destroy({ where: { id: 1 } });
```

## Raw Queries

For complex SQL that doesn't fit Sequelize's query builder:

```js
// Returns [results, metadata]
const [results, metadata] = await UserModel.query(
  "UPDATE user SET name = 'Bob' WHERE id = 1"
);

// Typed query — returns results directly
const users = await UserModel.query(
  'SELECT * FROM user WHERE role = :role',
  {
    type: UserModel.QueryTypes.SELECT,
    replacements: { role: 'admin' },
  }
);
```

## Operators

Use `Model.Op` for complex WHERE conditions:

```js
const users = await UserModel.findAll({
  where: {
    [UserModel.Op.or]: [
      { role: 'admin' },
      { role: 'moderator' },
    ],
    age: {
      [UserModel.Op.gte]: 18,
      [UserModel.Op.lt]: 65,
    },
    name: {
      [UserModel.Op.like]: '%alice%',
    },
    status: {
      [UserModel.Op.in]: ['active', 'pending'],
    },
  },
});
```

Common operators:

| Operator | SQL | Example |
|----------|-----|---------|
| `Op.eq` | `=` | `{ [Op.eq]: 3 }` |
| `Op.ne` | `!=` | `{ [Op.ne]: 20 }` |
| `Op.gt` / `Op.gte` | `>` / `>=` | `{ [Op.gt]: 6 }` |
| `Op.lt` / `Op.lte` | `<` / `<=` | `{ [Op.lt]: 10 }` |
| `Op.between` | `BETWEEN` | `{ [Op.between]: [6, 10] }` |
| `Op.in` / `Op.notIn` | `IN` / `NOT IN` | `{ [Op.in]: [1, 2] }` |
| `Op.like` | `LIKE` | `{ [Op.like]: '%hat' }` |
| `Op.and` / `Op.or` | `AND` / `OR` | `{ [Op.and]: [{a: 5}, {b: 6}] }` |
| `Op.is` | `IS NULL` | `{ [Op.is]: null }` |

## SQL Functions

Use `fn()`, `col()`, `literal()`, and `where()` for advanced queries:

```js
// SELECT upper(`title`) AS `title` FROM `book`
const books = await BookModel.findAll({
  attributes: [[BookModel.fn('upper', BookModel.col('title')), 'title']],
  raw: true,
});

// Subquery as a computed column
const booksWithCount = await BookModel.findAll({
  attributes: [
    'id',
    'title',
    [BookModel.literal('(SELECT COUNT(*) FROM comment WHERE comment.bookId = book.id)'), 'commentCount'],
  ],
  raw: true,
});

// WHERE with function
const shortTitles = await BookModel.findAll({
  attributes: ['title'],
  where: BookModel.where(
    BookModel.fn('CHAR_LENGTH', BookModel.col('title')),
    { [BookModel.Op.lte]: 10 }
  ),
  raw: true,
});
```

| Method | Description |
|--------|-------------|
| `fn(name, ...args)` | Database function (e.g., `fn('upper', col('name'))`). |
| `col(name)` | Column reference (prevents escaping as string). |
| `literal(sql)` | Raw SQL literal (not escaped). |
| `where(attr, comparator, value)` | WHERE condition on a function result. |

## Transactions

Use `begin()` to start a transaction:

```js
let transaction;
try {
  transaction = await UserModel.begin();
  await UserModel.create({ name: 'Alice' }, { transaction });
  await UserModel.update({ role: 'admin' }, { where: { id: 1 }, transaction });
  await transaction.commit();
} catch {
  if (transaction) await transaction.rollback();
}
```

With isolation level:

```js
const transaction = await UserModel.begin({
  isolationLevel: UserModel.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
});
```

Available isolation levels:

| Level | Constant |
|-------|----------|
| READ UNCOMMITTED | `Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED` |
| READ COMMITTED | `Transaction.ISOLATION_LEVELS.READ_COMMITTED` |
| REPEATABLE READ | `Transaction.ISOLATION_LEVELS.REPEATABLE_READ` |
| SERIALIZABLE | `Transaction.ISOLATION_LEVELS.SERIALIZABLE` |

## Associations

Override the `association()` method to define relationships between models. This method is called automatically after all models are initialized.

### hasOne

```js
// models/UserModel.js
import * as expx from 'express-sweet';
import ProfileModel from './ProfileModel.js';

export default class extends expx.database.Model {
  static get table() { return 'user'; }
  static get attributes() { /* ... */ }

  static association() {
    this.hasOne(ProfileModel, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'profile',
    });
  }
}
```

```js
// Query with association
const user = await UserModel.findOne({
  where: { id: 1 },
  include: [{ model: ProfileModel, as: 'profile' }],
});
// user.profile.bio → "Hello world"
```

### hasMany

```js
static association() {
  this.hasMany(PostModel, {
    foreignKey: 'authorId',
    sourceKey: 'id',
    as: 'posts',
  });
}
```

### belongsTo

```js
// models/PostModel.js
static association() {
  this.belongsTo(UserModel, {
    foreignKey: 'authorId',
    targetKey: 'id',
    as: 'author',
  });
}
```

### belongsToMany

```js
// models/UserModel.js
static association() {
  this.belongsToMany(RoleModel, {
    through: 'user_role',       // junction table
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles',
  });
}
```

## Model API Reference

| Member | Type | Description |
|--------|------|-------------|
| `table` | `string` (getter) | Table name. Override in subclass. |
| `attributes` | `object` (getter) | Column definitions. Override in subclass. |
| `DataTypes` | `object` | Sequelize data types (`INTEGER`, `STRING`, `DATE`, etc.). |
| `QueryTypes` | `object` | Query type enum (`SELECT`, `INSERT`, `UPDATE`, etc.). |
| `Op` | `object` | Query operators (`eq`, `gt`, `like`, `and`, `or`, etc.). |
| `Transaction` | `class` | Transaction class with isolation level constants. |
| `fn(name, ...args)` | `function` | Create a database function call. |
| `col(name)` | `function` | Create a column reference. |
| `literal(sql)` | `function` | Create a raw SQL literal. |
| `where(attr, comp, val)` | `function` | Create a WHERE condition. |
| `findById(id)` | `Promise<object\|null>` | Find a record by primary key. |
| `begin(options?)` | `Promise<Transaction>` | Start a new transaction. |
| `query(sql, options)` | `Promise<any>` | Execute a raw SQL query. |
| `association()` | `void` | Override to define model relationships. |
