import assert from 'node:assert';
import { HttpError } from '../../utils/request.mjs';

describe('[HttpError] tests', function () {
  it('should accept empty at constructor', function () {
    assert.match(new HttpError({}).message, /^HTTP/);
  });

  it('should accept empty url at constructor', function () {
    assert.equal(new HttpError({statusCode: 500, statusMessage: 'Error', method: 'HEAD'}).message, 'HTTP 500(Error) error');
  });

  it('should accept valid parts at constructor', function () {
    const url = 'http://dummy.local/not-existing';
    const {message} = new HttpError({statusCode: 404, statusMessage: 'Not Found', url: 'http://dummy.local/not-existing', method: 'GET'});
    assert.match(message, /^HTTP GET 404/);
    assert.equal(message.endsWith(url), true);
  });
});
