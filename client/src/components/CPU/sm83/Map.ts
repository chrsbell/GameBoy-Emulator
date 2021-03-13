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
  addLower,
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
  this.checkFullCarry16(upper(this.r.af), operand);
  this.checkHalfCarry(upper(this.r.af), operand);
  this.r.af = addUpper(this.r.af, operand);
  this.checkZFlag(upper(this.r.af));
  this.r.f.n = 0;
}

function ADC(operand: byte): void {
  operand = addByte(operand, this.r.f.cy);
  this.checkFullCarry16(upper(this.r.af), operand);
  this.checkHalfCarry(upper(this.r.af), operand);
  this.r.af = addUpper(this.r.af, operand);
  this.checkZFlag(upper(this.r.af));
  this.r.f.n = 0;
}

function SUB(operand: byte): void {
  operand *= -1;
  this.checkFullCarry16(upper(this.r.af), operand);
  this.checkHalfCarry(upper(this.r.af), operand);
  this.r.af = addUpper(this.r.af, operand);
  this.checkZFlag(upper(this.r.af));
  this.r.f.n = 1;
}

function SBC(operand: byte): void {
  operand *= -1;
  const carry = this.r.f.cy ? -1 : 0;
  operand = addByte(operand, carry);
  this.checkFullCarry16(upper(this.r.af), operand);
  this.checkHalfCarry(upper(this.r.af), operand);
  this.r.af = addUpper(this.r.af, operand);
  this.checkZFlag(upper(this.r.af));
  this.r.f.n = 1;
}

function OR(operand: byte): void {
  const result = upper(this.r.af) | operand;
  this.r.af = setUpper(this.r.af, toByte(result));
  this.checkZFlag(upper(this.r.af));
  this.r.f.n = 0;
  this.r.f.h = 0;
  this.r.f.cy = 0;
}

function AND(operand: byte): void {
  const result = upper(this.r.af) & operand;
  this.r.af = setUpper(this.r.af, toByte(result));
  this.checkZFlag(upper(this.r.af));
  this.r.f.n = 0;
  this.r.f.h = 1;
  this.r.f.cy = 0;
}

function XOR(operand: byte): void {
  const result = upper(this.r.af) ^ operand;
  this.r.af = setUpper(this.r.af, toByte(result));
  this.checkZFlag(upper(this.r.af));
  this.r.f.n = 0;
  this.r.f.h = 0;
  this.r.f.cy = 0;
}

function CP(operand: byte): void {
  operand *= -1;
  this.checkFullCarry16(upper(this.r.af), operand);
  this.checkHalfCarry(upper(this.r.af), operand);
  const result: byte = toByte(upper(this.r.af) + operand);
  this.checkZFlag(result);
}

function CALL(flag: boolean): boolean {
  if (flag) {
    this.sp = addWord(this.sp, -2);
    Memory.writeWord(this.sp, toWord(this.pc + 2));
    this.pc = Memory.readWord(this.pc);
    return true;
  }
  return false;
}

function PUSH(register: word): void {
  this.sp = addWord(this.sp, -1);
  Memory.writeByte(this.sp, upper(register));
  this.sp = addWord(this.sp, -1);
  Memory.writeByte(this.sp, lower(register));
}

function POP(register: word): void {
  register = Memory.readWord(this.pc);
  this.sp = addWord(this.sp, 2);
}

function Jpcc(flag: boolean): boolean {
  if (flag) {
    this.pc = Memory.readWord(this.pc);
    return true;
  }
  return false;
}

function RET(flag: boolean): boolean {
  if (flag) {
    this.pc = Memory.readWord(this.sp);
    this.sp = addWord(this.sp, 2);
    return true;
  }
  return false;
}

function RST(address: byte): void {
  this.sp = addWord(this.sp, -2);
  Memory.writeWord(this.sp, this.pc);
  this.pc = address;
}

interface OpcodeList {
  [key: string]: Function;
}

