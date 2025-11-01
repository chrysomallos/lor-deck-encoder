import VarInt from '../utils/var-int.mjs';
import Card from './card.mjs';
import Encoder, { COUNT_GROUPS } from './encoder.mjs';
import Factions from './factions.mjs';

/**
 * Decodes the code into a list of cards.
 * @param {string} code The base32 deck code.
 * @param {boolean} [skipFormatCheck] skip format check
 * @returns {Card[]} The decoded cards.
 */
export default function decode(code, skipFormatCheck = false) {
  let bytes = Encoder.verify(code, skipFormatCheck);

  const result = new Array();
  for (const count of COUNT_GROUPS) {
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
