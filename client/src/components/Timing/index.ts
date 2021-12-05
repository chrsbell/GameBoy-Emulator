import CPU from 'CPU/index';
import {InterruptService} from 'Interrupts/index';
import {Memory} from 'Memory/index';

// Note: the delay macro from blargg testing roms will delay n cycles, need to x4 for true number of cycles. Then, divide that delay by the selected timerClockRate to get number of times timer counter will increment during the delay period.

const timerClockRate: NumNumIdx = {
  0: 1024,
  1: 16,
  2: 64,
  3: 256,
};

class Timing {
  public memory!: Memory;

  private _timerCounter: byte = 0;
  private _divider: byte = 0;
  private _timerModulo: byte = 0;
  private _timerEnable: bit = 0;
  private _inputClock: byte = 0;
  private _timerControl: byte = 0;
  public timerOverflow = 0;
  public dividerOverflow = 0;
  public interruptService!: InterruptService;

  // using getters like this during the emulation loop tended to be pretty slow for me, but ok for now
  get divider(): byte {
    return this._divider;
  }
  set divider(value: byte) {
    this._divider = value;
    this.memory.ram[0xff04] = 0;
  }
  get timerCounter(): byte {
    return this._timerCounter;
  }
  set timerCounter(value: byte) {
    this._timerCounter = value;
    this.memory.ram[0xff05] = value;
  }
  get timerModulo(): byte {
    return this._timerModulo;
  }
  set timerModulo(value: byte) {
    this._timerModulo = value;
    this.memory.ram[0xff06] = value;
  }
  get timerEnable(): bit {
    return this._timerEnable;
  }
  set timerEnable(value: bit) {
    this._timerEnable = value;
    this.memory.ram[0xff07] = (this.memory.ram[0xff07] & 0b11) | (value << 2);
  }
  get inputClock(): byte {
    return this._inputClock;
  }
  set inputClock(value: byte) {
    this._inputClock = value;
    this.memory.ram[0xff07] = (this.memory.ram[0xff07] & 0b100) | value;
  }
  get timerControl(): byte {
    return this._timerControl;
  }
  set timerControl(value: byte) {
    this._timerEnable = (value >> 2) & 1;
    this._inputClock = value & 0b11;
    this.memory.ram[0xff07] = value;
  }

  constructor() {}

  public init = (memory: Memory, interruptService: InterruptService): void => {
    this.memory = memory;
    this.interruptService = interruptService;
  };

  public incrementDivider = (): void => {
    this._divider += 1;
    this._divider &= 0xff;
    this.memory.ram[0xff04] = this._divider;
  };

  public tickDivider = (
    cpu: CPU,
    executeCallback: () => number,
    testCallback: () => void = (): void => {}
  ): void => {
    // If a TMA write is executed on the same cycle as the content of TMA is transferred to TIMA due to a timer overflow, the old value is transferred to TIMA.
    if (!cpu.stopped) {
      while (this.dividerOverflow < 0x100 && !cpu.stopped) {
        const oldTimerModulo = this._timerModulo;
        const elapsed = executeCallback();
        this.dividerOverflow += elapsed;
        if (this._timerEnable) {
          this.timerOverflow += elapsed;
          if (this.timerOverflow >= timerClockRate[this._inputClock]) {
            this.timerOverflow -= timerClockRate[this._inputClock];
            const newTimerCounter = this._timerCounter + 1;
            if (newTimerCounter > 0xff) {
              this.interruptService.enable(InterruptService.flags.timer);
              this.timerCounter = oldTimerModulo;
            } else {
              this.timerCounter = newTimerCounter;
            }
          }
        }
        if (this.dividerOverflow < 0x100) testCallback();
      }
      this.incrementDivider();
      this.dividerOverflow -= 0x100;
    } else {
      executeCallback();
    }
    testCallback();
  };
}

export {Timing};
