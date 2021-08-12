import CPU from 'CPU/index';
import {DEBUG} from 'helpers/Debug';
import error from 'helpers/Error';
import Primitive from 'helpers/Primitives';
import PPU from 'PPU/index';
import Cartridge from './Cartridge';
import MBC0 from './Cartridge/MBC0';
import MBC1 from './Cartridge/MBC1';
import PPUBridge from './PPUBridge';

class Memory {
  private ppuBridge!: PPUBridge;
  private bios: ByteArray = [];
  // whether bios execution has finished
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
  private readMemoryHIOMap: NumFuncIdx = {
    0x00: (addr: word): byte => this.ram[addr],
    0x80: (addr: word): byte => this.ram[addr],
  };
  private readMemoryByteHMap: NumFuncIdx = {
    0x000: (addr: word): byte => this.ram[addr],
    0x100: (addr: word): byte => this.ram[addr],
    0x200: (addr: word): byte => this.ram[addr],
    0x300: (addr: word): byte => this.ram[addr],
    0x400: (addr: word): byte => this.ram[addr],
    0x500: (addr: word): byte => this.ram[addr],
    0x600: (addr: word): byte => this.ram[addr],
    0x700: (addr: word): byte => this.ram[addr],
    0x800: (addr: word): byte => this.ram[addr],
    0x900: (addr: word): byte => this.ram[addr],
    0xa00: (addr: word): byte => this.ram[addr],
    0xb00: (addr: word): byte => this.ram[addr],
    0xc00: (addr: word): byte => this.ram[addr],
    0xd00: (addr: word): byte => this.ram[addr],
    0xe00: (addr: word): byte => (addr <= 0xfe9f ? this.ram[addr - 0xfe00] : 0), //address >= 0xfea0 is techincally outside OAM memory, revisit this
    0xf00: (addr: word): byte => this.readMemoryHIOMap[addr & 0x80](addr),
  };
  private readMemoryByteMap: NumFuncIdx = {
    0x0000: (addr: word): byte => {
      if (this.inBios) {
        if (addr < 0x100) {
          return this.bios[addr];
        } else if (addr === 0x100) {
          this.inBios = false;
          DEBUG && console.log('Exited bios.');
        }
      }
      return this.cart.rom[addr];
    },
    0x1000: (addr: word): byte => this.cart.rom[addr],
    0x2000: (addr: word): byte => this.cart.rom[addr],
    0x3000: (addr: word): byte => this.cart.rom[addr],
    0x4000: (addr: word): byte =>
      this.cart.romBanks[this.cart.currROMBank][addr - 0x4000],
    0x5000: (addr: word): byte =>
      this.cart.romBanks[this.cart.currROMBank][addr - 0x4000],
    0x6000: (addr: word): byte =>
      this.cart.romBanks[this.cart.currROMBank][addr - 0x4000],
    0x7000: (addr: word): byte =>
      this.cart.romBanks[this.cart.currROMBank][addr - 0x4000],
    0x8000: (addr: word): byte => this.ram[addr],
    0x9000: (addr: word): byte => this.ram[addr],
    0xa000: (addr: word): byte =>
      this.cart.ramBanks[this.cart.currRAMBank][addr - 0xa000],
    0xb000: (addr: word): byte =>
      this.cart.ramBanks[this.cart.currRAMBank][addr - 0xa000],
    0xc000: (addr: word): byte => this.ram[addr],
    0xd000: (addr: word): byte => this.ram[addr],
    0xf000: (addr: word): byte => {
      const hAddr = addr & 0xf00;
      return this.readMemoryByteHMap[hAddr](addr);
    },
  };
  constructor(ppuBridge: PPUBridge) {
    this.ppuBridge = ppuBridge;
    this.reset();
  }
  /**
   * Resets the Memory module.
   */
  reset(): void {
    this.bios = [];
    this.inBios = false;
    this.ram = new Uint8Array(0xffff);
    this.cart?.reset();
  }
  /**
   * Writes the provided byte to the address
   */
  public writeByte = (address: word, data: byte): void => {
    if (this.inBios && address <= 0xff) return;
    if (address <= 0x7fff) {
      this.cart.handleRegisterChanges(address, data);
      // write to ROM bank of cartridge
      // this.cartOMBanks[this.cart.currROMBank - 1][address - 0x4000] = data;
    } else if (address <= 0x9fff) {
      this.ram[address] = data;
      this.ppuBridge.updateTiles(address, data);
    } else if (address <= 0xbfff) {
      this.cart.handleRegisterChanges(address, data);
    } else if (address <= 0xdfff) {
      this.ram[address] = data;
      // write to shadow ram
      // if (address <= 0xddff) this.ram[address + 0x1000] = data;
    } else if (address <= 0xfdff) {
      error(`Can't write to prohibited address ${Primitive.toHex(address)}.`);
    } else if (address <= 0xfe9f) {
      this.ram[address] = data;
    } else if (address <= 0xfeff) {
      error(`Can't write to prohibited address ${Primitive.toHex(address)}.`);
    } else if (address <= 0xff7f) {
      this.ppuBridge.writeIORam(address, data);
    } else if (address <= 0xffff) {
      this.ram[address] = data;
    }
  };
  /**
   * Writes the provided word to the address
   */
  public writeWord = (address: word, data: word): void => {
    this.writeByte(address, Primitive.lower(data));
    this.writeByte(address + 1, Primitive.upper(data));
  };
  /**
   * Return the byte at the address as a number
   */
  public readByte = (address: word): byte => {
    return this.readMemoryByteMap[address & 0xf000](address);
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
      return this.cart.romBanks[this.cart.currROMBank][address - 0x4000];
    } else if (address <= 0x9fff) {
      return this.ram[address];
    } else if (address <= 0xbfff) {
      // reading from RAM bank of cartridge
      return this.cart.ramBanks[this.cart.currRAMBank - 1][address - 0xa000];
    } else if (address <= 0xfe9f) {
      return this.ram[address];
    } else if (address <= 0xfeff) {
      throw new Error('Use of this area is prohibited.');
    } else if (address <= 0xffff) {
      return this.ram[address];
    }
    throw new Error(
      `Tried to read out of bounds address: ${Primitive.toHex(address)}.`
    );
  };
  /**
   * Return the word at the address
   */
  public readWord = (address: word): word => {
    return this.readByte(address) | (this.readByte(address + 1) << 8);
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
