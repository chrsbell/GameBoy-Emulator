import {toSigned, toWord, word} from './helpers/Primitives';

describe('Primitive types', () => {
  it('creates valid words/bytes', () => {
    let a: word = toWord(0x0001);
    expect(a).toEqual(1);
    a = toWord(0xffff);
    expect(a).toEqual(0xffff);
    a = toWord(0x10000);
    expect(a).toEqual(0);
  });
  it('converts an unsigned value to its signed format', () => {
    expect(toSigned(128)).toEqual(-128);
    expect(toSigned(255)).toEqual(-1);
    expect(toSigned(127)).toEqual(127);
    expect(toSigned(0)).toEqual(0);
  });
});
