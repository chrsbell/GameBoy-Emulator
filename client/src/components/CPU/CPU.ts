import Memory from '../Memory/Memory';
import { Byte, Word } from '../Types';

interface Registers {
  AF: Word;
  BC: Word;
  DE: Word;
  HL: Word;
}

class CPU {
  // 16-bit program counter
  private PC: Word;
  // stack pointer
  private SP: Word;
  private R: Registers = {
    AF: null as Word,
    BC: null as Word,
    DE: null as Word,
    HL: null as Word,
  };
  // number of clock ticks per second
  public clock = 4194304;
  constructor() {
    this.PC = new Word(0x0000);
  }
  /**
   * Completes the GB power sequence
   */
  initPowerSequence(): void {
    this.PC.set(0x100);
    this.R.AF = new Word(0x01b0);
    this.R.BC = new Word(0x0013);
    this.R.DE = new Word(0x00d8);
    this.R.HL = new Word(0x014d);
  }
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  executeInstruction(): number {
    if (Memory.inBios) {
      const opcode = Memory.read(this.PC.value());
      console.log(`PC: ${this.PC.log()}`, new Byte(opcode));
      // check if finished bios execution
      if (!Memory.inBios) {
        this.initPowerSequence();
      } else {
        this.PC.set(this.PC.value() + 0x0001);
      }
    }
    return 1;
  }
}

export default CPU;
