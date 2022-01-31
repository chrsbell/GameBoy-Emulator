import {InterruptService} from 'Interrupts/index';
import {Memory} from 'Memory/index';

export default class Stat {
  public static modeLowerBit = 0;
  public static modeUpperBit = 1;
  public static lycLcBit = 2;
  public static hBlankBit = 3;
  public static vBlankBit = 4;
  public static readOAMBit = 5;
  public static lycLcInterruptBit = 6;

  public static hBlankMode = 0;
  public static vBlankMode = 1;
  public static readOAMMode = 2;
  public static readVRAMMode = 3;

  private interruptBitForMode: NumNumIdx = {
    0: 3,
    1: 4,
    2: 5,
  };

  private _value: byte = 2;
  private _mode: byte = 2;
  private _lycLc: bit = 0;
  private _lycLcInterrupt: bit = 0;

  get lycLcInterrupt(): bit {
    return (this.value >> Stat.lycLcInterruptBit) & 1;
  }

  set lycLcInterrupt(value: bit) {
    if (value) {
      this.value = this.value | (1 << Stat.lycLcInterruptBit);
    } else {
      this.value = this.value & ~(1 << Stat.lycLcInterruptBit);
    }
    this._lycLcInterrupt = value;
  }

  get lycLc(): bit {
    return (this._value >> Stat.lycLcBit) & 1;
  }

  set lycLc(value: bit) {
    if (value) {
      this.value = this.value | (1 << Stat.lycLcBit);
    } else {
      this.value = this.value & ~(1 << Stat.lycLcBit);
    }
    this._lycLc = value;
  }

  get value(): byte {
    return this._value;
  }

  set value(value: byte) {
    this.update(value);
    this.memory.writeByte(0xff41, value);
  }

  get mode(): byte {
    return this._mode;
  }

  set mode(value: byte) {
    const oldMode = this.mode;
    this._mode = value;
    this._value = ((this._value >> 2) << 2) | value;
    this.memory.writeByte(0xff41, this._value);
    if (oldMode !== this.mode && this.interruptBitForMode[this.mode])
      this.modeSwitchInterrupt(this.interruptBitForMode[this.mode]);
  }

  public update = (value: byte): void => {
    this._value = value;
    const oldMode = this._mode;
    this._mode = value & 0b11;
    this._lycLc = (value >> Stat.lycLcBit) & 1;
    this._lycLcInterrupt = (value >> Stat.lycLcInterruptBit) & 1;
    if (oldMode !== this._mode && this.interruptBitForMode[this._mode])
      this.modeSwitchInterrupt(this.interruptBitForMode[this._mode]);
  };

  constructor(
    private memory: Memory,
    private interruptService: InterruptService
  ) {}

  public reset = (): void => {
    this._value = 0;
    this._mode = 0;
  };

  /**
   * If the STAT interrupt source bit is toggled, sets the lcdStat bit in IF.
   * @param interruptBit
   */
  private modeSwitchInterrupt = (interruptBit: bit): void => {
    // trigger stat interrupt if transitioning from low to high (STAT blocking)
    const interruptFlagReset = !(
      (this.memory.readByte(0xff0f) >> InterruptService.flags.lcdStat) &
      1
    );
    // mode switch interrupt source
    if ((this.value >> interruptBit) & 1 && interruptFlagReset) {
      this.interruptService.enable(InterruptService.flags.lcdStat);
    }
  };
}
