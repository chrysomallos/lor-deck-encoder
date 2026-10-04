import decodeV1 from '../src/decode_v1.mjs';
import decodeV2 from '../src/decode_v2.mjs';
import decodeV3 from '../src/decode_v3.mjs';

const largeDeckCode = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';

/**
 * Decodes a large deck code using different version of the decoder.
 * Structure see `nano-benchmark` package https://github.com/uhop/nano-bench#documentation.
 */
export default {
  decode_large_v1: n => {
    for (let i = 0; i < n; i += 1) {
      decodeV1(largeDeckCode);
    }
  },
  decode_large_v2: n => {
    for (let i = 0; i < n; i += 1) {
      decodeV2(largeDeckCode);
    }
  },
  decode_large_v3: n => {
    for (let i = 0; i < n; i += 1) {
      decodeV3(largeDeckCode);
    }
  },
};
