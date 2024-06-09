import https from 'node:https';

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
      const {statusCode} = response;
      if (statusCode < 200 || statusCode >= 300) return reject(new Error(`HTTP Error with status ${statusCode}`));
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
