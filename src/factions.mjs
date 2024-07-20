import Faction from './faction.mjs';

/**
 * The list of the Legends of Runeterra factions, add here if new available.
 * List can be found on [RiotGames/LoRDeckCodes](https://github.com/RiotGames/LoRDeckCodes?tab=readme-ov-file#faction-identifiers)
 */
// prettier-ignore
const AVAILABLE_FACTIONS = [
  new Faction( 0, 1, 'DE', 'Demacia'),
  new Faction( 1, 1, 'FR', 'Freljord'),
  new Faction( 2, 1, 'IO', 'Ionia'),
  new Faction( 3, 1, 'NX', 'Noxus'),
  new Faction( 4, 1, 'PZ', 'Piltover & Zaun'),
  new Faction( 5, 1, 'SI', 'Shadow Isles'),
  new Faction( 6, 2, 'BW', 'Bilgewater'),
  new Faction( 9, 2, 'MT', 'Mount Targon'),
  new Faction( 7, 3, 'SH', 'Shurima'),
  new Faction(10, 4, 'BC', 'Bandle City'),
  new Faction(12, 5, 'RU', 'Runeterra'),
];

/**
 * The max known version, based on the available factions.
 */
const MAX_KNOWN_VERSION = AVAILABLE_FACTIONS.reduce((last, {version}) => Math.max(last, version), 0);

const FACTION_BY_ID = new Map(AVAILABLE_FACTIONS.map(faction => [faction.id, faction]));

const FACTION_BY_CODE = new Map(AVAILABLE_FACTIONS.map(faction => [faction.code, faction]));

/**
 * The faction's helper to get a faction.
 */
export default class Factions {
  /**
   * The max known faction version.
   */
  static maxVersion = MAX_KNOWN_VERSION;

  /**
   * Get the faction by code
   * @param {string} code The faction code
   * @returns {Faction} the faction or <undefined>
   */
  static fromCode(code) {
    return FACTION_BY_CODE.get(code);
  }

  /**
   * Get the faction by id
   * @param {number} id The faction id
   * @returns {Faction} the faction or <undefined>
   */
  static fromId(id) {
    return FACTION_BY_ID.get(id);
  }
}
