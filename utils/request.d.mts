/**
 * Makes an HTTP(S) request with the provided options and body.
 * @template T
 * @param {string|URL|http.RequestOptions|https.RequestOptions} options The options for the request.
 * @param {string|Buffer} body The body of the request.
 * @returns {Promise<T>} A promise that resolves with the response body if the request is successful, or rejects with an error if the request fails.
 */
export default function request<T>(options: string | URL | http.RequestOptions | https.RequestOptions, body: string | Buffer): Promise<T>;
/**
 * Base class for HTTP errors.
 * Extends the built-in Error class to include an HTTP status code.
 */
export class HttpError extends Error {
    /**
     * Constructs a new HttpError instance.
     * @param {http.IncomingMessage} response The client request this error is for.
     */
    constructor(response: http.IncomingMessage);
    status: http.IncomingMessage;
}
//# sourceMappingURL=request.d.mts.map