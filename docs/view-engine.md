# View Engine

Express Sweet uses [Handlebars](https://handlebarsjs.com/) as its template engine via [express-handlebars](https://github.com/express-handlebars/express-handlebars). It comes with 37 built-in helpers that are automatically registered.

## Configuration

Create `config/view.js`:

```js
import path from 'node:path';

export default {
  views_dir: path.join(process.cwd(), 'views'),
  partials_dir: path.join(process.cwd(), 'views/partials'),
  layouts_dir: path.join(process.cwd(), 'views/layout'),
  default_layout: path.join(process.cwd(), 'views/layout/default.hbs'),
  extension: '.hbs',
  beforeRender: (req, res) => {
    res.locals.extra = 'value available in all views';
  },
};
```

## Directory Structure

```
views/
  layout/
    default.hbs          # Default layout
  partials/
    header.hbs           # Reusable partial
    footer.hbs
  home.hbs               # Page template
  errors/
    404.hbs
    500.hbs
```

## Layouts

The default layout wraps all pages. Use `{{{body}}}` to render page content:

```handlebars
<!-- views/layout/default.hbs -->
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  {{{block "pageStyles"}}}
</head>
<body>
  {{> header}}
  {{{body}}}
  {{> footer}}
  {{{block "pageScripts"}}}
</body>
</html>
```

## Content Blocks

Use `contentFor` and `block` to inject page-specific content into layout placeholders:

```handlebars
<!-- views/home.hbs -->
{{#contentFor "pageStyles"}}
  <link rel="stylesheet" href="/css/home.css">
{{/contentFor}}

{{#contentFor "pageScripts"}}
  <script src="/js/home.js"></script>
{{/contentFor}}

<h1>Welcome</h1>
```

## beforeRender Hook

The `beforeRender` function in `config/view.js` runs before every render. Use it to set variables available in all templates:

```js
beforeRender: (req, res) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.isLoggedIn = !!req.user;
},
```

## Built-in Helpers

### Comparison

| Helper | Description | Example |
|--------|-------------|---------|
| `eq` | Strict equality (`===`) | `{{#if (eq status 'active')}}...{{/if}}` |
| `eqw` | Loose equality (`==`) | `{{#if (eqw id '123')}}...{{/if}}` |
| `neq` | Strict inequality (`!==`) | `{{#if (neq status 'closed')}}...{{/if}}` |
| `neqw` | Loose inequality (`!=`) | `{{#if (neqw val1 val2)}}...{{/if}}` |
| `lt` | Less than (`<`) | `{{#if (lt age 18)}}Minor{{/if}}` |
| `lte` | Less than or equal (`<=`) | `{{#if (lte count max)}}...{{/if}}` |
| `gt` | Greater than (`>`) | `{{#if (gt score 100)}}High{{/if}}` |
| `gte` | Greater than or equal (`>=`) | `{{#if (gte count min)}}...{{/if}}` |
| `not` | Logical NOT | `{{#if (not isDisabled)}}Enabled{{/if}}` |
| `ifx` | Ternary operator | `{{ifx isActive 'Yes' 'No'}}` |
| `empty` | Check if value is empty | `{{#if (empty items)}}No items{{/if}}` |
| `notEmpty` | Check if value is not empty | `{{#if (notEmpty items)}}Has items{{/if}}` |
| `count` | Array length | `{{count items}}` |
| `and` | Logical AND (all truthy) | `{{#if (and isLoggedIn isAdmin)}}...{{/if}}` |
| `or` | Logical OR (any truthy) | `{{#if (or hasError hasWarning)}}...{{/if}}` |
| `coalesce` | First truthy value | `{{coalesce nickname username 'Anonymous'}}` |
| `includes` | Array contains value | `{{#if (includes roles 'admin')}}...{{/if}}` |
| `regexMatch` | Regex test | `{{#if (regexMatch url '^https://' 'i')}}Secure{{/if}}` |

### Math

| Helper | Description | Example |
|--------|-------------|---------|
| `add` | Addition | `{{add price tax}}` |
| `sub` | Subtraction | `{{sub total discount}}` |
| `multiply` | Multiplication | `{{multiply quantity unitPrice}}` |
| `divide` | Division | `{{divide total count}}` |
| `ceil` | Round up | `{{ceil 5.1}}` → `6` |
| `floor` | Round down | `{{floor 5.9}}` → `5` |
| `abs` | Absolute value | `{{abs -5.6}}` → `5.6` |

### String

| Helper | Description | Example |
|--------|-------------|---------|
| `replace` | Replace first match | `{{replace title 'old' 'new'}}` |
| `split` | Split string to array | `{{#each (split "a,b,c" ",")}}{{this}}{{/each}}` |
| `formatBytes` | Human-readable byte size | `{{formatBytes 1024}}` → `1KB` |

`formatBytes` accepts an optional `decimals` parameter: `{{formatBytes 1234 2}}` → `1.21KB`

### Date

| Helper | Description | Example |
|--------|-------------|---------|
| `formatDate` | Format date with Moment.js | `{{formatDate 'YYYY/MM/DD' createdAt}}` |

Parameters:
- `format` — Moment.js format string (e.g., `'YYYY-MM-DD'`, `'HH:mm:ss'`, `'MMMM D, YYYY'`)
- `date` — Date value to format (current date if omitted)
- `locale` — Optional BCP 47 locale (e.g., `'ja'`, `'en-US'`)

```handlebars
{{formatDate 'YYYY/MM/DD' createdAt}}
{{formatDate 'MMMM D, YYYY' createdAt 'en'}}
{{formatDate 'YYYY年M月D日' createdAt 'ja'}}
```

### Number

| Helper | Description | Example |
|--------|-------------|---------|
| `number2locale` | Locale-formatted number | `{{number2locale 123456.789}}` → `123,456.789` |

Parameters:
- `val` — Number or numeric string
- `locales` — Optional BCP 47 locale (e.g., `'en-US'`, `'de-DE'`)

```handlebars
{{number2locale price 'en-US'}}
{{number2locale amount 'de-DE'}}
```

### HTML

| Helper | Description | Example |
|--------|-------------|---------|
| `cacheBusting` | Append timestamp query param to asset URL | `{{cacheBusting '/css/style.css'}}` |
| `stripTags` | Remove HTML tags | `{{{stripTags htmlContent}}}` |

`cacheBusting` reads the file's modification time from disk and appends it as a query parameter to force browser cache refresh:

```handlebars
<link rel="stylesheet" href="{{cacheBusting '/css/style.css'}}">
<!-- Output: /css/style.css?1620526340463 -->

<!-- With CDN base URL -->
<script src="{{cacheBusting '/js/app.js' '//cdn.example.com'}}"></script>
<!-- Output: //cdn.example.com/js/app.js?1620526340463 -->
```

`stripTags` accepts optional allowlist and replacement:

```handlebars
{{!-- Remove all tags --}}
{{{stripTags '<p>Hello <strong>world</strong></p>'}}}
<!-- Output: Hello world -->

{{!-- Keep <strong> tags --}}
{{{stripTags '<p>Hello <strong>world</strong></p>' '<strong>'}}}
<!-- Output: Hello <strong>world</strong> -->

{{!-- Replace tags with a character --}}
{{{stripTags '<p>Hello</p>' [] '*'}}}
<!-- Output: *Hello* -->
```

### Array

| Helper | Description | Example |
|--------|-------------|---------|
| `findObjectInArray` | Find object by field value | `{{lookup (findObjectInArray categories 'id' categoryId) 'name'}}` |

```handlebars
{{!-- Cross-reference related data --}}
{{#each orders}}
  {{lookup (findObjectInArray ../users 'id' this.userId) 'name'}}
{{/each}}
```

### Object

| Helper | Description | Example |
|--------|-------------|---------|
| `jsonStringify` | Convert to JSON string | `<script>var data = {{{jsonStringify config}}};</script>` |
| `jsonParse` | Parse JSON string | `{{#with (jsonParse jsonString)}}{{this.name}}{{/with}}` |

`jsonStringify` accepts an optional indent parameter: `{{{jsonStringify data 2}}}` for pretty-printed output.

### Layout

| Helper | Description | Example |
|--------|-------------|---------|
| `block` | Declare a named placeholder in layout | `{{{block "pageScripts"}}}` |
| `contentFor` | Inject content into a named block | `{{#contentFor "pageScripts"}}...{{/contentFor}}` |

See the [Layouts](#layouts) section above for usage.
