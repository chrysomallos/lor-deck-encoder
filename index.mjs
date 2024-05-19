export {default as Card} from './src/card.mjs';
export {default as Deck} from './src/deck.mjs';
export {default as Faction} from './src/faction.mjs';
export {default as Factions} from './src/factions.mjs';

import Deck from './src/deck.mjs';
export default function createDeck(code) {
  return Deck.fromCode(code);
}
