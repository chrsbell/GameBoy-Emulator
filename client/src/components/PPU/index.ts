import {bit, byte, word, getBit} from '../Types';
import Interrupt from '../Interrupt';
import PPUControl from './Control';
import Memory from '../Memory';

enum ppuModes {
  hBlank,
  vBlank,
  readOAM,
  readVRAM,
}

interface AddressMap {
  lcdc: word;
  stat: word;
  scrollY: word;
  scanline: word;
  scanlineCompare: word;
  windowY: word;
}

export const PPUAddress: AddressMap = {
  lcdc: 0xff40,
  stat: 0xff41,
  scrollY: 0xff42,
  scanline: 0xff44,
  scanlineCompare: 0xff45,
  windowY: 0xff4a,
};

class PPU {
  private _lcdc: PPUControl = new PPUControl();
  public get lcdc(): PPUControl {
    return this._lcdc;
  }
  // lcd draw mode
  private _mode = 0;

  // clock used to determine the draw mode, elapsed according to cpu t-states
  private clock = 0;
  // the scanline currently being rendererd (0-153)
  private _scanline = 0;
  private scrollX = 0;
  private scrollY = 0;
  private tileSet: Array<Array<Array<byte>>> = [];
  private static numScanlines = 384;
  public constructor() {
    this.reset();
  }
  /**
   * Resets the PPU.
   */
  private reset(): void {
    this.tileSet = [...Array(PPU.numScanlines)].fill([
      ...Array(8).fill([0, 0, 0, 0, 0, 0, 0, 0]),
    ]);
  }
  /**
   * Returns whether lcd is enabled.
   */
  private lcdEnabled(): boolean {
    return this._lcdc.LCDPPU === 1;
  }
  /**
   * Set the LCD controls.
   */
  public setControls(value: byte): void {
    this.lcdc.update(value);
  }
  /**
   * Get/Set the scanline.
   */
  public get scanline(): byte {
    return Memory.readByte(PPUAddress.scanline);
  }
  public set scanline(value) {
    Memory.writeByte(PPUAddress.scanline, value);
    this._scanline = value;
  }
  /**
   * Get/Set the lcd mode (STAT register)
   */
  public get mode(): byte {
    return Memory.readByte(PPUAddress.stat);
  }
  public set mode(value) {
    this._mode = value;
    Memory.writeByte(PPUAddress.stat, value);
  }
  /**
   * Vertical blanking period.
   */
  private vBlank(): void {
    if (this.clock >= 456) {
      this.scanline = this.scanline + 1;
      this.clock = 0;
      if (this.scanline === 154) {
        this.mode = 2;
        this.scanline = 0;
      }
    }
  }
  /**
   * Horizontal blanking period.
   */
  private hBlank(): void {
    if (this.clock >= 204) {
      this.scanline = this.scanline + 1;
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
  public buildGraphics(cycles: number): void {
    if (this.lcdEnabled()) {
      this.clock += cycles;
      switch (this.mode) {
        case ppuModes.hBlank:
          this.hBlank();
          break;
        case ppuModes.vBlank:
          this.vBlank();
          break;
        case ppuModes.readOAM:
          this.readOAM();
          break;
        case ppuModes.readVRAM:
          this.readVRAM();
          break;
      }
    } else {
      this.resetVBlank();
    }
  }
  /**
   * Resets the PPU/LCD to the beginning of the VBlank period.
   */
  public resetVBlank(): void {
    this.clock = 456;
    this.scanline = 0;
    this.mode = 1;
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

export default new PPU();
