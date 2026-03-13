import fs from 'node:fs';
import path from 'node:path';
import striptags from 'striptags';

/**
 * Appends a cache-busting query parameter (file modification timestamp) to an asset path.
 * This forces browsers to re-fetch the file when it changes, preventing stale cache issues.
 * @param {string} filePath Path to an asset file (CSS, JS, images, etc.) relative to the public directory.
 * @param {string} baseUrl Base URL to prepend (e.g., CDN origin). Defaults to none (undefined).
 * @returns {string} The asset path with a timestamp query parameter, or the original path if the file does not exist.
 * @example
 * ```handlebars
 * {{!-- results in: /assets/style.css?1620526340463 --}}
 * {{cacheBusting '/assets/style.css'}}
 *
 * {{!-- results in: //cdn.example.com/assets/style.css?1620526340463 --}}
 * {{cacheBusting '/assets/style.css' '//cdn.example.com'}}
 * ```
 */
export const cacheBusting = (filePath: string, baseUrl?: string): string => {
  // Resolve the asset's absolute path under the public/ directory
  const normalizedPath = filePath.replace(/^\//, '');
  const absolutePath = `${path.join(process.cwd(), 'public')}/${normalizedPath}`;

  // Return original path unchanged if the file doesn't exist on disk
  if (!fs.existsSync(absolutePath))
    return filePath;

  // Use file modification timestamp as a cache-busting query parameter
  const modifiedAt = new Date(fs.statSync(absolutePath).mtime).getTime();

  // Build the final URL: optional baseUrl prefix + file path + timestamp
  let resultUrl = '';
  if (baseUrl)
    resultUrl += baseUrl.replace(/\/$/, ''); // strip trailing slash to avoid "//"

  resultUrl += `/${normalizedPath}?${modifiedAt}`;
  return resultUrl;
}

/**
 * Strips HTML tags from a string, with optional allowlist and replacement string.
 * @param {string} str The HTML string to sanitize.
 * @param {string|string[]} allowedTags Tags to preserve (e.g., `'<strong>'` or `['<strong>', '<em>']`). Defaults to `[]`.
 * @param {string} replacement String to insert in place of removed tags. Defaults to `''`.
 * @returns {string} The sanitized string with HTML tags removed (except allowed ones).
 * @example
 * ```handlebars
 * {{!-- results in: lorem ipsum dolor sit amet --}}
 * {{{stripTags '<p>lorem ipsum <strong>dolor</strong> <em>sit</em> amet</p>'}}}
 *
 * {{!-- results in: lorem ipsum <strong>dolor</strong> sit amet --}}
 * {{{stripTags '<p>lorem ipsum <strong>dolor</strong> <em>sit</em> amet</p>' '<strong>' ''}}}
 *
 * {{!-- results in: *lorem ipsum *dolor* *sit* amet* --}}
 * {{{stripTags '<p>lorem ipsum <strong>dolor</strong> <em>sit</em> amet</p>' [] '*'}}}
 * ```
 */
export const stripTags = (str: string, allowedTags: string|string[] = [], replacement: string = ''): string => {
  return striptags(str, allowedTags, replacement);
}