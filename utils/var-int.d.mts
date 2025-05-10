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
    static pop(bytes: Uint8Array): number;
    /**
     * Decodes an array of bytes into an array of integers, using a variable-length encoding scheme.
     * The method processes each byte in the input array, combining them into integers until the most significant bit (MSB)
     * indicates the end of an integer. It then stores the decoded integers in an output array.
     * @param {Uint8Array | number[]} bytes The input array of bytes to be decoded. It can be a Uint8Array or an array of numbers.
     * @returns {number[]} An array of decoded integers.
     * @throws {TypeError} Throws a TypeError if the byte array ends with an incomplete sequence (e.g., the MSB of the last byte is set).
     */
    static decode(bytes: Uint8Array | number[]): number[];
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
    static get(value: number): Uint8Array;
}
//# sourceMappingURL=var-int.d.mts.map