import {DEBUG, Primitive} from 'helpers/index';
import InterruptService from 'Interrupts/index';
import Memory from 'Memory/index';

export interface Registers {
  af: word;
  bc: word;
  de: word;
  hl: word;
}

let af: word = 0;
let bc: word = 0;
let de: word = 0;
let hl: word = 0;
let pc: word = 0;
let sp: word = 0;

let allInterruptsEnabled = true;
let memoryRef!: Memory;

const setCYFlag = (value: boolean | byte): void => {
  if (value) {
    af |= 1 << 4;
  } else {
    af &= ~(1 << 4);
  }
};

const setHFlag = (value: boolean | byte): void => {
  if (value) {
    af |= 1 << 5;
  } else {
    af &= ~(1 << 5);
  }
};

const setNFlag = (value: boolean | byte): void => {
  if (value) {
    af |= 1 << 6;
  } else {
    af &= ~(1 << 6);
  }
};

const setZFlag = (value: boolean | byte): void => {
  if (value) {
    af |= 1 << 7;
  } else {
    af &= ~(1 << 7);
  }
};

const getCYFlag = (): bit => (af >> 4) & 1;
const getHFlag = (): bit => (af >> 5) & 1;
const getNFlag = (): bit => (af >> 6) & 1;
const getZFlag = (): bit => (af >> 7) & 1;

/**
 * Sets the half carry flag if a carry will be generated from bits 3 to 4 of the sum.
 * For 16-bit operations, this should be called on the upper bytes of the operands.
 * Sources:
 * https://robdor.com/2016/08/10/gameboy-emulator-half-carry-flag/
 * https://stackoverflow.com/questions/8868396/game-boy-what-constitutes-a-half-carry
 * https://gbdev.io/gb-opcodes/optables/
 */
const checkHalfCarry = (op1: byte, op2: byte, subtraction?: boolean): void => {
  const carryBit = subtraction
    ? ((op1 & 0xf) - (op2 & 0xf)) & 0x10
    : ((op1 & 0xf) + (op2 & 0xf)) & 0x10;
  setHFlag(carryBit === 0x10);
};
/**
 * Sets the carry flag if the sum will exceed the size of the data type.
 */
const checkFullCarry16 = (
  op1: word,
  op2: word,
  subtraction?: boolean
): void => {
  if (subtraction) {
    setCYFlag(op1 - op2 < 0);
  } else {
    setCYFlag(op1 + op2 > 0xffff);
  }
};

const checkFullCarry8 = (op1: byte, op2: byte, subtraction?: boolean): void => {
  if (subtraction) {
    setCYFlag(op1 - op2 < 0);
  } else {
    setCYFlag(op1 + op2 > 0xff);
  }
};

class CPU {
  // number of clock ticks per second
  public clock = 4194304;
  // 16-bit program counter
  // stack pointer

  public halted = false;
  public lastExecuted: Array<byte> = [];

  constructor(memory: Memory) {
    memoryRef = memory;
    this.reset();
  }

  public getPC = (): word => pc;
  public getAF = (): word => af;
  public getBC = (): word => bc;
  public getDE = (): word => de;
  public getHL = (): word => hl;
  public getSP = (): word => sp;
  public getIE = (): boolean => allInterruptsEnabled;

  public reset = (): void => {
    pc = 0;
    sp = 0;
    this.halted = false;
    allInterruptsEnabled = true;
    af = 0;
    bc = 0;
    de = 0;
    hl = 0;
    this.lastExecuted = [];
  };

