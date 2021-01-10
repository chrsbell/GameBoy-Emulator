import type { Hex } from '../Types';

const ROMSizeCodes = {
  0x00: { size: '32kB', banks: 2 },
  0x01: { size: '64kB', banks: 4 },
  0x02: { size: '128kB', banks: 8 },
  0x03: { size: '256kB', banks: 16 },
  0x04: { size: '512kB', banks: 32 },
  0x05: { size: '1MB', banks: 64 },
};

const CartridgeTypes = {
  0x00: 'ROM Only',
  0x01: 'MBC #1',
  0x02: 'MBC #1 + external RAM',
  0x03: 'MBC #1 + external RAM + battery',
};

const RAMSizeCodes = {
  0x00: 'None',
  0x01: '2kB',
  0x02: '8kB',
  0x03: '32kB, 4 banks',
  0x04: '128kB, 16 banks',
  0x05: '64kB, 8 banks',
};

interface Cartridge {
  // entire cartridge ROM
  ROM: Array<Hex>;
  // the ROM size code
  ROMSize: number;
  // external RAM size code
  RAMSize: number;
  // the MBC type code
  type: number;
  // each ROM Bank is 16kB
  ROMBanks: Array<Hex>;
  // 4 banks for 32kB RAM sizes
  // https://gbdev.io/pandocs/#a000-bfff-ram-bank-00-03-if-any-read-write
  RAMBanks: Array<Hex>;
  R: {
    // enabled with 0Ah in lower 4 bits
    RAMEnabled: boolean;
    // current ROM bank
    // https://gbdev.io/pandocs/#_0000-3fff-rom-bank-00-20-40-60-read-only
    currROMBank: number;
    // current RAM bank (1 bank for RAM with 2kB-8kB sizes)
    currRAMBank: number;
    // 2 bit register
    ROMRAMMixed: number;
    bankingMode: number;
  };
}

class Memory {
  private cartridge: Cartridge;
  private bios: Array<Hex>;
  private initialized: boolean = false;
  constructor() {
    // defaults to bank 1 at power on
    this.cartridge.R.currROMBank = 1;
  }

  write(address: number, data: number) {
    if (address < 0x8000) {
      this.changeBank(address, data);
    } else if (address >= 0xc000 && address <= 0xdfff) {
      this.cartridge.ROM[address] = data;
      // write to echo RAM as well
      this.cartridge.ROM[address + 0x2000] = data;
    } else if (address >= 0xe000 && address <= 0xfdff) {
      throw new Error(`Can't write to prohibited address: ${address.toString(16)}`);
    }
  }

  changeBank(address: number, data: number) {
    if (address < 0x2000) {
      // RAM enable register
      this.cartridge.R.RAMEnabled = (data & 0b00001111) === 0xa;
    } else if (address < 0x4000) {
      // ROM Bank change (only the lower 5 bits)
      this.cartridge.R.currROMBank = data & 0b00011111;
    } else if (address < 0x6000) {
      const register = data & 0b11;
      this.cartridge.R.ROMRAMMixed = register;
      // swap to one of the four RAM banks if size is 32kB
      if (this.cartridge.RAMSize >= 0x03) {
        this.cartridge.R.currRAMBank = register;
      }
      if (this.cartridge.R.bankingMode === 0 && this.cartridge.ROMSize >= 0x05) {
        // for 1MB ROM or larger carts, set upper 2 bits (5-6) of ROM bank number
        this.cartridge.R.currROMBank |= register << 4;
      }
      // for 1MB ROM multi carts, apply same operation but only to bits 4-5
    } else {
      // Banking mode select
      this.cartridge.R.bankingMode = data & 0x01;
    }
  }
  /**
   * Return the value at the address as a number
   */
  read(address: number) {
    // ROM Bank 0 is always available
    if (address < 0x4000) {
      return this.cartridge.ROM[address];
    } else if (address >= 0x4000 && address <= 0x7fff) {
      // Reading from ROM bank of cartridge
      // For non-MBC cartridges, assume cartridge ROM is less than 32kB
      return this.cartridge.ROM[address];
    } else if (address >= 0xa000 && address <= 0xbfff) {
      // reading from RAM bank
      // address -= 0xa000;
      // return this.cartridge.ROM[address + this.registers.RAMBank * 0x2000];
    }
    return this.cartridge.ROM[address];
  }
  /**
   * Load a file into ROM
   */
  loadFile(rom: Array<Hex>) {
    this.cartridge.ROM = rom;
    this.cartridge.type = this.read(0x147);
    this.cartridge.ROMSize = this.read(0x148);
    this.cartridge.RAMSize = this.read(0x149);
    console.log(`ROM Size: $${this.cartridge.ROMSize}`);
    console.log(`RAM Size: ${this.cartridge.RAMSize}`);
    if (!this.cartridge.type) {
      this.initialized = true;
    } else {
      console.log(`No support for MBC ${this.cartridge.type.toString(16)}.`);
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
