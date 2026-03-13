/**
 * Replaces the first occurrence of a substring with a replacement string.
 * Only the first match is replaced (same behavior as `String.prototype.replace` with a string pattern).
 * @param {string} value The original string.
 * @param {string} find The substring to search for.
 * @param {string} replace The replacement string.
 * @returns {string} The string with the first match replaced.
 * @example
 * ```handlebars
 * {{!-- results in: Hello, World! --}}
 * {{replace 'Hello, world!' 'world' 'World'}}
 * ```
 */
export declare const replace: (value: string, find: string, replace: string) => string;
/**
 * Splits a string into an array by the given separator.
 * @param {string} value The string to split.
 * @param {string} separator The delimiter character or string. Defaults to `','` if not a valid string.
 * @returns {string[]} An array of substrings, or an empty array if the input is not a string.
 * @example
 * ```handlebars
 * {{#each (split "red,green,blue" ",")}}<span>{{this}}</span>{{/each}}
 * {{#each (split tags ',')}}<span class="tag">{{this}}</span>{{/each}}
 * ```
 */
export declare const split: (value: string, separator: string) => string[];
/**
 * Converts a byte count to a human-readable string with the appropriate unit
 * (Bytes, KB, MB, GB, TB, PB, EB, ZB, YB).
 * @param {number} bytes The number of bytes.
 * @param {number} decimals The number of decimal places to display. Defaults to `0`.
 * @returns {string} The formatted string with value and unit (e.g., `"1KB"`, `"0Bytes"`).
 * @example
 * ```handlebars
 * {{!-- results in: 1KB --}}
 * {{formatBytes 1024}}
 *
 * {{!-- results in: 1.21KB --}}
 * {{formatBytes 1234 2}}
 *
 * {{!-- results in: 0Bytes --}}
 * {{formatBytes 0}}
 * ```
 */
export declare const formatBytes: (bytes: number, decimals?: number) => string;
