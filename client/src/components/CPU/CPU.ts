import Memory from '../Memory/Memory';
import { Byte, Word } from '../Types';
import Opcodes from './z80/z80';

interface Registers {
  AF: Word;
  BC: Word;
  DE: Word;
  HL: Word;
  F: {
    Z: boolean; // set if last op producted 0
    N: boolean; // set if last op was subtraction
    H: boolean; // set if result's lower half of last op overflowed past 15
    CY: boolean; // set if last op produced a result over 255 or under 0
  };
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
    F: {
      Z: false,
      N: false,
      H: false,
      CY: false,
    },
  };
  private opcodes: any;
  // number of clock ticks per second
  public clock = 4194304;
  public constructor() {
    this.PC = new Word(0x0000);
    this.opcodes = Opcodes;
    this.R.AF = new Word(0);
    this.R.BC = new Word(0);
    this.R.DE = new Word(0);
    this.R.HL = new Word(0);
  }
  /**
   * Sets the Z flag if the register is 0
   */
  private checkZFlag(reg: Byte): void {
    if (!reg.value()) {
      this.R.F.Z = true;
    }
  }
  /**
   * Sets the half carry flag if a carry will be generated from bits 3 to 4 of the sum.
   * For 16-bit operations, this function should be called on the upper bytes of the operands.
   * Sources:
   * https://stackoverflow.com/questions/8868396/game-boy-what-constitutes-a-half-carry
   * https://gbdev.io/gb-opcodes/optables/
   */
  private checkHalfCarry(op1: Byte, op2: Byte): void {
    this.R.F.H = (((op1.value() & 0xf) + (op2.value() & 0xf)) & 0x10) === 0x10;
  }
  /**
   * Completes the GB power sequence
   */
  public initPowerSequence(): void {
    this.PC.set(0x100);
    this.R.AF.set(0x01b0);
    this.R.BC.set(0x0013);
    this.R.DE.set(0x00d8);
    this.R.HL.set(0x014d);
  }
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  public executeInstruction(): number {
    if (Memory.inBios) {
      const opcode: number = Memory.readByte(this.PC.value());
      console.log(`PC: ${this.PC.log()}`, opcode.toString(16));
      this.PC.set(this.PC.value() + 0x0001);
      // check if finished bios execution
      if (!Memory.inBios) {
        this.initPowerSequence();
      }
      return 1;
    } else {
      // normal execution
      const opcode: number = Memory.readByte(this.PC.value());
      console.log(`PC: ${this.PC.log()}`, opcode.toString(16));
      const numCycles: number = this.opcodes[opcode](this);
      this.opcodes[opcode](this);
      this.PC.set(this.PC.value() + 0x0001);
    }
  }
}

export default CPU;
