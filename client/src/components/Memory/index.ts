import {DEBUG} from '../../helpers/Debug';
import benchmark, {benchmarksEnabled} from '../../helpers/Performance';
import type {byte, word} from '../../helpers/Primitives';
import {lower, toHex, upper} from '../../helpers/Primitives';
import CPU from '../CPU';

interface CartridgeCode {
  [key: number]: string;
}

interface SizeCode {
  [key: number]: {size: number; numBanks: number};
}

const ROMSizeCodeMap: SizeCode = {
  0x00: {size: 32768, numBanks: 2},
  0x01: {size: 65536, numBanks: 4},
  0x02: {size: 131072, numBanks: 8},
  0x03: {size: 262144, numBanks: 16},
  0x04: {size: 524288, numBanks: 32},
  0x05: {size: 1024000, numBanks: 64},
};

const RAMSizeCodeMap: SizeCode = {
  0x00: {size: 0, numBanks: 0},
  0x01: {size: 2048, numBanks: 1},
  0x02: {size: 8192, numBanks: 1},
  0x03: {size: 32768, numBanks: 4},
  0x04: {size: 131072, numBanks: 16},
  0x05: {size: 65536, numBanks: 8},
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

interface Cartridge {
  // entire cartridge ROM
  ROM: Uint8Array;
  // the ROM size code
  ROMSizeCode: byte;
  // external RAM size code
  RAMSizeCode: byte;
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
  public addresses = {
    ppu: {
      lcdc: 0xff40,
      stat: 0xff41,
      scrollY: 0xff42,
      scrollX: 0xff43,
      scanline: 0xff44,
      scanlineCompare: 0xff45,
      paletteData: 0xff47,
      windowY: 0xff4a,
      windowX: 0xff4b,
    },
  };
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
    this.cart = {
      ROM: null!,
      ROMSizeCode: 0,
      RAMSizeCode: 0,
      MBCType: 0,
      ROMBanks: [],
      RAMBanks: [],
      R: {
        RAMEnabled: false,
        currROMBank: 1,
        currRAMBank: 1,
        ROMRAMMixed: 0,
        bankingMode: 0,
      },
    };
    if (benchmarksEnabled) {
      this.readByte = benchmark(this.readByte.bind(this), this);
      this.writeByte = benchmark(this.writeByte.bind(this), this);
    }
  }
  /**
   * Writes the provided byte to the address
   */
  public writeByte(address: word, data: byte): void {
    if (this.inBios && address <= 0xff) return;
    const writeAddress = this.inBios ? address : address;
    const {RAMSizeCode, ROMSizeCode} = this.cart;
    const {addresses} = this;
    if (address < 0x4000) {
      // ROM Bank 0 is always available
      if (address <= 0x1fff) {
        // RAM enable/disable
        this.cart.R.RAMEnabled = (data & 0b1111) === 0xa;
      } else if (address <= 0x3fff) {
        // ROM bank change, map new rom bank to bit mask defining number of banks
        this.cart.R.currROMBank &= 0b1100000;
        this.cart.R.currROMBank = ROMSizeCodeMap[ROMSizeCode].numBanks - 1;
        if (!this.cart.R.currROMBank) this.cart.R.currROMBank = 1;
      }
      this.cart.ROM[writeAddress] = data;
    } else if (address <= 0x7fff) {
      if (address <= 0x5fff) {
        // used to select RAM bank in 32kb RAM carts
        this.cart.R.ROMRAMMixed = data & 0b11;
        if (this.cart.R.bankingMode === 1 && RAMSizeCode === 3) {
          this.cart.R.currRAMBank = this.cart.R.ROMRAMMixed;
        } else if (ROMSizeCode >= 0x05) {
          // select bits 5-6 of ROM bank
          this.cart.R.currROMBank &= 1100000;
          this.cart.R.currROMBank |= (data & 0b11) << 5;
        }
      } else {
        // banking mode select
        this.cart.R.bankingMode = data & 1;
        if (this.cart.R.bankingMode === 1 && this.cart.R.RAMEnabled) {
          // immediately set new RAM bank if RAM banking enabled
          this.cart.R.currRAMBank = this.cart.R.ROMRAMMixed;
        }
      }
      // write to ROM bank of cartridge
      this.cart.ROMBanks[this.cart.R.currROMBank - 1][
        writeAddress - 0x4000
      ] = data;
    } else if (address <= 0x9fff) {
      this.vRAM[writeAddress - 0x8000] = data;
    } else if (address <= 0xbfff) {
      // write to RAM bank of cartridge
      this.cart.RAMBanks[this.cart.R.currRAMBank - 1][
        writeAddress - 0xa000
      ] = data;
    } else if (address <= 0xdfff) {
      this.wRAM[writeAddress - 0xc000] = data;
    } else if (address <= 0xfdff) {
      this.wRAMShadow[writeAddress - 0xe000] = data;
      // DEBUG && console.error(`Can't write to prohibited address.`);
    } else if (address <= 0xfe9f) {
      this.OAM[writeAddress - 0xfe00] = data;
    } else if (address <= 0xfeff) {
      console.log(toHex(writeAddress));
      // DEBUG && console.error(`Can't write to prohibited address.`);
    } else if (address <= 0xff7f) {
      // hardware I/O
      // if (address === 0xff42) console.log(`scrollY: ${data}`);
      // if (address === 0xff43) console.log(`scrollX: ${data}`);

      if (address === 0xff46) {
        DEBUG && console.log('Initiated DMA transfer.');
        this.dmaTransfer(data);
      }
      // reset scanline if trying to write to associated register
      else if (address === addresses.ppu.scanline) {
        this.IORAM[writeAddress - 0xff00] = 0;
      } else {
        this.IORAM[writeAddress - 0xff00] = data;
      }
    } else if (address <= 0xffff) {
      this.hRAM[writeAddress - 0xff80] = data;
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
      if (address < 0x100) {
        return this.bios[address];
      } else if (address === 0x100) {
        this.inBios = false;
        DEBUG && console.log('Exited bios.');
      }
    }
    const readAddress = this.inBios ? address : address;

    if (address < 0x4000) {
      // ROM Bank 0 is always available
      return this.cart.ROM[readAddress];
    } else if (address <= 0x7fff) {
      // Reading from ROM bank of cartridge
      return this.cart.ROMBanks[this.cart.R.currROMBank - 1][
        readAddress - 0x4000
      ];
    } else if (address <= 0x9fff) {
      return this.vRAM[readAddress - 0x8000];
    } else if (address <= 0xbfff) {
      // reading from RAM bank of cartridge
      return this.cart.RAMBanks[this.cart.R.currRAMBank - 1][
        readAddress - 0xa000
      ];
    } else if (address <= 0xdfff) {
      return this.wRAM[readAddress - 0xc000];
    } else if (address <= 0xfdff) {
      return this.wRAMShadow[readAddress - 0xe000];
    } else if (address <= 0xfe9f) {
      return this.OAM[readAddress - 0xfe00];
    } else if (address <= 0xfeff) {
      // throw new Error('Use of this area is prohibited.');
    } else if (address <= 0xff7f) {
      // hardware I/O
      return this.IORAM[readAddress - 0xff00];
    } else if (address <= 0xffff) {
      return this.hRAM[readAddress - 0xff80];
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
      if (this.cart.RAMSizeCode >= 0x03) {
        this.cart.R.currRAMBank = register;
      }
      if (this.cart.R.bankingMode === 0 && this.cart.ROMSizeCode >= 0x05) {
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
   * Used internally by the PPU/lCD to update the current scanline.
   */
  public updateScanline(scanline: byte): void {
    this.IORAM[0xff44 - 0xff00] = scanline;
  }
  /**
   * Performs direct memory address transfer of sprite data.
   * Pretty much copied from http://www.codeslinger.co.uk/pages/projects/gameboy/dma.html
   */
  public dmaTransfer(data: byte): void {
    const address = data << 8;
    for (let i = 0; i < 0xa0; i++) {
      this.writeByte(0xfe00 + i, this.readByte(address + i));
    }
  }
  /**
   * Loads parsed files into BIOS/ROM
   */
  public load(cpu: CPU, bios: Uint8Array | null, rom: Uint8Array): void {
    this.cart.ROM = rom;
    debugger;
    this.cart.MBCType = this.readByte(0x147);
    this.cart.ROMSizeCode = this.readByte(0x148);
    this.cart.RAMSizeCode = this.readByte(0x149);
    this.initializeBanks();
    if (DEBUG) {
      console.log('ROM Size:');
      console.dir(ROMSizeCodeMap[this.cart.RAMSizeCode]);
      console.log('RAM Size:');
      console.dir(RAMSizeCodeMap[this.cart.RAMSizeCode]);
      console.log(`Cartridge Type: ${CartridgeTypes[this.cart.MBCType]}`);
      if (this.cart.MBCType > 1) {
        console.log(`No support for MBC ${toHex(this.cart.MBCType)}.`);
      }
      console.log('Loaded file into ROM memory.');
    }
    if (bios?.length) {
      this.bios = bios;
      this.inBios = true;
      DEBUG && console.log('Loaded bios.');
    } else {
      this.inBios = false;
      cpu.initPowerSequence(this);
    }
  }
  /**
   * Adds extra ROM and RAM banks according to the MBC type.
   */
  private initializeBanks(): void {
    let {MBCType, ROMSizeCode, RAMSizeCode} = this.cart;
    switch (MBCType) {
      case 1:
        // default to ROM bank 1 on load
        this.cart.R.currROMBank = 1;
        // skip first bank, which is already mapped in ROM
        const numROMBanks = ROMSizeCodeMap[ROMSizeCode].numBanks - 1;
        this.cart.ROMBanks = new Array(numROMBanks);
        for (let i = 0; i < numROMBanks; i += 0x4000) {
          this.cart.ROMBanks[i] = new Uint8Array(
            this.cart.ROM.slice((i + 1) * 0x4000, (i + 2) * 0x4000)
          );
        }
        const numRAMBanks = RAMSizeCodeMap[RAMSizeCode].numBanks;
        const RAMSize = RAMSizeCodeMap[RAMSizeCode].size;
        this.cart.RAMBanks = new Array(numRAMBanks);
        if (numRAMBanks) {
          // only one possible combination, 4 banks of 32kb
          for (let i = 0; i < 4; i++) {
            this.cart.RAMBanks[i] = new Uint8Array(RAMSize);
          }
        } else {
          this.cart.RAMBanks[0] = new Uint8Array(RAMSize);
        }
        break;
      default:
        // MBC 0
        this.cart.RAMBanks = new Array(1);
        this.cart.RAMBanks[0] = new Uint8Array(0x2000);
        this.cart.ROMBanks = new Array(1);
        this.cart.ROMBanks[0] = new Uint8Array(
          this.cart.ROM.slice(0x4000, 0x8000)
        );
        break;
    }
  }
}

export default Memory;
