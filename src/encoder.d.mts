/**
 * The encoding helper to generate a code for a deck or a deck from a code.
 */
export default class Encoder {
    /**
     * Decodes the code into a list of cards.
     * @param {string} code The base32 deck code.
     * @param {boolean} [skipFormatCheck] skip format check
     * @returns {Card[]} The decoded cards.
     */
    static decode(code: string, skipFormatCheck?: boolean): Card[];
    /**
     * Encodes the deck into a base32 deck code. see https://github.com/RiotGames/LoRDeckCodes?tab=readme-ov-file#process
     * @param {Card[]} cards The deck cards to encode.
     * @param {number} [version] The deck version.
     * @returns {string} The base32 deck code.
     */
    static encode(cards: Card[], version?: number): string;
}
import Card from './card.mjs';
//# sourceMappingURL=encoder.d.mts.map