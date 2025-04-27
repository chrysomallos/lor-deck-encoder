import assert from 'node:assert';
import EventEmitter from 'events';
import quibble from 'quibble';

const expectedResponse = {success: true};

describe('[Utils] request', function () {
  let request, buffer, HttpError;
  let browser_process = false;

  beforeEach(async function () {
    buffer = Buffer.from(JSON.stringify(expectedResponse));
    await quibble.esm('node:https', {default: {request: () => Promise.reject(new Error('SSL'))}});
    await quibble.esm('node:http', {
      default: {
        request: (options, callback) => {
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
    const response = await request('http://api.local/sucess');
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

  it('should call fetch if ', async () => {
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

  afterEach(function () {
    quibble.reset();
  });
});
