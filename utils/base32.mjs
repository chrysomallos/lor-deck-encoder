/*
 * Port c# version from https://github.com/RiotGames/LoRDeckCodes/blob/main/LoRDeckCodes/Base32.cs into es6
 * based on https://github.com/google/google-authenticator-android/blob/master/AuthenticatorApp/src/main/java/com/google/android/apps/authenticator/Base32String.java
 *
 * Copyright (C) 2016 BravoTango86
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function numberOfTrailingZeros(i) {
  let y;
  if (i == 0) return 32;
  let n = 31;
  y = i << 16;
  if (y != 0) {
    n = n - 16;
    i = y;
  }
  y = i << 8;
  if (y != 0) {
    n = n - 8;
    i = y;
  }
  y = i << 4;
  if (y != 0) {
    n = n - 4;
    i = y;
  }
  y = i << 2;
  if (y != 0) {
    n = n - 2;
    i = y;
  }
  return n - ((i << 1) >> 31);
}

const CHARACTER = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'];
const CHARACTER_MAP = new Map(CHARACTER.map((d, i) => [d, i]));
const MASK = CHARACTER.length - 1;
const SHIFT = numberOfTrailingZeros(CHARACTER.length);

/**
 * The base32 en/decoder.
 */
export default class Base32 {
  /**
   * Decode the base32 value into a number array
   *
   * @param {string} code the encoded as base 32 string
   * @returns {byte[]} the decoded values
   */
  static decode(code) {
    const trimmed = code.toUpperCase().trim().replace(/[=-]/g, '');
    if (!trimmed.length) return [0];

    const result = new Array(Math.floor((trimmed.length * SHIFT) / 8));

    [...trimmed].reduce(
      ({buffer, next, bitsLeft}, character, index) => {
        const value = CHARACTER_MAP.get(character);
        if (value === undefined) {
          throw new TypeError(`Illegal character '${character}' at position '${index}' in '${trimmed}'`);
        }
        buffer <<= SHIFT;
        buffer |= value & MASK;
        bitsLeft += SHIFT;
        if (bitsLeft >= 8) {
          result[next++] = (buffer >> (bitsLeft - 8)) & 0xff;
          bitsLeft -= 8;
        }
        return {buffer, next, bitsLeft};
      },
      {buffer: 0, next: 0, bitsLeft: 0}
    );

    return result;
  }

  /**
   * Encode the values into a base32 string
   *
   * @param {byte[]} bytes the numbers array to encode
   * @returns {string} the encoded base32 value
   */
  static encode(bytes) {
    if (!bytes?.length) return '';
    if (bytes.length >= 1 << 28) throw new RangeError('Value is too long to encode as base32 string');

    const result = Buffer.alloc(Math.floor((bytes.length * 8 + SHIFT - 1) / SHIFT));

    let buffer = bytes[0];
    let nextByte = 1;
    let bitsLeft = 8;
    let resultOffset = 0;
    while (bitsLeft > 0 || nextByte < bytes.length) {
      if (bitsLeft < SHIFT) {
        if (nextByte < bytes.length) {
          buffer <<= 8;
          buffer |= bytes[nextByte++] & 0xff;
          bitsLeft += 8;
        } else {
          const pad = SHIFT - bitsLeft;
          buffer <<= pad;
          bitsLeft += pad;
        }
      }
      const index = MASK & (buffer >> (bitsLeft - SHIFT));
      bitsLeft -= SHIFT;
      result.write(CHARACTER[index], resultOffset++);
    }
    return result.toString('utf8');
  }
}
