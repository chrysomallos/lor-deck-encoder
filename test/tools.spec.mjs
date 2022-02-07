import Base32 from '../utils/base32.mjs';
import pad from '../utils/pad.mjs';
import assert from 'assert';
import VarInt from '../utils/var-int.mjs';

describe('[Utils] full tests', () => {
  describe('base32', () => {
    it('encode and decode test', () => {
      const plain = [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((v) => VarInt.get(v));
      const encoded = Base32.encode(plain);
      const decoded = Base32.decode(encoded);
      assert.deepEqual(decoded, plain, 'decoded does not match plain');
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
  });
});
