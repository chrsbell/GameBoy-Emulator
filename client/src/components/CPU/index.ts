import Memory from '../Memory';
import { toByte, toWord, byte, word, addWord, toHex } from '../Types';
import Opcodes from './sm83';
import Flag from './Flag';

interface Registers {
  af: word;
  bc: word;
  de: word;
  hl: word;
  f: Flag;
}

class CPU {
  // number of clock ticks per second
  static clock = 4194304;
  // 16-bit program counter
<<<<<<< Updated upstream
  private _pc: word;
<<<<<<< HEAD
=======

>>>>>>> opcodes
=======
<<<<<<< Updated upstream
  protected PC: Word;
=======
  private _pc: word;
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  // stack pointer
  private _sp: word;

  private _r: Registers = {
    af: null as word,
    bc: null as word,
    de: null as word,
    hl: null as word,
    f: new Flag(),
  };
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
  protected opcodes: any;
  // number of clock ticks per second
  static clock = 4194304;
=======
>>>>>>> Stashed changes

  private _halted: boolean;
  private opcodes: any;
  private _interruptsEnabled: boolean;

<<<<<<< Updated upstream
  protected get pc(): word {
    return this._pc;
  }
  protected set pc(value: word) {
=======
  public get pc(): word {
    return this._pc;
  }
  public set pc(value: word) {
>>>>>>> Stashed changes
    this._pc = value;
  }
  public get sp(): word {
    return this._sp;
  }
  public set sp(value: word) {
    this._sp = value;
  }
  public get r(): Registers {
    return this._r;
  }
  public set r(value: Registers) {
    this._r = value;
  }
  public get halted(): boolean {
    return this._halted;
  }
  public set halted(value: boolean) {
    this._halted = value;
  }
<<<<<<< Updated upstream
  protected get interruptsEnabled(): boolean {
    return this._interruptsEnabled;
  }
  protected set interruptsEnabled(value: boolean) {
    this._interruptsEnabled = value;
  }

=======
  public get interruptsEnabled(): boolean {
    return this._interruptsEnabled;
  }
  public set interruptsEnabled(value: boolean) {
    this._interruptsEnabled = value;
  }

>>>>>>> Stashed changes
>>>>>>> Stashed changes
  public constructor() {
    this._pc = toWord(0);
    this.sp = toWord(0);
    this.opcodes = Opcodes;
    this.halted = false;
    this.interruptsEnabled = true;
    this.r.af = toWord(0);
    this.r.bc = toWord(0);
    this.r.de = toWord(0);
    this.r.hl = toWord(0);
  }
  /**
   * Sets the Z flag if the register is 0
   */
  protected checkZFlag(reg: byte): void {
    if (!reg) {
      this.r.f.z = 1;
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
  protected checkHalfCarry(op1: byte, op2: byte): void {
    const carryBit = ((op1 & 0xf) + (op2 & 0xf)) & 0x10;
    this.r.f.h = carryBit === 0x10 ? 1 : 0;
  }
  /**
   * Sets the carry flag if the sum will exceed the size of the data type.
   */
  protected checkFullCarry16(op1: word, op2: word): void {
    let overflow: number = op1 + op2;
    if (overflow > 65535) {
      this.r.f.n = 1;
    } else {
      this.r.f.n = 0;
    }
  }
  protected checkFullCarry8(op1: byte, op2: byte): void {
    let overflow: number = op1 + op2;
    if (overflow > 255) {
      this.r.f.n = 1;
    } else {
      this.r.f.n = 0;
    }
  }
  public get pc(): word {
    return this._pc;
  }
  public set pc(value: word) {
    this._pc = value;
  }
  /**
   * Completes the GB power sequence
   */
  private initPowerSequence(): void {
    this._pc = 0x100;
    this.r.af = 0x01b0;
    this.r.bc = 0x0013;
    this.r.de = 0x00d8;
    this.r.hl = 0x014d;
    this.sp = 0xfffe;
    Memory.writeByte(0xff05, toByte(0x00));
    Memory.writeByte(0xff06, toByte(0x00));
    Memory.writeByte(0xff07, toByte(0x00));
    Memory.writeByte(0xff10, toByte(0x80));
    Memory.writeByte(0xff11, toByte(0xbf));
    Memory.writeByte(0xff12, toByte(0xf3));
    Memory.writeByte(0xff14, toByte(0xbf));
    Memory.writeByte(0xff16, toByte(0x3f));
    Memory.writeByte(0xff17, toByte(0x00));
    Memory.writeByte(0xff19, toByte(0xbf));
    Memory.writeByte(0xff1a, toByte(0x7f));
    Memory.writeByte(0xff1b, toByte(0xff));
    Memory.writeByte(0xff1c, toByte(0x9f));
    Memory.writeByte(0xff1e, toByte(0xbf));
    Memory.writeByte(0xff20, toByte(0xff));
    Memory.writeByte(0xff21, toByte(0x00));
    Memory.writeByte(0xff22, toByte(0x00));
    Memory.writeByte(0xff23, toByte(0xbf));
    Memory.writeByte(0xff24, toByte(0x77));
    Memory.writeByte(0xff25, toByte(0xf3));
    Memory.writeByte(0xff26, toByte(0xf1));
    Memory.writeByte(0xff40, toByte(0x91));
    Memory.writeByte(0xff42, toByte(0x00));
    Memory.writeByte(0xff43, toByte(0x00));
    Memory.writeByte(0xff45, toByte(0x00));
    Memory.writeByte(0xff47, toByte(0xfc));
    Memory.writeByte(0xff48, toByte(0xff));
    Memory.writeByte(0xff49, toByte(0xff));
    Memory.writeByte(0xff4a, toByte(0x00));
    Memory.writeByte(0xff4b, toByte(0x00));
    Memory.writeByte(0xffff, toByte(0x00));
  }
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  public executeInstruction(): number {
    if (Memory.inBios) {
      // fetch
      debugger;
      const opcode: byte = Memory.readByte(this._pc);
      console.log(`Executing opcode: ${toHex(opcode)}, PC is ${this._pc}`);
      this.log();
      this._pc += 1;
      // not doing any execution of bios instructions for now
      // execute
      const numCycles: number = this.opcodes[opcode].call(this);
      // this._pc = addWord(this._pc, 1);
      // check if finished bios execution
      if (!Memory.inBios) {
        console.log('exiting bios');
        this.initPowerSequence();
      }
      return numCycles;
    } else {
      // normal execution
      // fetch
      const opcode: byte = Memory.readByte(this._pc);
      this._pc += 1;
      console.log(`Executing opcode: ${toHex(opcode)}, PC is ${this._pc}`);

      // execute
      const numCycles: number = this.opcodes[opcode].call(this);
      return numCycles;
    }
  }

  /**
   * Logs the internal state of the CPU.
   */
  public log(): void {
    console.log(`JS GB Registers: ${JSON.stringify(this.r)}`);
    console.log(`JS GB PC: ${this._pc}`);
    console.log(`JS GB SP: ${this.sp}`);
  }
}

export default CPU;
