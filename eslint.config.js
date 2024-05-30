import globals from 'globals';
import pluginJs from '@eslint/js';
import mochaPlugin from 'eslint-plugin-mocha';

export default [{languageOptions: {globals: globals.browser}}, pluginJs.configs.recommended, mochaPlugin.configs.flat.recommended];
