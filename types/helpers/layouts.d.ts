/**
 * Declares a block placeholder in a layout template.
 * Renders the content injected by {@link contentFor}, or falls back to the block's default content.
 * Imported from {@link https://github.com/TryGhost/express-hbs|express-hbs}.
 * @param {string} name The name of the block placeholder.
 * @param {Handlebars.HelperOptions} options Handlebars helper options.
 * @returns {string} The concatenated block content, or the default block body if no content was injected.
 * @example
 * ```handlebars
 * {{!-- In layout template: declare a placeholder for page-specific scripts --}}
 * {{{block "pageScripts"}}}
 * ```
 */
export declare const block: (this: any, name: string, options: Handlebars.HelperOptions) => any;
/**
 * Injects content into a named block placeholder declared in a layout template.
 * Multiple calls to `contentFor` with the same name will append content.
 * Imported from {@link https://github.com/TryGhost/express-hbs|express-hbs}.
 * @param {string} name The name of the block to inject content into.
 * @param {Handlebars.HelperOptions} options Handlebars helper options containing the block body.
 * @example
 * ```handlebars
 * {{!-- In page template: inject page-specific scripts into the layout's "pageScripts" block --}}
 * {{#contentFor "pageScripts"}}
 *   <script src="/js/page.js"></script>
 * {{/contentFor}}
 * ```
 */
export declare const contentFor: (this: any, name: string, options: any) => void;
