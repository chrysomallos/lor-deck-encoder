/**
 * Class representing a faction.
 */
export default class Faction {
    /**
     * Initialized a new instance of the faction.
     * @param {number} id faction id
     * @param {number} version version number
     * @param {string} code faction code
     * @param {string} name full name
     */
    constructor(id: number, version: number, code: string, name: string);
    /**
     * The unique faction id.
     * @type {number}
     */
    id: number;
    /**
     * The version number of the faction.
     * @type {number}
     */
    version: number;
    /**
     * The alphanumeric sort number.
     * @type {number}
     */
    sort: number;
    /**
     * The 2 character faction code, f.e. 'DE'.
     * @type {string}
     */
    code: string;
    /**
     * The full name of the faction.
     */
    name: string;
}
//# sourceMappingURL=faction.d.mts.map