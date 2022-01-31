import CanvasRenderer from 'CanvasRenderer/index';
import {InterruptService} from 'Interrupts/index';
import {Memory} from 'Memory/index';
import LCDControl from './LCDC';
import Stat from './Stat';

class PPU {
  private memory!: Memory;
  private interruptService!: InterruptService;
  private clock = 0;
  public lcdc!: LCDControl;
  private scanline = 0;
  public numVblankInt = 0;
  public stat!: Stat;
  private static cyclesPerMode: {[key: string]: StrNumIdx} = {
    hBlank: {
      min: 87,
      max: 204,
    },
    vBlank: {
      min: 456,
      max: 456,
    },
    readOAM: {
      min: 80,
      max: 80,
    },
    readVRAM: {
      min: 172,
      max: 289,
    },
  };

  public static dotsPerFrame = 70224;
  // internal representation of canvas
  public pixelMap!: word[][];
  public resetScanline = (): void => {
    this.stat.mode = 2;
    this.updateScanline(0);
  };
  public updateScanline = (value: byte): void => {
    this.scanline = value;
    this.memory.ram[0xff44] = value;
  };
  public scanlineCompare: byte = 0;
  public scrollX: byte = 0;
  public scrollY: byte = 0;
  public windowX: byte = 0;
  public windowY: byte = 0;
  public palette: byte = 0;
  // the current palette mapping
  public paletteMap!: number[];
  public tileData!: word[][];
  public tileMap!: byte[][];
  public signedTileMap!: byte[][];
  public timeout!: number;

  constructor() {}

  public init = (memory: Memory, interruptService: InterruptService): void => {
    this.interruptService = interruptService;
    this.memory = memory;
    this.reset();
  };

