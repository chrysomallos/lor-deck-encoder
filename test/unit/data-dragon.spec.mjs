import assert from 'assert';
import quibble from 'quibble';
import hash from 'object-hash';

import coreData from './resources/core.mjs';
import setData from './resources/set.mjs';

describe('[DataDragon] class tests', function () {
  let dataDragon, DataDragon;
  let fileExistsResult = false;
  let readFileSyncResult = "{}";

  beforeEach(async function () {
    await quibble.esm('../../utils/request.mjs', {
      default: url => {
          if (url.pathname.startsWith('/latest/core'))
            return coreData;
          return setData;
        },
    });
    await quibble.esm('node:fs', {
      default: {
        existsSync: () => fileExistsResult,
        writeFileSync: () => {throw new Error('Never write data in tests')},
        readFileSync: () => readFileSyncResult,
      },
    });
    DataDragon = (await import('../../src/data-dragon.mjs')).default;
    dataDragon = new DataDragon();
  });

  it('construct', function () {
    assert.equal(dataDragon.constructor, DataDragon);
  });

  it('initialize', async function () {
    await dataDragon.initialize('en_US');
  });

  it('initialize file exists', async function () {
    fileExistsResult = true;
    await dataDragon.initialize('en_US');
  });

  it('initialize file exists and is valid', async function () {
    fileExistsResult = true;
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: setData});
    await dataDragon.initialize('en_US');
    assert.deepEqual(dataDragon.core, coreData);
    assert.deepEqual(dataDragon.cards, setData);
  });
  
  it('initialize file exists but not valid', async function () {
    fileExistsResult = true;
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: []});
    await dataDragon.initialize('en_US');
    assert.deepEqual(dataDragon.core, coreData);
    assert.deepEqual(dataDragon.cards, setData);
  });

  it('json', async function () {
    const result = await dataDragon.fetchData('CEAAAAIBAEAAC', 'en_US');
    assert.equal(result.deck.cards.length, 1);
  });

  it('html', async function () {
    const result = await dataDragon.generatePageFromCode('CEAAAAIBAEAAC', 'en_US');
    assert.equal(result.length > 0, true);
  });

  afterEach(function () {
    quibble.reset();
  });
});
