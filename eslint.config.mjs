import { defineConfig, globalIgnores } from 'eslint/config'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import preferArrow from 'eslint-plugin-prefer-arrow'
import functional from 'eslint-plugin-functional'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/storybook-static/',
    '**/dist/',
    '**/scripts/',
  ]),

  {
    files: ['**/*.{ts,tsx}'],
    ...compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    )[0],

    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      'prefer-arrow': preferArrow,
      functional,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      'prefer-arrow/prefer-arrow-functions': 'error',
      'functional/immutable-data': 'error',
      'functional/no-let': 'error',
      'functional/no-classes': 'error',
      'functional/no-mixed-types': 'error',
      'functional/no-this-expressions': 'error',
      'functional/no-loop-statements': 'error',
      'functional/no-promise-reject': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    ...compat.extends('eslint:recommended')[0],

    plugins: {},

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'no-var': 'error',
    },
  },

  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': ['warn'],
    },
  },
])
