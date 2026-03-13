import fs from 'node:fs';
import {globSync} from 'glob';
import Model from '~/database/Model';

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
export default async function loadModels(): Promise<void> {
  // Locate models directory in application root
  const modelsDir = `${process.cwd()}/models`;

  // Skip if no models directory exists
  if (!fs.existsSync(modelsDir)) {
    return;
  }

  // Phase 1: Load and initialize all model files
  const models: typeof Model[] = [];
  for (const modelPath of globSync(`${modelsDir}/**/*.js`, {nodir: false})) {
    const {default: model} = <{default: typeof Model}> await import(modelPath);
    await model.init();
    models.push(model);
  }

  // Phase 2: Set up associations between models (requires all models to be initialized first)
  for (const model of models) {
    model.association();
  }
}
