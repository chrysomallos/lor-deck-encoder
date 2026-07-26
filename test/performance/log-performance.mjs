/**
 * Logs performance times for a given method description.
 * @param {string} name - The name of the algorithm.
 * @param {number} time - The total time taken in milliseconds.
 * @param {number} calls - The number of calls made.
 */
export default function logPerformanceTimes(name, time, calls) {
  console.log(`  - ${name}: ${(1000 / time * calls / 1000000).toFixed(2)} million calls/sec, ${time.toFixed(2)} ms, each call took ${(time / calls * 1000).toFixed(3)} µs`);
};