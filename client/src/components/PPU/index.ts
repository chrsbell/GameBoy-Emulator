import CanvasRenderer from 'CanvasRenderer/index';
import Primitive from 'helpers/Primitives';
import InterruptService from 'Interrupts/index';
import Memory from 'Memory/index';
import PPUBridge from 'Memory/PPUBridge';
import PPUControl from './LCDC';

type StatBitsType = {
  modeLower: number;
  modeUpper: number;
  lycLc: number;
  interrupt: NumNumIdx;
  lycLcInterrupt: number;
};

class PPU {
  private ppuBridge!: PPUBridge;
  private interruptService!: InterruptService;
  private _lcdc!: PPUControl;
  private scanlineClockMod = 5;
  get lcdc(): PPUControl {
    return this._lcdc;
  }
  private static ppuModes: StrNumIdx = {
    hBlank: 0,
    vBlank: 1,
    readOAM: 2,
    readVRAM: 3,
  };
  private static statBits: StatBitsType = {
    modeLower: 0,
    modeUpper: 1,
    lycLc: 2,
    interrupt: {
      [PPU.ppuModes.hBlank]: 3,
      [PPU.ppuModes.vBlank]: 4,
      [PPU.ppuModes.readOAM]: 5,
      [PPU.ppuModes.readVRAM]: -1, // no interrupt bit
    },
    lycLcInterrupt: 6,
  };
  // internal representation of canvas, copied over during update
  public pixelMap!: byte[][];
  // stat register
  private _stat = 0;
  set stat(value: number) {
    this._stat = value;
    this._mode = value & 0b11;
    this.ppuBridge.writeIORamOnly(Memory.addresses.ppu.stat, this._stat);
  }
  get stat(): number {
    return this._stat;
  }
  private _mode = 2;
  set mode(value: number) {
    this._mode = value;
    this._stat = Primitive.clearBit(this._stat, PPU.statBits.modeLower);
    this._stat = Primitive.clearBit(this._stat, PPU.statBits.modeUpper);
    this._stat |= value;
    this.ppuBridge.writeIORamOnly(Memory.addresses.ppu.stat, this._stat);
  }
  get mode(): number {
    return this.stat & 0b11;
  }
  // clock used to determine the draw mode, elapsed according to cpu t-states
  private clock = 0;
  // the scanline currently being rendererd (0-153)
  private scanline = 0;
  public updateScanline = (value: byte): void => {
    this.scanline = value;
    this.ppuBridge.updateScanline(value);
  };
  public scanlineCompare: byte = 0;
  public scrollX: byte = 0;
  public scrollY: byte = 0;
  public windowX: byte = 0;
  public windowY: byte = 0;
  public palette: byte = 0;
  // the current palette mapping
  public paletteMap!: number[];
  public tileData!: byte[][][];
  public tileMap!: byte[][];
  constructor(ppuBridge: PPUBridge, interruptService: InterruptService) {
    this.interruptService = interruptService;
    this.ppuBridge = ppuBridge;
    this._lcdc = new PPUControl();
  }
  public reset = (): void => {
    this.lcdc.update(0);
    this.pixelMap = new Array(CanvasRenderer.screenHeight)
      .fill(0)
      .map(y => new Array(CanvasRenderer.screenWidth).fill(0));
    this.tileData = new Array(384)
      .fill(0)
      .map(y => new Array(8).fill(0).map(x => new Array(8).fill(0)));
    this.tileMap = new Array(2).fill(0).map(m => new Array(1024).fill(0));
    this.paletteMap = [0, 0, 0, 0];
    this.stat = 0;
    this.mode = 2;
    this.clock = 0;
    this.scanline = 0;
    this.scanlineCompare = 0;
    this.scrollX = 0;
    this.scrollY = 0;
    this.windowX = 0;
    this.windowY = 0;
    this.palette = 0;
  };
  private vBlank = (canvasRenderer: CanvasRenderer): void => {
    if (this.clock >= 456) {
      this.updateScanline(this.scanline + 1);
      this.clock = 0;
      if (this.scanline > 153) {
        this.mode = PPU.ppuModes.readOAM;
        this.updateScanline(0);
      }
    }
  };
  private hBlank = (): void => {
    if (this.clock >= 204) {
      this.drawScanline();
      this.updateScanline(this.scanline + 1);
      if (this.scanline === CanvasRenderer.screenHeight) {
        this.mode = PPU.ppuModes.vBlank;
        this.interruptService.enable(InterruptService.flags.vBlank);
      } else {
        this.mode = PPU.ppuModes.readOAM;
      }
    }
  };
  private readOAM = (): void => {
    if (this.clock >= 80) {
      this.mode = PPU.ppuModes.readVRAM;
    }
  };
  private readVRAM = (): void => {
    if (this.clock >= 172) {
      this.mode = PPU.ppuModes.hBlank;
    }
  };
  private lcdInterrupt = (switchedMode: boolean): void => {
    const interruptBit = PPU.statBits.interrupt[this.mode];
    // only certain modes trigger an interrupt
    if (interruptBit >= 0) {
      const interruptModeBit = Primitive.getBit(this.stat, interruptBit);
      if (interruptModeBit && switchedMode) {
        this.interruptService.enable(InterruptService.flags.lcdStat);
      }
    }
  };
  /**
   * Updates internal representation of graphics
   */
  public buildGraphics = (
    canvasRenderer: CanvasRenderer,
    cycles: number
  ): void => {
    if (this.lcdc.enable) {
      this.clock += cycles;
      const oldMode = this.mode;
      switch (this.mode) {
        case PPU.ppuModes.hBlank:
          this.hBlank();
          break;
        case PPU.ppuModes.vBlank:
          this.vBlank(canvasRenderer);
          break;
        case PPU.ppuModes.readOAM:
          this.readOAM();
          break;
        case PPU.ppuModes.readVRAM:
          this.readVRAM();
          break;
      }
      this.lcdInterrupt(oldMode !== this.mode);
      this.compareLcLyc();
    } else {
      this.resetVBlank();
    }
  };
  public compareLcLyc = (): void => {
    const register: byte = this.stat;
    if (this.scanline === this.scanlineCompare) {
      this.stat = Primitive.setBit(register, PPU.statBits.lycLc);
      if (Primitive.getBit(this.stat, PPU.statBits.lycLcInterrupt)) {
        this.interruptService.enable(InterruptService.flags.lcdStat);
      }
    } else {
      this.stat = Primitive.clearBit(register, PPU.statBits.lycLc);
    }
    this.ppuBridge.writeIORam(Memory.addresses.ppu.stat, this.stat);
  };
  public resetVBlank = (): void => {
    this.clock = 0;
    this.scanline = 0;
    this.mode = PPU.ppuModes.vBlank;
  };
  private windowVisible(): boolean {
    return (
      this.lcdc.windowEnable &&
      this.windowY <= CanvasRenderer.screenHeight &&
      this.windowX <= CanvasRenderer.screenWidth
    );
  }
  private tileMapMemoryIndex(): word {
    const testBit = !this.windowVisible()
      ? this.lcdc.bgTileMapArea
      : this.lcdc.windowTileMapArea;
    return testBit ? 0x9c00 : 0x9800;
  }
  public renderTiles = (): void => {
    // there are 2 tile maps which map indices to tiles. Each map stores 32x32 tiles. Each tile index is a byte. Each tile is 8x8 pixels, which using 2bpp means 16 bytes per tile.

    const mapIndex = !this.lcdc.bgTileMapArea ? 0 : 1;

    // Background:
    // scy and scx specify top left origin of visible 160x144 pixel area within 256x256 tile map. If the visible area exceeds bounds of tile map, wraps around

    // Window:
    // const windowXOffset = this.windowX - 7;
    // const bgDataAddressIndex = this.bgMemoryMapIndex();
    let tileCol = (this.scrollX >> 3) & 31;
    const tileYOffset = this.scanline + this.scrollY;
    const tileRow = Primitive.toByte(tileYOffset) >> 3;

    let tileIndex = this.tileMap[mapIndex][tileCol + (tileRow << 5)];

    let tileX = this.scrollX & 7;
    let tileY = this.tileData[tileIndex][tileYOffset & 7];

    // When using tile lookup method 1, 8000 is the base pointer. Block 0 (8000-87ff) maps to indices 0-127 and Block 1 (8800-8fff) maps to indices 128-255

    // Using method 2, 9000 is the base pointer and the indices are signed. Indices 128-255 (or -127-0) map to block 1 and indices 0-127 map to block 2 (9000-97ff)
    const isSigned = this.lcdc.bgWindowTileData === 0;
    // start from block 2 if using signed data
    if (isSigned && tileIndex <= 127) tileIndex += 256;
    for (let x = 0; x < CanvasRenderer.screenWidth; x++) {
      this.pixelMap[this.scanline][x] = this.paletteMap[tileY[tileX]];
      tileX += 1;
      if (tileX === 8) {
        tileX = 0;
        tileCol += 1;
        // wrap around screen if reached last tile
        if (tileCol === 32) tileCol = 0;
        tileIndex = this.tileMap[mapIndex][tileCol + (tileRow << 5)];
        if (isSigned && tileIndex <= 127) tileIndex += 256;
        tileY = this.tileData[tileIndex][(this.scanline + this.scrollY) & 7];
      }
    }
  };
  public renderSprites = (): void => {};
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
