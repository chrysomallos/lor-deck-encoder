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
  constructor(parameter, message) {
    super(message ?? `The argument "${parameter}" is invalid`);
    this.name = this.constructor.name;
    this.parameter = parameter;
  }

  /**
   * The name of the parameter that caused the error.
   * @type {string}
   */
  parameter;
}
