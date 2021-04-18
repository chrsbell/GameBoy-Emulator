import {byte, word, getBit, setBit, clearBit, toSigned} from '../../Types';
import Interrupt, {enableInterrupt} from '../Interrupts';
import PPUControl from './Control';
import Memory from '../Memory';
import CanvasRenderer, {Colors} from '../CanvasRenderer';
import type {RGB} from '../CanvasRenderer';
import benchmark, {benchmarksEnabled} from '../../helpers/Performance';

type StatBitsType = {
  modeLower: number;
  modeUpper: number;
  lycLc: number;
  interrupt: {
    [key: number]: number;
  };
  lycLcInterrupt: number;
};

class PPU {
  private memory: Memory = <Memory>{};
  private _lcdc: PPUControl = <PPUControl>{};
  public get lcdc(): PPUControl {
    return this._lcdc;
  }

  private ppuModes = {
    hBlank: 0,
    vBlank: 1,
    readOAM: 2,
    readVRAM: 3,
  };
  private statBits = {
    modeLower: 0,
    modeUpper: 1,
    lycLc: 2,
    interrupt: {
      [this.ppuModes.hBlank]: 3,
      [this.ppuModes.vBlank]: 4,
      [this.ppuModes.readOAM]: 5,
      [this.ppuModes.readVRAM]: -1, // no interrupt bit
    },
    lycLcInterrupt: 6,
  };
  private paletteMap: Array<RGB> = [
    Colors.white,
    Colors.lightGray,
    Colors.darkGray,
    Colors.black,
  ];

