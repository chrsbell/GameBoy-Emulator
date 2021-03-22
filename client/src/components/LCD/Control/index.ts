import {byte, bit, getBit} from '../../Types';

export default class LCDControl {
  private _control: byte = 0;
  private LCDPPU: bit = 0;
  private tileMapArea: bit = 0;
  private windowEnable: bit = 0;
  private bgWindowTileData: bit = 0;
  private bgTileMapArea: bit = 0;
  private objSize: bit = 0;
  private objEnable: bit = 0;
  private bgWindowEnable: bit = 0;

  public get(): byte {
    return this._control;
  }
  public set(value: byte) {
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
  constructor() {}
}
