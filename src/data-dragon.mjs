import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import stringify from 'json-stringify-pretty-compact';
import hash from 'object-hash';

import request from '../utils/request.mjs';
import {isBrowser, isNode} from '../utils/detectors.mjs';
import Deck from './deck.mjs';

/**
 * The supported languages found on the data dragon page.
 */
export const LANGUAGES = {
  de_de: 'German (Germany)',
  en_us: 'English (United States)',
  es_es: 'Spanish (Spain)',
  es_mx: 'Spanish (Mexico)',
  fr_fr: 'French (France)',
  it_it: 'Italian (Italy)',
  ja_jp: 'Japanese (Japan)',
  ko_kr: 'Korean (Korea)',
  pl_pl: 'Polish (Poland)',
  pt_br: 'Portuguese (Brazil)',
  th_th: 'Thai (Thailand)',
  tr_tr: 'Turkish (Turkey)',
  ru_ru: 'Russian (Russia)',
  zh_tw: 'Chinese (Taiwan)',
};

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
 * @property {Record<string, ?DataDragonCard>} matchedCards The matching cards by code.
 * @property {Record<string, ?DataDragonRegion>} matchedRegions The matching regions by faction code.
 */

const MAX_TEMP_HEADER_AGE = 12 * 3600 * 1000; // 12 Hours

/**
 * The data dragon interface client.
 */
export default class DataDragon {
  /**
   * @type {Error}
   */
  lastError;

  /**
   * @type {Map<string, {cards: Map<string, DataDragonCard>, regions: Map<string, DataDragonRegion>}>}
   */
  cacheByLanguage;

  /**
   * @type {Map<string, DataDragonCard>}
   */
  cardsByCode;

  /**
   * @type {Map<string, DataDragonRegion>}
   */
  regionsByCode;

  /**
   * Initialize the class with defined Data Dragon base URL.
   * 
   * @param {string} [baseUrl] will be able to override for own server or development. Need to follow bucket folder structure.
   */
  constructor(baseUrl = DATA_DRAGON_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Initializes the DataDragon instance by fetching core data and card data for the specified language.
   * @param {string} language The language code (e.g. 'en_us') to fetch data for.
   * @returns {Promise<void>}
   */
  async initialize(language) {
    if (!this.cacheByLanguage) {
      this.cacheByLanguage = new Map();
    }
    if (this.cacheByLanguage.has(language)) {
      ({cards: this.cardsByCode, regions: this.regionsByCode} = this.cacheByLanguage.get(language));
      return;
    }
    const runningAtBrowser = isBrowser();
    const runningAtNode = isNode();

    if (!runningAtBrowser && !runningAtNode) throw new Error('This class must be run in browser or node.');

    if (!LANGUAGES[language]) {
      language = Object.keys(LANGUAGES).find(key => key === language || key.split('_').includes(language));
      if (!language) language = 'en_us';
    }

    let core, cards;

    if (runningAtNode) {
      const tempFile = path.join(os.tmpdir(), `lor-data-dragon-temp-data-${language}.json`);

      if (fs.existsSync(tempFile)) {
        try {
          const data = JSON.parse(fs.readFileSync(tempFile));
          if (data.header.core === hash(data.core) && data.header.cards === hash(data.cards) && Date.now() - MAX_TEMP_HEADER_AGE < data.header.date) {
            core = data.core;
            cards = data.cards;
          }
        } catch (err) {
          this.lastError = err;
        }
      }
    }
    if (!cards || !core) {
      core = await request(new URL(`core/${language.toLocaleLowerCase()}/data/globals-${language.toLocaleLowerCase()}.json`, this.baseUrl));
      const setSourceUrls = core.sets
        .map(({nameRef}) => nameRef.toLowerCase())
        .map(name => new URL(`${name}/${language.toLocaleLowerCase()}/data/${name}-${language.toLocaleLowerCase()}.json`, this.baseUrl));

      const {fulfilled: validSources, rejected: requestErrors} = Object.groupBy(
        await Promise.allSettled(setSourceUrls.map(url => request(url))),
        ({status}) => status
      );
      if (requestErrors?.length) {
        this.lastError = new AggregateError(requestErrors.map(({reason}) => reason));
      }
      if (!validSources?.length) {
        throw Error('No valid data found.');
      }

      cards = validSources.flatMap(({value = []}) => value).sort(({cardCode: a}, {cardCode: b}) => a.localeCompare(b));

      if (runningAtNode) {
        try {
          fs.writeFileSync(tempFile, stringify({header: {date: Date.now(), core: hash(core), cards: hash(cards)}, core, cards}, {indent: 1, maxLength: 300}));
        } catch (err) {
          this.lastError = err;
        }
      }
    }
    this.cardsByCode = new Map(cards.map(card => [card.cardCode, card]));
    this.regionsByCode = new Map(core.regions.map(region => [region.abbreviation, region]));
    this.cacheByLanguage.set(language, {cards: this.cardsByCode, regions: this.regionsByCode});
  }

  /**
   * Fetches data for a given deck code, initializing the DataDragon instance if necessary.
   * @param {string} code The deck code to fetch data for.
   * @param {string} [language] The language code (e.g. 'en_us') to fetch data for.
   * @returns {Promise<FetchedData>} The fetched data, including the deck and matching cards.
   */
  async fetchData(code, language) {
    await this.initialize(language);
    const deck = Deck.fromCode(code);
    return {
      deck,
      cardTypes: Object.groupBy(deck.cards, ({code}) => this.cardsByCode.get(code)?.rarityRef ?? 'unknown'),
      matchedCards: Object.fromEntries(
        deck.cards.map(({code: deckCode}) => {
          const matched = this.cardsByCode.get(deckCode);
          if (!matched) return [deckCode, undefined];
          return [deckCode, {...matched, associatedCards: matched.associatedCardRefs?.map(cardCode => this.cardsByCode.get(cardCode))}];
        })
      ),
      matchedRegions: Object.fromEntries([...new Set(deck.cards.map(({faction}) => faction.code)).values()].map(code => [code, this.regionsByCode.get(code)])),
    };
  }

  /**
   * Generates an HTML page representing the deck content for a given deck code.
   * @param {string} code The deck code to generate the page for.
   * @param {string} [language] The language code (e.g. 'en_us') to generate for.
   * @returns {Promise<string>} The generated HTML content.
   */
  async generatePageFromCode(code, language) {
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
${Object.entries(matchedCards)
  .map(([cardCode, ddCard]) => {
    const card = deck.cards.find(({code}) => code === (ddCard?.cardCode ?? cardCode));
    const [firstAssets] = ddCard?.assets ?? [];
    return `<div id="card" with="150px"><span>[${card.code}](${card.count})</span><img src="${firstAssets?.gameAbsolutePath}" width="100" /><span>${
      ddCard?.name ?? 'unknown'
    }</span></div>`;
  })
  .join('\n')}
</div>
</body>
</html>`;
  }
}
