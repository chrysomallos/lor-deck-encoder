/**
 * Class representing an error when an invalid argument is provided.
 * @augments Error
 */
export class ArgumentError extends Error {
    /**
     * Create an ArgumentError.
     * @param {string} parameter  The name of the parameter that caused the error.
     * @param {string} message The error message.
     */
    constructor(parameter: string, message: string);
    /**
     * The name of the parameter that caused the error.
     * @type {string}
     */
    parameter: string;
}
//# sourceMappingURL=errors.d.mts.map