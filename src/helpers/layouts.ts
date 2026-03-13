/**
 * Captures content for a named block placeholder declared in a layout template.
 * This is an internal helper used by {@link contentFor}.
 * @param {string} name The name of the block to populate.
 * @param {Handlebars.HelperOptions} options Handlebars helper options containing the block content.
 * @param {any} context The current Handlebars rendering context.
 */
const content = (name: string, options: Handlebars.HelperOptions, context: any): void => {
  // Initialize block cache if it doesn't exist
  if (!context.blockCache)
    context.blockCache = {};
  // Get or create array for this named block
  const block = context.blockCache[name] || (context.blockCache[name] = []);
  // Add rendered content to block array
  block.push(options.fn(context));
}

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
export const block = function(this: any, name: string, options: Handlebars.HelperOptions) {
  // Get cached block content for this name
  let val = this.blockCache[name];
  // Use default content if no cached content exists
  if (val === undefined && typeof options.fn === 'function')
    val = options.fn(this);
  // Join array content with newlines
  if (Array.isArray(val))
    val = val.join('\n');
  return val;
}

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
export const contentFor = function(this: any, name: string, options: any): void {
  content(name, options, this);
}
