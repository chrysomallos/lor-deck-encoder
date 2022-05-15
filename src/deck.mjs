import Card from './card.mjs';
import Encoder from './encoder.mjs';

/** Class represents the Riot Games - Legends of Runeterra - deck. */
export default class Deck {
  /**
   * The list of the cards in this deck.
   * @type {Card[]}
   */
  cards;

  /**
   * Initialize a new deck instance and assign the cards.
   * @param {Card[]} cards The list of cards.
   */
  constructor(cards = []) {
    this.cards = cards;
  }

  /**
   * Parse the code an returns an instance of the deck.
   * @param {string} code
   * @returns {Deck} The instance of the deck.
   */
  static fromCode(code) {
    return new this.prototype.constructor(Encoder.decode(code));
  }

  /**
   * Parse the card codes an returns an instance of the deck including the cards.
   * @param {string[]} codes
   * @returns {Deck} The instance of the deck.
   */
  static fromCardCodes(codes) {
    return new this.prototype.constructor(codes.map((c) => Card.fromCode(c)));
  }

  /**
   * Parse the cards with count and returns an instance of the deck.
   * @param {{code:string, count: number}[]} cardCounts
   * @returns {Deck} The instance of the deck.
   */
   static fromCardCodesAndCounts(cardCounts) {
    return new this.prototype.constructor(cardCounts.map((c) => Card.fromCodeAndCount(c)));
  }

  /**
   * Gets the maximum deck version of the cards.
   * @type {number}
   */
  get version() {
    return this.cards?.reduce((last, {factionVersion: version}) => Math.max(last, version), 1);
  }

  /**
   * Gets the encoded deck code.
   * @returns {string} The base32 based deck code.
   */
  get code() {
    return Encoder.encode(this.cards, this.version);
  }

  /**
   * Gets the formatted card list from this deck.
   * @returns {string[]} The list of cards in the deck.
   */
  get list() {
    return this.cards.map(({code, count}) => `${code}:${count}`);
  }

  /**
   * Gets the formatted card list from this deck.
   * @returns {string[]} The list of cards in the deck.
   */
  get allCodeAndCount() {
    return this.cards.map(({codeAndCount}) => codeAndCount);
  }

  /**
   * Sorting the cards of the deck in place using the card comparer.
   */
  sort() {
    this.cards.sort(Card.comparer);
  }

  /**
   * Adding a card in the deck, throws an error if the deck already contains the card.
   * @param {Card|string} card Instance of an Card or an code parsable by {@see Card.fromCode}.
   * @param {number} [count] The optional count if not defined in card or code.
   */
  add(card, count) {
    const usedCard = card instanceof Card ? card : Card.fromCode(card, count);
    if (this.contains(usedCard)) throw TypeError('Deck already contains this card');
    this.cards.push(usedCard);
  }

  /**
   * Checks that the deck contains the defined card.
   * @param {Card} card The card to check.
   * @returns {boolean} True if deck contains the card otherwise false.
   */
  contains(card) {
    if (!card instanceof Card) return false;
    return this.cards.some((c) => card.equals(c));
  }
}
