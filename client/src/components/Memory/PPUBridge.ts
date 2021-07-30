import {DEBUG} from 'helpers/Debug';
import InterruptService from 'Interrupts/index';
import Memory from '../Memory/index';
import PPU from '../PPU/index';

/**
 * Using this to abstract the circular reference from ppu<->memory
 */
class PPUBridge {
  public ppu!: PPU;
  public memory!: Memory;
  private interruptService!: InterruptService;
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
    this.memory.ioRAM[Memory.addresses.ppu.scanline - 0xff00] = scanline;
  };
  public writeIORamOnly = (address: word, data: byte): void => {
    this.memory.ioRAM[address - 0xff00] = data;
  };
  public updateTiles = (address: word, data: byte): void => {
    // each tile (384 tiles) takes up 16 bytes in vram (range 0x8000 to 0x97ff). each tile is 8x8 pixels. A horizontal row of 8 pixels can be represented using 2 bytes, where the first byte contains the least sig bit of the color ID for each pixel. The second byte contains the most sig bit of the color ID.

    // https://www.huderlem.com/demos/gameboy2bpp.html

    // row 0
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0]

    // row 1
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0]

    // writing to tile data in vram
    if (address < 0x1800) {
      const tileIndex = (address >> 4) & 511; //Math.floor(address / 16);
      // if (data) console.log(`writing to tile ibndex ${tileIndex}`);
      if (address & 1) {
        address -= 1;
      }
      const y = (address >> 1) & 7;
      let lowByte;
      let highByte;

      for (let x = 7; x >= 0; x--) {
        // using the 2bpp system, the low byte must be on an even address
        //   highByte = data & x; //Primitive.getBit(data, x);
        //   lowByte = this.memory.vRAM[address - 1] & x; //Primitive.getBit(this.vRAM[address - 0x8000 - 1], x);
        // } else {

        lowByte = data & x; //Primitive.getBit(data, x);
        highByte = this.memory.vRAM[address + 1] & x; //Primitive.getBit(this.vRAM[address - 0x8000 - 1], x);
        const tileData = (lowByte ? 1 : 0) | (highByte ? 2 : 0);
        if (tileData > 1) console.log(`something cool happened ${tileData}`);
        this.ppu.tileData[tileIndex][y][7 - x] = tileData;
      }
      // if (f) console.log(JSON.stringify(tilearr));
      // if (
      //   tilearr.reduce(
      //     (acc, col) => acc || col.find((x: number) => x !== 0),
      //     false
      //   )
      // )
      //   console.log(`Wrote tile info ${tilearr}`);
    } else if (address <= 0x1bff) {
      this.ppu.tileMap[0][address - 0x1800] = data;
      // if (data)
      //   console.log(
      //     `Wrote ${data} at address ${Primitive.toHex(
      //       address - 0x9800
      //     )} at x ${
      //       address - 0x9800 - Math.floor((address - 0x9800) / 32) * 32
      //     }, y ${Math.floor((address - 0x9800) / 32)}`
      //   );
    } else {
      this.ppu.tileMap[1][address - 0x1c00] = data;
      // if (data !== 0)
      //   console.log(
      //     `updated tile map index: ${address - 0x9800} with data ${data}`
      //   );
    }
  };
  public writeIORam = (address: word, data: byte): void => {
    if (address === Memory.addresses.ppu.lcdc) this.ppu.lcdc.update(data);
    else if (address === Memory.addresses.ppu.stat) this.ppu.stat = data;
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
      console.log(`updated palette with ${data.toString(2)}`);
      this.ppu.palette = data;
    } else if (address === Memory.addresses.ppu.windowX)
      this.ppu.windowX = data;
    else if (address === Memory.addresses.ppu.windowY) this.ppu.windowY = data;
    this.writeIORamOnly(address, data);
  };
}

export default PPUBridge;
