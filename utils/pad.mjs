/**
 * Formats the value into a string with the minimum size and leading zeros if number digits are less than the size.
 * @param {number} value The number to format into string with leading zeros.
 * @param {number} size The target number of characters filled with leading zeros.
 * @param {boolean} [strict] Forces to be strict and validate the number should not be larger then the size, defaults to false.
 * @returns {string} The number as string with leading zero to fit the target size.
 */
export default function pad(value, size, strict = false) {
  const numbers = value.toString();
  if (strict && numbers.length > size) throw new TypeError(`Value has more digits than the size`);
  return numbers.length < size ? numbers.padStart(size, '0'): numbers;
}
