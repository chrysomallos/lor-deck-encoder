import decodeV1 from '../src/decode_v1.mjs';
import decodeV2 from '../src/decode_v2.mjs';
import decodeV3 from '../src/decode_v3.mjs';

const largeDeckCode = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';

export default {
  decode_large_v1: performanceCalls => {for (let i = 0; i < performanceCalls; i += 1) decodeV1(largeDeckCode)},
  decode_large_v2: performanceCalls => {for (let i = 0; i < performanceCalls; i += 1) decodeV2(largeDeckCode)},
  decode_large_v3: performanceCalls => {for (let i = 0; i < performanceCalls; i += 1) decodeV3(largeDeckCode)},
}