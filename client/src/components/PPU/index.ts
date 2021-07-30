import CanvasRenderer from 'CanvasRenderer/index';
import benchmark from 'helpers/Performance';
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
    this.buildGraphics = benchmark(this, 'buildGraphics');
    this.drawScanline = benchmark(this, 'drawScanline');
    this.renderTiles = benchmark(this, 'renderTiles');
    this.readOAM = benchmark(this, 'readOAM');
    this.readVRAM = benchmark(this, 'readVRAM');
    this.vBlank = benchmark(this, 'vBlank');
    this.hBlank = benchmark(this, 'hBlank');
    this.lcdInterrupt = benchmark(this, 'lcdInterrupt');
  }
  public reset = (): void => {
    this.lcdc.update(0);
    this.pixelMap = new Array(CanvasRenderer.screenHeight).fill(
      new Array(CanvasRenderer.screenWidth).fill(0)
    );
    this.tileData = new Array(384).fill(
      new Array(8).fill(new Array(8).fill(0))
    );
    this.tileMap = new Array(2).fill(new Array(1024).fill(0));
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
  private vBlank = (): void => {
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
    this.drawScanline();
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
  public buildGraphics = (cycles: number): void => {
    this.paletteMap[0] =
      (Primitive.getBit(this.palette, 1) << 1) |
      Primitive.getBit(this.palette, 0);
    this.paletteMap[1] =
      (Primitive.getBit(this.palette, 3) << 1) |
      Primitive.getBit(this.palette, 2);
    this.paletteMap[2] =
      (Primitive.getBit(this.palette, 5) << 1) |
      Primitive.getBit(this.palette, 4);
    this.paletteMap[3] =
      (Primitive.getBit(this.palette, 7) << 1) |
      Primitive.getBit(this.palette, 6);
    if (this.lcdc.enable) {
      this.clock += cycles;
      const oldMode = this.mode;
      switch (this.mode) {
        case PPU.ppuModes.hBlank:
          this.hBlank();
          break;
        case PPU.ppuModes.vBlank:
          this.vBlank();
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
      console.log('scanline compare condition');
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
    // there are 2 tile maps which map indices to tiles. Each map stores 32x32 tiles.Each tile index is a byte.

    // which tile map to use?
    // const tileMapOffset = this.tileMapMemoryIndex() - 0x1800;

    // const windowVisible = this.windowVisible();
    const tileMapMode = this.lcdc.bgTileMapArea;

    // ? this.lcdc.windowTileMapArea
    // : this.lcdc.bgTileMapArea;
    const mapIndex = !tileMapMode ? 0 : 1;
    // const mapOffset = mapIndex ? 0x1c00 : 0x1800;
    // Background:
    // scy and scx specify top left origin of visible 160x144 pixel area within 256x256 tile map. If the visible area exceeds bounds of tile map, wraps around

    // Window:
    // const windowXOffset = this.windowX - 7;
    // const bgDataAddressIndex = this.bgMemoryMapIndex();
    // if (bgDataAddressIndex === 1) {
    // }
    // tile index x offset
    // if (this.scrollY !== 80 && this.scrollY !== 100) console.log(this.scrollY);
    // this.scrollY = 0;
    let tileCol = (this.scrollX / 8) & 31;
    const tileRow = Math.floor(
      Primitive.toByte(this.scanline + this.scrollY) / 8
    );
    // console.log(`tile x index: ${tileCol}, y index: ${tileRow}`);
    let tileIndex =
      // this.memory.vRAM[mapOffset + tileCol + tileRow];
      this.tileMap[0][tileCol + tileRow * 32];

    // if (
    //   [
    //     0x110,
    //     0x12f,
    //     0x12e,
    //     0x12d,
    //     0x12c,
    //     0x12b,
    //     0x12a,
    //     0x129,
    //     0x128,
    //     0x127,
    //     0x126,
    //     0x125,
    //     0x124,
    //     0x10f,
    //     0x10e,
    //     0x10d,
    //     0x10c,
    //     0x10b,
    //     0x10a,
    //     0x109,
    //     0x108,
    //     0x107,
    //     0x106,
    //     0x105,
    //     0x104,
    //   ].includes(addr)
    // )
    //   console.log(`map index: ${Primitive.toHex(tileCol + tileRow * 32)}`);

    let tileX = this.scrollX & 7;
    const tileY = (this.scanline + this.scrollY) & 7;
    // const windowVisible =
    // this.lcdc.windowEnable && this.scanline >= this.windowY;
    // if (!windowVisible) {
    //   yPos = this.scrollY + this.scanline;
    // } else {
    //   yPos = this.scanline - this.windowY;
    // }
    // which tile data to use?
    // When using tile lookup method 1, 8000 is the base pointer. Block 0 (8000-87ff) maps to indices 0-127 and Block 1 (8800-8fff) maps to indices 128-255

    // Using method 2, 9000 is the base pointer and the indices are signed. Indices 128-255 (or -127-0) map to block 1 and indices 0-127 map to block 2 (9000-97ff)
    // let yPos;
    const tileDataBaseAddress = this.lcdc.bgWindowTileData ? 0x8000 : 0x9000;
    const isSigned = tileDataBaseAddress === 0x9000;
    // console.log(isSigned);
    // console.log(tileDataBaseAddress);
    // console.log(!tileMapMode ? '9800' : '9c00');
    // start from block 2 if using signed data
    if (tileIndex <= 127) tileIndex += 256;
    for (let x = 0; x < CanvasRenderer.screenWidth; x++) {
      // let xPos;
      // if (windowVisible && x >= windowXOffset) {
      //   xPos = x - windowXOffset;
      // } else {
      //   xPos = x + this.scrollX;
      // }
      this.pixelMap[this.scanline][x] = [0, 1, 2, 3][
        this.tileData[tileIndex][tileY][tileX]
      ];

      // if (
      //   [
      //     0x110,
      //     0x12f,
      //     0x12e,
      //     0x12d,
      //     0x12c,
      //     0x12b,
      //     0x12a,
      //     0x129,
      //     0x128,
      //     0x127,
      //     0x126,
      //     0x125,
      //     0x124,
      //     0x10f,
      //     0x10e,
      //     0x10d,
      //     0x10c,
      //     0x10b,
      //     0x10a,
      //     0x109,
      //     0x108,
      //     0x107,
      //     0x106,
      //     0x105,
      //     0x104,
      //   ].includes(tileCol + tileRow * 32)
      // )
      //   console.log(`tile data: ${this.tileData[tileIndex][tileY][tileX]}`);
      // console.log(
      //   `map index: ${Primitive.toHex(
      //     tileCol + tileRow * 32
      //   )}, tile index: ${tileIndex}`
      // );

      // if (this.tileData[tileIndex][tileY][tileX])

      tileX += 1;
      if (tileX === 8) {
        tileX = 0;
        tileCol += 1;
        // wrap around screen if reached last tile
        if (tileCol === 32) tileCol = 0;
        tileIndex = this.tileMap[0][tileCol + tileRow * 32];
        if (tileIndex <= 127) tileIndex += 256;
        // console.log(isSigned);
        // if (isSigned && tileIndex <= 127) tileIndex += 256;
      }
      // const tileCol = Math.floor(xPos / 8);
      // const tileAddressX = tileAddress + tileCol;
      // const tileId = isSigned
      //   ? Primitive.toSigned(this.memory.readByte(tileAddressX))
      //   : this.memory.readByte(tileAddressX);
      // const tileLocation =
      //   tileDataAddress + (isSigned ? (tileId + 128) * 16 : tileId * 16);
      // const tile = this.memory.readWord(tileLocation + line);
      // const colorBit = -((xPos % 8) - 7);
      // const colorIndex =
      //   (Primitive.getBit(Primitive.upper(tile), colorBit) << 1) |
      //   Primitive.getBit(Primitive.lower(tile), colorBit);

      // this.pixelMap[this.scanline][xPos] = this.paletteMap[colorIndex];
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
