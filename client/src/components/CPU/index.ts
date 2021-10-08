import {DEBUG} from 'helpers/Debug';
import Primitive from 'helpers/Primitives';
import InterruptService from 'Interrupts/index';
import Memory from 'Memory/index';
import Opcodes from './sm83/index';
import {instructionHelpers as helpers} from './sm83/Map';

interface Registers {
  af: word;
  bc: word;
  de: word;
  hl: word;
}

class CPU {
  private memory!: Memory;
  // number of clock ticks per second
  private clock = 4194304;
  // 16-bit program counter
  public pc: word = 0;
  // stack pointer
  private sp: word = 0;
  private r: Registers = {
    af: 0,
    bc: 0,
    de: 0,
    hl: 0,
  };
  private halted = false;
  private allInterruptsEnabled = true;
  private opcodes: OpcodeList = Opcodes;
  private lastExecuted: Array<string> = [];
  constructor(memory: Memory) {
    this.memory = memory;

    Object.entries(this.opcodes).forEach(([name, func]) => {
      this.opcodes[name] = func.bind(this, this, memory);
    });

    this.reset();
  }

  /**
   * Resets the this.
   */
  public reset = (): void => {
    this.pc = 0;
    this.sp = 0;
    this.halted = false;
    this.allInterruptsEnabled = true;
    this.r.af = 0;
    this.r.bc = 0;
    this.r.de = 0;
    this.r.hl = 0;
    this.lastExecuted = [];
  };

  setInterruptsGlobal(enabled: boolean): void {
    this.allInterruptsEnabled = enabled;
  }
  /**
   * Completes the GB power sequence
   */
  public initPowerSequence = (memory: Memory): void => {
    this.pc = 0x100;
    this.r.af = 0x01b0;
    this.r.bc = 0x0013;
    this.r.de = 0x00d8;
    this.r.hl = 0x014d;
    this.sp = 0xfffe;
    memory.writeByte(0xff05, 0x00);
    memory.writeByte(0xff06, 0x00);
    memory.writeByte(0xff07, 0x00);
    memory.writeByte(0xff10, 0x80);
    memory.writeByte(0xff11, 0xbf);
    memory.writeByte(0xff12, 0xf3);
    memory.writeByte(0xff14, 0xbf);
    memory.writeByte(0xff16, 0x3f);
    memory.writeByte(0xff17, 0x00);
    memory.writeByte(0xff19, 0xbf);
    memory.writeByte(0xff1a, 0x7f);
    memory.writeByte(0xff1b, 0xff);
    memory.writeByte(0xff1c, 0x9f);
    memory.writeByte(0xff1e, 0xbf);
    memory.writeByte(0xff20, 0xff);
    memory.writeByte(0xff21, 0x00);
    memory.writeByte(0xff22, 0x00);
    memory.writeByte(0xff23, 0xbf);
    memory.writeByte(0xff24, 0x77);
    memory.writeByte(0xff25, 0xf3);
    memory.writeByte(0xff26, 0xf1);
    memory.writeByte(0xff40, 0x91);
    memory.writeByte(0xff42, 0x00);
    memory.writeByte(0xff43, 0x00);
    memory.writeByte(0xff45, 0x00);
    memory.writeByte(0xff47, 0xfc);
    memory.writeByte(0xff48, 0xff);
    memory.writeByte(0xff49, 0xff);
    memory.writeByte(0xff4a, 0x00);
    memory.writeByte(0xff4b, 0x00);
    memory.writeByte(0xffff, 0x00);
  };
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  public executeInstruction = (): number => {
    // fetch
    const opcode: byte = this.memory.readByte(this.pc);
    this.pc += 1;
    this.pc &= 0xffff;
    // execute
    let numCycles: number;
    // check if finished bios execution
    if (this.memory.inBios) {
      numCycles = this.opcodes[opcode]();
      if (!this.memory.inBios) {
        DEBUG && console.log('Exiting bios from this.');
        this.initPowerSequence(this.memory);
      }
    } else {
      numCycles = this.opcodes[opcode]();
    }
    return numCycles;
  };
  public addCalledInstruction = (opcode: string): void => {
    this.lastExecuted.unshift(opcode);
    if (this.lastExecuted.length > 100) {
      this.lastExecuted.pop();
    }
  };
  /**
   * Checks if an interrupt needs to be handled.
   */
  public checkInterrupts = (memory: Memory): void => {
    if (this.allInterruptsEnabled) {
      const register: byte = memory.readByte(Memory.addresses.interrupt.if);
      if (register) {
        const individualEnabled = memory.readByte(
          Memory.addresses.interrupt.ie
        );
        // 5 interrupts
        for (let i = 0; i < 5; i++) {
          if (
            Primitive.getBit(register, i) &&
            Primitive.getBit(individualEnabled, i)
          ) {
            this.handleInterrupts(memory, i);
          }
        }
      }
    }
  };
  /**
   * Handles an interrupt.
   */
  private handleInterrupts(memory: Memory, interrupt: number): void {
    this.setInterruptsGlobal(false);
    const register: byte = memory.readByte(Memory.addresses.interrupt.if);
    memory.writeByte(
      InterruptService.flags.if,
      Primitive.clearBit(register, interrupt)
    );

    helpers.PUSH(this, memory, this.pc);
    DEBUG && console.log('Handled an interrupt.');
    switch (interrupt) {
      case InterruptService.flags.vBlank:
        this.pc = 0x40;
        break;
      case InterruptService.flags.lcdStat:
        this.pc = 0x48;
        break;
      case InterruptService.flags.timer:
        this.pc = 0x50;
        break;
      case InterruptService.flags.serial:
        this.pc = 0x58;
        break;
      case InterruptService.flags.joypad:
        this.pc = 0x40;
        break;
    }
  }
  /**
   * Logs the internal state of the this.
   */
  public log = (): void => {
    console.log(`JS GB Registers: ${JSON.stringify(this.r)}`);
    console.log(`JS GB PC: ${this.pc}`);
    console.log(`JS GB SP: ${this.sp}`);
  };

