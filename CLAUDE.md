# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Express Sweet is a full-stack toolkit built on top of Express.js. Auth, ORM, routing, views — everything snaps together so you can ship fast and stay sharp. Built as a TypeScript library that compiles to both ESM and CommonJS formats.

## Build Commands

- **Build**: `npm run build` — Compiles TypeScript source to dist/ (ESM/CJS) and generates types/
- **Clean**: Automatically runs `rm -rf dist types` before build via prebuild script

## Architecture Overview

### Core Mount System
The library uses a centralized mounting system (`src/mount.ts`) that initializes all middleware in a specific order:
1. Global variables setup
2. Environment loading (`.env`, then the `hook_after_env_load` hook)
3. Database models initialization
4. HTTP middleware (body parsing, cookies, static files, logging)
5. View engine (Handlebars)
6. CORS
7. Local variables
8. Authentication (Passport.js)
9. File-based URL routing
10. Error handling

### Key Directories

- **`src/middleware/`** — Express middleware components (auth, cors, error, parser, router, views, etc.)
- **`src/database/`** — Sequelize-based ORM with DatabaseManager singleton and custom Model class
- **`src/helpers/`** — Handlebars template helpers (comparison, date, math, string, etc.)
- **`src/utils/`** — Type checking functions and config loaders
- **`src/types/`** — TypeScript interface definitions
- **`docs/`** — Hand-written reference documentation (configuration, database, authentication, routing, view-engine, file-upload, migration)
- **`examples/`** — Ready-to-use config templates (ESM and CJS)
- **`demo/`** — Full-featured demo app (ESM and CJS versions) with auth, CRUD, file uploads, and error pages

### Configuration System
The library expects configuration files in a consuming application's `config/` directory:
- `config/config.js` — App basics (CORS, body size, routing, environment post-processing, error handling)
- `config/database.js` — Sequelize connection settings (environment-based)
- `config/authentication.js` — Passport.js auth settings
- `config/view.js` — Handlebars view engine settings
- `config/logging.js` — Morgan HTTP request logging
- `config/upload.js` — Multer file upload configuration

### Database Layer
- `DatabaseManager` singleton manages a single Sequelize instance across all models
- 5 public methods: `getInstance()`, `isConnected()`, `getConfig()`, `getSequelizeOptions()`, `close()`
- Custom `Model` class with `findById()`, `begin()`, `query()`, `association()`, and Sequelize utilities (`Op`, `fn`, `col`, `literal`, `where`, `DataTypes`, `QueryTypes`, `Transaction`)
- Automatic model loading from `models/` directory
- All models share the same connection pool

### Authentication System
- Passport.js local strategy with username/password
- Session management with Redis or memory store
- 4 static methods on `Authentication` class: `authenticate()`, `logout()`, `successRedirect()`, `failureRedirect()`
- Automatic route protection with `allow_unauthenticated` patterns
- AJAX requests get 401, HTML requests get redirected

### View Engine
- Handlebars via express-handlebars with 37 built-in helpers across 9 categories
- `beforeRender` hook for setting view-wide local variables
- `block`/`contentFor` helpers for layout content injection

## TypeScript Configuration

Uses path mapping with `~/*` alias pointing to `src/*` for clean imports. Targets ESNEXT with strict type checking enabled.

## Build System

Rollup-based build with:
- TypeScript compilation via rollup-plugin-typescript2
- Terser minification
- CommonJS (.cjs) and ESM (.mjs) dual output
- Node.js built-ins and all dependencies automatically externalized
- Type declaration generation to types/

## Development Notes

- The library is designed to be consumed, not developed as a standalone application
- No test scripts are configured — testing happens in consuming applications
- Uses semantic versioning with comprehensive changelog
- MIT licensed
- User prefers Japanese communication
- Documentation lives in hand-written markdown (README + docs/), not TypeDoc
