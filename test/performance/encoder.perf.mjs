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
      performanceTimes.largeDeckDecodeV1 = performance.now() - start;
    });

    it(`decodeV2 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV2(largeDeckCode);
      performanceTimes.largeDeckDecodeV2 = performance.now() - start;
    });

    it(`decodeV3 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV3(largeDeckCode);
      performanceTimes.largeDeckDecodeV3 = performance.now() - start;
    });
  });

  describe('performance test with a small deck', function () {
    it(`decodeV1 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV1(smallDeckCode);
      performanceTimes.smallDeckDecodeV1 = performance.now() - start;
    });

    it(`decodeV2 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV2(smallDeckCode);
      performanceTimes.smallDeckDecodeV2 = performance.now() - start;
    });

    it(`decodeV3 (${performanceCalls} times)`, function () {
      const start = performance.now();
      for (let i = 0; i < performanceCalls; i += 1) decodeV3(smallDeckCode);
      performanceTimes.smallDeckDecodeV3 = performance.now() - start;
    });
  });

  after(function () {
    console.log(`Performance times for ${performanceCalls} calls:`);
    console.log(`Small Deck - decodeV1: ${performanceTimes.smallDeckDecodeV1} ms, each call took ${performanceTimes.smallDeckDecodeV1 / performanceCalls} ms`);
    console.log(`Small Deck - decodeV2: ${performanceTimes.smallDeckDecodeV2} ms, each call took ${performanceTimes.smallDeckDecodeV2 / performanceCalls} ms`);
    console.log(`Small Deck - decodeV3: ${performanceTimes.smallDeckDecodeV3} ms, each call took ${performanceTimes.smallDeckDecodeV3 / performanceCalls} ms`);
    console.log(`Large Deck - decodeV1: ${performanceTimes.largeDeckDecodeV1} ms, each call took ${performanceTimes.largeDeckDecodeV1 / performanceCalls} ms`);
    console.log(`Large Deck - decodeV2: ${performanceTimes.largeDeckDecodeV2} ms, each call took ${performanceTimes.largeDeckDecodeV2 / performanceCalls} ms`);
    console.log(`Large Deck - decodeV3: ${performanceTimes.largeDeckDecodeV3} ms, each call took ${performanceTimes.largeDeckDecodeV3 / performanceCalls} ms`);

    console.log('Deck Codes:');
    console.log(
      `Small Deck ${smallDeckCode}, with ${decodeV1(smallDeckCode).length} cards:`,
      decodeV3(smallDeckCode).map(({code, count}) => `${code}:${count}`),
    );
    console.log(
      `Large Deck ${largeDeckCode}, with ${decodeV1(largeDeckCode).length} cards:`,
      decodeV3(largeDeckCode).map(({code, count}) => `${code}:${count}`),
    );
  });
});
