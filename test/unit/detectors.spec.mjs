import assert from 'node:assert';
import {isBrowser, isNode} from '../../utils/detectors.mjs';

describe('[detectors] tests', function () {
  function withoutProcess(callback) {
    const backup = global.process;
    delete global.process;
    try {
      callback(backup);
    } finally {
      global.process = backup;
    }
  }

  it('should return not return both', function () {
    withoutProcess(() => {
      assert.equal(isBrowser(), false);
      assert.equal(isNode(), false);
    });
  });

  it('should return true if browser', function () {
    withoutProcess(() => {
      global.window = {document: {}};
      try {
        assert.equal(isBrowser(), true);
      } finally {
        delete global.window;
      }
    });
  });

  it('should return true if node', function () {
    withoutProcess(backup => {
      global.process = {versions: backup.versions};
      assert.equal(isNode(), true);
      delete global.process;
    });
  });
});
