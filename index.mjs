export {default as Card} from './src/card.mjs';
export {default as Deck} from './src/deck.mjs';
export {default as Faction} from './src/faction.mjs';
export {default as Factions} from './src/factions.mjs';

export {default as DataDragon} from './src/data-dragon.mjs';
export {default as request} from './utils/request.mjs';

import Deck from './src/deck.mjs';
/**
 * Initialize the deck.
 * @param {string} code The code to initialize the deck from.
 * @returns {Deck} The new instance of the deck.
 */
export default function decodeDeckFromCode(code) {
  return Deck.fromCode(code);
}
