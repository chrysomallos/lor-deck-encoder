# lor-deck-encoder - Legends of Runeterra - Deck Encoder

This project is a JavaScript ES6 port of the Legends of Runeterra deck encoder/decoder. Its goal is to stay up-to-date with Riot’s [implementation](https://github.com/RiotGames/LoRDeckCodes), maintain close adherence to the original result schema, and use minimize additional runtime dependencies (excluding testing).

## Installation

The package require [Node.js](https://nodejs.org/en/) with version 22.x or above, because we using [Object.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) and [Map.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy). Use the package manager [yarn](https://yarnpkg.com/) to install this package.

Like:
```
yarn add lor-deck-encoder@https://github.com/chrysomallos/lor-deck-encoder.git
```

## Interface `Deck`

The following headlines will describe the _Deck_ class interface.

### _static_ fromCode(_string_) : _Deck_

Example:
```js
import createDeck from 'lor-deck-encoder';
const deck = createDeck('CEBQEBADAIIQGAIFAMJC6BABAMCBGFJUAIAQCAZYAQAQKFQ4DUXAEAIEAUIQEBADAEHQ');
```

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

- `yarn test` executes the existing tests, using [mocha](https://mochajs.org/#arrow-functions)
- `yarn coverage` generate coverage report, using [c8](https://github.com/bcoe/c8)
- `yarn lint` generate code smells report, using [ESLint](https://eslint.org/)
