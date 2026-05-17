import assert from 'node:assert';
import {performance} from 'node:perf_hooks';
import decodeV1 from '../../src/decode_v1.mjs';
import decodeV2 from '../../src/decode_v2.mjs';
import decodeV3 from '../../src/decode_v3.mjs';

describe('[Encoder]', function () {
  const largeDeckCode = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';
  const smallDeckCode = 'CMAQCBAHBIAQCBAHAMAAIAQAAICQGBQE';
  const performanceCalls = 100000;
  const performanceTimes = {};

  describe('consistency check', function () {
    it(`Ensure equality bigger deck`, function () {
      const oldResult = decodeV1(largeDeckCode);
      const newResult = decodeV2(largeDeckCode);
      assert.equal(oldResult.length, newResult.length);
    });

    it(`Ensure equality small deck`, function () {
      const oldResult = decodeV1(smallDeckCode);
      const newResult = decodeV2(smallDeckCode);
      assert.equal(oldResult.length, newResult.length);
    });

    it('Ensure equality improvements', function () {
      const firstResult = decodeV2(largeDeckCode);
      const secondResult = decodeV3(largeDeckCode);
      assert.equal(firstResult.length, secondResult.length);
    });
  });

  describe('performance test with a large deck', function () {
    it(`decodeV1 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV1(largeDeckCode);
      performanceTimes.decodeV1 = performance.now() - start;
    });

    it(`decodeV2 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV2(largeDeckCode);
      performanceTimes.decodeV2 = performance.now() - start;
    });

    it(`decodeV3 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV3(largeDeckCode);
      performanceTimes.decodeV3 = performance.now() - start;
    });
  });

  describe('performance test with a small deck', function () {
    it(`decodeV1 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV1(smallDeckCode);
      performanceTimes.decodeV1 = performance.now() - start;
    });

    it(`decodeV2 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV2(smallDeckCode);
      performanceTimes.decodeV2 = performance.now() - start;
    });

    it(`decodeV3 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV3(smallDeckCode);
      performanceTimes.decodeV3 = performance.now() - start;
    });
  });

  after(function () {
    console.log('Performance times for large deck:');
    console.log(`decodeV1: ${performanceTimes.decodeV1} ms, each call took ${performanceTimes.decodeV1 / performanceCalls} ms`);
    console.log(`decodeV2: ${performanceTimes.decodeV2} ms, each call took ${performanceTimes.decodeV2 / performanceCalls} ms`);
    console.log(`decodeV3: ${performanceTimes.decodeV3} ms, each call took ${performanceTimes.decodeV3 / performanceCalls} ms`);
    console.log('Performance times for small deck:');
    console.log(`decodeV1: ${performanceTimes.decodeV1} ms, each call took ${performanceTimes.decodeV1 / performanceCalls} ms`);
    console.log(`decodeV2: ${performanceTimes.decodeV2} ms, each call took ${performanceTimes.decodeV2 / performanceCalls} ms`);
    console.log(`decodeV3: ${performanceTimes.decodeV3} ms, each call took ${performanceTimes.decodeV3 / performanceCalls} ms`);
  });
});
