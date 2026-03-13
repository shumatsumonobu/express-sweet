import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {builtinModules} from 'node:module';
import pkg from './package.json' with {type: "json"};

export default {
  external: [
    ...builtinModules,
    'express',
    'sequelize',
  ],
  input: './src/index.ts',
  plugins: [
    typescript({
      tsconfigDefaults: {compilerOptions: {}},
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {compilerOptions: {}},
      useTsconfigDeclarationDir: true
    }),
    terser(),
    json(),
    commonjs(),
    nodeResolve({
      mainFields: ['module', 'main'],
    })
  ],
  // Dual output: ESM (.mjs) and CommonJS (.cjs).
  output: [
    {
      format: 'esm',
      file: pkg.module
    }, {
      format: 'cjs',
      file: pkg.main
    }
  ],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
}