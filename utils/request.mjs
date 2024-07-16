import https from 'node:https';

/**
 * Base class for HTTP errors.
 * Extends the built-in Error class to include an HTTP status code.
 */
export class HttpError extends Error {
  /**
   * Constructs a new HttpError instance.
   * @param {number} status The HTTP status code.
   * @param {string} message The error message.
   */
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Makes an HTTP request with the provided options and body.
 * @template T
 * @param {string|URL|https.RequestOptions} options The options for the HTTP request.
 * @param {string|Buffer} body The body of the HTTP request.
 * @returns {Promise<T>} A promise that resolves with the response body if the request is successful, or rejects with an error if the request fails.
 */
export default async function request(options, body) {
  return new Promise(function (resolve, reject) {
    const request = https.request(options, response => {
      const {statusCode, statusMessage} = response;
      if (statusCode < 200 || statusCode >= 300) {
        return reject(new HttpError(statusCode, statusMessage));
      }
      let chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on('error', error => reject(error));
    if (body) request.write(body);
    request.end();
  });
}