export const OpcodeMap: OpcodeList = {
  '0x00': function (this: CPU): void {},

  '0x01': function (this: CPU): void {
    this.r.bc = Memory.readWord(this.pc);
    this.pc += 2;
  },

  '0x02': function (this: CPU): void {
    Memory.writeByte(this.r.bc, upper(this.r.af));
  },

  '0x03': function (this: CPU): void {
    this.r.bc = addWord(this.r.bc, 1);
  },

  '0x04': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(upper(this.r.bc), operand);
    // perform addition
    operand = addByte(operand, upper(this.r.bc));
    this.r.bc = setUpper(this.r.bc, operand);

    this.checkZFlag(upper(this.r.bc));
    this.r.f.n = 0;
  },

  '0x05': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    this.checkHalfCarry(upper(this.r.bc), operand);
    operand = addByte(operand, upper(this.r.bc));
    this.r.bc = setUpper(this.r.bc, operand);

    this.checkZFlag(upper(this.r.bc));
    this.r.f.n = 1;
  },

  '0x06': function (this: CPU): void {
    // load into B from pc (immediate)
    this.r.bc = setUpper(this.r.bc, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0x07': function (this: CPU): void {
    // check carry flag
    this.r.f.cy = upper(this.r.af) >> 7;
    // left shift
    const shifted: byte = upper(this.r.af) << 1;
    this.r.af = setUpper(this.r.af, toByte(shifted | (shifted >> 8)));
    // flag resets
    this.r.f.n = 0;
    this.r.f.h = 0;
    this.r.f.z = 0;
  },

  '0x08': function (this: CPU): void {
    Memory.writeWord(Memory.readWord(this.pc), this.sp);
  },

  '0x09': function (this: CPU): void {
    this.checkFullCarry16(this.r.hl, this.r.bc);
    this.checkHalfCarry(upper(this.r.hl), upper(this.r.bc));
    this.r.hl = addWord(this.r.hl, this.r.bc);
    this.r.f.n = 0;
  },

  '0x0a': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(Memory.readByte(this.r.bc)));
  },

  '0x0b': function (this: CPU): void {
    this.r.bc = addWord(this.r.bc, -1);
  },

  '0x0c': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(lower(this.r.bc), operand);
    // perform addition
    operand = addByte(operand, lower(this.r.bc));
    this.r.bc = setLower(this.r.bc, operand);

    this.checkZFlag(lower(this.r.bc));
    this.r.f.n = 0;
  },

  '0x0d': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(lower(this.r.bc), operand);
    // perform addition
    operand = addByte(operand, lower(this.r.bc));
    this.r.bc = setLower(this.r.bc, operand);

    this.checkZFlag(lower(this.r.bc));
    this.r.f.n = 1;
  },

  '0x0e': function (this: CPU): void {
    // load into C from pc (immediate)
    this.r.bc = setLower(this.r.bc, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0x0f': function (this: CPU): void {
    // check carry flag
    const bitZero = upper(this.r.af) & 1;
    this.r.f.cy = bitZero;
    // right shift
    const shifted: byte = upper(this.r.af) >> 1;
    this.r.af = setUpper(this.r.af, toByte(shifted | (bitZero << 7)));
    // flag resets
    this.r.f.n = 0;
    this.r.f.h = 0;
    this.r.f.z = 0;
  },

  '0x10': function (this: CPU): void {
    console.log('Instruction halted.');
    throw new Error();
  },

  '0x11': function (this: CPU): void {
    this.r.de = Memory.readWord(this.pc);
    this.pc += 2;
  },

  '0x12': function (this: CPU): void {
    Memory.writeByte(this.r.de, upper(this.r.af));
  },

  '0x13': function (this: CPU): void {
    this.r.de = addWord(this.r.de, 1);
  },

  '0x14': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(upper(this.r.de), operand);
    // perform addition
    operand = addByte(operand, upper(this.r.de));
    this.r.de = setUpper(this.r.de, operand);

    this.checkZFlag(upper(this.r.de));
    this.r.f.n = 0;
  },

  '0x15': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(upper(this.r.de), operand);
    // perform addition
    operand = addByte(operand, upper(this.r.de));
    this.r.de = setUpper(this.r.de, operand);

    this.checkZFlag(upper(this.r.de));
    this.r.f.n = 1;
  },

  '0x16': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0x17': function (this: CPU): void {
    // need to rotate left through the carry flag
    // get the old carry value
    const oldCY = this.r.f.cy;
    // set the carry flag to the 7th bit of A
    this.r.f.cy = upper(this.r.af) >> 7;
    // rotate left
    const shifted = upper(this.r.af) << 1;
    // combine old flag and shifted, set to A
    this.r.af = setUpper(this.r.af, toByte(shifted | oldCY));
    this.r.f.h = 0;
    this.r.f.n = 0;
    this.r.f.z = 0;
  },

  '0x18': function (this: CPU): void {
    this.pc = addWord(this.pc, toSigned(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0x19': function (this: CPU): void {
    this.checkFullCarry16(this.r.hl, this.r.de);
    this.checkHalfCarry(upper(this.r.hl), upper(this.r.de));
    this.r.hl = addWord(this.r.hl, this.r.de);
    this.r.f.n = 0;
  },

  '0x1a': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(Memory.readByte(this.r.de)));
  },

  '0x1b': function (this: CPU): void {
    this.r.de = addWord(this.r.de, -1);
  },

  '0x1c': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(lower(this.r.de), operand);
    // perform addition
    operand = addByte(operand, lower(this.r.de));
    this.r.de = setLower(this.r.de, operand);

    this.checkZFlag(lower(this.r.de));
    this.r.f.n = 0;
  },

  '0x1d': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(lower(this.r.de), operand);
    // perform addition
    operand = addByte(operand, lower(this.r.de));
    this.r.de = setLower(this.r.de, operand);

    this.checkZFlag(lower(this.r.de));
    this.r.f.n = 1;
  },

  '0x1e': function (this: CPU): void {
    this.r.de = setLower(this.r.de, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0x1f': function (this: CPU): void {
    // rotate right through the carry flag
    // get the old carry value
    const oldCY = this.r.f.cy;
    // set the carry flag to the 0th bit of A
    this.r.f.cy = upper(this.r.af) & 1;
    // rotate right
    const shifted = upper(this.r.af) >> 1;
    // combine old flag and shifted, set to A
    this.r.af = setUpper(this.r.af, toByte(shifted | (oldCY << 7)));
    this.r.f.h = 0;
    this.r.f.n = 0;
    this.r.f.z = 0;
  },

  '0x20': function (this: CPU): boolean {
    const incr = toSigned(Memory.readByte(this.pc));
    // increment pc if zero flag was reset
    if (!this.r.f.z) {
      this.pc = addWord(this.pc, incr);
      return true;
    }
    this.pc += 1;
    return false;
  },

  '0x21': function (this: CPU): void {
    this.r.hl = Memory.readWord(this.pc);
    this.pc += 2;
  },

  '0x22': function (this: CPU): void {
    Memory.writeByte(this.r.hl, upper(this.r.af));
    this.r.hl = addWord(this.r.hl, 1);
  },

  '0x23': function (this: CPU): void {
    this.r.hl = addWord(this.r.hl, 1);
  },

  '0x24': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(upper(this.r.hl), operand);
    // perform addition
    operand = addByte(operand, upper(this.r.hl));
    this.r.hl = setUpper(this.r.hl, operand);

    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x25': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(upper(this.r.hl), operand);
    // perform addition
    operand = addByte(operand, upper(this.r.hl));
    this.r.hl = setUpper(this.r.hl, operand);

    this.checkZFlag(operand);
    this.r.f.n = 1;
  },

  '0x26': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  /**
   * DAA instruction taken from - https://forums.nesdev.com/viewtopic.php?t=15944#p196282
   */
  '0x27': function (this: CPU): void {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    if (!this.r.f.n) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (this.r.f.cy || upper(this.r.af) > 0x99) {
        this.r.af = addUpper(this.r.af, 0x60);
        this.r.f.cy = 1;
      }
      if (this.r.f.h || (upper(this.r.af) & 0x0f) > 0x09) {
        this.r.af = addUpper(this.r.af, 0x6);
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (this.r.f.cy) {
        this.r.af = addUpper(this.r.af, -0x60);
      }
      if (this.r.f.h) {
        this.r.af = addUpper(this.r.af, -0x6);
      }
    }
    // these flags are always updated
    this.checkZFlag(upper(this.r.af));
    this.r.f.h = 0; // h flag is always cleared
  },

  '0x28': function (this: CPU): boolean {
    const incr = toSigned(Memory.readByte(this.pc));
    // increment pc if zero flag was set
    if (this.r.f.z) {
      this.pc = addWord(this.pc, incr);
      return true;
    }
    return false;
  },

  '0x29': function (this: CPU): void {
    this.checkFullCarry16(this.r.hl, this.r.hl);
    this.checkHalfCarry(upper(this.r.hl), upper(this.r.hl));
    this.r.hl = addWord(this.r.hl, this.r.hl);
    this.r.f.n = 0;
  },

  '0x2a': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(Memory.readByte(this.r.hl)));
    this.r.hl = addWord(this.r.hl, 1);
  },

  '0x2b': function (this: CPU): void {
    this.r.hl = addWord(this.r.hl, -1);
  },

  '0x2c': function (this: CPU): void {
    let operand: byte = toByte(1);
    this.checkHalfCarry(lower(this.r.hl), operand);
    operand = addByte(operand, lower(this.r.hl));
    setLower(this.r.hl, operand);
    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x2d': function (this: CPU): void {
    let operand: byte = toByte(-1);
    this.checkHalfCarry(lower(this.r.hl), operand);
    operand = addByte(operand, lower(this.r.hl));
    setLower(this.r.hl, operand);
    this.checkZFlag(operand);
    this.r.f.n = 1;
  },

  '0x2e': function (this: CPU): void {
    setLower(this.r.hl, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0x2f': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(~upper(this.r.af)));
    this.r.f.n = 1;
    this.r.f.h = 1;
  },

  '0x30': function (this: CPU): boolean {
    const incr = toSigned(Memory.readByte(this.pc));
    if (!this.r.f.cy) {
      this.pc = addWord(this.pc, incr);
      return true;
    }
    return false;
  },

  '0x31': function (this: CPU): void {
    this.sp = Memory.readWord(this.pc);
    this.pc += 2;
  },

  '0x32': function (this: CPU): void {
    Memory.writeByte(this.r.hl, upper(this.r.af));
    this.r.hl = addWord(this.r.hl, -1);
  },

  '0x33': function (this: CPU): void {
    this.sp = addWord(this.sp, 1);
  },

  '0x34': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(1);
    const newVal: byte = toByte(Memory.readByte(this.r.hl));
    // check for half carry on affected byte only
    this.checkHalfCarry(newVal, operand);
    operand = addByte(operand, newVal);
    Memory.writeByte(this.r.hl, operand);

    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x35': function (this: CPU): void {
    // convert operand to unsigned
    let operand: byte = toByte(-1);
    const newVal: byte = toByte(Memory.readByte(this.r.hl));
    // check for half carry on affected byte only
    this.checkHalfCarry(newVal, operand);
    operand = addByte(operand, newVal);
    Memory.writeByte(this.r.hl, operand);

    this.checkZFlag(operand);
    this.r.f.n = 1;
  },

  '0x36': function (this: CPU): void {
    Memory.writeByte(this.r.hl, toByte(Memory.readByte(this.pc)));
  },

  '0x37': function (this: CPU): void {
    this.r.f.cy = 1;
    this.r.f.n = 0;
    this.r.f.h = 0;
  },

  '0x38': function (this: CPU): boolean {
    const incr = toSigned(Memory.readByte(this.pc));
    if (this.r.f.cy) {
      this.pc = addWord(this.pc, incr);
      return true;
    }
    this.pc += 1;
    return false;
  },

  '0x39': function (this: CPU): void {
    this.checkFullCarry16(this.r.hl, this.sp);
    this.checkHalfCarry(upper(this.r.hl), upper(this.sp));
    this.r.hl = addWord(this.r.hl, this.sp);
    this.r.f.n = 0;
  },

  '0x3a': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(Memory.readByte(this.r.hl)));
    this.r.hl = addWord(this.r.hl, -1);
  },

  '0x3b': function (this: CPU): void {
    this.sp = addWord(this.sp, -1);
  },

  '0x3c': function (this: CPU): void {
    let operand: byte = toByte(1);
    this.checkHalfCarry(upper(this.r.af), operand);
    operand = addByte(operand, upper(this.r.af));
    this.r.af = setUpper(this.r.af, operand);
    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x3d': function (this: CPU): void {
    let operand: byte = toByte(-1);
    this.checkHalfCarry(upper(this.r.af), operand);
    operand = addByte(operand, upper(this.r.af));
    this.r.af = setUpper(this.r.af, operand);
    this.checkZFlag(operand);
    this.r.f.n = 1;
  },

  '0x3e': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0x3f': function (this: CPU): void {
    if (this.r.f.cy) {
      this.r.f.cy = 0;
    } else {
      this.r.f.cy = 1;
    }
    this.r.f.n = 0;
    this.r.f.h = 0;
  },

  '0x40': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, upper(this.r.bc));
  },

  '0x41': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, lower(this.r.bc));
  },

  '0x42': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, upper(this.r.de));
  },

  '0x43': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, lower(this.r.de));
  },

  '0x44': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, upper(this.r.hl));
  },

  '0x45': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, lower(this.r.hl));
  },

  '0x46': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, toByte(Memory.readByte(this.r.hl)));
  },

  '0x47': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, upper(this.r.af));
  },

  '0x48': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, upper(this.r.bc));
  },

  '0x49': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, lower(this.r.bc));
  },

  '0x4a': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, upper(this.r.de));
  },

  '0x4b': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, lower(this.r.de));
  },

  '0x4c': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, upper(this.r.hl));
  },

  '0x4d': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, lower(this.r.hl));
  },

  '0x4e': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, toByte(Memory.readByte(this.r.hl)));
  },

  '0x4f': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, upper(this.r.af));
  },

  '0x50': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, upper(this.r.bc));
  },

  '0x51': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, lower(this.r.bc));
  },

  '0x52': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, upper(this.r.de));
  },

  '0x53': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, lower(this.r.de));
  },

  '0x54': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, upper(this.r.hl));
  },

  '0x55': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, lower(this.r.hl));
  },

  '0x56': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, toByte(Memory.readByte(this.r.hl)));
  },

  '0x57': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, upper(this.r.af));
  },

  '0x58': function (this: CPU): void {
    this.r.de = setLower(this.r.de, upper(this.r.bc));
  },

  '0x59': function (this: CPU): void {
    this.r.de = setLower(this.r.de, upper(this.r.bc));
  },

  '0x5a': function (this: CPU): void {
    this.r.de = setLower(this.r.de, upper(this.r.de));
  },

  '0x5b': function (this: CPU): void {
    this.r.de = setLower(this.r.de, lower(this.r.de));
  },

  '0x5c': function (this: CPU): void {
    this.r.de = setLower(this.r.de, upper(this.r.hl));
  },

  '0x5d': function (this: CPU): void {
    this.r.de = setLower(this.r.de, lower(this.r.hl));
  },

  '0x5e': function (this: CPU): void {
    this.r.de = setLower(this.r.de, toByte(Memory.readByte(this.r.hl)));
  },

  '0x5f': function (this: CPU): void {
    this.r.de = setLower(this.r.de, upper(this.r.af));
  },

  '0x60': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, upper(this.r.bc));
  },

  '0x61': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, lower(this.r.bc));
  },

  '0x62': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, upper(this.r.de));
  },

  '0x63': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, lower(this.r.de));
  },

  '0x64': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, upper(this.r.hl));
  },

  '0x65': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, lower(this.r.hl));
  },

  '0x66': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, toByte(Memory.readByte(this.r.hl)));
  },

  '0x67': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, upper(this.r.af));
  },

  '0x68': function (this: CPU): void {
    setLower(this.r.hl, upper(this.r.bc));
  },

  '0x69': function (this: CPU): void {
    setLower(this.r.hl, lower(this.r.bc));
  },

  '0x6a': function (this: CPU): void {
    setLower(this.r.hl, upper(this.r.de));
  },

  '0x6b': function (this: CPU): void {
    setLower(this.r.hl, lower(this.r.de));
  },

  '0x6c': function (this: CPU): void {
    setLower(this.r.hl, upper(this.r.hl));
  },

  '0x6d': function (this: CPU): void {
    setLower(this.r.hl, lower(this.r.hl));
  },

  '0x6e': function (this: CPU): void {
    setLower(this.r.hl, toByte(Memory.readByte(this.r.hl)));
  },

  '0x6f': function (this: CPU): void {
    setLower(this.r.hl, upper(this.r.af));
  },

  '0x70': function (this: CPU): void {
    Memory.writeByte(this.r.hl, upper(this.r.bc));
  },

  '0x71': function (this: CPU): void {
    Memory.writeByte(this.r.hl, lower(this.r.bc));
  },

  '0x72': function (this: CPU): void {
    Memory.writeByte(this.r.hl, upper(this.r.de));
  },

  '0x73': function (this: CPU): void {
    Memory.writeByte(this.r.hl, lower(this.r.de));
  },

  '0x74': function (this: CPU): void {
    Memory.writeByte(this.r.hl, upper(this.r.hl));
  },

  '0x75': function (this: CPU): void {
    Memory.writeByte(this.r.hl, lower(this.r.hl));
  },

  '0x76': function (this: CPU): void {
    this.halted = true;
  },

  '0x77': function (this: CPU): void {
    Memory.writeByte(this.r.hl, upper(this.r.af));
  },

  '0x78': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, upper(this.r.bc));
  },

  '0x79': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, lower(this.r.bc));
  },

  '0x7a': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, upper(this.r.de));
  },

  '0x7b': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, lower(this.r.de));
  },

  '0x7c': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, upper(this.r.hl));
  },

  '0x7d': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, lower(this.r.hl));
  },

  '0x7e': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(Memory.readByte(this.r.hl)));
  },

  '0x7f': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, upper(this.r.af));
  },

  '0x80': function (this: CPU): void {
    ADD.call(this, upper(this.r.bc));
  },

  '0x81': function (this: CPU): void {
    ADD.call(this, lower(this.r.bc));
  },

  '0x82': function (this: CPU): void {
    ADD.call(this, upper(this.r.de));
  },

  '0x83': function (this: CPU): void {
    ADD.call(this, lower(this.r.de));
  },

  '0x84': function (this: CPU): void {
    ADD.call(this, upper(this.r.hl));
  },

  '0x85': function (this: CPU): void {
    ADD.call(this, lower(this.r.hl));
  },

  '0x86': function (this: CPU): void {
    ADD.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x87': function (this: CPU): void {
    ADD.call(this, upper(this.r.af));
  },

  '0x88': function (this: CPU): void {
    ADC.call(this, upper(this.r.bc));
  },

  '0x89': function (this: CPU): void {
    ADC.call(this, lower(this.r.bc));
  },

  '0x8a': function (this: CPU): void {
    ADC.call(this, upper(this.r.de));
  },

  '0x8b': function (this: CPU): void {
    ADC.call(this, lower(this.r.de));
  },

  '0x8c': function (this: CPU): void {
    ADC.call(this, upper(this.r.hl));
  },

  '0x8d': function (this: CPU): void {
    ADC.call(this, lower(this.r.hl));
  },

  '0x8e': function (this: CPU): void {
    ADC.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x8f': function (this: CPU): void {
    ADC.call(this, upper(this.r.af));
  },

  '0x90': function (this: CPU): void {
    SUB.call(this, upper(this.r.bc));
  },

  '0x91': function (this: CPU): void {
    SUB.call(this, lower(this.r.bc));
  },

  '0x92': function (this: CPU): void {
    SUB.call(this, upper(this.r.de));
  },

  '0x93': function (this: CPU): void {
    SUB.call(this, lower(this.r.de));
  },

  '0x94': function (this: CPU): void {
    SUB.call(this, upper(this.r.hl));
  },

  '0x95': function (this: CPU): void {
    SUB.call(this, lower(this.r.hl));
  },

  '0x96': function (this: CPU): void {
    SUB.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x97': function (this: CPU): void {
    SUB.call(this, upper(this.r.af));
  },

  '0x98': function (this: CPU): void {
    SBC.call(this, upper(this.r.bc));
  },

  '0x99': function (this: CPU): void {
    SBC.call(this, lower(this.r.bc));
  },

  '0x9a': function (this: CPU): void {
    SBC.call(this, upper(this.r.de));
  },

  '0x9b': function (this: CPU): void {
    SBC.call(this, lower(this.r.de));
  },

  '0x9c': function (this: CPU): void {
    SBC.call(this, upper(this.r.hl));
  },

  '0x9d': function (this: CPU): void {
    SBC.call(this, lower(this.r.hl));
  },

  '0x9e': function (this: CPU): void {
    SBC.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x9f': function (this: CPU): void {
    SBC.call(this, upper(this.r.af));
  },

  '0xa0': function (this: CPU): void {
    AND.call(this, upper(this.r.bc));
  },

  '0xa1': function (this: CPU): void {
    AND.call(this, lower(this.r.bc));
  },

  '0xa2': function (this: CPU): void {
    AND.call(this, upper(this.r.de));
  },

  '0xa3': function (this: CPU): void {
    AND.call(this, lower(this.r.de));
  },

  '0xa4': function (this: CPU): void {
    AND.call(this, upper(this.r.hl));
  },

  '0xa5': function (this: CPU): void {
    AND.call(this, lower(this.r.hl));
  },

  '0xa6': function (this: CPU): void {
    AND.call(this, Memory.readByte(this.r.hl));
  },

  '0xa7': function (this: CPU): void {
    AND.call(this, upper(this.r.af));
  },

  '0xa8': function (this: CPU): void {
    XOR.call(this, upper(this.r.bc));
  },

  '0xa9': function (this: CPU): void {
    XOR.call(this, lower(this.r.bc));
  },

  '0xaa': function (this: CPU): void {
    XOR.call(this, upper(this.r.de));
  },

  '0xab': function (this: CPU): void {
    XOR.call(this, lower(this.r.de));
  },

  '0xac': function (this: CPU): void {
    XOR.call(this, upper(this.r.hl));
  },

  '0xad': function (this: CPU): void {
    XOR.call(this, lower(this.r.hl));
  },

  '0xae': function (this: CPU): void {
    XOR.call(this, Memory.readByte(this.r.hl));
  },

  '0xaf': function (this: CPU): void {
    XOR.call(this, upper(this.r.af));
  },

  '0xb0': function (this: CPU): void {
    OR.call(this, upper(this.r.bc));
  },

  '0xb1': function (this: CPU): void {
    OR.call(this, lower(this.r.bc));
  },

  '0xb2': function (this: CPU): void {
    OR.call(this, upper(this.r.de));
  },

  '0xb3': function (this: CPU): void {
    OR.call(this, lower(this.r.de));
  },

  '0xb4': function (this: CPU): void {
    OR.call(this, upper(this.r.hl));
  },

  '0xb5': function (this: CPU): void {
    OR.call(this, lower(this.r.hl));
  },

  '0xb6': function (this: CPU): void {
    OR.call(this, Memory.readByte(this.r.hl));
  },

  '0xb7': function (this: CPU): void {
    OR.call(this, upper(this.r.af));
  },

  '0xb8': function (this: CPU): void {
    CP.call(this, upper(this.r.bc));
  },

  '0xb9': function (this: CPU): void {
    CP.call(this, lower(this.r.bc));
  },

  '0xba': function (this: CPU): void {
    CP.call(this, upper(this.r.de));
  },

  '0xbb': function (this: CPU): void {
    CP.call(this, lower(this.r.de));
  },

  '0xbc': function (this: CPU): void {
    CP.call(this, upper(this.r.hl));
  },

  '0xbd': function (this: CPU): void {
    CP.call(this, lower(this.r.hl));
  },

  '0xbe': function (this: CPU): void {
    CP.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0xbf': function (this: CPU): void {
    CP.call(this, upper(this.r.af));
  },

  '0xc0': function (this: CPU): boolean {
    return RET.call(this, !this.r.f.z);
  },

  '0xc1': function (this: CPU): void {
    POP.call(this, this.r.bc);
  },

  '0xc2': function (this: CPU): boolean {
    if (Jpcc.call(this, !this.r.f.z)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xc3': function (this: CPU): void {
    this.pc = Memory.readWord(this.pc);
  },

  '0xc4': function (this: CPU): boolean {
    if (CALL.call(this, !this.r.f.z)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xc5': function (this: CPU): void {
    PUSH.call(this, this.r.bc);
  },

  '0xc6': function (this: CPU): void {
    const value = toByte(Memory.readByte(this.pc));
    this.checkFullCarry8(upper(this.r.af), value);
    this.checkHalfCarry(upper(this.r.af), value);
    this.r.af = addUpper(this.r.af, value);
    this.checkZFlag(upper(this.r.af));
    this.pc += 1;
    this.r.f.n = 0;
  },

  '0xc7': function (this: CPU): void {
    RST.call(this, 0x00);
  },

  '0xc8': function (this: CPU): boolean {
    if (this.r.f.z) {
      const address: word = Memory.readWord(this.sp);
      this.pc = address;
      this.sp = addWord(this.sp, 2);
      return true;
    }
    return false;
  },

  '0xc9': function (this: CPU): void {
    RET.call(this, true);
  },

  '0xca': function (this: CPU): boolean {
    if (Jpcc.call(this, this.r.f.z)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xcb': function (this: CPU): void {
    const opcode: byte = Memory.readByte(this.pc);
    if (opcode in cbMap) {
      cbMap[opcode].call(this);
    } else {
      throw new Error('Tried to call out-of-range CB opcode.');
    }
  },

  '0xcc': function (this: CPU): boolean {
    if (CALL.call(this, this.r.f.z)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xcd': function (this: CPU): void {
    CALL.call(this, true);
  },

  '0xce': function (this: CPU): void {
    ADC.call(this, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0xcf': function (this: CPU): void {
    RST.call(this, 0x08);
  },

  '0xd0': function (this: CPU): boolean {
    return RET.call(this, !this.r.f.cy);
  },

  '0xd1': function (this: CPU): void {
    POP.call(this, this.r.de);
  },

  '0xd2': function (this: CPU): boolean {
    if (Jpcc.call(this, this.r.f.z)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xd3': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xd4': function (this: CPU): boolean {
    if (CALL.call(this, !this.r.f.cy)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xd5': function (this: CPU): void {
    PUSH.call(this, this.r.de);
  },

  '0xd6': function (this: CPU): void {
    SUB.call(this, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0xd7': function (this: CPU): void {
    RST.call(this, 0x10);
  },

  '0xd8': function (this: CPU): void {
    return RET.call(this, this.r.f.cy);
  },

  '0xd9': function (this: CPU): void {
    RET.call(this, true);
    this.interruptsEnabled = true;
  },

  '0xda': function (this: CPU): boolean {
    if (Jpcc.call(this, this.r.f.cy)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xdb': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xdc': function (this: CPU): boolean {
    if (CALL.call(this, this.r.f.cy)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  '0xdd': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xde': function (this: CPU): void {
    SBC.call(this, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0xdf': function (this: CPU): void {
    RST.call(this, 0x18);
  },

  '0xe0': function (this: CPU): void {
    Memory.writeByte(0xff00 + Memory.readByte(this.pc), upper(this.r.af));
    this.pc += 1;
  },

  '0xe1': function (this: CPU): void {
    POP.call(this, this.r.hl);
  },

  '0xe2': function (this: CPU): void {
    Memory.writeByte(0xff00 + lower(this.r.bc), upper(this.r.af));
  },

  '0xe3': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xe4': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xe5': function (this: CPU): void {
    PUSH.call(this, this.r.hl);
  },

  '0xe6': function (this: CPU): void {
    AND.call(this, Memory.readByte(this.pc));
    this.pc += 1;
  },

  '0xe7': function (this: CPU): void {
    RST.call(this, 0x20);
  },

  '0xe8': function (this: CPU): void {
    const operand = toWord(toSigned(Memory.readByte(this.pc)));
    this.checkFullCarry16(this.sp, operand);
    this.checkHalfCarry(upper(this.sp), upper(operand));
    this.sp = addWord(this.sp, operand);
    this.pc += 1;
    this.r.f.z = 0;
    this.r.f.n = 0;
  },

  '0xe9': function (this: CPU): void {
    this.pc = this.r.hl;
  },

  '0xea': function (this: CPU): void {
    Memory.writeByte(Memory.readWord(this.pc), upper(this.r.af));
    this.pc += 2;
  },

  '0xeb': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xec': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xed': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xee': function (this: CPU): void {
    XOR.call(this, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0xef': function (this: CPU): void {
    RST.call(this, 0x28);
  },

  '0xf0': function (this: CPU): void {
    const data = toByte(Memory.readByte(0xff00 + Memory.readByte(this.pc)));
    this.r.af = setUpper(this.r.af, data);
    this.pc += 1;
  },

  '0xf1': function (this: CPU): void {
    POP.call(this, this.r.af);
  },

  '0xf2': function (this: CPU): void {
    const data = toByte(0xff00 + lower(this.r.bc));
    this.r.af = setUpper(this.r.af, data);
  },

  '0xf3': function (this: CPU): void {
    this.interruptsEnabled = false;
  },

  '0xf4': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xf5': function (this: CPU): void {
    PUSH.call(this.r.af);
  },

  '0xf6': function (this: CPU): void {
    OR.call(this, Memory.readByte(this.pc));
    this.pc += 1;
  },

  '0xf7': function (this: CPU): void {
    RST.call(this, 0x30);
  },

  '0xf8': function (this: CPU): void {
    let incr = toWord(toSigned(Memory.readByte(this.pc)));
    this.checkHalfCarry(upper(incr), upper(this.sp));
    this.checkFullCarry16(incr, this.sp);
    this.pc += 1;
    incr = addWord(incr, this.sp);
    this.r.hl = incr;
    this.r.f.z = 0;
    this.r.f.n = 0;
  },

  '0xf9': function (this: CPU): void {
    this.sp = this.r.hl;
  },

  '0xfa': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, toByte(Memory.readByte(Memory.readWord(this.pc))));
    this.pc += 2;
  },

  '0xfb': function (this: CPU): void {
    this.interruptsEnabled = true;
  },

  '0xfc': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xfd': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xfe': function (this: CPU): void {
    CP.call(this, toByte(Memory.readByte(this.pc)));
    this.pc += 1;
  },

  '0xff': function (this: CPU): void {
    RST.call(this, 0x38);
  },
};

function RLCn(reg: byte): byte {
  this.r.f.cy = reg >> 7;
  const shifted: byte = reg << 1;
  const result: byte = toByte(shifted | (shifted >> 8));
  this.checkZFlag(result);
  this.r.f.n = 0;
  this.r.f.h = 0;
  return result;
}

function RLn(reg: byte): byte {
  const oldCY = this.r.f.cy;
  this.r.f.cy = reg >> 7;
  const shifted = reg << 1;
  const result = toByte(shifted | oldCY);
  this.checkZFlag(result);
  this.r.f.h = 0;
  this.r.f.n = 0;
  return result;
}

function RRCn(reg: byte): byte {
  const bitZero = reg & 1;
  this.r.f.cy = bitZero;
  const shifted: byte = reg >> 1;
  const result: byte = toByte(shifted | (bitZero << 7));
  this.checkZFlag(result);
  this.r.f.n = 0;
  this.r.f.h = 0;
  return result;
}

function RRn(reg: byte): byte {
  const oldCY = this.r.f.cy;
  this.r.f.cy = reg & 1;
  const shifted = reg >> 1;
  const result: byte = toByte(shifted | (oldCY << 7));
  this.checkZFlag(result);
  this.r.f.h = 0;
  this.r.f.n = 0;
  return result;
}

function SLAn(reg: byte): byte {
  this.r.f.cy = reg >> 7;
  const result = toByte(reg << 1);
  this.checkZFlag(result);
  this.r.f.h = 0;
  this.r.f.n = 0;
  return result;
}

const cbMap: OpcodeList = {
  '0x00': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, RLCn(upper(this.r.bc)));
  },
  '0x01': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, RLCn(lower(this.r.bc)));
  },
  '0x02': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, RLCn(upper(this.r.de)));
  },
  '0x03': function (this: CPU): void {
    this.r.de = setLower(this.r.de, RLCn(lower(this.r.de)));
  },
  '0x04': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, RLCn(upper(this.r.hl)));
  },
  '0x05': function (this: CPU): void {
    this.r.hl = setLower(this.r.hl, RLCn(lower(this.r.hl)));
  },
  '0x06': function (this: CPU): void {
    Memory.writeByte(this.r.hl, RLCn(Memory.readByte(this.r.hl)));
  },
  '0x07': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, RLCn(upper(this.r.af)));
  },
  '0x08': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, RRCn(upper(this.r.bc)));
  },
  '0x09': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, RRCn(lower(this.r.bc)));
  },
  '0x0a': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, RRCn(upper(this.r.de)));
  },
  '0x0b': function (this: CPU): void {
    this.r.de = setLower(this.r.de, RRCn(lower(this.r.de)));
  },
  '0x0c': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, RRCn(upper(this.r.hl)));
  },
  '0x0d': function (this: CPU): void {
    this.r.hl = setLower(this.r.hl, RRCn(lower(this.r.hl)));
  },
  '0x0e': function (this: CPU): void {
    Memory.writeByte(this.r.hl, RRCn(Memory.readByte(this.r.hl)));
  },
  '0x0f': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, RRCn(upper(this.r.af)));
  },
  '0x10': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, RLn(upper(this.r.bc)));
  },
  '0x11': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, RLn(lower(this.r.bc)));
  },
  '0x12': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, RLn(upper(this.r.de)));
  },
  '0x13': function (this: CPU): void {
    this.r.de = setLower(this.r.de, RLn(lower(this.r.de)));
  },
  '0x14': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, RLn(upper(this.r.hl)));
  },
  '0x15': function (this: CPU): void {
    this.r.hl = setLower(this.r.hl, RLn(lower(this.r.hl)));
  },
  '0x16': function (this: CPU): void {
    Memory.writeByte(this.r.hl, RLn(Memory.readByte(this.r.hl)));
  },
  '0x17': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, RLn(upper(this.r.af)));
  },
  '0x18': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, RLn(upper(this.r.bc)));
  },
  '0x19': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, RRn(lower(this.r.bc)));
  },
  '0x1a': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, RRn(upper(this.r.de)));
  },
  '0x1b': function (this: CPU): void {
    this.r.de = setLower(this.r.de, RRn(lower(this.r.de)));
  },
  '0x1c': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, RRn(upper(this.r.hl)));
  },
  '0x1d': function (this: CPU): void {
    this.r.hl = setLower(this.r.hl, RRn(lower(this.r.hl)));
  },
  '0x1e': function (this: CPU): void {
    Memory.writeByte(this.r.hl, RRn(Memory.readByte(this.r.hl)));
  },
  '0x1f': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, RRn(upper(this.r.af)));
  },
  '0x20': function (this: CPU): void {
    this.r.bc = setUpper(this.r.bc, SLAn(upper(this.r.bc)));
  },
  '0x21': function (this: CPU): void {
    this.r.bc = setLower(this.r.bc, SLAn(lower(this.r.bc)));
  },
  '0x22': function (this: CPU): void {
    this.r.de = setUpper(this.r.de, SLAn(upper(this.r.de)));
  },
  '0x23': function (this: CPU): void {
    this.r.de = setLower(this.r.de, SLAn(lower(this.r.de)));
  },
  '0x24': function (this: CPU): void {
    this.r.hl = setUpper(this.r.hl, SLAn(upper(this.r.hl)));
  },
  '0x25': function (this: CPU): void {
    this.r.hl = setLower(this.r.hl, SLAn(lower(this.r.hl)));
  },
  '0x26': function (this: CPU): void {
    Memory.writeByte(this.r.hl, SLAn(Memory.readByte(this.r.hl)));
  },
  '0x27': function (this: CPU): void {
    this.r.af = setUpper(this.r.af, SLAn(upper(this.r.af)));
  },
  '0x28': function (this: CPU): void {},
  '0x29': function (this: CPU): void {},
  '0x2a': function (this: CPU): void {},
  '0x2b': function (this: CPU): void {},
  '0x2c': function (this: CPU): void {},
  '0x2d': function (this: CPU): void {},
  '0x2e': function (this: CPU): void {},
  '0x2f': function (this: CPU): void {},
  '0x30': function (this: CPU): void {},
  '0x31': function (this: CPU): void {},
  '0x32': function (this: CPU): void {},
  '0x33': function (this: CPU): void {},
  '0x34': function (this: CPU): void {},
  '0x35': function (this: CPU): void {},
  '0x36': function (this: CPU): void {},
  '0x37': function (this: CPU): void {},
  '0x38': function (this: CPU): void {},
  '0x39': function (this: CPU): void {},
  '0x3a': function (this: CPU): void {},
  '0x3b': function (this: CPU): void {},
  '0x3c': function (this: CPU): void {},
  '0x3d': function (this: CPU): void {},
  '0x3e': function (this: CPU): void {},
  '0x3f': function (this: CPU): void {},
  '0x40': function (this: CPU): void {},
  '0x41': function (this: CPU): void {},
  '0x42': function (this: CPU): void {},
  '0x43': function (this: CPU): void {},
  '0x44': function (this: CPU): void {},
  '0x45': function (this: CPU): void {},
  '0x46': function (this: CPU): void {},
  '0x47': function (this: CPU): void {},
  '0x48': function (this: CPU): void {},
  '0x49': function (this: CPU): void {},
  '0x4a': function (this: CPU): void {},
  '0x4b': function (this: CPU): void {},
  '0x4c': function (this: CPU): void {},
  '0x4d': function (this: CPU): void {},
  '0x4e': function (this: CPU): void {},
  '0x4f': function (this: CPU): void {},
  '0x50': function (this: CPU): void {},
  '0x51': function (this: CPU): void {},
  '0x52': function (this: CPU): void {},
  '0x53': function (this: CPU): void {},
  '0x54': function (this: CPU): void {},
  '0x55': function (this: CPU): void {},
  '0x56': function (this: CPU): void {},
  '0x57': function (this: CPU): void {},
  '0x58': function (this: CPU): void {},
  '0x59': function (this: CPU): void {},
  '0x5a': function (this: CPU): void {},
  '0x5b': function (this: CPU): void {},
  '0x5c': function (this: CPU): void {},
  '0x5d': function (this: CPU): void {},
  '0x5e': function (this: CPU): void {},
  '0x5f': function (this: CPU): void {},
  '0x60': function (this: CPU): void {},
  '0x61': function (this: CPU): void {},
  '0x62': function (this: CPU): void {},
  '0x63': function (this: CPU): void {},
  '0x64': function (this: CPU): void {},
  '0x65': function (this: CPU): void {},
  '0x66': function (this: CPU): void {},
  '0x67': function (this: CPU): void {},
  '0x68': function (this: CPU): void {},
  '0x69': function (this: CPU): void {},
  '0x6a': function (this: CPU): void {},
  '0x6b': function (this: CPU): void {},
  '0x6c': function (this: CPU): void {},
  '0x6d': function (this: CPU): void {},
  '0x6e': function (this: CPU): void {},
  '0x6f': function (this: CPU): void {},
  '0x70': function (this: CPU): void {},
  '0x71': function (this: CPU): void {},
  '0x72': function (this: CPU): void {},
  '0x73': function (this: CPU): void {},
  '0x74': function (this: CPU): void {},
  '0x75': function (this: CPU): void {},
  '0x76': function (this: CPU): void {},
  '0x77': function (this: CPU): void {},
  '0x78': function (this: CPU): void {},
  '0x79': function (this: CPU): void {},
  '0x7a': function (this: CPU): void {},
  '0x7b': function (this: CPU): void {},
  '0x7c': function (this: CPU): void {},
  '0x7d': function (this: CPU): void {},
  '0x7e': function (this: CPU): void {},
  '0x7f': function (this: CPU): void {},
  '0x80': function (this: CPU): void {},
  '0x81': function (this: CPU): void {},
  '0x82': function (this: CPU): void {},
  '0x83': function (this: CPU): void {},
  '0x84': function (this: CPU): void {},
  '0x85': function (this: CPU): void {},
  '0x86': function (this: CPU): void {},
  '0x87': function (this: CPU): void {},
  '0x88': function (this: CPU): void {},
  '0x89': function (this: CPU): void {},
  '0x8a': function (this: CPU): void {},
  '0x8b': function (this: CPU): void {},
  '0x8c': function (this: CPU): void {},
  '0x8d': function (this: CPU): void {},
  '0x8e': function (this: CPU): void {},
  '0x8f': function (this: CPU): void {},
  '0x90': function (this: CPU): void {},
  '0x91': function (this: CPU): void {},
  '0x92': function (this: CPU): void {},
  '0x93': function (this: CPU): void {},
  '0x94': function (this: CPU): void {},
  '0x95': function (this: CPU): void {},
  '0x96': function (this: CPU): void {},
  '0x97': function (this: CPU): void {},
  '0x98': function (this: CPU): void {},
  '0x99': function (this: CPU): void {},
  '0x9a': function (this: CPU): void {},
  '0x9b': function (this: CPU): void {},
  '0x9c': function (this: CPU): void {},
  '0x9d': function (this: CPU): void {},
  '0x9e': function (this: CPU): void {},
  '0x9f': function (this: CPU): void {},
  '0xa0': function (this: CPU): void {},
  '0xa1': function (this: CPU): void {},
  '0xa2': function (this: CPU): void {},
  '0xa3': function (this: CPU): void {},
  '0xa4': function (this: CPU): void {},
  '0xa5': function (this: CPU): void {},
  '0xa6': function (this: CPU): void {},
  '0xa7': function (this: CPU): void {},
  '0xa8': function (this: CPU): void {},
  '0xa9': function (this: CPU): void {},
  '0xaa': function (this: CPU): void {},
  '0xab': function (this: CPU): void {},
  '0xac': function (this: CPU): void {},
  '0xad': function (this: CPU): void {},
  '0xae': function (this: CPU): void {},
  '0xaf': function (this: CPU): void {},
  '0xb0': function (this: CPU): void {},
  '0xb1': function (this: CPU): void {},
  '0xb2': function (this: CPU): void {},
  '0xb3': function (this: CPU): void {},
  '0xb4': function (this: CPU): void {},
  '0xb5': function (this: CPU): void {},
  '0xb6': function (this: CPU): void {},
  '0xb7': function (this: CPU): void {},
  '0xb8': function (this: CPU): void {},
  '0xb9': function (this: CPU): void {},
  '0xba': function (this: CPU): void {},
  '0xbb': function (this: CPU): void {},
  '0xbc': function (this: CPU): void {},
  '0xbd': function (this: CPU): void {},
  '0xbe': function (this: CPU): void {},
  '0xbf': function (this: CPU): void {},
  '0xc0': function (this: CPU): void {},
  '0xc1': function (this: CPU): void {},
  '0xc2': function (this: CPU): void {},
  '0xc3': function (this: CPU): void {},
  '0xc4': function (this: CPU): void {},
  '0xc5': function (this: CPU): void {},
  '0xc6': function (this: CPU): void {},
  '0xc7': function (this: CPU): void {},
  '0xc8': function (this: CPU): void {},
  '0xc9': function (this: CPU): void {},
  '0xca': function (this: CPU): void {},
  '0xcb': function (this: CPU): void {},
  '0xcc': function (this: CPU): void {},
  '0xcd': function (this: CPU): void {},
  '0xce': function (this: CPU): void {},
  '0xcf': function (this: CPU): void {},
  '0xd0': function (this: CPU): void {},
  '0xd1': function (this: CPU): void {},
  '0xd2': function (this: CPU): void {},
  '0xd3': function (this: CPU): void {},
  '0xd4': function (this: CPU): void {},
  '0xd5': function (this: CPU): void {},
  '0xd6': function (this: CPU): void {},
  '0xd7': function (this: CPU): void {},
  '0xd8': function (this: CPU): void {},
  '0xd9': function (this: CPU): void {},
  '0xda': function (this: CPU): void {},
  '0xdb': function (this: CPU): void {},
  '0xdc': function (this: CPU): void {},
  '0xdd': function (this: CPU): void {},
  '0xde': function (this: CPU): void {},
  '0xdf': function (this: CPU): void {},
  '0xe0': function (this: CPU): void {},
  '0xe1': function (this: CPU): void {},
  '0xe2': function (this: CPU): void {},
  '0xe3': function (this: CPU): void {},
  '0xe4': function (this: CPU): void {},
  '0xe5': function (this: CPU): void {},
  '0xe6': function (this: CPU): void {},
  '0xe7': function (this: CPU): void {},
  '0xe8': function (this: CPU): void {},
  '0xe9': function (this: CPU): void {},
  '0xea': function (this: CPU): void {},
  '0xeb': function (this: CPU): void {},
  '0xec': function (this: CPU): void {},
  '0xed': function (this: CPU): void {},
  '0xee': function (this: CPU): void {},
  '0xef': function (this: CPU): void {},
  '0xf0': function (this: CPU): void {},
  '0xf1': function (this: CPU): void {},
  '0xf2': function (this: CPU): void {},
  '0xf3': function (this: CPU): void {},
  '0xf4': function (this: CPU): void {},
  '0xf5': function (this: CPU): void {},
  '0xf6': function (this: CPU): void {},
  '0xf7': function (this: CPU): void {},
  '0xf8': function (this: CPU): void {},
  '0xf9': function (this: CPU): void {},
  '0xfa': function (this: CPU): void {},
  '0xfb': function (this: CPU): void {},
  '0xfc': function (this: CPU): void {},
  '0xfd': function (this: CPU): void {},
  '0xfe': function (this: CPU): void {},
  '0xff': function (this: CPU): void {},
};
