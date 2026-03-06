import Base32 from '../utils/base32.mjs';
import VarInt from '../utils/var-int.mjs';
import Card from './card.mjs';
import decode from './decode_v3.mjs';
import {ArgumentError} from './errors.mjs';
import Factions from './factions.mjs';

/**
 * Port c# code from https://github.com/RiotGames/LoRDeckCodes/blob/main/LoRDeckCodes/LoRDeckEncoder.cs into es6
 */

/**
 * Deck format version
 * @type {number}
 */
export const SUPPORTED_FORMAT = 1;

/**
 * Deck cards version
 * @type {number}
 */
export const INITIAL_VERSION = 1;

/**
 * The groups used to match the copy lists, see https://github.com/RiotGames/LoRDeckCodes?tab=readme-ov-file#process
 */
export const COUNT_GROUPS = [3, 2, 1];

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
  static verify(code, skipFormatCheck) {
    let bytes;
    try {
      bytes = Base32.decode(code);
    } catch (error) {
      throw new TypeError(`Invalid deck code: ${error.message}`, {cause: error});
    }

    const [firstByte] = bytes.splice(0, 1);
    if (firstByte === 0) throw new ArgumentError('code', 'Deck code is empty.');

    const format = firstByte >> 4;
    const version = firstByte & 0xf;

    if (!skipFormatCheck && format > SUPPORTED_FORMAT) throw new SyntaxError(`Deck format ${format} is not supported (supported format ${SUPPORTED_FORMAT})`);
    if (version > Factions.maxVersion)
      throw new ArgumentError('version', `Deck version ${version} is not supported (max supported version ${Factions.maxVersion})`);

    return bytes;
  }

  /**
   * Decodes the code into a list of cards.
   * @param {string} code The base32 deck code.
   * @param {boolean} [skipFormatCheck] skip format check
   * @returns {Card[]} The decoded cards.
   */
  static decode = decode;

  /**
   * Encodes the deck into a base32 deck code. see https://github.com/RiotGames/LoRDeckCodes?tab=readme-ov-file#process
   * @param {Card[]} cards The deck cards to encode.
   * @param {number} [version] The deck version.
   * @returns {string} The base32 deck code.
   */
  static encode(cards, version) {
    if (!cards || cards.some(card => !card?.count)) throw new Error('Invalid deck');
    version ??= Math.max(cards.length ? Math.max(...cards.map(({factionVersion: v}) => v)) : 0, INITIAL_VERSION);

    // cards with count > 3 are handled separately
    const grouped = Object.groupBy(cards, ({count}) => (count > 3 ? 'x' : count));

    const values = COUNT_GROUPS.flatMap(count => {
      if (!grouped[count]?.length) return [0];
      // build the map of set and faction combinations within the group of similar card counts
      const factionSets = [...Map.groupBy(grouped[count], ({set, factionSort: sort}) => set * 1000 + sort).entries()];
      return [
        factionSets.length,
        // The sorting convention of this encoding scheme is:
        // - First by the number of set/faction combinations in each top-level list
        // - Second by the alphanumeric order of the card codes within those lists.
        ...factionSets
          .sort(([firstSort, {length: firstCount}], [secondSort, {length: secondCount}]) =>
            firstCount - secondCount !== 0 ? firstCount - secondCount : firstSort - secondSort
          )
          .flatMap(([, cards]) => [cards.length, cards[0].set, cards[0].factionId, ...cards.map(({id}) => id).sort((a, b) => a - b)]),
      ];
    }).concat(
      //Cards with 4+ are coded simply [count, set, faction, id] for each
      grouped.x?.sort(Card.compare).flatMap(card => [card.count, card.set, card.faction.id, card.id]) ?? []
    );

    return Base32.encode([(SUPPORTED_FORMAT << 4) | (version & 0xf), ...values.flatMap(i => VarInt.get(i))]);
  }
}
