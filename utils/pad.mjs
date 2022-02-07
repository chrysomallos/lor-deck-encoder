/**
 * Formats the value into a string with the minimum size and leading zeros if number digits are less than the size.
 *
 * @param {number} value The number to format
 * @param {number} size The minimum number of needed digits
 * @returns {string} The number as string with leading zero to fit the size
 */
export default function pad(value, size, strict = false) {
  const numbers = value.toString();
  if (strict && numbers.length > size) throw new TypeError(`Value has more digits than the size`);
  return numbers.length < size ? numbers.padStart(size, '0'): numbers;
}
