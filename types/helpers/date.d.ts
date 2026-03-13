/**
 * Formats a date string using Moment.js format tokens.
 * If no date is provided, the current date/time is used.
 * @param {string} format A Moment.js format string (e.g., `'YYYY-MM-DD'`, `'HH:mm:ss'`).
 * @param {string} date The date string to format (any format parseable by Moment.js).
 * @param {string|string[]} locale A BCP 47 locale string (e.g., `'ja'`, `'en-US'`) or array of locales. Defaults to the system locale.
 * @returns {string} The formatted date string.
 * @example
 * ```handlebars
 * {{!-- results in: 2024/01/15 --}}
 * {{formatDate 'YYYY/MM/DD' createdAt}}
 *
 * {{!-- results in: January 15, 2024 --}}
 * {{formatDate 'MMMM D, YYYY' createdAt 'en'}}
 *
 * {{!-- results in: 2024年1月15日 --}}
 * {{formatDate 'YYYY年M月D日' createdAt 'ja'}}
 * ```
 */
export declare const formatDate: (format: string, date: string, locale: string | string[]) => string;
