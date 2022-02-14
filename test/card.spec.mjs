import Card from '../src/card.mjs';
import assert from 'assert';

describe('[Card] class tests', () => {
  it('invalid code throws exception', () => {
    assert.throws(() => Card.fromCode('01PZ'));
    assert.throws(() => Card.fromCode('01PZ001:'));
    assert.throws(() => Card.fromCode('01PZ01:1'));
    assert.throws(() => Card.fromCode('01PZ0001'));
  });

  it('invalid faction throws exception', () => {
    assert.throws(() => Card.fromCode('01AA001'));
  });

  it('initialize from code default count', () => {
    const card = Card.fromCode('01PZ019');
    assert.equal(card.set, 1);
    assert.equal(card.faction.code, 'PZ');
    assert.equal(card.id, 19);
    assert.equal(card.count, 1);
  });

  it('initialize from code with count', () => {
    const card = Card.fromCode('01PZ001:3');
    assert.equal(card.set, 1);
    assert.equal(card.faction.code, 'PZ');
    assert.equal(card.id, 1);
    assert.equal(card.count, 3);
  });

  describe('compare method must return correct value', () => {
    it('(<0) sort a before b', () => {
      assert.equal(Card.compare(Card.fromCode('01DE001'), Card.fromCode('01DE002')) < 0, true);
    })

    it('(=0) keep original order of a and b', () => {
      assert.equal(Card.compare(Card.fromCode('02DE002'), Card.fromCode('02DE002')) === 0, true);
    })

    it('(>0) sort b before a', () => {
      assert.equal(Card.compare(Card.fromCode('02BC002'), Card.fromCode('02DE002')) > 0, true);
    })
  });

  describe('must detect correct faction from code', () => {
    it('Demacia', () => {
      assert.equal(Card.fromCode('01DE001').factionId, 0);
    });
    it('Freljord', () => {
      assert.equal(Card.fromCode('01FR001').factionId, 1);
    });
    it('Ionia', () => {
      assert.equal(Card.fromCode('01IO001').factionId, 2);
    });
    it('Noxus', () => {
      assert.equal(Card.fromCode('01NX001').factionId, 3);
    });
    it('Piltover & Zaun', () => {
      assert.equal(Card.fromCode('01PZ001').factionId, 4);
    });
    it('Shadow Isles', () => {
      assert.equal(Card.fromCode('01SI001').factionId, 5);
    });
    it('Bilgewater', () => {
      assert.equal(Card.fromCode('01BW001').factionId, 6);
    });
    it('Shurima', () => {
      assert.equal(Card.fromCode('01SH001').factionId, 7);
    });
    it('Mount Targon', () => {
      assert.equal(Card.fromCode('01MT001').factionId, 9);
    });
    it('Bandle City', () => {
      assert.equal(Card.fromCode('01BC001').factionId, 10);
    });
  });
});
