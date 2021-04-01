import {bit, byte, word} from '../Types';
import LCDControl from './Control';
import Memory from '../Memory';

enum lcdModes {
  hBlank,
  vBlank,
  readOAM,
  readVRAM,
}

class LCD {
  private lcdc: LCDControl = new LCDControl();
  // lcd draw mode
  private mode = 0;
  // clock used to determine the draw mode, elapsed according to cpu t-states
  private clock = 0;
  // the scanline currently being rendererd (0-153)
  private scanline = 0;
  private scrollX = 0;
  private scrollY = 0;
  private tileSet: Array<Array<Array<byte>>> = [];
  private static numScanlines = 384;
  public constructor() {
    this.reset();
  }
  /**
   * Resets the LCD.
   */
  private reset(): void {
    this.tileSet = [...Array(LCD.numScanlines)].fill([
      ...Array(8).fill([0, 0, 0, 0, 0, 0, 0, 0]),
    ]);
  }
  /**
   * Increments the current scanline.
   */
  private setNextScanline(): void {
    this.clock = 0;
    this.scanline += 1;
  }
  /**
   * Updates internal tile map using the value written to VRAM.
   */
  public updateTile(address: word, value: byte): void {
    debugger;
    address &= 0x1ffe;
    const tile = (address >> 4) & 511;
    const row = (address >> 1) & 7;
    for (let col = 0; col < 8; col++) {
      const sx = 1 << (7 - col);
      // actually just two sets of 2 bits
      const lower: byte = Memory.readByte(address + 0x8000) & sx ? 1 : 0;
      const upper: byte = Memory.readByte(address + 0x8000 + 1) & sx ? 2 : 0;
      this.tileSet[tile][row][col] = lower + upper;
    }
  }
  private vBlank(): void {
    if (this.clock >= 456) {
      this.setNextScanline();
      if (this.scanline === 154) {
        this.mode = 2;
        this.scanline = 0;
      }
    }
  }
  private hBlank(): void {
    if (this.clock >= 204) {
      this.setNextScanline();
      if (this.scanline === 143) {
        this.mode = 1;
      } else {
        this.mode = 2;
      }
    }
  }
  private readOAM(): void {
    if (this.clock >= 80) {
      this.clock = 0;
      this.mode = 3;
    }
  }
  private readVRAM(): void {
    if (this.clock >= 172) {
      this.clock = 0;
      this.mode = 0;
    }
    this.drawScanline();
  }
  /**
   * Sends scanlines to the renderer.
   */
  public draw(cycles: number): void {
    this.clock += cycles;
    switch (this.mode) {
      case lcdModes.hBlank:
        this.hBlank();
        break;
      case lcdModes.vBlank:
        this.vBlank();
        break;
      case lcdModes.readOAM:
        this.readOAM();
        break;
      case lcdModes.readVRAM:
        this.readVRAM();
        break;
    }
  }
  public drawScanline(): void {
    console.log(`Tried to render scanline ${this.scanline}.`);
  }
}

export default new LCD();
