import assert from 'assert';
import Card from '../src/card.mjs';
import Faction from '../src/faction.mjs';
import Factions from '../src/factions.mjs';

describe('[Card] class tests', function() {
  describe('constructor tests', function() {
    it('successful', function() {
      const card = new Card(1, new Faction(1, 1, 'DE'), 99);
      const {code, count} = card.codeAndCount;
      assert.equal(code, '01DE099');
      assert.equal(count, 1);
    });

    it('invalid set', function() {
      assert.throws(() => new Card(0, new Faction(1, 1, 'DE'), 1));
    });

    it('invalid faction', function() {
      assert.throws(() => new Card(1, 0, 1));
    });

    it('invalid id', function() {
      assert.throws(() => new Card(1, new Faction(1, 1, 'DE'), 1111));
    });
  });

  describe('card getter', function() {
    const card = new Card(1, new Faction(1, 1, 'DE'), 99, 2);

    it('code', function() {
      assert.equal(card.code, '01DE099');
    });

    it('faction code', function() {
      assert.equal(card.factionCode, 'DE');
    });

    it('faction version', function() {
      assert.equal(card.factionVersion, 1);
    });
  });

  describe('fromCode tests', function() {
    it('invalid code throws exception', function() {
      assert.throws(() => Card.fromCode('01PZ'));
      assert.throws(() => Card.fromCode('01PZ001:'));
      assert.throws(() => Card.fromCode('01PZ01:1'));
      assert.throws(() => Card.fromCode('01PZ0001'));
    });

    it('invalid faction throws exception', function() {
      assert.throws(() => Card.fromCode('01AA001'));
    });

    it('initialize from code default count', function() {
      const card = Card.fromCode('01PZ019');
      assert.equal(card.set, 1);
      assert.equal(card.faction.code, 'PZ');
      assert.equal(card.id, 19);
      assert.equal(card.count, 1);
    });

    it('initialize from code with count', function() {
      const card = Card.fromCode('01PZ001:3');
      assert.equal(card.set, 1);
      assert.equal(card.faction.code, 'PZ');
      assert.equal(card.id, 1);
      assert.equal(card.count, 3);
    });

    it('initialize from code and count', function() {
      const card = Card.fromCodeAndCount({code: '01PZ001', count: 3});
      assert.equal(card.set, 1);
      assert.equal(card.faction.code, 'PZ');
      assert.equal(card.id, 1);
      assert.equal(card.count, 3);
    });
  });

  describe('compare method must return correct value', function() {
    it('(<0) sort a before b', function() {
      assert.equal(Card.compare(Card.fromCode('01DE001'), Card.fromCode('01DE002')) < 0, true);
    });

    it('(=0) keep original order of a and b', function() {
      assert.equal(Card.compare(Card.fromCode('02DE002'), Card.fromCode('02DE002')) === 0, true);
    });

    it('(>0) sort b before a', function() {
      assert.equal(Card.compare(Card.fromCode('02BC002'), Card.fromCode('02DE002')) > 0, true);
    });
  });

  describe('equals method must return correct value', function() {
    it('same card', function() {
      assert.equal(Card.fromCode('01DE001').equals(Card.fromCode('01DE001')), true);
    });

    it('not equal id', function() {
      assert.equal(Card.fromCode('01DE001').equals(Card.fromCode('01DE002')), false);
    });

    it('not equal set', function() {
      assert.equal(Card.fromCode('01DE001').equals(Card.fromCode('02DE001')), false);
    });

    it('not equal faction', function() {
      assert.equal(Card.fromCode('01DE001').equals(Card.fromCode('01BW001')), false);
    });
  });

  describe('static equals method must return correct value', function() {
    it('same card', function() {
      assert.equal(Card.equals(Card.fromCode('01DE001'), Card.fromCode('01DE001')), true);
    });

    it('not equal id', function() {
      assert.equal(Card.equals(Card.fromCode('01DE001'), Card.fromCode('01DE002')), false);
    });
  });

  describe('codeAndCount method must return correct values', function() {
    it('set, faction, id and count check', function() {
      const {code, count} = new Card(1, Factions.fromCode('DE'), 1, 2).codeAndCount;
      assert.equal(code, '01DE001');
      assert.equal(count, 2);
    });
  });

  describe('must detect correct faction from code', function() {
    it('Demacia', function() {
      assert.equal(Card.fromCode('01DE001').factionId, 0);
    });

    it('Freljord', function() {
      assert.equal(Card.fromCode('01FR001').factionId, 1);
    });

    it('Ionia', function() {
      assert.equal(Card.fromCode('01IO001').factionId, 2);
    });

    it('Noxus', function() {
      assert.equal(Card.fromCode('01NX001').factionId, 3);
    });

    it('Piltover & Zaun', function() {
      assert.equal(Card.fromCode('01PZ001').factionId, 4);
    });

    it('Shadow Isles', function() {
      assert.equal(Card.fromCode('01SI001').factionId, 5);
    });

    it('Bilgewater', function() {
      assert.equal(Card.fromCode('01BW001').factionId, 6);
    });

    it('Shurima', function() {
      assert.equal(Card.fromCode('01SH001').factionId, 7);
    });

    it('Mount Targon', function() {
      assert.equal(Card.fromCode('01MT001').factionId, 9);
    });

    it('Bandle City', function() {
      assert.equal(Card.fromCode('01BC001').factionId, 10);
    });

    it('Runeterra', function() {
      assert.equal(Card.fromCode('01RU001').factionId, 12);
    });
  });
});
