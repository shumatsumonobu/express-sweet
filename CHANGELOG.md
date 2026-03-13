# Changelog

Every release that matters, documented here.

## [5.0.0] - 2026-03-13

The biggest release yet. Cleaner API surface, proper documentation, and a leaner dependency tree.

### Breaking Changes

- **Flatter imports** — No more digging into nested namespaces.

  | Before (v4) | After (v5) |
  |-------------|------------|
  | `expx.services.Authentication` | `expx.Authentication` |
  | `expx.middlewares.*` | `expx.middleware.*` |
  | `expx.interfaces.*` | `expx.types.*` |
  | `expx.handlebars_helpers.*` | `expx.helpers.*` |

- **Shorter middleware names** — Internal middleware functions renamed for consistency: `corsPolicy` → `cors`, `envLoader` → `env`, `globalVariables` → `globals`, `httpParser` → `parser`, `localVariables` → `locals`, `viewEngine` → `views`, `urlRouter` → `router`, `authentication` → `auth`. Only matters if you import middleware directly; `mount()` users are unaffected.

- **`mariadb` no longer bundled** — Install your own dialect driver (`npm install mariadb`, `mysql2`, `pg`, etc.).

### Changed

- **Dependencies updated** — connect-redis v9, glob v13, dotenv v17, multer v2. No config changes needed on your end.

### Added

- **Full documentation suite** — Hand-written reference docs covering every config option, every helper, every API method. See [docs/](docs/).
- **Migration guide** — Step-by-step upgrade path from v4. See [docs/migration-v5.md](docs/migration-v5.md).
- **Config examples** — Ready-to-use ESM and CJS config templates in [examples/](examples/). Copy, fill in your values, done.
- **Demo app** — Full-featured sample app with auth, CRUD, file uploads, and error pages. Both ESM and CommonJS versions included. See [demo/](demo/).

## [4.0.0] - 2025-12-19

Express 5 lands. File uploads get first-class support. Middleware goes functional.

### Breaking Changes

