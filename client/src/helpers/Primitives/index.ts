const pad = (str: string, width: number, replacement = '0'): string => {
  if (str.length >= width) {
    return str;
  }
  return Array(width - str.length).join(replacement) + str;
};

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
const addWord = (opOne: word, opTwo: word | byte): word =>
  toWord(opOne + opTwo);

/**
 * Adds the operand to the upper byte.
 * @returns {word}
 */
const addUpper = (value: word, operand: byte): word =>
  (value & 255) | (addByte(upper(value), operand) << 8);

/**
 * Adds the operand to the lower byte.
 */
const addLower = (value: word, operand: byte): word =>
  (upper(value) << 8) | ((value + operand) & 255);

/**
 * Formats the byte/word as a hex value
 */
const toHex = (value: byte | word): string => `0x${pad(value.toString(16), 2)}`;

/**
 * Converts the unsigned byte to its signed format using two's complement
 */
const toSigned = (value: byte): byte => {
  if (value < 0) throw new Error(`Can't pass signed value into toSigned.`);
  if (value >= 128 || value <= -128) {
    return -((~value + 1) & 255);
  }
  return value;
};

const getBit = (value: byte, bit: number): bit => {
  return (value >> bit) & 1;
};

const setBit = (value: byte | word, bit: number): byte | word => {
  return value | (1 << bit);
};

const clearBit = (value: byte | word, bit: number): byte | word => {
  return value & ~(1 << bit);
};

const Primitive = {
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

export default Primitive;
