import CanvasRenderer from 'CanvasRenderer/index';
import {Primitive} from 'helpers/index';
import InterruptService from 'Interrupts/index';
import PPUBridge from 'Memory/PPUBridge';
import PPUControl from './LCDC';

type StatBitsType = {
  modeLower: number;
  modeUpper: number;
  lycLc: number;
  interrupt: StrNumIdx;
  lycLcInterrupt: number;
};

let ppuBridgeRef!: PPUBridge;
let interruptServiceRef!: InterruptService;
// clock used to determine the draw mode, elapsed according to cpu t-states
let clock = 0;
// the scanline currently being rendererd (0-153)
let scanline = 0;
let mode = 2;
// stat register
let stat = 2;
let paletteMapRef!: number[];
let tileDataRef!: word[][][];
let tileMapRef!: byte[][];
let pixelMapRef!: byte[][];
let lcdc!: PPUControl;

const interruptBitForMode: NumNumIdx = {
  0: 3,
  1: 4,
  2: 5,
};

class PPU {
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
      hBlank: 3,
      vBlank: 4,
      readOAM: 5,
    },
    lycLcInterrupt: 6,
  };
  // internal representation of canvas
  public pixelMap!: byte[][];
  public getLCDC = (): PPUControl => lcdc;
  public setStat = (value: number): void => {
    stat = value;
    mode = value & 0b11;
    // ppuBridgeRef.writeIORam(0xff41, stat);
    // this is being written twice for now...
    ppuBridgeRef.memory.ram[0xff41] = stat;
    if (interruptBitForMode[mode])
      this.modeSwitchInterrupt(interruptBitForMode[mode]);
  };
  public resetScanline = (): void => {
    this.setMode(2);
    // writing to ram twice also if called from ppubridge...
    this.updateScanline(0);
  };
  public setMode = (value: number): void => {
    mode = value;
    stat = ((stat >> 2) << 2) | value;
    // ppuBridgeRef.writeIORam(0xff41, stat);
    ppuBridgeRef.memory.ram[0xff41] = stat;
    if (interruptBitForMode[mode])
      this.modeSwitchInterrupt(interruptBitForMode[mode]);
  };
  public updateScanline = (value: byte): void => {
    scanline = value;
    ppuBridgeRef.memory.ram[0xff44] = value;
  };
  public scanlineCompare: byte = 0;
  public scrollX: byte = 0;
  public scrollY: byte = 0;
  public windowX: byte = 0;
  public windowY: byte = 0;
  public palette: byte = 0;
  // the current palette mapping
  public paletteMap!: number[];
  public tileData!: word[][][];
  public tileMap!: byte[][];
  constructor(ppuBridge: PPUBridge, interruptService: InterruptService) {
    interruptServiceRef = interruptService;
    ppuBridgeRef = ppuBridge;
    this.reset();
  }
  public reset = (): void => {
    lcdc = new PPUControl();
    lcdc.update(0);
    this.pixelMap = new Array(CanvasRenderer.screenHeight)
      .fill(0)
      .map(() => new Array(CanvasRenderer.screenWidth).fill(0));
    pixelMapRef = this.pixelMap;
    this.tileData = new Array(384)
      .fill(0)
      .map(() => new Array(8).fill(0).map(() => new Array(8).fill(0)));
    tileDataRef = this.tileData;
    this.tileMap = new Array(2).fill(0).map(() => new Array(1024).fill(0));
    tileMapRef = this.tileMap;
    this.paletteMap = [0, 0, 0, 0];
    paletteMapRef = this.paletteMap;
    this.resetScanline();
    clock = 0;
    this.scanlineCompare = 0;
    this.scrollX = 0;
    this.scrollY = 0;
    this.windowX = 0;
    this.windowY = 0;
    this.palette = 0;
  };
  private vBlank = (): void => {
    if (clock >= 456) {
      this.updateScanline(scanline + 1);
      clock = 0;
      if (scanline > 153) {
        this.setMode(PPU.ppuModes.readOAM);
        this.updateScanline(0);
      }
    }
  };
  private hBlank = (): void => {
    if (clock >= 204) {
      this.drawScanline();
      this.updateScanline(scanline + 1);
      if (scanline === CanvasRenderer.screenHeight) {
        this.setMode(PPU.ppuModes.vBlank);
        interruptServiceRef.enable(InterruptService.flags.vBlank);
      } else {
        this.setMode(PPU.ppuModes.readOAM);
      }
    }
  };
  private readOAM = (): void => {
    if (clock >= 80) {
      this.setMode(PPU.ppuModes.readVRAM);
    }
  };
  private readVRAM = (): void => {
    if (clock >= 172) {
      this.setMode(PPU.ppuModes.hBlank);
    }
  };
  /**
   * Checks each STAT interrupt source bit and sets lcdStat bit in IF if toggled.
   * @param interruptBit
   */
  private modeSwitchInterrupt = (interruptBit: bit): void => {
    // trigger stat interrupt if transitioning from low to high (STAT blocking)
    const interruptFlagReset = !(
      (ppuBridgeRef.memory.readByte(0xff0f) >> InterruptService.flags.lcdStat) &
      1
    );
    // mode switch interrupt source
    if ((stat >> interruptBit) & 1 && interruptFlagReset) {
      interruptServiceRef.enable(InterruptService.flags.lcdStat);
    }
  };
  /**
   * Updates internal representation of graphics
   */
  public buildGraphics = (cycles: number): void => {
    if (lcdc.enable) {
      clock += cycles;
      const oldMode = mode;
      switch (oldMode) {
        // HBlank
        case 0:
          if (clock >= 204) {
            if (lcdc.bgWindowEnable) {
              this.renderTiles();
            }
            if (lcdc.objEnable) {
              this.renderSprites();
            }
            this.updateScanline(scanline + 1);
            if (scanline === 144) {
              this.setMode(1);
              interruptServiceRef.enable(InterruptService.flags.vBlank);
            } else {
              this.setMode(2);
            }
          }
          break;
        // VBlank
        case 1:
          if (clock >= 456) {
            this.updateScanline(scanline + 1);
            clock = 0;
            if (scanline > 153) {
              this.resetScanline();
            }
          }
          break;
        // Read OAM
        case 2:
          if (clock >= 80) {
            this.setMode(PPU.ppuModes.readVRAM);
          }
          break;
        // Read VRAM
        case 3:
          if (clock >= 172) {
            this.setMode(PPU.ppuModes.hBlank);
          }
          break;
      }
      this.scanlineCompareInterrupt();
    } else {
      // reset vBlank
      clock = 0;
      this.updateScanline(0);
      this.setMode(PPU.ppuModes.vBlank);
    }
  };
  public scanlineCompareInterrupt = (): void => {
    const register: byte = stat;
    if (scanline === this.scanlineCompare) {
      this.setStat(Primitive.setBit(register, PPU.statBits.lycLc));
      // scanline compare interrupt source
      if ((stat >> PPU.statBits.lycLcInterrupt) & 1) {
        interruptServiceRef.enable(InterruptService.flags.lcdStat);
      }
    } else {
      this.setStat(Primitive.clearBit(register, PPU.statBits.lycLc));
    }
  };
  private windowVisible(): boolean {
    return (
      lcdc.windowEnable &&
      this.windowY <= CanvasRenderer.screenHeight &&
      this.windowX <= CanvasRenderer.screenWidth
    );
  }
  private tileMapMemoryIndex(): word {
    const testBit = !this.windowVisible()
      ? lcdc.bgTileMapArea
      : lcdc.windowTileMapArea;
    return testBit ? 0x9c00 : 0x9800;
  }
  public renderTiles = (): void => {
    const {scrollY, scrollX} = this;
    const currentLine = pixelMapRef[scanline];
    // there are 2 tile maps which map indices to tiles. Each map stores 32x32 tiles. Each tile index is a byte. Each tile is 8x8 pixels, which using 2bpp means 16 bytes per tile.
    const currentMap = tileMapRef[!lcdc.bgTileMapArea ? 0 : 1];
    // Background:
    // scy and scx specify top left origin of visible 160x144 pixel area within 256x256 tile map. If the visible area exceeds bounds of tile map, wraps around
    // Window:
    // const windowXOffset = this.windowX - 7;
    // const bgDataAddressIndex = this.bgMemoryMapIndex();
    let tileCol = (scrollX >> 3) & 31;
    const tileYOffset = scanline + scrollY;
    const tileRow = (tileYOffset & 255) >> 3;
    let tileIndex = currentMap[tileCol + (tileRow << 5)];
    const isSigned = lcdc.bgWindowTileData === 0;
    // start from block 2 if using signed data
    if (isSigned && tileIndex <= 127) tileIndex += 256;
    let tileX = scrollX & 7;
    let tileY = tileDataRef[tileIndex][tileYOffset & 7];
    // When using tile lookup method 1, 8000 is the base pointer. Block 0 (8000-87ff) maps to indices 0-127 and Block 1 (8800-8fff) maps to indices 128-255
    // Using method 2, 9000 is the base pointer and the indices are signed. Indices 128-255 (or -127-0) map to block 1 and indices 0-127 map to block 2 (9000-97ff)
    for (let x = 0; x < 160; x++) {
      for (tileX; tileX < 7; tileX++) {
        currentLine[x] = paletteMapRef[tileY[tileX]];
        x += 1;
      }
      currentLine[x] = paletteMapRef[tileY[tileX]];
      tileX = 0;
      tileCol += 1;
      // wrap around screen if reached last tile
      if (tileCol === 32) tileCol = 0;
      tileIndex = currentMap[tileCol + (tileRow << 5)];
      if (isSigned && tileIndex <= 127) tileIndex += 256;
      tileY = tileDataRef[tileIndex][(scanline + scrollY) & 7];
    }
  };
  public renderSprites = (): void => {};
  public drawScanline = (): void => {
    if (lcdc.bgWindowEnable) {
      this.renderTiles();
    }
    if (lcdc.objEnable) {
      this.renderSprites();
    }
  };
}

export default PPU;
