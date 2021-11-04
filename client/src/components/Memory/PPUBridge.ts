import InterruptService from 'Interrupts/index';
import {DEBUG} from '../../helpers/index';
import Memory from '../Memory/index';
import PPU from '../PPU/index';

let ppuRef!: PPU;
let memoryRef!: Memory;

/**
 * Get rid of this?
 */
class PPUBridge {
  public ppu!: PPU;
  public memory!: Memory;
  public interruptService!: InterruptService;
  constructor() {
    this.memory = new Memory(this);
    memoryRef = this.memory;
    this.interruptService = new InterruptService(memoryRef);
    this.ppu = new PPU(this, this.interruptService);
    ppuRef = this.ppu;
  }
  /**
   * Used internally by the PPU/lCD to update the current scanline.
   */
  public updateScanline = (scanline: byte): void => {
    memoryRef.ram[0xff44] = scanline;
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
      const lowByte = memoryRef.readByte(address);
      const highByte = memoryRef.readByte(address + 1);
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
      ppuRef.tileData[tileIndex][y] = data;
    } else if (address <= 0x9bff) {
      // store unsigned and signed indices
      ppuRef.tileMap[0][address - 0x9800] = data;
      ppuRef.signedTileMap[0][address - 0x9800] =
        data <= 0x7f ? data + 0x100 : data;
    } else {
      ppuRef.tileMap[1][address - 0x9c00] = data;
      ppuRef.signedTileMap[1][address - 0x9c00] =
        data <= 0x7f ? data + 0x100 : data;
    }
  };

  public writeGraphicsData = (address: word, data: byte): void => {
    if (address === Memory.addresses.ppu.stat) {
      ppuRef.setStat(data);
    } else if (address === Memory.addresses.ppu.lcdc)
      ppuRef.getLCDC().update(data);
    else if (address === Memory.addresses.ppu.scrollY) ppuRef.scrollY = data;
    else if (address === Memory.addresses.ppu.scrollX) ppuRef.scrollX = data;
    // reset scanline if trying to write to associated register
    else if (address === Memory.addresses.ppu.scanline) {
      ppuRef.resetScanline();
    } else if (address === Memory.addresses.ppu.scanlineCompare)
      ppuRef.scanlineCompare = data;
    else if (address === Memory.addresses.ppu.dma) {
      DEBUG && console.log('Initiated DMA transfer.');
      memoryRef.dmaTransfer(data);
    } else if (address === Memory.addresses.ppu.paletteData) {
      ppuRef.palette = data;
      ppuRef.paletteMap[0] = (((data >> 1) & 1) << 1) | (data & 1);
      ppuRef.paletteMap[1] = (((data >> 3) & 1) << 1) | ((data >> 2) & 1);
      ppuRef.paletteMap[2] = (((data >> 5) & 1) << 1) | ((data >> 4) & 1);
      ppuRef.paletteMap[3] = (((data >> 7) & 1) << 1) | ((data >> 6) & 1);
    } else if (address === Memory.addresses.ppu.windowX) ppuRef.windowX = data;
    else if (address === Memory.addresses.ppu.windowY) ppuRef.windowY = data;
  };
}

export default PPUBridge;
