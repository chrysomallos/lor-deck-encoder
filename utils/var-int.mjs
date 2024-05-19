//THIS CODE ADAPTED FROM
/*
VarintBitConverter: https://github.com/topas/VarintBitConverter 
Copyright (c) 2011 Tomas Pastorek, Ixone.cz. All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above
    copyright notice, this list of conditions and the following
    disclaimer in the documentation and/or other materials provided
    with the distribution.
THIS SOFTWARE IS PROVIDED BY TOMAS PASTOREK AND CONTRIBUTORS ``AS IS'' 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR 
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL TOMAS PASTOREK OR CONTRIBUTORS 
BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF 
THE POSSIBILITY OF SUCH DAMAGE. 
*/

const ALL_BUT_MSB = 0x7f;
const JUST_MSB = 0x80;

/**
 * Variant integer bit converter, adapted from https://github.com/topas/VarintBitConverter
 */
export default class VarInt {
  /**
   * Decodes a variable-length encoded integer from the beginning of a byte array,
   * and removes the bytes representing the integer from the array.
   *
   * The decoding scheme works by reading 7 bits of the integer from each byte,
   * with the most significant bit (MSB) of each byte indicating whether there are more bytes.
   * @param {Uint8Array} bytes The byte array to decode the integer from.
   * @returns {number} The integer decoded from the byte array.
   * @throws {TypeError} If the byte array does not contain valid variable-length encoded integers.
   */
  static pop(bytes) {
    let result = 0;
    let shift = 0;
    let popped = 0;
    for (let i = 0; i < bytes.length; i++) {
      popped++;
      const current = bytes[i] & ALL_BUT_MSB;
      result |= current << shift;

      if ((bytes[i] & JUST_MSB) !== JUST_MSB) {
        bytes.splice(0, popped);
        return result;
      }

      shift += 7;
    }

    throw new TypeError('Byte array did not contain valid variant integers');
  }

  /**
   * Encodes a given non-negative integer into a variable-length byte array using a custom encoding scheme.
   *
   * The encoding scheme works by storing 7 bits of the integer in each byte,
   * with the most significant bit (MSB) of each byte indicating whether there are more bytes.
   *
   * Example:
   * - If `value` is 0, the function returns [0].
   * - If `value` is 300, the function returns [172, 2].
   * @param {number} value The integer to convert into byte array.
   * @returns {Uint8Array} The byte array for this integer.
   */
  static get(value) {
    if (value === 0) return [0];

    const buff = new Array(10);
    let currentIndex = 0;
    while (value) {
      let byteVal = value & ALL_BUT_MSB;
      value >>>= 7;
      if (value) byteVal |= JUST_MSB;
      buff[currentIndex++] = byteVal;
    }

    return buff.slice(0, currentIndex);
  }
}
