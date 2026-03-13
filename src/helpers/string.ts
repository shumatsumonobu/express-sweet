import * as utils from '~/utils';

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
export const replace = (value: string, find: string, replace: string): string => {
  return value.replace(find, replace);
}

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
export const split = (value: string, separator: string): string[] => {
  // Return empty array if value is not a string
  if (!utils.isString(value))
    return [];
  // Default separator to comma if not specified
  if (!utils.isString(separator))
    separator = ',';
  return value.split(separator);
}

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
export const formatBytes = (bytes: number, decimals: number = 0): string => {
  // Handle zero or falsy bytes
  if (!bytes || bytes <= 0)
    return '0Bytes';

  const BYTES_PER_UNIT = 1024;
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  // Clamp decimals to non-negative value
  const precision = decimals < 0 ? 0 : decimals;

  // Determine which unit to use (0=Bytes, 1=KB, 2=MB, ...)
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(BYTES_PER_UNIT));

  // Convert bytes to the target unit and round to specified precision
  const scaledValue = parseFloat((bytes / Math.pow(BYTES_PER_UNIT, unitIndex)).toFixed(precision));

  return `${scaledValue}${units[unitIndex]}`;
}
