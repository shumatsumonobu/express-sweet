/**
 * Returns the sum of two numbers (`val1 + val2`).
 * String values are automatically converted to numbers.
 * @param {number|string} val1 The first operand.
 * @param {number|string} val2 The second operand.
 * @returns {number} The sum of the two values.
 * @example
 * ```handlebars
 * {{!-- results in: 15 --}}
 * {{add price tax}}
 * ```
 */
export const add = (val1: number|string, val2: number|string): number => {
  return Number(val1) + Number(val2);
}

/**
 * Returns the difference of two numbers (`val1 - val2`).
 * String values are automatically converted to numbers.
 * @param {number|string} val1 The minuend.
 * @param {number|string} val2 The subtrahend.
 * @returns {number} The difference of the two values.
 * @example
 * ```handlebars
 * {{!-- results in: 3 --}}
 * {{sub 5 2}}
 * ```
 */
export const sub = (val1: number|string, val2: number|string): number => {
  return Number(val1) - Number(val2);
}

/**
 * Returns the product of two numbers (`val1 * val2`).
 * String values are automatically converted to numbers.
 * @param {number|string} val1 The first factor.
 * @param {number|string} val2 The second factor.
 * @returns {number} The product of the two values.
 * @example
 * ```handlebars
 * {{!-- results in: 500 --}}
 * {{multiply quantity unitPrice}}
 * ```
 */
export const multiply = (val1: number|string, val2: number|string): number => {
  return Number(val1) * Number(val2);
}

/**
 * Returns the quotient of two numbers (`val1 / val2`).
 * String values are automatically converted to numbers.
 * @param {number|string} val1 The dividend.
 * @param {number|string} val2 The divisor.
 * @returns {number} The quotient of the two values.
 * @example
 * ```handlebars
 * {{!-- results in: 5 --}}
 * {{divide 10 2}}
 * ```
 */
export const divide = (val1: number|string, val2: number|string): number => {
  return Number(val1) / Number(val2);
}

/**
 * Rounds a number up to the nearest integer.
 * @param {number|string} val The number to round up.
 * @returns {number} The smallest integer greater than or equal to the given number.
 * @example
 * ```handlebars
 * {{!-- results in: 6 --}}
 * {{ceil 5.1}}
 * ```
 */
export const ceil = (val: number|string): number => {
  return Math.ceil(Number(val));
}

/**
 * Rounds a number down to the nearest integer.
 * @param {number|string} val The number to round down.
 * @returns {number} The largest integer less than or equal to the given number.
 * @example
 * ```handlebars
 * {{!-- results in: 5 --}}
 * {{floor 5.9}}
 * ```
 */
export const floor = (val: number|string): number => {
  return Math.floor(Number(val));
}

/**
 * Returns the absolute value of a number.
 * @param {number|string} val The number to compute the absolute value of.
 * @returns {number} The non-negative value.
 * @example
 * ```handlebars
 * {{!-- results in: 5.6 --}}
 * {{abs -5.6}}
 * ```
 */
export const abs = (val: number|string): number => {
  return Math.abs(Number(val));
}
