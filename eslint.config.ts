import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest']
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      import: importPlugin,
      perfectionist,
      'react-refresh': reactRefresh
    },
    rules: {
      'import/order': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          groups: ['builtin', 'external', 'type', 'internal', 'parent', 'sibling', 'index'],
          newlinesBetween: 'never',
          order: 'asc',
          type: 'natural'
        }
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          type: 'natural'
        }
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
  }
]);
