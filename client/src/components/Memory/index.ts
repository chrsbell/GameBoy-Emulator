import type {byte, word} from '../Types';
import {toByte, lower, upper, toHex} from '../Types';
import LCD from '../LCD';

interface CartridgeCode {
  [key: number]: string;
}

interface ROMCode {
  [key: number]: {size: string; numBanks: number};
}

const ROMSizeCodes: ROMCode = {
  0x00: {size: '32kB', numBanks: 2},
  0x01: {size: '64kB', numBanks: 4},
  0x02: {size: '128kB', numBanks: 8},
  0x03: {size: '256kB', numBanks: 16},
  0x04: {size: '512kB', numBanks: 32},
  0x05: {size: '1MB', numBanks: 64},
};

const CartridgeTypes: CartridgeCode = {
  0x00: 'ROM Only',
  0x01: 'MBC #1',
  0x02: 'MBC #1 + RAM',
  0x03: 'MBC #1 + RAM + Battery',
  0x05: 'MBC2',
  0x06: 'MBC2 + Battery',
  0x08: 'ROM + RAM',
  0x09: 'MBCM #1',
  0x0b: 'MBCM #1 + RAM',
  0x0c: 'MBCM #1 + RAM + Battery',
  0x0d: 'MBCM #1 + RAM + Battery',
  0x0f: 'MBC #3 + Timer + Battery',
  0x10: 'MBC #3 + Timer + RAM + Battery',
  0x11: 'MBC #3',
  0x12: 'MBC #3 + RAM',
  0x13: 'MBC #3 + RAM + Battery',
};

const RAMSizeCodes: CartridgeCode = {
  0x00: 'None',
  0x01: '2kB',
  0x02: '8kB',
  0x03: '32kB, 4 banks',
  0x04: '128kB, 16 banks',
  0x05: '64kB, 8 banks',
};

interface Cartridge {
  // entire cartridge ROM
  ROM: Uint8Array;
  // the ROM size code
  ROMSize: byte;
  // external RAM size code
  RAMSize: byte;
  // the MBC type code
  MBCType: byte;
  // each ROM Bank is 16kB
  ROMBanks: Array<Uint8Array>;
  // 4 banks for 32kB RAM sizes
  // https://gbdev.io/pandocs/#a000-bfff-ram-bank-00-03-if-any-read-write
  RAMBanks: Array<Uint8Array>;
  R: {
    // enabled with 0Ah in lower 4 bits
    RAMEnabled: boolean;
    // current ROM bank
    // https://gbdev.io/pandocs/#_0000-3fff-rom-bank-00-20-40-60-read-only
    currROMBank: byte;
    // current RAM bank (1 bank for RAM with 2kB-8kB sizes)
    currRAMBank: byte;
    // 2 bit register
    ROMRAMMixed: byte;
    bankingMode: byte;
  };
}

