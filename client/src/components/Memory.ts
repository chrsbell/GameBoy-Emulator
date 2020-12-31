import type { Hex } from './Types';

class Memory {
  private buffer: Array<Hex>;
  // the current MBC
  private MBC: number;
  private MBCType: number;
  // current RAM bank
  private RAMBank: number;
  private RAMBanks: Array<number>;
  // current ROM bank
  private ROMBank: number;
  /**
   * Initializes the ROM buffer
   */
  constructor() {
    this.buffer = Array(0x200000).fill(0);
    this.MBC = 1;
    // maximum of four RAM banks
    this.RAMBanks = Array(4).fill(0x2000);
    this.RAMBank = 0;
    this.ROMBank = 0;
  }
  write(address: number, data: number) {
    if (address < 0x8000) {
      throw new Error(`Can't write to read-only address: ${address.toString(16)}.`);
    } else if (address >= 0xc000 && address <= 0xdfff) {
      this.buffer[address] = data;
      // write to echo RAM as well
      this.buffer[address + 0x2000] = data;
    } else if (address >= 0xe000 && address <= 0xfdff) {
      throw new Error(`Can't write to prohibited address: ${address.toString(16)}`);
    }
  }
  /**
   * Return the value at the address as a number
   */
  read(address: number) {
    // reading from ROM bank
    if (address >= 0x4000 && address <= 0x7fff) {
      address -= 0x4000;
      return this.buffer[address + this.ROMBank * 0x4000];
    }
    // reading from RAM bank
    if (address >= 0xa000 && address <= 0xbfff) {
      address -= 0xa000;
      return this.buffer[address + this.RAMBank * 0x2000];
    }
    return this.buffer[address];
  }
  /**
   * Load a file into ROM
   */
  loadFile(rom: Array<Hex>) {
    this.buffer = rom;
    const type = this.read(0x147);
    if (!type) {
      this.MBCType = 0;
    } else if (type >= 1 && type <= 3) {
      this.MBCType = 1;
    } else if (type === 5 || type === 6) {
      this.MBCType = 2;
    } else if (type >= 15 && type <= 19) {
      this.MBCType = 3;
    } else {
      console.log(`No support for MBC ${type.toString(16)}.`);
    }
    console.log('Loaded file into ROM memory.');
  }
}

export default new Memory();
