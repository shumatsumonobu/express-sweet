/**
 * Loads, initializes, and associates all Sequelize models from the `models/` directory.
 *
 * All models are initialized first, then associations are set up in a separate pass.
 * This two-phase approach prevents circular dependency errors when models reference each other.
 *
 * @returns {Promise<void>}
 * @example
 * ```bash
 * # Expected directory structure
 * models/
 * ├── UserModel.js
 * ├── ProfileModel.js
 * └── BookModel.js
 * ```
 */
export default function loadModels(): Promise<void>;
