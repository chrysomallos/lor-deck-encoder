import globals from 'globals';
import pluginJs from '@eslint/js';
import mochaPlugin from 'eslint-plugin-mocha';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {languageOptions: {globals: globals.node}},
  pluginJs.configs.recommended,
  mochaPlugin.configs.flat.recommended,
  jsdoc.configs['flat/recommended'],
];
