// eslint-disable-next-line jsdoc/require-returns
/**
 * Generates an iterator to loop from start to end by step.
 * @param {number} [start] The start of iterator.
 * @param {number} [end] The end of the iterator.
 * @param {number} [step] The step to jump to next value.
 * @yields {number} The next value in the range sequence.
 */
export default function* range(start = 0, end = 100, step = 1) {
  let iterationCount = 0;
  for (let i = start; i < end; i += step) {
    iterationCount++;
    yield i;
  }
  return iterationCount;
}
