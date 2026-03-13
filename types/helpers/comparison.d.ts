/**
 * Checks strict equality (`===`) between two values.
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if both value and type are identical, `false` otherwise.
 * @example
 * ```handlebars
 * {{eq status 'active'}}
 * {{#if (eq role 'admin')}}...{{/if}}
 * ```
 */
export declare const eq: (value1: any, value2: any) => boolean;
/**
 * Checks loose equality (`==`) between two values (type coercion applied).
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if the values are loosely equal, `false` otherwise.
 * @example
 * ```handlebars
 * {{eqw val1 val2}}
 * {{#if (eqw id '123')}}...{{/if}}
 * ```
 */
export declare const eqw: (value1: any, value2: any) => boolean;
/**
 * Checks strict inequality (`!==`) between two values.
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if the values differ in value or type, `false` otherwise.
 * @example
 * ```handlebars
 * {{neq val1 val2}}
 * {{#if (neq status 'inactive')}}...{{/if}}
 * ```
 */
export declare const neq: (value1: any, value2: any) => boolean;
/**
 * Checks loose inequality (`!=`) between two values (type coercion applied).
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if the values are loosely unequal, `false` otherwise.
 * @example
 * ```handlebars
 * {{neqw val1 val2}}
 * {{#if (neqw val1 val2)}}...{{/if}}
 * ```
 */
export declare const neqw: (value1: any, value2: any) => boolean;
/**
 * Checks if the first value is less than the second (`a < b`).
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if `value1 < value2`, `false` otherwise.
 * @example
 * ```handlebars
 * {{lt age 18}}
 * {{#if (lt count max)}}...{{/if}}
 * ```
 */
export declare const lt: (value1: any, value2: any) => boolean;
/**
 * Checks if the first value is less than or equal to the second (`a <= b`).
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if `value1 <= value2`, `false` otherwise.
 * @example
 * ```handlebars
 * {{lte age 18}}
 * {{#if (lte count max)}}...{{/if}}
 * ```
 */
export declare const lte: (value1: any, value2: any) => boolean;
/**
 * Checks if the first value is greater than the second (`a > b`).
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if `value1 > value2`, `false` otherwise.
 * @example
 * ```handlebars
 * {{gt score 100}}
 * {{#if (gt count 0)}}...{{/if}}
 * ```
 */
export declare const gt: (value1: any, value2: any) => boolean;
/**
 * Checks if the first value is greater than or equal to the second (`a >= b`).
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @returns {boolean} `true` if `value1 >= value2`, `false` otherwise.
 * @example
 * ```handlebars
 * {{gte score 100}}
 * {{#if (gte count min)}}...{{/if}}
 * ```
 */
export declare const gte: (value1: any, value2: any) => boolean;
/**
 * Returns the logical NOT of the given expression.
 * @param {any} expression The expression to negate.
 * @returns {boolean} The negated boolean value.
 * @example
 * ```handlebars
 * {{not isDisabled}}
 * {{#if (not (eq status 'closed'))}}...{{/if}}
 * ```
 */
export declare const not: (expression: any) => boolean;
/**
 * Ternary conditional operator (`condition ? value1 : value2`).
 * @param {boolean} condition The condition to evaluate.
 * @param {any} value1 Value returned when condition is truthy.
 * @param {any} value2 Value returned when condition is falsy. Defaults to `''` if omitted.
 * @returns {any} `value1` if condition is truthy, `value2` otherwise.
 * @example
 * ```handlebars
 * {{ifx isActive 'Yes' 'No'}}
 * {{ifx (eq role 'admin') 'Administrator' 'User'}}
 * {{ifx hasItems count}}
 * ```
 */
export declare const ifx: (condition: boolean, value1: any, value2: any) => any;
/**
 * Checks if a value is empty.
 * Strings are trimmed (including full-width spaces) before checking.
 * Empty arrays are treated as empty.
 * @param {any} value The value to check (string, array, object, etc.).
 * @returns {boolean} `true` if the value is empty, falsy, or a whitespace-only string.
 * @example
 * ```handlebars
 * {{empty name}}
 * {{#if (empty items)}}No items found.{{/if}}
 * ```
 */
export declare const empty: (value: any) => boolean;
/**
 * Checks if a value is not empty (inverse of {@link empty}).
 * Strings are trimmed (including full-width spaces) before checking.
 * @param {any} value The value to check (string, array, object, etc.).
 * @returns {boolean} `true` if the value has content, `false` otherwise.
 * @example
 * ```handlebars
 * {{notEmpty name}}
 * {{#if (notEmpty items)}}Found {{count items}} items.{{/if}}
 * ```
 */
export declare const notEmpty: (value: any) => boolean;
/**
 * Returns the length of an array.
 * @param {any[]} items The array to count.
 * @returns {number|false} The array length, or `false` if the value is not an array.
 * @example
 * ```handlebars
 * {{count items}}
 * {{#if (gt (count items) 0)}}Has items{{/if}}
 * ```
 */
export declare const count: (items: any[]) => number | false;
/**
 * Returns `true` if all parameters are truthy (logical AND).
 * @param {...any} params Two or more values to evaluate.
 * @returns {boolean} `true` if every parameter is truthy, `false` otherwise.
 * @example
 * ```handlebars
 * {{and isLoggedIn isAdmin}}
 * {{#if (and hasPermission isActive)}}...{{/if}}
 * ```
 */
export declare const and: (...params: any[]) => boolean;
/**
 * Returns `true` if any parameter is truthy (logical OR).
 * @param {...any} params Two or more values to evaluate.
 * @returns {boolean} `true` if at least one parameter is truthy, `false` otherwise.
 * @example
 * ```handlebars
 * {{or isAdmin isModerator}}
 * {{#if (or hasError hasWarning)}}...{{/if}}
 * ```
 */
export declare const or: (...params: any[]) => boolean;
/**
 * Returns the first truthy value from the parameter list, similar to SQL's `COALESCE()`.
 * If all values are falsy, returns the last parameter.
 * @param {...any} params The values to evaluate.
 * @returns {any} The first truthy value, or the last value if all are falsy.
 * @example
 * ```handlebars
 * {{coalesce nickname username 'Anonymous'}}
 * ```
 */
export declare const coalesce: (...params: any[]) => any;
/**
 * Checks if an array contains a specific value.
 * @param {any[]} items The array to search.
 * @param {any} value The value to look for.
 * @param {boolean} strict Use strict equality (`===`) when `true`, loose equality (`==`) when `false`. Defaults to `true`.
 * @returns {boolean} `true` if the array contains the value, `false` otherwise.
 * @example
 * ```handlebars
 * {{includes roles 'admin'}}
 * {{#if (includes selectedIds id)}}selected{{/if}}
 * {{ifx (includes statuses status) 'active' 'inactive'}}
 * ```
 */
export declare const includes: (items: any[], value: any, strict?: boolean) => boolean;
/**
 * Tests a string against a regular expression pattern.
 * @param {string} val The string to test.
 * @param {string} pattern The regular expression pattern.
 * @param {string} flags Optional regex flags (e.g., `'i'` for case-insensitive). Defaults to none.
 * @returns {boolean} `true` if the string matches the pattern, `false` otherwise.
 * @example
 * ```handlebars
 * {{regexMatch email '^[\\w.-]+@[\\w.-]+$'}}
 * {{#if (regexMatch url '^https://' 'i')}}Secure{{/if}}
 * ```
 */
export declare const regexMatch: (val: string, pattern: string, flags?: string) => boolean;
