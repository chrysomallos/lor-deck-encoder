import assert from 'node:assert';
import {isBrowser, isNode} from '../../utils/detectors.mjs';

describe('[detectors] tests', function () {
  let backup;

  beforeEach(function () {
    backup = global.process;
    delete global.process;
  });

  afterEach(function () {
    global.process = backup;
  });

  it('should return not return both', function () {
    assert.equal(isBrowser(), false);
    assert.equal(isNode(), false);
  });

  it('should return true if browser', function () {
    global.window = {document: {}};
    assert.equal(isBrowser(), true);
    delete global.window;
  });

  it('should return true if node', function () {
    global.process = {versions: backup.versions};
    assert.equal(isNode(), true);
    delete global.process;
  });
});
