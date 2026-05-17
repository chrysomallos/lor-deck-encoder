import assert from 'node:assert';
import {performance} from 'node:perf_hooks';
import Base32 from '../../utils/base32.mjs';
import VarInt from '../../utils/var-int.mjs';

describe('[Base32] performance test', function () {
  let plain, encodedWithPadding, encoded, decoded;
  const performanceCalls = 100000;

  before(function () {
    plain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].flatMap(v => VarInt.get(v));
    encodedWithPadding = Base32.encode(plain, true);
    encoded = Base32.encode(plain, false);
    decoded = Base32.decode(encoded);
  });

  it(`encode (${performanceCalls} times), padding is true`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.encode(plain, true);
    console.log(
      `Encoding with padding (${performanceCalls} times) took ${performance.now() - start} ms, each call took ${(performance.now() - start) / performanceCalls} ms`,
    );
  });

  it(`encode (${performanceCalls} times), padding is false`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.encode(plain);
    console.log(
      `Encoding without padding (${performanceCalls} times) took ${performance.now() - start} ms, each call took ${(performance.now() - start) / performanceCalls} ms`,
    );
  });

  it(`decode (${performanceCalls} times), padding false`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.decode(encoded);
    console.log(
      `Decoding without padding (${performanceCalls} times) took ${performance.now() - start} ms, each call took ${(performance.now() - start) / performanceCalls} ms`,
    );
  });

  it(`decode (${performanceCalls} times), padding true`, function () {
    const start = performance.now();
    for (let i = 0; i < performanceCalls; i++) Base32.decode(encodedWithPadding);
    console.log(
      `Decoding with padding (${performanceCalls} times) took ${performance.now() - start} ms, each call took ${(performance.now() - start) / performanceCalls} ms`,
    );
  });

  it(`validate equality`, function () {
    assert.deepEqual(decoded, plain, 'decoded does not match plain');
  });
});
