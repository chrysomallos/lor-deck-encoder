/**
 * This method shuffles the elements of an array in place using the Fisher–Yates shuffle algorithm.
 *
 * @param {unknown[]} array The array to shuffle
 * @returns {unknown[]} The shuffled array
 */
export default function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