  public reset = (): void => {
    this.lcdc = new LCDControl();
    this.lcdc.update(0);
    this.stat = new Stat(this.memory, this.interruptService);
    this.pixelMap = new Array(CanvasRenderer.screenHeight)
      .fill(0)
      // number of possible tiles per line
      .map(() => new Array(21).fill(0));
    this.tileData = new Array(384).fill(0).map(() => new Array(8).fill(0));
    this.tileMap = new Array(2).fill(0).map(() => new Array(1024).fill(0));
    this.signedTileMap = new Array(2)
      .fill(0)
      .map(() => new Array(1024).fill(0));
    this.paletteMap = [0, 1, 2, 3];
    this.resetScanline();
    this.clock = 0;
    this.scanlineCompare = 0;
    this.scrollX = 0;
    this.scrollY = 0;
    this.windowX = 0;
    this.windowY = 0;
    this.palette = 0;
    this.generateStatic();
    this.timeout = window.setInterval(this.generateStatic, 10);
  };
  public generateStatic = (): void => {
    this.pixelMap = this.pixelMap.map(row =>
      row.map(() => Math.floor(Math.random() * 65535))
    );
  };
  public clearPixelMap = (): void => {
    this.pixelMap = this.pixelMap.map(row => row.map(() => 0));
  };
  public buildGraphics = (cycles: number): void => {
    if (this.lcdc.enable) {
      this.clock += cycles;
      const oldMode = this.stat.mode;
      switch (oldMode) {
        case Stat.hBlankMode:
          if (this.clock > PPU.cyclesPerMode.hBlank.max) {
            this.clock -= PPU.cyclesPerMode.hBlank.max;
            if (this.lcdc.bgWindowEnable) {
              this.buildBGScanline();
              if (this.lcdc.windowEnable) this.buildWindowScanline();
            }
            if (this.lcdc.objEnable) {
              this.buildSpriteScanline();
            }
            // should only be necessary to check this once per scanline
            this.scanlineCompareInterrupt();
            this.updateScanline(this.scanline + 1);
            if (this.scanline === 144) {
              this.scanlineCompareInterrupt();
              this.stat.mode = Stat.vBlankMode;
              this.interruptService.enable(InterruptService.flags.vBlank);
              this.numVblankInt += 1;
            } else {
              this.stat.mode = Stat.readOAMMode;
            }
          }
          break;
        case Stat.vBlankMode:
          if (this.clock > PPU.cyclesPerMode.vBlank.max) {
            this.clock -= PPU.cyclesPerMode.vBlank.max;
            this.updateScanline(this.scanline + 1);
            if (this.scanline === 154) {
              this.resetScanline();
            }
          }
          break;
        case Stat.readOAMMode:
          if (this.clock > PPU.cyclesPerMode.readOAM.max) {
            this.clock -= PPU.cyclesPerMode.readOAM.max;
            this.stat.mode = Stat.readVRAMMode;
          }
          break;
        case Stat.readVRAMMode:
          if (this.clock > PPU.cyclesPerMode.readVRAM.min) {
            this.clock -= PPU.cyclesPerMode.readVRAM.min;
            this.stat.mode = Stat.hBlankMode;
          }
          break;
      }
    } else {
      // reset vBlank
      this.clock = 0;
      this.updateScanline(0);
      this.stat.mode = Stat.vBlankMode;
    }
  };
  public scanlineCompareInterrupt = (): void => {
    const interruptFlagReset = !(
      (this.memory.readByte(0xff0f) >> InterruptService.flags.lcdStat) &
      1
    );
    if (this.scanline === this.scanlineCompare) {
      this.stat.lycLc = 1;
      // scanline compare interrupt source, again only trigger on rising edge
      if (this.stat.lycLcInterrupt && interruptFlagReset) {
        this.interruptService.enable(InterruptService.flags.lcdStat);
      }
    } else {
      this.stat.lycLc = 0;
    }
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
  public buildWindowScanline = (): void => {};
  public buildBGScanline = (): void => {
    const {
      scrollY,
      scrollX,
      lcdc,
      scanline,
      tileData,
      tileMap,
      signedTileMap,
      pixelMap,
    } = this;
    const currentLine = pixelMap[scanline];
    // there are 2 tile maps which map indices to tiles. Each map stores 32x32 tiles. Each tile index is a byte. Each tile is 8x8 pixels, which using 2bit pp means 16 bytes per tile.
    const tileMapIndex = !lcdc.bgTileMapArea ? 0 : 1;
    const currentMap =
      lcdc.bgWindowTileData === 0
        ? signedTileMap[tileMapIndex]
        : tileMap[tileMapIndex];
    // Background:
    // scy and scx specify top left origin of visible 160x144 pixel area within 256x256 tile map. If the visible area exceeds bounds of tile map, wraps around
    // Window:
    // const windowXOffset = this.windowX - 7;
    // const bgDataAddressIndex = this.bgMemoryMapIndex();
    const startCol = (scrollX >> 3) & 31;
    let tileY = scanline + scrollY;
    const tileRowOffset = ((tileY & 255) >> 3) << 5;
    tileY &= 7;
    const tileStartX = scrollX & 7;
    // When using tile lookup method 1, 8000 is the base pointer. Block 0 (8000-87ff) maps to indices 0-127 and Block 1 (8800-8fff) maps to indices 128-255
    // Using method 2, 9000 is the base pointer and the indices are signed. Indices 128-255 (or -127-0) map to block 1 and indices 0-127 map to block 2 (9000-97ff)

    // 4 scenarios, whether tileX is 0 and if the tileCol will wrap to 0
    // using this info, determine where to start/end rendering in each tile, which/how many tiles should be rendererd before the tile map wraps, and which/how many should be rendered after the tile map wraps
    let tileIndex = currentMap[startCol + tileRowOffset];

    // first chunk of 8 pixels
    currentLine[0] =
      tileData[tileIndex][tileY] & ((1 << (16 - tileStartX * 2)) - 1);

    let currentTile = 1;
    // if tile start x isn't 0, add 1 to the number of chunks to account for offset of first tile
    const numRemainderChunks = (160 - (8 - tileStartX)) >> 3;
    const maxTilesPrewrap =
      Math.min(numRemainderChunks, 32 - startCol) + startCol;
    let currentCol = startCol + 1;

    for (
      currentCol;
      currentCol < maxTilesPrewrap;
      currentCol++, currentTile++
    ) {
      tileIndex = currentMap[currentCol + tileRowOffset];
      currentLine[currentTile] = tileData[tileIndex][tileY];
    }

    const numTilesPostwrap = numRemainderChunks - (32 - startCol);

    for (
      currentCol = 0;
      currentCol < numTilesPostwrap;
      currentCol++, currentTile++
    ) {
      tileIndex = currentMap[currentCol + tileRowOffset];
      currentLine[currentTile] = tileData[tileIndex][tileY];
    }

    // last chunk
    tileIndex = currentMap[currentCol + tileRowOffset];
    currentLine[currentTile] =
      tileData[tileIndex][tileY] >> (16 - tileStartX * 2);
  };
  public buildSpriteScanline = (): void => {};
}

export {PPU};
