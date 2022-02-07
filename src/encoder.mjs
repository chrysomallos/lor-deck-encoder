import Base32 from '../utils/base32.mjs';
import Factions from './factions.mjs';
import VarInt from '../utils/var-int.mjs';
import Card from './card.mjs';
import pad from '../utils/pad.mjs';

/**
 * Port c# code from https://github.com/RiotGames/LoRDeckCodes/blob/main/LoRDeckCodes/LoRDeckEncoder.cs into es6
 */

const FORMAT = 1;
const INITAL_VERSION = 1;

/**
 * The encoding helper to generate a code for an deck or an deck from a code.
 */
export default class Encoder {
  /**
   * Decodes the code into a list of cards.
   *
   * @param {string} code The base32 deck code.
   * @returns {Card[]} The decoded cards.
   */
  static decode(code) {
    let values;
    try {
      values = Base32.decode(code);
    } catch (error) {
      throw new TypeError(`Invalid deck code: ${error.message}`);
    }

    const [firstVersion] = values.splice(0, 1);
    const format = firstVersion >> 4;
    const version = firstVersion & 0xf;

    if (format > FORMAT) throw new Error(`Deck format ${format} is not supported (supported format ${FORMAT})`);
    if (version > Factions.maxVersion) throw new Error(`Deck version ${version} is not supported (max supported version ${Factions.maxVersion})`);

    const result = new Array();
    for (let count = 3; count > 0; count -= 1) {
      const groups = VarInt.pop(values);
      for (let group = 0; group < groups; group += 1) {
        const cards = VarInt.pop(values);
        const set = VarInt.pop(values);
        const faction = VarInt.pop(values);
        for (let card = 0; card < cards; card += 1) {
          result.push(new Card(set, Factions.fromId(faction), VarInt.pop(values), count));
        }
      }
    }

    while (values.length) {
      const count = VarInt.pop(values);
      const set = VarInt.pop(values);
      const faction = VarInt.pop(values);
      const id = VarInt.pop(values);
      result.push(new Card(set, Factions.fromId(faction), id, count));
    }

    return result;
  }

  /**
   * Encodes the deck into a base32 deck code.
   *
   * @param {Card[]} cards The deck cards to encode.
   * @param {number} [version] The deck version.
   * @returns {string} The base32 deck code.
   */
  static encode(cards, version) {
    if (cards.some((card) => !card?.count)) throw new Error('Invalid deck');
    version = Math.max(
      cards?.reduce((l, {factionVersion: v}) => Math.max(l, v), 0),
      version,
      INITAL_VERSION
    );

    const values = [];
    const grouped = cards.reduce(
      (groups, card) => {
        if (card.count > 3) groups.x.push(card);
        // cards with count > 3 are handles separate
        else groups[card.count].push(card); //build groups of similar card counts
        return groups;
      },
      {3: [], 2: [], 1: [], x: []}
    );

    [3, 2, 1].forEach((count) => {
      //build the map of set and faction combinations within the group of similar card counts
      const factionSetsMap = grouped[count].reduce((map, card) => {
        const sf = card.set * 100 + card.factionId;
        if (map.has(sf)) map.get(sf).push(card);
        else map.set(sf, [card]);
        return map;
      }, new Map());

      values.push(factionSetsMap.size);
      //The sorting convention of this encoding scheme is
      //First by the number of set/faction combinations in each top-level list
      //Second by the alphanumeric order of the card codes within those lists.
      [...factionSetsMap.keys()].sort().forEach((sf) => {
        const cards = factionSetsMap.get(sf);
        values.push(cards.length);
        values.push(cards[0].set);
        values.push(cards[0].factionId);
        cards.sort((a, b) => a.id - b.id).forEach((card) => values.push(card.id));
      });
    });

    //Cards with 4+ are coded simply [count, set, faction, id] for each
    grouped.x.sort(Card.comparer).forEach((card) => {
      values.push(card.count);
      values.push(card.set);
      values.push(card.faction.id);
      values.push(card.id);
    });

    return Base32.encode([(FORMAT << 4) | (version & 0xf), ...values.flatMap((i) => VarInt.get(i))]);
  }
}
