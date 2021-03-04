import type { byte, word } from '../Types';
import { ByteArray, toByte, addByte } from '../Types';

interface CartridgeCode {
  [key: number]: string;
}

interface ROMCode {
  [key: number]: { size: string; numBanks: number };
}

const ROMSizeCodes: ROMCode = {
  0x00: { size: '32kB', numBanks: 2 },
  0x01: { size: '64kB', numBanks: 4 },
  0x02: { size: '128kB', numBanks: 8 },
  0x03: { size: '256kB', numBanks: 16 },
  0x04: { size: '512kB', numBanks: 32 },
  0x05: { size: '1MB', numBanks: 64 },
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
  ROM: ByteArray;
  // the ROM size code
  ROMSize: byte;
  // external RAM size code
  RAMSize: byte;
  // the MBC type code
  MBCType: byte;
  // each ROM Bank is 16kB
  ROMBanks: Array<ByteArray>;
  // 4 banks for 32kB RAM sizes
  // https://gbdev.io/pandocs/#a000-bfff-ram-bank-00-03-if-any-read-write
  RAMBanks: Array<ByteArray>;
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
  private bios: ByteArray;
  // whether bios execution has finished
  public inBios: boolean = false;
  private cart: Cartridge;
  // 8k vRAM
  private vRAM: ByteArray;
  // 8k internal RAM
  private wRAM: ByteArray;
  // shadow of working RAM, (8k - 512) bytes
  private wRAMShadow: ByteArray;
  // sprite attribute table
  private OAM: ByteArray;
  // 126 bytes high RAM
  private hRAM: ByteArray;
  private initialized: boolean = false;
  public constructor() {
    this.vRAM = new ByteArray(0x9fff - 0x8000);
    this.wRAM = new ByteArray(0xdfff - 0xc000);
    this.wRAMShadow = new ByteArray(0xfdff - 0xe000);
    this.OAM = new ByteArray(0xfe9f - 0xfe00);
    this.hRAM = new ByteArray(0xfffe - 0xff80);
    // defaults to bank 1 at power on
    this.cart = {
      ROM: null as ByteArray,
      ROMSize: toByte(0),
      RAMSize: toByte(0),
      MBCType: toByte(0),
      ROMBanks: null as Array<ByteArray>,
      RAMBanks: null as Array<ByteArray>,
      R: {
        RAMEnabled: false,
        currROMBank: toByte(1),
        currRAMBank: toByte(1),
        ROMRAMMixed: toByte(0),
        bankingMode: toByte(0),
      },
    };
    this.cart.R.currROMBank = toByte(1);
  }
  /**
   * Writes the provided byte to the address
   */
  public writetoByte(address: number, data: byte) {
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
      if (this.cart.MBCType === 0) {
        this.cart.ROM[address] = data;
      }
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
    } else if (address <= 0xffff) {
      this.hRAM[address - 0xff80] = data;
    }
  }
  /**
   * Writes the provided word to the address
   */
  public writeWord(address: number, data: Word) {
    this.writetoByte(address, data.lower());
    this.writetoByte(address + 1, data.upper());
  }
  /**
   * Return the byte at the address as a number
   */
  public readByte(address: number): number {
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
      if (this.cart.MBCType === 0) {
        return this.cart.ROM[address];
      }
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
    } else if (address <= 0xff7f) {
      // hardware I/O
    } else if (address <= 0xffff) {
      return this.hRAM[address - 0xff80];
    }
  }
  /**
   * Return the word at the address as a number
   */
  public readWord(address: number): number {
    return this.readByte(address) | (this.readByte(address + 1) << 8);
  }

  /**
   * Changes the ROM/RAM banks and associated registers
   */
  private changeBank(address: number, data: byte) {
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
        const { currROMBank } = this.cart.R;
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
  public load(bios: ByteArray, rom: ByteArray) {
    this.cart.ROM = rom;
    this.cart.MBCType = this.readByte(0x147);
    this.cart.ROMSize = this.readByte(0x148);
    this.cart.RAMSize = this.readByte(0x149);
    console.log(`ROM Size: $${JSON.stringify(ROMSizeCodes[this.cart.ROMSize])}`);
    console.log(`RAM Size: ${RAMSizeCodes[this.cart.RAMSize]}`);
    console.log(`Cartridge Type: ${CartridgeTypes[this.cart.MBCType]}`);

    if (this.cart.MBCType === 0) {
      // MBC 0x00
      this.initialized = true;
    } else {
      console.log(`No support for MBC ${this.cart.MBCType}.`);
    }
    console.log('Loaded file into ROM memory.');
    this.bios = bios;
    this.inBios = true;
    console.log('Loaded bios.');
  }
}

export default new Memory();
