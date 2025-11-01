import assert from 'node:assert';
import decodeV1 from '../../src/decode_v1.mjs';
import decodeV2 from '../../src/decode_v2.mjs';
import decodeV3 from '../../src/decode_v3.mjs';

describe('[Encoder]', function () {
  const largeDeckCode = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';
  const smallDeckCode = 'CMAQCBAHBIAQCBAHAMAAIAQAAICQGBQE';

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
    const performanceCalls = 100000;

    it(`decodeV1 (${performanceCalls} times)`, function () {
      for (let i = 0; i < performanceCalls; i += 1) decodeV1(largeDeckCode);
    });

    it(`decodeV2 (${performanceCalls} times)`, function () {
      for (let i = 0; i < performanceCalls; i += 1) decodeV2(largeDeckCode);
    });

    it(`decodeV3 (${performanceCalls} times)`, function () {
      for (let i = 0; i < performanceCalls; i += 1) decodeV3(largeDeckCode);
    });
  });

  describe('performance test with a small deck', function () {
    const performanceCalls = 100000;

    it(`decodeV1 (${performanceCalls} times)`, function () {
      for (let i = 0; i < performanceCalls; i += 1) decodeV1(smallDeckCode);
    });

    it(`decodeV2 (${performanceCalls} times)`, function () {
      for (let i = 0; i < performanceCalls; i += 1) decodeV2(smallDeckCode);
    });

    it(`decodeV3 (${performanceCalls} times)`, function () {
      for (let i = 0; i < performanceCalls; i += 1) decodeV3(smallDeckCode);
    });
  });
});
