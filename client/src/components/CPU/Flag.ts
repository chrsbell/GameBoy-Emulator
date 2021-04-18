// Using a class to prevent accidentally setting flag outside 0/1
import {byte, word, lower, setLower} from '../../Types';
import CPU from '.';

class Flag {
  private _z: byte = 0; // set if last op producted 0
  private _n: byte = 0; // set if last op was subtraction
  private _h: byte = 0; // set if result's lower half of last op overflowed past 15
  private _cy: byte = 0; // set if last op produced a result over 255 or under 0

  constructor(value: byte = 0) {
    this.z = (value >> 7) & 1;
    this.n = (value >> 6) & 1;
    this.h = (value >> 5) & 1;
    this.cy = (value >> 4) & 1;
  }

  /**
   * Sets the Z flag if the register is 0, otherwise resets it.
   */
  public checkZFlag(reg: byte): void {
    if (!reg) {
      this.z = 1;
    } else {
      this.z = 0;
    }
  }

  private error(): void {
    throw new Error('Tried to set flag outside range.');
  }

  public value(): byte {
    return (this.z << 7) | (this.n << 6) | (this.h << 5) | (this.cy << 4);
  }

  public set z(value: byte) {
    if (value === 0 || value === 1) {
      this._z = value;
      CPU.r.af = setLower(CPU.r.af, lower(CPU.r.af) | (value << 7));
    } else {
      this.error();
    }
  }

  public get z() {
    return this._z;
  }

  public set n(value: byte) {
    if (value === 0 || value === 1) {
      this._n = value;
      CPU.r.af = setLower(CPU.r.af, lower(CPU.r.af) | (value << 6));
    } else {
      this.error();
    }
  }

  public get n() {
    return this._n;
  }

  public set h(value: byte) {
    if (value === 0 || value === 1) {
      this._h = value;
      CPU.r.af = setLower(CPU.r.af, lower(CPU.r.af) | (value << 5));
    } else {
      this.error();
    }
  }

  public get h() {
    return this._h;
  }

  public set cy(value: byte) {
    if (value === 0 || value === 1) {
      this._cy = value;
      CPU.r.af = setLower(CPU.r.af, lower(CPU.r.af) | (value << 4));
    } else {
      this.error();
    }
  }

  public get cy() {
    return this._cy;
  }
}

export default Flag;
