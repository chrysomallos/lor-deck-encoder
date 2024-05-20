import fs from 'node:fs/promises';
import stringify from 'json-stringify-pretty-compact';
import {Deck, generateDataDragon} from './index.mjs';

const parameters = process.argv.slice(2);

if (parameters[0] === 'show') {
  console.log(Deck.fromCode(parameters[1]));
}
if (parameters[0] === 'json') {
  await fs.writeFile(parameters[1], stringify(await generateDataDragon().fetchData(parameters[2], parameters[3]), {indent: 2, maxLength: 180}));
}
if (parameters[0] === 'html') {
  await fs.writeFile(parameters[1], await generateDataDragon().generatePageFromCode(parameters[2], parameters[3]));
}
