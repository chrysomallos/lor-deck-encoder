import http from 'node:http';
import https from 'node:https';
import {isBrowser} from './detectors.mjs';

const HTTP_PROTOCOLS_MATCH = /^https?:/;
const HTTPS_PROTOCOL = 'https:';

/**
 * Base class for HTTP errors.
 * Extends the built-in Error class to include an HTTP status code.
 */
export class HttpError extends Error {
  /**
   * Constructs a new HttpError instance.
   * @param {http.IncomingMessage} response The client request this error is for.
   */
  constructor(response) {
    const {statusCode, statusMessage, url, method} = response;
    super(url ? `HTTP ${method} ${statusCode}(${statusMessage}) error at ${url}` : `HTTP ${statusCode}(${statusMessage}) error`);
    this.status = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Makes an HTTP(S) request with the provided options and body.
 * @template T
 * @param {string|URL|http.RequestOptions|https.RequestOptions} options The options for the request.
 * @param {string|Buffer} body The body of the request.
 * @returns {Promise<T>} A promise that resolves with the response body if the request is successful, or rejects with an error if the request fails.
 */
export default async function request(options, body) {
  let protocol = HTTPS_PROTOCOL;
  if (options instanceof URL || typeof options === 'object') {
    protocol = options.protocol ?? HTTPS_PROTOCOL; // if not defined we use SSL
  } else {
    protocol = HTTP_PROTOCOLS_MATCH.exec(options)?.[0];
  }
  if (!protocol.match(HTTP_PROTOCOLS_MATCH)) throw Error(`Unsupported request protocol ${protocol}`);

  if (isBrowser()) {
    return fetch(url, {
      method: options.method ?? 'GET',
      body: body,
    }).then(data => data.json());
  }

  return new Promise(function (resolve, reject) {
    const request = (protocol === HTTPS_PROTOCOL ? https : http).request(options, response => {
      const {statusCode} = response;
      let chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        try {
          if (statusCode < 200 || statusCode >= 300) reject(new HttpError(response));
          else resolve(JSON.parse(Buffer.concat(chunks).toString()));
          if (!response.destroyed) response.destroy();
        } catch (error) {
          reject(error);
        }
      });
    });
    request.once('error', error => reject(error));
    if (body) request.write(body);
    request.end();
  });
}
