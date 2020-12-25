import RAM from "./RAM";
import ROM from "./ROM";

class CPU {
  // 16-bit address
  private address: number;
  // number of clock ticks per second
  public clock = 4194304;
  constructor() {
    this.address = 0x0;
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