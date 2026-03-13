# Authentication

Express Sweet integrates Passport.js with a local (username/password) strategy, session management, and automatic route protection.

## How It Works

1. **Login** — User submits credentials → `authenticate_user` hook validates → session created
2. **Session** — On each request, session cookie is read → `subscribe_user` loads user data into `req.user`
3. **Route protection** — Unauthenticated requests are redirected to `failure_redirect` (or receive 401 for AJAX)
4. **Whitelist** — URLs matching `allow_unauthenticated` patterns bypass protection

## Configuration

Create `config/authentication.js`:

```js
import UserModel from '../models/UserModel.js';

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

  authenticate_user: async (username, password, req) => {
    // Return user object on success, null on failure.
    // User object MUST include an `id` property.
    return UserModel.findOne({
      where: { email: username, password },
      raw: true,
    });
  },

  subscribe_user: async (id) => {
    // Called on every request to load user into req.user and res.locals.session.
    return UserModel.findOne({ where: { id }, raw: true });
  },

  allow_unauthenticated: ['/login', '/api/login'],
  expiration: 24 * 3600000,
};
```

Full option reference → [configuration.md](configuration.md#authenticationjs)

## Login

Use `expx.Authentication.authenticate()` in your login route:

```js
// routes/login.js
import { Router } from 'express';
import * as expx from 'express-sweet';

const router = Router();

// Render login page
router.get('/', (req, res) => {
  res.render('login');
});

// Handle login (JSON response)
router.post('/api/login', async (req, res, next) => {
  const ok = await expx.Authentication.authenticate(req, res, next);
  res.json({ success: ok });
});

// Handle login (redirect)
router.post('/', async (req, res, next) => {
  const ok = await expx.Authentication.authenticate(req, res, next);
  if (ok)
    await expx.Authentication.successRedirect(res);
  else
    await expx.Authentication.failureRedirect(req, res);
});

export default router;
```

## Logout

```js
router.get('/logout', (req, res) => {
  expx.Authentication.logout(req);
  res.redirect('/');
});
```

## Authentication API

| Method | Returns | Description |
|--------|---------|-------------|
| `authenticate(req, res, next)` | `Promise<boolean>` | Authenticate using credentials from `req.body`. Returns `true` on success. |
| `logout(req)` | `void` | Clear the user session. |
| `successRedirect(res)` | `Promise<void>` | Redirect to `success_redirect` URL from config. |
| `failureRedirect(req, res)` | `Promise<void>` | Redirect to `failure_redirect` URL from config. |

## Route Protection

When authentication is enabled, all routes are protected by default. Unauthenticated users are:

- **HTML requests** — Redirected to `failure_redirect` (login page)
- **AJAX requests** — Returned 401 Unauthorized

The login page itself is always accessible (no redirect loop).

### Whitelisting URLs

Use `allow_unauthenticated` to bypass protection for specific routes:

```js
allow_unauthenticated: [
  '/api/login',       // String: partial match (matches any URL containing this string)
  '/public',          // Matches /public, /public/about, etc.
  /^\/api\/v2\//,     // RegExp: regex test on the path
],
```

### AJAX Detection

By default, AJAX is detected via `req.xhr` (checks for `X-Requested-With: XMLHttpRequest` header). Customize in `config.js`:

```js
is_ajax: req => {
  // Treat all /api/ requests as AJAX
  return /^\/api/.test(req.path);
},
```

## Session Data in Views

When a user is authenticated, their data is available in Handlebars templates via `session`:

```handlebars
<p>Welcome, {{session.name}}</p>
{{#if (eq session.role 'admin')}}
  <a href="/admin">Admin Panel</a>
{{/if}}
```

## Redis Session Store

For production environments, use Redis instead of memory sessions:

```js
// config/authentication.js
export default {
  session_store: 'redis',
  redis_host: 'redis://localhost:6379',
  // ...
};
```

The `redis` package is already included as a dependency of Express Sweet.

## Dynamic Failure Redirect

The `failure_redirect` option supports a function for dynamic redirect URLs:

```js
failure_redirect: (req, res) => {
  // Redirect admin users to a different login page
  return req.cookies.role === 'admin' ? '/admin/login' : '/login';
},
```
