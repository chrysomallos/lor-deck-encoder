export namespace LANGUAGES {
    let de_de: string;
    let en_us: string;
    let es_es: string;
    let es_mx: string;
    let fr_fr: string;
    let it_it: string;
    let ja_jp: string;
    let ko_kr: string;
    let pl_pl: string;
    let pt_br: string;
    let th_th: string;
    let tr_tr: string;
    let ru_ru: string;
    let zh_tw: string;
}
/**
 * Base URL for data grabbing, see [Data Dragon](https://developer.riotgames.com/docs/lor#data-dragon).
 *
 * Legends of Runeterra Data Dragon (not to be confused with League of Legends Data Dragon) is the static data product that hosts both game assets and data for community use in media or product development.
 * Assets and data are made available over the internet and are updated in tandem with game releases so the community can update their products with the latest and greatest data.
 * @type {string}
 */
export const DATA_DRAGON_BASE_URL: string;
/**
 * The data dragon interface client.
 */
export default class DataDragon {
    /**
     * Initialize the class with defined Data Dragon base URL.
     *
     * @param {string} [baseUrl] will be able to override for own server or development. Need to follow bucket folder structure.
     */
    constructor(baseUrl?: string);
    /**
     * @type {Error}
     */
    lastError: Error;
    /**
     * @type {Map<string, {cards: Map<string, DataDragonCard>, regions: Map<string, DataDragonRegion>}>}
     */
    cacheByLanguage: Map<string, {
        cards: Map<string, DataDragonCard>;
        regions: Map<string, DataDragonRegion>;
    }>;
    /**
     * @type {Map<string, DataDragonCard>}
     */
    cardsByCode: Map<string, DataDragonCard>;
    /**
     * @type {Map<string, DataDragonRegion>}
     */
    regionsByCode: Map<string, DataDragonRegion>;
    baseUrl: string;
    /**
     * Initializes the DataDragon instance by fetching core data and card data for the specified language.
     * @param {string} language The language code (e.g. 'en_us') to fetch data for.
     * @returns {Promise<void>}
     */
    initialize(language: string): Promise<void>;
    /**
     * Fetches data for a given deck code, initializing the DataDragon instance if necessary.
     * @param {string} code The deck code to fetch data for.
     * @param {string} [language] The language code (e.g. 'en_us') to fetch data for.
     * @returns {Promise<FetchedData>} The fetched data, including the deck and matching cards.
     */
    fetchData(code: string, language?: string): Promise<FetchedData>;
    /**
     * Generates an HTML page representing the deck content for a given deck code.
     * @param {string} code The deck code to generate the page for.
     * @param {string} [language] The language code (e.g. 'en_us') to generate for.
     * @returns {Promise<string>} The generated HTML content.
     */
    generatePageFromCode(code: string, language?: string): Promise<string>;
}
export type Asset = {
    /**
     * URL to the game asset image.
     */
    gameAbsolutePath: string;
    /**
     * URL to the full asset image.
     */
    fullAbsolutePath: string;
};
export type DataDragonRegion = {
    /**
     * The abbreviation of the region.
     */
    abbreviation: string;
    /**
     * URL to the region's icon image.
     */
    iconAbsolutePath: string;
    /**
     * The name of the region.
     */
    name: string;
    /**
     * Reference name of the region.
     */
    nameRef: string;
};
export type DataDragonCard = {
    /**
     * List of associated card codes.
     */
    associatedCards: DataDragonCard[];
    /**
     * References to associated cards.
     */
    associatedCardRefs: string[];
    /**
     * List of asset objects.
     */
    assets: Asset[];
    /**
     * The region of the card.
     */
    region: string;
    /**
     * Reference to the region.
     */
    regionRef: string;
    /**
     * The attack value of the card.
     */
    attack: number;
    /**
     * The cost to play the card.
     */
    cost: number;
    /**
     * The health value of the card.
     */
    health: number;
    /**
     * The card's description.
     */
    description: string;
    /**
     * The raw card description text.
     */
    descriptionRaw: string;
    /**
     * The level-up description.
     */
    levelupDescription: string;
    /**
     * The raw level-up description text.
     */
    levelupDescriptionRaw: string;
    /**
     * The flavor text of the card.
     */
    flavorText: string;
    /**
     * The name of the artist who illustrated the card.
     */
    artistName: string;
    /**
     * The name of the card.
     */
    name: string;
    /**
     * The unique code of the card.
     */
    cardCode: string;
    /**
     * Keywords associated with the card.
     */
    keywords: string[];
    /**
     * References to keywords associated with the card.
     */
    keywordRefs: string[];
    /**
     * The spell speed of the card (if applicable).
     */
    spellSpeed: string;
    /**
     * Reference to the spell speed (if applicable).
     */
    spellSpeedRef: string;
    /**
     * The rarity of the card.
     */
    rarity: string;
    /**
     * Reference to the rarity.
     */
    rarityRef: string;
    /**
     * The subtype of the card (if applicable).
     */
    subtype: string;
    /**
     * The supertype of the card (if applicable).
     */
    supertype: string;
    /**
     * The type of the card (e.g., Unit, Spell).
     */
    type: string;
    /**
     * Whether the card is collectible.
     */
    collectible: boolean;
};
export type FetchedData = {
    /**
     * The instance of the deck.
     */
    deck: Deck;
    /**
     * The cards by rarity reference.
     */
    cardTypes: Record<string, {
        code: string;
        count: number;
    }[]>;
    /**
     * The matching cards by code.
     */
    matchedCards: Record<string, DataDragonCard | null>;
    /**
     * The matching regions by faction code.
     */
    matchedRegions: Record<string, DataDragonRegion | null>;
};
import Deck from './deck.mjs';
//# sourceMappingURL=data-dragon.d.mts.map