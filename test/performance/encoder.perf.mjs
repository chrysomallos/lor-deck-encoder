import assert from 'assert';
import Base32 from '../../utils/base32.mjs';
import Encoder from '../../src/encoder.mjs';
import VarInt from '../../utils/var-int.mjs';

import {ArgumentError} from '../../src/errors.mjs';
import Factions from '../../src/factions.mjs';
import Card from '../../src/card.mjs';

const SUPPORTED_FORMAT = 1;

/**
 * Decodes the code into a list of cards.
 * @param {string} code The base32 deck code.
 * @param {boolean} [skipFormatCheck] skip format check
 * @returns {Card[]} The decoded cards.
 */
function decodeImprove(code, skipFormatCheck = false) {
  let bytes;
  try {
    bytes = Base32.decode(code);
  } catch (error) {
    throw new TypeError(`Invalid deck code: ${error.message}`);
  }
  if (bytes.length < 4) throw new SyntaxError(`Code must have some valid bytes to decode.`);

  const [firstByte] = bytes.splice(0, 1);
  const format = firstByte >> 4;
  const version = firstByte & 0xf;

  if (!skipFormatCheck && format > SUPPORTED_FORMAT) throw new SyntaxError(`Deck format ${format} is not supported (supported format ${SUPPORTED_FORMAT})`);
  if (version > Factions.maxVersion)
    throw new ArgumentError('version', `Deck version ${version} is not supported (max supported version ${Factions.maxVersion})`);

  /**
   * @type {number[]}
   */
  const values = VarInt.decode(bytes);

  const result = new Array();

  for (const count of [3, 2, 1]) {
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

describe('[Encoder] performance test', function () {
  const code = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';
  const codeSmall = 'CMAQCBAHBIAQCBAHAMAAIAQAAICQGBQE';
  const performanceCalls = 100000;

  it(`Encoder.decode (${performanceCalls} times)`, function () {
    for (let i = 0; i < performanceCalls; i += 1) Encoder.decode(code);
  });

  it(`decodeImprove (${performanceCalls} times)`, function () {
    for (let i = 0; i < performanceCalls; i += 1) decodeImprove(code);
  });

  it(`Ensure equality bigger deck (${performanceCalls} times)`, function () {
    const oldResult = Encoder.decode(code);
    const newResult = decodeImprove(code);
    assert.equal(oldResult.length, newResult.length);
  });

  it(`Ensure equality small deck (${performanceCalls} times)`, function () {
    const oldResult = Encoder.decode(codeSmall);
    const newResult = decodeImprove(codeSmall);
    assert.equal(oldResult.length, newResult.length);
  });
});
