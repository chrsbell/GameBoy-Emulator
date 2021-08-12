import {DEBUG} from 'helpers/Debug';
import InterruptService from 'Interrupts/index';
import Primitive from '../../helpers/Primitives';
import Memory from '../Memory/index';
import PPU from '../PPU/index';

/**
 * Using this to abstract the circular reference from ppu<->memory
 */
class PPUBridge {
  public ppu!: PPU;
  public memory!: Memory;
  public interruptService!: InterruptService;
  constructor() {
    this.memory = new Memory(this);
    this.interruptService = new InterruptService(this.memory);
    this.ppu = new PPU(this, this.interruptService);
    this.ppu.reset();
  }
  /**
   * Used internally by the PPU/lCD to update the current scanline.
   */
  public updateScanline = (scanline: byte): void => {
    this.memory.ram[0xff44] = scanline;
  };
  public writeIORamOnly = (address: word, data: byte): void => {
    this.memory.ram[address] = data;
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
      const lowByte = this.memory.readByte(address);
      const highByte = this.memory.readByte(address + 1);
      const tileIndex = Math.floor((address - 0x8000) / 16);
      const y = (address >> 1) & 7;

      let lowBit: bit;
      let highBit: bit;

      for (let x = 7; x >= 0; x--) {
        lowBit = Primitive.getBit(lowByte, x);
        highBit = Primitive.getBit(highByte, x);
        const tileData = (lowBit ? 1 : 0) | (highBit ? 2 : 0);
        this.ppu.tileData[tileIndex][y][7 - x] = tileData;
      }
    } else if (address <= 0x9bff) {
      this.ppu.tileMap[0][address - 0x9800] = data;
    } else {
      this.ppu.tileMap[1][address - 0x9c00] = data;
    }
  };

  public writeIORam = (address: word, data: byte): void => {
    if (address === Memory.addresses.ppu.stat) {
      this.ppu.setStat(data);
      return;
    }
    if (address === Memory.addresses.ppu.lcdc) this.ppu.lcdc.update(data);
    else if (address === Memory.addresses.ppu.scrollY) this.ppu.scrollY = data;
    else if (address === Memory.addresses.ppu.scrollX) this.ppu.scrollX = data;
    // reset scanline if trying to write to associated register
    else if (address === Memory.addresses.ppu.scanline) {
      this.ppu.updateScanline(0);
    } else if (address === Memory.addresses.ppu.scanlineCompare)
      this.ppu.scanlineCompare = data;
    else if (address === Memory.addresses.ppu.dma) {
      DEBUG && console.log('Initiated DMA transfer.');
      this.memory.dmaTransfer(data);
    } else if (address === Memory.addresses.ppu.paletteData) {
      this.ppu.palette = data;
      this.ppu.paletteMap[0] =
        (Primitive.getBit(data, 1) << 1) | Primitive.getBit(data, 0);
      this.ppu.paletteMap[1] =
        (Primitive.getBit(data, 3) << 1) | Primitive.getBit(data, 2);
      this.ppu.paletteMap[2] =
        (Primitive.getBit(data, 5) << 1) | Primitive.getBit(data, 4);
      this.ppu.paletteMap[3] =
        (Primitive.getBit(data, 7) << 1) | Primitive.getBit(data, 6);
    } else if (address === Memory.addresses.ppu.windowX)
      this.ppu.windowX = data;
    else if (address === Memory.addresses.ppu.windowY) this.ppu.windowY = data;
    this.writeIORamOnly(address, data);
  };
}

export default PPUBridge;
