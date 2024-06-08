import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import stringify from 'json-stringify-pretty-compact';
import hash from 'object-hash';

import request from '../utils/request.mjs';
import Deck from './deck.mjs';

/**
 * Base URL for data grabbing, see [Data Dragon](https://developer.riotgames.com/docs/lor#data-dragon).
 *
 * Legends of Runeterra Data Dragon (not to be confused with League of Legends Data Dragon) is the static data product that hosts both game assets and data for community use in media or product development.
 * Assets and data are made available over the internet and are updated in tandem with game releases so the community can update their products with the latest and greatest data.
 * @type {string}
 */
export const DATA_DRAGON_BASE_URL = 'https://dd.b.pvp.net/latest/';

/**
 * @typedef {object} Asset
 * @property {string} gameAbsolutePath URL to the game asset image.
 * @property {string} fullAbsolutePath URL to the full asset image.
 */
/**
 * @typedef {object} DataDragonRegion
 * @property {string} abbreviation The abbreviation of the region.
 * @property {string} iconAbsolutePath URL to the region's icon image.
 * @property {string} name The name of the region.
 * @property {string} nameRef Reference name of the region.
 */
/**
 * @typedef {object} DataDragonCard
 * @property {DataDragonCard[]} associatedCards List of associated card codes.
 * @property {string[]} associatedCardRefs References to associated cards.
 * @property {Asset[]} assets List of asset objects.
 * @property {string} region The region of the card.
 * @property {string} regionRef Reference to the region.
 * @property {number} attack The attack value of the card.
 * @property {number} cost The cost to play the card.
 * @property {number} health The health value of the card.
 * @property {string} description The card's description.
 * @property {string} descriptionRaw The raw card description text.
 * @property {string} levelupDescription The level-up description.
 * @property {string} levelupDescriptionRaw The raw level-up description text.
 * @property {string} flavorText The flavor text of the card.
 * @property {string} artistName The name of the artist who illustrated the card.
 * @property {string} name The name of the card.
 * @property {string} cardCode The unique code of the card.
 * @property {string[]} keywords Keywords associated with the card.
 * @property {string[]} keywordRefs References to keywords associated with the card.
 * @property {string} spellSpeed The spell speed of the card (if applicable).
 * @property {string} spellSpeedRef Reference to the spell speed (if applicable).
 * @property {string} rarity The rarity of the card.
 * @property {string} rarityRef Reference to the rarity.
 * @property {string} subtype The subtype of the card (if applicable).
 * @property {string} supertype The supertype of the card (if applicable).
 * @property {string} type The type of the card (e.g., Unit, Spell).
 * @property {boolean} collectible Whether the card is collectible.
 */

/**
 * @typedef {object} FetchedData
 * @property {Deck} deck The instance of the deck.
 * @property {Record<string, {code: string, count: number}[]>} cardTypes The cards by rarity reference.
 * @property {Record<string, DataDragonCard | undefined>} matchedCards The matching cards by code.
 * @property {Record<string, DataDragonRegion|undefined>} matchedRegions The matching regions by faction code.
 */

/**
 * The data dragon interface client.
 */
export default class DataDragon {
  lastError;

