# lor-deck-codes - Legends of Runeterra - Deck Codes

## 2.0.4 - unreleased

- Bump some development dependency module versions and adjust test imports.

## 2.0.3 - 2025-01-19

### Changes

- Bump some development dependency module versions.

### Fixes

- Refactor data dragon export and fix languages including descriptions.

## 2.0.2 - 2024-11-17

### Changes

- Bump some development dependency module versions.

### Fixes

- Fixed an issue with detection of correct deck version.
- Fixed the tests for shuffle and encoder.
- Add missing tests for some tools.
- Improve performance test cases.

## 2.0.1 - 2024-09-22

### Fixes

- Fixed alphanumeric faction sort issue, by using a generated faction sort value.

### Changes

- Additional using group by methods to optimize deck encoder and makes them side effect free.

## 2.0.0 - 2024-08-17

### Changes

- Use node 22.x as base version and update some implementations.
- Use correct sorting algorithm for deck code generator.

## 1.2.0 - 2024-07-19

### Features

- Add [Data Dragon](https://developer.riotgames.com/docs/lor#data-dragon) to generate deck information.
- Added a command line for direct usage or testing.

## 1.1.0 - 2022-05-19

### Updates

- Add new faction 'Runeterra'.

### Fixes

- Fixes some descriptions and tests.
- Fix pure ESM module.

## 1.0.1 - 2022-03-26

### Fixes

- Fixes wrong version definition for 'Shurima' and 'Mount Targon' faction.
- Fixed export im index to fit correct style.
- Fixed LICENSE file name and README description.

### Improvements

- Added missing JSDoc at several points.

## 1.0.0 - 2022-02-08

### Initial

- First implementation of the deck codes decoder and encoder, based on Riot Games [Implementation](https://github.com/RiotGames/LoRDeckCodes).