  /**
   * Completes the GB power sequence
   */
  public initPowerSequence = (): void => {
    pc = 0x100;
    af = 0x01b0;
    bc = 0x0013;
    de = 0x00d8;
    hl = 0x014d;
    sp = 0xfffe;
    memoryRef.writeByte(0xff05, 0x00);
    memoryRef.writeByte(0xff06, 0x00);
    memoryRef.writeByte(0xff07, 0x00);
    memoryRef.writeByte(0xff10, 0x80);
    memoryRef.writeByte(0xff11, 0xbf);
    memoryRef.writeByte(0xff12, 0xf3);
    memoryRef.writeByte(0xff14, 0xbf);
    memoryRef.writeByte(0xff16, 0x3f);
    memoryRef.writeByte(0xff17, 0x00);
    memoryRef.writeByte(0xff19, 0xbf);
    memoryRef.writeByte(0xff1a, 0x7f);
    memoryRef.writeByte(0xff1b, 0xff);
    memoryRef.writeByte(0xff1c, 0x9f);
    memoryRef.writeByte(0xff1e, 0xbf);
    memoryRef.writeByte(0xff20, 0xff);
    memoryRef.writeByte(0xff21, 0x00);
    memoryRef.writeByte(0xff22, 0x00);
    memoryRef.writeByte(0xff23, 0xbf);
    memoryRef.writeByte(0xff24, 0x77);
    memoryRef.writeByte(0xff25, 0xf3);
    memoryRef.writeByte(0xff26, 0xf1);
    memoryRef.writeByte(0xff40, 0x91);
    memoryRef.writeByte(0xff42, 0x00);
    memoryRef.writeByte(0xff43, 0x00);
    memoryRef.writeByte(0xff45, 0x00);
    memoryRef.writeByte(0xff47, 0xfc);
    memoryRef.writeByte(0xff48, 0xff);
    memoryRef.writeByte(0xff49, 0xff);
    memoryRef.writeByte(0xff4a, 0x00);
    memoryRef.writeByte(0xff4b, 0x00);
    memoryRef.writeByte(0xffff, 0x00);
  };
  /**
   * Executes next opcode.
   * @returns {number} the number of CPU cycles required.
   */
  public executeInstruction = (): number => {
    const opcode: byte = memoryRef.readByte(pc);
    pc += 1;
    pc &= 0xffff;
    this.addCalledInstruction(opcode);
    return this.opcodes[opcode]();
  };
  public execute: () => number = this.executeInstruction;
  public executeBios = (): number => {
    const opcode: byte = memoryRef.readByte(pc);
    pc += 1;
    pc &= 0xffff;
    const numCycles = this.opcodes[opcode]();
    if (!memoryRef.inBios) {
      this.initPowerSequence();
      this.execute = this.executeInstruction;
    }
    this.addCalledInstruction(opcode);
    return numCycles;
  };
  public addCalledInstruction = (opcode: byte): void => {
    this.lastExecuted.push(opcode);
    if (this.lastExecuted.length > 100) {
      this.lastExecuted = this.lastExecuted.slice(1);
    }
  };
  /**
   * Checks for and handles interrupts.
   */
  public checkInterrupts = (memoryRef: Memory): number => {
    if (allInterruptsEnabled) {
      // IME, IE and IF need to be set to handle corresponding interrupts
      const interruptFlag = memoryRef.readByte(0xff0f);
      if (interruptFlag) {
        const interruptEnable = memoryRef.readByte(0xffff);
        for (let i = 0; i < 5; i++) {
          if ((interruptEnable >> i) & 1 && (interruptFlag >> i) & 1) {
            // clear IME and IF bit
            allInterruptsEnabled = false;
            memoryRef.writeByte(0xff0f, interruptFlag & ~(1 << i));
            PUSH(pc);
            DEBUG && console.log('Handled an interrupt.');
            switch (i) {
              case InterruptService.flags.vBlank:
                pc = 0x40;
                break;
              case InterruptService.flags.lcdStat:
                pc = 0x48;
                break;
              case InterruptService.flags.timer:
                pc = 0x50;
                break;
              case InterruptService.flags.serial:
                pc = 0x58;
                break;
              case InterruptService.flags.joypad:
                pc = 0x40;
                break;
            }
            // time needed to transfer to ISR
            return 8;
          }
        }
      }
    }
    return 0;
  };
  /**
   * No operation.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private NOP = (): byte => {
    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBCid16i = (): byte => {
    bc = memoryRef.readWord(pc);
    pc += 2;

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBCmAi = (): byte => {
    memoryRef.writeByte(bc, Primitive.upper(af));

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private INCBCi = (): byte => {
    bc = Primitive.addWord(bc, 1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCBi = (): byte => {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    checkHalfCarry(Primitive.upper(bc), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(bc));
    bc = Primitive.setUpper(bc, operand);

    setZFlag(!Primitive.upper(bc));
    setNFlag(0);

    return 4;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECBi = (): byte => {
    checkHalfCarry(Primitive.upper(bc), 1, true);
    bc = Primitive.addUpper(bc, Primitive.toByte(-1));
    setZFlag(!Primitive.upper(bc));
    setNFlag(1);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBid8i = (): byte => {
    // load into B from pc (immediate)
    bc = Primitive.setUpper(bc, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Rotate A left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCA = (): byte => {
    // check carry flag
    setCYFlag(Primitive.upper(af) >> 7);
    // left shift
    const shifted: byte = Primitive.upper(af) << 1;
    af = Primitive.setUpper(af, Primitive.toByte(shifted | (shifted >> 8)));
    // flag resets
    setNFlag(0);
    setHFlag(0);
    setZFlag(0);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDa16mSPi = (): byte => {
    memoryRef.writeWord(memoryRef.readWord(pc), sp);

    return 20;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: N, H, C
   */
  private ADDHLiBCi = (): byte => {
    checkFullCarry16(hl, bc);
    setHFlag((((hl & 0xfff) + (bc & 0xfff)) & 0x1000) === 0x1000);
    hl += bc;
    hl &= 0xffff;
    setNFlag(0);

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiBCm = (): byte => {
    af = Primitive.setUpper(af, Primitive.toByte(memoryRef.readByte(bc)));

    return 8;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private DECBCi = (): byte => {
    bc = Primitive.addWord(bc, -1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCCi = (): byte => {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    checkHalfCarry(Primitive.lower(bc), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.lower(bc));
    bc = Primitive.setLower(bc, operand);

    setZFlag(!Primitive.lower(bc));
    setNFlag(0);

    return 4;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECCi = (): byte => {
    // convert operand to unsigned
    checkHalfCarry(Primitive.lower(bc), 1, true);
    bc = Primitive.addLower(bc, Primitive.toByte(-1));
    setZFlag(!Primitive.lower(bc));
    setNFlag(1);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCid8i = (): byte => {
    // load into C from pc (immediate)
    bc = Primitive.setLower(bc, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Rotate A right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCA = (): byte => {
    // check carry flag
    const bitZero = Primitive.upper(af) & 1;
    setCYFlag(bitZero);
    // right shift
    const shifted: byte = Primitive.upper(af) >> 1;
    af = Primitive.setUpper(af, Primitive.toByte(shifted | (bitZero << 7)));
    // flag resets
    setNFlag(0);
    setHFlag(0);
    setZFlag(0);

    return 4;
  };

  /**
   *  Halt CPU & LCD display until button pressed.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private STOP = (): byte => {
    this.halted = true;
    console.log('Instruction halted.');
    // throw new Error();

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDEid16i = (): byte => {
    de = memoryRef.readWord(pc);
    pc += 2;

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDEmAi = (): byte => {
    memoryRef.writeByte(de, Primitive.upper(af));

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private INCDEi = (): byte => {
    de = Primitive.addWord(de, 1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCDi = (): byte => {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    checkHalfCarry(Primitive.upper(de), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(de));
    de = Primitive.setUpper(de, operand);

    setZFlag(!Primitive.upper(de));
    setNFlag(0);

    return 4;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECDi = (): byte => {
    // check for half carry on affected byte only
    checkHalfCarry(Primitive.upper(de), 1, true);
    de = Primitive.addUpper(de, Primitive.toByte(-1));
    setZFlag(!Primitive.upper(de));
    setNFlag(1);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDid8i = (): byte => {
    de = Primitive.setUpper(de, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Rotate A left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLA = (): byte => {
    // need to rotate left through the carry flag
    // get the old carry value
    const oldCY = getCYFlag();
    // set the carry flag to the 7th bit of A
    setCYFlag(Primitive.upper(af) >> 7);
    // rotate left
    const shifted = Primitive.upper(af) << 1;
    // combine old flag and shifted, set to A
    af = Primitive.setUpper(af, Primitive.toByte(shifted | oldCY));
    setHFlag(0);
    setNFlag(0);
    setZFlag(0);

    return 4;
  };

  /**
   * Jump to the relative address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JRr8 = (): byte => {
    pc += Primitive.toSigned(memoryRef.readByte(pc)) + 1;
    pc &= 0xffff;

    return 12;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: N, H, C
   */
  private ADDHLiDEi = (): byte => {
    checkFullCarry16(hl, de);
    setHFlag((((hl & 0xfff) + (de & 0xfff)) & 0x1000) === 0x1000);
    hl += de;
    hl &= 0xffff;
    setNFlag(0);

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiDEm = (): byte => {
    af = Primitive.setUpper(af, Primitive.toByte(memoryRef.readByte(de)));

    return 8;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private DECDEi = (): byte => {
    de = Primitive.addWord(de, -1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCEi = (): byte => {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    checkHalfCarry(Primitive.lower(de), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.lower(de));
    de = Primitive.setLower(de, operand);

    setZFlag(!Primitive.lower(de));
    setNFlag(0);

    return 4;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECEi = (): byte => {
    // check for half carry on affected byte only
    checkHalfCarry(Primitive.lower(de), 1, true);
    de = Primitive.addLower(de, Primitive.toByte(-1));
    setZFlag(!Primitive.lower(de));
    setNFlag(1);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEid8i = (): byte => {
    de = Primitive.setLower(de, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Rotate A right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRA = (): byte => {
    // rotate right through the carry flag
    // get the old carry value
    const oldCY = getCYFlag();
    // set the carry flag to the 0th bit of A
    setCYFlag(Primitive.upper(af) & 1);
    // rotate right
    const shifted = Primitive.upper(af) >> 1;
    // combine old flag and shifted, set to A
    af = Primitive.setUpper(af, Primitive.toByte(shifted | (oldCY << 7)));
    setHFlag(0);
    setNFlag(0);
    setZFlag(0);

    return 4;
  };

  /**
   * Conditional jump to the relative address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JRCNZr8 = (): byte => {
    if (!getZFlag()) {
      pc += Primitive.toSigned(memoryRef.readByte(pc)) + 1;
      pc &= 0xffff;
      return 12;
    }
    pc += 1;
    pc &= 0xffff;
    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLid16i = (): byte => {
    hl = memoryRef.readWord(pc);
    pc += 2;

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLIncrmAi = (): byte => {
    memoryRef.writeByte(hl, Primitive.upper(af));
    hl = Primitive.addWord(hl, 1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private INCHLi = (): byte => {
    hl = Primitive.addWord(hl, 1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCHi = (): byte => {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    checkHalfCarry(Primitive.upper(hl), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(hl));
    hl = Primitive.setUpper(hl, operand);

    setZFlag(!operand);
    setNFlag(0);

    return 4;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECHi = (): byte => {
    checkHalfCarry(Primitive.upper(hl), 1, true);
    hl = Primitive.addUpper(hl, Primitive.toByte(-1));
    setZFlag(!Primitive.upper(hl));
    setNFlag(1);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHid8i = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Decimal adjust register A.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, H, C
   */
  private DAAA = (): byte => {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    if (!getNFlag()) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (getCYFlag() || Primitive.upper(af) > 0x99) {
        af = Primitive.addUpper(af, 0x60);
        setCYFlag(1);
      }
      if (getHFlag() || (Primitive.upper(af) & 0x0f) > 0x09) {
        af = Primitive.addUpper(af, 0x6);
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (getCYFlag()) {
        af = Primitive.addUpper(af, -0x60);
      }
      if (getHFlag()) {
        af = Primitive.addUpper(af, -0x6);
      }
    }
    // these flags are always updated
    setZFlag(!Primitive.upper(af));
    setHFlag(0); // h flag is always cleared

    return 4;
  };

  /**
   * Conditional jump to the relative address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JRCZr8 = (): byte => {
    if (getZFlag()) {
      pc += Primitive.toSigned(memoryRef.readByte(pc)) + 1;
      pc &= 0xffff;
      return 12;
    }
    pc += 1;
    pc &= 0xffff;
    return 8;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: N, H, C
   */
  private ADDHLiHLi = (): byte => {
    checkFullCarry16(hl, hl);
    checkHalfCarry(Primitive.upper(hl), Primitive.upper(hl));
    hl = Primitive.addWord(hl, hl);
    setNFlag(0);

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiHLIncrm = (): byte => {
    af = Primitive.setUpper(af, Primitive.toByte(memoryRef.readByte(hl)));
    hl = Primitive.addWord(hl, 1);

    return 8;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private DECHLi = (): byte => {
    hl = Primitive.addWord(hl, -1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCLi = (): byte => {
    checkHalfCarry(Primitive.lower(hl), 1);
    hl = Primitive.addLower(hl, 1);
    setZFlag(!Primitive.lower(hl));
    setNFlag(0);

    return 4;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECLi = (): byte => {
    checkHalfCarry(Primitive.lower(hl), 1, true);
    hl = Primitive.addLower(hl, Primitive.toByte(-1));
    setZFlag(!Primitive.lower(hl));
    setNFlag(1);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLid8i = (): byte => {
    hl = Primitive.setLower(hl, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Complement A register. (Flip all bits.)
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: N, H
   */
  private CPLA = (): byte => {
    af = Primitive.setUpper(af, Primitive.toByte(~Primitive.upper(af)));
    setNFlag(1);
    setHFlag(1);

    return 4;
  };

  /**
   * Conditional jump to the relative address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JRCNCr8 = (): byte => {
    if (!getCYFlag()) {
      pc += Primitive.toSigned(memoryRef.readByte(pc)) + 1;
      pc &= 0xffff;
      return 12;
    }
    pc += 1;
    pc &= 0xffff;
    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDSPid16i = (): byte => {
    sp = memoryRef.readWord(pc);
    pc += 2;
    pc &= 0xffff;

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLDecrmAi = (): byte => {
    memoryRef.writeByte(hl, Primitive.upper(af));
    hl = Primitive.addWord(hl, -1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private INCSPi = (): byte => {
    sp = Primitive.addWord(sp, 1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCHLm = (): byte => {
    // convert operand to unsigned
    let operand: byte = 1;
    const newVal: byte = Primitive.toByte(memoryRef.readByte(hl));
    // check for half carry on affected byte only
    checkHalfCarry(newVal, operand);
    operand = Primitive.addByte(operand, newVal);
    memoryRef.writeByte(hl, operand);

    setZFlag(!operand);
    setNFlag(0);

    return 12;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECHLm = (): byte => {
    // convert operand to unsigned
    let newVal: byte = Primitive.toByte(memoryRef.readByte(hl));
    // check for half carry on affected byte only
    checkHalfCarry(newVal, 1, true);
    newVal = Primitive.addByte(newVal, Primitive.toByte(-1));
    memoryRef.writeByte(hl, newVal);
    setZFlag(!newVal);
    setNFlag(1);

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmd8i = (): byte => {
    memoryRef.writeByte(hl, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 12;
  };

  /**
   *  Set Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: N, H, C
   */
  private SCF = (): byte => {
    setCYFlag(1);
    setNFlag(0);
    setHFlag(0);

    return 4;
  };

  /**
   * Conditional jump to the relative address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JRCCr8 = (): byte => {
    if (getCYFlag()) {
      pc += Primitive.toSigned(memoryRef.readByte(pc)) + 1;
      pc &= 0xffff;
      return 12;
    }
    pc += 1;
    pc &= 0xffff;
    return 8;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: N, H, C
   */
  private ADDHLiSPi = (): byte => {
    checkFullCarry16(hl, sp);
    // half carry for this is weird, check if carry from bit 11 to 12
    setHFlag((((hl & 0xfff) + (sp & 0xfff)) & 0x1000) === 0x1000);
    hl += sp;
    hl &= 0xffff;
    setNFlag(0);

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiHLDecrm = (): byte => {
    af = Primitive.setUpper(af, Primitive.toByte(memoryRef.readByte(hl)));
    hl = Primitive.addWord(hl, -1);

    return 8;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private DECSPi = (): byte => {
    sp = Primitive.addWord(sp, -1);

    return 8;
  };

  /**
   * Increment register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private INCAi = (): byte => {
    let operand: byte = 1;
    checkHalfCarry(Primitive.upper(af), operand);
    operand = Primitive.addByte(operand, Primitive.upper(af));
    af = Primitive.setUpper(af, operand);
    setZFlag(!operand);
    setNFlag(0);

    return 4;
  };

  /**
   * Decrement register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private DECAi = (): byte => {
    checkHalfCarry(Primitive.upper(af), 1, true);
    af = Primitive.addUpper(af, Primitive.toByte(-1));
    setZFlag(!Primitive.upper(af));
    setNFlag(1);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAid8i = (): byte => {
    af = Primitive.setUpper(af, Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Complement carry flag.
   * If C flag is set, then reset it.
   * If C flag is reset, then set it.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: N, H, C
   */
  private CCF = (): byte => {
    if (getCYFlag()) {
      setCYFlag(0);
    } else {
      setCYFlag(1);
    }
    setNFlag(0);
    setHFlag(0);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiBi = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.upper(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiCi = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.lower(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiDi = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.upper(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiEi = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.lower(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiHi = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.upper(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiLi = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.lower(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiHLm = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDBiAi = (): byte => {
    bc = Primitive.setUpper(bc, Primitive.upper(af));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiBi = (): byte => {
    bc = Primitive.setLower(bc, Primitive.upper(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiCi = (): byte => {
    bc = Primitive.setLower(bc, Primitive.lower(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiDi = (): byte => {
    bc = Primitive.setLower(bc, Primitive.upper(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiEi = (): byte => {
    bc = Primitive.setLower(bc, Primitive.lower(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiHi = (): byte => {
    bc = Primitive.setLower(bc, Primitive.upper(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiLi = (): byte => {
    bc = Primitive.setLower(bc, Primitive.lower(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiHLm = (): byte => {
    bc = Primitive.setLower(bc, Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCiAi = (): byte => {
    bc = Primitive.setLower(bc, Primitive.upper(af));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiBi = (): byte => {
    de = Primitive.setUpper(de, Primitive.upper(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiCi = (): byte => {
    de = Primitive.setUpper(de, Primitive.lower(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiDi = (): byte => {
    de = Primitive.setUpper(de, Primitive.upper(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiEi = (): byte => {
    de = Primitive.setUpper(de, Primitive.lower(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiHi = (): byte => {
    de = Primitive.setUpper(de, Primitive.upper(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiLi = (): byte => {
    de = Primitive.setUpper(de, Primitive.lower(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiHLm = (): byte => {
    de = Primitive.setUpper(de, Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDDiAi = (): byte => {
    de = Primitive.setUpper(de, Primitive.upper(af));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiBi = (): byte => {
    de = Primitive.setLower(de, Primitive.upper(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiCi = (): byte => {
    de = (bc & 0xff) | (de & 0xff00);

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiDi = (): byte => {
    const d = de & 0xff00;
    de = (de >> 8) | d;

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiEi = (): byte => {
    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiHi = (): byte => {
    de = Primitive.setLower(de, Primitive.upper(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiLi = (): byte => {
    de = Primitive.setLower(de, Primitive.lower(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiHLm = (): byte => {
    de = Primitive.setLower(de, Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDEiAi = (): byte => {
    de = Primitive.setLower(de, Primitive.upper(af));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiBi = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.upper(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiCi = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.lower(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiDi = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.upper(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiEi = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.lower(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiHi = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.upper(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiLi = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.lower(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiHLm = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHiAi = (): byte => {
    hl = Primitive.setUpper(hl, Primitive.upper(af));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiBi = (): byte => {
    hl = Primitive.setLower(hl, Primitive.upper(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiCi = (): byte => {
    hl = Primitive.setLower(hl, Primitive.lower(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiDi = (): byte => {
    hl = Primitive.setLower(hl, Primitive.upper(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiEi = (): byte => {
    hl = Primitive.setLower(hl, Primitive.lower(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiHi = (): byte => {
    hl = Primitive.setLower(hl, Primitive.upper(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiLi = (): byte => {
    hl = Primitive.setLower(hl, Primitive.lower(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiHLm = (): byte => {
    hl = Primitive.setLower(hl, Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDLiAi = (): byte => {
    hl = Primitive.setLower(hl, Primitive.upper(af));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmBi = (): byte => {
    memoryRef.writeByte(hl, Primitive.upper(bc));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmCi = (): byte => {
    memoryRef.writeByte(hl, Primitive.lower(bc));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmDi = (): byte => {
    memoryRef.writeByte(hl, Primitive.upper(de));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmEi = (): byte => {
    memoryRef.writeByte(hl, Primitive.lower(de));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmHi = (): byte => {
    memoryRef.writeByte(hl, Primitive.upper(hl));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmLi = (): byte => {
    memoryRef.writeByte(hl, Primitive.lower(hl));

    return 8;
  };

  /**
   * Disables interrupt handling.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private HALT = (): byte => {
    this.halted = true;

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHLmAi = (): byte => {
    memoryRef.writeByte(hl, Primitive.upper(af));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiBi = (): byte => {
    af = Primitive.setUpper(af, Primitive.upper(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiCi = (): byte => {
    af = Primitive.setUpper(af, Primitive.lower(bc));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiDi = (): byte => {
    af = Primitive.setUpper(af, Primitive.upper(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiEi = (): byte => {
    af = Primitive.setUpper(af, Primitive.lower(de));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiHi = (): byte => {
    af = Primitive.setUpper(af, Primitive.upper(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiLi = (): byte => {
    af = Primitive.setUpper(af, Primitive.lower(hl));

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiHLm = (): byte => {
    af = Primitive.setUpper(af, Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiAi = (): byte => {
    af = Primitive.setUpper(af, Primitive.upper(af));

    return 4;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiBi = (): byte => {
    ADD(Primitive.upper(bc));

    return 4;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiCi = (): byte => {
    ADD(Primitive.lower(bc));

    return 4;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiDi = (): byte => {
    ADD(Primitive.upper(de));

    return 4;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiEi = (): byte => {
    ADD(Primitive.lower(de));

    return 4;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiHi = (): byte => {
    ADD(Primitive.upper(hl));

    return 4;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiLi = (): byte => {
    ADD(Primitive.lower(hl));

    return 4;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiHLm = (): byte => {
    ADD(Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAiAi = (): byte => {
    ADD(Primitive.upper(af));

    return 4;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiBi = (): byte => {
    ADC(bc >> 8);

    return 4;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiCi = (): byte => {
    ADC(Primitive.lower(bc));

    return 4;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiDi = (): byte => {
    ADC(Primitive.upper(de));

    return 4;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiEi = (): byte => {
    ADC(Primitive.lower(de));

    return 4;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiHi = (): byte => {
    ADC(Primitive.upper(hl));

    return 4;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiLi = (): byte => {
    ADC(Primitive.lower(hl));

    return 4;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiHLm = (): byte => {
    ADC(Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAiAi = (): byte => {
    ADC(Primitive.upper(af));

    return 4;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiBi = (): byte => {
    SUB(Primitive.upper(bc));

    return 4;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiCi = (): byte => {
    SUB(Primitive.lower(bc));

    return 4;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiDi = (): byte => {
    SUB(Primitive.upper(de));

    return 4;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiEi = (): byte => {
    SUB(Primitive.lower(de));

    return 4;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiHi = (): byte => {
    SUB(Primitive.upper(hl));

    return 4;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiLi = (): byte => {
    SUB(Primitive.lower(hl));

    return 4;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiHLm = (): byte => {
    SUB(Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAiAi = (): byte => {
    SUB(Primitive.upper(af));

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiBi = (): byte => {
    SBC(Primitive.upper(bc));

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiCi = (): byte => {
    SBC(Primitive.lower(bc));

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiDi = (): byte => {
    SBC(Primitive.upper(de));

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiEi = (): byte => {
    SBC(Primitive.lower(de));

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiHi = (): byte => {
    SBC(Primitive.upper(hl));

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiLi = (): byte => {
    SBC(Primitive.lower(hl));

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiHLm = (): byte => {
    SBC(Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAiAi = (): byte => {
    SBC(Primitive.upper(af));

    return 4;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDBi = (): byte => {
    AND(Primitive.upper(bc));

    return 4;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDCi = (): byte => {
    AND(Primitive.lower(bc));

    return 4;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDDi = (): byte => {
    AND(Primitive.upper(de));

    return 4;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDEi = (): byte => {
    AND(Primitive.lower(de));

    return 4;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDHi = (): byte => {
    AND(Primitive.upper(hl));

    return 4;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDLi = (): byte => {
    AND(Primitive.lower(hl));

    return 4;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDHLm = (): byte => {
    AND(memoryRef.readByte(hl));

    return 8;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDAi = (): byte => {
    AND(Primitive.upper(af));

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORBi = (): byte => {
    XOR(Primitive.upper(bc));

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORCi = (): byte => {
    XOR(Primitive.lower(bc));

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORDi = (): byte => {
    XOR(Primitive.upper(de));

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XOREi = (): byte => {
    XOR(Primitive.lower(de));

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORHi = (): byte => {
    XOR(Primitive.upper(hl));

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORLi = (): byte => {
    XOR(Primitive.lower(hl));

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORHLm = (): byte => {
    XOR(memoryRef.readByte(hl));

    return 8;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORAi = (): byte => {
    XOR(af >> 8);

    return 4;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORBi = (): byte => {
    OR(Primitive.upper(bc));

    return 4;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORCi = (): byte => {
    OR(Primitive.lower(bc));

    return 4;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORDi = (): byte => {
    OR(Primitive.upper(de));

    return 4;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private OREi = (): byte => {
    OR(Primitive.lower(de));

    return 4;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORHi = (): byte => {
    OR(Primitive.upper(hl));

    return 4;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORLi = (): byte => {
    OR(Primitive.lower(hl));

    return 4;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORHLm = (): byte => {
    OR(memoryRef.readByte(hl));

    return 8;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORAi = (): byte => {
    OR(Primitive.upper(af));

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPBi = (): byte => {
    CP(Primitive.upper(bc));

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPCi = (): byte => {
    CP(Primitive.lower(bc));

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPDi = (): byte => {
    CP(Primitive.upper(de));

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPEi = (): byte => {
    CP(Primitive.lower(de));

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPHi = (): byte => {
    CP(Primitive.upper(hl));

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPLi = (): byte => {
    CP(Primitive.lower(hl));

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPHLm = (): byte => {
    CP(Primitive.toByte(memoryRef.readByte(hl)));

    return 8;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPAi = (): byte => {
    CP(Primitive.upper(af));

    return 4;
  };

  /**
   * Conditionally from a private. =
   * @param =>- None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RETCNZ = (): byte => {
    if (RETH(!getZFlag())) {
      return 20;
    }

    return 8;
  };

  /**
   * Pops to the 16-bit register, data from the stack memoryRef.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private POPIntoBCi = (): byte => {
    bc = POP();

    return 12;
  };

  /**
   * Conditional jump to the absolute address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JPCNZa16 = (): byte => {
    if (Jpcc(!getZFlag())) {
      return 16;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * Jump to the absolute address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JPa16 = (): byte => {
    pc = memoryRef.readWord(pc);

    return 16;
  };

  /**
   * Conditional private call =  to the absolut=>e address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private CALLCNZa16 = (): byte => {
    if (CALLH(!getZFlag())) {
      return 24;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * Push to the stack memory, data from the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private PUSHRegisterBCi = (): byte => {
    PUSH(bc);

    return 16;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDAid8i = (): byte => {
    const value = Primitive.toByte(memoryRef.readByte(pc));
    checkFullCarry8(Primitive.upper(af), value);
    checkHalfCarry(Primitive.upper(af), value);
    af = Primitive.addUpper(af, value);
    setZFlag(!Primitive.upper(af));
    pc += 1;
    setNFlag(0);

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi00Hi = (): byte => {
    RST(0x00);

    return 16;
  };

  /**
   * Conditionally from a private. =
   * @param =>- None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RETCZ = (): byte => {
    if (getZFlag()) {
      const address: word = memoryRef.readWord(sp);
      pc = address;
      sp = Primitive.addWord(sp, 2);
      return 20;
    }
    return 8;
  };

  /**
   * Return from a private. =
   * @param =>- None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RET = (): byte => {
    RETH(true);

    return 16;
  };

  /**
   * Conditional jump to the absolute address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JPCZa16 = (): byte => {
    if (Jpcc(getZFlag())) {
      return 16;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * Execute a CB-prefixed instruction.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private PREFIX = (): byte => {
    const opcode: byte = memoryRef.readByte(pc);
    this.cbOpcodes[opcode]();
    pc += 1;

    return 4;
  };

  /**
   * Conditional private call =  to the absolut=>e address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private CALLCZa16 = (): byte => {
    if (CALLH(getZFlag())) {
      return 24;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * private call =  to the absolut=>e address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private CALL = (): byte => {
    CALLH(true);

    return 24;
  };

  /**
   * Add with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADCAid8i = (): byte => {
    ADC(Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi08Hi = (): byte => {
    RST(0x08);

    return 16;
  };

  /**
   * Conditionally from a private. =
   * @param =>- None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RETCNC = (): byte => {
    if (RETH(!getCYFlag())) {
      return 20;
    }
    return 8;
  };

  /**
   * Pops to the 16-bit register, data from the stack memoryRef.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private POPIntoDEi = (): byte => {
    de = POP();

    return 12;
  };

  /**
   * Conditional jump to the absolute address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JPCNCa16 = (): byte => {
    if (Jpcc(!getCYFlag())) {
      return 16;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalD3 = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Conditional private call =  to the absolut=>e address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private CALLCNCa16 = (): byte => {
    if (CALLH(!getCYFlag())) {
      return 24;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * Push to the stack memory, data from the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private PUSHRegisterDEi = (): byte => {
    PUSH(de);

    return 16;
  };

  /**
   * Subtract.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SUBAid8i = (): byte => {
    SUB(memoryRef.readByte(pc));
    pc += 1;

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi10Hi = (): byte => {
    RST(0x10);

    return 16;
  };

  /**
   * Conditionally from a private. =
   * @param =>- None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RETCC = (): byte => {
    if (RETH(getCYFlag())) {
      return 20;
    }
    return 8;
  };

  /**
   * Return from a private. =
   * @param =>- None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RETI = (): byte => {
    RETH(true);
    allInterruptsEnabled = true;

    return 16;
  };

  /**
   * Conditional jump to the absolute address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JPCCa16 = (): byte => {
    if (Jpcc(getCYFlag())) {
      return 16;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalDB = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Conditional private call =  to the absolut=>e address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private CALLCCa16 = (): byte => {
    if (CALLH(getCYFlag())) {
      return 24;
    }
    pc += 2;
    pc &= 0xffff;
    return 12;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalDD = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Subtract with carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SBCAid8i = (): byte => {
    SBC(Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi18Hi = (): byte => {
    RST(0x18);

    return 16;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHa8mAi = (): byte => {
    memoryRef.writeByte(0xff00 + memoryRef.readByte(pc), Primitive.upper(af));
    pc += 1;

    return 12;
  };

  /**
   * Pops to the 16-bit register, data from the stack memoryRef.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private POPIntoHLi = (): byte => {
    hl = POP();

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDCmAi = (): byte => {
    memoryRef.writeByte(0xff00 + Primitive.lower(bc), Primitive.upper(af));

    return 8;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalE3 = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalE4 = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Push to the stack memory, data from the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private PUSHRegisterHLi = (): byte => {
    PUSH(hl);

    return 16;
  };

  /**
   * Logical AND.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ANDd8i = (): byte => {
    AND(memoryRef.readByte(pc));
    pc += 1;

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi20Hi = (): byte => {
    RST(0x20);

    return 16;
  };

  /**
   * Add.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ADDSPir8i = (): byte => {
    const operand = Primitive.toSigned(memoryRef.readByte(pc));
    const sum = (sp + operand) & 0xffff;
    // don't ask me to explain why half-carry needs to be checked like this 😳
    // taken from https://github.com/taisel/GameBoy-Online
    const flag = sp ^ operand ^ sum;
    setCYFlag(flag & 0x100);
    setHFlag((flag & 0x10) === 0x10);
    sp = sum;
    pc += 1;
    pc &= 0xffff;
    setZFlag(0);
    setNFlag(0);

    return 16;
  };

  /**
   * Jump to the absolute address.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private JPHL = (): byte => {
    pc = hl;

    return 4;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDa16mAi = (): byte => {
    memoryRef.writeByte(memoryRef.readWord(pc), Primitive.upper(af));
    pc += 2;

    return 16;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalEB = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalEC = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalED = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Logical XOR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private XORd8i = (): byte => {
    XOR(Primitive.toByte(memoryRef.readByte(pc)));
    pc += 1;

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi28Hi = (): byte => {
    RST(0x28);

    return 16;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDHAia8m = (): byte => {
    const data = memoryRef.readByte(0xff00 + memoryRef.readByte(pc));
    af = Primitive.setUpper(af, data);
    pc += 1;

    return 12;
  };

  /**
   * Pops to the 16-bit register, data from the stack memoryRef.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private POPIntoAFi = (): byte => {
    af = POP();

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAiCm = (): byte => {
    const data = memoryRef.readByte(0xff00 + Primitive.lower(bc));
    af = Primitive.setUpper(af, data);

    return 8;
  };

  /**
   * Disables interrupt handling.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private DI = (): byte => {
    allInterruptsEnabled = false;

    return 4;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalF4 = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Push to the stack memory, data from the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private PUSHRegisterAFi = (): byte => {
    PUSH(af);

    return 16;
  };

  /**
   * Logical OR.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private ORd8i = (): byte => {
    OR(memoryRef.readByte(pc));
    pc += 1;

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi30Hi = (): byte => {
    RST(0x30);

    return 16;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private LDHLiSPIncri = (): byte => {
    const operand = Primitive.toSigned(memoryRef.readByte(pc)) & 0xffff;
    hl = (sp + operand) & 0xffff;
    const flag = operand ^ sp ^ hl;
    setHFlag(flag & 0x10);
    setCYFlag(flag & 0x100);
    pc += 1;
    pc &= 0xffff;
    setZFlag(0);
    setNFlag(0);

    return 12;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDSPiHLi = (): byte => {
    sp = hl;

    return 8;
  };

  /**
   * Load data into the register.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private LDAia16m = (): byte => {
    af = Primitive.setUpper(
      af,
      Primitive.toByte(memoryRef.readByte(memoryRef.readWord(pc)))
    );
    pc += 2;

    return 16;
  };

  /**
   * Enables interrupt handling.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private EI = (): byte => {
    allInterruptsEnabled = true;

    return 4;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalFC = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Invalid opcode.
   * Affected flags:
   */
  private IllegalFD = (): byte => {
    // throw new Error('Tried to call illegal opcode.');

    return 4;
  };

  /**
   * Compare A with regiseter.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private CPd8i = (): byte => {
    CP(memoryRef.readByte(pc));
    pc += 1;

    return 8;
  };

  /**
   * Unconditional private call =  to the absolut=>e fixed address
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RSTAi38Hi = (): byte => {
    RST(0x38);

    return 16;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCBi = (): byte => {
    bc = (bc & 0xff) | (RLCn(bc >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCCi = (): byte => {
    bc = (bc & 0xff00) | RLCn(bc & 0xff);

    return 8;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCDi = (): byte => {
    de = (de & 0xff) | (RLCn(de >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCEi = (): byte => {
    de = (de & 0xff00) | RLCn(de & 0xff);

    return 8;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCHi = (): byte => {
    hl = (hl & 0xff) | (RLCn(hl >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCLi = (): byte => {
    hl = (hl & 0xff00) | RLCn(hl & 0xff);

    return 8;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCHLm = (): byte => {
    memoryRef.writeByte(hl, RLCn(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Rotate n left. Old bit 7 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCAi = (): byte => {
    af = (af & 0xff) | (RLCn(af >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCBi = (): byte => {
    bc = (bc & 0xff) | (RRCn(bc >> 8) << 8);
    return 8;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCCi = (): byte => {
    bc = (bc & 0xff00) | RRCn(bc & 0xff);

    return 8;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCDi = (): byte => {
    de = (de & 0xff) | (RRCn(de >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCEi = (): byte => {
    de = (de & 0xff00) | RRCn(de & 0xff);

    return 8;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCHi = (): byte => {
    hl = Primitive.setUpper(hl, RRCn(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCLi = (): byte => {
    hl = (hl & 0xff00) | RRCn(hl & 0xff);

    return 8;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCHLm = (): byte => {
    memoryRef.writeByte(hl, RRCn(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Rotate n right. Old bit 0 to Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCAi = (): byte => {
    af = (af & 0xff) | (RRCn(af >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLBi = (): byte => {
    bc = (bc & 0xff) | (RLn(bc >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLCi = (): byte => {
    bc = (bc & 0xff00) | RLn(bc & 0xff);

    return 8;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLDi = (): byte => {
    de = (de & 0xff) | (RLn(de >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLEi = (): byte => {
    de = (de & 0xff00) | RLn(de & 0xff);

    return 8;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLHi = (): byte => {
    hl = (hl & 0xff) | (RLn(hl >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLLi = (): byte => {
    hl = (hl & 0xff00) | RLn(hl & 0xff);

    return 8;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLHLm = (): byte => {
    memoryRef.writeByte(hl, RLn(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Rotate n left through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RLAi = (): byte => {
    af = (af & 0xff) | (RLn(af >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRBi = (): byte => {
    bc = (bc & 0xff) | (RRn(bc >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRCi = (): byte => {
    bc = (bc & 0xff00) | RRn(bc & 0xff);

    return 8;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRDi = (): byte => {
    de = (de & 0xff) | (RRn(de >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RREi = (): byte => {
    de = (de & 0xff00) | RRn(de & 0xff);

    return 8;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRHi = (): byte => {
    hl = (hl & 0xff) | (RRn(hl >> 8) << 8);

    return 8;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRLi = (): byte => {
    hl = (hl & 0xff00) | RRn(hl & 0xff);

    return 8;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRHLm = (): byte => {
    memoryRef.writeByte(hl, RRn(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Rotate n right through Carry flag.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private RRAi = (): byte => {
    af = (af & 0xff) | (RRn(af >> 8) << 8);

    return 8;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLABi = (): byte => {
    bc = (bc & 0xff) | (SLAn(bc >> 8) << 8);

    return 8;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLACi = (): byte => {
    bc = (bc & 0xff00) | SLAn(bc & 0xff);

    return 8;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLADi = (): byte => {
    de = (de & 0xff) | (SLAn(de >> 8) << 8);

    return 8;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLAEi = (): byte => {
    de = (de & 0xff00) | SLAn(de & 0xff);

    return 8;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLAHi = (): byte => {
    hl = (hl & 0xff) | (SLAn(hl >> 8) << 8);

    return 8;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLALi = (): byte => {
    hl = (hl & 0xff00) | SLAn(hl & 0xff);

    return 8;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLAHLm = (): byte => {
    memoryRef.writeByte(hl, SLAn(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Shift n left into Carry. LSB of n set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SLAAi = (): byte => {
    af = (af & 0xff) | (SLAn(af >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRABi = (): byte => {
    bc = (bc & 0xff) | (SRAn(bc >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRACi = (): byte => {
    bc = (bc & 0xff00) | SRAn(bc & 0xff);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRADi = (): byte => {
    de = (de & 0xff) | (SRAn(de >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRAEi = (): byte => {
    de = (de & 0xff00) | SRAn(de & 0xff);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRAHi = (): byte => {
    hl = (hl & 0xff) | (SRAn(hl >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRALi = (): byte => {
    hl = (hl & 0xff00) | SRAn(hl & 0xff);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRAHLm = (): byte => {
    memoryRef.writeByte(hl, SRAn(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Shift n right into Carry. MSB doesn't change.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRAAi = (): byte => {
    af = (af & 0xff) | (SRAn(af >> 8) << 8);
    return 8;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPBi = (): byte => {
    bc = (bc & 0xff) | (SWAP(bc >> 8) << 8);

    return 8;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPCi = (): byte => {
    bc = (bc & 0xff00) | SWAP(bc & 0xff);

    return 8;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPDi = (): byte => {
    de = (de & 0xff) | (SWAP(de >> 8) << 8);

    return 8;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPEi = (): byte => {
    de = (de & 0xff00) | SWAP(de & 0xff);

    return 8;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPHi = (): byte => {
    hl = (hl & 0xff) | (SWAP(hl >> 8) << 8);

    return 8;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPLi = (): byte => {
    hl = (hl & 0xff00) | SWAP(hl & 0xff);

    return 8;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPHLm = (): byte => {
    memoryRef.writeByte(hl, SWAP(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Swap Primitive.upper and Primitive.lower nibbles.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SWAPAi = (): byte => {
    af = (af & 0xff) | (SWAP(af >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLBi = (): byte => {
    bc = (bc & 0xff) | (SRLn(bc >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLCi = (): byte => {
    bc = (bc & 0xff00) | SRLn(bc & 0xff);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLDi = (): byte => {
    de = (de & 0xff) | (SRLn(de >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLEi = (): byte => {
    de = (de & 0xff00) | SRLn(de & 0xff);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLHi = (): byte => {
    hl = (hl & 0xff) | (SRLn(hl >> 8) << 8);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLLi = (): byte => {
    hl = (hl & 0xff00) | SRLn(hl & 0xff);

    return 8;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLHLm = (): byte => {
    memoryRef.writeByte(hl, SRLn(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Shift n right into Carry. MSB set to 0.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H, C
   */
  private SRLAi = (): byte => {
    af = (af & 0xff) | (SRLn(af >> 8) << 8);

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iBi = (): byte => {
    BIT(0, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iCi = (): byte => {
    BIT(0, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iDi = (): byte => {
    BIT(0, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iEi = (): byte => {
    BIT(0, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iHi = (): byte => {
    BIT(0, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iLi = (): byte => {
    BIT(0, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iHLm = (): byte => {
    BIT(0, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT0iAi = (): byte => {
    BIT(0, Primitive.upper(af));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iBi = (): byte => {
    BIT(1, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iCi = (): byte => {
    BIT(1, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iDi = (): byte => {
    BIT(1, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iEi = (): byte => {
    BIT(1, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iHi = (): byte => {
    BIT(1, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iLi = (): byte => {
    BIT(1, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iHLm = (): byte => {
    BIT(1, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT1iAi = (): byte => {
    BIT(1, Primitive.upper(af));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iBi = (): byte => {
    BIT(2, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iCi = (): byte => {
    BIT(2, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iDi = (): byte => {
    BIT(2, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iEi = (): byte => {
    BIT(2, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iHi = (): byte => {
    BIT(2, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iLi = (): byte => {
    BIT(2, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iHLm = (): byte => {
    BIT(2, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT2iAi = (): byte => {
    BIT(2, Primitive.upper(af));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iBi = (): byte => {
    BIT(3, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iCi = (): byte => {
    BIT(3, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iDi = (): byte => {
    BIT(3, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iEi = (): byte => {
    BIT(3, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iHi = (): byte => {
    BIT(3, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iLi = (): byte => {
    BIT(3, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iHLm = (): byte => {
    BIT(3, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT3iAi = (): byte => {
    BIT(3, Primitive.upper(af));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iBi = (): byte => {
    BIT(4, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iCi = (): byte => {
    BIT(4, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iDi = (): byte => {
    BIT(4, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iEi = (): byte => {
    BIT(4, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iHi = (): byte => {
    BIT(4, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iLi = (): byte => {
    BIT(4, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iHLm = (): byte => {
    BIT(4, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT4iAi = (): byte => {
    BIT(4, Primitive.upper(af));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iBi = (): byte => {
    BIT(5, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iCi = (): byte => {
    BIT(5, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iDi = (): byte => {
    BIT(5, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iEi = (): byte => {
    BIT(5, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iHi = (): byte => {
    BIT(5, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iLi = (): byte => {
    BIT(5, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iHLm = (): byte => {
    BIT(5, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT5iAi = (): byte => {
    BIT(5, Primitive.upper(af));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iBi = (): byte => {
    BIT(6, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iCi = (): byte => {
    BIT(6, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iDi = (): byte => {
    BIT(6, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iEi = (): byte => {
    BIT(6, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iHi = (): byte => {
    BIT(6, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iLi = (): byte => {
    BIT(6, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iHLm = (): byte => {
    BIT(6, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT6iAi = (): byte => {
    BIT(6, Primitive.upper(af));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iBi = (): byte => {
    BIT(7, Primitive.upper(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iCi = (): byte => {
    BIT(7, Primitive.lower(bc));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iDi = (): byte => {
    BIT(7, Primitive.upper(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iEi = (): byte => {
    BIT(7, Primitive.lower(de));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iHi = (): byte => {
    BIT(7, Primitive.upper(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iLi = (): byte => {
    BIT(7, Primitive.lower(hl));

    return 8;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iHLm = (): byte => {
    BIT(7, memoryRef.readByte(hl));

    return 12;
  };

  /**
   * Test bit in register
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags: Z, N, H
   */
  private BIT7iAi = (): byte => {
    BIT(7, Primitive.upper(af));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0B = (): byte => {
    bc = Primitive.setUpper(bc, RES0(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0C = (): byte => {
    bc = Primitive.setLower(bc, RES0(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0D = (): byte => {
    de = Primitive.setUpper(de, RES0(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0E = (): byte => {
    de = Primitive.setLower(de, RES0(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0H = (): byte => {
    hl = Primitive.setUpper(hl, RES0(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0L = (): byte => {
    hl = Primitive.setLower(hl, RES0(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0HL = (): byte => {
    memoryRef.writeByte(hl, RES0(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES0A = (): byte => {
    af = Primitive.setUpper(af, RES0(Primitive.upper(af)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1B = (): byte => {
    bc = Primitive.setUpper(bc, RES1(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1C = (): byte => {
    bc = Primitive.setLower(bc, RES1(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1D = (): byte => {
    de = Primitive.setUpper(de, RES1(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1E = (): byte => {
    de = Primitive.setLower(de, RES1(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1H = (): byte => {
    hl = Primitive.setUpper(hl, RES1(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1L = (): byte => {
    hl = Primitive.setLower(hl, RES1(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1HL = (): byte => {
    memoryRef.writeByte(hl, RES1(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES1A = (): byte => {
    af = Primitive.setUpper(af, RES1(Primitive.upper(af)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2B = (): byte => {
    bc = Primitive.setUpper(bc, RES2(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2C = (): byte => {
    bc = Primitive.setLower(bc, RES2(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2D = (): byte => {
    de = Primitive.setUpper(de, RES2(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2E = (): byte => {
    de = Primitive.setLower(de, RES2(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2H = (): byte => {
    hl = Primitive.setUpper(hl, RES2(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2L = (): byte => {
    hl = Primitive.setLower(hl, RES2(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2HL = (): byte => {
    memoryRef.writeByte(hl, RES2(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES2A = (): byte => {
    af = Primitive.setUpper(af, RES2(Primitive.upper(af)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3B = (): byte => {
    bc = Primitive.setUpper(bc, RES3(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3C = (): byte => {
    bc = Primitive.setLower(bc, RES3(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3D = (): byte => {
    de = Primitive.setUpper(de, RES3(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3E = (): byte => {
    de = Primitive.setLower(de, RES3(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3H = (): byte => {
    hl = Primitive.setUpper(hl, RES3(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3L = (): byte => {
    hl = Primitive.setLower(hl, RES3(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3HL = (): byte => {
    memoryRef.writeByte(hl, RES3(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES3A = (): byte => {
    af = Primitive.setUpper(af, RES3(Primitive.upper(af)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4B = (): byte => {
    bc = Primitive.setUpper(bc, RES4(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4C = (): byte => {
    bc = Primitive.setLower(bc, RES4(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4D = (): byte => {
    de = Primitive.setUpper(de, RES4(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4E = (): byte => {
    de = Primitive.setLower(de, RES4(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4H = (): byte => {
    hl = Primitive.setUpper(hl, RES4(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4L = (): byte => {
    hl = Primitive.setLower(hl, RES4(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4HL = (): byte => {
    memoryRef.writeByte(hl, RES4(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES4A = (): byte => {
    af = Primitive.setUpper(af, RES4(Primitive.upper(af)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5B = (): byte => {
    bc = Primitive.setUpper(bc, RES5(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5C = (): byte => {
    bc = Primitive.setLower(bc, RES5(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5D = (): byte => {
    de = Primitive.setUpper(de, RES5(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5E = (): byte => {
    de = Primitive.setLower(de, RES5(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5H = (): byte => {
    hl = Primitive.setUpper(hl, RES5(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5L = (): byte => {
    hl = Primitive.setLower(hl, RES5(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5HL = (): byte => {
    memoryRef.writeByte(hl, RES5(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES5A = (): byte => {
    af = Primitive.setUpper(af, RES5(Primitive.upper(af)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6B = (): byte => {
    bc = Primitive.setUpper(bc, RES6(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6C = (): byte => {
    bc = Primitive.setLower(bc, RES6(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6D = (): byte => {
    de = Primitive.setUpper(de, RES6(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6E = (): byte => {
    de = Primitive.setLower(de, RES6(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6H = (): byte => {
    hl = Primitive.setUpper(hl, RES6(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6L = (): byte => {
    hl = Primitive.setLower(hl, RES6(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6HL = (): byte => {
    memoryRef.writeByte(hl, RES6(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES6A = (): byte => {
    af = Primitive.setUpper(af, RES6(Primitive.upper(af)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7B = (): byte => {
    bc = Primitive.setUpper(bc, RES7(Primitive.upper(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7C = (): byte => {
    bc = Primitive.setLower(bc, RES7(Primitive.lower(bc)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7D = (): byte => {
    de = Primitive.setUpper(de, RES7(Primitive.upper(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7E = (): byte => {
    de = Primitive.setLower(de, RES7(Primitive.lower(de)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7H = (): byte => {
    hl = Primitive.setUpper(hl, RES7(Primitive.upper(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7L = (): byte => {
    hl = Primitive.setLower(hl, RES7(Primitive.lower(hl)));

    return 8;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7HL = (): byte => {
    memoryRef.writeByte(hl, RES7(memoryRef.readByte(hl)));

    return 16;
  };

  /**
   * Reset bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private RES7A = (): byte => {
    af = Primitive.setUpper(af, RES7(Primitive.upper(af)));

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0B = (): byte => {
    bc |= 0b100000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0C = (): byte => {
    bc |= 0b1;
    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0D = (): byte => {
    de |= 0b100000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0E = (): byte => {
    de |= 0b1;
    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0H = (): byte => {
    hl |= 0b100000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0L = (): byte => {
    hl |= 0b1;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b1);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET0A = (): byte => {
    af |= 0b100000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1B = (): byte => {
    bc |= 0b1000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1C = (): byte => {
    bc |= 0b10;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1D = (): byte => {
    de |= 0b1000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1E = (): byte => {
    de |= 0b10;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1H = (): byte => {
    hl |= 0b1000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1L = (): byte => {
    hl |= 0b10;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b10);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET1A = (): byte => {
    af |= 0b1000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2B = (): byte => {
    bc |= 0b10000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2C = (): byte => {
    bc |= 0b100;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2D = (): byte => {
    de |= 0b10000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2E = (): byte => {
    de |= 0b100;
    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2H = (): byte => {
    hl |= 0b10000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2L = (): byte => {
    hl |= 0b100;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b100);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET2A = (): byte => {
    af |= 0b10000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3B = (): byte => {
    bc |= 0b100000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3C = (): byte => {
    bc |= 0b1000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3D = (): byte => {
    de |= 0b100000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3E = (): byte => {
    de |= 0b1000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3H = (): byte => {
    hl |= 0b100000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3L = (): byte => {
    hl |= 0b1000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b1000);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET3A = (): byte => {
    af |= 0b100000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4B = (): byte => {
    bc |= 0b1000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4C = (): byte => {
    bc |= 0b10000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4D = (): byte => {
    de |= 0b1000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4E = (): byte => {
    de |= 0b10000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4H = (): byte => {
    hl |= 0b1000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4L = (): byte => {
    hl |= 0b10000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b10000);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET4A = (): byte => {
    af |= 0b1000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5B = (): byte => {
    bc |= 0b10000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5C = (): byte => {
    bc |= 0b100000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5D = (): byte => {
    de |= 0b10000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5E = (): byte => {
    de |= 0b100000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5H = (): byte => {
    hl |= 0b10000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5L = (): byte => {
    hl |= 0b100000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b100000);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET5A = (): byte => {
    af |= 0b10000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6B = (): byte => {
    bc |= 0b100000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6C = (): byte => {
    bc |= 0b1000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6D = (): byte => {
    de |= 0b100000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6E = (): byte => {
    de |= 0b1000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6H = (): byte => {
    hl |= 0b100000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6L = (): byte => {
    hl |= 0b1000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b1000000);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET6A = (): byte => {
    af |= 0b100000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7B = (): byte => {
    bc |= 0b1000000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7C = (): byte => {
    bc |= 0b10000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7D = (): byte => {
    de |= 0b1000000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7E = (): byte => {
    de |= 0b10000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7H = (): byte => {
    hl |= 0b1000000000000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7L = (): byte => {
    hl |= 0b10000000;

    return 8;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7HL = (): byte => {
    memoryRef.writeByte(hl, memoryRef.readByte(hl) | 0b10000000);

    return 16;
  };

  /**
   * Set bit b in register r.
   * @param - None
   * @returns {byte} - The number of system clock ticks required.
   * Affected flags:
   */
  private SET7A = (): byte => {
    af |= 0b1000000000000000;

    return 8;
  };

  private opcodes: OpcodeList = {
    0x00: this.NOP,
    0x01: this.LDBCid16i,
    0x02: this.LDBCmAi,
    0x03: this.INCBCi,
    0x04: this.INCBi,
    0x05: this.DECBi,
    0x06: this.LDBid8i,
    0x07: this.RLCA,
    0x08: this.LDa16mSPi,
    0x09: this.ADDHLiBCi,
    0x0a: this.LDAiBCm,
    0x0b: this.DECBCi,
    0x0c: this.INCCi,
    0x0d: this.DECCi,
    0x0e: this.LDCid8i,
    0x0f: this.RRCA,
    0x10: this.STOP,
    0x11: this.LDDEid16i,
    0x12: this.LDDEmAi,
    0x13: this.INCDEi,
    0x14: this.INCDi,
    0x15: this.DECDi,
    0x16: this.LDDid8i,
    0x17: this.RLA,
    0x18: this.JRr8,
    0x19: this.ADDHLiDEi,
    0x1a: this.LDAiDEm,
    0x1b: this.DECDEi,
    0x1c: this.INCEi,
    0x1d: this.DECEi,
    0x1e: this.LDEid8i,
    0x1f: this.RRA,
    0x20: this.JRCNZr8,
    0x21: this.LDHLid16i,
    0x22: this.LDHLIncrmAi,
    0x23: this.INCHLi,
    0x24: this.INCHi,
    0x25: this.DECHi,
    0x26: this.LDHid8i,
    0x27: this.DAAA,
    0x28: this.JRCZr8,
    0x29: this.ADDHLiHLi,
    0x2a: this.LDAiHLIncrm,
    0x2b: this.DECHLi,
    0x2c: this.INCLi,
    0x2d: this.DECLi,
    0x2e: this.LDLid8i,
    0x2f: this.CPLA,
    0x30: this.JRCNCr8,
    0x31: this.LDSPid16i,
    0x32: this.LDHLDecrmAi,
    0x33: this.INCSPi,
    0x34: this.INCHLm,
    0x35: this.DECHLm,
    0x36: this.LDHLmd8i,
    0x37: this.SCF,
    0x38: this.JRCCr8,
    0x39: this.ADDHLiSPi,
    0x3a: this.LDAiHLDecrm,
    0x3b: this.DECSPi,
    0x3c: this.INCAi,
    0x3d: this.DECAi,
    0x3e: this.LDAid8i,
    0x3f: this.CCF,
    0x40: this.LDBiBi,
    0x41: this.LDBiCi,
    0x42: this.LDBiDi,
    0x43: this.LDBiEi,
    0x44: this.LDBiHi,
    0x45: this.LDBiLi,
    0x46: this.LDBiHLm,
    0x47: this.LDBiAi,
    0x48: this.LDCiBi,
    0x49: this.LDCiCi,
    0x4a: this.LDCiDi,
    0x4b: this.LDCiEi,
    0x4c: this.LDCiHi,
    0x4d: this.LDCiLi,
    0x4e: this.LDCiHLm,
    0x4f: this.LDCiAi,
    0x50: this.LDDiBi,
    0x51: this.LDDiCi,
    0x52: this.LDDiDi,
    0x53: this.LDDiEi,
    0x54: this.LDDiHi,
    0x55: this.LDDiLi,
    0x56: this.LDDiHLm,
    0x57: this.LDDiAi,
    0x58: this.LDEiBi,
    0x59: this.LDEiCi,
    0x5a: this.LDEiDi,
    0x5b: this.LDEiEi,
    0x5c: this.LDEiHi,
    0x5d: this.LDEiLi,
    0x5e: this.LDEiHLm,
    0x5f: this.LDEiAi,
    0x60: this.LDHiBi,
    0x61: this.LDHiCi,
    0x62: this.LDHiDi,
    0x63: this.LDHiEi,
    0x64: this.LDHiHi,
    0x65: this.LDHiLi,
    0x66: this.LDHiHLm,
    0x67: this.LDHiAi,
    0x68: this.LDLiBi,
    0x69: this.LDLiCi,
    0x6a: this.LDLiDi,
    0x6b: this.LDLiEi,
    0x6c: this.LDLiHi,
    0x6d: this.LDLiLi,
    0x6e: this.LDLiHLm,
    0x6f: this.LDLiAi,
    0x70: this.LDHLmBi,
    0x71: this.LDHLmCi,
    0x72: this.LDHLmDi,
    0x73: this.LDHLmEi,
    0x74: this.LDHLmHi,
    0x75: this.LDHLmLi,
    0x76: this.HALT,
    0x77: this.LDHLmAi,
    0x78: this.LDAiBi,
    0x79: this.LDAiCi,
    0x7a: this.LDAiDi,
    0x7b: this.LDAiEi,
    0x7c: this.LDAiHi,
    0x7d: this.LDAiLi,
    0x7e: this.LDAiHLm,
    0x7f: this.LDAiAi,
    0x80: this.ADDAiBi,
    0x81: this.ADDAiCi,
    0x82: this.ADDAiDi,
    0x83: this.ADDAiEi,
    0x84: this.ADDAiHi,
    0x85: this.ADDAiLi,
    0x86: this.ADDAiHLm,
    0x87: this.ADDAiAi,
    0x88: this.ADCAiBi,
    0x89: this.ADCAiCi,
    0x8a: this.ADCAiDi,
    0x8b: this.ADCAiEi,
    0x8c: this.ADCAiHi,
    0x8d: this.ADCAiLi,
    0x8e: this.ADCAiHLm,
    0x8f: this.ADCAiAi,
    0x90: this.SUBAiBi,
    0x91: this.SUBAiCi,
    0x92: this.SUBAiDi,
    0x93: this.SUBAiEi,
    0x94: this.SUBAiHi,
    0x95: this.SUBAiLi,
    0x96: this.SUBAiHLm,
    0x97: this.SUBAiAi,
    0x98: this.SBCAiBi,
    0x99: this.SBCAiCi,
    0x9a: this.SBCAiDi,
    0x9b: this.SBCAiEi,
    0x9c: this.SBCAiHi,
    0x9d: this.SBCAiLi,
    0x9e: this.SBCAiHLm,
    0x9f: this.SBCAiAi,
    0xa0: this.ANDBi,
    0xa1: this.ANDCi,
    0xa2: this.ANDDi,
    0xa3: this.ANDEi,
    0xa4: this.ANDHi,
    0xa5: this.ANDLi,
    0xa6: this.ANDHLm,
    0xa7: this.ANDAi,
    0xa8: this.XORBi,
    0xa9: this.XORCi,
    0xaa: this.XORDi,
    0xab: this.XOREi,
    0xac: this.XORHi,
    0xad: this.XORLi,
    0xae: this.XORHLm,
    0xaf: this.XORAi,
    0xb0: this.ORBi,
    0xb1: this.ORCi,
    0xb2: this.ORDi,
    0xb3: this.OREi,
    0xb4: this.ORHi,
    0xb5: this.ORLi,
    0xb6: this.ORHLm,
    0xb7: this.ORAi,
    0xb8: this.CPBi,
    0xb9: this.CPCi,
    0xba: this.CPDi,
    0xbb: this.CPEi,
    0xbc: this.CPHi,
    0xbd: this.CPLi,
    0xbe: this.CPHLm,
    0xbf: this.CPAi,
    0xc0: this.RETCNZ,
    0xc1: this.POPIntoBCi,
    0xc2: this.JPCNZa16,
    0xc3: this.JPa16,
    0xc4: this.CALLCNZa16,
    0xc5: this.PUSHRegisterBCi,
    0xc6: this.ADDAid8i,
    0xc7: this.RSTAi00Hi,
    0xc8: this.RETCZ,
    0xc9: this.RET,
    0xca: this.JPCZa16,
    0xcb: this.PREFIX,
    0xcc: this.CALLCZa16,
    0xcd: this.CALL,
    0xce: this.ADCAid8i,
    0xcf: this.RSTAi08Hi,
    0xd0: this.RETCNC,
    0xd1: this.POPIntoDEi,
    0xd2: this.JPCNCa16,
    0xd3: this.IllegalD3,
    0xd4: this.CALLCNCa16,
    0xd5: this.PUSHRegisterDEi,
    0xd6: this.SUBAid8i,
    0xd7: this.RSTAi10Hi,
    0xd8: this.RETCC,
    0xd9: this.RETI,
    0xda: this.JPCCa16,
    0xdb: this.IllegalDB,
    0xdc: this.CALLCCa16,
    0xdd: this.IllegalDD,
    0xde: this.SBCAid8i,
    0xdf: this.RSTAi18Hi,
    0xe0: this.LDHa8mAi,
    0xe1: this.POPIntoHLi,
    0xe2: this.LDCmAi,
    0xe3: this.IllegalE3,
    0xe4: this.IllegalE4,
    0xe5: this.PUSHRegisterHLi,
    0xe6: this.ANDd8i,
    0xe7: this.RSTAi20Hi,
    0xe8: this.ADDSPir8i,
    0xe9: this.JPHL,
    0xea: this.LDa16mAi,
    0xeb: this.IllegalEB,
    0xec: this.IllegalEC,
    0xed: this.IllegalED,
    0xee: this.XORd8i,
    0xef: this.RSTAi28Hi,
    0xf0: this.LDHAia8m,
    0xf1: this.POPIntoAFi,
    0xf2: this.LDAiCm,
    0xf3: this.DI,
    0xf4: this.IllegalF4,
    0xf5: this.PUSHRegisterAFi,
    0xf6: this.ORd8i,
    0xf7: this.RSTAi30Hi,
    0xf8: this.LDHLiSPIncri,
    0xf9: this.LDSPiHLi,
    0xfa: this.LDAia16m,
    0xfb: this.EI,
    0xfc: this.IllegalFC,
    0xfd: this.IllegalFD,
    0xfe: this.CPd8i,
    0xff: this.RSTAi38Hi,
  };

  private cbOpcodes: OpcodeList = {
    0x00: this.RLCBi,
    0x01: this.RLCCi,
    0x02: this.RLCDi,
    0x03: this.RLCEi,
    0x04: this.RLCHi,
    0x05: this.RLCLi,
    0x06: this.RLCHLm,
    0x07: this.RLCAi,
    0x08: this.RRCBi,
    0x09: this.RRCCi,
    0x0a: this.RRCDi,
    0x0b: this.RRCEi,
    0x0c: this.RRCHi,
    0x0d: this.RRCLi,
    0x0e: this.RRCHLm,
    0x0f: this.RRCAi,
    0x10: this.RLBi,
    0x11: this.RLCi,
    0x12: this.RLDi,
    0x13: this.RLEi,
    0x14: this.RLHi,
    0x15: this.RLLi,
    0x16: this.RLHLm,
    0x17: this.RLAi,
    0x18: this.RRBi,
    0x19: this.RRCi,
    0x1a: this.RRDi,
    0x1b: this.RREi,
    0x1c: this.RRHi,
    0x1d: this.RRLi,
    0x1e: this.RRHLm,
    0x1f: this.RRAi,
    0x20: this.SLABi,
    0x21: this.SLACi,
    0x22: this.SLADi,
    0x23: this.SLAEi,
    0x24: this.SLAHi,
    0x25: this.SLALi,
    0x26: this.SLAHLm,
    0x27: this.SLAAi,
    0x28: this.SRABi,
    0x29: this.SRACi,
    0x2a: this.SRADi,
    0x2b: this.SRAEi,
    0x2c: this.SRAHi,
    0x2d: this.SRALi,
    0x2e: this.SRAHLm,
    0x2f: this.SRAAi,
    0x30: this.SWAPBi,
    0x31: this.SWAPCi,
    0x32: this.SWAPDi,
    0x33: this.SWAPEi,
    0x34: this.SWAPHi,
    0x35: this.SWAPLi,
    0x36: this.SWAPHLm,
    0x37: this.SWAPAi,
    0x38: this.SRLBi,
    0x39: this.SRLCi,
    0x3a: this.SRLDi,
    0x3b: this.SRLEi,
    0x3c: this.SRLHi,
    0x3d: this.SRLLi,
    0x3e: this.SRLHLm,
    0x3f: this.SRLAi,
    0x40: this.BIT0iBi,
    0x41: this.BIT0iCi,
    0x42: this.BIT0iDi,
    0x43: this.BIT0iEi,
    0x44: this.BIT0iHi,
    0x45: this.BIT0iLi,
    0x46: this.BIT0iHLm,
    0x47: this.BIT0iAi,
    0x48: this.BIT1iBi,
    0x49: this.BIT1iCi,
    0x4a: this.BIT1iDi,
    0x4b: this.BIT1iEi,
    0x4c: this.BIT1iHi,
    0x4d: this.BIT1iLi,
    0x4e: this.BIT1iHLm,
    0x4f: this.BIT1iAi,
    0x50: this.BIT2iBi,
    0x51: this.BIT2iCi,
    0x52: this.BIT2iDi,
    0x53: this.BIT2iEi,
    0x54: this.BIT2iHi,
    0x55: this.BIT2iLi,
    0x56: this.BIT2iHLm,
    0x57: this.BIT2iAi,
    0x58: this.BIT3iBi,
    0x59: this.BIT3iCi,
    0x5a: this.BIT3iDi,
    0x5b: this.BIT3iEi,
    0x5c: this.BIT3iHi,
    0x5d: this.BIT3iLi,
    0x5e: this.BIT3iHLm,
    0x5f: this.BIT3iAi,
    0x60: this.BIT4iBi,
    0x61: this.BIT4iCi,
    0x62: this.BIT4iDi,
    0x63: this.BIT4iEi,
    0x64: this.BIT4iHi,
    0x65: this.BIT4iLi,
    0x66: this.BIT4iHLm,
    0x67: this.BIT4iAi,
    0x68: this.BIT5iBi,
    0x69: this.BIT5iCi,
    0x6a: this.BIT5iDi,
    0x6b: this.BIT5iEi,
    0x6c: this.BIT5iHi,
    0x6d: this.BIT5iLi,
    0x6e: this.BIT5iHLm,
    0x6f: this.BIT5iAi,
    0x70: this.BIT6iBi,
    0x71: this.BIT6iCi,
    0x72: this.BIT6iDi,
    0x73: this.BIT6iEi,
    0x74: this.BIT6iHi,
    0x75: this.BIT6iLi,
    0x76: this.BIT6iHLm,
    0x77: this.BIT6iAi,
    0x78: this.BIT7iBi,
    0x79: this.BIT7iCi,
    0x7a: this.BIT7iDi,
    0x7b: this.BIT7iEi,
    0x7c: this.BIT7iHi,
    0x7d: this.BIT7iLi,
    0x7e: this.BIT7iHLm,
    0x7f: this.BIT7iAi,
    0x80: this.RES0B,
    0x81: this.RES0C,
    0x82: this.RES0D,
    0x83: this.RES0E,
    0x84: this.RES0H,
    0x85: this.RES0L,
    0x86: this.RES0HL,
    0x87: this.RES0A,
    0x88: this.RES1B,
    0x89: this.RES1C,
    0x8a: this.RES1D,
    0x8b: this.RES1E,
    0x8c: this.RES1H,
    0x8d: this.RES1L,
    0x8e: this.RES1HL,
    0x8f: this.RES1A,
    0x90: this.RES2B,
    0x91: this.RES2C,
    0x92: this.RES2D,
    0x93: this.RES2E,
    0x94: this.RES2H,
    0x95: this.RES2L,
    0x96: this.RES2HL,
    0x97: this.RES2A,
    0x98: this.RES3B,
    0x99: this.RES3C,
    0x9a: this.RES3D,
    0x9b: this.RES3E,
    0x9c: this.RES3H,
    0x9d: this.RES3L,
    0x9e: this.RES3HL,
    0x9f: this.RES3A,
    0xa0: this.RES4B,
    0xa1: this.RES4C,
    0xa2: this.RES4D,
    0xa3: this.RES4E,
    0xa4: this.RES4H,
    0xa5: this.RES4L,
    0xa6: this.RES4HL,
    0xa7: this.RES4A,
    0xa8: this.RES5B,
    0xa9: this.RES5C,
    0xaa: this.RES5D,
    0xab: this.RES5E,
    0xac: this.RES5H,
    0xad: this.RES5L,
    0xae: this.RES5HL,
    0xaf: this.RES5A,
    0xb0: this.RES6B,
    0xb1: this.RES6C,
    0xb2: this.RES6D,
    0xb3: this.RES6E,
    0xb4: this.RES6H,
    0xb5: this.RES6L,
    0xb6: this.RES6HL,
    0xb7: this.RES6A,
    0xb8: this.RES7B,
    0xb9: this.RES7C,
    0xba: this.RES7D,
    0xbb: this.RES7E,
    0xbc: this.RES7H,
    0xbd: this.RES7L,
    0xbe: this.RES7HL,
    0xbf: this.RES7A,
    0xc0: this.SET0B,
    0xc1: this.SET0C,
    0xc2: this.SET0D,
    0xc3: this.SET0E,
    0xc4: this.SET0H,
    0xc5: this.SET0L,
    0xc6: this.SET0HL,
    0xc7: this.SET0A,
    0xc8: this.SET1B,
    0xc9: this.SET1C,
    0xca: this.SET1D,
    0xcb: this.SET1E,
    0xcc: this.SET1H,
    0xcd: this.SET1L,
    0xce: this.SET1HL,
    0xcf: this.SET1A,
    0xd0: this.SET2B,
    0xd1: this.SET2C,
    0xd2: this.SET2D,
    0xd3: this.SET2E,
    0xd4: this.SET2H,
    0xd5: this.SET2L,
    0xd6: this.SET2HL,
    0xd7: this.SET2A,
    0xd8: this.SET3B,
    0xd9: this.SET3C,
    0xda: this.SET3D,
    0xdb: this.SET3E,
    0xdc: this.SET3H,
    0xdd: this.SET3L,
    0xde: this.SET3HL,
    0xdf: this.SET3A,
    0xe0: this.SET4B,
    0xe1: this.SET4C,
    0xe2: this.SET4D,
    0xe3: this.SET4E,
    0xe4: this.SET4H,
    0xe5: this.SET4L,
    0xe6: this.SET4HL,
    0xe7: this.SET4A,
    0xe8: this.SET5B,
    0xe9: this.SET5C,
    0xea: this.SET5D,
    0xeb: this.SET5E,
    0xec: this.SET5H,
    0xed: this.SET5L,
    0xee: this.SET5HL,
    0xef: this.SET5A,
    0xf0: this.SET6B,
    0xf1: this.SET6C,
    0xf2: this.SET6D,
    0xf3: this.SET6E,
    0xf4: this.SET6H,
    0xf5: this.SET6L,
    0xf6: this.SET6HL,
    0xf7: this.SET6A,
    0xf8: this.SET7B,
    0xf9: this.SET7C,
    0xfa: this.SET7D,
    0xfb: this.SET7E,
    0xfc: this.SET7H,
    0xfd: this.SET7L,
    0xfe: this.SET7HL,
    0xff: this.SET7A,
  };
}

function RLCn(reg: byte): byte {
  setCYFlag(reg >> 7);
  const result: byte = ((reg << 1) & 0xff) | getCYFlag();
  setZFlag(!result);
  setNFlag(0);
  setHFlag(0);
  return result;
}

function RLn(reg: byte): byte {
  const cy = reg >> 7;
  const result = ((reg << 1) & 0xff) | getCYFlag();
  setCYFlag(cy);
  setZFlag(!result);
  setHFlag(0);
  setNFlag(0);
  return result;
}

function ADD(operand: byte): void {
  let a = af >> 8;
  checkFullCarry8(a, operand);
  checkHalfCarry(a, operand);
  a = (a + operand) & 0xff;
  af = (a << 8) | (af & 0xff);
  setZFlag(!a);
  setNFlag(0);
}

function ADC(operand: byte): void {
  let a = af >> 8;
  const cy = getCYFlag();
  setHFlag(((operand & 0xf) + (a & 0xf) + cy) & 0x10);
  operand += cy;
  checkFullCarry8(operand, a);
  a = (a + operand) & 0xff;
  af = (a << 8) | (af & 0xff);
  setZFlag(!a);
  setNFlag(0);
}

function SUB(operand: byte): void {
  checkFullCarry8(Primitive.upper(af), operand, true);
  checkHalfCarry(Primitive.upper(af), operand, true);
  af = Primitive.toWord(Primitive.addUpper(af, -operand));
  setZFlag(!Primitive.upper(af));
  setNFlag(1);
}

function SBC(operand: byte): void {
  let a = af >> 8;
  const cy = getCYFlag();
  setHFlag((a & 0xf) - (operand & 0xf) - cy < 0);
  setCYFlag(a - operand - cy < 0);
  a = (a - operand - cy) & 0xff;
  af = (a << 8) | (af & 0xff);
  setZFlag(!a);
  setNFlag(1);
}

function OR(operand: byte): void {
  const result = Primitive.upper(af) | operand;
  af = Primitive.setUpper(af, Primitive.toByte(result));
  setZFlag(!Primitive.upper(af));
  setNFlag(0);
  setHFlag(0);
  setCYFlag(0);
}

function AND(operand: byte): void {
  const result = Primitive.upper(af) & operand;
  af = Primitive.setUpper(af, Primitive.toByte(result));
  setZFlag(!Primitive.upper(af));
  setNFlag(0);
  setHFlag(1);
  setCYFlag(0);
}

function XOR(operand: byte): void {
  const result = (af >> 8) ^ operand;
  af = (af & 0xff) | ((result & 0xff) << 8);
  setZFlag(!(af >> 8));
  setNFlag(0);
  setHFlag(0);
  setCYFlag(0);
}

function CP(operand: byte): void {
  checkFullCarry8(Primitive.upper(af), operand, true);
  checkHalfCarry(Primitive.upper(af), operand, true);
  const result: byte = Primitive.addByte(Primitive.upper(af), -operand);
  setNFlag(1);
  setZFlag(!result);
}

function CALLH(flag: boolean | bit): boolean {
  if (flag) {
    sp -= 2;
    sp &= 0xffff;
    memoryRef.writeWord(sp, (pc + 2) & 0xffff);
    pc = memoryRef.readWord(pc);
    return true;
  }
  return false;
}

function PUSH(register: word): void {
  sp -= 1;
  sp &= 0xffff;
  memoryRef.writeByte(sp, register >> 8);
  sp -= 1;
  sp &= 0xffff;
  memoryRef.writeByte(sp, register & 0xff);
}

function POP(): word {
  const value: word = memoryRef.readWord(sp);
  sp = Primitive.addWord(sp, 2);
  return value;
}

function Jpcc(flag: boolean | bit): boolean {
  if (flag) {
    pc = memoryRef.readWord(pc);
    return true;
  }
  return false;
}

function RETH(flag: boolean | bit): boolean {
  if (flag) {
    pc = memoryRef.readWord(sp);
    sp += 2;
    sp &= 0xffff;
    return true;
  }
  return false;
}

function RST(address: word): void {
  sp -= 2;
  sp &= 0xffff;
  memoryRef.writeWord(sp, pc);
  pc = address;
}

function RRCn(reg: byte): byte {
  setCYFlag(reg & 1);
  const result: byte = (reg >> 1) | (getCYFlag() << 7);
  setZFlag(!result);
  setNFlag(0);
  setHFlag(0);
  return result;
}

function RRn(reg: byte): byte {
  const cy = reg & 1;
  const result: byte = Primitive.toByte((reg >> 1) | (getCYFlag() << 7));
  setCYFlag(cy);
  setZFlag(!result);
  setHFlag(0);
  setNFlag(0);
  return result;
}

function SLAn(reg: byte): byte {
  setCYFlag(reg >> 7);
  const result = (reg << 1) & 0xff;
  setZFlag(!result);
  setHFlag(0);
  setNFlag(0);
  return result;
}

function SRAn(reg: byte): byte {
  setCYFlag(reg & 1);
  // shift to right, but keep the most sig bit
  const result: byte = (reg >> 1) | (reg & 0x80);
  setZFlag(!result);
  setHFlag(0);
  setNFlag(0);
  return result;
}

function SRLn(reg: byte): byte {
  setCYFlag(reg & 1);
  const result: byte = reg >> 1;
  setZFlag(!result);
  setHFlag(0);
  setNFlag(0);
  return result;
}

function BIT(bit: number, reg: byte): void {
  setZFlag(!((reg >> bit) & 1));
  setNFlag(0);
  setHFlag(1);
}

function RES0(reg: byte): byte {
  return reg & 0xfe;
}

function RES1(reg: byte): byte {
  return reg & 0xfd;
}

function RES2(reg: byte): byte {
  return reg & 0xfb;
}

function RES3(reg: byte): byte {
  return reg & 0xf7;
}

function RES4(reg: byte): byte {
  return reg & 0xef;
}

function RES5(reg: byte): byte {
  return reg & 0xdf;
}

function RES6(reg: byte): byte {
  return reg & 0xbf;
}

function RES7(reg: byte): byte {
  return reg & 0x7f;
}

function SET(bit: number, reg: byte): byte {
  return reg | (1 << bit);
}

function SWAP(reg: byte): byte {
  const result = ((reg & 0xf) << 4) | (reg >> 4);
  setZFlag(!result);
  setCYFlag(0);
  setHFlag(0);
  setNFlag(0);
  return result;
}

class Flag {
  private _z: bit = 0; // set if last op producted 0
  private _n: bit = 0; // set if last op was subtraction
  private _h: bit = 0; // set if result's Primitive.lower half of last op overflowed past 15
  private _cy: bit = 0; // set if last op produced a result over 0xff or under 0
  private cpu: CPU = <CPU>{};
  constructor(cpu: CPU, value: byte = 0) {
    this.cpu = cpu;
    this.z = (value >> 7) & 1;
    this.n = (value >> 6) & 1;
    this.h = (value >> 5) & 1;
    this.cy = (value >> 4) & 1;
  }

  private error(): void {
    throw new Error('Tried to set flag outside range.');
  }

  public value = (): byte => {
    return (this.z << 7) | (this.n << 6) | (this.h << 5) | (this.cy << 4);
  };

  set z(value: bit) {
    if (value === 0 || value === 1) {
      this._z = value;
      af = Primitive.setLower(af, Primitive.lower(af) | (value << 7));
    } else {
      this.error();
    }
  }

  get z(): bit {
    return this._z;
  }

  set n(value: bit) {
    if (value === 0 || value === 1) {
      this._n = value;
      af = Primitive.setLower(af, Primitive.lower(af) | (value << 6));
    } else {
      this.error();
    }
  }

  get n(): bit {
    return this._n;
  }

  set h(value: bit) {
    if (value === 0 || value === 1) {
      this._h = value;
      af = Primitive.setLower(af, Primitive.lower(af) | (value << 5));
    } else {
      this.error();
    }
  }

  get h(): bit {
    return this._h;
  }

  set cy(value: bit) {
    if (value === 0 || value === 1) {
      this._cy = value;
      af = Primitive.setLower(af, Primitive.lower(af) | (value << 4));
    } else {
      this.error();
    }
  }

  get cy(): bit {
    return this._cy;
  }

  public static formatFlag = (value: byte): object => ({
    z: (value >> 7) & 1,
    n: (value >> 6) & 1,
    h: (value >> 5) & 1,
    cy: (value >> 4) & 1,
  });
}

export default CPU;
export {Flag};
