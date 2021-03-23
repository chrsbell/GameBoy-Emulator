const pad = (str: string, width: number, replacement = '0'): string => {
  if (str.length >= width) {
    return str;
  }
  return Array(width - str.length).join(replacement) + str;
};

interface Flavoring<FlavorT> {
  _type?: FlavorT;
}

type Primitive<T, FlavorT> = T & Flavoring<FlavorT>;

export type bit = Primitive<number, 'bit'>;
export type byte = Primitive<number, 'byte'>;
export type word = Primitive<number, 'word'>;
export interface OpcodeList {
  [key: string]: Function;
}

/**
 * Casts a number to a byte.
 * @returns {byte}
 */
const toByte = (value: number | byte): byte => value & 0xff;

/**
 * Adds the operand to the byte.
 * @returns {byte}
 */
const addByte = (opOne: byte, opTwo: byte): byte => toByte(opOne + opTwo);

/**
 * Casts a number to a word.
 * @returns {word}
 */
const toWord = (value: number | word): word => value & 0xffff;

/**
 * Returns the upper byte of the word.
 * @returns {byte}
 */
const upper = (value: word): byte => value >> 8;

/**
 * Sets the upper byte of the word.
 * @returns {word}
 */
const setUpper = (value: word, operand: byte): word =>
  toByte(value) | (operand << 8);

/**
 * Returns the lower byte of the word.
 * @returns {byte}
 */
const lower = (value: word): byte => toByte(value);

/**
 * Sets the lower byte of the word.
 * @returns {word}
 */
const setLower = (value: word, operand: byte): word =>
  (value & 0xff00) | operand;

/**
 * Adds the operand to the word.
 * @returns {word}
 */
const addWord = (opOne: word, opTwo: word): word => toWord(opOne + opTwo);

/**
 * Adds the operand to the upper byte.
 * @returns {word}
 */
const addUpper = (value: word, operand: byte): word =>
  lower(value) | (addByte(upper(value), operand) << 8);

/**
 * Adds the operand to the lower byte.
 */
const addLower = (value: word, operand: byte): word =>
  (upper(value) << 8) | addByte(lower(value), operand);

/**
 * Formats the byte/word as a hex value
 */
const toHex = (value: byte | word): string => `0x${pad(value.toString(16), 2)}`;

/**
 * Converts the unsigned byte to its signed format using two's complement
 */
const toSigned = (value: byte) => {
  if (value >= 128) {
    return -((~value + 1) & 255);
  }
  return value;
};

const getBit = (value: byte, bit: number) => {
  if (bit > 7) {
    throw new Error('Tried to get bit outside of range.');
  }
  return (value >> bit) & 1;
};

const setBit = (value: byte, bit: number) => {
  if (bit > 7) {
    throw new Error('Tried to set bit outside of range.');
  }
  return (value >> bit) & 1;
};

const clearBit = (value: byte, bit: number) => {
  if (bit > 7) {
    throw new Error('Tried to set bit outside of range.');
  }
  return value & ~(1 << 7);
};

export {
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
  toHex,
  toSigned,
  getBit,
  setBit,
  clearBit,
};
