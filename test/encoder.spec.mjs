import Encoder from '../src/encoder.mjs';
import assert from 'assert';

describe('[Encoder] class tests', () => {
  describe('encoder', () => {
    describe('encode method', () => {
      it('no cards', () => {
        assert.equal(Encoder.decode('CEAAAAA').length, 0);
      });

      it('no cards skip version', () => {
        assert.equal(Encoder.decode('EUAAAAA', true).length, 0);
      });

      it('no cards check version', () => {
        assert.throws(() => Encoder.decode('EUAAAAA', false));
      });

      it('empty value', () => {
        assert.throws(() => Encoder.decode(''));
      });
    });
  });
});
