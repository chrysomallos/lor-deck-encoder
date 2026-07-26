import assert from 'node:assert';
import {performance} from 'node:perf_hooks';
import Base32 from '../../utils/base32.mjs';
import VarInt from '../../utils/var-int.mjs';
import logPerformanceTimes from './log-performance.mjs';

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
    console.log(`  Performance times for VarInt calls:`);
    logPerformanceTimes('VarInt.decode', performanceTimes.decode, performanceCalls);
    logPerformanceTimes('VarInt.pop', performanceTimes.pop, performanceCalls);
  });

  it('must be fail', function () {
    const arr = [180];
    assert.throws(() => VarInt.decode(arr));
    assert.throws(() => VarInt.pop(arr));
  });
});
