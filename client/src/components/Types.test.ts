import {
  byte,
  word,
  toByte,
  addByte,
  toWord,
  upper,
  lower,
  setUpper,
  setLower,
  addWord,
  addUpper,
  addLower,
  toSigned,
} from './Types';

describe('Primitive types', () => {
  it('creates valid words/bytes', () => {
    let a: word = toWord(0x0001);
    expect(a).toEqual(1);
    a = toWord(0xffff);
    expect(a).toEqual(0xffff);
    a = toWord(0x10000);
    expect(a).toEqual(0);
  });
});
