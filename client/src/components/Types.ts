const pad = function (str: string, width: number, replacement: string = '0'): string {
  if (str.length >= width) {
    return str;
  }
  return Array(width - str.length).join(replacement) + str;
};

interface Primitive {
  log: () => string;
  value: () => number;
}

export class Byte extends Uint8Array implements Primitive {
  constructor(value: number) {
    super([value]);
  }
  value(): number {
    return this[0];
  }
  set<T>(value: T) {
    if (typeof value === 'number') {
      this[0] = Number(value);
    } else {
      throw new Error(`Cannot set Byte to non-number.`);
    }
  }
  log(): string {
    return `0x${pad(this[0].toString(16), 2)}`;
  }
}

export class ByteArray extends Uint8Array {}

export class Word extends Uint16Array implements Primitive {
  constructor(value: number) {
    super([value]);
  }
  value(): number {
    return this[0];
  }
  upper(): Byte {
    return new Byte(this[0] >> 8);
  }
  lower(): Byte {
    return new Byte(this[0] & 0b0000000011111111);
  }
  set<T>(value: T) {
    if (typeof value === 'number') {
      this[0] = Number(value);
    } else {
      throw new Error(`Cannot set Byte to non-number.`);
    }
  }
  log(): string {
    return `0x${pad(this[0].toString(16), 4)}`;
  }
}
