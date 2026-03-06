import EventEmitter from 'events';
import assert from 'node:assert';
import quibble from 'quibble';

const expectedResponse = {success: true, ssl: false};

describe('[Utils] request', function () {
  let request, HttpError;

  beforeEach(async function () {
    const mock = (ssl = false) => ({
      default: {
        request: (options, callback) => {
          expectedResponse.ssl = ssl;
          const buffer = Buffer.from(JSON.stringify(expectedResponse));
          if (typeof options === 'string') options = new URL(options);
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
            once: function () {},
            off: function () {},
            write: function () {},
            end: () => {
              if (response.statusCode === 200) {
                response.emit('data', options.path === '/invalid' ? Buffer.from('invalid') : buffer);
              }
              response.emit('end');
            },
          };
        },
      },
    });
    await quibble.esm('node:https', mock(true));
    await quibble.esm('node:http', mock(false));
    ({default: request, HttpError} = await import('../../utils/request.mjs'));
  });

  it('should make a successful HTTP GET request', async function () {
    const options = {
      protocol: 'http:',
      hostname: 'api.local',
      path: '/success',
      method: 'GET',
    };

    const response = await request(options);
    assert.deepEqual(response, expectedResponse);
  });

  it('should make a successful HTTP GET request with URL as string', async function () {
    const response = await request('http://api.local/success');
    assert.deepEqual(response, expectedResponse);
  });

  it('should make a successful HTTP POST request', async function () {
    const options = {
      protocol: 'http:',
      hostname: 'api.local',
      path: '/post',
      method: 'POST',
    };

    const response = await request(options, '{"data":"TEST"}');
    assert.deepEqual(response, expectedResponse);
  });

  it('should reject the promise on HTTP error status code', async function () {
    const options = {
      protocol: 'http:',
      hostname: 'api.local',
      path: '/failed',
      method: 'GET',
    };

    await assert.rejects(request(options), HttpError);
  });

  it('should reject the promise on HTTP error for invalid json response', async function () {
    const options = {
      protocol: 'http:',
      hostname: 'api.local',
      path: '/invalid',
      method: 'GET',
    };

    await assert.rejects(request(options), SyntaxError);
  });

  it('should call fetch if running in browser', async function () {
    global.window = {document: {}};
    const backup = global.fetch;
    try {
      const resultData = {data: 1};
      global.fetch = () => Promise.resolve({json: () => resultData});
      const result = await request('http://test.local/fetch');
      assert.equal(result, resultData);
    } finally {
      global.fetch = backup;
      delete global.window;
    }
  });

  it('should use HTTPS protocol if not specified', async function () {
    const options = {
      hostname: 'api.local',
      path: '/success',
      method: 'GET',
    };

    const response = await request(options);
    assert.equal(response.ssl, true);
  });

  it('should throw error for unsupported protocol', async function () {
    await assert.rejects(request('ftp://api.local/success'), Error, 'Unsupported request protocol ftp:');
  });

  afterEach(function () {
    quibble.reset();
  });
});
