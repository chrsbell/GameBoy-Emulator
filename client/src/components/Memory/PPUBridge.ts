import InterruptService from 'Interrupts/index';
import {DEBUG} from '../../helpers/index';
import Memory from '../Memory/index';
import PPU from '../PPU/index';

/**
 * Get rid of this?
 */
class PPUBridge {
  public ppu!: PPU;
  public memory!: Memory;
  public interruptService!: InterruptService;
  constructor() {
    this.memory = new Memory(this);
    this.interruptService = new InterruptService(this.memory);
    this.ppu = new PPU(this, this.interruptService);
  }
  /**
   * Used internally by the PPU/lCD to update the current scanline.
   */
  public updateScanline = (scanline: byte): void => {
    this.memory.ram[0xff44] = scanline;
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

  public writeGraphicsData = (address: word, data: byte): void => {
    if (address === Memory.addresses.ppu.stat) {
      this.ppu.setStat(data);
      return;
    } else if (address === Memory.addresses.ppu.lcdc)
      this.ppu.lcdc.update(data);
    else if (address === Memory.addresses.ppu.scrollY) this.ppu.scrollY = data;
    else if (address === Memory.addresses.ppu.scrollX) this.ppu.scrollX = data;
    // reset scanline if trying to write to associated register
    else if (address === Memory.addresses.ppu.scanline) {
      this.ppu.resetScanline();
      return;
    } else if (address === Memory.addresses.ppu.scanlineCompare)
      this.ppu.scanlineCompare = data;
    else if (address === Memory.addresses.ppu.dma) {
      DEBUG && console.log('Initiated DMA transfer.');
      this.memory.dmaTransfer(data);
    } else if (address === Memory.addresses.ppu.paletteData) {
      this.ppu.palette = data;
      this.ppu.paletteMap[0] = (((data >> 1) & 1) << 1) | (data & 1);
      this.ppu.paletteMap[1] = (((data >> 3) & 1) << 1) | ((data >> 2) & 1);
      this.ppu.paletteMap[2] = (((data >> 5) & 1) << 1) | ((data >> 4) & 1);
      this.ppu.paletteMap[3] = (((data >> 7) & 1) << 1) | ((data >> 6) & 1);
    } else if (address === Memory.addresses.ppu.windowX)
      this.ppu.windowX = data;
    else if (address === Memory.addresses.ppu.windowY) this.ppu.windowY = data;
    this.memory.ram[address] = data;
  };
}

export default PPUBridge;