  // stat register
  private _stat = 0;
  public get stat(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.stat);
  }
  public set stat(value) {
    this._stat = value;
    this._mode = value & 0b11;
    this.memory.writeByte(this.memory.addresses.ppu.stat, value);
  }
  private _mode = 2;
  public set mode(value) {
    let register: byte = this.stat;
    register = clearBit(register, this.statBits.modeLower);
    register = clearBit(register, this.statBits.modeUpper);
    register |= value;
    this.stat = register;
  }
  public get mode(): byte {
    // if (this._mode !== (this.memory.readByte(this.memory.addresses.ppu.stat) & 0b11))
    // throw new Error('Mismatch in stat value from class and this.memory.');
    return this.memory.readByte(this.memory.addresses.ppu.stat) & 0b11;
  }
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
  public get scanline(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scanline);
  }
  public set scanline(value) {
    this.memory.updateScanline(value);
    this._scanline = value;
  }
  private _scanlineCompare = 0;
  public get scanlineCompare(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scanlineCompare);
  }
  public set scanlineCompare(value) {
    this.memory.writeByte(this.memory.addresses.ppu.scanlineCompare, value);
    this._scanlineCompare = value;
  }
  private _scrollX = 0;
  public get scrollX(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scrollX);
  }
  public set scrollX(value) {
    this._scrollX = value;
    this.memory.writeByte(this.memory.addresses.ppu.scrollX, value);
  }
  private _scrollY = 0;
  public get scrollY(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scrollY);
  }
  public set scrollY(value) {
    this._scrollY = value;
    this.memory.writeByte(this.memory.addresses.ppu.scrollY, value);
  }
  private _windowX = 0;
  public get windowX(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.windowX);
  }
  public set windowX(value) {
    this._windowX = value;
    this.memory.writeByte(this.memory.addresses.ppu.windowX, value);
  }
  private _windowY = 0;
  public get windowY(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.windowY);
  }
  public set windowY(value) {
    this._windowY = value;
    this.memory.writeByte(this.memory.addresses.ppu.windowY, value);
  }
  private _palette = 0;
  public get palette(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.paletteData);
  }
  public set palette(value) {
    this._palette = value;
    this.memory.writeByte(this.memory.addresses.ppu.paletteData, value);
  }
  public constructor(memory: Memory) {
    this._lcdc = new PPUControl();
    this.memory = memory;
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
    this.lcdc.update(0);
    this._stat = 0;
    this._mode = 0;
    this._clock = 0;
    this._scanline = 0;
    this._scanlineCompare = 0;
    this._scrollX = 0;
    this._scrollY = 0;
    this._windowX = 0;
    this._windowY = 0;
    this._palette = 0;
  }
  /**
   * Returns whether lcd is enabled.
   */
  public lcdEnabled(): boolean {
    return this._lcdc.LCDPPU === 1;
  }
  /**
   * Vertical blanking period.
   */
  private vBlank(): void {
    if (this.clock >= 456) {
      this.scanline = this.scanline + 1;
      this.clock = 0;
      if (this.scanline > 153) {
        this.mode = this.ppuModes.readOAM;
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
      if (this.scanline === CanvasRenderer.screenHeight) {
        this.mode = this.ppuModes.vBlank;
        enableInterrupt(this.memory, Interrupt.vBlank);
      } else {
        this.mode = this.ppuModes.readOAM;
      }
    }
  }
  private readOAM(): void {
    if (this.clock >= 80) {
      this.mode = this.ppuModes.readVRAM;
    }
  }
  private readVRAM(): void {
    if (this.clock >= 172) {
      this.mode = this.ppuModes.hBlank;
    }
    this.drawScanline();
  }
  private lcdInterrupt(switchedMode: boolean): void {
    const interruptBit = this.statBits.interrupt[this.mode];
    // only certain modes trigger an interrupt
    if (interruptBit >= 0) {
      const interruptModeBit = getBit(this.stat, interruptBit);
      if (interruptModeBit && switchedMode) {
        enableInterrupt(this.memory, Interrupt.lcdStat);
      }
    }
  }
  /**
   * Sends scanlines to the renderer.
   */
  public buildGraphics(cycles: number): void {
    // possible the lcdc register was set by the game
    this.lcdc.update(this.memory.readByte(this.memory.addresses.ppu.lcdc));
    if (this.lcdEnabled()) {
      this.clock += cycles;
      const oldMode = this.mode;
      switch (this.mode) {
        case this.ppuModes.hBlank:
          this.hBlank();
          break;
        case this.ppuModes.vBlank:
          this.vBlank();
          break;
        case this.ppuModes.readOAM:
          this.readOAM();
          break;
        case this.ppuModes.readVRAM:
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
      this.stat = setBit(register, this.statBits.lycLc);
      if (getBit(this.stat, this.statBits.lycLcInterrupt)) {
        enableInterrupt(this.memory, Interrupt.lcdStat);
      }
    } else {
      this.stat = clearBit(register, this.statBits.lycLc);
    }
  }
  /**
   * Resets the PPU/LCD to the beginning of the VBlank period.
   */
  public resetVBlank(): void {
    this.clock = 0;
    this.scanline = 0;
    this.mode = this.ppuModes.vBlank;
  }
  private scanlineInWindow(): boolean {
    return this.lcdc.windowEnable && this.scanline >= this.windowY;
  }
  private bgMemoryMapOffset(): word {
    const testBit = !this.scanlineInWindow()
      ? this.lcdc.bgTileMapArea
      : this.lcdc.tileMapArea;
    return testBit ? 0x9c00 : 0x9800;
  }
  private tileDataMapOffset(): word {
    return this.lcdc.bgWindowTileData ? 0x8000 : 0x8800;
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
      ? toSigned(this.memory.readByte(tileAddress))
      : this.memory.readByte(tileAddress);
    const tileLocation =
      tileDataAddress + (isSigned ? (tileId + 128) * 16 : tileId * 16);
    const line = (yPos % 8) * 2;
    const lowerByte = this.memory.readByte(tileLocation + line);
    const upperByte = this.memory.readByte(tileLocation + line + 1);

    const colorBit = -((xPos % 8) - 7);
    const colorIndex =
      (getBit(upperByte, colorBit) << 1) | getBit(lowerByte, colorBit);

    CanvasRenderer.setPixel(
      xPos,
      this.scanline,
      this.colorFromPalette(colorIndex)
    );
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
      return this.scanline - this.windowY;
    };
    const yPos = getYPos();
    const tileRow = Math.floor(yPos / 8) * 32;
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
   * Lookup the color using the currently mapped palette.
   */
  public colorFromPalette(index: number): RGB {
    switch (index) {
      case 0:
        return this.paletteMap[
          (getBit(this.palette, 1) << 1) | getBit(this.palette, 0)
        ];
      case 1:
        return this.paletteMap[
          (getBit(this.palette, 3) << 1) | getBit(this.palette, 2)
        ];
      case 2:
        return this.paletteMap[
          (getBit(this.palette, 5) << 1) | getBit(this.palette, 4)
        ];
      default:
        return this.paletteMap[
          (getBit(this.palette, 7) << 1) | getBit(this.palette, 6)
        ];
    }
  }
  /**
   * Draws a scanline.
   */
  public drawScanline(): void {
    if (this.lcdc.bgWindowEnable) {
      this.renderTiles();
    }
    if (this.lcdc.objEnable) {
      this.renderSprites();
    }
  }
}

export default PPU;
