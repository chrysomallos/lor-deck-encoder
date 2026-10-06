# lor-deck-encoder - Legends of Runeterra - Deck Encoder

This project is a JavaScript ES6 port of the Legends of Runeterra deck encoder/decoder. Its goal is to stay up-to-date with Riot’s [implementation](https://github.com/RiotGames/LoRDeckCodes), maintain close adherence to the original result schema, and use minimize additional runtime dependencies (excluding testing).

## Installation

The package require [Node.js](https://nodejs.org/en/) with version 22.x or above, because we using [Object.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) and [Map.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy). Use the package manager [yarn](https://yarnpkg.com/) to install this package.

Like:
```
yarn add lor-deck-encoder@https://github.com/chrysomallos/lor-deck-encoder.git
```

## Interface `Deck`

Represents a Legends of Runeterra deck and provides helpers for parsing, encoding, and inspecting deck contents.

### `static fromCode(code: string, skipFormatCheck?: boolean): Deck`

Parse an encoded deck string and return a `Deck` instance.

- `code`: The Legends of Runeterra deck code string.
- `skipFormatCheck`: Optional. If true, skips validation of the deck code format.

### `static fromCardCodes(codes: string[]): Deck`

Create a deck from a list of simplified card codes.

- `codes`: Array of card codes, e.g. `['01DE123']`.

### `static fromCardCodesAndCounts(cardCounts: {code: string, count: number}[]): Deck`

Create a deck from card codes with explicit counts.

- `cardCounts`: List of objects containing `code` and `count`.

### `constructor(cards?: Card[])`

Create a new deck and optionally initialize it with cards.

- `cards`: Optional initial card list.

### `cards: Card[]`

All cards currently in the deck.

### `size: number`

The total number of cards in the deck, accounting for each card's count.

### `version: number`

The maximum supported deck encoding version for the current cards.

### `code: string`

The encoded Legends of Runeterra deck code for this deck.

### `list: string[]`

The formatted card list for this deck, where each entry is `code:count`.

### `allCodeAndCount: string[]`

The list of all card codes with counts encoded as strings.

### `sort(): void`

Sort the cards in place using the deck card comparer.

### `add(card: Card | string, count?: number): void`

Add a card to the deck.

- `card`: A `Card` instance or a card code string.
- `count`: Optional count when adding by code.

### `contains(card: Card): boolean`

Check whether the deck contains the given card.

- `card`: The card to check for.

## Example usage

```js
import createDeck, {Deck} from 'lor-deck-encoder';

const deck = createDeck('CEBQGAIFAMJC6BABAMCBGFJUAICAGAQRAICACBIWDQOS4AIBAM4AEAIEAUIQEBADAEHQ');
/*
deck = Deck {
  cards: [
    Card {
      set: 1,
      id: 3,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 3,
    },
    {...},
    Card {
      set: 4,
      id: 15,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 1,
    },
  ],
  allCodeAndCount: [
    {
      code: '01SI003',
      count: 3,
    },
    {...},
    {
      code: '04NX015',
      count: 1,
    },
  ],
  code: 'CEBQIAIDAQJRKNADAECQGERPAICAGAQRAIAQCAZYAQAQKFQ4DUXAEAQEAMAQ6AIEAUIQ',
  list: [
    '01SI003:3',
    ...,
    '04NX015:1',
  ],
  version: 1
}
*/

console.log(Deck.fromCode('CEAAECABAQJRWHBIFU2DOOYIAEBAMCIMCINCILJZAICACBANE4VCYBABAILR2HRL').list);
/*
Expected result:
[
  '01PZ019:2', '01PZ027:2',
  '01PZ028:2', '01PZ040:2',
  '01PZ045:2', '01PZ052:2',
  '01PZ055:2', '01PZ059:2',
  '01IO006:2', '01IO009:2',
  '01IO012:2', '01IO018:2',
  '01IO026:2', '01IO036:2',
  '01IO045:2', '01IO057:2',
  '01PZ013:1', '01PZ039:1',
  '01PZ042:1', '01PZ044:1',
  '01IO023:1', '01IO029:1',
  '01IO030:1', '01IO043:1'
]
*/
```

## Command line

Use `yarn cli <code>` to show code output, with `--out-file` you can write additional deck information from [Data Dragon](https://developer.riotgames.com/docs/lor#data-dragon) into a file (html or json), optional you can change the `--language` (default is `en_us`).

Example `yarn cli CEAAECABAIDASDASDISC2OIIAECBGGY4FAWTINZ3AICACAQXDUPCWBABAQGSOKRM --out-file test.hml`.

## Test

To run the test, first check out the project and then execute `yarn install`.

Included code tests:

- `yarn test:unit` executes the existing tests, using [mocha](https://mochajs.org/#arrow-functions)
- `yarn test:coverage` generate coverage report, using [c8](https://github.com/bcoe/c8)
- `yarn build:lint` generate code smells report, using [ESLint](https://eslint.org/)

## License

Copyright (C) 2026 Chrysomallos

licensed under the MIT license. See [LICENSE](./LICENSE.md) for details.
