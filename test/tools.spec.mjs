import Base32 from '../utils/base32.mjs';
import pad from '../utils/pad.mjs';
import assert from 'assert';
import VarInt from '../utils/var-int.mjs';

describe('[Utils] full tests', () => {
  describe('Base32', () => {
    describe('validation', () => {
      const plain = [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((v) => VarInt.get(v));
      it(`encode and decode test [${plain.join(',')}]`, () => {
        const encoded = Base32.encode(plain);
        const decoded = Base32.decode(encoded);
        assert.deepEqual(decoded, plain, 'decoded does not match plain');
      });
    });

    describe('decode method', () => {
      it('empty', () => {
        assert.deepEqual(Base32.decode(''), [0]);
      });
    });

    describe('encode method', () => {
      it('null value', () => {
        assert.equal(Base32.encode(null), '');
      });

      it('empty value', () => {
        assert.equal(Base32.encode([]), '');
      });
    });

    describe('speed test', () => {
      const plain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].flatMap((v) => VarInt.get(v));
      const encoded = Base32.encode(plain, true);
      const decoded = Base32.decode(encoded);
      it('encode with padding', () => {
        for (let i = 0; i < 1000; i++) Base32.encode(plain, true);
      });
      it('encode', () => {
        for (let i = 0; i < 1000; i++) Base32.encode(plain);
      });
      it('decode', () => {
        for (let i = 0; i < 1000; i++) Base32.decode(encoded);
      });
      it('validate', () => {
        assert.deepEqual(decoded, plain, 'decoded does not match plain');
      });
    });
  });

  describe('pad', () => {
    it('smaller number', () => {
      assert.equal(pad(99, 4), '0099');
    });
    it('same', () => {
      assert.equal(pad(999, 3), '999');
    });
    it('bigger number', () => {
      assert.equal(pad(99999, 3), '99999');
    });
    it('must fail if number is greater than size', () => {
      assert.throws(() => pad(99, 1, true));
    });
  });

  describe('VarInt', () => {
    it ('get', () => {
      const arr = VarInt.get(180);
      assert.equal(arr.length, 2);
      assert.equal(arr[0], 180);
      assert.equal(arr[1], 1);
    });

    it('pop', () => {
      const arr = [180, 1];
      const num = VarInt.pop(arr);
      assert.equal(num, 180);
      assert.equal(arr.length, 0);
    });
  });
});
