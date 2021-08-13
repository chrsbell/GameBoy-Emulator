import OpcodeMap from 'CPU/sm83/Map';
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
  public memory!: Memory;
  // number of clock ticks per second
  private _clock = 4194304;
  get clock(): number {
    return this._clock;
  }
  // 16-bit program counter
  private _pc: word = 0;
  get pc(): word {
    return this._pc;
  }
  set pc(value: word) {
    this._pc = value;
  }
  // stack pointer
  private _sp: word = 0;
  get sp(): word {
    return this._sp;
  }
  set sp(value: word) {
    this._sp = value;
  }
  private _r: Registers = {
    af: 0,
    bc: 0,
    de: 0,
    hl: 0,
  };
  get r(): Registers {
    return this._r;
  }
  set r(value: Registers) {
    this._r = value;
  }
  private _halted = false;
  get halted(): boolean {
    return this._halted;
  }
  set halted(value: boolean) {
    this._halted = value;
  }
  public allInterruptsEnabled = true;
  private opcodes: OpcodeList = Opcodes;
  private lastExecuted: Array<string> = [];
  constructor(memory: Memory) {
    this.memory = memory;

    Object.entries(ops).forEach(([name, opcode]) => {
      ops[name] = ops[name].bind(this); // benchmarkFunction(this, opcode, opcode);
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
  public executeBiosInstr = (): number => {
    if (this.pc >= 0x100) {
      DEBUG && console.log('Exiting bios.');
      this.initPowerSequence(this.memory);
      this.execute = this.executeInstruction;
      return this.execute();
    }
    const opcode: byte = this.memory.bios[this.pc];
    this.pc += 1;
    this.pc &= 0xffff;
    return ops[opcode]();
  };
  public executeInstruction = (): number => {
    const opcode: byte = this.memory.readByte(this.pc);
    this.pc += 1;
    this.pc &= 0xffff;
    return ops[opcode]();
  };
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  public execute: () => number = this.executeBiosInstr;
  public addCalledInstruction = (opcode: string): void => {
    this.lastExecuted.unshift(opcode);
    if (this.lastExecuted.length > 100) {
      this.lastExecuted.pop();
    }
  };
  public checkInterrupts = (): void => {
    if (this.allInterruptsEnabled) {
      const register: byte = this.memory.readByte(0xff0f);
      if (register) {
        const interruptsTriggered = register & this.memory.readByte(0xffff);
        if (interruptsTriggered) {
          this.handleInterrupts(this.memory, interruptsTriggered);
        }
      }
    }
  };
  public handleInterrupts = (
    memory: Memory,
    interruptsTriggered: byte
  ): void => {
    this.setInterruptsGlobal(false);
    for (let i = 0; i < 5; i++) {
      const interrupt = (interruptsTriggered >> i) & 1;
      if (interrupt) {
        const register: byte = memory.readByte(Memory.addresses.interrupt.if);
        memory.writeByte(
          InterruptService.flags.if,
          Primitive.clearBit(register, interrupt)
        );
        helpers.PUSH(this, this.pc);
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
    }
  };
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
  public checkHalfCarryAdd = (op1: byte, op2: byte): void => {
    this.setHFlag((((op1 & 0xf) + (op2 & 0xf)) & 0x10) === 0x10);
  };

  public checkHalfCarrySub = (op1: byte, op2: byte): void => {
    this.setHFlag((((op1 & 0xf) - (op2 & 0xf)) & 0x10) === 0x10);
  };

  public checkFullCarrySub16 = (op1: word, op2: word): void => {
    this.setCYFlag(op1 - op2 < 0);
  };

  public checkFullCarryAdd16 = (op1: word, op2: word): void => {
    this.setCYFlag(op1 + op2 > 0xffff);
  };

  public checkFullCarrySub8 = (op1: byte, op2: byte): void => {
    this.setCYFlag(op1 - op2 < 0);
  };

  public checkFullCarryAdd8 = (op1: byte, op2: byte): void => {
    this.setCYFlag(op1 + op2 > 0xffff);
  };

  public ADD = (operand: byte): void => {
    this.checkFullCarryAdd8(Primitive.upper(this.r.af), operand);
    this.checkHalfCarryAdd(Primitive.upper(this.r.af), operand);
    this.r.af = Primitive.addUpper(this.r.af, operand);
    this.checkZFlag(Primitive.upper(this.r.af));
    this.setNFlag(0);
  };

  public ADC = (operand: byte): void => {
    operand = Primitive.addByte(operand, <byte>this.getCYFlag());
    this.checkFullCarryAdd8(Primitive.upper(this.r.af), operand);
    this.checkHalfCarryAdd(Primitive.upper(this.r.af), operand);
    this.r.af = Primitive.addUpper(this.r.af, operand);
    this.checkZFlag(Primitive.upper(this.r.af));
    this.setNFlag(0);
  };

  public SUB = (operand: byte): void => {
    this.checkFullCarrySub8(Primitive.upper(this.r.af), operand);
    this.checkHalfCarrySub(Primitive.upper(this.r.af), operand);
    this.r.af = Primitive.toWord(Primitive.addUpper(this.r.af, -operand));
    this.checkZFlag(Primitive.upper(this.r.af));
    this.setNFlag(1);
  };

  public SBC = (operand: byte): void => {
    const carry = this.getCYFlag() ? -1 : 0;
    operand = Primitive.addByte(operand, carry);
    this.checkFullCarrySub8(Primitive.upper(this.r.af), operand);
    this.checkHalfCarrySub(Primitive.upper(this.r.af), operand);
    this.r.af = Primitive.toWord(Primitive.addUpper(this.r.af, -operand));
    this.checkZFlag(Primitive.upper(this.r.af));
    this.setNFlag(1);
  };

  public OR = (operand: byte): void => {
    this.r.af = (this.r.af & 255) | (((this.r.af >> 8) | operand) << 8);
    this.checkZFlag(this.r.af >> 8);
    this.setNFlag(0);
    this.setHFlag(0);
    this.setCYFlag(0);
  };

  public AND = (operand: byte): void => {
    this.r.af = (this.r.af & 255) | (((this.r.af >> 8) & operand) << 8);
    this.checkZFlag(this.r.af >> 8);
    this.setNFlag(0);
    this.setHFlag(1);
    this.setCYFlag(0);
  };

  public XOR = (operand: byte): void => {
    this.r.af = (this.r.af & 255) | (((this.r.af >> 8) ^ operand) << 8);
    this.checkZFlag(this.r.af >> 8);
    this.setNFlag(0);
    this.setHFlag(0);
    this.setCYFlag(0);
  };

  public CP = (operand: byte): void => {
    this.checkFullCarrySub8(Primitive.upper(this.r.af), operand);
    this.checkHalfCarrySub(Primitive.upper(this.r.af), operand);
    this.r.af |= 1 << 6;
    this.checkZFlag(((this.r.af >> 8) - operand) & 255);
  };

  public CALL = (flag: boolean): boolean => {
    if (flag) {
      this.sp = Primitive.addWord(this.sp, -2);
      this.memory.writeWord(this.sp, Primitive.toWord(this.pc + 2));
      this.pc = this.memory.readWord(this.pc);
      return true;
    }
    return false;
  };

  public PUSH = (register: word): void => {
    this.sp = Primitive.addWord(this.sp, -1);
    this.memory.writeByte(this.sp, Primitive.upper(register));
    this.sp = Primitive.addWord(this.sp, -1);
    this.memory.writeByte(this.sp, Primitive.lower(register));
  };

  public POP = (): word => {
    const value: word = this.memory.readWord(this.sp);
    this.sp = Primitive.addWord(this.sp, 2);
    return value;
  };

  public Jpcc = (flag: boolean): boolean => {
    if (flag) {
      this.pc = this.memory.readWord(this.pc);
      return true;
    }
    return false;
  };

  public RET = (flag: boolean): boolean => {
    if (flag) {
      this.pc = this.memory.readWord(this.sp);
      this.sp = Primitive.addWord(this.sp, 2);
      return true;
    }
    return false;
  };

  public RST = (address: word): void => {
    this.sp = Primitive.addWord(this.sp, -2);
    this.memory.writeWord(this.sp, this.pc);
    this.pc = address;
  };
}

export default CPU;

/**
 * No operation.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function NOP(cpu: CPU): byte {
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBCid16i(cpu: CPU): byte {
  cpu.r.bc = cpu.memory.readWord(cpu.pc);
  cpu.pc += 2;
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBCmAi(cpu: CPU): byte {
  cpu.memory.writeByte(cpu.r.bc, Primitive.upper(cpu.r.af));
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCBCi(cpu: CPU): byte {
  cpu.r.bc = Primitive.addWord(cpu.r.bc, 1);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCBi(cpu: CPU): byte {
  // convert operand to unsigned
  let operand: byte = 1;
  // check for half carry on affected byte only
  cpu.checkHalfCarryAdd(Primitive.upper(cpu.r.bc), operand);
  // perform addition
  operand = Primitive.addByte(operand, Primitive.upper(cpu.r.bc));
  cpu.r.bc = Primitive.setUpper(cpu.r.bc, operand);

  cpu.checkZFlag(Primitive.upper(cpu.r.bc));
  cpu.setNFlag(0);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECBi(cpu: CPU): byte {
  cpu.checkHalfCarrySub(Primitive.upper(cpu.r.bc), 1);
  cpu.r.bc = Primitive.addUpper(cpu.r.bc, Primitive.toByte(-1));
  cpu.checkZFlag(Primitive.upper(cpu.r.bc));
  cpu.setNFlag(1);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBid8i(cpu: CPU): byte {
  // load into B from pc (immediate)
  cpu.r.bc = Primitive.setUpper(
    cpu.r.bc,
    Primitive.toByte(cpu.memory.readByte(cpu.pc))
  );
  cpu.pc += 1;
  return 8;
}

/**
 * Rotate A left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCA(cpu: CPU): byte {
  // check carry flag
  cpu.setCYFlag(Primitive.upper(cpu.r.af) >> 7);
  // left shift
  const shifted: byte = Primitive.upper(cpu.r.af) << 1;
  cpu.r.af = Primitive.setUpper(
    cpu.r.af,
    Primitive.toByte(shifted | (shifted >> 8))
  );
  // flag resets
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  cpu.setZFlag(0);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDa16mSPi(cpu: CPU): byte {
  cpu.memory.writeWord(cpu.memory.readWord(cpu.pc), cpu.sp);
  return 20;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiBCi(cpu: CPU): byte {
  cpu.checkFullCarryAdd16(cpu.r.hl, cpu.r.bc);
  cpu.checkHalfCarryAdd(Primitive.upper(cpu.r.hl), Primitive.upper(cpu.r.bc));
  cpu.r.hl = Primitive.addWord(cpu.r.hl, cpu.r.bc);
  cpu.setNFlag(0);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiBCm(cpu: CPU): byte {
  cpu.r.af = Primitive.setUpper(
    cpu.r.af,
    Primitive.toByte(cpu.memory.readByte(cpu.r.bc))
  );
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECBCi(cpu: CPU): byte {
  cpu.r.bc = Primitive.addWord(cpu.r.bc, -1);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCCi(cpu: CPU): byte {
  // convert operand to unsigned
  let operand: byte = 1;
  // check for half carry on affected byte only
  cpu.checkHalfCarryAdd(Primitive.lower(cpu.r.bc), operand);
  // perform addition
  operand = Primitive.addByte(operand, Primitive.lower(cpu.r.bc));
  cpu.r.bc = Primitive.setLower(cpu.r.bc, operand);

  cpu.checkZFlag(Primitive.lower(cpu.r.bc));
  cpu.setNFlag(0);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECCi(cpu: CPU): byte {
  // convert operand to unsigned
  cpu.checkHalfCarrySub(Primitive.lower(cpu.r.bc), 1);
  cpu.r.bc = Primitive.addLower(cpu.r.bc, Primitive.toByte(-1));
  cpu.checkZFlag(Primitive.lower(cpu.r.bc));
  cpu.setNFlag(1);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCid8i(cpu: CPU): byte {
  // load into C from pc (immediate)
  cpu.r.bc = Primitive.setLower(
    cpu.r.bc,
    Primitive.toByte(cpu.memory.readByte(cpu.pc))
  );
  cpu.pc += 1;
  return 8;
}

/**
 * Rotate A right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCA(cpu: CPU): byte {
  // check carry flag
  const bitZero = Primitive.upper(cpu.r.af) & 1;
  cpu.setCYFlag(bitZero);
  // right shift
  const shifted: byte = Primitive.upper(cpu.r.af) >> 1;
  cpu.r.af = Primitive.setUpper(
    cpu.r.af,
    Primitive.toByte(shifted | (bitZero << 7))
  );
  // flag resets
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  cpu.setZFlag(0);
  return 4;
}

/**
 *  Halt CPU & LCD display until button pressed.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function STOP(cpu: CPU): byte {
  cpu.halted = true;
  console.log('Instruction halted.');
  throw new Error();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDEid16i(cpu: CPU): byte {
  cpu.r.de = cpu.memory.readWord(cpu.pc);
  cpu.pc += 2;
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDEmAi(cpu: CPU): byte {
  cpu.memory.writeByte(cpu.r.de, Primitive.upper(cpu.r.af));
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCDEi(cpu: CPU): byte {
  cpu.r.de = Primitive.addWord(cpu.r.de, 1);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCDi(cpu: CPU): byte {
  OpcodeMap[0x14](cpu);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECDi(cpu: CPU): byte {
  OpcodeMap[0x15](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDid8i(cpu: CPU): byte {
  OpcodeMap[0x16](cpu);
  return 8;
}

/**
 * Rotate A left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLA(cpu: CPU): byte {
  OpcodeMap[0x17](cpu);
  return 4;
}

/**
 * Jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function JRr8(cpu: CPU): byte {
  OpcodeMap[0x18](cpu);
  return 12;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiDEi(cpu: CPU): byte {
  OpcodeMap[0x19](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiDEm(cpu: CPU): byte {
  OpcodeMap[0x1a](cpu);
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECDEi(cpu: CPU): byte {
  OpcodeMap[0x1b](cpu);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCEi(cpu: CPU): byte {
  OpcodeMap[0x1c](cpu);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECEi(cpu: CPU): byte {
  OpcodeMap[0x1d](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEid8i(cpu: CPU): byte {
  OpcodeMap[0x1e](cpu);
  return 8;
}

/**
 * Rotate A right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRA(cpu: CPU): byte {
  OpcodeMap[0x1f](cpu);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCNZr8(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0x20](cpu);
  if (!condition) {
    return 8;
  }
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLid16i(cpu: CPU): byte {
  OpcodeMap[0x21](cpu);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLIncrmAi(cpu: CPU): byte {
  OpcodeMap[0x22](cpu);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCHLi(cpu: CPU): byte {
  OpcodeMap[0x23](cpu);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCHi(cpu: CPU): byte {
  OpcodeMap[0x24](cpu);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECHi(cpu: CPU): byte {
  OpcodeMap[0x25](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHid8i(cpu: CPU): byte {
  OpcodeMap[0x26](cpu);
  return 8;
}

/**
 * Decimal adjust register A.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, H, C
 */
function DAAA(cpu: CPU): byte {
  OpcodeMap[0x27](cpu);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCZr8(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0x28](cpu);
  if (!condition) {
    return 8;
  }
  return 12;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiHLi(cpu: CPU): byte {
  OpcodeMap[0x29](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLIncrm(cpu: CPU): byte {
  OpcodeMap[0x2a](cpu);
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECHLi(cpu: CPU): byte {
  OpcodeMap[0x2b](cpu);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCLi(cpu: CPU): byte {
  OpcodeMap[0x2c](cpu);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECLi(cpu: CPU): byte {
  OpcodeMap[0x2d](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLid8i(cpu: CPU): byte {
  OpcodeMap[0x2e](cpu);
  return 8;
}

/**
 * Complement A register. (Flip all bits.)
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H
 */
function CPLA(cpu: CPU): byte {
  OpcodeMap[0x2f](cpu);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCNCr8(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0x30](cpu);
  if (!condition) {
    return 8;
  }
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDSPid16i(cpu: CPU): byte {
  OpcodeMap[0x31](cpu);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLDecrmAi(cpu: CPU): byte {
  OpcodeMap[0x32](cpu);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCSPi(cpu: CPU): byte {
  OpcodeMap[0x33](cpu);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCHLm(cpu: CPU): byte {
  OpcodeMap[0x34](cpu);
  return 12;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECHLm(cpu: CPU): byte {
  OpcodeMap[0x35](cpu);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmd8i(cpu: CPU): byte {
  OpcodeMap[0x36](cpu);
  return 12;
}

/**
 *  Set Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function SCF(cpu: CPU): byte {
  OpcodeMap[0x37](cpu);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCCr8(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0x38](cpu);
  if (!condition) {
    return 8;
  }
  return 12;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiSPi(cpu: CPU): byte {
  OpcodeMap[0x39](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLDecrm(cpu: CPU): byte {
  OpcodeMap[0x3a](cpu);
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECSPi(cpu: CPU): byte {
  OpcodeMap[0x3b](cpu);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCAi(cpu: CPU): byte {
  OpcodeMap[0x3c](cpu);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECAi(cpu: CPU): byte {
  OpcodeMap[0x3d](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAid8i(cpu: CPU): byte {
  OpcodeMap[0x3e](cpu);
  return 8;
}

/**
 * Complement carry flag.
 * If C flag is set, then reset it.
 * If C flag is reset, then set it.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function CCF(cpu: CPU): byte {
  OpcodeMap[0x3f](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiBi(cpu: CPU): byte {
  OpcodeMap[0x40](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiCi(cpu: CPU): byte {
  OpcodeMap[0x41](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiDi(cpu: CPU): byte {
  OpcodeMap[0x42](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiEi(cpu: CPU): byte {
  OpcodeMap[0x43](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiHi(cpu: CPU): byte {
  OpcodeMap[0x44](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiLi(cpu: CPU): byte {
  OpcodeMap[0x45](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiHLm(cpu: CPU): byte {
  OpcodeMap[0x46](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiAi(cpu: CPU): byte {
  OpcodeMap[0x47](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiBi(cpu: CPU): byte {
  OpcodeMap[0x48](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiCi(cpu: CPU): byte {
  OpcodeMap[0x49](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiDi(cpu: CPU): byte {
  OpcodeMap[0x4a](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiEi(cpu: CPU): byte {
  OpcodeMap[0x4b](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiHi(cpu: CPU): byte {
  OpcodeMap[0x4c](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiLi(cpu: CPU): byte {
  OpcodeMap[0x4d](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiHLm(cpu: CPU): byte {
  OpcodeMap[0x4e](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiAi(cpu: CPU): byte {
  OpcodeMap[0x4f](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiBi(cpu: CPU): byte {
  OpcodeMap[0x50](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiCi(cpu: CPU): byte {
  OpcodeMap[0x51](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiDi(cpu: CPU): byte {
  OpcodeMap[0x52](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiEi(cpu: CPU): byte {
  OpcodeMap[0x53](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiHi(cpu: CPU): byte {
  OpcodeMap[0x54](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiLi(cpu: CPU): byte {
  OpcodeMap[0x55](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiHLm(cpu: CPU): byte {
  OpcodeMap[0x56](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiAi(cpu: CPU): byte {
  OpcodeMap[0x57](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiBi(cpu: CPU): byte {
  OpcodeMap[0x58](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiCi(cpu: CPU): byte {
  OpcodeMap[0x59](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiDi(cpu: CPU): byte {
  OpcodeMap[0x5a](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiEi(cpu: CPU): byte {
  OpcodeMap[0x5b](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiHi(cpu: CPU): byte {
  OpcodeMap[0x5c](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiLi(cpu: CPU): byte {
  OpcodeMap[0x5d](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiHLm(cpu: CPU): byte {
  OpcodeMap[0x5e](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiAi(cpu: CPU): byte {
  OpcodeMap[0x5f](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiBi(cpu: CPU): byte {
  OpcodeMap[0x60](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiCi(cpu: CPU): byte {
  OpcodeMap[0x61](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiDi(cpu: CPU): byte {
  OpcodeMap[0x62](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiEi(cpu: CPU): byte {
  OpcodeMap[0x63](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiHi(cpu: CPU): byte {
  OpcodeMap[0x64](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiLi(cpu: CPU): byte {
  OpcodeMap[0x65](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiHLm(cpu: CPU): byte {
  OpcodeMap[0x66](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiAi(cpu: CPU): byte {
  OpcodeMap[0x67](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiBi(cpu: CPU): byte {
  OpcodeMap[0x68](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiCi(cpu: CPU): byte {
  OpcodeMap[0x69](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiDi(cpu: CPU): byte {
  OpcodeMap[0x6a](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiEi(cpu: CPU): byte {
  OpcodeMap[0x6b](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiHi(cpu: CPU): byte {
  OpcodeMap[0x6c](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiLi(cpu: CPU): byte {
  OpcodeMap[0x6d](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiHLm(cpu: CPU): byte {
  OpcodeMap[0x6e](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiAi(cpu: CPU): byte {
  OpcodeMap[0x6f](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmBi(cpu: CPU): byte {
  OpcodeMap[0x70](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmCi(cpu: CPU): byte {
  OpcodeMap[0x71](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmDi(cpu: CPU): byte {
  OpcodeMap[0x72](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmEi(cpu: CPU): byte {
  OpcodeMap[0x73](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmHi(cpu: CPU): byte {
  OpcodeMap[0x74](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmLi(cpu: CPU): byte {
  OpcodeMap[0x75](cpu);
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function HALT(cpu: CPU): byte {
  OpcodeMap[0x76](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmAi(cpu: CPU): byte {
  OpcodeMap[0x77](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiBi(cpu: CPU): byte {
  OpcodeMap[0x78](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiCi(cpu: CPU): byte {
  OpcodeMap[0x79](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiDi(cpu: CPU): byte {
  OpcodeMap[0x7a](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiEi(cpu: CPU): byte {
  OpcodeMap[0x7b](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHi(cpu: CPU): byte {
  OpcodeMap[0x7c](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiLi(cpu: CPU): byte {
  OpcodeMap[0x7d](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLm(cpu: CPU): byte {
  OpcodeMap[0x7e](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiAi(cpu: CPU): byte {
  OpcodeMap[0x7f](cpu);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiBi(cpu: CPU): byte {
  OpcodeMap[0x80](cpu);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiCi(cpu: CPU): byte {
  OpcodeMap[0x81](cpu);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiDi(cpu: CPU): byte {
  OpcodeMap[0x82](cpu);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiEi(cpu: CPU): byte {
  OpcodeMap[0x83](cpu);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiHi(cpu: CPU): byte {
  OpcodeMap[0x84](cpu);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiLi(cpu: CPU): byte {
  OpcodeMap[0x85](cpu);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiHLm(cpu: CPU): byte {
  OpcodeMap[0x86](cpu);
  return 8;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiAi(cpu: CPU): byte {
  OpcodeMap[0x87](cpu);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiBi(cpu: CPU): byte {
  OpcodeMap[0x88](cpu);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiCi(cpu: CPU): byte {
  OpcodeMap[0x89](cpu);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiDi(cpu: CPU): byte {
  OpcodeMap[0x8a](cpu);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiEi(cpu: CPU): byte {
  OpcodeMap[0x8b](cpu);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiHi(cpu: CPU): byte {
  OpcodeMap[0x8c](cpu);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiLi(cpu: CPU): byte {
  OpcodeMap[0x8d](cpu);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiHLm(cpu: CPU): byte {
  OpcodeMap[0x8e](cpu);
  return 8;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiAi(cpu: CPU): byte {
  OpcodeMap[0x8f](cpu);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiBi(cpu: CPU): byte {
  OpcodeMap[0x90](cpu);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiCi(cpu: CPU): byte {
  OpcodeMap[0x91](cpu);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiDi(cpu: CPU): byte {
  OpcodeMap[0x92](cpu);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiEi(cpu: CPU): byte {
  OpcodeMap[0x93](cpu);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiHi(cpu: CPU): byte {
  OpcodeMap[0x94](cpu);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiLi(cpu: CPU): byte {
  OpcodeMap[0x95](cpu);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiHLm(cpu: CPU): byte {
  OpcodeMap[0x96](cpu);
  return 8;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiAi(cpu: CPU): byte {
  OpcodeMap[0x97](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiBi(cpu: CPU): byte {
  OpcodeMap[0x98](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiCi(cpu: CPU): byte {
  OpcodeMap[0x99](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiDi(cpu: CPU): byte {
  OpcodeMap[0x9a](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiEi(cpu: CPU): byte {
  OpcodeMap[0x9b](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiHi(cpu: CPU): byte {
  OpcodeMap[0x9c](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiLi(cpu: CPU): byte {
  OpcodeMap[0x9d](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiHLm(cpu: CPU): byte {
  OpcodeMap[0x9e](cpu);
  return 8;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiAi(cpu: CPU): byte {
  OpcodeMap[0x9f](cpu);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDBi(cpu: CPU): byte {
  OpcodeMap[0xa0](cpu);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDCi(cpu: CPU): byte {
  OpcodeMap[0xa1](cpu);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDDi(cpu: CPU): byte {
  OpcodeMap[0xa2](cpu);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDEi(cpu: CPU): byte {
  OpcodeMap[0xa3](cpu);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDHi(cpu: CPU): byte {
  OpcodeMap[0xa4](cpu);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDLi(cpu: CPU): byte {
  OpcodeMap[0xa5](cpu);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDHLm(cpu: CPU): byte {
  OpcodeMap[0xa6](cpu);
  return 8;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDAi(cpu: CPU): byte {
  OpcodeMap[0xa7](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORBi(cpu: CPU): byte {
  OpcodeMap[0xa8](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORCi(cpu: CPU): byte {
  OpcodeMap[0xa9](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORDi(cpu: CPU): byte {
  OpcodeMap[0xaa](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XOREi(cpu: CPU): byte {
  OpcodeMap[0xab](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORHi(cpu: CPU): byte {
  OpcodeMap[0xac](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORLi(cpu: CPU): byte {
  OpcodeMap[0xad](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORHLm(cpu: CPU): byte {
  OpcodeMap[0xae](cpu);
  return 8;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORAi(cpu: CPU): byte {
  OpcodeMap[0xaf](cpu);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORBi(cpu: CPU): byte {
  OpcodeMap[0xb0](cpu);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORCi(cpu: CPU): byte {
  OpcodeMap[0xb1](cpu);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORDi(cpu: CPU): byte {
  OpcodeMap[0xb2](cpu);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function OREi(cpu: CPU): byte {
  OpcodeMap[0xb3](cpu);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORHi(cpu: CPU): byte {
  OpcodeMap[0xb4](cpu);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORLi(cpu: CPU): byte {
  OpcodeMap[0xb5](cpu);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORHLm(cpu: CPU): byte {
  OpcodeMap[0xb6](cpu);
  return 8;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORAi(cpu: CPU): byte {
  OpcodeMap[0xb7](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPBi(cpu: CPU): byte {
  OpcodeMap[0xb8](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPCi(cpu: CPU): byte {
  OpcodeMap[0xb9](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPDi(cpu: CPU): byte {
  OpcodeMap[0xba](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPEi(cpu: CPU): byte {
  OpcodeMap[0xbb](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPHi(cpu: CPU): byte {
  OpcodeMap[0xbc](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPLi(cpu: CPU): byte {
  OpcodeMap[0xbd](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPHLm(cpu: CPU): byte {
  OpcodeMap[0xbe](cpu);
  return 8;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPAi(cpu: CPU): byte {
  OpcodeMap[0xbf](cpu);
  return 4;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCNZ(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xc0](cpu);
  if (!condition) {
    return 8;
  }
  return 20;
}

/**
 * Pops to the 16-bit register, data from the stack this.memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function POPIntoBCi(cpu: CPU): byte {
  OpcodeMap[0xc1](cpu);
  return 12;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCNZa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xc2](cpu);
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function JPa16(cpu: CPU): byte {
  OpcodeMap[0xc3](cpu);
  return 16;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCNZa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xc4](cpu);
  if (!condition) {
    return 12;
  }
  return 24;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterBCi(cpu: CPU): byte {
  OpcodeMap[0xc5](cpu);
  return 16;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAid8i(cpu: CPU): byte {
  OpcodeMap[0xc6](cpu);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi00Hi(cpu: CPU): byte {
  OpcodeMap[0xc7](cpu);
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCZ(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xc8](cpu);
  if (!condition) {
    return 8;
  }
  return 20;
}

/**
 * Return from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RET(cpu: CPU): byte {
  OpcodeMap[0xc9](cpu);
  return 16;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCZa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xca](cpu);
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Execute a CB-prefixed instruction.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PREFIX(cpu: CPU): byte {
  OpcodeMap[0xcb](cpu);
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCZa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xcc](cpu);
  if (!condition) {
    return 12;
  }
  return 24;
}

/**
 * Function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function CALL(cpu: CPU): byte {
  OpcodeMap[0xcd](cpu);
  return 24;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAid8i(cpu: CPU): byte {
  OpcodeMap[0xce](cpu);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi08Hi(cpu: CPU): byte {
  OpcodeMap[0xcf](cpu);
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCNC(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xd0](cpu);
  if (!condition) {
    return 8;
  }
  return 20;
}

/**
 * Pops to the 16-bit register, data from the stack this.memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function POPIntoDEi(cpu: CPU): byte {
  OpcodeMap[0xd1](cpu);
  return 12;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCNCa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xd2](cpu);
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalD3(cpu: CPU): byte {
  OpcodeMap[0xd3](cpu);
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCNCa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xd4](cpu);
  if (!condition) {
    return 12;
  }
  return 24;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterDEi(cpu: CPU): byte {
  OpcodeMap[0xd5](cpu);
  return 16;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAid8i(cpu: CPU): byte {
  OpcodeMap[0xd6](cpu);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi10Hi(cpu: CPU): byte {
  OpcodeMap[0xd7](cpu);
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCC(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xd8](cpu);
  if (!condition) {
    return 8;
  }
  return 20;
}

/**
 * Return from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RETI(cpu: CPU): byte {
  OpcodeMap[0xd9](cpu);
  return 16;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCCa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xda](cpu);
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalDB(cpu: CPU): byte {
  OpcodeMap[0xdb](cpu);
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCCa16(cpu: CPU): byte {
  const condition: boolean = OpcodeMap[0xdc](cpu);
  if (!condition) {
    return 12;
  }
  return 24;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalDD(cpu: CPU): byte {
  OpcodeMap[0xdd](cpu);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAid8i(cpu: CPU): byte {
  OpcodeMap[0xde](cpu);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi18Hi(cpu: CPU): byte {
  OpcodeMap[0xdf](cpu);
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHa8mAi(cpu: CPU): byte {
  OpcodeMap[0xe0](cpu);
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack this.memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function POPIntoHLi(cpu: CPU): byte {
  OpcodeMap[0xe1](cpu);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCmAi(cpu: CPU): byte {
  OpcodeMap[0xe2](cpu);
  return 8;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalE3(cpu: CPU): byte {
  OpcodeMap[0xe3](cpu);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalE4(cpu: CPU): byte {
  OpcodeMap[0xe4](cpu);
  return 4;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterHLi(cpu: CPU): byte {
  OpcodeMap[0xe5](cpu);
  return 16;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDd8i(cpu: CPU): byte {
  OpcodeMap[0xe6](cpu);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi20Hi(cpu: CPU): byte {
  OpcodeMap[0xe7](cpu);
  return 16;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDSPir8i(cpu: CPU): byte {
  OpcodeMap[0xe8](cpu);
  return 16;
}

/**
 * Jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function JPHL(cpu: CPU): byte {
  OpcodeMap[0xe9](cpu);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDa16mAi(cpu: CPU): byte {
  OpcodeMap[0xea](cpu);
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalEB(cpu: CPU): byte {
  OpcodeMap[0xeb](cpu);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalEC(cpu: CPU): byte {
  OpcodeMap[0xec](cpu);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalED(cpu: CPU): byte {
  OpcodeMap[0xed](cpu);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORd8i(cpu: CPU): byte {
  OpcodeMap[0xee](cpu);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi28Hi(cpu: CPU): byte {
  OpcodeMap[0xef](cpu);
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHAia8m(cpu: CPU): byte {
  OpcodeMap[0xf0](cpu);
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack this.memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function POPIntoAFi(cpu: CPU): byte {
  OpcodeMap[0xf1](cpu);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiCm(cpu: CPU): byte {
  OpcodeMap[0xf2](cpu);
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DI(cpu: CPU): byte {
  OpcodeMap[0xf3](cpu);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalF4(cpu: CPU): byte {
  OpcodeMap[0xf4](cpu);
  return 4;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterAFi(cpu: CPU): byte {
  OpcodeMap[0xf5](cpu);
  return 16;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORd8i(cpu: CPU): byte {
  OpcodeMap[0xf6](cpu);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi30Hi(cpu: CPU): byte {
  OpcodeMap[0xf7](cpu);
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function LDHLiSPIncri(cpu: CPU): byte {
  OpcodeMap[0xf8](cpu);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDSPiHLi(cpu: CPU): byte {
  OpcodeMap[0xf9](cpu);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAia16m(cpu: CPU): byte {
  OpcodeMap[0xfa](cpu);
  return 16;
}

/**
 * Enables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function EI(cpu: CPU): byte {
  OpcodeMap[0xfb](cpu);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalFC(cpu: CPU): byte {
  OpcodeMap[0xfc](cpu);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalFD(cpu: CPU): byte {
  OpcodeMap[0xfd](cpu);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPd8i(cpu: CPU): byte {
  const operand = cpu.memory.readByte(cpu.pc);
  const a = cpu.r.af >> 8;
  cpu.pc += 1;
  const diff = a - operand;
  cpu.setCYFlag(diff < 0);
  cpu.checkHalfCarrySub(a, operand);
  cpu.r.af |= 1 << 6;
  cpu.checkZFlag(diff & 255);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi38Hi(cpu: CPU): byte {
  OpcodeMap[0xff](cpu);
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCBi(cpu: CPU): byte {
  OpcodeMap[0x00](cpu);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCCi(cpu: CPU): byte {
  OpcodeMap[0x01](cpu);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCDi(cpu: CPU): byte {
  OpcodeMap[0x02](cpu);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCEi(cpu: CPU): byte {
  OpcodeMap[0x03](cpu);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCHi(cpu: CPU): byte {
  OpcodeMap[0x04](cpu);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCLi(cpu: CPU): byte {
  OpcodeMap[0x05](cpu);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCHLm(cpu: CPU): byte {
  OpcodeMap[0x06](cpu);
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCAi(cpu: CPU): byte {
  OpcodeMap[0x07](cpu);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCBi(cpu: CPU): byte {
  OpcodeMap[0x08](cpu);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCCi(cpu: CPU): byte {
  OpcodeMap[0x09](cpu);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCDi(cpu: CPU): byte {
  OpcodeMap[0x0a](cpu);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCEi(cpu: CPU): byte {
  OpcodeMap[0x0b](cpu);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCHi(cpu: CPU): byte {
  OpcodeMap[0x0c](cpu);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCLi(cpu: CPU): byte {
  OpcodeMap[0x0d](cpu);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCHLm(cpu: CPU): byte {
  OpcodeMap[0x0e](cpu);
  return 16;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCAi(cpu: CPU): byte {
  OpcodeMap[0x0f](cpu);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLBi(cpu: CPU): byte {
  OpcodeMap[0x10](cpu);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCi(cpu: CPU): byte {
  OpcodeMap[0x11](cpu);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLDi(cpu: CPU): byte {
  OpcodeMap[0x12](cpu);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLEi(cpu: CPU): byte {
  OpcodeMap[0x13](cpu);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLHi(cpu: CPU): byte {
  OpcodeMap[0x14](cpu);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLLi(cpu: CPU): byte {
  OpcodeMap[0x15](cpu);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLHLm(cpu: CPU): byte {
  OpcodeMap[0x16](cpu);
  return 16;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLAi(cpu: CPU): byte {
  OpcodeMap[0x17](cpu);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRBi(cpu: CPU): byte {
  OpcodeMap[0x18](cpu);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCi(cpu: CPU): byte {
  OpcodeMap[0x19](cpu);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRDi(cpu: CPU): byte {
  OpcodeMap[0x1a](cpu);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RREi(cpu: CPU): byte {
  OpcodeMap[0x1b](cpu);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRHi(cpu: CPU): byte {
  OpcodeMap[0x1c](cpu);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRLi(cpu: CPU): byte {
  OpcodeMap[0x1d](cpu);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRHLm(cpu: CPU): byte {
  OpcodeMap[0x1e](cpu);
  return 16;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRAi(cpu: CPU): byte {
  OpcodeMap[0x1f](cpu);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLABi(cpu: CPU): byte {
  OpcodeMap[0x20](cpu);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLACi(cpu: CPU): byte {
  OpcodeMap[0x21](cpu);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLADi(cpu: CPU): byte {
  OpcodeMap[0x22](cpu);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAEi(cpu: CPU): byte {
  OpcodeMap[0x23](cpu);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAHi(cpu: CPU): byte {
  OpcodeMap[0x24](cpu);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLALi(cpu: CPU): byte {
  OpcodeMap[0x25](cpu);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAHLm(cpu: CPU): byte {
  OpcodeMap[0x26](cpu);
  return 16;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAAi(cpu: CPU): byte {
  OpcodeMap[0x27](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRABi(cpu: CPU): byte {
  OpcodeMap[0x28](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRACi(cpu: CPU): byte {
  OpcodeMap[0x29](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRADi(cpu: CPU): byte {
  OpcodeMap[0x2a](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAEi(cpu: CPU): byte {
  OpcodeMap[0x2b](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAHi(cpu: CPU): byte {
  OpcodeMap[0x2c](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRALi(cpu: CPU): byte {
  OpcodeMap[0x2d](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAHLm(cpu: CPU): byte {
  OpcodeMap[0x2e](cpu);
  return 16;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAAi(cpu: CPU): byte {
  OpcodeMap[0x2f](cpu);
  return 8;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPBi(cpu: CPU): byte {
  OpcodeMap[0x30](cpu);
  return 8;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPCi(cpu: CPU): byte {
  OpcodeMap[0x31](cpu);
  return 8;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPDi(cpu: CPU): byte {
  OpcodeMap[0x32](cpu);
  return 8;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPEi(cpu: CPU): byte {
  OpcodeMap[0x33](cpu);
  return 8;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPHi(cpu: CPU): byte {
  OpcodeMap[0x34](cpu);
  return 8;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPLi(cpu: CPU): byte {
  OpcodeMap[0x35](cpu);
  return 8;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPHLm(cpu: CPU): byte {
  OpcodeMap[0x36](cpu);
  return 16;
}

/**
 * Swap Primitive.upper and Primitive.lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPAi(cpu: CPU): byte {
  OpcodeMap[0x37](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLBi(cpu: CPU): byte {
  OpcodeMap[0x38](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLCi(cpu: CPU): byte {
  OpcodeMap[0x39](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLDi(cpu: CPU): byte {
  OpcodeMap[0x3a](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLEi(cpu: CPU): byte {
  OpcodeMap[0x3b](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLHi(cpu: CPU): byte {
  OpcodeMap[0x3c](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLLi(cpu: CPU): byte {
  OpcodeMap[0x3d](cpu);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLHLm(cpu: CPU): byte {
  OpcodeMap[0x3e](cpu);
  return 16;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLAi(cpu: CPU): byte {
  OpcodeMap[0x3f](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iBi(cpu: CPU): byte {
  OpcodeMap[0x40](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iCi(cpu: CPU): byte {
  OpcodeMap[0x41](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iDi(cpu: CPU): byte {
  OpcodeMap[0x42](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iEi(cpu: CPU): byte {
  OpcodeMap[0x43](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iHi(cpu: CPU): byte {
  OpcodeMap[0x44](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iLi(cpu: CPU): byte {
  OpcodeMap[0x45](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iHLm(cpu: CPU): byte {
  OpcodeMap[0x46](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iAi(cpu: CPU): byte {
  OpcodeMap[0x47](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iBi(cpu: CPU): byte {
  OpcodeMap[0x48](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iCi(cpu: CPU): byte {
  OpcodeMap[0x49](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iDi(cpu: CPU): byte {
  OpcodeMap[0x4a](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iEi(cpu: CPU): byte {
  OpcodeMap[0x4b](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iHi(cpu: CPU): byte {
  OpcodeMap[0x4c](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iLi(cpu: CPU): byte {
  OpcodeMap[0x4d](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iHLm(cpu: CPU): byte {
  OpcodeMap[0x4e](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iAi(cpu: CPU): byte {
  OpcodeMap[0x4f](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iBi(cpu: CPU): byte {
  OpcodeMap[0x50](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iCi(cpu: CPU): byte {
  OpcodeMap[0x51](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iDi(cpu: CPU): byte {
  OpcodeMap[0x52](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iEi(cpu: CPU): byte {
  OpcodeMap[0x53](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iHi(cpu: CPU): byte {
  OpcodeMap[0x54](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iLi(cpu: CPU): byte {
  OpcodeMap[0x55](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iHLm(cpu: CPU): byte {
  OpcodeMap[0x56](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iAi(cpu: CPU): byte {
  OpcodeMap[0x57](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iBi(cpu: CPU): byte {
  OpcodeMap[0x58](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iCi(cpu: CPU): byte {
  OpcodeMap[0x59](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iDi(cpu: CPU): byte {
  OpcodeMap[0x5a](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iEi(cpu: CPU): byte {
  OpcodeMap[0x5b](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iHi(cpu: CPU): byte {
  OpcodeMap[0x5c](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iLi(cpu: CPU): byte {
  OpcodeMap[0x5d](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iHLm(cpu: CPU): byte {
  OpcodeMap[0x5e](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iAi(cpu: CPU): byte {
  OpcodeMap[0x5f](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iBi(cpu: CPU): byte {
  OpcodeMap[0x60](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iCi(cpu: CPU): byte {
  OpcodeMap[0x61](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iDi(cpu: CPU): byte {
  OpcodeMap[0x62](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iEi(cpu: CPU): byte {
  OpcodeMap[0x63](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iHi(cpu: CPU): byte {
  OpcodeMap[0x64](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iLi(cpu: CPU): byte {
  OpcodeMap[0x65](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iHLm(cpu: CPU): byte {
  OpcodeMap[0x66](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iAi(cpu: CPU): byte {
  OpcodeMap[0x67](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iBi(cpu: CPU): byte {
  OpcodeMap[0x68](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iCi(cpu: CPU): byte {
  OpcodeMap[0x69](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iDi(cpu: CPU): byte {
  OpcodeMap[0x6a](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iEi(cpu: CPU): byte {
  OpcodeMap[0x6b](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iHi(cpu: CPU): byte {
  OpcodeMap[0x6c](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iLi(cpu: CPU): byte {
  OpcodeMap[0x6d](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iHLm(cpu: CPU): byte {
  OpcodeMap[0x6e](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iAi(cpu: CPU): byte {
  OpcodeMap[0x6f](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iBi(cpu: CPU): byte {
  OpcodeMap[0x70](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iCi(cpu: CPU): byte {
  OpcodeMap[0x71](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iDi(cpu: CPU): byte {
  OpcodeMap[0x72](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iEi(cpu: CPU): byte {
  OpcodeMap[0x73](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iHi(cpu: CPU): byte {
  OpcodeMap[0x74](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iLi(cpu: CPU): byte {
  OpcodeMap[0x75](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iHLm(cpu: CPU): byte {
  OpcodeMap[0x76](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iAi(cpu: CPU): byte {
  OpcodeMap[0x77](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iBi(cpu: CPU): byte {
  OpcodeMap[0x78](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iCi(cpu: CPU): byte {
  OpcodeMap[0x79](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iDi(cpu: CPU): byte {
  OpcodeMap[0x7a](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iEi(cpu: CPU): byte {
  OpcodeMap[0x7b](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iHi(cpu: CPU): byte {
  OpcodeMap[0x7c](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iLi(cpu: CPU): byte {
  OpcodeMap[0x7d](cpu);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iHLm(cpu: CPU): byte {
  OpcodeMap[0x7e](cpu);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iAi(cpu: CPU): byte {
  OpcodeMap[0x7f](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0B(cpu: CPU): byte {
  OpcodeMap[0x80](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0C(cpu: CPU): byte {
  OpcodeMap[0x81](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0D(cpu: CPU): byte {
  OpcodeMap[0x82](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0E(cpu: CPU): byte {
  OpcodeMap[0x83](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0H(cpu: CPU): byte {
  OpcodeMap[0x84](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0L(cpu: CPU): byte {
  OpcodeMap[0x85](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0HL(cpu: CPU): byte {
  OpcodeMap[0x86](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0A(cpu: CPU): byte {
  OpcodeMap[0x87](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1B(cpu: CPU): byte {
  OpcodeMap[0x88](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1C(cpu: CPU): byte {
  OpcodeMap[0x89](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1D(cpu: CPU): byte {
  OpcodeMap[0x8a](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1E(cpu: CPU): byte {
  OpcodeMap[0x8b](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1H(cpu: CPU): byte {
  OpcodeMap[0x8c](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1L(cpu: CPU): byte {
  OpcodeMap[0x8d](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1HL(cpu: CPU): byte {
  OpcodeMap[0x8e](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1A(cpu: CPU): byte {
  OpcodeMap[0x8f](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2B(cpu: CPU): byte {
  OpcodeMap[0x90](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2C(cpu: CPU): byte {
  OpcodeMap[0x91](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2D(cpu: CPU): byte {
  OpcodeMap[0x92](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2E(cpu: CPU): byte {
  OpcodeMap[0x93](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2H(cpu: CPU): byte {
  OpcodeMap[0x94](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2L(cpu: CPU): byte {
  OpcodeMap[0x95](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2HL(cpu: CPU): byte {
  OpcodeMap[0x96](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2A(cpu: CPU): byte {
  OpcodeMap[0x97](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3B(cpu: CPU): byte {
  OpcodeMap[0x98](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3C(cpu: CPU): byte {
  OpcodeMap[0x99](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3D(cpu: CPU): byte {
  OpcodeMap[0x9a](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3E(cpu: CPU): byte {
  OpcodeMap[0x9b](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3H(cpu: CPU): byte {
  OpcodeMap[0x9c](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3L(cpu: CPU): byte {
  OpcodeMap[0x9d](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3HL(cpu: CPU): byte {
  OpcodeMap[0x9e](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3A(cpu: CPU): byte {
  OpcodeMap[0x9f](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4B(cpu: CPU): byte {
  OpcodeMap[0xa0](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4C(cpu: CPU): byte {
  OpcodeMap[0xa1](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4D(cpu: CPU): byte {
  OpcodeMap[0xa2](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4E(cpu: CPU): byte {
  OpcodeMap[0xa3](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4H(cpu: CPU): byte {
  OpcodeMap[0xa4](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4L(cpu: CPU): byte {
  OpcodeMap[0xa5](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4HL(cpu: CPU): byte {
  OpcodeMap[0xa6](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4A(cpu: CPU): byte {
  OpcodeMap[0xa7](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5B(cpu: CPU): byte {
  OpcodeMap[0xa8](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5C(cpu: CPU): byte {
  OpcodeMap[0xa9](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5D(cpu: CPU): byte {
  OpcodeMap[0xaa](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5E(cpu: CPU): byte {
  OpcodeMap[0xab](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5H(cpu: CPU): byte {
  OpcodeMap[0xac](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5L(cpu: CPU): byte {
  OpcodeMap[0xad](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5HL(cpu: CPU): byte {
  OpcodeMap[0xae](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5A(cpu: CPU): byte {
  OpcodeMap[0xaf](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6B(cpu: CPU): byte {
  OpcodeMap[0xb0](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6C(cpu: CPU): byte {
  OpcodeMap[0xb1](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6D(cpu: CPU): byte {
  OpcodeMap[0xb2](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6E(cpu: CPU): byte {
  OpcodeMap[0xb3](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6H(cpu: CPU): byte {
  OpcodeMap[0xb4](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6L(cpu: CPU): byte {
  OpcodeMap[0xb5](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6HL(cpu: CPU): byte {
  OpcodeMap[0xb6](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6A(cpu: CPU): byte {
  OpcodeMap[0xb7](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7B(cpu: CPU): byte {
  OpcodeMap[0xb8](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7C(cpu: CPU): byte {
  OpcodeMap[0xb9](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7D(cpu: CPU): byte {
  OpcodeMap[0xba](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7E(cpu: CPU): byte {
  OpcodeMap[0xbb](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7H(cpu: CPU): byte {
  OpcodeMap[0xbc](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7L(cpu: CPU): byte {
  OpcodeMap[0xbd](cpu);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7HL(cpu: CPU): byte {
  OpcodeMap[0xbe](cpu);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7A(cpu: CPU): byte {
  OpcodeMap[0xbf](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0B(cpu: CPU): byte {
  OpcodeMap[0xc0](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0C(cpu: CPU): byte {
  OpcodeMap[0xc1](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0D(cpu: CPU): byte {
  OpcodeMap[0xc2](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0E(cpu: CPU): byte {
  OpcodeMap[0xc3](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0H(cpu: CPU): byte {
  OpcodeMap[0xc4](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0L(cpu: CPU): byte {
  OpcodeMap[0xc5](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0HL(cpu: CPU): byte {
  OpcodeMap[0xc6](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0A(cpu: CPU): byte {
  OpcodeMap[0xc7](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1B(cpu: CPU): byte {
  OpcodeMap[0xc8](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1C(cpu: CPU): byte {
  OpcodeMap[0xc9](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1D(cpu: CPU): byte {
  OpcodeMap[0xca](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1E(cpu: CPU): byte {
  OpcodeMap[0xcb](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1H(cpu: CPU): byte {
  OpcodeMap[0xcc](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1L(cpu: CPU): byte {
  OpcodeMap[0xcd](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1HL(cpu: CPU): byte {
  OpcodeMap[0xce](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1A(cpu: CPU): byte {
  OpcodeMap[0xcf](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2B(cpu: CPU): byte {
  OpcodeMap[0xd0](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2C(cpu: CPU): byte {
  OpcodeMap[0xd1](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2D(cpu: CPU): byte {
  OpcodeMap[0xd2](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2E(cpu: CPU): byte {
  OpcodeMap[0xd3](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2H(cpu: CPU): byte {
  OpcodeMap[0xd4](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2L(cpu: CPU): byte {
  OpcodeMap[0xd5](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2HL(cpu: CPU): byte {
  OpcodeMap[0xd6](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2A(cpu: CPU): byte {
  OpcodeMap[0xd7](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3B(cpu: CPU): byte {
  OpcodeMap[0xd8](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3C(cpu: CPU): byte {
  OpcodeMap[0xd9](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3D(cpu: CPU): byte {
  OpcodeMap[0xda](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3E(cpu: CPU): byte {
  OpcodeMap[0xdb](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3H(cpu: CPU): byte {
  OpcodeMap[0xdc](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3L(cpu: CPU): byte {
  OpcodeMap[0xdd](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3HL(cpu: CPU): byte {
  OpcodeMap[0xde](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3A(cpu: CPU): byte {
  OpcodeMap[0xdf](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4B(cpu: CPU): byte {
  OpcodeMap[0xe0](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4C(cpu: CPU): byte {
  OpcodeMap[0xe1](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4D(cpu: CPU): byte {
  OpcodeMap[0xe2](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4E(cpu: CPU): byte {
  OpcodeMap[0xe3](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4H(cpu: CPU): byte {
  OpcodeMap[0xe4](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4L(cpu: CPU): byte {
  OpcodeMap[0xe5](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4HL(cpu: CPU): byte {
  OpcodeMap[0xe6](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4A(cpu: CPU): byte {
  OpcodeMap[0xe7](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5B(cpu: CPU): byte {
  OpcodeMap[0xe8](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5C(cpu: CPU): byte {
  OpcodeMap[0xe9](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5D(cpu: CPU): byte {
  OpcodeMap[0xea](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5E(cpu: CPU): byte {
  OpcodeMap[0xeb](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5H(cpu: CPU): byte {
  OpcodeMap[0xec](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5L(cpu: CPU): byte {
  OpcodeMap[0xed](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5HL(cpu: CPU): byte {
  OpcodeMap[0xee](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5A(cpu: CPU): byte {
  OpcodeMap[0xef](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6B(cpu: CPU): byte {
  OpcodeMap[0xf0](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6C(cpu: CPU): byte {
  OpcodeMap[0xf1](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6D(cpu: CPU): byte {
  OpcodeMap[0xf2](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6E(cpu: CPU): byte {
  OpcodeMap[0xf3](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6H(cpu: CPU): byte {
  OpcodeMap[0xf4](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6L(cpu: CPU): byte {
  OpcodeMap[0xf5](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6HL(cpu: CPU): byte {
  OpcodeMap[0xf6](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6A(cpu: CPU): byte {
  OpcodeMap[0xf7](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7B(cpu: CPU): byte {
  OpcodeMap[0xf8](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7C(cpu: CPU): byte {
  OpcodeMap[0xf9](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7D(cpu: CPU): byte {
  OpcodeMap[0xfa](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7E(cpu: CPU): byte {
  OpcodeMap[0xfb](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7H(cpu: CPU): byte {
  OpcodeMap[0xfc](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7L(cpu: CPU): byte {
  OpcodeMap[0xfd](cpu);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7HL(cpu: CPU): byte {
  OpcodeMap[0xfe](cpu);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7A(cpu: CPU): byte {
  OpcodeMap[0xff](cpu);
  return 8;
}

const ops = {
  0x00: NOP,
  0x01: LDBCid16i,
  0x02: LDBCmAi,
  0x03: INCBCi,
  0x04: INCBi,
  0x05: DECBi,
  0x06: LDBid8i,
  0x07: RLCA,
  0x08: LDa16mSPi,
  0x09: ADDHLiBCi,
  0x0a: LDAiBCm,
  0x0b: DECBCi,
  0x0c: INCCi,
  0x0d: DECCi,
  0x0e: LDCid8i,
  0x0f: RRCA,
  0x10: STOP,
  0x11: LDDEid16i,
  0x12: LDDEmAi,
  0x13: INCDEi,
  0x14: INCDi,
  0x15: DECDi,
  0x16: LDDid8i,
  0x17: RLA,
  0x18: JRr8,
  0x19: ADDHLiDEi,
  0x1a: LDAiDEm,
  0x1b: DECDEi,
  0x1c: INCEi,
  0x1d: DECEi,
  0x1e: LDEid8i,
  0x1f: RRA,
  0x20: JRCNZr8,
  0x21: LDHLid16i,
  0x22: LDHLIncrmAi,
  0x23: INCHLi,
  0x24: INCHi,
  0x25: DECHi,
  0x26: LDHid8i,
  0x27: DAAA,
  0x28: JRCZr8,
  0x29: ADDHLiHLi,
  0x2a: LDAiHLIncrm,
  0x2b: DECHLi,
  0x2c: INCLi,
  0x2d: DECLi,
  0x2e: LDLid8i,
  0x2f: CPLA,
  0x30: JRCNCr8,
  0x31: LDSPid16i,
  0x32: LDHLDecrmAi,
  0x33: INCSPi,
  0x34: INCHLm,
  0x35: DECHLm,
  0x36: LDHLmd8i,
  0x37: SCF,
  0x38: JRCCr8,
  0x39: ADDHLiSPi,
  0x3a: LDAiHLDecrm,
  0x3b: DECSPi,
  0x3c: INCAi,
  0x3d: DECAi,
  0x3e: LDAid8i,
  0x3f: CCF,
  0x40: LDBiBi,
  0x41: LDBiCi,
  0x42: LDBiDi,
  0x43: LDBiEi,
  0x44: LDBiHi,
  0x45: LDBiLi,
  0x46: LDBiHLm,
  0x47: LDBiAi,
  0x48: LDCiBi,
  0x49: LDCiCi,
  0x4a: LDCiDi,
  0x4b: LDCiEi,
  0x4c: LDCiHi,
  0x4d: LDCiLi,
  0x4e: LDCiHLm,
  0x4f: LDCiAi,
  0x50: LDDiBi,
  0x51: LDDiCi,
  0x52: LDDiDi,
  0x53: LDDiEi,
  0x54: LDDiHi,
  0x55: LDDiLi,
  0x56: LDDiHLm,
  0x57: LDDiAi,
  0x58: LDEiBi,
  0x59: LDEiCi,
  0x5a: LDEiDi,
  0x5b: LDEiEi,
  0x5c: LDEiHi,
  0x5d: LDEiLi,
  0x5e: LDEiHLm,
  0x5f: LDEiAi,
  0x60: LDHiBi,
  0x61: LDHiCi,
  0x62: LDHiDi,
  0x63: LDHiEi,
  0x64: LDHiHi,
  0x65: LDHiLi,
  0x66: LDHiHLm,
  0x67: LDHiAi,
  0x68: LDLiBi,
  0x69: LDLiCi,
  0x6a: LDLiDi,
  0x6b: LDLiEi,
  0x6c: LDLiHi,
  0x6d: LDLiLi,
  0x6e: LDLiHLm,
  0x6f: LDLiAi,
  0x70: LDHLmBi,
  0x71: LDHLmCi,
  0x72: LDHLmDi,
  0x73: LDHLmEi,
  0x74: LDHLmHi,
  0x75: LDHLmLi,
  0x76: HALT,
  0x77: LDHLmAi,
  0x78: LDAiBi,
  0x79: LDAiCi,
  0x7a: LDAiDi,
  0x7b: LDAiEi,
  0x7c: LDAiHi,
  0x7d: LDAiLi,
  0x7e: LDAiHLm,
  0x7f: LDAiAi,
  0x80: ADDAiBi,
  0x81: ADDAiCi,
  0x82: ADDAiDi,
  0x83: ADDAiEi,
  0x84: ADDAiHi,
  0x85: ADDAiLi,
  0x86: ADDAiHLm,
  0x87: ADDAiAi,
  0x88: ADCAiBi,
  0x89: ADCAiCi,
  0x8a: ADCAiDi,
  0x8b: ADCAiEi,
  0x8c: ADCAiHi,
  0x8d: ADCAiLi,
  0x8e: ADCAiHLm,
  0x8f: ADCAiAi,
  0x90: SUBAiBi,
  0x91: SUBAiCi,
  0x92: SUBAiDi,
  0x93: SUBAiEi,
  0x94: SUBAiHi,
  0x95: SUBAiLi,
  0x96: SUBAiHLm,
  0x97: SUBAiAi,
  0x98: SBCAiBi,
  0x99: SBCAiCi,
  0x9a: SBCAiDi,
  0x9b: SBCAiEi,
  0x9c: SBCAiHi,
  0x9d: SBCAiLi,
  0x9e: SBCAiHLm,
  0x9f: SBCAiAi,
  0xa0: ANDBi,
  0xa1: ANDCi,
  0xa2: ANDDi,
  0xa3: ANDEi,
  0xa4: ANDHi,
  0xa5: ANDLi,
  0xa6: ANDHLm,
  0xa7: ANDAi,
  0xa8: XORBi,
  0xa9: XORCi,
  0xaa: XORDi,
  0xab: XOREi,
  0xac: XORHi,
  0xad: XORLi,
  0xae: XORHLm,
  0xaf: XORAi,
  0xb0: ORBi,
  0xb1: ORCi,
  0xb2: ORDi,
  0xb3: OREi,
  0xb4: ORHi,
  0xb5: ORLi,
  0xb6: ORHLm,
  0xb7: ORAi,
  0xb8: CPBi,
  0xb9: CPCi,
  0xba: CPDi,
  0xbb: CPEi,
  0xbc: CPHi,
  0xbd: CPLi,
  0xbe: CPHLm,
  0xbf: CPAi,
  0xc0: RETCNZ,
  0xc1: POPIntoBCi,
  0xc2: JPCNZa16,
  0xc3: JPa16,
  0xc4: CALLCNZa16,
  0xc5: PUSHRegisterBCi,
  0xc6: ADDAid8i,
  0xc7: RSTAi00Hi,
  0xc8: RETCZ,
  0xc9: RET,
  0xca: JPCZa16,
  0xcb: PREFIX,
  0xcc: CALLCZa16,
  0xcd: CALL,
  0xce: ADCAid8i,
  0xcf: RSTAi08Hi,
  0xd0: RETCNC,
  0xd1: POPIntoDEi,
  0xd2: JPCNCa16,
  0xd3: IllegalD3,
  0xd4: CALLCNCa16,
  0xd5: PUSHRegisterDEi,
  0xd6: SUBAid8i,
  0xd7: RSTAi10Hi,
  0xd8: RETCC,
  0xd9: RETI,
  0xda: JPCCa16,
  0xdb: IllegalDB,
  0xdc: CALLCCa16,
  0xdd: IllegalDD,
  0xde: SBCAid8i,
  0xdf: RSTAi18Hi,
  0xe0: LDHa8mAi,
  0xe1: POPIntoHLi,
  0xe2: LDCmAi,
  0xe3: IllegalE3,
  0xe4: IllegalE4,
  0xe5: PUSHRegisterHLi,
  0xe6: ANDd8i,
  0xe7: RSTAi20Hi,
  0xe8: ADDSPir8i,
  0xe9: JPHL,
  0xea: LDa16mAi,
  0xeb: IllegalEB,
  0xec: IllegalEC,
  0xed: IllegalED,
  0xee: XORd8i,
  0xef: RSTAi28Hi,
  0xf0: LDHAia8m,
  0xf1: POPIntoAFi,
  0xf2: LDAiCm,
  0xf3: DI,
  0xf4: IllegalF4,
  0xf5: PUSHRegisterAFi,
  0xf6: ORd8i,
  0xf7: RSTAi30Hi,
  0xf8: LDHLiSPIncri,
  0xf9: LDSPiHLi,
  0xfa: LDAia16m,
  0xfb: EI,
  0xfc: IllegalFC,
  0xfd: IllegalFD,
  0xfe: CPd8i,
  0xff: RSTAi38Hi,
};

const cbOpcodes = {
  0x00: RLCBi,
  0x01: RLCCi,
  0x02: RLCDi,
  0x03: RLCEi,
  0x04: RLCHi,
  0x05: RLCLi,
  0x06: RLCHLm,
  0x07: RLCAi,
  0x08: RRCBi,
  0x09: RRCCi,
  0x0a: RRCDi,
  0x0b: RRCEi,
  0x0c: RRCHi,
  0x0d: RRCLi,
  0x0e: RRCHLm,
  0x0f: RRCAi,
  0x10: RLBi,
  0x11: RLCi,
  0x12: RLDi,
  0x13: RLEi,
  0x14: RLHi,
  0x15: RLLi,
  0x16: RLHLm,
  0x17: RLAi,
  0x18: RRBi,
  0x19: RRCi,
  0x1a: RRDi,
  0x1b: RREi,
  0x1c: RRHi,
  0x1d: RRLi,
  0x1e: RRHLm,
  0x1f: RRAi,
  0x20: SLABi,
  0x21: SLACi,
  0x22: SLADi,
  0x23: SLAEi,
  0x24: SLAHi,
  0x25: SLALi,
  0x26: SLAHLm,
  0x27: SLAAi,
  0x28: SRABi,
  0x29: SRACi,
  0x2a: SRADi,
  0x2b: SRAEi,
  0x2c: SRAHi,
  0x2d: SRALi,
  0x2e: SRAHLm,
  0x2f: SRAAi,
  0x30: SWAPBi,
  0x31: SWAPCi,
  0x32: SWAPDi,
  0x33: SWAPEi,
  0x34: SWAPHi,
  0x35: SWAPLi,
  0x36: SWAPHLm,
  0x37: SWAPAi,
  0x38: SRLBi,
  0x39: SRLCi,
  0x3a: SRLDi,
  0x3b: SRLEi,
  0x3c: SRLHi,
  0x3d: SRLLi,
  0x3e: SRLHLm,
  0x3f: SRLAi,
  0x40: BIT0iBi,
  0x41: BIT0iCi,
  0x42: BIT0iDi,
  0x43: BIT0iEi,
  0x44: BIT0iHi,
  0x45: BIT0iLi,
  0x46: BIT0iHLm,
  0x47: BIT0iAi,
  0x48: BIT1iBi,
  0x49: BIT1iCi,
  0x4a: BIT1iDi,
  0x4b: BIT1iEi,
  0x4c: BIT1iHi,
  0x4d: BIT1iLi,
  0x4e: BIT1iHLm,
  0x4f: BIT1iAi,
  0x50: BIT2iBi,
  0x51: BIT2iCi,
  0x52: BIT2iDi,
  0x53: BIT2iEi,
  0x54: BIT2iHi,
  0x55: BIT2iLi,
  0x56: BIT2iHLm,
  0x57: BIT2iAi,
  0x58: BIT3iBi,
  0x59: BIT3iCi,
  0x5a: BIT3iDi,
  0x5b: BIT3iEi,
  0x5c: BIT3iHi,
  0x5d: BIT3iLi,
  0x5e: BIT3iHLm,
  0x5f: BIT3iAi,
  0x60: BIT4iBi,
  0x61: BIT4iCi,
  0x62: BIT4iDi,
  0x63: BIT4iEi,
  0x64: BIT4iHi,
  0x65: BIT4iLi,
  0x66: BIT4iHLm,
  0x67: BIT4iAi,
  0x68: BIT5iBi,
  0x69: BIT5iCi,
  0x6a: BIT5iDi,
  0x6b: BIT5iEi,
  0x6c: BIT5iHi,
  0x6d: BIT5iLi,
  0x6e: BIT5iHLm,
  0x6f: BIT5iAi,
  0x70: BIT6iBi,
  0x71: BIT6iCi,
  0x72: BIT6iDi,
  0x73: BIT6iEi,
  0x74: BIT6iHi,
  0x75: BIT6iLi,
  0x76: BIT6iHLm,
  0x77: BIT6iAi,
  0x78: BIT7iBi,
  0x79: BIT7iCi,
  0x7a: BIT7iDi,
  0x7b: BIT7iEi,
  0x7c: BIT7iHi,
  0x7d: BIT7iLi,
  0x7e: BIT7iHLm,
  0x7f: BIT7iAi,
  0x80: RES0B,
  0x81: RES0C,
  0x82: RES0D,
  0x83: RES0E,
  0x84: RES0H,
  0x85: RES0L,
  0x86: RES0HL,
  0x87: RES0A,
  0x88: RES1B,
  0x89: RES1C,
  0x8a: RES1D,
  0x8b: RES1E,
  0x8c: RES1H,
  0x8d: RES1L,
  0x8e: RES1HL,
  0x8f: RES1A,
  0x90: RES2B,
  0x91: RES2C,
  0x92: RES2D,
  0x93: RES2E,
  0x94: RES2H,
  0x95: RES2L,
  0x96: RES2HL,
  0x97: RES2A,
  0x98: RES3B,
  0x99: RES3C,
  0x9a: RES3D,
  0x9b: RES3E,
  0x9c: RES3H,
  0x9d: RES3L,
  0x9e: RES3HL,
  0x9f: RES3A,
  0xa0: RES4B,
  0xa1: RES4C,
  0xa2: RES4D,
  0xa3: RES4E,
  0xa4: RES4H,
  0xa5: RES4L,
  0xa6: RES4HL,
  0xa7: RES4A,
  0xa8: RES5B,
  0xa9: RES5C,
  0xaa: RES5D,
  0xab: RES5E,
  0xac: RES5H,
  0xad: RES5L,
  0xae: RES5HL,
  0xaf: RES5A,
  0xb0: RES6B,
  0xb1: RES6C,
  0xb2: RES6D,
  0xb3: RES6E,
  0xb4: RES6H,
  0xb5: RES6L,
  0xb6: RES6HL,
  0xb7: RES6A,
  0xb8: RES7B,
  0xb9: RES7C,
  0xba: RES7D,
  0xbb: RES7E,
  0xbc: RES7H,
  0xbd: RES7L,
  0xbe: RES7HL,
  0xbf: RES7A,
  0xc0: SET0B,
  0xc1: SET0C,
  0xc2: SET0D,
  0xc3: SET0E,
  0xc4: SET0H,
  0xc5: SET0L,
  0xc6: SET0HL,
  0xc7: SET0A,
  0xc8: SET1B,
  0xc9: SET1C,
  0xca: SET1D,
  0xcb: SET1E,
  0xcc: SET1H,
  0xcd: SET1L,
  0xce: SET1HL,
  0xcf: SET1A,
  0xd0: SET2B,
  0xd1: SET2C,
  0xd2: SET2D,
  0xd3: SET2E,
  0xd4: SET2H,
  0xd5: SET2L,
  0xd6: SET2HL,
  0xd7: SET2A,
  0xd8: SET3B,
  0xd9: SET3C,
  0xda: SET3D,
  0xdb: SET3E,
  0xdc: SET3H,
  0xdd: SET3L,
  0xde: SET3HL,
  0xdf: SET3A,
  0xe0: SET4B,
  0xe1: SET4C,
  0xe2: SET4D,
  0xe3: SET4E,
  0xe4: SET4H,
  0xe5: SET4L,
  0xe6: SET4HL,
  0xe7: SET4A,
  0xe8: SET5B,
  0xe9: SET5C,
  0xea: SET5D,
  0xeb: SET5E,
  0xec: SET5H,
  0xed: SET5L,
  0xee: SET5HL,
  0xef: SET5A,
  0xf0: SET6B,
  0xf1: SET6C,
  0xf2: SET6D,
  0xf3: SET6E,
  0xf4: SET6H,
  0xf5: SET6L,
  0xf6: SET6HL,
  0xf7: SET6A,
  0xf8: SET7B,
  0xf9: SET7C,
  0xfa: SET7D,
  0xfb: SET7E,
  0xfc: SET7H,
  0xfd: SET7L,
  0xfe: SET7HL,
  0xff: SET7A,
};
