import assert from 'node:assert';
import range from '../../utils/range.mjs';

describe('[Utils] range', function () {
  describe('default parameters', function () {
    it('should yield values from 0 to 100 with step 1', function () {
      const values = [...range()];
      assert.equal(values.length, 100);
      assert.deepEqual(values, Array.from({length: 100}, (_, i) => i));
    });
  });

  describe('custom parameters', function () {
    it('should yield values with custom start and end', function () {
      const values = [...range(5, 10)];
      assert.deepEqual(values, [5, 6, 7, 8, 9]);
    });

    it('should yield values with custom step', function () {
      const values = [...range(0, 10, 2)];
      assert.deepEqual(values, [0, 2, 4, 6, 8]);
    });

    it('should yield values with all custom parameters', function () {
      const values = [...range(1, 11, 3)];
      assert.deepEqual(values, [1, 4, 7, 10]);
    });

    it('should work with large step', function () {
      const values = [...range(0, 100, 25)];
      assert.deepEqual(values, [0, 25, 50, 75]);
    });
  });

  describe('edge cases', function () {
    it('should yield nothing when start equals end', function () {
      const values = [...range(5, 5)];
      assert.deepEqual(values, []);
    });

    it('should yield nothing when start is greater than end', function () {
      const values = [...range(10, 5)];
      assert.deepEqual(values, []);
    });

    it('should handle single value range', function () {
      const values = [...range(42, 43)];
      assert.deepEqual(values, [42]);
    });

    it('should work with negative numbers', function () {
      const values = [...range(-5, 0)];
      assert.deepEqual(values, [-5, -4, -3, -2, -1]);
    });

    it('should work with negative range', function () {
      const values = [...range(-10, -5)];
      assert.deepEqual(values, [-10, -9, -8, -7, -6]);
    });

    it('should handle step 1 explicitly', function () {
      const values = [...range(0, 5, 1)];
      assert.deepEqual(values, [0, 1, 2, 3, 4]);
    });

    it('should yield zero values with step larger than range', function () {
      const values = [...range(0, 5, 10)];
      assert.deepEqual(values, [0]);
    });
  });

  describe('generator behavior', function () {
    it('should be a generator function', function () {
      const gen = range(0, 5);
      assert.equal(typeof gen[Symbol.iterator], 'function');
      assert.equal(typeof gen.next, 'function');
    });

    it('should support manual iteration', function () {
      const gen = range(0, 3);
      assert.deepEqual(gen.next(), {value: 0, done: false});
      assert.deepEqual(gen.next(), {value: 1, done: false});
      assert.deepEqual(gen.next(), {value: 2, done: false});
      assert.deepEqual(gen.next().done, true);
    });

    it('should work with for...of loop', function () {
      const values = [];
      for (const val of range(1, 4)) {
        values.push(val);
      }
      assert.deepEqual(values, [1, 2, 3]);
    });

    it('should work with spread operator', function () {
      const values = [...range(10, 15)];
      assert.deepEqual(values, [10, 11, 12, 13, 14]);
    });
  });
});
