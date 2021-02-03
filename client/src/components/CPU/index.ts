import Memory from '../Memory';
import { Byte, Word } from '../Types';
import Opcodes from './z80';

// Using a class to prevent accidentally setting flag outside 0/1
class Flag {
  private flagValue: number = 0;
  public flag(newValue: number): void {
    if (newValue !== 0 && newValue !== 1) {
      throw new Error('Tried to set flag outside range.');
    }
    this.flagValue = newValue;
  }
  public value(): number {
    return this.flagValue;
  }
}

interface Registers {
  AF: Word;
  BC: Word;
  DE: Word;
  HL: Word;
  F: {
    Z: Flag; // set if last op producted 0
    N: Flag; // set if last op was subtraction
    H: Flag; // set if result's lower half of last op overflowed past 15
    CY: Flag; // set if last op produced a result over 255 or under 0
  };
}

class CPU {
  // 16-bit program counter
  protected PC: Word;
  // stack pointer
  protected SP: Word;
  protected R: Registers = {
    AF: null as Word,
    BC: null as Word,
    DE: null as Word,
    HL: null as Word,
    F: {
      Z: new Flag(),
      N: new Flag(),
      H: new Flag(),
      CY: new Flag(),
    },
  };
  protected opcodes: any;
  // number of clock ticks per second
  static clock = 4194304;
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
  protected checkZFlag(reg: Byte): void {
    if (!reg.value()) {
      this.R.F.Z.flag(1);
    }
  }
  /**
   * Sets the half carry flag if a carry will be generated from bits 3 to 4 of the sum.
   * For 16-bit operations, this function should be called on the upper bytes of the operands.
   * Sources:
   * https://robdor.com/2016/08/10/gameboy-emulator-half-carry-flag/
   * https://stackoverflow.com/questions/8868396/game-boy-what-constitutes-a-half-carry
   * https://gbdev.io/gb-opcodes/optables/
   */
  protected checkHalfCarry(op1: Byte, op2: Byte): void {
    const carryBit = ((op1.value() & 0xf) + (op2.value() & 0xf)) & 0x10;
    this.R.F.H.flag(carryBit === 0x10 ? 1 : 0);
  }
  /**
   * Sets the carry flag if the sum will exceed the size of the data type.
   */
  protected checkFullCarry(op1: Word, op2: Word): void;
  protected checkFullCarry(op1: Byte | Word, op2: Byte | Word): void {
    let overflow: number = op1.value() + op2.value();
    if (op1 instanceof Word) {
      if (overflow > 65535) {
        this.R.F.N.flag(1);
      } else {
        this.R.F.N.flag(0);
      }
    } else {
      if (overflow > 255) {
        this.R.F.N.flag(1);
      } else {
        this.R.F.N.flag(0);
      }
    }
  }
  /**
   * Completes the GB power sequence
   */
  private initPowerSequence(): void {
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
      debugger;
      const numCycles: number = this.opcodes[opcode].call(this);
      this.opcodes[opcode].call(this);
    }
  }
}

export default CPU;
