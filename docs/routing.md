# Routing

Express Sweet uses **file-based routing**. Instead of manually registering routes, you create files in the `routes/` directory and they are automatically mapped to URL endpoints.

## How It Works

The router scans `routes/` (or the directory set by `router_dir` in `config.js`) and maps each file to a URL based on its path:

```
routes/
  home.js              → /home
  about.js             → /about
  api/
    users.js           → /api/users
    posts.js           → /api/posts
  admin/
    dashboard.js       → /admin/dashboard
    settings.js        → /admin/settings
```

Filenames are lowercased automatically (`UserProfile.js` → `/userprofile`).

## Route Files

Each route file exports an Express `Router` as the default export:

```js
// routes/api/users.js
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json([]);
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

router.post('/', (req, res) => {
  res.json({ created: true });
});

router.put('/:id', (req, res) => {
  res.json({ updated: true });
});

router.delete('/:id', (req, res) => {
  res.json({ deleted: true });
});

export default router;
```

This file handles:
- `GET /api/users` — List all users
- `GET /api/users/123` — Get user by ID
- `POST /api/users` — Create a user
- `PUT /api/users/123` — Update a user
- `DELETE /api/users/123` — Delete a user

## Default Router

Set `default_router` in `config.js` to mount a route on both its normal URL and the root (`/`):

```js
// config/config.js
export default {
  default_router: '/home',
};
```

With this config, `routes/home.js` handles both `/home` and `/`.

## Rendering Views

Route handlers can render Handlebars templates:

```js
// routes/home.js
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    items: ['Apple', 'Banana', 'Cherry'],
  });
});

export default router;
```

## File Upload Routes

When `config/upload.js` is enabled, Multer middleware is automatically injected into route stacks. Multipart form data is parsed before your handler runs — no manual middleware wiring needed.

```js
// routes/api/avatar.js
import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  // req.file is available thanks to automatic Multer injection
  const { buffer, mimetype, originalname } = req.file;
  res.json({ filename: originalname, size: buffer.length });
});

export default router;
```

The upload behavior is controlled by `resolve_middleware` in `config/upload.js`. See [file-upload.md](file-upload.md) for details.

## Configuration

| Option | Where | Description |
|--------|-------|-------------|
| `router_dir` | `config.js` | Absolute path to the routes directory. Default: `<cwd>/routes` |
| `default_router` | `config.js` | Route that also handles `/`. Default: none |
