import {DEBUG} from '../../helpers/Debug';
import benchmark, {benchmarksEnabled} from '../../helpers/Performance';
import type {byte, word} from '../../helpers/Primitives';
import {lower, toHex, upper} from '../../helpers/Primitives';
import CPU from '../CPU';
import Cartridge from './Cartridge';
import MBC0 from './Cartridge/MBC0';
import MBC1 from './Cartridge/MBC1';

class Memory {
  private bios!: Uint8Array;
  // whether bios execution has finished
  public inBios = false;
  public cart!: Cartridge;
  // 8k vRAM
  private _vRAM!: Uint8Array;
  public get vRAM(): Uint8Array {
    return this._vRAM;
  }
  public set vRAM(value: Uint8Array) {
    this._vRAM = value;
  }
  // 8k internal RAM
  private _wRAM!: Uint8Array;
  public get wRAM(): Uint8Array {
    return this._wRAM;
  }
  public set wRAM(value: Uint8Array) {
    this._wRAM = value;
  }
  // shadow of working RAM, (8k - 512) bytes
  private _wRAMShadow!: Uint8Array;
  public get wRAMShadow(): Uint8Array {
    return this._wRAMShadow;
  }
  public set wRAMShadow(value: Uint8Array) {
    this._wRAMShadow = value;
  }
  // sprite attribute table
  private _OAM!: Uint8Array;
  public get OAM(): Uint8Array {
    return this._OAM;
  }
  public set OAM(value: Uint8Array) {
    this._OAM = value;
  }
  // 126 bytes high RAM
  private _hRAM!: Uint8Array;
  public get hRAM(): Uint8Array {
    return this._hRAM;
  }
  public set hRAM(value: Uint8Array) {
    this._hRAM = value;
  }
  // 128 bytes io register space
  private _IORAM!: Uint8Array;
  public get IORAM(): Uint8Array {
    return this._IORAM;
  }
  public set IORAM(value: Uint8Array) {
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
  public constructor() {
    this.reset();
    if (benchmarksEnabled) {
      this.readByte = benchmark(this.readByte.bind(this), this);
      this.writeByte = benchmark(this.writeByte.bind(this), this);
    }
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
    this.cart?.reset();
  }
  /**
   * Writes the provided byte to the address
   */
  public writeByte(address: word, data: byte): void {
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
      this.wRAMShadow[address - 0xe000] = data;
      DEBUG && console.error(`Can't write to prohibited address.`);
    } else if (address <= 0xfe9f) {
      this.OAM[address - 0xfe00] = data;
    } else if (address <= 0xfeff) {
      console.log(toHex(address));
      DEBUG && console.error(`Can't write to prohibited address.`);
    } else if (address <= 0xff7f) {
      if (address === 0xff46) {
        DEBUG && console.log('Initiated DMA transfer.');
        this.dmaTransfer(data);
      }
      // reset scanline if trying to write to associated register
      else if (address === addresses.ppu.scanline) {
        this.IORAM[address - 0xff00] = 0;
      } else {
        this.IORAM[address - 0xff00] = data;
      }
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
    debugger;
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
      cpu.initPowerSequence(this);
    }
  }
  /**
   * Adds extra ROM and RAM banks according to the MBC type.
   */
  private initializeCart(
    rom: Uint8Array,
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
