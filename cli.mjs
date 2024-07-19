import camelCase from 'camelcase';
import fs from 'node:fs/promises';
import minimist from 'minimist';
import stringify from 'json-stringify-pretty-compact';
import {Deck, generateDataDragon} from './index.mjs';

const [code, ...parameters] = process.argv.slice(2);

console.log(Deck.fromCode(code));

if (parameters?.length) {
  const dragon = generateDataDragon();

  const {style, language, outFile} = Object.fromEntries(Object.entries(minimist(parameters)).map(([k, v]) => [camelCase(k), v]));

  const data =
    style === 'html' || outFile.endsWith('.html')
      ? await dragon.generatePageFromCode(code, language)
      : stringify(await dragon.fetchData(code, language), {indent: 2, maxLength: 180});

  await fs.writeFile(outFile, data);
}
