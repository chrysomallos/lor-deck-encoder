import assert from 'node:assert';
import {ArgumentError} from '../../src/errors.mjs';

describe('[Errors] class tests', function () {
  describe('ArgumentError class', function () {
    it('should have the correct name property', function () {
      const error = new ArgumentError('Invalid argument');
      assert.equal(error.name, 'ArgumentError');
    });

    it('should be an instance of Error', function () {
      const error = new ArgumentError('Invalid argument');
      assert(error instanceof Error);
    });

    it('should create an instance of ArgumentError', function () {
      const error = new ArgumentError('parameter');
      assert(error instanceof ArgumentError);
      assert.equal(error.message, 'The argument "parameter" is invalid');
    });

    it('should use message parameter if provided', function () {
      const message = 'Custom error message';
      const error = new ArgumentError('parameter', message);
      assert.equal(error.message, message);
    });
  });
});