  /**
   * Initializes the DataDragon instance by fetching core data and card data for the specified language.
   * @param {string} language The language code (e.g. 'en_US') to fetch data for.
   * @returns {Promise<void>}
   */
  async initialize(language) {
    if (this.cardsByCode) return;
    const tempFile = path.join(os.tmpdir(), `lor-data-dragon-temp-data-${language}.json`);

    if (fs.existsSync(tempFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(tempFile));
        if (data.header.core === hash(data.core) && data.header.cards === hash(data.cards) && Date.now() - 3 * 3600 * 1000 < data.header.date) {
          this.core = data.core;
          this.cards = data.cards;
        }
      } catch (err) {
        this.lastError = err;
      }
    }
    if (!this.cards) {
      this.core = await request(new URL(`core/${language.toLocaleLowerCase()}/data/globals-${language.toLocaleLowerCase()}.json`, DATA_DRAGON_BASE_URL));
      const setNames = this.core.sets.map(({nameRef}) => nameRef.toLowerCase());
      this.cards = (
        await Promise.allSettled(
          setNames.map(name =>
            request(new URL(`${name}/${language.toLocaleLowerCase()}/data/${name}-${language.toLocaleLowerCase()}.json`, DATA_DRAGON_BASE_URL))
          )
        )
      )
        .flatMap(({value = []}) => value)
        .sort(({cardCode: a}, {cardCode: b}) => a.localeCompare(b));
      try {
        fs.writeFileSync(
          tempFile,
          stringify(
            {header: {date: Date.now(), core: hash(this.core), cards: hash(this.cards)}, core: this.core, cards: this.cards},
            {indent: 1, maxLength: 300}
          )
        );
      } catch (err) {
        this.lastError = err;
      }
    }
    this.cardsByCode = new Map(this.cards.map(card => [card.cardCode, card]));
  }

  /**
   * Fetches data for a given deck code, initializing the DataDragon instance if necessary.
   * @param {string} code The deck code to fetch data for.
   * @param {string} [language] The language code (e.g. 'en_us') to fetch data for.
   * @returns {Promise<FetchedData>} The fetched data, including the deck and matching cards.
   */
  async fetchData(code, language = 'en_US') {
    await this.initialize(language);
    const deck = Deck.fromCode(code);
    return {
      deck,
      cardTypes: deck.cards.reduce((types, card) => {
        const {rarityRef} = this.cardsByCode.get(card.code);
        types[rarityRef] ??= [];
        types[rarityRef].push(card.codeAndCount);
        return types;
      }, {}),
      matchedCards: Object.fromEntries(
        deck.cards.map(({code: deckCode}) => {
          const matched = this.cardsByCode.get(deckCode);
          return [deckCode, {...matched, associatedCards: matched.associatedCardRefs?.map(cardCode => this.cardsByCode.get(cardCode))}];
        })
      ),
      matchedRegions: Object.fromEntries(
        [...new Set(deck.cards.map(({faction}) => faction.code)).values()].map(code => [
          code,
          this.core.regions.find(({abbreviation}) => abbreviation === code),
        ])
      ),
    };
  }

  /**
   * Generates an HTML page representing the deck content for a given deck code.
   * @param {string} code The deck code to generate the page for.
   * @param {string} [language] The language code (e.g. 'en_us') to generate for.
   * @returns {Promise<string>} The generated HTML content.
   */
  async generatePageFromCode(code, language = 'en_US') {
    const {deck, cardTypes, matchedCards, matchedRegions} = await this.fetchData(code, language);
    return `<html>
<head>
<title>${code}</title>
<style>
body {
  background-color: #282828;
  color: #8A8A8A;
  font-family: monospace;
}
#cards {
  display:flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: left;
}
#cards > div {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}
</style>
</head>
<body>
<h1>Deck content<h1>
<h2>Code</h2>
<span>${deck.code}</span>
<h2>Summary</h2>
<h3>Types</h3>
${Object.entries(cardTypes)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([type, cardCodes]) => `<span>${type}: ${cardCodes.reduce((last, {count}) => last + count, 0)}</span>`)
  .join('\n')}
<h3>Regions</h3>
${Object.entries(matchedRegions)
  .map(([id, region]) => `<div><img src="${region.iconAbsolutePath}" width="30"/><span>${id}: ${region.name}</span></div>`)
  .join('\n')}
<h2>Cards</h2>
<div id="cards">
${Object.values(matchedCards)
  .map(ddCard => {
    const card = deck.cards.find(({code}) => code === ddCard.cardCode);
    const [firstAssets] = ddCard.assets;
    return `<div id="card" with="150px"><span>[${card.code}](${card.count})</span><img src="${firstAssets.gameAbsolutePath}" width="100" /><span>${ddCard.name}</span></div>`;
  })
  .join('\n')}
</div>
</body>
</html>`;
  }
}
