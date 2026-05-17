import {performance} from 'node:perf_hooks';
import range from '../../utils/range.mjs';
import shuffle from '../../utils/shuffle.mjs';

/**
 * Shuffles an array in place using Sattolo's algorithm (a cyclic version of Fisher-Yates).
 *
 * @template T
 * @param {T[]} array - The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
function sattoloShuffle(array) {
  for (let i = array.length; i > 1; i--) {
    const j = Math.floor(Math.random() * (i - 1)); // Ensure j != i-1
    [array[i - 1], array[j]] = [array[j], array[i - 1]];
  }
  return array;
}

describe('[Base32] performance test', function () {
  const performanceCalls = 100000;
  const performanceTimes = {};
  let array;

  beforeEach(function () {
    array = [...range(0, 100)];
  });

  it(`Fisher–Yates shuffle algorithm (${performanceCalls} times)`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) shuffle(array);
    performanceTimes.fisherYates = performance.now() - start;
  });

  it(`Sattolo shuffle algorithm (${performanceCalls} times)`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) sattoloShuffle(array);
    performanceTimes.sattolo = performance.now() - start;
  });

  after(function () {
    console.log(`Performance times, fast algorithm is ${performanceTimes.fisherYates < performanceTimes.sattolo ? 'Fisher–Yates' : 'Sattolo'}:`);
    console.log(`Fisher–Yates: ${performanceTimes.fisherYates} ms, each call took ${performanceTimes.fisherYates / performanceCalls} ms`);
    console.log(`Sattolo: ${performanceTimes.sattolo} ms, each call took ${performanceTimes.sattolo / performanceCalls} ms`);
  });
});
