// Using a class to prevent accidentally setting flag outside 0/1

export default class Flag {
  private _z: number = 0; // set if last op producted 0
  private _n: number = 0; // set if last op was subtraction
  private _h: number = 0; // set if result's lower half of last op overflowed past 15
  private _cy: number = 0; // set if last op produced a result over 255 or under 0

  private error(): void {
    throw new Error('Tried to set flag outside range.');
  }

  public set z(value: number) {
    if (value === 0 || value === 1) {
      this._z = value;
    }
    this.error();
  }

  public get z() {
    return this._z;
  }

  public set n(value: number) {
    if (value === 0 || value === 1) {
      this._n = value;
    }
    this.error();
  }

  public get n() {
    return this._n;
  }

  public set h(value: number) {
    if (value === 0 || value === 1) {
      this._n = value;
    }
    this.error();
  }

  public get h() {
    return this._h;
  }

  public set cy(value: number) {
    if (value === 0 || value === 1) {
      this._cy = value;
    }
    this.error();
  }

  public get cy() {
    return this._cy;
  }
}
