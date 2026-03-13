# Configuration

Express Sweet uses convention-based configuration files in your app's `config/` directory. All files are optional — sensible defaults are used when a file is missing.

Ready-to-use templates are available in [examples/](../examples/).

## config.js

Basic application settings.

```js
import path from 'node:path';

export default {
  env_path: '.env',
  cors_enabled: true,
  max_body_size: '100mb',
  router_dir: path.join(process.cwd(), 'routes'),
  default_router: '/home',
  rewrite_base_url: baseUrl => baseUrl,
  is_ajax: req => !!req.xhr,
  hook_handle_error: (error, req, res, next) => {
    if (error.status === 404)
      res.status(404).render('errors/404');
    else
      res.status(500).render('errors/500');
  },
};
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `env_path` | `string` | `undefined` | Path to `.env` file. Set to load environment variables automatically. |
| `cors_enabled` | `boolean` | `false` | Enable Cross-Origin Resource Sharing. |
| `max_body_size` | `string\|number` | `'100kb'` | Maximum request body size (e.g., `'100mb'`, `1048576`). |
| `router_dir` | `string` | `<cwd>/routes` | Absolute path to the directory containing route files. |
| `default_router` | `string` | `undefined` | Route endpoint that also handles the root URL (`/`). |
| `rewrite_base_url` | `function` | `baseUrl => baseUrl` | Hook to rewrite `app.locals.baseUrl` and view's `baseUrl` variable. Receives the auto-detected base URL (may be `undefined` if Host header is invalid). |
| `is_ajax` | `function` | `req => !!req.xhr` | Determines whether a request is AJAX. Used by authentication to decide between redirect (HTML) and 401 (API). |
| `hook_handle_error` | `function` | `undefined` | Custom error handler hook. If unset, errors return `res.status(error.status \|\| 500).end()`. |

## database.js

Sequelize database connection settings. Supports environment-based configuration.

```js
export default {
  development: {
    username: 'root',
    password: 'password',
    database: 'myapp_dev',
    host: 'localhost',
    port: undefined,
    dialect: 'mariadb',
    timezone: '+09:00',
    logging: false,
    pool: {
      max: 100,
      min: 10,
      acquire: 10000,
      idle: 3000,
      evict: 10000,
    },
  },
  test: { /* ... */ },
  production: { /* ... */ },
};
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `username` | `string` | — | Database user. |
| `password` | `string` | — | Database password. |
| `database` | `string` | — | Database name. |
| `host` | `string` | `'localhost'` | Database server hostname. |
| `port` | `number` | dialect default | Connection port. |
| `dialect` | `string` | — | Database engine: `'mysql'`, `'mariadb'`, `'postgres'`, `'sqlite'`, `'mssql'`. |
| `storage` | `string` | `':memory:'` | SQLite only. File path to the database (e.g., `'./db.sqlite'`). |
| `timezone` | `string` | `'+00:00'` | Timezone for date values. |
| `logging` | `boolean\|function` | `console.log` | SQL query logging. Set `false` to disable. |
| `pool.max` | `number` | `5` | Maximum connections in pool. |
| `pool.min` | `number` | `0` | Minimum connections in pool. |
| `pool.acquire` | `number` | `60000` | Max ms to wait for a connection before throwing. |
| `pool.idle` | `number` | `10000` | Max ms a connection can be idle before release. |
| `pool.evict` | `number` | `1000` | How often (ms) to check for idle connections. |

### Pool sizing guide

Set `pool.max` based on your database's `max_connections` and the number of app instances:

```
pool.max = floor(max_connections * 0.7 / number_of_instances)
```

For example, with `max_connections=151` and 1 instance: `pool.max = 100`.

### SQLite example

SQLite requires no server — just a file path:

```js
export default {
  development: {
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false,
  },
};
```

Install the driver: `npm install sqlite3`

## authentication.js

Passport.js user authentication configuration.

