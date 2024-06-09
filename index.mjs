export {default as Card} from './src/card.mjs';
export {default as Deck} from './src/deck.mjs';
export {default as Faction} from './src/faction.mjs';
export {default as Factions} from './src/factions.mjs';

import DataDragon from './src/data-dragon.mjs';

/**
 * Creates a new instance of data dragon client.
 * @returns {DataDragon} instance of data dragon.
 */
export function generateDataDragon() {
  return new DataDragon();
}

import Deck from './src/deck.mjs';
/**
 * Initialize the deck.
 * @param {string} code The code to initialize the deck from.
 * @returns {Deck} The new instance of the deck.
 */
export default function createDeck(code) {
  return Deck.fromCode(code);
}
