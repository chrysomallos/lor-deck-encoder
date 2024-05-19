import Encoder from '../src/encoder.mjs';
import {ArgumentError} from '../src/errors.mjs';
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

      it('check version', function () {
        assert.throws(() => Encoder.decode('CZAAAAA', false), ArgumentError);
      });

      it('check format', function () {
        assert.throws(() => Encoder.decode('EUAAAAA', false), SyntaxError);
      });

      it('empty value', function () {
        assert.throws(() => Encoder.decode(''));
      });

      it('invalid deck', function () {
        assert.throws(() => Encoder.encode([null]));
        assert.throws(() => Encoder.encode([{count: 0}]));
      });
    });
  });
});
