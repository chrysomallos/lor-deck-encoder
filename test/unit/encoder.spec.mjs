import Encoder from '../../src/encoder.mjs';
import {ArgumentError} from '../../src/errors.mjs';
import assert from 'assert';
import Base32 from '../../utils/base32.mjs';

describe('[Encoder] class tests', function () {
  describe('decode method', function () {
    it('no cards', function () {
      assert.equal(Encoder.decode('CEAAAAA').length, 0);
    });

    it('no cards skip version', function () {
      assert.equal(Encoder.decode('EUAAAAA', true).length, 0);
    });

    it('check version', function () {
      assert.throws(() => Encoder.decode('CZAAAAA', false), ArgumentError);
    });

    it('check format', function () {
      assert.throws(() => Encoder.decode('EUAAAAA', false), SyntaxError);
    });

    it('empty value', function () {
      assert.throws(() => Encoder.decode(''));
    });
  });

  describe('encode method', function () {
    it('invalid deck', function () {
      assert.throws(() => Encoder.encode());
      assert.throws(() => Encoder.encode([null]));
      assert.throws(() => Encoder.encode([{count: 0}]));
    });

    it('encodes correctly', function () {
      assert.equal(Encoder.encode([], 10), 'DIAAAAA', 'ten');
      assert.equal(Encoder.encode([]), 'CEAAAAA', 'undefined');
      assert.equal(Encoder.encode([{count: 1, factionVersion: 3}]), 'CMAAAAIB', 'from card');
    });
  });

  describe('decode algorithm', function () {

    const newGrouping = cards => Object.groupBy(cards, ({count}) => (count > 3 ? 'x' : count));
    const newMapping = (grouped, count) => Map.groupBy(grouped[count] ?? [], ({set, factionId}) => set * 100 + factionId);

    const code = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';
    let cards, info;

    beforeEach(function () {
      cards = Encoder.decode(code);
      info = Base32.decode(code);
    });

    it('must match old groups', function () {
      const groups = newGrouping(cards);

      newMapping(groups, 3);
    });

    it('must match lengths', function () {
      assert.equal(cards.length, 18);
      assert.equal(info.length, 40);
    });
  });
});
