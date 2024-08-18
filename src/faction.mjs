/**
 * Class representing a faction.
 */
export default class Faction {
  /**
   * The unique faction id.
   * @type {number}
   */
  id;

  /**
   * The version number of the faction.
   * @type {number}
   */
  version;

  /**
   * The alphanumeric sort number.
   * @type {number}
   */
  sort;

  /**
   * The 2 character faction code, f.e. 'DE'.
   * @type {string}
   */
  code;

  /**
   * The full name of the faction.
   */
  name;

  /**
   * Initialized a new instance of the faction.
   * @param {number} id faction id
   * @param {number} version version number
   * @param {string} code faction code
   * @param {string} name full name
   */
  constructor(id, version, code, name) {
    this.id = id;
    this.version = version;
    this.code = code;
    this.sort = ((code.charCodeAt(0) - 65) * 26) + (code.charCodeAt(1) - 65);
    this.name = name;
  }
}
