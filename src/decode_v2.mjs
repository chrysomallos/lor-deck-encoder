import VarInt from '../utils/var-int.mjs';
import Card from './card.mjs';
import Encoder, {COUNT_GROUPS} from './encoder.mjs';
import Factions from './factions.mjs';

/**
 * Decodes the code into a list of cards.
 * @param {string} code The base32 deck code.
 * @param {boolean} [skipFormatCheck] skip format check
 * @returns {Card[]} The decoded cards.
 */
export default function decode(code, skipFormatCheck = false) {
  /**
   * @type {number[]}
   */
  const values = VarInt.decode(Encoder.verify(code, skipFormatCheck));

  const result = new Array();

  for (const count of COUNT_GROUPS) {
    const groups = values.shift();
    for (let group = 0; group < groups; group += 1) {
      const cards = values.shift();
      const set = values.shift();
      const faction = values.shift();
      for (let card = 0; card < cards; card += 1) {
        result.push(new Card(set, Factions.fromId(faction), values.shift(), count));
      }
    }
  }

  while (values.length) {
    const [count, set, faction, id] = values.splice(0, 4);
    result.push(new Card(set, Factions.fromId(faction), id, count));
  }

  return result;
}
