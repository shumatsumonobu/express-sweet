# Migration from v4 to v5

This guide covers breaking changes and how to update your code.

## Namespace Changes

Several module namespaces have been renamed for clarity:

| v4 | v5 | Import change |
|----|-----|---------------|
| `expx.services.Authentication` | `expx.Authentication` | Direct top-level export |
| `expx.middlewares.*` | `expx.middleware.*` | Singular form |
| `expx.interfaces.*` | `expx.types.*` | Renamed to `types` |
| `expx.handlebars_helpers.*` | `expx.helpers.*` | Shortened name |

### Before (v4)

```js
import * as expx from 'express-sweet';

// Authentication
await expx.services.Authentication.authenticate(req, res, next);

// Middleware
expx.middlewares.corsPolicy;
expx.middlewares.envLoader;

// Interfaces
const config: expx.interfaces.AuthenticationConfig = { ... };
```

### After (v5)

```js
import * as expx from 'express-sweet';

// Authentication — top-level export
await expx.Authentication.authenticate(req, res, next);

// Middleware — singular
expx.middleware.cors;
expx.middleware.env;

// Types — renamed
const config: expx.types.AuthenticationConfig = { ... };
```

## Middleware Renames

Internal middleware functions have been renamed to be shorter and more consistent:

| v4 | v5 |
|----|-----|
| `corsPolicy` | `cors` |
| `envLoader` | `env` |
| `globalVars` | `globals` |
| `requestParser` | `parser` |
| `localVars` | `locals` |
| `viewEngine` | `views` |
| `routeMapper` | `router` |
| `passportAuth` | `auth` |
| `errorHandler` | `errorHandler` (unchanged) |

These only matter if you import middleware directly. If you only use `expx.mount(app)`, no changes are needed.

## Dependency Changes

### Removed dependencies

- `mariadb` — Install your database dialect driver yourself (`npm install mariadb`)

  Pin it below `3.5.1`. From that version the driver is ESM only, and Sequelize is CommonJS, so `require('mariadb')` fails on Node 18 with `ERR_REQUIRE_ESM`.

### Updated dependencies

Dependencies that crossed a major version:

| Package | v4 | v5 | Breaking changes |
|---------|----|----|------------------|
| `connect-redis` | ^7.1.0 | ^9.0.0 | Named import: `import {RedisStore} from 'connect-redis'` |
| `redis` | ^4.6.8 | ^5.11.0 | Only relevant if you use Redis session storage |
| `express-handlebars` | ^7.1.3 | ^8.0.6 | — |
| `glob` | ^10.3.12 | ^13.0.6 | Ships its own types (`@types/glob` no longer needed) |
| `dotenv` | ^8.2.0 | ^17.3.1 | — |

`express`, `sequelize` and `multer` did not change major version.

## Configuration Files

No changes to configuration file format. All `config/*.js` files work the same as v4.

## Model API

No breaking changes. All `Model` methods (`findById`, `begin`, `query`, `association`, etc.) work the same.

## Handlebars Helpers

All helpers have the same API. The only change is the namespace:

```js
// v4
expx.handlebars_helpers.comparison.eq
expx.handlebars_helpers.date.formatDate

// v5
expx.helpers.comparison.eq
expx.helpers.date.formatDate
```

Helpers are auto-registered in templates — no code change needed for template usage.

## Quick Migration Checklist

1. Update import namespaces (`services.Authentication` → `Authentication`, etc.)
2. Install your database dialect driver if not already present (`npm install mariadb`)
3. Remove `@types/glob` from devDependencies if present
4. Test your `config/authentication.js` — no format changes, but verify with the updated connect-redis
