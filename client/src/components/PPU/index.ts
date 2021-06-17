import benchmark, {benchmarksEnabled} from '../../helpers/Performance';
import {
  byte,
  clearBit,
  getBit,
  lower,
  setBit,
  toSigned,
  upper,
  word,
} from '../../helpers/Primitives';
import type {ColorScheme, RGB} from '../CanvasRenderer';
import CanvasRenderer from '../CanvasRenderer';
import Interrupt, {enableInterrupt} from '../Interrupts';
import Memory from '../Memory';
import PPUControl from './Control';

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
  get lcdc(): PPUControl {
    return this._lcdc;
  }
  private scanlineClockMod = 5;
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
  // internal representation of canvas, copied over during update
  private pixelMap!: Array<Array<byte>>;
  // color scheme used by renderer
  private colorScheme!: Array<RGB>;
  // stat register
  private _stat = 0;
  get stat(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.stat);
  }
  set stat(value) {
    this._stat = value;
    this._mode = value & 0b11;
    this.memory.writeByte(this.memory.addresses.ppu.stat, value);
  }
  private _mode = 2;
  set mode(value) {
    let register: byte = this.stat;
    register = clearBit(register, this.statBits.modeLower);
    register = clearBit(register, this.statBits.modeUpper);
    register |= value;
    this.stat = register;
  }
  get mode(): byte {
    // if (this._mode !== (this.memory.readByte(this.memory.addresses.ppu.stat) & 0b11))
    // throw new Error('Mismatch in stat value from class and this.memory.');
    return this.memory.readByte(this.memory.addresses.ppu.stat) & 0b11;
  }
  // clock used to determine the draw mode, elapsed according to cpu t-states
  private _clock = 0;
  get clock(): number {
    return this._clock;
  }
  set clock(value) {
    this._clock = value;
  }
  // the scanline currently being rendererd (0-153)
  private _scanline = 0;
  get scanline(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scanline);
  }
  set scanline(value) {
    this.memory.updateScanline(value);
    this._scanline = value;
  }
  private _scanlineCompare = 0;
  get scanlineCompare(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scanlineCompare);
  }
  set scanlineCompare(value) {
    this.memory.writeByte(this.memory.addresses.ppu.scanlineCompare, value);
    this._scanlineCompare = value;
  }
  private _scrollX = 0;
  get scrollX(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scrollX);
  }
  set scrollX(value) {
    this._scrollX = value;
    this.memory.writeByte(this.memory.addresses.ppu.scrollX, value);
  }
  private _scrollY = 0;
  get scrollY(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.scrollY);
  }
  set scrollY(value) {
    this._scrollY = value;
    this.memory.writeByte(this.memory.addresses.ppu.scrollY, value);
  }
  private _windowX = 0;
  get windowX(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.windowX);
  }
  set windowX(value) {
    this._windowX = value;
    this.memory.writeByte(this.memory.addresses.ppu.windowX, value);
  }
  private _windowY = 0;
  get windowY(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.windowY);
  }
  set windowY(value) {
    this._windowY = value;
    this.memory.writeByte(this.memory.addresses.ppu.windowY, value);
  }

  private _palette = 0;
  // the current palette mapping
  private paletteMap: Array<number> = new Array(4);
  get palette(): byte {
    return this.memory.readByte(this.memory.addresses.ppu.paletteData);
  }
  set palette(value) {
    this._palette = value;
    this.memory.writeByte(this.memory.addresses.ppu.paletteData, value);
  }
  constructor(memory: Memory) {
    this.memory = memory;
    this._lcdc = new PPUControl();
    this.pixelMap = new Array(CanvasRenderer.screenHeight);
    for (let y = 0; y < CanvasRenderer.screenHeight; y++) {
      this.pixelMap[y] = new Array(CanvasRenderer.screenWidth);
    }
    this.reset();
    if (benchmarksEnabled) {
      this.buildGraphics = benchmark(this.buildGraphics.bind(this), this);
      this.drawScanline = benchmark(this.drawScanline.bind(this), this);
      this.renderTiles = benchmark(this.renderTiles.bind(this), this);
      this.readOAM = benchmark(this.readOAM.bind(this), this);
      this.readVRAM = benchmark(this.readVRAM.bind(this), this);
      this.vBlank = benchmark(this.vBlank.bind(this), this);
      this.hBlank = benchmark(this.hBlank.bind(this), this);
      this.lcdInterrupt = benchmark(this.lcdInterrupt.bind(this), this);
    }
  }
  /**
   * Sets the color scheme mapping for palettes.
   */
  setColorScheme(scheme: ColorScheme): void {
    this.colorScheme[0] = scheme.white;
    this.colorScheme[1] = scheme.lightGray;
    this.colorScheme[2] = scheme.darkGray;
    this.colorScheme[3] = scheme.black;
  }
  /**
   * Resets the PPU.
   */
  public reset = (): void => {
    this.lcdc.update(0);
    for (let y = 0; y < this.pixelMap.length; y++) {
      for (let x = 0; x < this.pixelMap[0].length; x++) {
        this.pixelMap[y][x] = 0;
      }
    }
    this.paletteMap = new Array(4);
    this.colorScheme = new Array(4);
    this._stat = 0;
    this._mode = 2;
    this._clock = 0;
    this._scanline = 0;
    this._scanlineCompare = 0;
    this._scrollX = 0;
    this._scrollY = 0;
    this._windowX = 0;
    this._windowY = 0;
    this._palette = 0;
  };
  /**
   * Returns whether lcd is enabled.
   */
  public lcdEnabled = (): boolean => {
    return this._lcdc.LCDPPU === 1;
  };
  /**
   * Vertical blanking period.
   */
  private vBlank = (): void => {
    if (this.clock >= 456) {
      this.scanline = this.scanline + 1;
      this.clock = 0;
      if (this.scanline > 153) {
        this.mode = this.ppuModes.readOAM;
        this.scanline = 0;
      }
    }
  };
  /**
   * Horizontal blanking period.
   */
  private hBlank = (): void => {
    if (this.clock >= 204) {
      this.scanline = this.scanline + 1;
      if (this.scanline === CanvasRenderer.screenHeight) {
        this.mode = this.ppuModes.vBlank;
        enableInterrupt(this.memory, Interrupt.vBlank);
      } else {
        this.mode = this.ppuModes.readOAM;
      }
    }
  };
  private readOAM = (): void => {
    if (this.clock >= 80) {
      this.mode = this.ppuModes.readVRAM;
    }
  };
  private readVRAM = (): void => {
    if (this.clock >= 172) {
      this.mode = this.ppuModes.hBlank;
    }
    // sanctioned screen tearing to improve performance
    if (this.clock % this.scanlineClockMod === 0) this.drawScanline();
    this.scanlineClockMod += 1;
    if (this.scanlineClockMod === 40) {
      this.scanlineClockMod = 8;
    }
  };
  private lcdInterrupt = (switchedMode: boolean): void => {
    const interruptBit = this.statBits.interrupt[this.mode];
    // only certain modes trigger an interrupt
    if (interruptBit >= 0) {
      const interruptModeBit = getBit(this.stat, interruptBit);
      if (interruptModeBit && switchedMode) {
        enableInterrupt(this.memory, Interrupt.lcdStat);
      }
    }
  };
  /**
   * Sends scanlines to the renderer.
   */
  public buildGraphics = (cycles: number): void => {
    this.paletteMap[0] =
      (getBit(this.palette, 1) << 1) | getBit(this.palette, 0);
    this.paletteMap[1] =
      (getBit(this.palette, 3) << 1) | getBit(this.palette, 2);
    this.paletteMap[2] =
      (getBit(this.palette, 5) << 1) | getBit(this.palette, 4);
    this.paletteMap[3] =
      (getBit(this.palette, 7) << 1) | getBit(this.palette, 6);
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
  };
  /**
   * Compares the scanline/scanline compare registers and toggles appropriate bits.
   */
  public compareLcLyc = (): void => {
    const register: byte = this.stat;
    if (this.scanline === this.scanlineCompare) {
      this.stat = setBit(register, this.statBits.lycLc);
      if (getBit(this.stat, this.statBits.lycLcInterrupt)) {
        enableInterrupt(this.memory, Interrupt.lcdStat);
      }
    } else {
      this.stat = clearBit(register, this.statBits.lycLc);
    }
  };
  /**
   * Resets the PPU/LCD to the beginning of the VBlank period.
   */
  public resetVBlank = (): void => {
    this.clock = 0;
    this.scanline = 0;
    this.mode = this.ppuModes.vBlank;
  };
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
   * Renders tiles.
   */
  public renderTiles = (): void => {
    const windowXOffset = this.windowX - 7;
    const tileDataAddress = this.tileDataMapOffset();
    const isSigned = tileDataAddress === 0x8800;
    const bgDataAddress = this.bgMemoryMapOffset();
    let yPos;
    const scanlineInWindow =
      this.lcdc.windowEnable && this.scanline >= this.windowY;
    if (!scanlineInWindow) {
      yPos = this.scrollY + this.scanline;
    } else {
      yPos = this.scanline - this.windowY;
    }
    const line = (yPos % 8) * 2;
    const tileRow = Math.floor(yPos / 8) * 32;
    const tileAddress = bgDataAddress + tileRow;
    for (let x = 0; x < CanvasRenderer.screenWidth; x++) {
      let xPos;
      if (scanlineInWindow && x >= windowXOffset) {
        xPos = x - windowXOffset;
      } else {
        xPos = x + this.scrollX;
      }
      const tileCol = Math.floor(xPos / 8);
      const tileAddressX = tileAddress + tileCol;
      const tileId = isSigned
        ? toSigned(this.memory.readByte(tileAddressX))
        : this.memory.readByte(tileAddressX);
      const tileLocation =
        tileDataAddress + (isSigned ? (tileId + 128) * 16 : tileId * 16);
      const tile = this.memory.readWord(tileLocation + line);
      const colorBit = -((xPos % 8) - 7);
      const colorIndex =
        (getBit(upper(tile), colorBit) << 1) | getBit(lower(tile), colorBit);

      this.pixelMap[this.scanline][xPos] = this.paletteMap[colorIndex];
      CanvasRenderer.setPixel(
        xPos,
        this.scanline,
        this.colorScheme[this.pixelMap[this.scanline][xPos]]
      );
    }
  };
  /**
   * Renders sprites.
   */
  public renderSprites = (): void => {};
  /**
   * Draws a scanline.
   */
  public drawScanline = (): void => {
    if (this.lcdc.bgWindowEnable) {
      this.renderTiles();
    }
    if (this.lcdc.objEnable) {
      this.renderSprites();
    }
  };
}

export default PPU;
