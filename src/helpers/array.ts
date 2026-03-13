/**
 * Finds the first object in an array whose specified field matches the given value.
 * Returns `null` if no match is found or if parameters are invalid.
 * @param {Array<{[key: string]: any}>} array The array of objects to search.
 * @param {string} fieldName The property name to match against.
 * @param {*} fieldValue The value to match.
 * @returns {object|null} The first matching object, or `null` if not found.
 * @example
 * ```handlebars
 * {{!-- Look up a category name by its ID --}}
 * {{lookup (findObjectInArray categories 'id' categoryId) 'name'}}
 *
 * {{!-- Use within an each block to cross-reference related data --}}
 * {{#each orders}}
 *   {{lookup (findObjectInArray ../users 'id' this.userId) 'name'}}
 * {{/each}}
 * ```
 */
export const findObjectInArray = (array: Array<{[key: string]: any}>, fieldName: string, fieldValue: any): object|null => {
  // Validate parameters before searching
  if (!array || !fieldName || fieldValue === undefined)
    return null;
  // Find first object matching the field name and value
  return array.find(obj => obj[fieldName] === fieldValue) ?? null;
}
