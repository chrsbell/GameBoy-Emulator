import {bit, byte, word, getBit} from '../Types';
import LCDControl from './Control';
import Memory from '../Memory';

enum lcdModes {
  hBlank,
  vBlank,
  readOAM,
  readVRAM,
}

class LCD {
  private _lcdc: LCDControl = new LCDControl();
  public get lcdc(): LCDControl {
    return this._lcdc;
  }
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
   * Set the LCD controls.
   */
  public setControls(value: byte): void {
    this.lcdc.update(value);
    debugger;
  }
  /**
   * Increments the current scanline.
   */
  private setNextScanline(): void {
    this.clock = 0;
    this.scanline += 1;
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
        Memory.writeByte(0xff41, 0);
        break;
      case lcdModes.vBlank:
        this.vBlank();
        Memory.writeByte(0xff41, 1);
        break;
      case lcdModes.readOAM:
        this.readOAM();
        Memory.writeByte(0xff41, 2);
        break;
      case lcdModes.readVRAM:
        this.readVRAM();
        Memory.writeByte(0xff41, 3);
        break;
    }
  }
  /**
   * Renders tiles.
   */
  public renderTiles(): void {}
  /**
   * Renders sprites.
   */
  public renderSprites(): void {}
  /**
   * Draws a scanline.
   */
  public drawScanline(): void {
    if (this.lcdc.bgWindowEnable) {
      // draw tiles
    }
    if (this.lcdc.objEnable) {
      // draw sprites
    }
    console.log(`Tried to render scanline ${this.scanline}.`);
  }
}

export default new LCD();
