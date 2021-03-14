import Memory from '../../Memory';
import {
  byte,
  word,
  toByte,
  addByte,
  toWord,
  upper,
  lower,
  setUpper,
  setLower,
  addWord,
  addUpper,
  toSigned,
} from '../../Types';
import CPU from '..';

/**
 * To double-check:
 * RLCA
 * RRCA
 * RLA
 * RRA
 *
 * Implement:
 * Template functions for recurring opcodes
 * STOP
 */

function ADD(operand: byte): void {
  CPU.checkFullCarry8(upper(CPU.r.af), operand);
  CPU.checkHalfCarry(upper(CPU.r.af), operand);
  CPU.r.af = addUpper(CPU.r.af, operand);
  CPU.checkZFlag(upper(CPU.r.af));
  CPU.r.f.n = 0;
}

function ADC(operand: byte): void {
  operand = addByte(operand, CPU.r.f.cy);
  CPU.checkFullCarry8(upper(CPU.r.af), operand);
  CPU.checkHalfCarry(upper(CPU.r.af), operand);
  CPU.r.af = addUpper(CPU.r.af, operand);
  CPU.checkZFlag(upper(CPU.r.af));
  CPU.r.f.n = 0;
}

function SUB(operand: byte): void {
  operand *= -1;
  CPU.checkFullCarry8(upper(CPU.r.af), operand);
  CPU.checkHalfCarry(upper(CPU.r.af), operand);
  CPU.r.af = addUpper(CPU.r.af, operand);
  CPU.checkZFlag(upper(CPU.r.af));
  CPU.r.f.n = 1;
}

function SBC(operand: byte): void {
  operand *= -1;
  const carry = CPU.r.f.cy ? -1 : 0;
  operand = addByte(operand, carry);
  CPU.checkFullCarry8(upper(CPU.r.af), operand);
  CPU.checkHalfCarry(upper(CPU.r.af), operand);
  CPU.r.af = addUpper(CPU.r.af, operand);
  CPU.checkZFlag(upper(CPU.r.af));
  CPU.r.f.n = 1;
}

function OR(operand: byte): void {
  const result = upper(CPU.r.af) | operand;
  CPU.r.af = setUpper(CPU.r.af, toByte(result));
  CPU.checkZFlag(upper(CPU.r.af));
  CPU.r.f.n = 0;
  CPU.r.f.h = 0;
  CPU.r.f.cy = 0;
}

function AND(operand: byte): void {
  const result = upper(CPU.r.af) & operand;
  CPU.r.af = setUpper(CPU.r.af, toByte(result));
  CPU.checkZFlag(upper(CPU.r.af));
  CPU.r.f.n = 0;
  CPU.r.f.h = 1;
  CPU.r.f.cy = 0;
}

function XOR(operand: byte): void {
  const result = upper(CPU.r.af) ^ operand;
  CPU.r.af = setUpper(CPU.r.af, toByte(result));
  CPU.checkZFlag(upper(CPU.r.af));
  CPU.r.f.n = 0;
  CPU.r.f.h = 0;
  CPU.r.f.cy = 0;
}

function CP(operand: byte): void {
  operand *= -1;
  CPU.checkFullCarry8(upper(CPU.r.af), operand);
  CPU.checkHalfCarry(upper(CPU.r.af), operand);
  const result: byte = toByte(upper(CPU.r.af) + operand);
  CPU.checkZFlag(result);
}

function CALL(flag: boolean): boolean {
  if (flag) {
    CPU.sp = addWord(CPU.sp, -2);
    Memory.writeWord(CPU.sp, toWord(CPU.pc + 2));
    CPU.pc = Memory.readWord(CPU.pc);
    return true;
  }
  return false;
}

function PUSH(register: word): void {
  CPU.sp = addWord(CPU.sp, -1);
  Memory.writeByte(CPU.sp, upper(register));
  CPU.sp = addWord(CPU.sp, -1);
  Memory.writeByte(CPU.sp, lower(register));
}

function POP(register: word): void {
  register = Memory.readWord(CPU.pc);
  CPU.sp = addWord(CPU.sp, 2);
}

function Jpcc(flag: boolean): boolean {
  if (flag) {
    CPU.pc = Memory.readWord(CPU.pc);
    return true;
  }
  return false;
}

function RET(flag: boolean): boolean {
  if (flag) {
    CPU.pc = Memory.readWord(CPU.sp);
    CPU.sp = addWord(CPU.sp, 2);
    return true;
  }
  return false;
}

function RST(address: word): void {
  CPU.sp = addWord(CPU.sp, -2);
  Memory.writeWord(CPU.sp, CPU.pc);
  CPU.pc = address;
}

interface OpcodeList {
  [key: string]: Function;
}

