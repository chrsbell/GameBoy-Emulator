import {bit, byte, word, getBit, setBit, clearBit} from '../Types';
import Interrupt, {enableInterrupt} from '../Interrupts';
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

const StatBits = {
  modeLower: 0,
  modeUpper: 1,
  lycLc: 2,
  hBlankInterrupt: 3,
  vBlankInterrupt: 4,
  readOAMInterrupt: 5,
  lycLcInterrupt: 6,
};

class PPU {
  private _lcdc: PPUControl = new PPUControl();
  public get lcdc(): PPUControl {
    return this._lcdc;
  }
  // stat register
  private _stat = 0;

  // clock used to determine the draw mode, elapsed according to cpu t-states
  private clock = 0;
  // the scanline currently being rendererd (0-153)
  private _scanline = 0;
  private _scanlineCompare = 0;
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
  public lcdEnabled(): boolean {
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
  public set scanline(value: byte) {
    Memory.writeByte(PPUAddress.scanline, value);
    this._scanline = value;
  }
  public get scanlineCompare(): byte {
    return Memory.readByte(PPUAddress.scanlineCompare);
  }
  public set scanlineCompare(value: byte) {
    Memory.writeByte(PPUAddress.scanlineCompare, value);
    this._scanlineCompare = value;
  }
  /**
   * Get/Set the STAT register
   */
  public get stat(): byte {
    return Memory.readByte(PPUAddress.stat);
  }
  public set stat(value: byte) {
    this._stat = value;
    Memory.writeByte(PPUAddress.stat, value);
  }
  public setStatMode(value: byte) {
    let register: byte = this.stat;
    register = clearBit(register, StatBits.modeLower);
    register = clearBit(register, StatBits.modeUpper);
    register |= value;
    this.stat = register;
  }
  /**
   * Vertical blanking period.
   */
  private vBlank(): void {
    if (this.clock >= 456) {
      this.scanline = this.scanline + 1;
      this.clock = 0;
      if (this.scanline === 154) {
        this.setStatMode(ppuModes.readOAM);
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
        this.setStatMode(ppuModes.vBlank);
      } else {
        this.setStatMode(ppuModes.readOAM);
      }
    }
  }
  private readOAM(): void {
    if (this.clock >= 80) {
      this.clock = 0;
      this.setStatMode(ppuModes.readVRAM);
    }
  }
  private readVRAM(): void {
    if (this.clock >= 172) {
      this.clock = 0;
      this.setStatMode(ppuModes.hBlank);
    }
    this.drawScanline();
  }
  /**
   * Sends scanlines to the renderer.
   */
  public buildGraphics(cycles: number): void {
    if (this.lcdEnabled()) {
      debugger;
      let interruptModeBit: bit = 0;
      this.clock += cycles;
      switch (this.stat) {
        case ppuModes.hBlank:
          this.hBlank();
          interruptModeBit = getBit(this.stat, StatBits.hBlankInterrupt);
          break;
        case ppuModes.vBlank:
          this.vBlank();
          interruptModeBit = getBit(this.stat, StatBits.vBlankInterrupt);
          break;
        case ppuModes.readOAM:
          this.readOAM();
          interruptModeBit = getBit(this.stat, StatBits.readOAMInterrupt);
          break;
        case ppuModes.readVRAM:
          this.readVRAM();
          break;
      }
      if (interruptModeBit) {
        enableInterrupt(Interrupt.lcdStat);
      }
      this.compareLcLyc();
    } else {
      this.resetVBlank();
    }
  }
  /**
   * Compares the scanline/scanline compare registers and toggles appropriate bits.
   */
  public compareLcLyc(): void {
    const register: byte = this.stat;
    if (this.scanline === this.scanlineCompare) {
      this.stat = setBit(register, StatBits.lycLc);
      if (getBit(this.stat, StatBits.lycLcInterrupt)) {
        enableInterrupt(Interrupt.lcdStat);
      }
    } else {
      this.stat = clearBit(register, StatBits.lycLc);
    }
  }
  /**
   * Resets the PPU/LCD to the beginning of the VBlank period.
   */
  public resetVBlank(): void {
    this.clock = 456;
    this.scanline = 0;
    this.setStatMode(ppuModes.vBlank);
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
