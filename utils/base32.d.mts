/**
 * Calculates the number of trailing zeros in the binary representation of a given 32-bit integer.
 * This function determines the number of consecutive zero bits following the least significant one bit in the binary representation of the input number.
 * @param {number} int - The 32-bit integer to check. If the integer is 0, the function returns 32 since there are 32 trailing zeros in the binary representation of 0.
 * @returns {number} The count of trailing zeros in the binary representation of the input number.
 */
export function numberOfTrailingZeros(int: number): number;
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
    static decode(code: string): Uint8Array;
    /**
     * Encode the byte array into a base32 string.
     * @param {Uint8Array} bytes The bytes to encode.
     * @param {boolean} [padOutput] Whether to pad the output with '=' characters.
     * @returns {string} The encoded base32 string.
     * @throws {RangeError} If the input is too long to encode as a base32 string.
     */
    static encode(bytes: Uint8Array, padOutput?: boolean): string;
}
//# sourceMappingURL=base32.d.mts.map