import {Primitive} from 'helpers/index';

describe('Primitive types', () => {
  it('creates valid words/bytes', () => {
    let a: word = Primitive.toWord(0x0001);
    expect(a).toEqual(1);
    a = Primitive.toWord(0xffff);
    expect(a).toEqual(0xffff);
    a = Primitive.toWord(0x10000);
    expect(a).toEqual(0);
  });
  it('converts an unsigned value to its signed format', () => {
    expect(Primitive.toSigned(128)).toEqual(-128);
    expect(Primitive.toSigned(255)).toEqual(-1);
    expect(Primitive.toSigned(127)).toEqual(127);
    expect(Primitive.toSigned(0)).toEqual(0);
  });
});
