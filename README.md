# lor-deck-encoder - Legends of Runeterra - Deck Encoder

This is a JavaScript ES6 port of the Legends of Runeterra deck encoder/decoder. The goal of this project is to keep up-to-date with Riot's [Implementation](https://github.com/RiotGames/LoRDeckCodes), stay as close to the original result schema as possible, and use zero external runtime dependencies (instead of testing).

## Installation

The package require [Node.js](https://nodejs.org/en/) min version 17.5.0.
Use the package manager [yarn](https://yarnpkg.com/) to install this package.

```
yarn add lor-deck-encoder
```

Or the package manager [npm](https://www.npmjs.com/).

```
npm install lor-deck-encoder
```
## Interface `Deck`

The following headlines will describe the _Deck_ class interface.

### _static_ fromCode(_string_) : _Deck_

Example:
```js
import {Deck} from 'lor-deck-encoder';
const deck = Deck.fromCode('CEBQGAIFAMJC6BABAMCBGFJUAICAGAQRAICACBIWDQOS4AIBAM4AEAIEAUIQEBADAEHQ');
```

## Example usage

```js
import {Deck} from 'lor-deck-encoder';

const deck = Deck.fromCode('CEBQGAIFAMJC6BABAMCBGFJUAICAGAQRAICACBIWDQOS4AIBAM4AEAIEAUIQEBADAEHQ');
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
    Card {
      set: 1,
      id: 18,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 3,
    },
    Card {
      set: 1,
      id: 47,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 3,
    },
    Card {
      set: 1,
      id: 4,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 3,
    },
    Card {
      set: 1,
      id: 19,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 3,
    },
    Card {
      set: 1,
      id: 21,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 3,
    },
    Card {
      set: 1,
      id: 52,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 3,
    },
    Card {
      set: 4,
      id: 2,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 3,
    },
    Card {
      set: 4,
      id: 17,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 3,
    },
    Card {
      set: 1,
      id: 22,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 2,
    },
    Card {
      set: 1,
      id: 28,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 2,
    },
    Card {
      set: 1,
      id: 29,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 2,
    },
    Card {
      set: 1,
      id: 46,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 2,
    },
    Card {
      set: 1,
      id: 56,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 2,
    },
    Card {
      set: 4,
      id: 17,
      faction: Faction {
        id: 5,
        version: 1,
        code: 'SI',
        name: 'Shadow Isles',
      },
      count: 1,
    },
    Card {
      set: 4,
      id: 1,
      faction: Faction {
        id: 3,
        version: 1,
        code: 'NX',
        name: 'Noxus',
      },
      count: 1,
    },
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
    {
      code: '01SI018',
      count: 3,
    },
    {
      code: '01SI047',
      count: 3,
    },
    {
      code: '01NX004',
      count: 3,
    },
    {
      code: '01NX019',
      count: 3,
    },
    {
      code: '01NX021',
      count: 3,
    },
    {
      code: '01NX052',
      count: 3,
    },
    {
      code: '04NX002',
      count: 3,
    },
    {
      code: '04NX017',
      count: 3,
    },
    {
      code: '01SI022',
      count: 2,
    },
    {
      code: '01SI028',
      count: 2,
    },
    {
      code: '01SI029',
      count: 2,
    },
    {
      code: '01SI046',
      count: 2,
    },
    {
      code: '01NX056',
      count: 2,
    },
    {
      code: '04SI017',
      count: 1,
    },
    {
      code: '04NX001',
      count: 1,
    },
    {
      code: '04NX015',
      count: 1,
    },
  ],
  code: 'CEBQIAIDAQJRKNADAECQGERPAICAGAQRAIAQCAZYAQAQKFQ4DUXAEAQEAMAQ6AIEAUIQ',
  list: [
    '01SI003:3',
    '01SI018:3',
    '01SI047:3',
    '01NX004:3',
    '01NX019:3',
    '01NX021:3',
    '01NX052:3',
    '04NX002:3',
    '04NX017:3',
    '01SI022:2',
    '01SI028:2',
    '01SI029:2',
    '01SI046:2',
    '01NX056:2',
    '04SI017:1',
    '04NX001:1',
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

## Test

- first check out project

```
yarn install
mocha
```
