import decodeV1 from '../src/decode_v1.mjs';
import decodeV2 from '../src/decode_v2.mjs';
import decodeV3 from '../src/decode_v3.mjs';

const smallDeckCode = 'CMAQCBAHBIAQCBAHAMAAIAQAAICQGBQE';

/**
 * Decodes a small deck code using different version of the decoder.
 * Structure see `nano-benchmark` package https://github.com/uhop/nano-bench#documentation.
 */
export default {
  decode_small_v1: n => {
    for (let i = 0; i < n; i += 1) {
      decodeV1(smallDeckCode);
    }
  },
  decode_small_v2: n => {
    for (let i = 0; i < n; i += 1) {
      decodeV2(smallDeckCode);
    }
  },
  decode_small_v3: n => {
    for (let i = 0; i < n; i += 1) {
      decodeV3(smallDeckCode);
    }
  },
};
