import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginMocha from 'eslint-plugin-mocha';

export default [
  {languageOptions: {globals: globals.node}},
  pluginJs.configs.recommended,
  pluginJsdoc.configs['flat/recommended'],
  pluginMocha.configs.flat.recommended,
];
