import Base32 from '../utils/base32.mjs';
import VarInt from '../utils/var-int.mjs';

const code = 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN';

/**
 * Benchmarks var_int operations.
 * Structure see `nano-benchmark` package https://github.com/uhop/nano-bench#documentation.
 */
export default {
  var_int_pop: n => {
    for (let i = 0; i < n; i += 1) {
      const bytes = Base32.decode(code);
      while (bytes.length) VarInt.pop(bytes);
    }
  },
  var_int_decode: n => {
    for (let i = 0; i < n; i += 1) {
      VarInt.decode(Base32.decode(code));
    }
  },
};
