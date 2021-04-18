import {byte, bit, getBit} from '../../../Types';

export default class LCDControl {
  private _control: byte = 0;
  private _LCDPPU: bit = 0;
  public get LCDPPU(): bit {
    return this._LCDPPU;
  }
  public set LCDPPU(value: bit) {
    this._LCDPPU = value;
  }
  private _tileMapArea: bit = 0;
  public get tileMapArea(): bit {
    return this._tileMapArea;
  }
  public set tileMapArea(value: bit) {
    this._tileMapArea = value;
  }
  private _windowEnable: bit = 0;
  public get windowEnable(): bit {
    return this._windowEnable;
  }
  public set windowEnable(value: bit) {
    this._windowEnable = value;
  }
  private _bgWindowTileData: bit = 0;
  public get bgWindowTileData(): bit {
    return this._bgWindowTileData;
  }
  public set bgWindowTileData(value: bit) {
    this._bgWindowTileData = value;
  }
  private _bgTileMapArea: bit = 0;
  public get bgTileMapArea(): bit {
    return this._bgTileMapArea;
  }
  public set bgTileMapArea(value: bit) {
    this._bgTileMapArea = value;
  }
  private _objSize: bit = 0;
  public get objSize(): bit {
    return this._objSize;
  }
  public set objSize(value: bit) {
    this._objSize = value;
  }
  private _objEnable: bit = 0;
  public get objEnable(): bit {
    return this._objEnable;
  }
  public set objEnable(value: bit) {
    this._objEnable = value;
  }
  private _bgWindowEnable: bit = 0;
  public get bgWindowEnable(): bit {
    return this._bgWindowEnable;
  }
  public set bgWindowEnable(value: bit) {
    this._bgWindowEnable = value;
  }

  public update(value: byte): void {
    this._control = value;
    this.LCDPPU = getBit(value, 7);
    this.tileMapArea = getBit(value, 6);
    this.windowEnable = getBit(value, 5);
    this.bgWindowTileData = getBit(value, 4);
    this.bgTileMapArea = getBit(value, 3);
    this.objSize = getBit(value, 2);
    this.objEnable = getBit(value, 1);
    this.bgWindowEnable = getBit(value, 0);
  }

  public value(): byte {
    return this._control;
  }
  constructor() {}
}
