const pad = function (str: string, width: number, replacement: string = '0'): string {
  if (str.length >= width) {
    return str;
  }
  return Array(width - str.length).join(replacement) + str;
};

interface Primitive {
  log: () => string;
  value: () => number;
  add(operand: number): void;
}

export class Byte extends Uint8Array implements Primitive {
  constructor(value: number) {
    super([value]);
  }
  /**
   * Returns the value of the word.
   */
  value(): number {
    return this[0];
  }
  /**
   * Sets the value of the byte.
   */
  set<T>(value: T) {
    if (typeof value === 'number') {
      this[0] = Number(value);
    } else {
      throw new Error(`Cannot set Byte to non-number.`);
    }
  }
  /**
   * Adds the operand to the byte.
   */
  add(operand: number): void {
    this.set(this.value() + operand);
  }
  /**
   * Negates the value as an unsigned byte
   */
  negate(): void {
    this.set(this.value() * -1);
  }
  /**
   * Logs the byte as a hex value.
   */
  log(): string {
    return `0x${pad(this[0].toString(16), 2)}`;
  }
}

export class ByteArray extends Uint8Array {}

export class Word extends Uint16Array implements Primitive {
  public constructor(value: number) {
    super([value]);
  }
  /**
   * Returns the word's value.
   * @returns - number
   */
  public value(): number {
    return this[0];
  }
  /**
   * Returns the upper byte of the word.
   * @returns - Byte
   */
  public upper(): Byte {
    return new Byte(this[0] >> 8);
  }
  /**
   * Sets the upper byte of the word.
   */
  public setUpper(byte: Byte) {
    this.set((this[0] & 0b0000000011111111) | (byte.value() << 8));
  }
  /**
   * Returns the lower byte of the word.
   * @returns - Byte
   */
  public lower(): Byte {
    return new Byte(this[0] & 0b0000000011111111);
  }
  /**
   * Sets the lower byte of the word.
   */
  public setLower(byte: Byte) {
    this.set((this[0] & 0b1111111100000000) | byte.value());
  }
  /**
   * Sets the value of the word.
   */
  public set<T>(value: T) {
    if (typeof value === 'number') {
      this[0] = Number(value);
    } else {
      throw new Error(`Cannot set Byte to non-number.`);
    }
  }
  /**
   * Adds the operand to the word.
   */
  public add(operand: number): void {
    this.set(this.value() + operand);
  }
  /**
   * Adds the operand to the upper byte.
   */
  public addUpper(operand: number): void {
    let upper: Byte = this.upper();
    upper.add(operand);
    this.setUpper(upper);
  }
  /**
   * Adds the operand to the lower byte.
   */
  public addLower(operand: number): void {
    let lower: Byte = this.lower();
    lower.add(operand);
    this.setLower(lower);
  }
  /**
   * Logs the word as a hex value.
   */
  public log(): string {
    return `0x${pad(this[0].toString(16), 4)}`;
  }
}
