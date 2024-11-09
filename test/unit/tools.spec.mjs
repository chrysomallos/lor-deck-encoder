import Base32, {numberOfTrailingZeros} from '../../utils/base32.mjs';
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

  describe('numberOfTrailingZeros', function() {
    it('input 0', function() {
      assert.equal(numberOfTrailingZeros(0), 32);
    });
  
    it('positive integers', function() {
      assert.equal(numberOfTrailingZeros(1), 0, 'binary: 1');
      assert.equal(numberOfTrailingZeros(2), 1, 'binary: 10');
      assert.equal(numberOfTrailingZeros(4), 2, 'binary: 100');
      assert.equal(numberOfTrailingZeros(8), 3, 'binary: 1000');
      assert.equal(numberOfTrailingZeros(16), 4, 'binary: 10000');
    });
  
    it('powers of 2', function() {
      assert.equal(numberOfTrailingZeros(32), 5, 'binary: 100000');
      assert.equal(numberOfTrailingZeros(64), 6, 'binary: 1000000');
      assert.equal(numberOfTrailingZeros(128), 7, 'binary: 10000000');
    });
  
    it('large numbers', function() {
      assert.equal(numberOfTrailingZeros(1024), 10, 'binary: 10000000000');
      assert.equal(numberOfTrailingZeros(65536), 16, 'binary: 10000000000000000');
    });
  
    it('mixed bits', function() {
      assert.equal(numberOfTrailingZeros(18), 1, 'binary: 10010');
      assert.equal(numberOfTrailingZeros(40), 3, 'binary: 101000');
      assert.equal(numberOfTrailingZeros(72), 3, 'binary: 1001000');
    });
  
    it('no trailing zeros', function() {
      assert.equal(numberOfTrailingZeros(3), 0, 'binary: 11');
      assert.equal(numberOfTrailingZeros(5), 0, 'binary: 101');
      assert.equal(numberOfTrailingZeros(7), 0, 'binary: 111');
      assert.equal(numberOfTrailingZeros(9), 0, 'binary: 1001');
      assert.equal(numberOfTrailingZeros(17), 0, 'binary: 10001');
      assert.equal(numberOfTrailingZeros(19), 0, 'binary: 10011');
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
