import assert from 'node:assert';
import {isBrowser, isNode} from '../../utils/detectors.mjs';

describe('[detectors] tests', function () {
  /**
   * Executes a callback function without the global process object.
   * @param {(originProcess: import('node:process')) => void} callback - The callback function to execute without the global process object.
   */
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
    withoutProcess(originProcess => {
      global.process = {versions: originProcess.versions};
      assert.equal(isNode(), true);
      delete global.process;
    });
  });
});
