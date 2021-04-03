import Memory from '../Memory';
import {byte, word, getBit, clearBit, OpcodeList} from '../Types';
import Opcodes from './sm83';
import {PUSH} from './sm83/Map';
import Interrupt from '../Interrupts';

interface Registers {
  af: word;
  bc: word;
  de: word;
  hl: word;
}

class CPU {
  // number of clock ticks per second
  private static _clock = 4194304;
  public get clock(): number {
    return CPU._clock;
  }
  // 16-bit program counter
  private _pc: word = 0;
  public get pc(): word {
    return this._pc;
  }
  public set pc(value: word) {
    this._pc = value;
  }
  // stack pointer
  private _sp: word = 0;
  public get sp(): word {
    return this._sp;
  }
  public set sp(value: word) {
    this._sp = value;
  }
  private _r: Registers = {
    af: 0 as word,
    bc: 0 as word,
    de: 0 as word,
    hl: 0 as word,
  };
  public get r(): Registers {
    return this._r;
  }
  public set r(value: Registers) {
    this._r = value;
  }
  private _halted = false;
  public get halted(): boolean {
    return this._halted;
  }
  public set halted(value: boolean) {
    this._halted = value;
  }
  private _allInterruptsEnabled = true;
  private opcodes: OpcodeList = Opcodes;
  private _lastExecuted: Array<byte> = [];
  public get lastExecuted(): Array<byte> {
    return this._lastExecuted;
  }
  public set lastExecuted(value: Array<byte>) {
    this._lastExecuted = value;
  }
  public constructor() {
    this.reset();
  }

  /**
   * Resets the CPU.
   */
  public reset(): void {
    this.pc = 0;
    this.sp = 0;
    this.halted = false;
    this._allInterruptsEnabled = true;
    this.r.af = 0;
    this.r.bc = 0;
    this.r.de = 0;
    this.r.hl = 0;
    this.lastExecuted = [];
  }

  public setInterruptsGlobal(enabled: boolean): void {
    this._allInterruptsEnabled = enabled;
  }
  /**
   * Completes the GB power sequence
   */
  private initPowerSequence(): void {
    this.pc = 0x100;
    this.r.af = 0x01b0;
    this.r.bc = 0x0013;
    this.r.de = 0x00d8;
    this.r.hl = 0x014d;
    this.sp = 0xfffe;
    Memory.writeByte(0xff05, 0x00);
    Memory.writeByte(0xff06, 0x00);
    Memory.writeByte(0xff07, 0x00);
    Memory.writeByte(0xff10, 0x80);
    Memory.writeByte(0xff11, 0xbf);
    Memory.writeByte(0xff12, 0xf3);
    Memory.writeByte(0xff14, 0xbf);
    Memory.writeByte(0xff16, 0x3f);
    Memory.writeByte(0xff17, 0x00);
    Memory.writeByte(0xff19, 0xbf);
    Memory.writeByte(0xff1a, 0x7f);
    Memory.writeByte(0xff1b, 0xff);
    Memory.writeByte(0xff1c, 0x9f);
    Memory.writeByte(0xff1e, 0xbf);
    Memory.writeByte(0xff20, 0xff);
    Memory.writeByte(0xff21, 0x00);
    Memory.writeByte(0xff22, 0x00);
    Memory.writeByte(0xff23, 0xbf);
    Memory.writeByte(0xff24, 0x77);
    Memory.writeByte(0xff25, 0xf3);
    Memory.writeByte(0xff26, 0xf1);
    Memory.writeByte(0xff40, 0x91);
    Memory.writeByte(0xff42, 0x00);
    Memory.writeByte(0xff43, 0x00);
    Memory.writeByte(0xff45, 0x00);
    Memory.writeByte(0xff47, 0xfc);
    Memory.writeByte(0xff48, 0xff);
    Memory.writeByte(0xff49, 0xff);
    Memory.writeByte(0xff4a, 0x00);
    Memory.writeByte(0xff4b, 0x00);
    Memory.writeByte(0xffff, 0x00);
  }
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  public executeInstruction(): number {
    if (Memory.inBios) {
      // fetch
      const opcode: byte = Memory.readByte(this.pc);
      this.pc += 1;
      // not doing any execution of bios instructions for now
      // execute
      const numCycles: number = this.opcodes[opcode].call(this);
      // check if finished bios execution
      if (!Memory.inBios) {
        console.log('exiting bios');
        this.initPowerSequence();
      }
      return numCycles;
    } else {
      // normal execution
      // fetch
      const opcode: byte = Memory.readByte(this.pc);
      this.pc += 1;
      // execute
      const numCycles: number = this.opcodes[opcode].call(this);
      this.lastExecuted.push(opcode);
      if (this.lastExecuted.length > 100) {
        this.lastExecuted.shift();
      }
      // this.r.af = setLower(this.r.af, this.r.f.value());
      return numCycles;
    }
  }
  /**
   * Checks if an interrupt needs to be handled.
   */
  public checkInterrupts(): void {
    if (this._allInterruptsEnabled) {
      const register: byte = Memory.readByte(Interrupt.if);
      if (register) {
        const individualEnabled = Memory.readByte(Interrupt.ie);
        // 5 interrupts
        for (let i = 0; i < 5; i++) {
          if (getBit(register, i) && getBit(individualEnabled, i)) {
            this.handleInterrupts(i);
          }
        }
      }
    }
  }
  /**
   * Handles an interrupt.
   */
  private handleInterrupts(interrupt: number): void {
    this.setInterruptsGlobal(false);
    const register: byte = Memory.readByte(Interrupt.if);
    Memory.writeByte(Interrupt.if, clearBit(register, interrupt));

    PUSH(this.pc);

    switch (interrupt) {
      case Interrupt.vBlank:
        this.pc = 0x40;
        break;
      case Interrupt.lcdStat:
        this.pc = 0x48;
        break;
      case Interrupt.timer:
        this.pc = 0x50;
        break;
      case Interrupt.serial:
        this.pc = 0x58;
        break;
      case Interrupt.joypad:
        this.pc = 0x40;
        break;
    }
  }
  /**
   * Logs the internal state of the CPU.
   */
  public log(): void {
    console.log(`JS GB Registers: ${JSON.stringify(this.r)}`);
    console.log(`JS GB PC: ${this.pc}`);
    console.log(`JS GB SP: ${this.sp}`);
  }
}

export default new CPU();