class Memory {
  private bios!: Uint8Array;
  // whether bios execution has finished
  public inBios = false;
  public cart!: Cartridge;
  // 8k vRAM
  private vRAM!: Uint8Array;
  // 8k internal RAM
  private wRAM!: Uint8Array;
  // shadow of working RAM, (8k - 512) bytes
  private wRAMShadow!: Uint8Array;
  // sprite attribute table
  private OAM!: Uint8Array;
  // 126 bytes high RAM
  private hRAM!: Uint8Array;
  // 128 bytes io register space
  private IORAM!: Uint8Array;
  public constructor() {
    this.reset();
  }
  /**
   * Resets the Memory module.
   */
  public reset(): void {
    this.vRAM = new Uint8Array(0x9fff - 0x8000);
    this.wRAM = new Uint8Array(0xdfff - 0xc000);
    this.wRAMShadow = new Uint8Array(0xfdff - 0xe000);
    this.OAM = new Uint8Array(0xfe9f - 0xfe00);
    this.IORAM = new Uint8Array(0xff7f - 0xff00);
    this.hRAM = new Uint8Array(0xfffe - 0xff80);
    // defaults to bank 1 at power on
    this.cart = {
      ROM: new Uint8Array(),
      ROMSize: 0,
      RAMSize: 0,
      MBCType: 0,
      ROMBanks: [new Uint8Array()],
      RAMBanks: [new Uint8Array()],
      R: {
        RAMEnabled: false,
        currROMBank: 1,
        currRAMBank: 1,
        ROMRAMMixed: 0,
        bankingMode: 0,
      },
    };
    this.cart.R.currROMBank = 1;
  }
  /**
   * Writes the provided byte to the address
   */
  public writeByte(address: word, data: byte): void {
    if (this.inBios) {
      if (address <= 0xff) {
        this.bios[address] = data;
      } else {
        this.inBios = false;
        console.log('Exited bios using write to memory.');
      }
    }
    if (address < 0x4000) {
      // ROM Bank 0 is always available
      this.cart.ROM[address] = data;
    } else if (address <= 0x7fff) {
      // write to ROM bank of cartridge
      this.cart.ROM[address] = data;
    } else if (address <= 0x9fff) {
      this.vRAM[address - 0x8000] = data;
    } else if (address <= 0xbfff) {
      // write to RAM bank of cartridge
      this.cart.RAMBanks[this.cart.R.currRAMBank][address - 0xa000] = data;
    } else if (address <= 0xdfff) {
      this.wRAM[address - 0xc000] = data;
    } else if (address <= 0xfdff) {
      console.error(`Can't write to prohibited address.`);
    } else if (address <= 0xfe9f) {
      this.OAM[address - 0xfe00] = data;
    } else if (address <= 0xff7f) {
      // hardware I/O
      // LCD control register
      if (address === 0xff40) {
        LCD.setControls(data);
      }
      this.IORAM[address - 0xff00] = data;
    } else if (address <= 0xffff) {
      this.hRAM[address - 0xff80] = data;
    }
  }
  /**
   * Writes the provided word to the address
   */
  public writeWord(address: word, data: word): void {
    this.writeByte(address, lower(data));
    this.writeByte(address + 1, upper(data));
  }
  /**
   * Return the byte at the address as a number
   */
  public readByte(address: word): byte {
    if (this.inBios) {
      if (address <= 0xff) {
        return this.bios[address];
      } else {
        this.inBios = false;
      }
    }
    if (address < 0x4000) {
      // ROM Bank 0 is always available
      return this.cart.ROM[address];
    } else if (address <= 0x7fff) {
      // Reading from ROM bank of cartridge
      return this.cart.ROM[address];
    } else if (address <= 0x9fff) {
      return this.vRAM[address - 0x8000];
    } else if (address <= 0xbfff) {
      // reading from RAM bank of cartridge
      return this.cart.RAMBanks[this.cart.R.currRAMBank][address - 0xa000];
    } else if (address <= 0xdfff) {
      return this.wRAM[address - 0xc000];
    } else if (address <= 0xfdff) {
      return this.wRAMShadow[address - 0xe000];
    } else if (address <= 0xfe9f) {
      return this.OAM[address - 0xfe00];
    } else if (address <= 0xfeff) {
      throw new Error('Use of this area is prohibited.');
    } else if (address <= 0xff7f) {
      // reset scanline if trying to write to associated register
      if (address === 0xff44) {
        this.IORAM[address - 0xff00] = 0;
      }
      // hardware I/O
      return this.IORAM[address - 0xff00];
    } else if (address <= 0xffff) {
      return this.hRAM[address - 0xff80];
    }
    throw new Error(`Tried to read out of bounds address: ${toHex(address)}.`);
  }
  /**
   * Return the word at the address
   */
  public readWord(address: word): word {
    return this.readByte(address) | (this.readByte(address + 1) << 8);
  }

  /**
   * Changes the ROM/RAM banks and associated registers
   */
  private changeBank(address: word, data: byte): void {
    if (address < 0x2000) {
      // RAM enable register
      this.cart.R.RAMEnabled = (data & 0b00001111) === 0xa;
    } else if (address < 0x4000) {
      // ROM Bank change (only the lower 5 bits)
      this.cart.R.currROMBank = data & 0b00011111;
    } else if (address < 0x6000) {
      const register = data & 0b11;
      this.cart.R.ROMRAMMixed = register;
      // swap to one of the four RAM banks if size is 32kB
      if (this.cart.RAMSize >= 0x03) {
        this.cart.R.currRAMBank = register;
      }
      if (this.cart.R.bankingMode === 0 && this.cart.ROMSize >= 0x05) {
        // for 1MB ROM or larger carts, set upper 2 bits (5-6) of ROM bank number
        const {currROMBank} = this.cart.R;
        this.cart.R.currROMBank = currROMBank | (register << 4);
      }
      // for 1MB ROM multi carts, apply same operation but only to bits 4-5
    } else {
      // Banking mode select
      this.cart.R.bankingMode = data & 0x01;
    }
  }
  /**
   * Loads parsed files into BIOS/ROM
   */
  public load(bios: Uint8Array | null, rom: Uint8Array): void {
    this.cart.ROM = rom;
    this.cart.MBCType = this.readByte(0x147);
    this.cart.ROMSize = this.readByte(0x148);
    this.cart.RAMSize = this.readByte(0x149);
    console.log(
      `ROM Size: $${JSON.stringify(ROMSizeCodes[this.cart.ROMSize])}`
    );
    console.log(`RAM Size: ${RAMSizeCodes[this.cart.RAMSize]}`);
    console.log(`Cartridge Type: ${CartridgeTypes[this.cart.MBCType]}`);

    if (this.cart.MBCType === 0) {
      // MBC 0x00
    } else {
      console.log(`No support for MBC ${toHex(this.cart.MBCType)}.`);
    }
    console.log('Loaded file into ROM memory.');
    if (bios) {
      this.bios = bios;
      this.inBios = true;
    }
    console.log('Loaded bios.');
  }
}

export default new Memory();
