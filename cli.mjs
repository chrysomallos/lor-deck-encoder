import camelCase from 'camelcase';
import fs from 'node:fs/promises';
import minimist from 'minimist';
import stringify from 'json-stringify-pretty-compact';
import {Deck, DataDragon} from './index.mjs';
import Base32 from './utils/base32.mjs';

const parameters = Object.fromEntries(Object.entries(minimist(process.argv.slice(2))).map(([k, v]) => [camelCase(k), v]));
let [code] = parameters[''];
code ??= parameters.code;

if (!code || parameters.help) {
  console.log('Start by `yarn cli [--code] <code> ...`:');
  console.log(' [--code <code>] : The code example `yarn cli CEAAECABAIDASDASDISC2OIIAECBGGY4FAWTINZ3AICACAQXDUPCWBABAQGSOKRM`');
  console.log(' [--help]');
  console.log(' [--language <language>]');
  console.log(' [--out-file <file path>]');
  console.log(' [--style]');
  console.log(' [--verify]');
} else {
  const {style, language, outFile, verify} = parameters;
  if (verify) {
    const deck = Deck.fromCode(code);
    console.log(JSON.stringify(deck.list));
    console.log(JSON.stringify(Base32.decode(code)));
    console.log(`${code} => ${deck.code} (${code === deck.code})`);
    console.log(JSON.stringify(Deck.fromCode(deck.code).list));
    console.log(JSON.stringify(Base32.decode(deck.code)));
  } else if (outFile?.length) {
    const dragon = new DataDragon();
    const data =
      style === 'html' || outFile.endsWith('.html')
        ? await dragon.generatePageFromCode(code, language)
        : stringify(await dragon.fetchData(code, language), {indent: 2, maxLength: 180});

    await fs.writeFile(outFile, data);
    console.log('written into', outFile);
  } else {
    console.log(Deck.fromCode(code).list);
  }
}
