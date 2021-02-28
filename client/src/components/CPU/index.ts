import Memory from '../Memory';
import { Byte, Word } from '../Types';
import Opcodes from './z80';

// Using a class to prevent accidentally setting flag outside 0/1
class Flag {
  private f: number = 0;
  public set(newValue: number): void {
    if (newValue !== 0 && newValue !== 1) {
      throw new Error('Tried to set flag outside range.');
    }
    this.f = newValue;
  }
  public value(): number {
    return this.f;
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
  protected halted: boolean;
  protected interruptsEnabled: boolean;
  protected opcodes: any;
  // number of clock ticks per second
  static clock = 4194304;
  public constructor() {
    this.PC = new Word(0);
    this.SP = new Word(0);
    this.opcodes = Opcodes;
    this.halted = false;
    this.interruptsEnabled = true;
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
      this.R.F.Z.set(1);
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
    this.R.F.H.set(carryBit === 0x10 ? 1 : 0);
  }
  /**
   * Sets the carry flag if the sum will exceed the size of the data type.
   */
  // protected checkFullCarry(op1: Word, op2: Word): void;
  protected checkFullCarry(op1: Byte | Word, op2: Byte | Word): void {
    let overflow: number = op1.value() + op2.value();
    if (op1 instanceof Word) {
      if (overflow > 65535) {
        this.R.F.N.set(1);
      } else {
        this.R.F.N.set(0);
      }
    } else {
      if (overflow > 255) {
        this.R.F.N.set(1);
      } else {
        this.R.F.N.set(0);
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
    this.SP.set(0xfffe);
    Memory.writeByte(0xff05, new Byte(0x00));
    Memory.writeByte(0xff06, new Byte(0x00));
    Memory.writeByte(0xff07, new Byte(0x00));
    Memory.writeByte(0xff10, new Byte(0x80));
    Memory.writeByte(0xff11, new Byte(0xbf));
    Memory.writeByte(0xff12, new Byte(0xf3));
    Memory.writeByte(0xff14, new Byte(0xbf));
    Memory.writeByte(0xff16, new Byte(0x3f));
    Memory.writeByte(0xff17, new Byte(0x00));
    Memory.writeByte(0xff19, new Byte(0xbf));
    Memory.writeByte(0xff1a, new Byte(0x7f));
    Memory.writeByte(0xff1b, new Byte(0xff));
    Memory.writeByte(0xff1c, new Byte(0x9f));
    Memory.writeByte(0xff1e, new Byte(0xbf));
    Memory.writeByte(0xff20, new Byte(0xff));
    Memory.writeByte(0xff21, new Byte(0x00));
    Memory.writeByte(0xff22, new Byte(0x00));
    Memory.writeByte(0xff23, new Byte(0xbf));
    Memory.writeByte(0xff24, new Byte(0x77));
    Memory.writeByte(0xff25, new Byte(0xf3));
    Memory.writeByte(0xff26, new Byte(0xf1));
    Memory.writeByte(0xff40, new Byte(0x91));
    Memory.writeByte(0xff42, new Byte(0x00));
    Memory.writeByte(0xff43, new Byte(0x00));
    Memory.writeByte(0xff45, new Byte(0x00));
    Memory.writeByte(0xff47, new Byte(0xfc));
    Memory.writeByte(0xff48, new Byte(0xff));
    Memory.writeByte(0xff49, new Byte(0xff));
    Memory.writeByte(0xff4a, new Byte(0x00));
    Memory.writeByte(0xff4b, new Byte(0x00));
    Memory.writeByte(0xffff, new Byte(0x00));
  }
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  public executeInstruction(): number {
    if (Memory.inBios) {
      // fetch
      const opcode: number = Memory.readByte(this.PC.value());
      // not doing any execution of bios instructions for now
      this.PC.add(1);
      // check if finished bios execution
      if (!Memory.inBios) {
        this.initPowerSequence();
      }
      return 2;
    } else {
      // normal execution
      // fetch
      const opcode: number = Memory.readByte(this.PC.value());
      // execute
      const numCycles: number = this.opcodes[opcode].call(this);
      return numCycles;
    }
  }
}

export default CPU;
