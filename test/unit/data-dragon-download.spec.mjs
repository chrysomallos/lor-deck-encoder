import assert from 'node:assert';
import quibble from 'quibble';
import coreData from './resources/core.mjs';
import setData from './resources/set.mjs';
import {HttpError} from '../../utils/request.mjs';

describe('[DataDragon] download class tests', function () {
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
        writeFileSync: () => true,
        readFileSync: () => readFileSyncResult,
        mkdirSync: () => true,
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
    dataDragon.download('./data-dragon-test-download', 'en_us');
  });

  it('should download without language', async function () {
    dataDragon.download('./data-dragon-test-download');
  });

  it('should download with request error', async function () {
    const doubleData = {...coreData, sets: [...coreData.sets, {...coreData.sets[0], name: 'Duplicate', nameRef: 'Set2'}]};
    await quibble.esm('../../utils/request.mjs', {
      default: async url => {
        if (url.pathname.startsWith('/latest/core')) return doubleData;
        if (url.pathname.startsWith('/latest/set1')) return setData;
        throw new HttpError({statusCode: 404, statusMessage: 'Not Found', url, method: 'GET'});
      },
    });
    DataDragon = (await import('../../src/data-dragon.mjs')).default;
    dataDragon = new DataDragon();
    dataDragon.download('./data-dragon-test-download');
  });

  afterEach(function () {
    quibble.reset();
  });
});