  public setCYFlag = (value: boolean | byte): void => {
    if (value) {
      this.r.af |= 1 << 4;
    } else {
      this.r.af &= ~(1 << 4);
    }
  };

  public setHFlag = (value: boolean | byte): void => {
    if (value) {
      this.r.af |= 1 << 5;
    } else {
      this.r.af &= ~(1 << 5);
    }
  };

  public setNFlag = (value: boolean | byte): void => {
    if (value) {
      this.r.af |= 1 << 6;
    } else {
      this.r.af &= ~(1 << 6);
    }
  };

  public setZFlag = (value: boolean | byte): void => {
    if (value) {
      this.r.af |= 1 << 7;
    } else {
      this.r.af &= ~(1 << 7);
    }
  };

  public getCYFlag = (): bit => (this.r.af >> 4) & 1;
  public getHFlag = (): bit => (this.r.af >> 5) & 1;
  public getNFlag = (): bit => (this.r.af >> 6) & 1;
  public getZFlag = (): bit => (this.r.af >> 7) & 1;
  /**
   * Sets the Z flag if the register is 0, otherwise resets it.
   */
  public checkZFlag = (reg: byte): void => {
    this.setZFlag(!reg);
  };

  /**
   * Sets the half carry flag if a carry will be generated from bits 3 to 4 of the sum.
   * For 16-bit operations, this function should be called on the upper bytes of the operands.
   * Sources:
   * https://robdor.com/2016/08/10/gameboy-emulator-half-carry-flag/
   * https://stackoverflow.com/questions/8868396/game-boy-what-constitutes-a-half-carry
   * https://gbdev.io/gb-opcodes/optables/
   */
  public checkHalfCarry = (
    op1: byte,
    op2: byte,
    subtraction?: boolean
  ): void => {
    const carryBit = subtraction
      ? ((op1 & 0xf) - (op2 & 0xf)) & 0x10
      : ((op1 & 0xf) + (op2 & 0xf)) & 0x10;
    this.setHFlag(carryBit === 0x10);
  };
  /**
   * Sets the carry flag if the sum will exceed the size of the data type.
   */
  public checkFullCarry16 = (
    op1: word,
    op2: word,
    subtraction?: boolean
  ): void => {
    if (subtraction) {
      this.setCYFlag(op1 - op2 < 0);
    } else {
      this.setCYFlag(op1 + op2 > 0xffff);
    }
  };

  public checkFullCarry8 = (
    op1: byte,
    op2: byte,
    subtraction?: boolean
  ): void => {
    if (subtraction) {
      this.setCYFlag(op1 - op2 < 0);
    } else {
      this.setCYFlag(op1 + op2 > 0xffff);
    }
  };
}

export default CPU;
