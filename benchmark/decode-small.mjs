import decodeV1 from '../src/decode_v1.mjs';
import decodeV2 from '../src/decode_v2.mjs';
import decodeV3 from '../src/decode_v3.mjs';

const smallDeckCode = 'CMAQCBAHBIAQCBAHAMAAIAQAAICQGBQE';

export default {
  decode_small_v1: performanceCalls => {for (let i = 0; i < performanceCalls; i += 1) decodeV1(smallDeckCode)},
  decode_small_v2: performanceCalls => {for (let i = 0; i < performanceCalls; i += 1) decodeV2(smallDeckCode)},
  decode_small_v3: performanceCalls => {for (let i = 0; i < performanceCalls; i += 1) decodeV3(smallDeckCode)},
}