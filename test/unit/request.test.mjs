import assert from 'assert';
import EventEmitter from 'events';
import quibble from 'quibble';

const expectedResponse = {success: true};

describe('[Utils] request', function () {
  let request, buffer, HttpError;

  beforeEach(async function () {
    buffer = Buffer.from(JSON.stringify(expectedResponse));
    await quibble.esm('node:https', {
      default: {
        request: (options, callback) => {
          const response = new EventEmitter();
          response.statusCode = options.path === '/failed' ? 404 : 200;
          response.headers = {
            'content-type': 'text/json',
            'content-length': `${response.statusCode === 200 ? buffer.length : 0}`,
            connection: 'close',
          };
          callback(response);
          return {
            on: function () {},
            write: function () {},
            end: () => {
              if (response.statusCode === 200) {
                response.emit('data', options.path === '/invalid' ? Buffer.from('invalid') : buffer);
                response.emit('end');
              }
            },
          };
        },
      },
    });
    ({default: request, HttpError} = await import('../../utils/request.mjs'));
  });

  it('should make a successful HTTP GET request', async function () {
    const options = {
      hostname: 'api.local',
      path: '/success',
      method: 'GET',
    };

    const response = await request(options);
    assert.deepEqual(response, expectedResponse);
  });

  it('should make a successful HTTP POST request', async function () {
    const options = {
      hostname: 'api.local',
      path: '/post',
      method: 'POST',
    };

    const response = await request(options, '{"data":"TEST"}');
    assert.deepEqual(response, expectedResponse);
  });

  it('should reject the promise on HTTP error status code', async function () {
    const options = {
      hostname: 'api.local',
      path: '/failed',
      method: 'GET',
    };

    await assert.rejects(request(options), HttpError);
  });

  it('should reject the promise on HTTP error for invalid json response', async function () {
    const options = {
      hostname: 'api.local',
      path: '/invalid',
      method: 'GET',
    };

    await assert.rejects(request(options), SyntaxError);
  });

  afterEach(function () {
    quibble.reset();
  });
});
