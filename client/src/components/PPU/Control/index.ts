import Primitive from 'helpers/Primitives';

export default class LCDControl {
  private _control: byte = 0;
  private _LCDPPU: bit = 0;
  get LCDPPU(): bit {
    return this._LCDPPU;
  }
  set LCDPPU(value: bit) {
    this._LCDPPU = value;
  }
  private _tileMapArea: bit = 0;
  get tileMapArea(): bit {
    return this._tileMapArea;
  }
  set tileMapArea(value: bit) {
    this._tileMapArea = value;
  }
  private _windowEnable: bit = 0;
  get windowEnable(): bit {
    return this._windowEnable;
  }
  set windowEnable(value: bit) {
    this._windowEnable = value;
  }
  private _bgWindowTileData: bit = 0;
  get bgWindowTileData(): bit {
    return this._bgWindowTileData;
  }
  set bgWindowTileData(value: bit) {
    this._bgWindowTileData = value;
  }
  private _bgTileMapArea: bit = 0;
  get bgTileMapArea(): bit {
    return this._bgTileMapArea;
  }
  set bgTileMapArea(value: bit) {
    this._bgTileMapArea = value;
  }
  private _objSize: bit = 0;
  get objSize(): bit {
    return this._objSize;
  }
  set objSize(value: bit) {
    this._objSize = value;
  }
  private _objEnable: bit = 0;
  get objEnable(): bit {
    return this._objEnable;
  }
  set objEnable(value: bit) {
    this._objEnable = value;
  }
  private _bgWindowEnable: bit = 0;
  get bgWindowEnable(): bit {
    return this._bgWindowEnable;
  }
  set bgWindowEnable(value: bit) {
    this._bgWindowEnable = value;
  }

  public update = (value: byte): void => {
    this._control = value;
    this.LCDPPU = Primitive.getBit(value, 7);
    this.tileMapArea = Primitive.getBit(value, 6);
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
