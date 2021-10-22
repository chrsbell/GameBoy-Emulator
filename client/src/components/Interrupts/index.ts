import Memory from 'Memory/index';

let interruptsEnabled = 0;
let interruptsFlag = 0;

class InterruptService {
  public static flags: StrNumIdx = {
    vBlank: 0,
    lcdStat: 1,
    timer: 2,
    serial: 3,
    joypad: 4,
  };
  constructor(private memory: Memory) {}
  public getIE = (): byte => interruptsEnabled;
  public getIF = (): byte => interruptsFlag;
  /**
   * Enables the interrupt corresponding to the index.
   */
  public enable = (bit: number): void => {
    const register: byte = this.memory.readByte(0xff0f);
    this.memory.writeByte(0xff0f, register | (1 << bit));
  };
}

export default InterruptService;
