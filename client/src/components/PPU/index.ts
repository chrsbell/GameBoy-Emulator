import {byte, word, getBit, setBit, clearBit, toSigned} from '../Types';
import Interrupt, {enableInterrupt} from '../Interrupts';
import PPUControl from './Control';
import Memory from '../Memory';
import CanvasRenderer, {Colors} from '../CanvasRenderer';
import benchmark, {benchmarksEnabled} from '../Performance';

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
  scrollX: word;
  scanline: word;
  scanlineCompare: word;
  windowY: word;
  windowX: word;
}

export const PPUAddress: AddressMap = {
  lcdc: 0xff40,
  stat: 0xff41,
  scrollY: 0xff42,
  scrollX: 0xff43,
  scanline: 0xff44,
  scanlineCompare: 0xff45,
  windowY: 0xff4a,
  windowX: 0xff4b,
};

type StatBitsType = {
  modeLower: number;
  modeUpper: number;
  lycLc: number;
  interrupt: {
    [key: number]: number;
  };
  lycLcInterrupt: number;
};

const StatBits: StatBitsType = {
  modeLower: 0,
  modeUpper: 1,
  lycLc: 2,
  interrupt: {
    [ppuModes.hBlank]: 3,
    [ppuModes.vBlank]: 4,
    [ppuModes.readOAM]: 5,
    [ppuModes.readVRAM]: -1, // no interrupt bit
  },
  lycLcInterrupt: 6,
};

