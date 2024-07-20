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
import {Buffer} from 'node:buffer';

/**
 * Calculates the number of trailing zeros in the binary representation of a given 32-bit integer.
 * This function determines the number of consecutive zero bits following the least significant one bit in the binary representation of the input number.
 * @param {number} int - The 32-bit integer to check. If the integer is 0, the function returns 32 since there are 32 trailing zeros in the binary representation of 0.
 * @returns {number} The count of trailing zeros in the binary representation of the input number.
 */
// prettier-ignore
function numberOfTrailingZeros(int) {
  if (int == 0) return 32; let y; let n = 31;
  y = int << 16; if (y != 0) { n = n - 16; int = y; }
  y = int << 8;  if (y != 0) { n = n - 8;  int = y; }
  y = int << 4;  if (y != 0) { n = n - 4;  int = y; }
  y = int << 2;  if (y != 0) { n = n - 2;  int = y; }
  return n - ((int << 1) >> 31);
}

const CHARACTER = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'];
const CHARACTER_MAP = new Map(CHARACTER.map((d, i) => [d, i]));
const MASK = CHARACTER.length - 1;
const SHIFT = numberOfTrailingZeros(CHARACTER.length);
const PADDING = '========';

/**
 * The base32 en/decoder.
 */
export default class Base32 {
  /**
   * Decode the base32 value into a byte array.
   * @param {string} code The encoded base32 string.
   * @returns {Uint8Array} The decoded bytes.
   * @throws {TypeError} If the input contains illegal characters.
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
   * Encode the byte array into a base32 string.
   * @param {Uint8Array} bytes The bytes to encode.
   * @param {boolean} [padOutput] Whether to pad the output with '=' characters.
   * @returns {string} The encoded base32 string.
   * @throws {RangeError} If the input is too long to encode as a base32 string.
   */
  static encode(bytes, padOutput = false) {
    if (!bytes?.length) return padOutput ? PADDING : '';
    if (bytes.length >= 1 << 28) throw new RangeError('Value is too long to encode as base32 string');

    const calculatedLength = Math.floor((bytes.length * 8 + SHIFT - 1) / SHIFT);
    let padding = 0;
    if (padOutput) {
      const remainder = calculatedLength % 8;
      if (remainder) padding = 8 - remainder;
    }
    const result = Buffer.alloc(calculatedLength + padding);

    let buffer = bytes[0];
    let nextByte = 1;
    let bitsLeft = 8;
    let offset = 0;
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
      result.write(CHARACTER[index], offset++);
    }
    if (padOutput && padding > 0) result.write(PADDING.slice(0, padding), offset);
    return result.toString('utf8');
  }
}
