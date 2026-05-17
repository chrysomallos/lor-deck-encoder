import assert from 'node:assert';
import {performance} from 'node:perf_hooks';
import Base32 from '../../utils/base32.mjs';
import VarInt from '../../utils/var-int.mjs';

describe('[VarInt] performance test', function () {
  const code = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';
  const performanceCalls = 100000;
  const performanceTimes = {};

  it(`VarInt.pop (${performanceCalls} times)`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i += 1) {
      const bytes = Base32.decode(code);
      while (bytes.length) VarInt.pop(bytes);
    }
    performanceTimes.pop = performance.now() - start;
  });

  it(`VarInt.decode (${performanceCalls} times)`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i += 1) {
      const bytes = Base32.decode(code);
      VarInt.decode(bytes);
    }
    performanceTimes.decode = performance.now() - start;
  });

  after(function () {
    console.log(`Performance times, fast algorithm is ${performanceTimes.pop < performanceTimes.decode ? 'VarInt.pop' : 'VarInt.decode'}:`);
    console.log(`VarInt.pop: ${performanceTimes.pop} ms, each call took ${performanceTimes.pop / performanceCalls} ms`);
    console.log(`VarInt.decode: ${performanceTimes.decode} ms, each call took ${performanceTimes.decode / performanceCalls} ms`);
  });

  it('must be fail', function () {
    const arr = [180];
    assert.throws(() => VarInt.decode(arr));
    assert.throws(() => VarInt.pop(arr));
  });
});
