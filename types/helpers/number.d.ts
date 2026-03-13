/**
 * Formats a number as a locale-aware string using `Number.prototype.toLocaleString()`.
 * Adds thousands separators and uses locale-specific decimal separators.
 * @param {number|string} val The number or numeric string to format.
 * @param {string} locales A BCP 47 language tag (e.g., `'en-US'`, `'de-DE'`, `'ja-JP'`). Defaults to the runtime's default locale.
 * @returns {string} The locale-formatted number string.
 * @example
 * ```handlebars
 * {{!-- results in: 123,456.789 (en-US) --}}
 * {{number2locale 123456.789}}
 *
 * {{!-- results in: 123.456,789 (de-DE) --}}
 * {{number2locale 123456.789 'de-DE'}}
 *
 * {{!-- results in: 1,000 --}}
 * {{number2locale price 'en-US'}}
 * ```
 */
export declare const number2locale: (val: number | string, locales?: string) => string;