class PPU {
  private _lcdc: PPUControl = new PPUControl();
  public get lcdc(): PPUControl {
    return this._lcdc;
  }
  // stat register
  private _stat = 0;
  private _mode = 2;
  // clock used to determine the draw mode, elapsed according to cpu t-states
  private _clock = 0;
  public get clock() {
    return this._clock;
  }
  public set clock(value) {
    this._clock = value;
  }
  // the scanline currently being rendererd (0-153)
  private _scanline = 0;
  private _scanlineCompare = 0;
  private _scrollX = 0;
  public get scrollX(): byte {
    return Memory.readByte(PPUAddress.scrollX);
  }
  public set scrollX(value) {
    this._scrollX = value;
    Memory.writeByte(PPUAddress.scrollX, value);
  }
  private _scrollY = 0;
  public get scrollY(): byte {
    return Memory.readByte(PPUAddress.scrollY);
  }
  public set scrollY(value) {
    this._scrollY = value;
    Memory.writeByte(PPUAddress.scrollY, value);
  }
  private _windowX = 0;
  public get windowX(): byte {
    return Memory.readByte(PPUAddress.windowX);
  }
  public set windowX(value) {
    this._windowX = value;
    Memory.writeByte(PPUAddress.windowX, value);
  }
  private _windowY = 0;
  public get windowY(): byte {
    return Memory.readByte(PPUAddress.windowY);
  }
  public set windowY(value) {
    this._windowY = value;
    Memory.writeByte(PPUAddress.windowY, value);
  }
  private tileSet: Array<Array<Array<byte>>> = [];
  private static numScanlines = 384;
  public constructor() {
    this.reset();
    if (benchmarksEnabled) {
      this.buildGraphics = benchmark(this.buildGraphics.bind(this));
      this.drawScanline = benchmark(this.drawScanline.bind(this));
    }
  }
  /**
   * Resets the PPU.
   */
  public reset(): void {
    this.tileSet = [...Array(PPU.numScanlines)].fill([
      ...Array(8).fill([0, 0, 0, 0, 0, 0, 0, 0]),
    ]);
    this.lcdc.update(0);
    this._stat = 0;
    this._mode = 2;
    this.clock = 0;
    this._scanline = 0;
    this._scanlineCompare = 0;
    this._scrollX = 0;
    this._scrollY = 0;
  }
  /**
   * Returns whether lcd is enabled.
   */
  public lcdEnabled(): boolean {
    return this._lcdc.LCDPPU === 1;
  }
  /**
   * Get/Set the scanline.
   */
  public get scanline(): byte {
    return Memory.readByte(PPUAddress.scanline);
  }
  public set scanline(value: byte) {
    // if (value > 0)
    // console.log(`Setting scanline to ${value}`);
    Memory.updateScanline(value);
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
    this._mode = value & 0b11;
    Memory.writeByte(PPUAddress.stat, value);
  }
  /**
   * Sets the mode and updates corresponding stat bits.
   */
  public set mode(value: byte) {
    let register: byte = this.stat;
    register = clearBit(register, StatBits.modeLower);
    register = clearBit(register, StatBits.modeUpper);
    register |= value;
    this.stat = register;
  }
  public get mode(): byte {
    if (this._mode !== (Memory.readByte(PPUAddress.stat) & 0b11))
      throw new Error('Mismatch in stat value from class and memory.');
    return this._mode;
  }
  /**
   * Vertical blanking period.
   */
  private vBlank(): void {
    if (this.clock >= 456) {
      this.scanline = this.scanline + 1;
      this.clock = 0;
      if (this.scanline > 153) {
        this.mode = ppuModes.readOAM;
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
      if (this.scanline === CanvasRenderer.fps) {
        this.mode = ppuModes.vBlank;
      } else {
        this.mode = ppuModes.readOAM;
      }
    }
  }
  private readOAM(): void {
    if (this.clock >= 80) {
      this.mode = ppuModes.readVRAM;
    }
  }
  private readVRAM(): void {
    if (this.clock >= 172) {
      this.mode = ppuModes.hBlank;
    }
    this.drawScanline();
  }
  private lcdInterrupt(switchedMode: boolean): void {
    const interruptBit = StatBits.interrupt[this.mode];
    // only certain modes trigger an interrupt
    if (interruptBit >= 0) {
      const interruptModeBit = getBit(this.stat, interruptBit);
      if (interruptModeBit && switchedMode) {
        enableInterrupt(Interrupt.lcdStat);
      }
    }
  }
  /**
   * Sends scanlines to the renderer.
   */
  public buildGraphics(cycles: number): void {
    if (this.lcdEnabled()) {
      this.clock += cycles;
      const oldMode = this.mode;
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
      this.lcdInterrupt(oldMode !== this.mode);
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
    this.clock = 0;
    this.scanline = 0;
    this.mode = ppuModes.vBlank;
  }
  private scanlineInWindow(): boolean {
    return this.lcdc.windowEnable && this.scanline >= this.windowY;
  }
  private bgMemoryMapOffset(): word {
    const testBit = this.scanlineInWindow()
      ? this.lcdc.tileMapArea
      : this.lcdc.bgTileMapArea;
    return testBit ? 0x9c00 : 0x9c00;
  }
  private tileDataMapOffset(): word {
    return this.lcdc.bgWindowTileData ? 0x8800 : 0x8800;
  }
  /**
   * Renders an individial pixel using tile data.
   */
  public renderTilePixel(
    x: byte,
    yPos: byte,
    tileRow: byte,
    windowX: byte,
    tileDataAddress: word,
    bgDataAddress: word,
    isSigned: boolean
  ): void {
    const getXPos = () => {
      if (this.scanlineInWindow() && x >= windowX) {
        return x - windowX;
      }
      return x + this.scrollX;
    };
    const xPos = getXPos();
    const tileCol = Math.floor(xPos / 8);
    const tileAddress = bgDataAddress + tileRow + tileCol;
    const tileId = isSigned
      ? toSigned(Memory.readByte(tileAddress))
      : Memory.readByte(tileAddress);
    const tileLocation =
      tileDataAddress + (isSigned ? (tileId + 128) * 16 : tileId * 16);
    const line = (yPos % 8) * 2;
    const upperByte = Memory.readByte(tileLocation + line);
    const lowerByte = Memory.readByte(tileLocation + line + 1);
    // debugger;
    const colorBit = ((xPos % 8) - 7) * -1;
    let colorNum = getBit(lowerByte, colorBit);
    colorNum = colorNum << 1;
    colorNum |= getBit(upperByte, colorBit);

    // console.log(`color: ${colorNum}`);
    const finalY = this.scanline;
    CanvasRenderer.setPixel(xPos, finalY, Colors.white);
  }
  /**
   * Renders tiles.
   */
  public renderTiles(): void {
    const windowXOffset = this.windowX - 7;
    const tileDataAddress = this.tileDataMapOffset();
    const isSigned = tileDataAddress === 0x8800;
    const bgDataAddress = this.bgMemoryMapOffset();
    const getYPos = () => {
      if (!this.scanlineInWindow()) {
        return this.scrollY + this.scanline;
      }
      return this.scrollY - this.windowY;
    };
    const yPos = getYPos();
    const tileRow = (yPos / 8) * 32;
    for (let x = 0; x < CanvasRenderer.screenWidth; x++) {
      this.renderTilePixel(
        x,
        yPos,
        tileRow,
        windowXOffset,
        tileDataAddress,
        bgDataAddress,
        isSigned
      );
    }
  }
  /**
   * Renders sprites.
   */
  public renderSprites(): void {}
  /**
   * Draws a scanline.
   */
  public drawScanline(): void {
    if (this.lcdc.bgWindowEnable) {
      // console.log('rendering tiles');
      this.renderTiles();
    }
    if (this.lcdc.objEnable) {
      this.renderSprites();
    }
    // console.log(`Tried to render scanline ${this.scanline}.`);
  }
}

export default new PPU();