export const OpcodeMap: OpcodeList = {
  0x00: function (): void {},

  0x01: function (): void {
    CPU.r.bc = Memory.readWord(CPU.pc);
    CPU.pc += 2;
  },

  0x02: function (): void {
    Memory.writeByte(CPU.r.bc, upper(CPU.r.af));
  },

  0x03: function (): void {
    CPU.r.bc = addWord(CPU.r.bc, 1);
  },

  0x04: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(upper(CPU.r.bc), operand);
    // perform addition
    operand = addByte(operand, upper(CPU.r.bc));
    CPU.r.bc = setUpper(CPU.r.bc, operand);

    CPU.checkZFlag(upper(CPU.r.bc));
    CPU.r.f.n = 0;
  },

  0x05: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    CPU.checkHalfCarry(upper(CPU.r.bc), operand);
    operand = addByte(operand, upper(CPU.r.bc));
    CPU.r.bc = setUpper(CPU.r.bc, operand);

    CPU.checkZFlag(upper(CPU.r.bc));
    CPU.r.f.n = 1;
  },

  0x06: function (): void {
    // load into B from pc (immediate)
    CPU.r.bc = setUpper(CPU.r.bc, toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0x07: function (): void {
    // check carry flag
    CPU.r.f.cy = upper(CPU.r.af) >> 7;
    // left shift
    const shifted: byte = upper(CPU.r.af) << 1;
    CPU.r.af = setUpper(CPU.r.af, toByte(shifted | (shifted >> 8)));
    // flag resets
    CPU.r.f.n = 0;
    CPU.r.f.h = 0;
    CPU.r.f.z = 0;
  },

  0x08: function (): void {
    Memory.writeWord(Memory.readWord(CPU.pc), CPU.sp);
  },

  0x09: function (): void {
    CPU.checkFullCarry16(CPU.r.hl, CPU.r.bc);
    CPU.checkHalfCarry(upper(CPU.r.hl), upper(CPU.r.bc));
    CPU.r.hl = addWord(CPU.r.hl, CPU.r.bc);
    CPU.r.f.n = 0;
  },

  0x0a: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(Memory.readByte(CPU.r.bc)));
  },

  0x0b: function (): void {
    CPU.r.bc = addWord(CPU.r.bc, -1);
  },

  0x0c: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(lower(CPU.r.bc), operand);
    // perform addition
    operand = addByte(operand, lower(CPU.r.bc));
    CPU.r.bc = setLower(CPU.r.bc, operand);

    CPU.checkZFlag(lower(CPU.r.bc));
    CPU.r.f.n = 0;
  },

  0x0d: function (): void {
    debugger;
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(lower(CPU.r.bc), operand);
    // perform addition
    operand = addByte(operand, lower(CPU.r.bc));
    CPU.r.bc = setLower(CPU.r.bc, operand);

    CPU.checkZFlag(lower(CPU.r.bc));
    CPU.r.f.n = 1;
  },

  0x0e: function (): void {
    // load into C from pc (immediate)
    CPU.r.bc = setLower(CPU.r.bc, toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0x0f: function (): void {
    // check carry flag
    const bitZero = upper(CPU.r.af) & 1;
    CPU.r.f.cy = bitZero;
    // right shift
    const shifted: byte = upper(CPU.r.af) >> 1;
    CPU.r.af = setUpper(CPU.r.af, toByte(shifted | (bitZero << 7)));
    // flag resets
    CPU.r.f.n = 0;
    CPU.r.f.h = 0;
    CPU.r.f.z = 0;
  },

  0x10: function (): void {
    console.log('Instruction halted.');
    throw new Error();
  },

  0x11: function (): void {
    CPU.r.de = Memory.readWord(CPU.pc);
    CPU.pc += 2;
  },

  0x12: function (): void {
    Memory.writeByte(CPU.r.de, upper(CPU.r.af));
  },

  0x13: function (): void {
    CPU.r.de = addWord(CPU.r.de, 1);
  },

  0x14: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(upper(CPU.r.de), operand);
    // perform addition
    operand = addByte(operand, upper(CPU.r.de));
    CPU.r.de = setUpper(CPU.r.de, operand);

    CPU.checkZFlag(upper(CPU.r.de));
    CPU.r.f.n = 0;
  },

  0x15: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(upper(CPU.r.de), operand);
    // perform addition
    operand = addByte(operand, upper(CPU.r.de));
    CPU.r.de = setUpper(CPU.r.de, operand);

    CPU.checkZFlag(upper(CPU.r.de));
    CPU.r.f.n = 1;
  },

  0x16: function (): void {
    CPU.r.de = setUpper(CPU.r.de, toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0x17: function (): void {
    // need to rotate left through the carry flag
    // get the old carry value
    const oldCY = CPU.r.f.cy;
    // set the carry flag to the 7th bit of A
    CPU.r.f.cy = upper(CPU.r.af) >> 7;
    // rotate left
    const shifted = upper(CPU.r.af) << 1;
    // combine old flag and shifted, set to A
    CPU.r.af = setUpper(CPU.r.af, toByte(shifted | oldCY));
    CPU.r.f.h = 0;
    CPU.r.f.n = 0;
    CPU.r.f.z = 0;
  },

  0x18: function (): void {
    CPU.pc = addWord(CPU.pc, toSigned(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0x19: function (): void {
    CPU.checkFullCarry16(CPU.r.hl, CPU.r.de);
    CPU.checkHalfCarry(upper(CPU.r.hl), upper(CPU.r.de));
    CPU.r.hl = addWord(CPU.r.hl, CPU.r.de);
    CPU.r.f.n = 0;
  },

  0x1a: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(Memory.readByte(CPU.r.de)));
  },

  0x1b: function (): void {
    CPU.r.de = addWord(CPU.r.de, -1);
  },

  0x1c: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(lower(CPU.r.de), operand);
    // perform addition
    operand = addByte(operand, lower(CPU.r.de));
    CPU.r.de = setLower(CPU.r.de, operand);

    CPU.checkZFlag(lower(CPU.r.de));
    CPU.r.f.n = 0;
  },

  0x1d: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(lower(CPU.r.de), operand);
    // perform addition
    operand = addByte(operand, lower(CPU.r.de));
    CPU.r.de = setLower(CPU.r.de, operand);

    CPU.checkZFlag(lower(CPU.r.de));
    CPU.r.f.n = 1;
  },

  0x1e: function (): void {
    CPU.r.de = setLower(CPU.r.de, toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0x1f: function (): void {
    // rotate right through the carry flag
    // get the old carry value
    const oldCY = CPU.r.f.cy;
    // set the carry flag to the 0th bit of A
    CPU.r.f.cy = upper(CPU.r.af) & 1;
    // rotate right
    const shifted = upper(CPU.r.af) >> 1;
    // combine old flag and shifted, set to A
    CPU.r.af = setUpper(CPU.r.af, toByte(shifted | (oldCY << 7)));
    CPU.r.f.h = 0;
    CPU.r.f.n = 0;
    CPU.r.f.z = 0;
  },

  0x20: function (): boolean {
    const incr = toSigned(Memory.readByte(CPU.pc));
    CPU.pc += 1;
    if (!CPU.r.f.z) {
      // increment pc if zero flag was reset
      CPU.pc = addWord(CPU.pc, incr);
      return true;
    }
    return false;
  },

  0x21: function (): void {
    CPU.r.hl = Memory.readWord(CPU.pc);
    CPU.pc += 2;
  },

  0x22: function (): void {
    Memory.writeByte(CPU.r.hl, upper(CPU.r.af));
    CPU.r.hl = addWord(CPU.r.hl, 1);
  },

  0x23: function (): void {
    CPU.r.hl = addWord(CPU.r.hl, 1);
  },

  0x24: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(upper(CPU.r.hl), operand);
    // perform addition
    operand = addByte(operand, upper(CPU.r.hl));
    CPU.r.hl = setUpper(CPU.r.hl, operand);

    CPU.checkZFlag(operand);
    CPU.r.f.n = 0;
  },

  0x25: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    CPU.checkHalfCarry(upper(CPU.r.hl), operand);
    // perform addition
    operand = addByte(operand, upper(CPU.r.hl));
    CPU.r.hl = setUpper(CPU.r.hl, operand);

    CPU.checkZFlag(operand);
    CPU.r.f.n = 1;
  },

  0x26: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  /**
   * DAA instruction taken from - https://forums.nesdev.com/viewtopic.php?t=15944#p196282
   */
  0x27: function (): void {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    if (!CPU.r.f.n) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (CPU.r.f.cy || upper(CPU.r.af) > 0x99) {
        CPU.r.af = addUpper(CPU.r.af, 0x60);
        CPU.r.f.cy = 1;
      }
      if (CPU.r.f.h || (upper(CPU.r.af) & 0x0f) > 0x09) {
        CPU.r.af = addUpper(CPU.r.af, 0x6);
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (CPU.r.f.cy) {
        CPU.r.af = addUpper(CPU.r.af, -0x60);
      }
      if (CPU.r.f.h) {
        CPU.r.af = addUpper(CPU.r.af, -0x6);
      }
    }
    // these flags are always updated
    CPU.checkZFlag(upper(CPU.r.af));
    CPU.r.f.h = 0; // h flag is always cleared
  },

  0x28: function (): boolean {
    const incr = toSigned(Memory.readByte(CPU.pc));
    // increment pc if zero flag was set
    if (CPU.r.f.z) {
      CPU.pc = addWord(CPU.pc, incr);
      return true;
    }
    return false;
  },

  0x29: function (): void {
    CPU.checkFullCarry16(CPU.r.hl, CPU.r.hl);
    CPU.checkHalfCarry(upper(CPU.r.hl), upper(CPU.r.hl));
    CPU.r.hl = addWord(CPU.r.hl, CPU.r.hl);
    CPU.r.f.n = 0;
  },

  0x2a: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(Memory.readByte(CPU.r.hl)));
    CPU.r.hl = addWord(CPU.r.hl, 1);
  },

  0x2b: function (): void {
    CPU.r.hl = addWord(CPU.r.hl, -1);
  },

  0x2c: function (): void {
    let operand: byte = toByte(1);
    CPU.checkHalfCarry(lower(CPU.r.hl), operand);
    operand = addByte(operand, lower(CPU.r.hl));
    setLower(CPU.r.hl, operand);
    CPU.checkZFlag(operand);
    CPU.r.f.n = 0;
  },

  0x2d: function (): void {
    let operand: byte = toByte(-1);
    CPU.checkHalfCarry(lower(CPU.r.hl), operand);
    operand = addByte(operand, lower(CPU.r.hl));
    setLower(CPU.r.hl, operand);
    CPU.checkZFlag(operand);
    CPU.r.f.n = 1;
  },

  0x2e: function (): void {
    setLower(CPU.r.hl, toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0x2f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(~upper(CPU.r.af)));
    CPU.r.f.n = 1;
    CPU.r.f.h = 1;
  },

  0x30: function (): boolean {
    const incr = toSigned(Memory.readByte(CPU.pc));
    if (!CPU.r.f.cy) {
      CPU.pc = addWord(CPU.pc, incr);
      return true;
    }
    return false;
  },

  0x31: function (): void {
    CPU.sp = Memory.readWord(CPU.pc);
    CPU.pc += 2;
  },

  0x32: function (): void {
    Memory.writeByte(CPU.r.hl, upper(CPU.r.af));
    CPU.r.hl = addWord(CPU.r.hl, -1);
  },

  0x33: function (): void {
    CPU.sp = addWord(CPU.sp, 1);
  },

  0x34: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    const newVal: byte = toByte(Memory.readByte(CPU.r.hl));
    // check for half carry on affected byte only
    CPU.checkHalfCarry(newVal, operand);
    operand = addByte(operand, newVal);
    Memory.writeByte(CPU.r.hl, operand);

    CPU.checkZFlag(operand);
    CPU.r.f.n = 0;
  },

  0x35: function (): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    const newVal: byte = toByte(Memory.readByte(CPU.r.hl));
    // check for half carry on affected byte only
    CPU.checkHalfCarry(newVal, operand);
    operand = addByte(operand, newVal);
    Memory.writeByte(CPU.r.hl, operand);

    CPU.checkZFlag(operand);
    CPU.r.f.n = 1;
  },

  0x36: function (): void {
    Memory.writeByte(CPU.r.hl, toByte(Memory.readByte(CPU.pc)));
  },

  0x37: function (): void {
    CPU.r.f.cy = 1;
    CPU.r.f.n = 0;
    CPU.r.f.h = 0;
  },

  0x38: function (): boolean {
    const incr = toSigned(Memory.readByte(CPU.pc));
    CPU.pc += 1;
    if (CPU.r.f.cy) {
      CPU.pc = addWord(CPU.pc, incr);
      return true;
    }
    return false;
  },

  0x39: function (): void {
    CPU.checkFullCarry16(CPU.r.hl, CPU.sp);
    CPU.checkHalfCarry(upper(CPU.r.hl), upper(CPU.sp));
    CPU.r.hl = addWord(CPU.r.hl, CPU.sp);
    CPU.r.f.n = 0;
  },

  0x3a: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(Memory.readByte(CPU.r.hl)));
    CPU.r.hl = addWord(CPU.r.hl, -1);
  },

  0x3b: function (): void {
    CPU.sp = addWord(CPU.sp, -1);
  },

  0x3c: function (): void {
    let operand: byte = toByte(1);
    CPU.checkHalfCarry(upper(CPU.r.af), operand);
    operand = addByte(operand, upper(CPU.r.af));
    CPU.r.af = setUpper(CPU.r.af, operand);
    CPU.checkZFlag(operand);
    CPU.r.f.n = 0;
  },

  0x3d: function (): void {
    let operand: byte = toByte(-1);
    CPU.checkHalfCarry(upper(CPU.r.af), operand);
    operand = addByte(operand, upper(CPU.r.af));
    CPU.r.af = setUpper(CPU.r.af, operand);
    CPU.checkZFlag(operand);
    CPU.r.f.n = 1;
  },

  0x3e: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0x3f: function (): void {
    if (CPU.r.f.cy) {
      CPU.r.f.cy = 0;
    } else {
      CPU.r.f.cy = 1;
    }
    CPU.r.f.n = 0;
    CPU.r.f.h = 0;
  },

  0x40: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, upper(CPU.r.bc));
  },

  0x41: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, lower(CPU.r.bc));
  },

  0x42: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, upper(CPU.r.de));
  },

  0x43: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, lower(CPU.r.de));
  },

  0x44: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, upper(CPU.r.hl));
  },

  0x45: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, lower(CPU.r.hl));
  },

  0x46: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, toByte(Memory.readByte(CPU.r.hl)));
  },

  0x47: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, upper(CPU.r.af));
  },

  0x48: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, upper(CPU.r.bc));
  },

  0x49: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, lower(CPU.r.bc));
  },

  0x4a: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, upper(CPU.r.de));
  },

  0x4b: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, lower(CPU.r.de));
  },

  0x4c: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, upper(CPU.r.hl));
  },

  0x4d: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, lower(CPU.r.hl));
  },

  0x4e: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, toByte(Memory.readByte(CPU.r.hl)));
  },

  0x4f: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, upper(CPU.r.af));
  },

  0x50: function (): void {
    CPU.r.de = setUpper(CPU.r.de, upper(CPU.r.bc));
  },

  0x51: function (): void {
    CPU.r.de = setUpper(CPU.r.de, lower(CPU.r.bc));
  },

  0x52: function (): void {
    CPU.r.de = setUpper(CPU.r.de, upper(CPU.r.de));
  },

  0x53: function (): void {
    CPU.r.de = setUpper(CPU.r.de, lower(CPU.r.de));
  },

  0x54: function (): void {
    CPU.r.de = setUpper(CPU.r.de, upper(CPU.r.hl));
  },

  0x55: function (): void {
    CPU.r.de = setUpper(CPU.r.de, lower(CPU.r.hl));
  },

  0x56: function (): void {
    CPU.r.de = setUpper(CPU.r.de, toByte(Memory.readByte(CPU.r.hl)));
  },

  0x57: function (): void {
    CPU.r.de = setUpper(CPU.r.de, upper(CPU.r.af));
  },

  0x58: function (): void {
    CPU.r.de = setLower(CPU.r.de, upper(CPU.r.bc));
  },

  0x59: function (): void {
    CPU.r.de = setLower(CPU.r.de, upper(CPU.r.bc));
  },

  0x5a: function (): void {
    CPU.r.de = setLower(CPU.r.de, upper(CPU.r.de));
  },

  0x5b: function (): void {
    CPU.r.de = setLower(CPU.r.de, lower(CPU.r.de));
  },

  0x5c: function (): void {
    CPU.r.de = setLower(CPU.r.de, upper(CPU.r.hl));
  },

  0x5d: function (): void {
    CPU.r.de = setLower(CPU.r.de, lower(CPU.r.hl));
  },

  0x5e: function (): void {
    CPU.r.de = setLower(CPU.r.de, toByte(Memory.readByte(CPU.r.hl)));
  },

  0x5f: function (): void {
    CPU.r.de = setLower(CPU.r.de, upper(CPU.r.af));
  },

  0x60: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, upper(CPU.r.bc));
  },

  0x61: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, lower(CPU.r.bc));
  },

  0x62: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, upper(CPU.r.de));
  },

  0x63: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, lower(CPU.r.de));
  },

  0x64: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, upper(CPU.r.hl));
  },

  0x65: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, lower(CPU.r.hl));
  },

  0x66: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, toByte(Memory.readByte(CPU.r.hl)));
  },

  0x67: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, upper(CPU.r.af));
  },

  0x68: function (): void {
    setLower(CPU.r.hl, upper(CPU.r.bc));
  },

  0x69: function (): void {
    setLower(CPU.r.hl, lower(CPU.r.bc));
  },

  0x6a: function (): void {
    setLower(CPU.r.hl, upper(CPU.r.de));
  },

  0x6b: function (): void {
    setLower(CPU.r.hl, lower(CPU.r.de));
  },

  0x6c: function (): void {
    setLower(CPU.r.hl, upper(CPU.r.hl));
  },

  0x6d: function (): void {
    setLower(CPU.r.hl, lower(CPU.r.hl));
  },

  0x6e: function (): void {
    setLower(CPU.r.hl, toByte(Memory.readByte(CPU.r.hl)));
  },

  0x6f: function (): void {
    setLower(CPU.r.hl, upper(CPU.r.af));
  },

  0x70: function (): void {
    Memory.writeByte(CPU.r.hl, upper(CPU.r.bc));
  },

  0x71: function (): void {
    Memory.writeByte(CPU.r.hl, lower(CPU.r.bc));
  },

  0x72: function (): void {
    Memory.writeByte(CPU.r.hl, upper(CPU.r.de));
  },

  0x73: function (): void {
    Memory.writeByte(CPU.r.hl, lower(CPU.r.de));
  },

  0x74: function (): void {
    Memory.writeByte(CPU.r.hl, upper(CPU.r.hl));
  },

  0x75: function (): void {
    Memory.writeByte(CPU.r.hl, lower(CPU.r.hl));
  },

  0x76: function (): void {
    CPU.halted = true;
  },

  0x77: function (): void {
    Memory.writeByte(CPU.r.hl, upper(CPU.r.af));
  },

  0x78: function (): void {
    CPU.r.af = setUpper(CPU.r.af, upper(CPU.r.bc));
  },

  0x79: function (): void {
    CPU.r.af = setUpper(CPU.r.af, lower(CPU.r.bc));
  },

  0x7a: function (): void {
    CPU.r.af = setUpper(CPU.r.af, upper(CPU.r.de));
  },

  0x7b: function (): void {
    CPU.r.af = setUpper(CPU.r.af, lower(CPU.r.de));
  },

  0x7c: function (): void {
    CPU.r.af = setUpper(CPU.r.af, upper(CPU.r.hl));
  },

  0x7d: function (): void {
    CPU.r.af = setUpper(CPU.r.af, lower(CPU.r.hl));
  },

  0x7e: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(Memory.readByte(CPU.r.hl)));
  },

  0x7f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, upper(CPU.r.af));
  },

  0x80: function (): void {
    ADD.call(upper(CPU.r.bc));
  },

  0x81: function (): void {
    ADD.call(lower(CPU.r.bc));
  },

  0x82: function (): void {
    ADD.call(upper(CPU.r.de));
  },

  0x83: function (): void {
    ADD.call(lower(CPU.r.de));
  },

  0x84: function (): void {
    ADD.call(upper(CPU.r.hl));
  },

  0x85: function (): void {
    ADD.call(lower(CPU.r.hl));
  },

  0x86: function (): void {
    ADD.call(toByte(Memory.readByte(CPU.r.hl)));
  },

  0x87: function (): void {
    ADD.call(upper(CPU.r.af));
  },

  0x88: function (): void {
    ADC.call(upper(CPU.r.bc));
  },

  0x89: function (): void {
    ADC.call(lower(CPU.r.bc));
  },

  0x8a: function (): void {
    ADC.call(upper(CPU.r.de));
  },

  0x8b: function (): void {
    ADC.call(lower(CPU.r.de));
  },

  0x8c: function (): void {
    ADC.call(upper(CPU.r.hl));
  },

  0x8d: function (): void {
    ADC.call(lower(CPU.r.hl));
  },

  0x8e: function (): void {
    ADC.call(toByte(Memory.readByte(CPU.r.hl)));
  },

  0x8f: function (): void {
    ADC.call(upper(CPU.r.af));
  },

  0x90: function (): void {
    SUB.call(upper(CPU.r.bc));
  },

  0x91: function (): void {
    SUB.call(lower(CPU.r.bc));
  },

  0x92: function (): void {
    SUB.call(upper(CPU.r.de));
  },

  0x93: function (): void {
    SUB.call(lower(CPU.r.de));
  },

  0x94: function (): void {
    SUB.call(upper(CPU.r.hl));
  },

  0x95: function (): void {
    SUB.call(lower(CPU.r.hl));
  },

  0x96: function (): void {
    SUB.call(toByte(Memory.readByte(CPU.r.hl)));
  },

  0x97: function (): void {
    SUB.call(upper(CPU.r.af));
  },

  0x98: function (): void {
    SBC.call(upper(CPU.r.bc));
  },

  0x99: function (): void {
    SBC.call(lower(CPU.r.bc));
  },

  0x9a: function (): void {
    SBC.call(upper(CPU.r.de));
  },

  0x9b: function (): void {
    SBC.call(lower(CPU.r.de));
  },

  0x9c: function (): void {
    SBC.call(upper(CPU.r.hl));
  },

  0x9d: function (): void {
    SBC.call(lower(CPU.r.hl));
  },

  0x9e: function (): void {
    SBC.call(toByte(Memory.readByte(CPU.r.hl)));
  },

  0x9f: function (): void {
    SBC.call(upper(CPU.r.af));
  },

  0xa0: function (): void {
    AND.call(upper(CPU.r.bc));
  },

  0xa1: function (): void {
    AND.call(lower(CPU.r.bc));
  },

  0xa2: function (): void {
    AND.call(upper(CPU.r.de));
  },

  0xa3: function (): void {
    AND.call(lower(CPU.r.de));
  },

  0xa4: function (): void {
    AND.call(upper(CPU.r.hl));
  },

  0xa5: function (): void {
    AND.call(lower(CPU.r.hl));
  },

  0xa6: function (): void {
    AND.call(Memory.readByte(CPU.r.hl));
  },

  0xa7: function (): void {
    AND.call(upper(CPU.r.af));
  },

  0xa8: function (): void {
    XOR.call(upper(CPU.r.bc));
  },

  0xa9: function (): void {
    XOR.call(lower(CPU.r.bc));
  },

  0xaa: function (): void {
    XOR.call(upper(CPU.r.de));
  },

  0xab: function (): void {
    XOR.call(lower(CPU.r.de));
  },

  0xac: function (): void {
    XOR.call(upper(CPU.r.hl));
  },

  0xad: function (): void {
    XOR.call(lower(CPU.r.hl));
  },

  0xae: function (): void {
    XOR.call(Memory.readByte(CPU.r.hl));
  },

  0xaf: function (): void {
    XOR.call(upper(CPU.r.af));
  },

  0xb0: function (): void {
    OR.call(upper(CPU.r.bc));
  },

  0xb1: function (): void {
    OR.call(lower(CPU.r.bc));
  },

  0xb2: function (): void {
    OR.call(upper(CPU.r.de));
  },

  0xb3: function (): void {
    OR.call(lower(CPU.r.de));
  },

  0xb4: function (): void {
    OR.call(upper(CPU.r.hl));
  },

  0xb5: function (): void {
    OR.call(lower(CPU.r.hl));
  },

  0xb6: function (): void {
    OR.call(Memory.readByte(CPU.r.hl));
  },

  0xb7: function (): void {
    OR.call(upper(CPU.r.af));
  },

  0xb8: function (): void {
    CP.call(upper(CPU.r.bc));
  },

  0xb9: function (): void {
    CP.call(lower(CPU.r.bc));
  },

  0xba: function (): void {
    CP.call(upper(CPU.r.de));
  },

  0xbb: function (): void {
    CP.call(lower(CPU.r.de));
  },

  0xbc: function (): void {
    CP.call(upper(CPU.r.hl));
  },

  0xbd: function (): void {
    CP.call(lower(CPU.r.hl));
  },

  0xbe: function (): void {
    CP.call(toByte(Memory.readByte(CPU.r.hl)));
  },

  0xbf: function (): void {
    CP.call(upper(CPU.r.af));
  },

  0xc0: function (): boolean {
    return RET.call(!CPU.r.f.z);
  },

  0xc1: function (): void {
    POP.call(CPU.r.bc);
  },

  0xc2: function (): boolean {
    if (Jpcc.call(!CPU.r.f.z)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xc3: function (): void {
    CPU.pc = Memory.readWord(CPU.pc);
  },

  0xc4: function (): boolean {
    if (CALL.call(!CPU.r.f.z)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xc5: function (): void {
    PUSH.call(CPU.r.bc);
  },

  0xc6: function (): void {
    const value = toByte(Memory.readByte(CPU.pc));
    CPU.checkFullCarry8(upper(CPU.r.af), value);
    CPU.checkHalfCarry(upper(CPU.r.af), value);
    CPU.r.af = addUpper(CPU.r.af, value);
    CPU.checkZFlag(upper(CPU.r.af));
    CPU.pc += 1;
    CPU.r.f.n = 0;
  },

  0xc7: function (): void {
    RST.call(0x00);
  },

  0xc8: function (): boolean {
    if (CPU.r.f.z) {
      const address: word = Memory.readWord(CPU.sp);
      CPU.pc = address;
      CPU.sp = addWord(CPU.sp, 2);
      return true;
    }
    return false;
  },

  0xc9: function (): void {
    RET.call(true);
  },

  0xca: function (): boolean {
    if (Jpcc.call(CPU.r.f.z)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xcb: function (): void {
    const opcode: byte = Memory.readByte(CPU.pc);
    console.log(opcode);
    cbMap[opcode].call(CPU);
    CPU.pc += 1;
  },

  0xcc: function (): boolean {
    if (CALL.call(CPU.r.f.z)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xcd: function (): void {
    CALL.call(true);
  },

  0xce: function (): void {
    ADC.call(toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0xcf: function (): void {
    RST.call(0x08);
  },

  0xd0: function (): boolean {
    return RET.call(!CPU.r.f.cy);
  },

  0xd1: function (): void {
    POP.call(CPU.r.de);
  },

  0xd2: function (): boolean {
    if (Jpcc.call(CPU.r.f.z)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xd3: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xd4: function (): boolean {
    if (CALL.call(!CPU.r.f.cy)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xd5: function (): void {
    PUSH.call(CPU.r.de);
  },

  0xd6: function (): void {
    SUB.call(toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0xd7: function (): void {
    RST.call(0x10);
  },

  0xd8: function (): void {
    return RET.call(CPU.r.f.cy);
  },

  0xd9: function (): void {
    RET.call(true);
    CPU.setInterruptsEnabled(true);
  },

  0xda: function (): boolean {
    if (Jpcc.call(CPU.r.f.cy)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xdb: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xdc: function (): boolean {
    if (CALL.call(CPU.r.f.cy)) {
      return true;
    }
    CPU.pc += 2;
    return false;
  },

  0xdd: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xde: function (): void {
    SBC.call(toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0xdf: function (): void {
    RST.call(0x18);
  },

  0xe0: function (): void {
    Memory.writeByte(0xff00 + Memory.readByte(CPU.pc), upper(CPU.r.af));
    CPU.pc += 1;
  },

  0xe1: function (): void {
    POP.call(CPU.r.hl);
  },

  0xe2: function (): void {
    Memory.writeByte(0xff00 + lower(CPU.r.bc), upper(CPU.r.af));
  },

  0xe3: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xe4: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xe5: function (): void {
    PUSH.call(CPU.r.hl);
  },

  0xe6: function (): void {
    AND.call(Memory.readByte(CPU.pc));
    CPU.pc += 1;
  },

  0xe7: function (): void {
    RST.call(0x20);
  },

  0xe8: function (): void {
    const operand = toWord(toSigned(Memory.readByte(CPU.pc)));
    CPU.checkFullCarry16(CPU.sp, operand);
    CPU.checkHalfCarry(upper(CPU.sp), upper(operand));
    CPU.sp = addWord(CPU.sp, operand);
    CPU.pc += 1;
    CPU.r.f.z = 0;
    CPU.r.f.n = 0;
  },

  0xe9: function (): void {
    CPU.pc = CPU.r.hl;
  },

  0xea: function (): void {
    Memory.writeByte(Memory.readWord(CPU.pc), upper(CPU.r.af));
    CPU.pc += 2;
  },

  0xeb: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xec: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xed: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xee: function (): void {
    XOR.call(toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0xef: function (): void {
    RST.call(0x28);
  },

  0xf0: function (): void {
    const data = toByte(Memory.readByte(0xff00 + Memory.readByte(CPU.pc)));
    CPU.r.af = setUpper(CPU.r.af, data);
    CPU.pc += 1;
  },

  0xf1: function (): void {
    POP.call(CPU.r.af);
  },

  0xf2: function (): void {
    const data = toByte(0xff00 + lower(CPU.r.bc));
    CPU.r.af = setUpper(CPU.r.af, data);
  },

  0xf3: function (): void {
    CPU.setInterruptsEnabled(false);
  },

  0xf4: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xf5: function (): void {
    PUSH.call(CPU.r.af);
  },

  0xf6: function (): void {
    OR.call(Memory.readByte(CPU.pc));
    CPU.pc += 1;
  },

  0xf7: function (): void {
    RST.call(0x30);
  },

  0xf8: function (): void {
    let incr = toWord(toSigned(Memory.readByte(CPU.pc)));
    CPU.checkHalfCarry(upper(incr), upper(CPU.sp));
    CPU.checkFullCarry16(incr, CPU.sp);
    CPU.pc += 1;
    incr = addWord(incr, CPU.sp);
    CPU.r.hl = incr;
    CPU.r.f.z = 0;
    CPU.r.f.n = 0;
  },

  0xf9: function (): void {
    CPU.sp = CPU.r.hl;
  },

  0xfa: function (): void {
    CPU.r.af = setUpper(CPU.r.af, toByte(Memory.readByte(Memory.readWord(CPU.pc))));
    CPU.pc += 2;
  },

  0xfb: function (): void {
    CPU.setInterruptsEnabled(true);
  },

  0xfc: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xfd: function (): void {
    throw new Error('Tried to call illegal opcode.');
  },

  0xfe: function (): void {
    CP.call(toByte(Memory.readByte(CPU.pc)));
    CPU.pc += 1;
  },

  0xff: function (): void {
    RST.call(0x38);
  },
};

function RLCn(reg: byte): byte {
  CPU.r.f.cy = reg >> 7;
  const shifted: byte = reg << 1;
  const result: byte = toByte(shifted | (shifted >> 8));
  CPU.checkZFlag(result);
  CPU.r.f.n = 0;
  CPU.r.f.h = 0;
  return result;
}

function RLn(reg: byte): byte {
  const oldCY = CPU.r.f.cy;
  CPU.r.f.cy = reg >> 7;
  const shifted = reg << 1;
  const result = toByte(shifted | oldCY);
  CPU.checkZFlag(result);
  CPU.r.f.h = 0;
  CPU.r.f.n = 0;
  return result;
}

function RRCn(reg: byte): byte {
  const bitZero = reg & 1;
  CPU.r.f.cy = bitZero;
  const shifted: byte = reg >> 1;
  const result: byte = toByte(shifted | (bitZero << 7));
  CPU.checkZFlag(result);
  CPU.r.f.n = 0;
  CPU.r.f.h = 0;
  return result;
}

function RRn(reg: byte): byte {
  const oldCY = CPU.r.f.cy;
  CPU.r.f.cy = reg & 1;
  const shifted = reg >> 1;
  const result: byte = toByte(shifted | (oldCY << 7));
  CPU.checkZFlag(result);
  CPU.r.f.h = 0;
  CPU.r.f.n = 0;
  return result;
}

function SLAn(reg: byte): byte {
  CPU.r.f.cy = reg >> 7;
  const result = toByte(reg << 1);
  CPU.checkZFlag(result);
  CPU.r.f.h = 0;
  CPU.r.f.n = 0;
  return result;
}

function SRAn(reg: byte): byte {
  CPU.r.f.cy = reg & 1;
  // shift to right, but keep the most sig bit
  const msb: byte = reg >> 7;
  const result: byte = (reg >> 1) | msb;
  CPU.checkZFlag(result);
  CPU.r.f.h = 0;
  CPU.r.f.n = 0;
  return result;
}

function SRLn(reg: byte): byte {
  CPU.r.f.cy = reg & 1;
  const result: byte = reg >> 1;
  CPU.checkZFlag(result);
  CPU.r.f.h = 0;
  CPU.r.f.n = 0;
  return result;
}

function BIT(bit: number, reg: byte): void {
  CPU.checkZFlag((reg >> bit) & 1);
  CPU.r.f.n = 0;
  CPU.r.f.h = 1;
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

function SWAP(reg: byte) {
  const upper = reg >> 4;
  const lower = reg & 0xf;
  const result = (lower << 4) | upper;
  CPU.checkZFlag(result);
  return result;
}

const cbMap: OpcodeList = {
  0x00: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RLCn.call(upper(CPU.r.bc)));
  },
  0x01: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RLCn.call(lower(CPU.r.bc)));
  },
  0x02: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RLCn.call(upper(CPU.r.de)));
  },
  0x03: function (): void {
    CPU.r.de = setLower(CPU.r.de, RLCn.call(lower(CPU.r.de)));
  },
  0x04: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RLCn.call(upper(CPU.r.hl)));
  },
  0x05: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RLCn.call(lower(CPU.r.hl)));
  },
  0x06: function (): void {
    Memory.writeByte(CPU.r.hl, RLCn.call(Memory.readByte(CPU.r.hl)));
  },
  0x07: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RLCn.call(upper(CPU.r.af)));
  },
  0x08: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RRCn.call(upper(CPU.r.bc)));
  },
  0x09: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RRCn.call(lower(CPU.r.bc)));
  },
  0x0a: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RRCn.call(upper(CPU.r.de)));
  },
  0x0b: function (): void {
    CPU.r.de = setLower(CPU.r.de, RRCn.call(lower(CPU.r.de)));
  },
  0x0c: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RRCn.call(upper(CPU.r.hl)));
  },
  0x0d: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RRCn.call(lower(CPU.r.hl)));
  },
  0x0e: function (): void {
    Memory.writeByte(CPU.r.hl, RRCn.call(Memory.readByte(CPU.r.hl)));
  },
  0x0f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RRCn.call(upper(CPU.r.af)));
  },
  0x10: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RLn.call(upper(CPU.r.bc)));
  },
  0x11: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RLn.call(lower(CPU.r.bc)));
  },
  0x12: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RLn.call(upper(CPU.r.de)));
  },
  0x13: function (): void {
    CPU.r.de = setLower(CPU.r.de, RLn.call(lower(CPU.r.de)));
  },
  0x14: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RLn.call(upper(CPU.r.hl)));
  },
  0x15: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RLn.call(lower(CPU.r.hl)));
  },
  0x16: function (): void {
    Memory.writeByte(CPU.r.hl, RLn.call(Memory.readByte(CPU.r.hl)));
  },
  0x17: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RLn.call(upper(CPU.r.af)));
  },
  0x18: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RLn.call(upper(CPU.r.bc)));
  },
  0x19: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RRn.call(lower(CPU.r.bc)));
  },
  0x1a: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RRn.call(upper(CPU.r.de)));
  },
  0x1b: function (): void {
    CPU.r.de = setLower(CPU.r.de, RRn.call(lower(CPU.r.de)));
  },
  0x1c: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RRn.call(upper(CPU.r.hl)));
  },
  0x1d: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RRn.call(lower(CPU.r.hl)));
  },
  0x1e: function (): void {
    Memory.writeByte(CPU.r.hl, RRn.call(Memory.readByte(CPU.r.hl)));
  },
  0x1f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RRn.call(upper(CPU.r.af)));
  },
  0x20: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SLAn.call(upper(CPU.r.bc)));
  },
  0x21: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SLAn.call(lower(CPU.r.bc)));
  },
  0x22: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SLAn.call(upper(CPU.r.de)));
  },
  0x23: function (): void {
    CPU.r.de = setLower(CPU.r.de, SLAn.call(lower(CPU.r.de)));
  },
  0x24: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SLAn.call(upper(CPU.r.hl)));
  },
  0x25: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SLAn.call(lower(CPU.r.hl)));
  },
  0x26: function (): void {
    Memory.writeByte(CPU.r.hl, SLAn.call(Memory.readByte(CPU.r.hl)));
  },
  0x27: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SLAn.call(upper(CPU.r.af)));
  },
  0x28: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SRAn.call(upper(CPU.r.bc)));
  },
  0x29: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SRAn.call(lower(CPU.r.bc)));
  },
  0x2a: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SRAn.call(upper(CPU.r.de)));
  },
  0x2b: function (): void {
    CPU.r.de = setLower(CPU.r.de, SRAn.call(lower(CPU.r.de)));
  },
  0x2c: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SRAn.call(upper(CPU.r.hl)));
  },
  0x2d: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SRAn.call(lower(CPU.r.hl)));
  },
  0x2e: function (): void {
    Memory.writeByte(CPU.r.hl, SRAn.call(Memory.readByte(CPU.r.hl)));
  },
  0x2f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SRAn.call(upper(CPU.r.af)));
  },
  0x30: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SWAP.call(upper(CPU.r.bc)));
  },
  0x31: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SWAP.call(lower(CPU.r.bc)));
  },
  0x32: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SWAP.call(upper(CPU.r.de)));
  },
  0x33: function (): void {
    CPU.r.de = setLower(CPU.r.de, SWAP.call(lower(CPU.r.de)));
  },
  0x34: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SWAP.call(upper(CPU.r.hl)));
  },
  0x35: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SWAP.call(lower(CPU.r.hl)));
  },
  0x36: function (): void {
    Memory.writeByte(CPU.r.hl, SWAP.call(Memory.readByte(CPU.r.hl)));
  },
  0x37: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SWAP.call(upper(CPU.r.af)));
  },
  0x38: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SRLn.call(upper(CPU.r.bc)));
  },
  0x39: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SRLn.call(lower(CPU.r.bc)));
  },
  0x3a: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SRLn.call(upper(CPU.r.de)));
  },
  0x3b: function (): void {
    CPU.r.de = setLower(CPU.r.de, SRLn.call(lower(CPU.r.de)));
  },
  0x3c: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SRLn.call(upper(CPU.r.hl)));
  },
  0x3d: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SRLn.call(lower(CPU.r.hl)));
  },
  0x3e: function (): void {
    Memory.writeByte(CPU.r.hl, SRLn.call(Memory.readByte(CPU.r.hl)));
  },
  0x3f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SRLn.call(upper(CPU.r.af)));
  },
  0x40: function (): void {
    BIT.call(0, upper(CPU.r.bc));
  },
  0x41: function (): void {
    BIT.call(0, lower(CPU.r.bc));
  },
  0x42: function (): void {
    BIT.call(0, upper(CPU.r.de));
  },
  0x43: function (): void {
    BIT.call(0, lower(CPU.r.de));
  },
  0x44: function (): void {
    BIT.call(0, upper(CPU.r.hl));
  },
  0x45: function (): void {
    BIT.call(0, lower(CPU.r.hl));
  },
  0x46: function (): void {
    BIT.call(0, Memory.readByte(CPU.r.hl));
  },
  0x47: function (): void {
    BIT.call(0, upper(CPU.r.af));
  },
  0x48: function (): void {
    BIT.call(1, upper(CPU.r.bc));
  },
  0x49: function (): void {
    BIT.call(1, lower(CPU.r.bc));
  },
  0x4a: function (): void {
    BIT.call(1, upper(CPU.r.de));
  },
  0x4b: function (): void {
    BIT.call(1, lower(CPU.r.de));
  },
  0x4c: function (): void {
    BIT.call(1, upper(CPU.r.hl));
  },
  0x4d: function (): void {
    BIT.call(1, lower(CPU.r.hl));
  },
  0x4e: function (): void {
    BIT.call(1, Memory.readByte(CPU.r.hl));
  },
  0x4f: function (): void {
    BIT.call(1, upper(CPU.r.af));
  },
  0x50: function (): void {
    BIT.call(2, upper(CPU.r.bc));
  },
  0x51: function (): void {
    BIT.call(2, lower(CPU.r.bc));
  },
  0x52: function (): void {
    BIT.call(2, upper(CPU.r.de));
  },
  0x53: function (): void {
    BIT.call(2, lower(CPU.r.de));
  },
  0x54: function (): void {
    BIT.call(2, upper(CPU.r.hl));
  },
  0x55: function (): void {
    BIT.call(2, lower(CPU.r.hl));
  },
  0x56: function (): void {
    BIT.call(2, Memory.readByte(CPU.r.hl));
  },
  0x57: function (): void {
    BIT.call(2, upper(CPU.r.af));
  },
  0x58: function (): void {
    BIT.call(3, upper(CPU.r.bc));
  },
  0x59: function (): void {
    BIT.call(3, lower(CPU.r.bc));
  },
  0x5a: function (): void {
    BIT.call(3, upper(CPU.r.de));
  },
  0x5b: function (): void {
    BIT.call(3, lower(CPU.r.de));
  },
  0x5c: function (): void {
    BIT.call(3, upper(CPU.r.hl));
  },
  0x5d: function (): void {
    BIT.call(3, lower(CPU.r.hl));
  },
  0x5e: function (): void {
    BIT.call(3, Memory.readByte(CPU.r.hl));
  },
  0x5f: function (): void {
    BIT.call(3, upper(CPU.r.af));
  },
  0x60: function (): void {
    BIT.call(4, upper(CPU.r.bc));
  },
  0x61: function (): void {
    BIT.call(4, lower(CPU.r.bc));
  },
  0x62: function (): void {
    BIT.call(4, upper(CPU.r.de));
  },
  0x63: function (): void {
    BIT.call(4, lower(CPU.r.de));
  },
  0x64: function (): void {
    BIT.call(4, upper(CPU.r.hl));
  },
  0x65: function (): void {
    BIT.call(4, lower(CPU.r.hl));
  },
  0x66: function (): void {
    BIT.call(4, Memory.readByte(CPU.r.hl));
  },
  0x67: function (): void {
    BIT.call(4, upper(CPU.r.af));
  },
  0x68: function (): void {
    BIT.call(5, upper(CPU.r.bc));
  },
  0x69: function (): void {
    BIT.call(5, lower(CPU.r.bc));
  },
  0x6a: function (): void {
    BIT.call(5, upper(CPU.r.de));
  },
  0x6b: function (): void {
    BIT.call(5, lower(CPU.r.de));
  },
  0x6c: function (): void {
    BIT.call(5, upper(CPU.r.hl));
  },
  0x6d: function (): void {
    BIT.call(5, lower(CPU.r.hl));
  },
  0x6e: function (): void {
    BIT.call(5, Memory.readByte(CPU.r.hl));
  },
  0x6f: function (): void {
    BIT.call(5, upper(CPU.r.af));
  },
  0x70: function (): void {
    BIT.call(6, upper(CPU.r.bc));
  },
  0x71: function (): void {
    BIT.call(6, lower(CPU.r.bc));
  },
  0x72: function (): void {
    BIT.call(6, upper(CPU.r.de));
  },
  0x73: function (): void {
    BIT.call(6, lower(CPU.r.de));
  },
  0x74: function (): void {
    BIT.call(6, upper(CPU.r.hl));
  },
  0x75: function (): void {
    BIT.call(6, lower(CPU.r.hl));
  },
  0x76: function (): void {
    BIT.call(6, Memory.readByte(CPU.r.hl));
  },
  0x77: function (): void {
    BIT.call(6, upper(CPU.r.af));
  },
  0x78: function (): void {
    BIT.call(7, upper(CPU.r.bc));
  },
  0x79: function (): void {
    BIT.call(7, lower(CPU.r.bc));
  },
  0x7a: function (): void {
    BIT.call(7, upper(CPU.r.de));
  },
  0x7b: function (): void {
    BIT.call(7, lower(CPU.r.de));
  },
  0x7c: function (): void {
    BIT.call(7, upper(CPU.r.hl));
  },
  0x7d: function (): void {
    BIT.call(7, lower(CPU.r.hl));
  },
  0x7e: function (): void {
    BIT.call(7, Memory.readByte(CPU.r.hl));
  },
  0x7f: function (): void {
    BIT.call(7, upper(CPU.r.af));
  },
  0x80: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES0.call(upper(CPU.r.bc)));
  },
  0x81: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES0.call(lower(CPU.r.bc)));
  },
  0x82: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES0.call(upper(CPU.r.de)));
  },
  0x83: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES0.call(lower(CPU.r.de)));
  },
  0x84: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES0.call(upper(CPU.r.hl)));
  },
  0x85: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES0.call(lower(CPU.r.hl)));
  },
  0x86: function (): void {
    Memory.writeByte(CPU.r.hl, RES0.call(Memory.readByte(CPU.r.hl)));
  },
  0x87: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES0.call(upper(CPU.r.af)));
  },
  0x88: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES1.call(upper(CPU.r.bc)));
  },
  0x89: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES1.call(lower(CPU.r.bc)));
  },
  0x8a: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES1.call(upper(CPU.r.de)));
  },
  0x8b: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES1.call(lower(CPU.r.de)));
  },
  0x8c: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES1.call(upper(CPU.r.hl)));
  },
  0x8d: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES1.call(lower(CPU.r.hl)));
  },
  0x8e: function (): void {
    Memory.writeByte(CPU.r.hl, RES1.call(Memory.readByte(CPU.r.hl)));
  },
  0x8f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES1.call(upper(CPU.r.af)));
  },
  0x90: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES2.call(upper(CPU.r.bc)));
  },
  0x91: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES2.call(lower(CPU.r.bc)));
  },
  0x92: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES2.call(upper(CPU.r.de)));
  },
  0x93: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES2.call(lower(CPU.r.de)));
  },
  0x94: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES2.call(upper(CPU.r.hl)));
  },
  0x95: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES2.call(lower(CPU.r.hl)));
  },
  0x96: function (): void {
    Memory.writeByte(CPU.r.hl, RES2.call(Memory.readByte(CPU.r.hl)));
  },
  0x97: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES2.call(upper(CPU.r.af)));
  },
  0x98: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES3.call(upper(CPU.r.bc)));
  },
  0x99: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES3.call(lower(CPU.r.bc)));
  },
  0x9a: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES3.call(upper(CPU.r.de)));
  },
  0x9b: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES3.call(lower(CPU.r.de)));
  },
  0x9c: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES3.call(upper(CPU.r.hl)));
  },
  0x9d: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES3.call(lower(CPU.r.hl)));
  },
  0x9e: function (): void {
    Memory.writeByte(CPU.r.hl, RES3.call(Memory.readByte(CPU.r.hl)));
  },
  0x9f: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES3.call(upper(CPU.r.af)));
  },
  0xa0: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES4.call(upper(CPU.r.bc)));
  },
  0xa1: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES4.call(lower(CPU.r.bc)));
  },
  0xa2: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES4.call(upper(CPU.r.de)));
  },
  0xa3: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES4.call(lower(CPU.r.de)));
  },
  0xa4: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES4.call(upper(CPU.r.hl)));
  },
  0xa5: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES4.call(lower(CPU.r.hl)));
  },
  0xa6: function (): void {
    Memory.writeByte(CPU.r.hl, RES4.call(Memory.readByte(CPU.r.hl)));
  },
  0xa7: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES4.call(upper(CPU.r.af)));
  },
  0xa8: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES5.call(upper(CPU.r.bc)));
  },
  0xa9: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES5.call(lower(CPU.r.bc)));
  },
  0xaa: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES5.call(upper(CPU.r.de)));
  },
  0xab: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES5.call(lower(CPU.r.de)));
  },
  0xac: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES5.call(upper(CPU.r.hl)));
  },
  0xad: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES5.call(lower(CPU.r.hl)));
  },
  0xae: function (): void {
    Memory.writeByte(CPU.r.hl, RES5.call(Memory.readByte(CPU.r.hl)));
  },
  0xaf: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES5.call(upper(CPU.r.af)));
  },
  0xb0: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES6(upper(CPU.r.bc)));
  },
  0xb1: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES6(lower(CPU.r.bc)));
  },
  0xb2: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES6(upper(CPU.r.de)));
  },
  0xb3: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES6(lower(CPU.r.de)));
  },
  0xb4: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES6(upper(CPU.r.hl)));
  },
  0xb5: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES6(lower(CPU.r.hl)));
  },
  0xb6: function (): void {
    Memory.writeByte(CPU.r.hl, RES6(Memory.readByte(CPU.r.hl)));
  },
  0xb7: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES6(upper(CPU.r.af)));
  },
  0xb8: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, RES7(upper(CPU.r.bc)));
  },
  0xb9: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, RES7(lower(CPU.r.bc)));
  },
  0xba: function (): void {
    CPU.r.de = setUpper(CPU.r.de, RES7(upper(CPU.r.de)));
  },
  0xbb: function (): void {
    CPU.r.de = setLower(CPU.r.de, RES7(lower(CPU.r.de)));
  },
  0xbc: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, RES7(upper(CPU.r.hl)));
  },
  0xbd: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, RES7(lower(CPU.r.hl)));
  },
  0xbe: function (): void {
    Memory.writeByte(CPU.r.hl, RES7(Memory.readByte(CPU.r.hl)));
  },
  0xbf: function (): void {
    CPU.r.af = setUpper(CPU.r.af, RES7(upper(CPU.r.af)));
  },
  0xc0: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(0, upper(CPU.r.bc)));
  },
  0xc1: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SET.call(0, lower(CPU.r.bc)));
  },
  0xc2: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SET.call(0, upper(CPU.r.de)));
  },
  0xc3: function (): void {
    CPU.r.de = setLower(CPU.r.de, SET.call(0, lower(CPU.r.de)));
  },
  0xc4: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(0, upper(CPU.r.hl)));
  },
  0xc5: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SET.call(0, lower(CPU.r.hl)));
  },
  0xc6: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(0, Memory.readByte(CPU.r.hl)));
  },
  0xc7: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(0, lower(CPU.r.af)));
  },
  0xc8: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(1, upper(CPU.r.bc)));
  },
  0xc9: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SET.call(1, lower(CPU.r.bc)));
  },
  0xca: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SET.call(1, upper(CPU.r.de)));
  },
  0xcb: function (): void {
    CPU.r.de = setLower(CPU.r.de, SET.call(1, lower(CPU.r.de)));
  },
  0xcc: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(1, upper(CPU.r.hl)));
  },
  0xcd: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SET.call(1, lower(CPU.r.hl)));
  },
  0xce: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(1, Memory.readByte(CPU.r.hl)));
  },
  0xcf: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(1, upper(CPU.r.af)));
  },
  0xd0: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(2, upper(CPU.r.bc)));
  },
  0xd1: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(2, lower(CPU.r.bc)));
  },
  0xd2: function (): void {
    CPU.r.de = SET.call(2, upper(CPU.r.de));
  },
  0xd3: function (): void {
    CPU.r.de = SET.call(2, lower(CPU.r.de));
  },
  0xd4: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(2, upper(CPU.r.hl)));
  },
  0xd5: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SET.call(2, lower(CPU.r.hl)));
  },
  0xd6: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(2, Memory.readByte(CPU.r.hl)));
  },
  0xd7: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(2, upper(CPU.r.af)));
  },
  0xd8: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(3, upper(CPU.r.bc)));
  },
  0xd9: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SET.call(3, lower(CPU.r.bc)));
  },
  0xda: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SET.call(3, upper(CPU.r.de)));
  },
  0xdb: function (): void {
    CPU.r.de = setLower(CPU.r.de, SET.call(3, lower(CPU.r.de)));
  },
  0xdc: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(3, upper(CPU.r.hl)));
  },
  0xdd: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SET.call(3, lower(CPU.r.hl)));
  },
  0xde: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(3, Memory.readByte(CPU.r.hl)));
  },
  0xdf: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(3, upper(CPU.r.af)));
  },
  0xe0: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(4, upper(CPU.r.bc)));
  },
  0xe1: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SET.call(4, lower(CPU.r.bc)));
  },
  0xe2: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SET.call(4, upper(CPU.r.de)));
  },
  0xe3: function (): void {
    CPU.r.de = setLower(CPU.r.de, SET.call(4, lower(CPU.r.de)));
  },
  0xe4: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(4, upper(CPU.r.hl)));
  },
  0xe5: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SET.call(4, lower(CPU.r.hl)));
  },
  0xe6: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(4, Memory.readByte(CPU.r.hl)));
  },
  0xe7: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(4, upper(CPU.r.af)));
  },
  0xe8: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(5, upper(CPU.r.bc)));
  },
  0xe9: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SET.call(5, lower(CPU.r.bc)));
  },
  0xea: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SET.call(5, upper(CPU.r.de)));
  },
  0xeb: function (): void {
    CPU.r.de = setLower(CPU.r.de, SET.call(5, lower(CPU.r.de)));
  },
  0xec: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(5, upper(CPU.r.hl)));
  },
  0xed: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(5, lower(CPU.r.hl)));
  },
  0xee: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(5, Memory.readByte(CPU.r.hl)));
  },
  0xef: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(5, upper(CPU.r.af)));
  },
  0xf0: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(6, upper(CPU.r.bc)));
  },
  0xf1: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SET.call(6, lower(CPU.r.bc)));
  },
  0xf2: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SET.call(6, upper(CPU.r.de)));
  },
  0xf3: function (): void {
    CPU.r.de = setLower(CPU.r.de, SET.call(6, lower(CPU.r.de)));
  },
  0xf4: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(6, upper(CPU.r.hl)));
  },
  0xf5: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SET.call(6, lower(CPU.r.hl)));
  },
  0xf6: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(6, Memory.readByte(CPU.r.hl)));
  },
  0xf7: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(6, upper(CPU.r.af)));
  },
  0xf8: function (): void {
    CPU.r.bc = setUpper(CPU.r.bc, SET.call(7, upper(CPU.r.bc)));
  },
  0xf9: function (): void {
    CPU.r.bc = setLower(CPU.r.bc, SET.call(7, lower(CPU.r.bc)));
  },
  0xfa: function (): void {
    CPU.r.de = setUpper(CPU.r.de, SET.call(7, upper(CPU.r.de)));
  },
  0xfb: function (): void {
    CPU.r.de = setLower(CPU.r.de, SET.call(7, lower(CPU.r.de)));
  },
  0xfc: function (): void {
    CPU.r.hl = setUpper(CPU.r.hl, SET.call(7, upper(CPU.r.hl)));
  },
  0xfd: function (): void {
    CPU.r.hl = setLower(CPU.r.hl, SET.call(7, lower(CPU.r.hl)));
  },
  0xfe: function (): void {
    Memory.writeByte(CPU.r.hl, SET.call(7, Memory.readByte(CPU.r.hl)));
  },
  0xff: function (): void {
    CPU.r.af = setUpper(CPU.r.af, SET.call(7, upper(CPU.r.af)));
  },
};
