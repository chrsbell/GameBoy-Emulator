import {Memory} from 'Memory/index';

class InterruptService {
  private memory!: Memory;
  public interruptsEnabled = 0;
  public interruptsFlag = 0;
  public static if = 0xff0f;
  public static ie = 0xffff;
  public static flags: StrNumIdx = {
    vBlank: 0,
    lcdStat: 1,
    timer: 2,
    serial: 3,
    joypad: 4,
  };

  constructor() {}

  public init = (memory: Memory): void => {
    this.memory = memory;
  };

  public enable = (bit: number): void => {
    const register: byte = this.memory.readByte(0xff0f);
    this.interruptsFlag = register | (1 << bit);
    this.memory.writeByte(0xff0f, this.interruptsFlag);
  };
}

export {InterruptService};
