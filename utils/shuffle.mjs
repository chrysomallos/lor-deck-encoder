/**
 * Shuffles the elements of an array in place using the Fisher–Yates shuffle algorithm.
 * This algorithm ensures that each permutation of the array is equally likely.
 * @template T
 * @param {T[]} array - The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
export default function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
