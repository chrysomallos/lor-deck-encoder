import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginMocha from 'eslint-plugin-mocha';
import babelParser from '@babel/eslint-parser';

export default [
  {languageOptions: {globals: globals.node}},
  pluginJs.configs.recommended,
  pluginJsdoc.configs['flat/recommended'],
  pluginMocha.configs.recommended,
  {
    files: ['**/*.d.mts'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          parserOpts: {plugins: ['typescript']},
        },
      },
    },
    rules: {
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-yields-check': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
];
