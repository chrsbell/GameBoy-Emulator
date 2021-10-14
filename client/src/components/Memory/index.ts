import CPU from 'CPU/index';
import {DEBUG, Primitive} from 'helpers/index';
import PPU from 'PPU/index';
import Cartridge from './Cartridge';
import MBC0 from './Cartridge/MBC0';
import MBC1 from './Cartridge/MBC1';
import PPUBridge from './PPUBridge';

class Memory {
  private ppuBridge!: PPUBridge;
  private bios: ByteArray = [];
  public inBios = false;
  private ppu!: PPU;
  public cart!: Cartridge;
  public ram: ByteArray = [];
  public static addresses = {
    interrupt: {
      ie: 0xffff,
      if: 0xff0f,
    },
    ppu: {
      lcdc: 0xff40,
      stat: 0xff41,
      scrollY: 0xff42,
      scrollX: 0xff43,
      scanline: 0xff44,
      scanlineCompare: 0xff45,
      dma: 0xff46,
      paletteData: 0xff47,
      windowY: 0xff4a,
      windowX: 0xff4b,
    },
  };
  constructor(ppuBridge: PPUBridge) {
    this.ppuBridge = ppuBridge;
    this.reset();
  }
  reset(): void {
    this.bios = [];
    this.inBios = false;
    this.ram = new Uint8Array(0x10000);
    this.cart?.reset();
  }
  public writeByte = (address: word, data: byte): void => {
    if (this.inBios && address <= 0xff) return;
    if (address <= 0x7fff) {
      this.cart.handleRegisterChanges(address, data);
    } else if (address <= 0x9fff) {
      // VRAM and update tiles
      this.ram[address] = data;
      this.ppuBridge.updateTiles(address, data);
    } else if (address <= 0xbfff) {
      this.cart.handleRegisterChanges(address, data);
    } else if (address <= 0xdfff) {
      this.ram[address] = data;
      // WRAM / write shadow RAM
      if (address <= 0xddff) this.ram[address + 0x1000] = data;
    } else if (address <= 0xfdff) {
      // error(`Can't write to prohibited address ${Primitive.toHex(address)}.`);
    } else if (address <= 0xfe9f) {
      // OAM
      this.ram[address] = data;
    } else if (address <= 0xfeff) {
      // error(`Can't write to prohibited address ${Primitive.toHex(address)}.`);
    } else if (address <= 0xff7f) {
      // I/O
      this.ppuBridge.writeIORam(address, data);
    } else if (address <= 0xffff) {
      // HRAM + IE Register
      this.ram[address] = data;
    }
  };
  public writeWord = (address: word, data: word): void => {
    this.writeByte(address & 0xffff, data & 0xff);
    this.writeByte((address + 1) & 0xffff, data >> 8);
  };
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
      // Cartridge ROM bank 0
      return this.cart.rom[address];
    } else if (address <= 0x7fff) {
      // Cartridge ROM bank
      return this.cart.romBanks[this.cart.currROMBank][address - 0x4000];
    } else if (address <= 0x9fff) {
      // VRAM
      return this.ram[address];
    } else if (address <= 0xbfff) {
      // Cartridge RAM bank
      return this.cart.ramBanks[this.cart.currRAMBank - 1][address - 0xa000];
    } else if (address <= 0xfe9f) {
      // Sprite attribute table (OAM)
      return this.ram[address];
    } else if (address <= 0xfeff) {
      // throw new Error('Use of this area is prohibited.');
    } else if (address <= 0xffff) {
      // I/O + HRAM + IE Register
      return this.ram[address];
    }
    return 0;
  };
  public readWord = (address: word): word => {
    return (
      this.readByte(address) | (this.readByte((address + 1) & 0xffff) << 8)
    );
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
  public load = (cpu: CPU, bios: ByteArray, rom: ByteArray): void => {
    const mbcType = rom[0x147];
    const romSizeCode = rom[0x148];
    const ramSizeCode = rom[0x149];
    this.initializeCart(rom, mbcType, romSizeCode, ramSizeCode);

    if (bios?.length === 0x100) {
      this.bios = bios;
      this.inBios = true;
      cpu.execute = cpu.executeBios;
      // cpu.initPowerSequence();
      DEBUG && console.log('Loaded bios.');
    } else {
      this.inBios = false;
    }
  };
  /**
   * Adds extra ROM and RAM banks according to the MBC type.
   */
  private initializeCart(
    rom: ByteArray,
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
        if (DEBUG)
          console.log(`No support for MBC ${Primitive.toHex(mbcType)}.`);
        break;
    }
  }
}

export default Memory;
