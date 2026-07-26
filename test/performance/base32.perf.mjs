import assert from 'node:assert';
import {performance} from 'node:perf_hooks';
import Base32 from '../../utils/base32.mjs';
import VarInt from '../../utils/var-int.mjs';
import logPerformanceTimes from './log-performance.mjs';

describe('[Base32] performance test', function () {
  let plain, encodedWithPadding, encodedNonePadding, decoded;
  const performanceCalls = 100000;
  const performanceTimes = {};

  before(function () {
    plain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].flatMap(v => VarInt.get(v));
    encodedWithPadding = Base32.encode(plain, true);
    encodedNonePadding = Base32.encode(plain, false);
    decoded = Base32.decode(encodedNonePadding);
  });

  it(`encode (${performanceCalls} times), padding is true`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.encode(plain, true);
    performanceTimes.encodeWithPadding = performance.now() - start;
  });

  it(`encode (${performanceCalls} times), padding is false`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.encode(plain, false);
    performanceTimes.encodeWithoutPadding = performance.now() - start;
  });

  it(`decode (${performanceCalls} times), padding false`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.decode(encodedNonePadding);
    performanceTimes.decodeWithoutPadding = performance.now() - start;
  });

  it(`decode (${performanceCalls} times), padding true`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.decode(encodedWithPadding);
    performanceTimes.decodeWithPadding = performance.now() - start;
  });

  it(`validate equality`, function () {
    assert.deepEqual(decoded, plain, 'decoded does not match plain');
  });

  after(function () {
    console.log(`  Performance times for Base32 calls:`);
    logPerformanceTimes('Base32 encode (with padding)', performanceTimes.encodeWithPadding, performanceCalls);
    logPerformanceTimes('Base32 encode (without padding)', performanceTimes.encodeWithoutPadding, performanceCalls);
    logPerformanceTimes('Base32 decode (with padding)', performanceTimes.decodeWithPadding, performanceCalls);
    logPerformanceTimes('Base32 decode (without padding)', performanceTimes.decodeWithoutPadding, performanceCalls);
  });
});
