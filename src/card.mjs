import Faction from './faction.mjs';
import Factions from './factions.mjs';
import pad from '../utils/pad.mjs';

/** Class representing a card in a deck. */
export default class Card {
  /**
   * The set number.
   * @type {number}
   */
  set;

  /**
   * The card id
   * @type {number}
   */
  id;

  /**
   * The faction
   * @type {Faction}
   */
  faction;

  /**
   * The count of this card in a deck.
   * @type {number}
   */
  count;

  /**
   * Initialize a new instance of the Card.
   * @param {number} set The set number.
   * @param {Faction} faction The faction.
   * @param {number} id The card id.
   * @param {number} [count] The count of this card, defaults to one.
   */
  constructor(set, faction, id, count = 1) {
    if (!set || set > 99) throw new TypeError('Set is not a valid number');
    if (!faction || !(faction instanceof Faction)) throw new TypeError('Faction is not valid');
    if (!id || id > 999) throw new TypeError('Id is not valid');
    this.set = set;
    this.faction = faction;
    this.id = id;
    this.count = count;
  }

  /**
   * Return true, if the instance ist equal.
   * @param {Card} other The other instance to compare.
   * @returns {boolean} True if equals, otherwise false.
   */
  equals(other) {
    if (!(other instanceof Card)) return false;
    return this.set === other.set && this.faction?.id === other.faction?.id && this.id === other.id;
  }

  /**
   * Return true, if the instances are equal.
   * @param {Card} firstCard The first element for comparison.
   * @param {Card} secondCard The second element for comparison.
   * @returns {boolean} True if equals, otherwise false.
   */
  static equals(firstCard, secondCard) {
    if (!(firstCard instanceof Card) || !(secondCard instanceof Card)) return false;
    return firstCard.equals(secondCard);
  }

  /**
   * Returns an integer indicating whether the firstCard comes before, after or is equivalent to the secondCard.
   * @param {Card} firstCard The first element for comparison.
   * @param {Card} secondCard The card against which the first card is compared.
   * @returns {number} A negative number if first card occurs before second card; positive if the first card occurs after second card; 0 if they are equivalent.
   */
  static compare(firstCard, secondCard) {
    if (!(firstCard instanceof Card)) throw new TypeError('First card must be a valid instance.');
    if (!(secondCard instanceof Card)) throw new TypeError('Second card must be a valid instance.');
    let result = firstCard.set - secondCard.set;
    if (result === 0) result = firstCard.faction.sort - secondCard.faction.sort;
    if (result === 0) result = firstCard.id - secondCard.id;
    return result;
  }

  /**
   * Initialize a new card based on the card code.
   * @param {string} code The 7 character code or 9 character code with count of the card, f.e. `'01DE001'`, or CODE and card count like `'01DE001:3'`.
   * @param {number} [count] The optional count of this card (override count in code), use count from code or the default `1`.
   * @returns {Card} The card parse of the code.
   */
  static fromCode(code, count) {
    const [match, set, faction, id, matchCount] = code?.match(/^(\d{2})([A-Z]{2})(\d{3})(?::(\d+))*$/) ?? [];
    if (!match) throw new TypeError('Code is not a valid card code');
    return new this.prototype.constructor(parseInt(set, 10), Factions.fromCode(faction), parseInt(id, 10), count ?? matchCount ?? 1);
  }

  /**
   * Initialize a new card based on the card code object.
   * @param {{code: string, count: number}} codeCount
   *   The 7 character code or 9 character code with count of the card, f.e. `'01DE001'`, or CODE and card count like `'01DE001:3'` and
   *   the count of this card (override count in code), use count from code or the default `1`.
   * @returns {Card} The card parse of the code.
   */
  static fromCodeAndCount({code, count}) {
    return Card.fromCode(code, count);
  }

  /**
   * Returns the code for this card.
   * @type {string}
   */
  get code() {
    return `${pad(this.set, 2)}${this.faction.code}${pad(this.id, 3)}`;
  }

  /**
   * Returns the code and count for this card.
   * @type {{code: string, count: number}} The code object
   */
  get codeAndCount() {
    return {code: this.code, count: this.count};
  }

  /**
   * Returns the faction version.
   * @type {number}
   */
  get factionVersion() {
    return this.faction.version;
  }

  /**
   * Returns the faction code.
   * @type {string}
   */
  get factionCode() {
    return this.faction.code;
  }

  /**
   * Returns the faction id.
   * @type {number}
   */
  get factionId() {
    return this.faction.id;
  }

  /**
   * Returns the faction alphanumeric sort.
   * @type {number}
   */
  get factionSort() {
    return this.faction.sort;
  }
}
