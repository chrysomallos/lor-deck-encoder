import assert from 'node:assert';
import decodeV1 from '../../src/decode_v1.mjs';
import decodeV2 from '../../src/decode_v2.mjs';
import decodeV3 from '../../src/decode_v3.mjs';

describe('[decode] functions', function () {
  const largeDeckCode = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';
  const largeDeckCardCount = 18;
  const largeDeckCards =
    '01DE009:3,01DE032:3,01DE052:3,01DE053:3,01IO010:3,01IO016:3,01IO019:3,01IO032:3,01IO048:3,01IO049:2,01DE002:2,01DE007:2,01DE042:2,01IO043:1,01IO045:1,01DE006:1,01DE029:1,01DE045:1';

  const smallDeckCode = 'CMAQCBAHBIAQCBAHAMAAIAQAAICQGBQE';
  const smallDeckCardCount = 4;
  const smallDeckCards = '04SH010:3,04SH003:2,02DE002:4,03BW004:5';

  const joinCards = cards => cards.map(({codeAndCount: {code, count}}) => `${code}:${count}`).join(',');

  describe('ensure valid V1 decode', function () {
    it('with large deck', function () {
      const result = decodeV1(largeDeckCode);
      assert.equal(result.length, largeDeckCardCount);
      assert.equal(joinCards(result), largeDeckCards);
    });

    it('with small deck', function () {
      const result = decodeV1(smallDeckCode);
      assert.equal(result.length, smallDeckCardCount);
      assert.equal(joinCards(result), smallDeckCards);
    });
  });

  describe('ensure valid V2 decode', function () {
    it('with large deck', function () {
      const result = decodeV2(largeDeckCode);
      assert.equal(result.length, largeDeckCardCount);
      assert.equal(joinCards(result), largeDeckCards);
    });

    it('with small deck', function () {
      const result = decodeV2(smallDeckCode);
      assert.equal(result.length, smallDeckCardCount);
      assert.equal(joinCards(result), smallDeckCards);
    });
  });

  describe('ensure valid V3 decode', function () {
    it('with large deck', function () {
      const result = decodeV3(largeDeckCode);
      assert.equal(result.length, largeDeckCardCount);
      assert.equal(joinCards(result), largeDeckCards);
    });

    it('with small deck', function () {
      const result = decodeV3(smallDeckCode);
      assert.equal(result.length, smallDeckCardCount);
      assert.equal(joinCards(result), smallDeckCards);
    });
  });
});
