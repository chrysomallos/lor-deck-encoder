/** Class representing a card in a deck. */
export default class Card {
    /**
     * Return true, if the instances are equal.
     * @param {Card} firstCard The first element for comparison.
     * @param {Card} secondCard The second element for comparison.
     * @returns {boolean} True if equals, otherwise false.
     */
    static equals(firstCard: Card, secondCard: Card): boolean;
    /**
     * Returns an integer indicating whether the firstCard comes before, after or is equivalent to the secondCard.
     * @param {Card} firstCard The first element for comparison.
     * @param {Card} secondCard The card against which the first card is compared.
     * @returns {number} A negative number if first card occurs before second card; positive if the first card occurs after second card; 0 if they are equivalent.
     */
    static compare(firstCard: Card, secondCard: Card): number;
    /**
     * Initialize a new card based on the card code.
     * @param {string} code The 7 character code or 9 character code with count of the card, f.e. `'01DE001'`, or CODE and card count like `'01DE001:3'`.
     * @param {number} [count] The optional count of this card (override count in code), use count from code or the default `1`.
     * @returns {Card} The card parse of the code.
     */
    static fromCode(code: string, count?: number): Card;
    /**
     * Initialize a new card based on the card code object.
     * @param {{code: string, count: number}} codeCount
     *   The 7 character code or 9 character code with count of the card, f.e. `'01DE001'`, or CODE and card count like `'01DE001:3'` and
     *   the count of this card (override count in code), use count from code or the default `1`.
     * @returns {Card} The card parse of the code.
     */
    static fromCodeAndCount({ code, count }: {
        code: string;
        count: number;
    }): Card;
    /**
     * Initialize a new instance of the Card.
     * @param {number} set The set number.
     * @param {Faction} faction The faction.
     * @param {number} id The card id.
     * @param {number} [count] The count of this card, defaults to one.
     */
    constructor(set: number, faction: Faction, id: number, count?: number);
    /**
     * The set number.
     * @type {number}
     */
    set: number;
    /**
     * The card id
     * @type {number}
     */
    id: number;
    /**
     * The faction
     * @type {Faction}
     */
    faction: Faction;
    /**
     * The count of this card in a deck.
     * @type {number}
     */
    count: number;
    /**
     * Return true, if the instance ist equal.
     * @param {Card} other The other instance to compare.
     * @returns {boolean} True if equals, otherwise false.
     */
    equals(other: Card): boolean;
    /**
     * Returns the code for this card.
     * @type {string}
     */
    get code(): string;
    /**
     * Returns the code and count for this card.
     * @type {{code: string, count: number}} The code object
     */
    get codeAndCount(): {
        code: string;
        count: number;
    };
    /**
     * Returns the faction version.
     * @type {number}
     */
    get factionVersion(): number;
    /**
     * Returns the faction code.
     * @type {string}
     */
    get factionCode(): string;
    /**
     * Returns the faction id.
     * @type {number}
     */
    get factionId(): number;
    /**
     * Returns the faction alphanumeric sort.
     * @type {number}
     */
    get factionSort(): number;
}
import Faction from './faction.mjs';
//# sourceMappingURL=card.d.mts.map