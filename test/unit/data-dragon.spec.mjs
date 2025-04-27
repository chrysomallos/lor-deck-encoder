import assert from 'node:assert';
import quibble from 'quibble';
import hash from 'object-hash';

import coreData from './resources/core.mjs';
import setData from './resources/set.mjs';

describe('[DataDragon] class tests', function () {
  let dataDragon, DataDragon;
  let fileExistsResult = false;
  let readFileSyncResult = '{}';
  let browser_process = false;
  let node_process = true;
  let requestRejected = null;

  beforeEach(async function () {
    await quibble.esm('../../utils/request.mjs', {
      default: async url => {
        if (url.pathname.startsWith('/latest/core')) return coreData;
        if (requestRejected) throw requestRejected;
        return setData;
      },
    });
    await quibble.esm('node:fs', {
      default: {
        existsSync: () => fileExistsResult,
        writeFileSync: () => {
          throw new Error('Never write data in tests');
        },
        readFileSync: () => readFileSyncResult,
      },
    });
    await quibble.esm('../utils/detectors.mjs', {
      isBrowser: () => browser_process,
      isNode: () => node_process,
    });
    DataDragon = (await import('../../src/data-dragon.mjs')).default;
    dataDragon = new DataDragon();
  });

  it('should be constructed', function () {
    assert.equal(dataDragon.constructor, DataDragon);
    assert.equal(dataDragon.cardsByCode, undefined);
    assert.equal(dataDragon.regionsByCode, undefined);
  });

  it('should be not initialized', async function () {
    browser_process = false;
    node_process = false;
    const backup = global.process;
    delete global.process;
    await assert.rejects(dataDragon.initialize('en_US'));
    global.process = backup;
  });

  it('should be initialized with node', async function () {
    await dataDragon.initialize('en_US');
    assert.notEqual(dataDragon.cardsByCode, undefined);
    assert.notEqual(dataDragon.regionsByCode, undefined);
  });

  it('should be initialized with browser', async function () {
    browser_process = true;
    node_process = false;
    await dataDragon.initialize('en_US');
    assert.notEqual(dataDragon.cardsByCode, undefined);
    assert.notEqual(dataDragon.regionsByCode, undefined);
  });

  it('initialize existing cache exists', async function () {
    dataDragon.cacheByLanguage = new Map([['en_US', {cards: 'cards', regions: 'regions'}]]);
    await dataDragon.initialize('en_US');
    assert.equal(dataDragon.cardsByCode, 'cards');
    assert.equal(dataDragon.regionsByCode, 'regions');
  });

  it('initialize file exists', async function () {
    fileExistsResult = true;
    await dataDragon.initialize('en_US');
  });

  it('initialize file exists and is valid', async function () {
    fileExistsResult = true;
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: setData});
    await dataDragon.initialize('en_US');
    assert.equal(dataDragon.regionsByCode.size, coreData.regions.length);
    assert.equal(dataDragon.cardsByCode.size, setData.length);
  });

  it('initialize file exists but not valid', async function () {
    fileExistsResult = true;
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: []});
    await dataDragon.initialize('en_US');
    assert.equal(dataDragon.regionsByCode.size, coreData.regions.length);
    assert.equal(dataDragon.cardsByCode.size, setData.length);
  });

  it('should fail when request is rejected', async function () {
    requestRejected = new Error();
    fileExistsResult = false;
    await assert.rejects(dataDragon.initialize('en_US'));
    assert.notEqual(dataDragon.lastError, undefined);
  });

  it('json', async function () {
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: setData});
    fileExistsResult = true;
    const result = await dataDragon.fetchData('CEAAAAIBAEAAC', 'en_US');
    assert.equal(result.deck.cards.length, 1);
  });

  it('html', async function () {
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: setData});
    fileExistsResult = true;
    const result = await dataDragon.generatePageFromCode('CEAAAAIBAEAAC', 'en_US');
    assert.equal(result.length > 0, true);
  });

  it('json', async function () {
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: setData});
    fileExistsResult = true;
    const result = await dataDragon.fetchData('CEAAAAICAECQHZYH', 'en_US');
    assert.equal(result.deck.cards.length, 2);
  });

  it('html', async function () {
    readFileSyncResult = JSON.stringify({header: {date: Date.now(), core: hash(coreData), cards: hash(setData)}, core: coreData, cards: setData});
    fileExistsResult = true;
    const result = await dataDragon.generatePageFromCode('CEAAAAICAEAAHZYH', 'en_US');
    assert.equal(result.length > 0, true);
  });

  afterEach(function () {
    quibble.reset();
  });
});
