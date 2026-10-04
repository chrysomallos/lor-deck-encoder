import Card from './card.mjs';
/**
 * Initial implementation of decode with VarInt.pop like the original implementation from port source code.
 * This implementation is slower than decodeV2 and decodeV3, but it is kept for reference and comparison.
 */
/**
 * Decodes the code into a list of cards.
 * @param {string} code The base32 deck code.
 * @param {boolean} [skipFormatCheck] skip format check
 * @returns {Card[]} The decoded cards.
 */
export default function decode(code: string, skipFormatCheck?: boolean): Card[];
//# sourceMappingURL=decode_v1.d.mts.map