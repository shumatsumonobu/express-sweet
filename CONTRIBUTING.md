# Contributing

How to build Express Sweet and run its demos locally.

## Requirements

Building needs a newer Node than running does:

| What | Minimum Node | Why |
|------|--------------|-----|
| Running the built library | 18 | Declared in `engines`, and verified by the demos |
| Building `dist/` and `types/` | 20.10 | `@rollup/plugin-terser` needs 20, import attributes in `rollup.config.js` need 20.10 |

Only the first row concerns people who install Express Sweet from npm. Several dependencies declare Node 20 or 22 in their own `engines` — `express-handlebars` asks for 22.22.2 — so `npm install` prints EBADENGINE warnings on Node 18. They are advisory: the demos run there, views render, and the database connects.

Building on Node 18 does fail, in two places:

1. `rollup.config.js` uses `import ... with {type: "json"}`, which Node 18 cannot parse
2. `serialize-javascript`, pulled in by `@rollup/plugin-terser`, calls the global `crypto`, which Node 18 does not expose without `--experimental-global-webcrypto`

Both can be worked around, but there is no reason to: the build container pins Node 22, and the published package is prebuilt, so nobody installing from npm ever runs Rollup.

If your machine has an older Node, use the Docker setup below instead of installing anything.

## Docker

`docker/Dockerfile` builds an Amazon Linux 2023 image, matching the production environment, with the Node version passed in as a build argument. There are three compose files, because building and running need different Node versions and each demo runs on its own.

Build the library first, from the repository root:

```bash
docker compose run --rm build
```

Then run either demo:

```bash
cd demo/esm && docker compose up     # http://localhost:3000
cd demo/cjs && docker compose up     # http://localhost:3001
```

The build container runs Node 22.23.2, the demo containers Node 18.20.8. The demos install only the library's runtime dependencies (`npm ci --omit=dev`), which reproduces what someone installing Express Sweet from npm ends up with. That combination is the check on the `engines` field: if a demo stops working there, `>=18.0.0` is claiming more than the code delivers.

The two demos have separate compose files rather than one with two services. They would otherwise share a `node_modules` volume and run `npm ci` against it concurrently, and `npm ci` wipes the directory before installing.

Because the compose files are separate, the demos do not wait for a build. Run the build first — `dist/` has to exist.

The repository is bind mounted at `/app`, and every `node_modules` directory is a named volume layered on top of that mount, so the host's copies are not shadowed.

A demo links to the repository root, and Node resolves that symlink to its real path, so `express` and `sequelize` are looked up in `/app/node_modules` rather than in the demo's own directory. Sequelize loads the dialect driver from alongside itself, so `mariadb` is symlinked there from the demo's copy.

Each demo also starts a MariaDB container and seeds it from `ddl.sql` on first run. Later runs skip both installing and seeding.

The demos pin `mariadb` to an exact `3.4.5` rather than a range. From `3.5.1` the driver is ESM only, and Sequelize is CommonJS, so `require('mariadb')` fails on Node 18 with `ERR_REQUIRE_ESM`. Anything below `3.5.1` works.

## Without Docker

Building needs Node 20.10 or later. Running a demo needs Node 18 or later and a reachable MariaDB server.

```bash
npm install
npm run build
```

For a demo, point `demo/esm/.env` at your server first. `DB_PASSWORD_B64` holds the password base64 encoded — `hook_after_env_load` decodes it — so encode yours rather than pasting it in plain text:

```bash
node -p "Buffer.from('your-password').toString('base64')"
```

Then:

```bash
cd demo/esm
npm install
npm run setup     # creates the table and seeds two users
node app.js
```

The demos declare `"express-sweet": "file:../.."`, so `npm install` symlinks them to the repository root. Re-running `npm run build` at the root is enough to pick up library changes — no reinstall needed in `demo/esm` or `demo/cjs`.

## Layout

| Path | Contents | Generated |
|------|----------|-----------|
| `src/` | TypeScript source | no |
| `dist/` | Rollup output, `build.mjs` and `build.cjs` | yes |
| `types/` | Type declarations | yes |
| `docs/` | Hand-written reference documentation | no |
| `examples/` | Config templates for consuming apps | no |
| `demo/` | Runnable demo apps, ESM and CommonJS | no |
| `docker/` | Development container | no |
| `screenshots/` | README images and the `mount-flow.mmd` diagram source | partly |

Everything in the table is committed, generated output included, because the published package ships prebuilt code. Rebuild `dist/` and `types/` whenever `src/` changes, and include them in the same commit.

## Build details

`npm run build` runs `prebuild` first, which deletes `dist/` and `types/` before Rollup regenerates them. A failed build therefore leaves both directories missing — restore them with `git checkout -- dist types` if you need the previous output back.

The diagram in the README is generated from `screenshots/mount-flow.mmd`:

```bash
npm run diagram
```

## Documentation

Reference docs are hand-written markdown under `docs/`, not generated from JSDoc. When you add a configuration option, update every place that lists options:

- `src/types/` — the interface and its JSDoc
- `src/utils/load*Config.ts` — the default value
- `docs/configuration.md` — the option table
- `examples/esm/` and `examples/cjs/` — the config templates
- `README.md` — the config file summary table
- `CLAUDE.md` — the architecture overview
- `CHANGELOG.md`
