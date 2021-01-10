import type { Hex } from './Types';
const assert = require('assert').strict;

interface MBCChip {
  // the MBC type code
  type: number;
  RAMSize: number;
  // enabled with 0Ah in lower 4 bits
  RAMEnable: boolean;
  // current ROM bank
  ROMBank: number;
  // current RAM bank
  RAMBank: number;
  bankingMode: number;
}

class Memory {
  // the entire cartridge ROM
  private ROM: Array<Hex>;
  // the cartridge's ROM size code
  private ROMSize: number;
  private RAMBanks: Array<number>;
  private MBC: MBCChip;
  private bios: Array<Hex>;
  private initialized: boolean = false;
  /**
   * Initializes the ROM
   */
  constructor() {
    // maximum of four RAM banks (RAM1-4)
    this.RAMBanks = Array(4).fill(0x2000);
    this.MBC = {
      type: 0,
      RAMSize: 0,
      RAMBank: 0,
      ROMBank: 0,
      RAMEnable: false,
      bankingMode: 0,
    };
  }

  write(address: number, data: number) {
    if (address < 0x8000) {
      // need to check/set control registers
      this.changeBank(address, data);
      // throw new Error(`Can't write to read-only address: ${address.toString(16)}.`);
    } else if (address >= 0xc000 && address <= 0xdfff) {
      this.ROM[address] = data;
      // write to echo RAM as well
      this.ROM[address + 0x2000] = data;
    } else if (address >= 0xe000 && address <= 0xfdff) {
      throw new Error(`Can't write to prohibited address: ${address.toString(16)}`);
    }
  }

  changeBank(address: number, data: number) {
    if (address < 0x2000) {
      // RAM enable register
      this.MBC.RAMEnable = (data & 0b00001111) === 0xa;
    } else if (address < 0x4000) {
      // ROM Bank change (only the lower nibble)
      this.MBC.ROMBank = data & 0b00011111;
    } else if (address < 0x6000) {
      // RAM or ROM Bank change
      // this.registers.RAMBank;
      if (this.MBC.type === 1) {
        if (this.MBC.bankingMode === 0) {
        }
      }
    } else {
      // Banking mode select
      this.MBC.bankingMode = data & 0x01;
    }
  }
  /**
   * Return the value at the address as a number
   */
  read(address: number) {
    // ROM Bank 0 is always available
    if (address < 0x4000) {
      return this.ROM[address];
    }
    // Reading from ROM bank of cartridge
    if (address >= 0x4000 && address <= 0x7fff) {
      // For non-MBC cartridges, assume cartridge ROM is less than 32kB
      return this.ROM[address];
    }
    // reading from RAM bank
    if (address >= 0xa000 && address <= 0xbfff) {
      // address -= 0xa000;
      // return this.ROM[address + this.registers.RAMBank * 0x2000];
    }
    return this.ROM[address];
  }
  /**
   * Load a file into ROM
   */
  loadFile(rom: Array<Hex>) {
    this.ROM = rom;
    this.MBC.type = this.read(0x147);
    const ROMSize = this.read(0x148);
    this.MBC.RAMSize = this.read(0x149);
    console.log(`ROM Size: $${ROMSize}`);
    console.log(`RAM Size: ${this.MBC.RAMSize}`);
    if (!this.MBC.type) {
      assert(ROMSize === 0);
      this.initialized = true;
    } else {
      console.log(`No support for MBC ${this.MBC.type.toString(16)}.`);
    }
    console.log('Loaded file into ROM memory.');
  }
  /**
   * Load a file into BIOS
   */
  loadBios(bios: Array<Hex>) {
    this.bios = bios;
    console.log('Loaded bios.');
  }
}

export default new Memory();
