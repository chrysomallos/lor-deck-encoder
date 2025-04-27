import assert from 'node:assert';
import {isBrowser, isNode} from '../../utils/detectors.mjs';

describe('[detectors] tests', () => {
  const backup = global.process;
  beforeEach(() => {
    delete global.process;
  });

  afterEach(() => {
    global.process = backup;
  })

  it('should return not return both', () => {
    assert.equal(isBrowser(), false);
    assert.equal(isNode(), false);
  })

  it('should return true if browser', () => {
    global.window = {document: {}};
    assert.equal(isBrowser(), true);
    delete global.window;
  })

  it('should return true if node', () => {
    global.process = {versions: backup.versions};
    assert.equal(isNode(), true);
    delete global.process;
  })
});
