import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'build', '*.config.js'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      
      // React specific rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // General code quality rules
     'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
     'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
     'prefer-const': 'error',
      'no-var': 'error',
      
      // Code style rules
     'eqeqeq': ['error', 'always'],
     'curly': ['error', 'all'],
     'brace-style': ['error', '1tbs'],
     'comma-dangle': ['error', 'always-multiline'],
     'quotes': ['error', 'single', { avoidEscape: true }],
     'semi': ['error', 'always'],
      
      // Best practices
     'no-magic-numbers': ['warn', { ignore: [0, 1, -1] }],
     'max-len': ['warn', { code: 100, ignoreUrls: true }],
     'complexity': ['warn', 10],
     'max-depth': ['warn', 4],
    },
  }
);
