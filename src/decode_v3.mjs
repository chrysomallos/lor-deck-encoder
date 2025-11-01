import VarInt from '../utils/var-int.mjs';
import Card from './card.mjs';
import Encoder from './encoder.mjs';
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

  let entries;
  let group = 3;

  for (let i = 0; i < values.length; ) {
    if (group > 0) {
      if (!entries) {
        entries = values[i];
        if (!entries) group = group - 1;
        i = i + 1;
        continue;
      }

      const cards = values[i];
      const set = values[i + 1];
      const faction = Factions.fromId(values[i + 2]);

      for (let id of values.slice(i + 3, i + 3 + cards)) {
        result.push(new Card(set, faction, id, group));
      }

      i = i + cards + 3;
      entries = entries - 1;
      if (!entries) group = group - 1;
    } else {
      result.push(new Card(values[i + 1], Factions.fromId(values[i + 2]), values[i + 3], values[i]));
      i = i + 4;
    }
  }

  return result;
}