/**
 * Converts a value to a JSON string using `JSON.stringify`.
 * @param {any} value The value to serialize.
 * @param {number|string} indent Number of spaces (or a string) for indentation. Defaults to `0` (no formatting).
 * @returns {string|undefined} The JSON string, or `undefined` if the value is `undefined`.
 * @example
 * ```handlebars
 * {{!-- Embed data as JSON for JavaScript consumption --}}
 * <script>var config = {{{jsonStringify config}}};</script>
 *
 * {{!-- Pretty-printed JSON (2-space indent) --}}
 * <pre>{{{jsonStringify data 2}}}</pre>
 * ```
 */
export const jsonStringify = (value: any, indent: number|string = 0): string|undefined => {
  return JSON.stringify(value, null, indent);
}

/**
 * Parses a JSON string into a JavaScript value using `JSON.parse`.
 * @param {string} value The JSON string to parse.
 * @returns {any} The parsed JavaScript value or object.
 * @example
 * ```handlebars
 * {{!-- Parse a JSON string stored in a template variable --}}
 * {{#with (jsonParse jsonString)}}
 *   <p>{{this.name}}</p>
 * {{/with}}
 * ```
 */
export const jsonParse = (value: any): any => {
  return JSON.parse(value);
}
