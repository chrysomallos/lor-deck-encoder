import Base32 from '../utils/base32.mjs';
import pad from '../utils/pad.mjs';
import assert from 'assert';
import VarInt from '../utils/var-int.mjs';

describe('[Utils] full tests', function () {
  describe('Base32', function () {
    describe('validation', function () {
      let plain;

      before(function () {
        plain = [1, 20, 30, 400, 500, 600, 700, 800, 900].flatMap((v) => VarInt.get(v));
      });

      it(`encode and decode test`, function () {
        const encoded = Base32.encode(plain);
        const decoded = Base32.decode(encoded);
        assert.deepEqual(decoded, plain, 'decoded does not match plain');
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
    });

    describe('speed test', function () {
      let plain, encoded, decoded;

      before(function () {
        plain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].flatMap((v) => VarInt.get(v));
        encoded = Base32.encode(plain, true);
        decoded = Base32.decode(encoded);
      });

      it('encode with padding', function () {
        for (let i = 0; i < 1000; i++) Base32.encode(plain, true);
      });

      it('encode', function () {
        for (let i = 0; i < 1000; i++) Base32.encode(plain);
      });

      it('decode', function () {
        for (let i = 0; i < 1000; i++) Base32.decode(encoded);
      });

      it('validate', function () {
        assert.deepEqual(decoded, plain, 'decoded does not match plain');
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
  });
});
