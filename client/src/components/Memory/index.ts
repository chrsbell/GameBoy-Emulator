import CPU from 'CPU/index';
import {DEBUG, Primitive} from 'helpers/index';
import {PPU} from 'PPU/index';
import {Timing} from 'Timing/index';
import Cartridge from './Cartridge';
import MBC0 from './Cartridge/MBC0';
import MBC1 from './Cartridge/MBC1';

class Memory {
  private bios: ByteArray = [];
  public inBios = false;
  private ppu!: PPU;
  public timing!: Timing;
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

  constructor() {
    this.reset();
  }

  public init = (ppu: PPU, timing: Timing): void => {
    this.ppu = ppu;
    this.timing = timing;
  };

  public reset = (): void => {
    this.bios = [];
    this.inBios = false;
    this.ram = new Uint8Array(0x10000);
    this.cart?.reset();
  };

  public updateTiles = (address: word, data: byte): void => {
    // each tile (384 tiles) takes up 16 bytes in vram (range 0x8000 to 0x97ff). each tile is 8x8 pixels. A horizontal row of 8 pixels can be represented using 2 bytes, where the first byte contains the least sig bit of the color ID for each pixel. The second byte contains the most sig bit of the color ID.

    // https://www.huderlem.com/demos/gameboy2bpp.html

    // writing to tile data in vram
    if (address < 0x9800) {
      // using the 2bpp system, the low byte must be on an even address
      // 00000000 -> 0
      // 11111111 -> 1
      if (address % 2 === 1) address -= 1;
      const lowByte = this.readByte(address);
      const highByte = this.readByte(address + 1);
      const tileIndex = (address & 0x1fff) >> 4;
      const y = (address >> 1) & 7;

      let lowBit: bit;
      let highBit: bit;
      let data: word = 0;

      // store scanline by interlacing high/low bits of 8 pixels
      for (let x = 7; x >= 0; x--) {
        lowBit = (lowByte >> x) & 1;
        highBit = (highByte >> x) & 1;
        data |= lowBit << (x * 2);
        data |= highBit << (x * 2 + 1);
      }
      this.ppu.tileData[tileIndex][y] = data;
    } else if (address <= 0x9bff) {
      // store unsigned and signed indices
      this.ppu.tileMap[0][address - 0x9800] = data;
      this.ppu.signedTileMap[0][address - 0x9800] =
        data <= 0x7f ? data + 0x100 : data;
    } else {
      this.ppu.tileMap[1][address - 0x9c00] = data;
      this.ppu.signedTileMap[1][address - 0x9c00] =
        data <= 0x7f ? data + 0x100 : data;
    }
  };

  public writeByte = (address: word, data: byte): void => {
    if (this.inBios && address <= 0xff) return;
    if (address <= 0x7fff) {
      this.cart.handleRegisterChanges(address, data);
    } else if (address <= 0x9fff) {
      // VRAM and update tiles
      this.ram[address] = data;
      this.updateTiles(address, data);
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
      // Timer stuff
      if (address === 0xff04) {
        // writing to divider will reset it
        this.timing.divider = 0;
      } else if (address === 0xff05) {
        this.timing.timerCounter = data;
      } else if (address === 0xff06) {
        this.timing.timerModulo = data;
      } else if (address === 0xff07) {
        this.timing.timerControl = data;
      } else {
        // I/O + IE Register
        this.writeGraphicsData(address, data);
      }
    } else {
      // HRAM
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

  public dmaTransfer = (data: byte): void => {
    const address = data * 0x100;
    for (let i = 0; i < 0xa0; i++) {
      this.writeByte(0xfe00 + i, this.ram[address + i]);
    }
  };
  /**
   * Loads parsed files into BIOS/ROM
   */
  public load = (cpu: CPU, bios: ByteArray | null, rom: ByteArray): void => {
    const mbcType = rom[0x147];
    const romSizeCode = rom[0x148];
    const ramSizeCode = rom[0x149];
    this.initializeCart(rom, mbcType, romSizeCode, ramSizeCode);

    if (bios?.length === 0x100) {
      this.bios = bios;
      this.inBios = true;
      cpu.execute = cpu.executeBios;
      DEBUG && console.log('Loaded bios.');
    } else {
      this.inBios = false;
      cpu.initPowerSequence();
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
  public writeGraphicsData = (address: word, data: byte): void => {
    if (address === Memory.addresses.ppu.stat) {
      this.ppu.stat.update(data);
      return;
    } else if (address === Memory.addresses.ppu.lcdc)
      this.ppu.lcdc.update(data);
    else if (address === Memory.addresses.ppu.scrollY) {
      this.ppu.scrollY = data;
    } else if (address === Memory.addresses.ppu.scrollX) {
      this.ppu.scrollX = data;
    }
    // reset scanline if trying to write to associated register
    else if (address === Memory.addresses.ppu.scanline) {
      this.ppu.resetScanline();
      return;
    } else if (address === Memory.addresses.ppu.scanlineCompare)
      this.ppu.scanlineCompare = data;
    else if (address === Memory.addresses.ppu.dma) {
      // DEBUG && console.log('Initiated DMA transfer.');
      this.dmaTransfer(data);
    } else if (address === Memory.addresses.ppu.paletteData) {
      this.ppu.palette = data;
      this.ppu.paletteMap[0] = (((data >> 1) & 1) << 1) | (data & 1);
      this.ppu.paletteMap[1] = (((data >> 3) & 1) << 1) | ((data >> 2) & 1);
      this.ppu.paletteMap[2] = (((data >> 5) & 1) << 1) | ((data >> 4) & 1);
      this.ppu.paletteMap[3] = (((data >> 7) & 1) << 1) | ((data >> 6) & 1);
    } else if (address === Memory.addresses.ppu.windowX)
      this.ppu.windowX = data;
    else if (address === Memory.addresses.ppu.windowY) this.ppu.windowY = data;
    this.ram[address] = data;
  };
}

export {Memory};
