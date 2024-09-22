import assert from 'assert';
import Base32 from '../../utils/base32.mjs';
import VarInt from '../../utils/var-int.mjs';

describe('[Encoder] performance test', function () {
  const code = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';
  const performanceCalls = 100000;
  
  it(`VarInt.pop (${performanceCalls} times)`, function () {
    for (let i = 0; i < performanceCalls; i += 1) {
      const bytes = Base32.decode(code);
      while (bytes.length) VarInt.pop(bytes);
    }
  });

  it(`VarInt.decode (${performanceCalls} times)`, function () {
    for (let i = 0; i < performanceCalls; i += 1) {
      const bytes = Base32.decode(code);
      VarInt.decode(bytes);
    }
  });

  it('must be fail', function () {
    const arr = [180];
    assert.throws(() => VarInt.decode(arr));
    assert.throws(() => VarInt.pop(arr));
  });
});
