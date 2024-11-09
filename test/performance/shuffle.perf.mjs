import shuffle from '../../utils/shuffle.mjs';
import range from '../../utils/range.mjs';

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
  let array;

  beforeEach(function() {
    array = [...range(0, 100)];
  });

  it(`Fisher–Yates shuffle algorithm (${performanceCalls} times)`, function () {
    for (let i = 0; i < performanceCalls; i++) shuffle(array);
  });

  it(`Sattolo shuffle algorithm (${performanceCalls} times)`, function () {
    for (let i = 0; i < performanceCalls; i++) sattoloShuffle(array);
  });
});
