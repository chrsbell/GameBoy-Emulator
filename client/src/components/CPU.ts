import Memory from './Memory';

class CPU {
  // 16-bit address
  private address: Uint16Array;
  // number of clock ticks per second
  public clock = 4194304;
  constructor() {
    this.address = new Uint16Array([0x0]);
  }
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  executeInstruction(): number {
    return 1;
  }
}

export default CPU;