```js
export default {
  enabled: true,
  session_store: 'memory',
  cookie_name: 'connect.sid',
  cookie_secure: false,
  cookie_httpOnly: true,
  redis_host: undefined,
  username: 'email',
  password: 'password',
  success_redirect: '/',
  failure_redirect: '/login',
  authenticate_user: async (username, password, req) => { /* ... */ },
  subscribe_user: async (id) => { /* ... */ },
  allow_unauthenticated: ['/api/login'],
  expiration: 24 * 3600000,
};
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable authentication middleware. |
| `session_store` | `string` | `'memory'` | Session storage: `'memory'` or `'redis'`. |
| `cookie_name` | `string` | `'connect.sid'` | Session cookie name. |
| `cookie_secure` | `boolean` | `true` | Set `Secure` flag on cookie. Must be `false` for HTTP (non-HTTPS). |
| `cookie_httpOnly` | `boolean` | `true` | Set `HttpOnly` flag on cookie. |
| `redis_host` | `string` | `undefined` | Redis connection URL (e.g., `'redis://localhost:6379'`). Required when `session_store` is `'redis'`. |
| `username` | `string` | `'username'` | Name of the username field in the login form. |
| `password` | `string` | `'password'` | Name of the password field in the login form. |
| `success_redirect` | `string` | `'/'` | URL to redirect after successful login. |
| `failure_redirect` | `string\|function` | `'/login'` | URL to redirect to on authentication failure. Can be a function `(req, res) => string` for dynamic URLs. |
| `authenticate_user` | `function` | — | **Required.** Async function `(username, password, req) => user\|null`. Return user object on success, `null` on failure. User object must include an `id` property. |
| `subscribe_user` | `function` | — | **Required.** Async function `(id) => user`. Called on each request to load user data into `req.user` and `res.locals.session`. |
| `allow_unauthenticated` | `(string\|RegExp)[]` | `[]` | URL patterns that bypass authentication. Strings use partial match, RegExp uses regex test. |
| `expiration` | `number` | `86400000` (24h) | Session cookie max age in milliseconds. |

## view.js

Handlebars view engine configuration.

```js
import path from 'node:path';

export default {
  views_dir: path.join(process.cwd(), 'views'),
  partials_dir: path.join(process.cwd(), 'views/partials'),
  layouts_dir: path.join(process.cwd(), 'views/layout'),
  default_layout: path.join(process.cwd(), 'views/layout/default.hbs'),
  extension: '.hbs',
  beforeRender: (req, res) => {
    res.locals.message = 'Hello World';
  },
};
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `views_dir` | `string` | `<cwd>/views` | Absolute path to view templates. |
| `partials_dir` | `string\|string[]` | `<cwd>/views/partials` | Path(s) to partial templates. |
| `layouts_dir` | `string` | `<cwd>/views/layout` | Path to layout templates. |
| `default_layout` | `string` | `<cwd>/views/layout/default.hbs` | Default layout file. |
| `extension` | `string` | `'.hbs'` | File extension for templates and partials. |
| `beforeRender` | `function` | `undefined` | Hook called before every render. Use to set `res.locals` variables available in all views. |

## logging.js

Morgan HTTP request logging configuration.

```js
export default {
  format: 'combined',
  skip: (req, res) => req.path === '/health',
};
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `string` | `'combined'` | Morgan format: `'combined'`, `'common'`, `'dev'`, `'short'`, `'tiny'`, or a custom format string. |
| `skip` | `function` | `undefined` | Return `true` to skip logging for a request. |

## upload.js

Multer file upload configuration.

```js
export default {
  enabled: true,
  resolve_middleware: (req, multer) => {
    if (req.path === '/api/avatar' && req.method === 'POST') {
      return multer({ storage: multer.memoryStorage() }).single('avatar');
    }
    return null;
  },
};
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable upload middleware. When disabled, `multipart/form-data` requests are still parsed (fields only, no files). |
| `resolve_middleware` | `function` | `undefined` | `(req, multer) => middleware\|null`. Return a Multer middleware for the current request, or `null` to skip file handling. |
