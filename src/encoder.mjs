import Card from './card.mjs';
import {ArgumentError} from './errors.mjs';
import Factions from './factions.mjs';
import Base32 from '../utils/base32.mjs';
import VarInt from '../utils/var-int.mjs';

/**
 * Port c# code from https://github.com/RiotGames/LoRDeckCodes/blob/main/LoRDeckCodes/LoRDeckEncoder.cs into es6
 */

const SUPPORTED_FORMAT = 1;
const INITIAL_VERSION = 1;

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
  static decode(code, skipFormatCheck = false) {
    let bytes;
    try {
      bytes = Base32.decode(code);
    } catch (error) {
      throw new TypeError(`Invalid deck code: ${error.message}`);
    }

    const [firstByte] = bytes.splice(0, 1);
    const format = firstByte >> 4;
    const version = firstByte & 0xf;

    if (!skipFormatCheck && format > SUPPORTED_FORMAT) throw new SyntaxError(`Deck format ${format} is not supported (supported format ${SUPPORTED_FORMAT})`);
    if (version > Factions.maxVersion)
      throw new ArgumentError('version', `Deck version ${version} is not supported (max supported version ${Factions.maxVersion})`);

    const result = new Array();
    for (let count = 3; count > 0; count -= 1) {
      const groups = VarInt.pop(bytes);
      for (let group = 0; group < groups; group += 1) {
        const cards = VarInt.pop(bytes);
        const set = VarInt.pop(bytes);
        const faction = VarInt.pop(bytes);
        for (let card = 0; card < cards; card += 1) {
          result.push(new Card(set, Factions.fromId(faction), VarInt.pop(bytes), count));
        }
      }
    }

    while (bytes.length) {
      const count = VarInt.pop(bytes);
      const set = VarInt.pop(bytes);
      const faction = VarInt.pop(bytes);
      const id = VarInt.pop(bytes);
      result.push(new Card(set, Factions.fromId(faction), id, count));
    }

    return result;
  }

  /**
   * Encodes the deck into a base32 deck code.
   * @param {Card[]} cards The deck cards to encode.
   * @param {number} [version] The deck version.
   * @returns {string} The base32 deck code.
   */
  static encode(cards, version) {
    if (cards.some(card => !card?.count)) throw new Error('Invalid deck');
    version ??= Math.max(
      cards?.reduce((l, {factionVersion: v}) => Math.max(l, v), 0),
      version,
      INITIAL_VERSION
    );

    // cards with count > 3 are handled separately
    const grouped = Object.groupBy(cards, ({count}) => (count > 3 ? 'x' : count));

    const values = [3, 2, 1]
      .flatMap(count => {
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
      })
      .concat(
        //Cards with 4+ are coded simply [count, set, faction, id] for each
        grouped.x?.sort(Card.compare).flatMap(card => [card.count, card.set, card.faction.id, card.id]) ?? []
      );

    return Base32.encode([(SUPPORTED_FORMAT << 4) | (version & 0xf), ...values.flatMap(i => VarInt.get(i))]);
  }
}
