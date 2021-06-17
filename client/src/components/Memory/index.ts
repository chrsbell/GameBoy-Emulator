import {DEBUG} from '../../helpers/Debug';
import error from '../../helpers/Error';
import benchmark, {benchmarksEnabled} from '../../helpers/Performance';
import type {byte, word} from '../../helpers/Primitives';
import {lower, toHex, upper} from '../../helpers/Primitives';
import CPU from '../CPU';
import Cartridge from './Cartridge';
import MBC0 from './Cartridge/MBC0';
import MBC1 from './Cartridge/MBC1';

export type byteArray = Uint8Array | Array<byte>;

class Memory {
  private bios: byteArray = [];
  // whether bios execution has finished
  public inBios = false;
  public cart!: Cartridge;
  // 8k vRAM
  private _vRAM: byteArray = [];
  get vRAM(): byteArray {
    return this._vRAM;
  }
  set vRAM(value: byteArray) {
    this._vRAM = value;
  }
  // 8k internal RAM
  private _wRAM: byteArray = [];
  get wRAM(): byteArray {
    return this._wRAM;
  }
  set wRAM(value: byteArray) {
    this._wRAM = value;
  }
  // shadow of working RAM, (8k - 512) bytes
  private _wRAMShadow: byteArray = [];
  get wRAMShadow(): byteArray {
    return this._wRAMShadow;
  }
  set wRAMShadow(value: byteArray) {
    this._wRAMShadow = value;
  }
  // sprite attribute table
  private _OAM: byteArray = [];
  get OAM(): byteArray {
    return this._OAM;
  }
  set OAM(value: byteArray) {
    this._OAM = value;
  }
  // 126 bytes high RAM
  private _hRAM: byteArray = [];
  get hRAM(): byteArray {
    return this._hRAM;
  }
  set hRAM(value: byteArray) {
    this._hRAM = value;
  }
  // 128 bytes io register space
  private _IORAM: byteArray = [];
  get ioRAM(): byteArray {
    return this._IORAM;
  }
  set ioRAM(value: byteArray) {
    this._IORAM = value;
  }
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
  constructor() {
    this.reset();
    if (benchmarksEnabled) {
      this.readByte = benchmark(this.readByte.bind(this), this);
      this.writeByte = benchmark(this.writeByte.bind(this), this);
    }
  }
  /**
   * Resets the Memory module.
   */
  reset(): void {
    this.bios = [];
    this.inBios = false;
    this.vRAM = new Uint8Array(0x9fff - 0x8000 + 1);
    this.wRAM = new Uint8Array(0xdfff - 0xc000 + 1);
    this.wRAMShadow = new Uint8Array(0xfdff - 0xe000 + 1);
    this.OAM = new Uint8Array(0xfe9f - 0xfe00 + 1);
    this.hRAM = new Uint8Array(0xfffe - 0xff80 + 1);
    this.ioRAM = new Uint8Array(0xff7f - 0xff00 + 1);
    this.cart?.reset();
  }
  /**
   * Writes the provided byte to the address
   */
  public writeByte = (address: word, data: byte): void => {
    if (this.inBios && address <= 0xff) return;
    const {addresses} = this;
    if (address <= 0x7fff) {
      this.cart.handleRegisterChanges(address, data);
      // write to ROM bank of cartridge
      // this.cartOMBanks[this.cart.currROMBank - 1][address - 0x4000] = data;
    } else if (address <= 0x9fff) {
      this.vRAM[address - 0x8000] = data;
    } else if (address <= 0xbfff) {
      this.cart.handleRegisterChanges(address, data);
    } else if (address <= 0xdfff) {
      this.wRAM[address - 0xc000] = data;
    } else if (address <= 0xfdff) {
      error(`Can't write to prohibited address ${toHex(address)}.`);
    } else if (address <= 0xfe9f) {
      this.OAM[address - 0xfe00] = data;
    } else if (address <= 0xfeff) {
      error(`Can't write to prohibited address ${toHex(address)}.`);
    } else if (address <= 0xff7f) {
      if (address === 0xff46) {
        DEBUG && console.log('Initiated DMA transfer.');
        this.dmaTransfer(data);
      }
      // reset scanline if trying to write to associated register
      let ioByte = data;
      if (address === addresses.ppu.scanline) {
        ioByte = 0;
      }
      this.ioRAM[address - 0xff00] = ioByte;
    } else if (address <= 0xffff) {
      this.hRAM[address - 0xff80] = data;
    }
  };
  /**
   * Writes the provided word to the address
   */
  public writeWord = (address: word, data: word): void => {
    this.writeByte(address, lower(data));
    this.writeByte(address + 1, upper(data));
  };
  /**
   * Return the byte at the address as a number
   */
  public readByte = (address: word): byte => {
    if (this.inBios) {
      if (address < 0x100) {
        return this.bios[address];
      } else if (address === 0x100) {
        this.inBios = false;
        DEBUG && console.log('Exited bios.');
      }
    }

    if (address < 0x4000) {
      return this.cart.rom[address];
    } else if (address <= 0x7fff) {
      return this.cart.romBanks[this.cart.currROMBank - 1][address - 0x4000];
    } else if (address <= 0x9fff) {
      return this.vRAM[address - 0x8000];
    } else if (address <= 0xbfff) {
      // reading from RAM bank of cartridge
      return this.cart.ramBanks[this.cart.currRAMBank - 1][address - 0xa000];
    } else if (address <= 0xdfff) {
      return this.wRAM[address - 0xc000];
    } else if (address <= 0xfdff) {
      return this.wRAMShadow[address - 0xe000];
    } else if (address <= 0xfe9f) {
      return this.OAM[address - 0xfe00];
    } else if (address <= 0xfeff) {
      throw new Error('Use of this area is prohibited.');
    } else if (address <= 0xff7f) {
      // hardware I/O
      return this.ioRAM[address - 0xff00];
    } else if (address <= 0xffff) {
      return this.hRAM[address - 0xff80];
    }
    throw new Error(`Tried to read out of bounds address: ${toHex(address)}.`);
  };
  /**
   * Return the word at the address
   */
  public readWord = (address: word): word => {
    return this.readByte(address) | (this.readByte(address + 1) << 8);
  };
  /**
   * Used internally by the PPU/lCD to update the current scanline.
   */
  public updateScanline = (scanline: byte): void => {
    this.ioRAM[0xff44 - 0xff00] = scanline;
  };
  /**
   * Performs direct memory address transfer of sprite data.
   * Pretty much copied from http://www.codeslinger.co.uk/pages/projects/gameboy/dma.html
   */
  public dmaTransfer = (data: byte): void => {
    const address = data << 8;
    for (let i = 0; i < 0xa0; i++) {
      this.writeByte(0xfe00 + i, this.readByte(address + i));
    }
  };
  /**
   * Loads parsed files into BIOS/ROM
   */
  public load = (cpu: CPU, bios: byteArray, rom: byteArray): void => {
    const mbcType = rom[0x147];
    const romSizeCode = rom[0x148];
    const ramSizeCode = rom[0x149];
    this.initializeCart(rom, mbcType, romSizeCode, ramSizeCode);

    if (bios?.length === 0x100) {
      this.bios = bios;
      this.inBios = true;
      DEBUG && console.log('Loaded bios.');
    } else {
      this.inBios = false;
    }
  };
  /**
   * Adds extra ROM and RAM banks according to the MBC type.
   */
  private initializeCart(
    rom: byteArray,
    mbcType: number,
    romSizeCode: byte,
    ramSizeCode: byte
  ): void {
    switch (mbcType) {
      case 0:
        this.cart = new MBC0(this, rom, mbcType, romSizeCode, ramSizeCode);
        break;
      case 1:
        this.cart = new MBC1(this, rom, mbcType, romSizeCode, ramSizeCode);
        break;
      default:
        if (DEBUG) console.log(`No support for MBC ${toHex(mbcType)}.`);
        break;
    }
  }
}

export default Memory;
