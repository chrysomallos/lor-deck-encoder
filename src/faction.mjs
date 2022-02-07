/**
 * Faction class
 */
export default class Faction {
  /**
   * The card deck faction id
   * @type {number}
   */
  id;
  /**
   * The card deck version number of the faction
   * @type {number}
   */
  version;
  /**
   * The 2 character faction code, f.e. 'DE'
   * @type {string}
   */
  code;
  /**
   * The full name of the faction
   */
  name;

  /**
   * Initialized a new instance of the faction
   * @param {number} id faction id
   * @param {number} version version number
   * @param {string} code faction code
   * @param {string} name full name
   */
  constructor(id, version, code, name) {
    this.id = id;
    this.version = version;
    this.code = code;
    this.name = name;
  }
}
