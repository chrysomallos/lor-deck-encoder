import Base32 from '../../utils/base32.mjs';
import pad from '../../utils/pad.mjs';
import assert from 'assert';
import VarInt from '../../utils/var-int.mjs';

describe('[Utils] full tests', function () {
  describe('Base32', function () {
    describe('validation', function () {
      let bytes;

      before(function () {
        bytes = [1, 20, 30, 400, 500, 600, 700, 800, 900].flatMap(v => VarInt.get(v));
      });

      it('encode and decode test', function () {
        const encoded = Base32.encode(bytes);
        const decoded = Base32.decode(encoded);
        assert.deepEqual(decoded, bytes, 'decoded does not match');
      });
    });

    describe('decode method', function () {
      it('empty', function () {
        assert.deepEqual(Base32.decode(''), [0]);
      });
    });

    describe('encode method', function () {
      it('null value', function () {
        assert.equal(Base32.encode(null), '');
      });

      it('empty value', function () {
        assert.equal(Base32.encode([]), '');
      });

      it('deck array with padding', function () {
        const encoded = Base32.encode([(2 << 4) | (6 & 0xf)], true);
        assert.equal(encoded, 'EY======');
      });

      it('empty array with padding', function () {
        const encoded = Base32.encode([], true);
        assert.equal(encoded, '========');
      });

      it('big byte array', function () {
        // fake byte length to check exception
        assert.throws(() => Base32.encode({length: 1 << 28}, true));
      });
    });
  });

  describe('pad', function () {
    it('smaller number', function () {
      assert.equal(pad(99, 4), '0099');
    });

    it('same', function () {
      assert.equal(pad(999, 3), '999');
    });

    it('bigger number', function () {
      assert.equal(pad(99999, 3), '99999');
    });

    it('must fail if number is greater than size', function () {
      assert.throws(() => pad(99, 1, true));
    });
  });

  describe('VarInt', function () {
    it('get', function () {
      const arr = VarInt.get(180);
      assert.equal(arr.length, 2);
      assert.equal(arr[0], 180);
      assert.equal(arr[1], 1);
    });

    it('pop', function () {
      const arr = [180, 1];
      const num = VarInt.pop(arr);
      assert.equal(num, 180);
      assert.equal(arr.length, 0);
    });

    it('decode', function () {
      const arr = [180, 1];
      const [num] = VarInt.decode(arr);
      assert.equal(num, 180);
      assert.equal(arr.length, 2);
    });

    it('must be fail', function () {
      const arr = [180];
      assert.throws(() => VarInt.decode(arr));
      assert.throws(() => VarInt.pop(arr));
    });
  });
});
