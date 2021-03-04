const pad = (str: string, width: number, replacement: string = '0'): string => {
  if (str.length >= width) {
    return str;
  }
  return Array(width - str.length).join(replacement) + str;
};

export type byte = number;
export type word = number;

/**
 * Casts a number to a byte.
 */
const toByte = (value: number | byte): byte => value & 0xff;

/**
 * Adds the operand to the byte.
 */
const addByte = (opOne: byte, opTwo: byte): byte => (opOne + opTwo) & 0xff;

/**
 * Casts a number to a word.
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
const setUpper = (value: word, operand: byte): word => (value & 0xff) | (operand << 8);

/**
 * Returns the lower byte of the word.
 * @returns - byte
 */
const lower = (value: word): byte => value & 0xff;

/**
 * Sets the lower byte of the word.
 */
const setLower = (value: word, operand: byte): byte => (value & 0xff00) | operand;

/**
 * Adds the operand to the word.
 */
const addWord = (opOne: word, opTwo: word): word => (opOne + opTwo) & 0xffff;

/**
 * Adds the operand to the upper byte.
 */
const addUpper = (value: word, operand: byte): word =>
  setUpper(value, addByte(value >> 8, operand));

/**
 * Adds the operand to the lower byte.
 */
const addLower = (value: word, operand: byte): word =>
  setLower(value, addByte(value & 0xff, operand));

export class ByteArray extends Uint8Array {}

export { toByte, addByte, toWord, upper, lower, setUpper, setLower, addWord, addUpper, addLower };
