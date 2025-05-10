/**
 * Port c# code from https://github.com/RiotGames/LoRDeckCodes/blob/main/LoRDeckCodes/LoRDeckEncoder.cs into es6
 */
/**
 * Deck format version
 * @type {number}
 */
export const SUPPORTED_FORMAT: number;
/**
 * Deck cards version
 * @type {number}
 */
export const INITIAL_VERSION: number;
/**
 * The groups used to match the copy lists, see https://github.com/RiotGames/LoRDeckCodes?tab=readme-ov-file#process
 */
export const COUNT_GROUPS: number[];
/**
 * The encoding helper to generate a code for a deck or a deck from a code.
 */
export default class Encoder {
    /**
     * Verify the code and returns the card bytes if valid.
     * @param {string} code The base32 deck code.
     * @param {boolean} skipFormatCheck skip format check
     * @returns {Uint8Array} The card bytes.
     */
    static verify(code: string, skipFormatCheck: boolean): Uint8Array;
    /**
     * Decodes the code into a list of cards.
     * @param {string} code The base32 deck code.
     * @param {boolean} [skipFormatCheck] skip format check
     * @returns {Card[]} The decoded cards.
     */
    static decode: typeof decode;
    /**
     * Encodes the deck into a base32 deck code. see https://github.com/RiotGames/LoRDeckCodes?tab=readme-ov-file#process
     * @param {Card[]} cards The deck cards to encode.
     * @param {number} [version] The deck version.
     * @returns {string} The base32 deck code.
     */
    static encode(cards: Card[], version?: number): string;
}
import decode from './decode_v3.mjs';
import Card from './card.mjs';
//# sourceMappingURL=encoder.d.mts.map