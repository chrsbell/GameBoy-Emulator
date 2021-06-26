import CPU from 'CPU/index';
import Primitive from 'helpers/Primitives';

class Flag {
  private _z: bit = 0; // set if last op producted 0
  private _n: bit = 0; // set if last op was subtraction
  private _h: bit = 0; // set if result's Primitive.lower half of last op overflowed past 15
  private _cy: bit = 0; // set if last op produced a result over 255 or under 0
  private cpu: CPU = <CPU>{};
  constructor(cpu: CPU, value: byte = 0) {
    this.cpu = cpu;
    this.z = (value >> 7) & 1;
    this.n = (value >> 6) & 1;
    this.h = (value >> 5) & 1;
    this.cy = (value >> 4) & 1;
  }

  /**
   * Sets the Z flag if the register is 0, otherwise resets it.
   */
  public checkZFlag = (reg: byte): void => {
    if (!reg) {
      this.z = 1;
    } else {
      this.z = 0;
    }
  };

  private error(): void {
    throw new Error('Tried to set flag outside range.');
  }

  public value = (): byte => {
    return (this.z << 7) | (this.n << 6) | (this.h << 5) | (this.cy << 4);
  };

  set z(value: bit) {
    if (value === 0 || value === 1) {
      this._z = value;
      this.cpu.r.af = Primitive.setLower(
        this.cpu.r.af,
        Primitive.lower(this.cpu.r.af) | (value << 7)
      );
    } else {
      this.error();
    }
  }

  get z(): bit {
    return this._z;
  }

  set n(value: bit) {
    if (value === 0 || value === 1) {
      this._n = value;
      this.cpu.r.af = Primitive.setLower(
        this.cpu.r.af,
        Primitive.lower(this.cpu.r.af) | (value << 6)
      );
    } else {
      this.error();
    }
  }

  get n(): bit {
    return this._n;
  }

  set h(value: bit) {
    if (value === 0 || value === 1) {
      this._h = value;
      this.cpu.r.af = Primitive.setLower(
        this.cpu.r.af,
        Primitive.lower(this.cpu.r.af) | (value << 5)
      );
    } else {
      this.error();
    }
  }

  get h(): bit {
    return this._h;
  }

  set cy(value: bit) {
    if (value === 0 || value === 1) {
      this._cy = value;
      this.cpu.r.af = Primitive.setLower(
        this.cpu.r.af,
        Primitive.lower(this.cpu.r.af) | (value << 4)
      );
    } else {
      this.error();
    }
  }

  get cy(): bit {
    return this._cy;
  }
}

const formatFlag = (value: byte): object => ({
  z: (value >> 7) & 1,
  n: (value >> 6) & 1,
  h: (value >> 5) & 1,
  cy: (value >> 4) & 1,
});

export default Flag;
export {formatFlag};
