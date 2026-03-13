import express from 'express';
/**
 * Sets view-accessible local variables (`baseUrl` and `currentPath`) on each request.
 *
 * - `baseUrl`: The application's origin URL (e.g., `https://example.com`).
 *   Supports reverse proxy environments via `x-forwarded-proto` header.
 *   May be `undefined` if URL construction fails (e.g., invalid Host header).
 * - `currentPath`: The current request pathname without query string or hash.
 *
 * An optional `rewrite_base_url` hook in `config/config.js` allows transforming the base URL.
 *
 * @param {express.Express} app Express application instance.
 * @returns {Promise<void>}
 * @example
 * ```handlebars
 * {{!-- Using local variables in Handlebars templates --}}
 * {{#if baseUrl}}
 *   <a href="{{baseUrl}}/home">Home</a>
 * {{/if}}
 * {{#if (eq currentPath '/dashboard')}}Active{{/if}}
 * ```
 * @example
 * ```js
 * // Custom base URL rewriting in config/config.js
 * export default {
 *   rewrite_base_url: baseUrl => {
 *     if (!baseUrl) return 'http://localhost:3000';
 *     return `${baseUrl}/admin`;
 *   }
 * };
 * ```
 */
export default function locals(app: express.Express): Promise<void>;
