import Faction from './faction.mjs';
import Factions from './factions.mjs';
import pad from '../utils/pad.mjs';

/** Class representing a card in a deck. */
export default class Card {
  /**
   * The set number.
   *
   * @type {number}
   */
  set;

  /**
   * The card id
   *
   * @type {number}
   */
  id;

  /**
   * The faction
   *
   * @type {Faction}
   */
  faction;

  /**
   * The count of this card in an deck.
   *
   * @type {number}
   */
  count;

  /**
   * Initialize a new instance of the Card.
   *
   * @param {number} set The set number.
   * @param {Faction} faction The faction.
   * @param {number} id The card id.
   * @param {number} [count] The count of this card.
   */
  constructor(set, faction, id, count = 1) {
    if (!set || set > 99) throw new TypeError('Set is not a valid number');
    if (!faction || !(faction instanceof Faction)) throw new TypeError('Faction is not valid');
    if (!id || id > 999) throw new TypeError('Id is not valid');
    this.set = set;
    this.faction = faction;
    this.id = id;
    this.count = count ?? 1;
  }

  /**
   * Return true, if the instance ist equal.
   *
   * @param {Card} other The other instance to compare.
   * @returns {boolean} True if equals, otherwise false.
   */
  isEqual(other) {
    if (!other || !other instanceof Card) return false;
    return this.set === other.set && this.faction?.id === other.faction?.id && this.id === other.id;
  }

  /**
   * Return true, if the instances are equal.
   *
   * @param {Card} firstCard The first element for comparison.
   * @param {Card} secondCard The second element for comparison.
   * @returns {boolean} True if equals, otherwise false.
   */
  static equals(firstCard, secondCard) {
    if (!firstCard instanceof Card || !secondCard instanceof Card) return false;
    return firstCard.isEqual(secondCard);
  }

  /**
   * Compares the cards. The order uses first set, then faction id and last card id.
   *
   * @param {Card} firstCard The first element for comparison.
   * @param {Card} secondCard The second element for comparison.
   * @returns {number}
   */
  static compare(firstCard, secondCard) {
    let result = firstCard.set - secondCard.set;
    if (result === 0) result = firstCard.faction.id - secondCard.faction.id;
    if (result === 0) result = firstCard.id - secondCard.id;
    return result;
  }

  /**
   * Initialize a new card based on the card code.
   *
   * @param {string} code The 7 character code or 9 character code with count of the card, f.e. `'01DE001'`, or CODE and card count like `'01DE001:3'`.
   * @param {number} [count] The optional count of this card (override count in code), use count from code or the default `1`.
   * @returns {Card} The card parse of the code.
   */
  static fromCode(code, count) {
    const match = code.match(/^(\d{2})([A-Z]{2})(\d{3})(?:\:(\d+))*$/);
    if (!match) throw new TypeError('Code is not a valid card code');
    return new this.prototype.constructor(parseInt(match[1], 10), Factions.fromCode(match[2]), parseInt(match[3], 10), count ?? match[4] ?? 1);
  }

  /**
   * Returns the code for this card.
   *
   * @type {string}
   */
  get code() {
    return `${pad(this.set, 2)}${this.faction.code}${pad(this.id, 3)}`;
  }

  /**
   * Returns the code and count for this card.
   *
   * @type {Object}
   */
   get codeAndCount() {
    return {code: this.code, count: this.count};
  }

  /**
   * Returns the faction version.
   *
   * @type {number}
   */
  get factionVersion() {
    return this.faction.version;
  }

  /**
   * Returns the faction code.
   *
   * @type {string}
   */
  get factionCode() {
    return this.faction.code;
  }

  /**
   * Returns the faction id.
   *
   * @type {number}
   */
  get factionId() {
    return this.faction.id;
  }
}
