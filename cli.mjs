import camelCase from 'camelcase';
import fs from 'node:fs/promises';
import minimist from 'minimist';
import stringify from 'json-stringify-pretty-compact';
import {Deck, generateDataDragon} from './index.mjs';
import Base32 from './utils/base32.mjs';

const [code, ...parameters] = process.argv.slice(2);

const deck = Deck.fromCode(code);
console.log(`${code} => ${deck.code} (${code === deck.code})`);

console.log(JSON.stringify(Base32.decode(code)));
console.log(JSON.stringify(deck.list));

console.log(JSON.stringify(Base32.decode(deck.code)));
console.log(JSON.stringify(Deck.fromCode(deck.code).list));

if (parameters?.length) {
  const dragon = generateDataDragon();

  const {style, language, outFile} = Object.fromEntries(Object.entries(minimist(parameters)).map(([k, v]) => [camelCase(k), v]));

  const data =
    style === 'html' || outFile.endsWith('.html')
      ? await dragon.generatePageFromCode(code, language)
      : stringify(await dragon.fetchData(code, language), {indent: 2, maxLength: 180});

  await fs.writeFile(outFile, data);
}
