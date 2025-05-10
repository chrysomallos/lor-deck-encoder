/**
 * Class represents the Riot Games - Legends of Runeterra - deck.
 * See [LoRDeckCodes](https://github.com/RiotGames/LoRDeckCodes?tab=readme-ov-file#cards--decks)
 */
export default class Deck {
    /**
     * Parse the code and returns an instance of the deck.
     * @param {string} code The Legends of Runeterra deck as a simple string.
     * @param {boolean} [skipFormatCheck] Skip the format check, defaults to true.
     * @returns {Deck} The instance of the deck.
     */
    static fromCode(code: string, skipFormatCheck?: boolean): Deck;
    /**
     * Parse the card codes and returns an instance of the deck including the cards.
     * @param {string[]} codes The array of simplified card codes, like `['01DE123']`.
     * @returns {Deck} The instance of the deck.
     */
    static fromCardCodes(codes: string[]): Deck;
    /**
     * Parse the cards with count and returns an instance of the deck.
     * @param {{code: string, count: number}[]} cardCounts The list of cards as structure of card code and count.
     * @returns {Deck} The instance of the deck.
     */
    static fromCardCodesAndCounts(cardCounts: {
        code: string;
        count: number;
    }[]): Deck;
    /**
     * Initialize a new deck instance and assign the cards.
     * @param {Card[]} cards The list of cards.
     */
    constructor(cards?: Card[]);
    /**
     * The list of the cards in this deck.
     * @type {Card[]}
     */
    cards: Card[];
    /**
     * Returns the sum of all cards.
     * @returns {number} The size of the deck, all cards (using count).
     */
    get size(): number;
    /**
     * Gets the maximum deck version of the cards.
     * @type {number}
     */
    get version(): number;
    /**
     * Gets the encoded deck code.
     * @returns {string} The base32 based deck code.
     */
    get code(): string;
    /**
     * Gets the formatted card list from this deck.
     * @returns {string[]} The list of cards in the deck.
     */
    get list(): string[];
    /**
     * Gets the formatted card list from this deck.
     * @returns {string[]} The list of cards in the deck.
     */
    get allCodeAndCount(): string[];
    /**
     * Sorting the cards of the deck in place using the card comparer.
     */
    sort(): void;
    /**
     * Adding a card in the deck, throws an error if the deck already contains the card.
     * @param {Card|string} card Instance of a card or a code parsable from.
     * @param {number} [count] The optional count if not defined in card or code.
     */
    add(card: Card | string, count?: number): void;
    /**
     * Checks that the deck contains the defined card.
     * @param {Card} card The card to check.
     * @returns {boolean} True if deck contains the card otherwise false.
     */
    contains(card: Card): boolean;
}
import Card from './card.mjs';
//# sourceMappingURL=deck.d.mts.map