import Base32 from '../../utils/base32.mjs';
import assert from 'assert';
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
    for (let i = 0; i < performanceCalls; i++) Base32.encode(plain, true);
  });

  it(`encode (${performanceCalls} times), padding is false`, function () {
    for (let i = 0; i < performanceCalls; i++) Base32.encode(plain);
  });

  it(`decode (${performanceCalls} times), padding false`, function () {
    for (let i = 0; i < performanceCalls; i++) Base32.decode(encoded);
  });

  it(`decode (${performanceCalls} times), padding true`, function () {
    for (let i = 0; i < performanceCalls; i++) Base32.decode(encodedWithPadding);
  });

  it(`validate equality`, function () {
    assert.deepEqual(decoded, plain, 'decoded does not match plain');
  });
});
