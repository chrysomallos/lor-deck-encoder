import Encoder from '../src/encoder.mjs';
import assert from 'assert';

describe('[Encoder] class tests', function () {
  describe('encoder', function () {
    describe('encode method', function () {
      it('no cards', function () {
        assert.equal(Encoder.decode('CEAAAAA').length, 0);
      });

      it('no cards skip version', function () {
        assert.equal(Encoder.decode('EUAAAAA', true).length, 0);
      });

      it('no cards check version', function () {
        assert.throws(() => Encoder.decode('EUAAAAA', false));
      });

      it('empty value', function () {
        assert.throws(() => Encoder.decode(''));
      });
    });
  });
});
