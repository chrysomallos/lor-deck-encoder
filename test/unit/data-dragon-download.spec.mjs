import assert from 'node:assert';
import {mock} from 'node:test';
import quibble from 'quibble';
import {HttpError} from '../../utils/request.mjs';
import coreData from './resources/core.json' with {type: 'json'};
import setData from './resources/set.json' with {type: 'json'};

describe('[DataDragon] download class tests', function () {
  let dataDragon, DataDragon;
  const coreResponse = {status: 200};
  let fileExistsResult = false;
  let readFileSyncResult = '{}';
  let browser_process = false;
  let node_process = true;
  let requestRejected = null;

  beforeEach(async function () {
    await quibble.esm('../../utils/request.mjs', {
      default: async url => {
        if (url.pathname.startsWith('/latest/core')) return {data: coreData, response: coreResponse};
        if (requestRejected) throw requestRejected;
        return {data: setData, response: {}};
      },
    });
    await quibble.esm('node:fs/promises', {
      default: {
        exists: () => fileExistsResult,
        writeFile: () => true,
        readFile: () => readFileSyncResult,
        mkdir: () => true,
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
  });

  it('should download', async function () {
    await dataDragon.download('./data-dragon-test-download', 'en_us');
  });

  it('should download without language', async function () {
    await dataDragon.download('./data-dragon-test-download');
  });

  it('should log the core response when DEBUG_CACHE is true', async function () {
    const previousDebugCache = process.env.DATA_DRAGON_DEBUG_CACHE;
    const consoleLog = mock.method(console, 'log', () => {});
    process.env.DATA_DRAGON_DEBUG_CACHE = 'true';

    try {
      await dataDragon.download('./data-dragon-test-download', 'en_us');
    } finally {
      consoleLog.mock.restore();
      if (previousDebugCache === undefined) delete process.env.DATA_DRAGON_DEBUG_CACHE;
      else process.env.DATA_DRAGON_DEBUG_CACHE = previousDebugCache;
    }

    assert.deepEqual(
      consoleLog.mock.calls.map(({arguments: args}) => args),
      [['Downloaded core data for language en_us:', coreResponse]],
    );
  });

  it('should not log the core response when DEBUG_CACHE is not true', async function () {
    const previousDebugCache = process.env.DATA_DRAGON_DEBUG_CACHE;
    const consoleLog = mock.method(console, 'log', () => {});
    delete process.env.DATA_DRAGON_DEBUG_CACHE;

    try {
      await dataDragon.download('./data-dragon-test-download', 'en_us');
    } finally {
      consoleLog.mock.restore();
      if (previousDebugCache === undefined) delete process.env.DATA_DRAGON_DEBUG_CACHE;
      else process.env.DATA_DRAGON_DEBUG_CACHE = previousDebugCache;
    }

    assert.equal(consoleLog.mock.callCount(), 0);
  });

  it('should download with request error', async function () {
    const doubleData = {...coreData, sets: [...coreData.sets, {...coreData.sets[0], name: 'Duplicate', nameRef: 'Set2'}]};
    await quibble.esm('../../utils/request.mjs', {
      default: async url => {
        if (url.pathname.startsWith('/latest/core')) return {data: doubleData, response: coreResponse};
        if (url.pathname.startsWith('/latest/set1')) return {data: setData, response: {}};
        throw new HttpError({statusCode: 404, statusMessage: 'Not Found', url, method: 'GET'});
      },
    });
    DataDragon = (await import('../../src/data-dragon.mjs')).default;
    dataDragon = new DataDragon();
    await dataDragon.download('./data-dragon-test-download');
  });

  afterEach(function () {
    quibble.reset();
  });
});
