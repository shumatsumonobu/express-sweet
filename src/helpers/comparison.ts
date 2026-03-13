import * as utils from '~/utils';

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
export const eq = (value1: any, value2: any): boolean => {
  return value1 === value2;
}

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
export const eqw = (value1: any, value2: any): boolean => {
  return value1 == value2;
}

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
export const neq = (value1: any, value2: any): boolean => {
  return value1 !== value2;
}

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
export const neqw = (value1: any, value2: any): boolean => {
  return value1 != value2;
}

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
export const lt = (value1: any, value2: any): boolean => {
  return value1 < value2;
}

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
export const lte = (value1: any, value2: any): boolean => {
  return value1 <= value2;
}

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
export const gt = (value1: any, value2: any): boolean => {
  return value1 > value2;
}

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
export const gte = (value1: any, value2: any): boolean => {
  return value1 >= value2;
}

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
export const not = (expression: any): boolean => {
  return !expression;
}

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
export const ifx = (condition: boolean, value1: any, value2: any): any => {
  // Detect when the else-value was omitted: Handlebars passes its internal
  // options object as the last argument, which we can identify by its shape
  if (utils.isObject(value2) && value2.name === 'ifx' && value2.hasOwnProperty('hash'))
    value2 = '';
  return condition ? value1 : value2;
}

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
export const empty = (value: any): boolean => {
  if (typeof value === 'string')
    // Trim whitespace (including full-width spaces) from strings before checking
    value = value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  else if (Array.isArray(value) && value.length === 0)
    // Treat empty arrays as falsy
    value = null;
  return !value;
}

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
export const notEmpty = (value: any): boolean => {
  if (typeof value === 'string')
    // Trim whitespace (including full-width spaces) from strings before checking
    value = value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  else if (Array.isArray(value) && value.length === 0)
    // Treat empty arrays as falsy
    value = null;
  return !!value;
}

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
export const count = (items: any[]): number|false => {
  if (!Array.isArray(items))
    return false;
  return items.length;
}

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
export const and = (...params: any[]): boolean => {
  // Remove Handlebars options object from parameters
  if (utils.isObject(params[params.length-1]))
    params.pop();
  // Return false if any parameter is falsy
  for (const param of params)
    if (!param) return false;
  return true;
}

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
export const or = (...params: any[]): boolean => {
  // Remove Handlebars options object from parameters
  if (utils.isObject(params[params.length-1]))
    params.pop();
  // Return true if any parameter is truthy
  for (const param of params)
    if (param) return true;
  return false;
}

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
export const coalesce = (...params: any[]): any => {
  // Remove Handlebars options object from parameters
  if (utils.isObject(params[params.length-1])) params.pop();
  // Return first truthy value
  for (const param of params)
    if (param)
      return param;
  return params.pop();
}

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
export const includes = (items: any[], value: any, strict: boolean = true): boolean => {
  if (!Array.isArray(items) || items.length === 0) return false;
  for (const item of items)
    if (strict && item === value || !strict && item == value)
      return true;
  return false;
}

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
export const regexMatch = (val: string, pattern: string, flags?: string): boolean => {
  // Coerce non-string values (numbers, booleans, etc.) to their string representation
  if (!utils.isString(val))
    val = val.toString();

  // Discard Handlebars options object when flags parameter is omitted
  if (utils.isObject(flags))
    flags = undefined;

  return new RegExp(pattern, flags).test(val);
}
