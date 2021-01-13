const pad = function (str: string, width: number, replacement: string = '0'): string {
  if (str.length >= width) {
    return str;
  }
  return Array(width - str.length).join(replacement) + str;
};

interface Primitive {
  log: () => string;
}

export class Byte extends Uint8Array implements Primitive {
  constructor(value: number) {
    super([value]);
  }
  value(): number {
    return this[0];
  }
  set<T>(value: T) {
    this[0] = Number(value);
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
  set<T>(value: T) {
    this[0] = Number(value);
  }
  log(): string {
    return `0x${pad(this[0].toString(16), 2)}`;
  }
}