- **Express 5** — Requires Node.js 18+. Route regex syntax changed: `/:param(\\d+)` is out, named capture groups are in.

  ```js
  // Express 4
  router.get('/:userId(\\d+)', handler);

  // Express 5
  router.get(/^\/(?<userId>\d+)$/, handler);
  ```

  See the [Express 5 migration guide](https://expressjs.com/en/guide/migrating-5.html) for full details.

- **Function-based middleware** — All middleware refactored from classes to plain functions. Internal change only; `mount()` handles everything automatically.

### Added

- **File uploads** — Multer integration with per-route middleware resolution. Configure once in `config/upload.js`, and uploads just work. Single files, arrays, multiple fields, memory or disk storage.

### Fixed

- **Invalid Host header** — No more `ERR_INVALID_URL` crashes. `baseUrl` gracefully falls back to `undefined` when URL construction fails.

## [3.0.2] - 2025-11-28

### Changed

- **CORS expanded** — Added support for `Authorization`, `Cache-Control`, `If-None-Match`, `If-Modified-Since`, `Range`, and `X-CSRF-Token` headers. OPTIONS preflight handled automatically.

## [3.0.1] - 2025-09-02

### Changed

- Added pool configuration examples to sample database configs.

## [3.0.0] - 2025-08-26

Database layer rebuilt from the ground up. One connection pool, shared across all models.

### Breaking Changes

- **`Database` class removed** — Replaced by `DatabaseManager` singleton. All models share a single connection for better performance.

  ```js
  // Before
  const config = await expx.utils.loadDatabaseConfig();
  const db = new expx.database.Database(config.database, config.username, config.password, config);

  // After
  const db = await expx.database.DatabaseManager.getInstance();
  ```

### Added

- **DatabaseManager** — Full lifecycle control: `getInstance()`, `isConnected()`, `getConfig()`, `getSequelizeOptions()`, `close()`.
- **HTTP logging** — Morgan support via `config/logging.js`. Pick your format (`combined`, `dev`, `tiny`, etc.) and optionally skip routes like `/health`.

### Changed

- Updated Sequelize to v6.37.7.

## [2.0.9] - 2025-08-12

### Added

- `Database.getConfig()` — Retrieve the current database configuration at runtime.

### Changed

- Updated Multer to v2.0.2.

## [2.0.8] - 2025-07-29

### Changed

- Documentation improvements for `Database.isConnect()`.

## [2.0.7] - 2025-07-22

### Changed

- Security updates across core dependencies: Express 4.21.2, express-session 1.18.2, body-parser 2.2.0, cookie-parser 1.4.7, morgan 1.10.1.

## [2.0.6] - 2025-02-09

### Fixed

- Logout redirect now works correctly when the redirect URL contains query parameters.

## [2.0.5] - 2025-02-04

### Added

- **`stripTags` helper** — Strip or selectively keep HTML tags in templates. Supports allowlists and custom replacement characters.

## [2.0.4] - 2025-01-14

### Added

- **`findObjectInArray` helper** — Look up objects in an array by field value, right from your templates.

## [2.0.3] - 2024-09-03

### Breaking Changes

- **Template engine switched** — Moved from `express-hbs` to `express-handlebars`. `block` and `contentFor` helpers preserved for backward compatibility.
- **Database class instantiation** — `Database` is now a class you instantiate, not a static singleton.
- **Async everywhere** — All middleware, config loaders, and services now return Promises.

### Changed

- Full ESM compliance. Dynamic imports replace `require()`.
- Updated Passport.js to v0.7.0.

## [2.0.2] - 2024-09-01

### Changed

- Updated Express to 4.19.2, Rollup to v4.
- Build output renamed: `build.common.js` → `build.cjs`, `build.esm.js` → `build.mjs`.
- Express is now a peer dependency — install it yourself for version flexibility.

## [2.0.1] - 2024-04-05

### Changed

- Removed `nodejs-shared` dependency.

## [2.0.0] - 2024-03-24

### Breaking Changes

- **AWS SDK removed** — `AWSRekognitionClient` and `AWSSesClient` moved to the [aws-sdk-extension](https://www.npmjs.com/package/aws-sdk-extension) package.

## [1.1.1] - 2024-03-23

### Changed

- Added a warning when secure cookies are used over HTTP — catches a common misconfiguration before it bites you.

## [1.1.0] - 2024-03-06

### Changed

- Dependency updates: Express 4.18.3, Multer 1.4.5-lts.1, express-session 1.18.0, Sequelize 6.37.1, mariadb 3.2.3, Moment.js 2.30.1.

## [1.0.44] - 2023-12-30

### Added

- Session cookie `Secure` and `HttpOnly` flags are now configurable via `config/authentication.js`.

## [1.0.43] - 2023-12-30

### Added

- Session cookie name is now configurable.

## [1.0.42] - 2023-08-31

### Changed

- TypeScript 5.2.2. Updated Redis (v4.6.8) and connect-redis (v7.1.0).

## [1.0.41] - 2023-08-04

### Changed

- Face search now supports an option to throw on missing or multiple face matches.

## [1.0.40] - 2023-08-04

### Fixed

- Face search returns `null` instead of throwing when no face is found in the image.

## [1.0.39] - 2023-07-24

### Changed

- AWS Rekognition error classes renamed for clarity: consistent `Face` prefix with `Failed`/`Missing`/`Multiple` suffixes.

## [1.0.38] - 2023-07-17

### Fixed

- Login user data is now accessible in the `beforeRender` view hook.

## [1.0.37] - 2023-07-17

### Added

- `beforeRender` hook now supports async functions.
- **Math helpers** — `add`, `sub`, `multiply`, `divide`, `ceil`, `floor`, `abs` available in templates.

## [1.0.36] - 2023-07-12

### Changed

- `is_ajax` option moved from `config/authentication.js` to `config/config.js`.
- Error handling replaced with hookable `hook_handle_error` for full control over error responses.

## [1.0.35] - 2023-07-11

### Changed

- `failure_redirect` now accepts a function for dynamic redirect URLs.
- `Authentication.failureRedirect()` takes both `req` and `res` (was `res` only).

## [1.0.34] - 2023-07-01

### Fixed

- Unauthenticated AJAX requests now return 401 (was 403).

## [1.0.33] - 2023-07-01

### Added

- **`regexMatch` helper** — Regex pattern matching in templates.

## [1.0.32] - 2023-07-01

### Fixed

- Cookies are now accessible in `beforeRender` hook.

## [1.0.31] - 2023-06-29

### Breaking Changes

- **Helper names switched to camelCase** — `not_empty` → `notEmpty`, `format_date` → `formatDate`, `cache_busting` → `cacheBusting`, `json_stringify` → `jsonStringify`, `json_parse` → `jsonParse`, `format_bytes` → `formatBytes`.

### Added

- **`number2locale` helper** — Locale-aware number formatting in templates.

## [1.0.30] - 2023-06-26

### Fixed

- AWS Rekognition credentials passing corrected.

## [1.0.29] - 2023-06-20

### Added

- **AWS SES client** — Send emails via Amazon SES.

### Changed

- Class internals switched from soft private (`_var`) to hard private (`#var`).

## [1.0.28] - 2023-06-16

### Changed

- AWS SDK upgraded from v2 to v3.

## [1.0.27] - 2023-06-12

### Changed

- `beforeRender` hook now receives the request object for accessing request data during rendering.

## [1.0.26] - 2023-06-11

### Changed

- Sequelize upgraded from v5 to v6.
- Debug logging now requires `SWEET_DEBUG=true` in your `.env` file.

## [1.0.25] - 2022-11-24

### Added

- **`formatBytes` helper** — Human-readable byte sizes in templates (`1024` → `1KB`).

## [1.0.24] - 2022-10-24

### Added

- AJAX request detection option in authentication config for custom XHR/fetch handling.

## [1.0.23] - 2022-10-20

### Added

- `authenticate_user` callback now receives the full request object as its third parameter.

## [1.0.22] - 2022-07-27

### Added

- **`beforeRender` hook** — Set local variables available in every view, right before rendering.

## [1.0.21] - 2022-05-26

### Added

- Face indexing can now return details: gender, emotion, age group.

## [1.0.20] - 2022-05-25

### Added

- Face detection can now return details: emotion, gender, age group.

## [1.0.19] - 2022-05-20

### Added

- **`formatDate` helper** — Moment.js date formatting in templates.

## [1.0.18] - 2022-05-18

### Added

- **Redis session store** — Store authentication sessions in Redis instead of memory. Just set `session_store: 'redis'` in your auth config.

## [1.0.17] - 2022-05-17

### Changed

- Documentation and variable naming improvements.

## [1.0.16] - 2022-02-14

### Fixed

- Missing build files added to the published package.

## [1.0.15] - 2022-02-14

### Changed

- `allow_unauthenticated` now accepts RegExp patterns alongside strings.

## [1.0.14] - 2022-01-17

### Changed

- `empty` helper now works with any type, not just arrays.

## [1.0.13] - 2021-12-13

### Added

- `Model.begin()` now accepts transaction options (isolation level, type).

## [1.0.12] - 2021-11-16

### Added

- **`Model.query()` — Raw SQL execution.** Run prepared statements and typed queries directly from your models.

## [1.0.11] - 2021-11-10

### Fixed

- Database config now loads after `NODE_ENV` is set, ensuring the correct environment config is used.

## [1.0.10] - 2021-10-19

### Changed

- Face search results now include similarity scores.

## [1.0.9] - 2021-10-13

### Changed

- Updated `sharp` to v0.29.1 — statically linked libvips, no more Python dependency.

## [1.0.8] - 2021-09-25

### Fixed

- Default router is now accessible from its own endpoint URL.

## [1.0.7] - 2021-08-13

### Added

- `Model.where()` — Create WHERE conditions on function results.

## [1.0.6] - 2021-08-13

### Added

- `Model.fn()`, `Model.col()`, `Model.literal()` — SQL functions, column references, and raw literals in queries.

## [1.0.5] - 2021-08-12

### Changed

- Multipart field size limit removed (was 1MB, now unlimited).

## [1.0.4] - 2021-06-13

### Fixed

- `app.locals.currentPath` now reflects the actual current URL, not the referrer.

## [1.0.3] - 2021-06-13

### Changed

- `app.locals.currentPath` is now a clean pathname without query string or fragment.

## [1.0.2] - 2021-06-10

### Fixed

- Model preloading now works correctly in CommonJS environments.

### Changed

- Updated Rollup to v2.51.

## [1.0.1] - 2021-06-02

### Fixed

- ESM default export options now load correctly.

## [1.0.0] - 2021-05-31

Initial release. Express.js extension library with Sequelize ORM, Passport.js authentication, Handlebars views, file-based routing, and AWS Rekognition integration.

[1.0.0]: https://github.com/shumatsumonobu/express-sweet/releases/tag/v1.0.0
[1.0.1]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.2...v1.0.3
[1.0.4]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.3...v1.0.4
[1.0.5]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.4...v1.0.5
[1.0.6]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.5...v1.0.6
[1.0.7]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.6...v1.0.7
[1.0.8]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.7...v1.0.8
[1.0.9]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.8...v1.0.9
[1.0.10]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.9...v1.0.10
[1.0.11]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.10...v1.0.11
[1.0.12]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.11...v1.0.12
[1.0.13]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.12...v1.0.13
[1.0.14]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.13...v1.0.14
[1.0.15]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.14...v1.0.15
[1.0.16]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.15...v1.0.16
[1.0.17]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.16...v1.0.17
[1.0.18]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.17...v1.0.18
[1.0.19]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.18...v1.0.19
[1.0.20]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.19...v1.0.20
[1.0.21]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.20...v1.0.21
[1.0.22]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.21...v1.0.22
[1.0.23]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.22...v1.0.23
[1.0.24]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.23...v1.0.24
[1.0.25]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.24...v1.0.25
[1.0.26]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.25...v1.0.26
[1.0.27]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.26...v1.0.27
[1.0.28]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.27...v1.0.28
[1.0.29]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.28...v1.0.29
[1.0.30]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.29...v1.0.30
[1.0.31]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.30...v1.0.31
[1.0.32]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.31...v1.0.32
[1.0.33]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.32...v1.0.33
[1.0.34]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.33...v1.0.34
[1.0.35]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.34...v1.0.35
[1.0.36]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.35...v1.0.36
[1.0.37]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.36...v1.0.37
[1.0.38]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.37...v1.0.38
[1.0.39]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.38...v1.0.39
[1.0.40]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.39...v1.0.40
[1.0.41]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.40...v1.0.41
[1.0.42]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.41...v1.0.42
[1.0.43]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.42...v1.0.43
[1.0.44]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.43...v1.0.44
[1.1.0]: https://github.com/shumatsumonobu/express-sweet/compare/v1.0.44...v1.1.0
[1.1.1]: https://github.com/shumatsumonobu/express-sweet/compare/v1.1.0...v1.1.1
[2.0.0]: https://github.com/shumatsumonobu/express-sweet/compare/v1.1.1...v2.0.0
[2.0.1]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.0...v2.0.1
[2.0.2]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.1...v2.0.2
[2.0.3]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.2...v2.0.3
[2.0.4]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.3...v2.0.4
[2.0.5]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.4...v2.0.5
[2.0.6]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.5...v2.0.6
[2.0.7]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.6...v2.0.7
[2.0.8]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.7...v2.0.8
[2.0.9]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.8...v2.0.9
[3.0.0]: https://github.com/shumatsumonobu/express-sweet/compare/v2.0.9...v3.0.0
[3.0.1]: https://github.com/shumatsumonobu/express-sweet/compare/v3.0.0...v3.0.1
[3.0.2]: https://github.com/shumatsumonobu/express-sweet/compare/v3.0.1...v3.0.2
[4.0.0]: https://github.com/shumatsumonobu/express-sweet/compare/v3.0.2...v4.0.0
[5.0.0]: https://github.com/shumatsumonobu/express-sweet/compare/v4.0.0...v5.0.0
