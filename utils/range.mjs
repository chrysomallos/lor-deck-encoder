/**
 * Generates an iterator to loop from start to end by step.
 *
 * @param {number} [start=0] The start of iterator
 * @param {number} [end=100] The end of the iterator
 * @param {number} [step=1] The step to jump to next value
 * @returns
 */
export default function* range(start = 0, end = 100, step = 1) {
  let iterationCount = 0;
  for (let i = start; i < end; i += step) {
    iterationCount++;
    yield i;
  }
  return iterationCount;
}
