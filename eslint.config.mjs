import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  {
    ignores: ['dist/'],
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      eqeqeq: 'error',
      'no-console': 0,
    },
  },
];
