import Primitive from 'helpers/Primitives';

export default class LCDControl {
  private _control: byte = 0;
  private _enable: bit = 0;
  get enable(): bit {
    return this._enable;
  }
  set enable(value: bit) {
    this._enable = value;
  }
  private _windowTileMapArea: bit = 0;
  /**
   * Bit 6
   * This bit controls which background map the Window uses for rendering. When it’s reset, the $9800 tilemap is used, otherwise it’s the $9C00 one.
   */
  get windowTileMapArea(): bit {
    return this._windowTileMapArea;
  }
  set windowTileMapArea(value: bit) {
    this._windowTileMapArea = value;
  }
  private _windowEnable: bit = 0;
  /**
   * Bit 5
   * This bit controls whether the window shall be displayed or not. This bit is overridden on DMG by bit 0 if that bit is reset.
   */
  get windowEnable(): bit {
    return this._windowEnable;
  }
  set windowEnable(value: bit) {
    this._windowEnable = value;
  }
  private _bgWindowTileData: bit = 0;
  /**
   * Bit 4
   * This bit controls which addressing mode the BG and Window use to pick tiles.
   Sprites aren’t affected by this, and will always use $8000 addressing mode.
   */
  get bgWindowTileData(): bit {
    return this._bgWindowTileData;
  }
  set bgWindowTileData(value: bit) {
    this._bgWindowTileData = value;
  }
  private _bgTileMapArea: bit = 0;
  /**
   * Bit 3
   * This bit works similarly to LCDC bit 6: if the bit is reset, the BG uses tilemap $9800, otherwise tilemap $9C00.
   */
  get bgTileMapArea(): bit {
    return this._bgTileMapArea;
  }
  set bgTileMapArea(value: bit) {
    this._bgTileMapArea = value;
  }
  private _objSize: bit = 0;
  /**
   * Bit 2
   * This bit controls the sprite size (1 tile or 2 stacked vertically).
   */
  get objSize(): bit {
    return this._objSize;
  }
  set objSize(value: bit) {
    this._objSize = value;
  }
  private _objEnable: bit = 0;
  /**
   * Bit 1
   * This bit toggles whether sprites are displayed or not.
   This can be toggled mid-frame, for example to avoid sprites being displayed on top of a status bar or text box.
   */
  get objEnable(): bit {
    return this._objEnable;
  }
  set objEnable(value: bit) {
    this._objEnable = value;
  }
  private _bgWindowEnable: bit = 0;
  /**
   * Bit 0
   * When Bit 0 is cleared, both background and window become blank (white), and the Window Display Bit is ignored in that case. Only Sprites may still be displayed (if enabled in Bit 1).
   */
  get bgWindowEnable(): bit {
    return this._bgWindowEnable;
  }
  set bgWindowEnable(value: bit) {
    this._bgWindowEnable = value;
  }

  public update = (value: byte): void => {
    this._control = value;
    this.enable = Primitive.getBit(value, 7);
    this.windowTileMapArea = Primitive.getBit(value, 6);
    this.windowEnable = Primitive.getBit(value, 5);
    this.bgWindowTileData = Primitive.getBit(value, 4);
    this.bgTileMapArea = Primitive.getBit(value, 3);
    this.objSize = Primitive.getBit(value, 2);
    this.objEnable = Primitive.getBit(value, 1);
    this.bgWindowEnable = Primitive.getBit(value, 0);
  };

  public value = (): byte => {
    return this._control;
  };
  constructor() {}
}
