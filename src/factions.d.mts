/**
 * The faction's helper to get a faction.
 */
export default class Factions {
    /**
     * The max known faction version.
     */
    static maxVersion: number;
    /**
     * Get the faction by code
     * @param {string} code The faction code
     * @returns {Faction} the faction or <undefined>
     */
    static fromCode(code: string): Faction;
    /**
     * Get the faction by id
     * @param {number} id The faction id
     * @returns {Faction} the faction or <undefined>
     */
    static fromId(id: number): Faction;
}
import Faction from './faction.mjs';
//# sourceMappingURL=factions.d.mts.map