# File Upload

Express Sweet integrates [Multer](https://github.com/expressjs/multer) for handling `multipart/form-data` requests (file uploads and form submissions).

## How It Works

When upload middleware is enabled, Express Sweet automatically injects Multer into every route's middleware stack. For each incoming `multipart/form-data` request:

1. The `resolve_middleware` function is called with the request and the `multer` module
2. If it returns a Multer middleware → that middleware handles the upload
3. If it returns `null` → `multer().none()` is used (parses form fields only, no files)
4. If upload is disabled entirely → `multer().none()` is always used

This means you never need to manually wire up Multer in your route files.

## Configuration

Create `config/upload.js`:

```js
export default {
  enabled: true,
  resolve_middleware: (req, multer) => {
    // Return a Multer middleware for routes that accept files.
    // Return null for everything else.
  },
};
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable upload middleware. |
| `resolve_middleware` | `function` | `undefined` | `(req, multer) => middleware\|null` |

## Examples

### Single file upload

```js
resolve_middleware: (req, multer) => {
  if (req.path === '/api/avatar' && req.method === 'POST') {
    const upload = multer({ storage: multer.memoryStorage() });
    return upload.single('avatar');
  }
  return null;
},
```

In your route handler, the file is available as `req.file`:

```js
router.post('/', (req, res) => {
  const { buffer, mimetype, originalname, size } = req.file;
  // Process the uploaded file...
  res.json({ filename: originalname, size });
});
```

### Multiple files (same field)

```js
resolve_middleware: (req, multer) => {
  if (req.path === '/api/gallery' && req.method === 'POST') {
    const upload = multer({ storage: multer.memoryStorage() });
    return upload.array('photos', 10);   // max 10 files
  }
  return null;
},
```

Files available as `req.files` (array).

### Multiple file fields

```js
resolve_middleware: (req, multer) => {
  if (req.path === '/api/firms' && req.method === 'POST') {
    const upload = multer({ storage: multer.memoryStorage() });
    return upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'eyecatch', maxCount: 1 },
    ]);
  }
  return null;
},
```

Files available as `req.files.logo[0]` and `req.files.eyecatch[0]`.

### Disk storage

```js
resolve_middleware: (req, multer) => {
  if (req.path === '/api/documents' && req.method === 'POST') {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/'),
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    });
    return multer({ storage }).single('document');
  }
  return null;
},
```

### File filtering

```js
resolve_middleware: (req, multer) => {
  if (req.path === '/api/documents' && req.method === 'POST') {
    const upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'));
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },   // 5MB
    });
    return upload.single('document');
  }
  return null;
},
```

### Handling multiple routes

```js
resolve_middleware: (req, multer) => {
  const upload = multer({ storage: multer.memoryStorage() });

  if (req.path === '/api/avatar' && req.method === 'POST')
    return upload.single('avatar');

  if (req.path === '/api/gallery' && req.method === 'POST')
    return upload.array('photos', 10);

  if (req.path === '/api/firms' && req.method === 'POST')
    return upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'eyecatch', maxCount: 1 },
    ]);

  return null;
},
```
