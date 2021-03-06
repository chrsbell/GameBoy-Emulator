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

/**
 * Converts the unsigned byte to its signed format using two's complement
 */
const toSigned = (value: number) => {
  if (value >= 128) {
    return -((~value + 1) & 255);
  }
  return value;
};

function ADD(operand: byte): void {
  this.checkFullCarry(this.r.af.upper(), operand);
  this.checkHalfCarry(this.r.af.upper(), operand);
  this.r.af.addUpper(operand);
  this.checkZFlag(this.r.af.upper());
  this.r.f.n = 0;
}

function ADC(operand: byte): void {
  operand.add(this.r.f.cy);
  this.checkFullCarry(this.r.af.upper(), operand);
  this.checkHalfCarry(this.r.af.upper(), operand);
  this.r.af.addUpper(operand);
  this.checkZFlag(this.r.af.upper());
  this.r.f.n = 0;
}

function SUB(operand: byte): void {
  operand.negate();
  this.checkFullCarry(this.r.af.upper(), operand);
  this.checkHalfCarry(this.r.af.upper(), operand);
  this.r.af.addUpper(operand);
  this.checkZFlag(this.r.af.upper());
  this.r.f.n = 1;
}

function SBC(operand: byte): void {
  operand.negate();
  const carry = this.r.f.cy ? -1 : 0;
  operand.add(carry);
  this.checkFullCarry(this.r.af.upper(), operand);
  this.checkHalfCarry(this.r.af.upper(), operand);
  this.r.af.addUpper(operand);
  this.checkZFlag(this.r.af.upper());
  this.r.f.n = 1;
}

function OR(operand: number): void {
  const result = this.r.af.upper() | operand;
  this.r.af.setUpper(toByte(result));
  this.checkZFlag(this.r.af.upper());
  this.r.f.n = 0;
  this.r.f.h = 0;
  this.r.f.cy = 0;
}

function AND(operand: number): void {
  const result = this.r.af.upper() & operand;
  this.r.af.setUpper(toByte(result));
  this.checkZFlag(this.r.af.upper());
  this.r.f.n = 0;
  this.r.f.h = 1;
  this.r.f.cy = 0;
}

function XOR(operand: byte): void {
  const result = this.r.af.upper() ^ operand;
  this.r.af.setUpper(toByte(result));
  this.checkZFlag(this.r.af.upper());
  this.r.f.n = 0;
  this.r.f.h = 0;
  this.r.f.cy = 0;
}

function CP(operand: byte): void {
  operand.negate();
  this.checkFullCarry(this.r.af.upper(), operand);
  this.checkHalfCarry(this.r.af.upper(), operand);
  const result = toByte(this.r.af.upper() + operand);
  this.checkZFlag(result);
}

function CALL(flag: boolean): boolean {
  if (flag) {
    this.sp.add(-2);
    Memory.writeWord(this.sp, toWord(this.pc + 2));
    this.pc = Memory.readWord(this.pc));
    return true;
  }
  return false;
}

function PUSH(register: Word): void {
  this.sp.add(-1);
  Memory.writeByte(this.sp, this.R.register.upper());
  this.sp.add(-1);
  Memory.writeByte(this.sp, this.R.register.lower());
}

function POP(register: Word): void {
  const result = Memory.readWord(this.pc);
  register = tWord(result));
  this.sp.add(2);
}

function Jpcc(flag: boolean): boolean {
  if (flag) {
    this.pc = Memory.readWord(this.pc));
    return true;
  }
  return false;
}

function RET(flag: boolean): boolean {
  if (flag) {
    const address = Memory.readWord(this.sp);
    this.pc = adress);
    this.sp.add(2);
    return true;
  }
  return false;
}

function RST(address: number): void {
  this.sp.add(-2);
  Memory.writeWord(this.sp, this.pc);
  this.pc = adress);
}

interface OpcodeList {
  [key: string]: Function;
}

export const OpcodeMap: OpcodeList = {
  '0x00': function (this: CPU): void {},

  '0x01': function (this: CPU): void {
    this.r.bc = Memory.readWord(this.pc));
  },

  '0x02': function (this: CPU): void {
    Memory.writeByte(this.r.bc, this.r.af.upper());
  },

  '0x03': function (this: CPU): void {
    this.r.bc.add(1);
  },

  '0x04': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.bc.upper(), operand);
    // perform addition
    operand.add(this.r.bc.upper());
    this.r.bc.setUpper(operand);

    this.checkZFlag(this.r.bc.upper());
    this.r.f.n = 0;
  },

  '0x05': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(-1);
    this.checkHalfCarry(this.r.bc.upper(), operand);
    operand.add(this.r.bc.upper());
    this.r.bc.setUpper(operand);

    this.checkZFlag(this.r.bc.upper());
    this.r.f.n = 1;
  },

  '0x06': function (this: CPU): void {
    // load into B from pc (immediate)
    this.r.bc.setUpper(toByte(Memory.readByte(this.pc)));
  },

  '0x07': function (this: CPU): void {
    // check carry flag
    this.r.f.cy = tis.r.af.upper() >> 7;
    // left shift
    const shifted: number = this.r.af.upper() << 1;
    this.r.af.setUpper(toByte(shifted | (shifted >> 8)));
    // flag resets
    this.r.f.n = 0;
    this.r.f.h = 0;
    this.r.f.z = 0;
  },

  '0x08': function (this: CPU): void {
    Memory.writeWord(Memory.readWord(this.pc), this.sp);
  },

  '0x09': function (this: CPU): void {
    this.checkFullCarry(this.r.hl, this.r.bc);
    this.checkHalfCarry(this.r.hl.upper(), this.r.bc.upper());
    this.r.hl.add(this.r.bc);
    this.r.f.n = 0;
  },

  '0x0a': function (this: CPU): void {
    this.r.af.setUpper(toByte(Memory.readByte(this.r.bc)));
  },

  '0x0b': function (this: CPU): void {
    this.r.bc.add(-1);
  },

  '0x0c': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.bc.lower(), operand);
    // perform addition
    operand.add(this.r.bc.lower());
    this.r.bc.setLower(operand);

    this.checkZFlag(this.r.bc.lower());
    this.r.f.n = 0;
  },

  '0x0d': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.bc.lower(), operand);
    // perform addition
    operand.add(this.r.bc.lower());
    this.r.bc.setLower(operand);

    this.checkZFlag(this.r.bc.lower());
    this.r.f.n = 1;
  },

  '0x0e': function (this: CPU): void {
    // load into C from pc (immediate)
    this.r.bc.setLower(toByte(Memory.readByte(this.pc)));
  },

  '0x0f': function (this: CPU): void {
    // check carry flag
    const bitZero = this.r.af.upper() & 1;
    this.r.f.cy = btZero);
    // right shift
    const shifted: number = this.r.af.upper() >> 1;
    this.r.af.setUpper(toByte(shifted | (bitZero << 7)));
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
    this.r.de = Memory.readWord(this.pc));
  },

  '0x12': function (this: CPU): void {
    Memory.writeByte(this.r.de, this.r.af.upper());
  },

  '0x13': function (this: CPU): void {
    this.r.de.add(1);
  },

  '0x14': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.de.upper(), operand);
    // perform addition
    operand.add(this.r.de.upper());
    this.r.de.setUpper(operand);

    this.checkZFlag(this.r.de.upper());
    this.r.f.n = 0;
  },

  '0x15': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.de.upper(), operand);
    // perform addition
    operand.add(this.r.de.upper());
    this.r.de.setUpper(operand);

    this.checkZFlag(this.r.de.upper());
    this.r.f.n = 1;
  },

  '0x16': function (this: CPU): void {
    this.r.de.setUpper(toByte(Memory.readByte(this.pc)));
  },

  '0x17': function (this: CPU): void {
    // need to rotate left through the carry flag
    // get the old carry value
    const oldCY = this.r.f.cy;
    // set the carry flag to the 7th bit of A
    this.r.f.cy = tis.r.af.upper() >> 7);
    // rotate left
    let shifted = this.r.af.upper() << 1;
    // combine old flag and shifted, set to A
    this.r.af.setUpper(toByte(shifted | oldCY));
  },

  '0x18': function (this: CPU): void {
    this.pc.add(toSigned(Memory.readByte(this.pc)));
  },

  '0x19': function (this: CPU): void {
    this.checkFullCarry(this.r.hl, this.r.de);
    this.checkHalfCarry(this.r.hl.upper(), this.r.de.upper());
    this.r.hl.add(this.r.de);
    this.r.f.n = 0;
  },

  '0x1a': function (this: CPU): void {
    this.r.af.setUpper(toByte(Memory.readByte(this.r.de)));
  },

  '0x1b': function (this: CPU): void {
    this.r.de.add(-1);
  },

  '0x1c': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.de.lower(), operand);
    // perform addition
    operand.add(this.r.de.lower());
    this.r.de.setLower(operand);

    this.checkZFlag(this.r.de.lower());
    this.r.f.n = 0;
  },

  '0x1d': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.de.lower(), operand);
    // perform addition
    operand.add(this.r.de.lower());
    this.r.de.setLower(operand);

    this.checkZFlag(this.r.de.lower());
    this.r.f.n = 1;
  },

  '0x1e': function (this: CPU): void {
    this.r.de.setLower(toByte(Memory.readByte(this.pc)));
  },

  '0x1f': function (this: CPU): void {
    // rotate right through the carry flag
    // get the old carry value
    const oldCY = this.r.f.cy;
    // set the carry flag to the 0th bit of A
    this.r.f.cy = tis.r.af.upper() & 1);
    // rotate right
    let shifted = this.r.af.upper() >> 1;
    // combine old flag and shifted, set to A
    this.r.af.setUpper(toByte(shifted | (oldCY << 7)));
  },

  '0x20': function (this: CPU): boolean {
    const incr = toSigned(Memory.readByte(this.pc));
    // increment pc if zero flag was reset
    if (!this.r.f.z) {
      this.pc.add(incr);
      return true;
    }
    return false;
  },

  '0x21': function (this: CPU): void {
    this.r.hl = Memory.readWord(this.pc));
  },

  '0x22': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.af.upper());
    this.r.hl.add(1);
  },

  '0x23': function (this: CPU): void {
    this.r.hl.add(1);
  },

  '0x24': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.hl.upper(), operand);
    // perform addition
    operand.add(this.r.hl.upper());
    this.r.hl.setUpper(operand);

    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x25': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(-1);
    // check for half carry on affected byte only
    this.checkHalfCarry(this.r.hl.upper(), operand);
    // perform addition
    operand.add(this.r.hl.upper());
    this.r.hl.setUpper(operand);

    this.checkZFlag(operand);
    this.r.f.n = 1;
  },

  '0x26': function (this: CPU): void {
    this.r.hl.setUpper(toByte(Memory.readByte(this.pc)));
  },

  /**
   * DAA instruction taken from - https://forums.nesdev.com/viewtopic.php?t=15944#p196282
   */
  '0x27': function (this: CPU): void {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    if (!this.r.f.n) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (this.r.f.cy || this.r.af.upper() > 0x99) {
        this.r.af.addUpper(0x60);
        this.r.f.cy = 1;
      }
      if (this.r.f.h || (this.r.af.upper() & 0x0f) > 0x09) {
        this.r.af.addUpper(0x6);
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (this.r.f.cy) {
        this.r.af.addUpper(-0x60);
      }
      if (this.R.F.H) {
        this.r.af.addUpper(-0x6);
      }
    }
    // these flags are always updated
    const AZero = this.r.af.upper() === 0 ? 1 : 0;
    this.r.f.z = Aero); // the usual z flag
    this.r.f.h = 0; // h flag is always cleared
  },

  '0x28': function (this: CPU): boolean {
    const incr = toSigned(Memory.readByte(this.pc));
    // increment pc if zero flag was set
    if (this.r.f.z) {
      this.pc.add(incr);
      return true;
    }
    return false;
  },

  '0x29': function (this: CPU): void {
    this.checkFullCarry(this.r.hl, this.r.hl);
    this.checkHalfCarry(this.r.hl.upper(), this.r.hl.upper());
    this.r.hl.add(this.r.hl);
    this.r.f.n = 0;
  },

  '0x2a': function (this: CPU): void {
    this.r.af.setUpper(toByte(Memory.readByte(this.r.hl)));
    this.r.hl.add(1);
  },

  '0x2b': function (this: CPU): void {
    this.r.hl.add(-1);
  },

  '0x2c': function (this: CPU): void {
    const operand = toByte(1);
    this.checkHalfCarry(this.r.hl.lower(), operand);
    operand.add(this.r.hl.lower());
    this.r.hl.setLower(operand);
    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x2d': function (this: CPU): void {
    const operand = toByte(-1);
    this.checkHalfCarry(this.r.hl.lower(), operand);
    operand.add(this.r.hl.lower());
    this.r.hl.setLower(operand);
    this.checkZFlag(operand);
    this.r.f.n = 1;
  },

  '0x2e': function (this: CPU): void {
    this.r.hl.setLower(toByte(Memory.readByte(this.pc)));
  },

  '0x2f': function (this: CPU): void {
    this.r.af.setUpper(toByte(~this.r.af.upper()));
    this.r.f.n = 1;
    this.r.f.h = 1;
  },

  '0x30': function (this: CPU): boolean {
    const incr = toSigned(Memory.readByte(this.pc));
    if (!this.r.f.cy) {
      this.pc.add(incr);
      return true;
    }
    return false;
  },

  '0x31': function (this: CPU): void {
    this.sp = Memory.readWord(this.pc));
  },

  '0x32': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.af.upper());
    this.r.hl.add(-1);
  },

  '0x33': function (this: CPU): void {
    debugger;
    this.sp.add(1);
  },

  '0x34': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(1);
    const newVal: byte = toByte(Memory.readByte(this.r.hl));
    // check for half carry on affected byte only
    this.checkHalfCarry(newVal, operand);
    operand.add(this.r.hl);
    Memory.writeByte(this.r.hl, operand);

    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x35': function (this: CPU): void {
    // convert operand to unsigned
    const operand = toByte(-1);
    const newVal: byte = toByte(Memory.readByte(this.r.hl));
    // check for half carry on affected byte only
    this.checkHalfCarry(newVal, operand);
    operand.add(this.r.hl);
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
      this.pc.add(incr);
      return true;
    }
    return false;
  },

  '0x39': function (this: CPU): void {
    this.checkFullCarry(this.r.hl, this.sp);
    this.checkHalfCarry(this.r.hl.upper(), this.sp.upper());
    this.r.hl.add(this.sp);
    this.r.f.n = 0;
  },

  '0x3a': function (this: CPU): void {
    this.r.af.setUpper(toByte(Memory.readByte(this.r.hl)));
    this.r.hl.add(-1);
  },

  '0x3b': function (this: CPU): void {
    this.sp.add(-1);
  },

  '0x3c': function (this: CPU): void {
    const operand = toByte(1);
    this.checkHalfCarry(this.r.af.upper(), operand);
    operand.add(this.r.af.upper());
    this.r.af.setUpper(operand);
    this.checkZFlag(operand);
    this.r.f.n = 0;
  },

  '0x3d': function (this: CPU): void {
    const operand = toByte(-1);
    this.checkHalfCarry(this.r.af.upper(), operand);
    operand.add(this.r.af.upper());
    this.r.af.setUpper(operand);
    this.checkZFlag(operand);
    this.r.f.n = 1;
  },

  '0x3e': function (this: CPU): void {
    this.r.af.setUpper(toByte(Memory.readByte(this.pc)));
  },

  '0x3f': function (this: CPU): void {
    const { value } = this.r.f.cy;
    if (value) {
      this.r.f.cy = 0;
    } else {
      this.r.f.cy = 1;
    }
    this.r.f.n = 0;
    this.r.f.h = 0;
  },

  '0x40': function (this: CPU): void {
    this.r.bc.setUpper(this.r.bc.upper());
  },

  '0x41': function (this: CPU): void {
    this.r.bc.setUpper(this.r.bc.lower());
  },

  '0x42': function (this: CPU): void {
    this.r.bc.setUpper(this.r.de.upper());
  },

  '0x43': function (this: CPU): void {
    this.r.bc.setUpper(this.r.de.lower());
  },

  '0x44': function (this: CPU): void {
    this.r.bc.setUpper(this.r.hl.upper());
  },

  '0x45': function (this: CPU): void {
    this.r.bc.setUpper(this.r.hl.lower());
  },

  '0x46': function (this: CPU): void {
    this.r.bc.setUpper(toByte(Memory.readByte(this.r.hl)));
  },

  '0x47': function (this: CPU): void {
    this.r.bc.setUpper(this.r.af.upper());
  },

  '0x48': function (this: CPU): void {
    this.r.bc.setLower(this.r.bc.upper());
  },

  '0x49': function (this: CPU): void {
    this.r.bc.setLower(this.r.bc.lower());
  },

  '0x4a': function (this: CPU): void {
    this.r.bc.setLower(this.r.de.upper());
  },

  '0x4b': function (this: CPU): void {
    this.r.bc.setLower(this.r.de.lower());
  },

  '0x4c': function (this: CPU): void {
    this.r.bc.setLower(this.r.hl.upper());
  },

  '0x4d': function (this: CPU): void {
    this.r.bc.setLower(this.r.hl.lower());
  },

  '0x4e': function (this: CPU): void {
    this.r.bc.setLower(toByte(Memory.readByte(this.r.hl)));
  },

  '0x4f': function (this: CPU): void {
    this.r.bc.setLower(this.r.af.upper());
  },

  '0x50': function (this: CPU): void {
    this.r.de.setUpper(this.r.bc.upper());
  },

  '0x51': function (this: CPU): void {
    this.r.de.setUpper(this.r.bc.lower());
  },

  '0x52': function (this: CPU): void {
    this.r.de.setUpper(this.r.de.upper());
  },

  '0x53': function (this: CPU): void {
    this.r.de.setUpper(this.r.de.lower());
  },

  '0x54': function (this: CPU): void {
    this.r.de.setUpper(this.r.hl.upper());
  },

  '0x55': function (this: CPU): void {
    this.r.de.setUpper(this.r.hl.lower());
  },

  '0x56': function (this: CPU): void {
    this.r.de.setUpper(toByte(Memory.readByte(this.r.hl)));
  },

  '0x57': function (this: CPU): void {
    this.r.de.setUpper(this.r.af.upper());
  },

  '0x58': function (this: CPU): void {
    this.r.de.setLower(this.r.bc.upper());
  },

  '0x59': function (this: CPU): void {
    this.r.de.setLower(this.r.bc.upper());
  },

  '0x5a': function (this: CPU): void {
    this.r.de.setLower(this.r.de.upper());
  },

  '0x5b': function (this: CPU): void {
    this.r.de.setLower(this.r.de.lower());
  },

  '0x5c': function (this: CPU): void {
    this.r.de.setLower(this.r.hl.upper());
  },

  '0x5d': function (this: CPU): void {
    this.r.de.setLower(this.r.hl.lower());
  },

  '0x5e': function (this: CPU): void {
    this.r.de.setLower(toByte(Memory.readByte(this.r.hl)));
  },

  '0x5f': function (this: CPU): void {
    this.r.de.setLower(this.r.af.upper());
  },

  '0x60': function (this: CPU): void {
    this.r.hl.setUpper(this.r.bc.upper());
  },

  '0x61': function (this: CPU): void {
    this.r.hl.setUpper(this.r.bc.lower());
  },

  '0x62': function (this: CPU): void {
    this.r.hl.setUpper(this.r.de.upper());
  },

  '0x63': function (this: CPU): void {
    this.r.hl.setUpper(this.r.de.lower());
  },

  '0x64': function (this: CPU): void {
    this.r.hl.setUpper(this.r.hl.upper());
  },

  '0x65': function (this: CPU): void {
    this.r.hl.setUpper(this.r.hl.lower());
  },

  '0x66': function (this: CPU): void {
    this.r.hl.setUpper(toByte(Memory.readByte(this.r.hl)));
  },

  '0x67': function (this: CPU): void {
    this.r.hl.setUpper(this.r.af.upper());
  },

  '0x68': function (this: CPU): void {
    this.r.hl.setLower(this.r.bc.upper());
  },

  '0x69': function (this: CPU): void {
    this.r.hl.setLower(this.r.bc.lower());
  },

  '0x6a': function (this: CPU): void {
    this.r.hl.setLower(this.r.de.upper());
  },

  '0x6b': function (this: CPU): void {
    this.r.hl.setLower(this.r.de.lower());
  },

  '0x6c': function (this: CPU): void {
    this.r.hl.setLower(this.r.hl.upper());
  },

  '0x6d': function (this: CPU): void {
    this.r.hl.setLower(this.r.hl.lower());
  },

  '0x6e': function (this: CPU): void {
    this.r.hl.setLower(toByte(Memory.readByte(this.r.hl)));
  },

  '0x6f': function (this: CPU): void {
    this.r.hl.setLower(this.r.af.upper());
  },

  '0x70': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.bc.upper());
  },

  '0x71': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.bc.lower());
  },

  '0x72': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.de.upper());
  },

  '0x73': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.de.lower());
  },

  '0x74': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.hl.upper());
  },

  '0x75': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.hl.lower());
  },

  '0x76': function (this: CPU): void {
    this.halted = true;
  },

  '0x77': function (this: CPU): void {
    Memory.writeByte(this.r.hl, this.r.af.upper());
  },

  '0x78': function (this: CPU): void {
    this.r.af.setUpper(this.r.bc.upper());
  },

  '0x79': function (this: CPU): void {
    this.r.af.setUpper(this.r.bc.lower());
  },

  '0x7a': function (this: CPU): void {
    this.r.af.setUpper(this.r.de.upper());
  },

  '0x7b': function (this: CPU): void {
    this.r.af.setUpper(this.r.de.lower());
  },

  '0x7c': function (this: CPU): void {
    this.r.af.setUpper(this.r.hl.upper());
  },

  '0x7d': function (this: CPU): void {
    this.r.af.setUpper(this.r.hl.lower());
  },

  '0x7e': function (this: CPU): void {
    this.r.af.setUpper(toByte(Memory.readByte(this.r.hl)));
  },

  '0x7f': function (this: CPU): void {
    this.r.af.setUpper(this.r.af.upper());
  },

  '0x80': function (this: CPU): void {
    ADD.call(this, this.r.bc.upper());
  },

  '0x81': function (this: CPU): void {
    ADD.call(this, this.r.bc.lower());
  },

  '0x82': function (this: CPU): void {
    ADD.call(this, this.r.de.upper());
  },

  '0x83': function (this: CPU): void {
    ADD.call(this, this.r.de.lower());
  },

  '0x84': function (this: CPU): void {
    ADD.call(this, this.r.hl.upper());
  },

  '0x85': function (this: CPU): void {
    ADD.call(this, this.r.hl.lower());
  },

  '0x86': function (this: CPU): void {
    ADD.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x87': function (this: CPU): void {
    ADD.call(this, this.r.af.upper());
  },

  '0x88': function (this: CPU): void {
    ADC.call(this, this.r.bc.upper());
  },

  '0x89': function (this: CPU): void {
    ADC.call(this, this.r.bc.lower());
  },

  '0x8a': function (this: CPU): void {
    ADC.call(this, this.r.de.upper());
  },

  '0x8b': function (this: CPU): void {
    ADC.call(this, this.r.de.lower());
  },

  '0x8c': function (this: CPU): void {
    ADC.call(this, this.r.hl.upper());
  },

  '0x8d': function (this: CPU): void {
    ADC.call(this, this.r.hl.lower());
  },

  '0x8e': function (this: CPU): void {
    ADC.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x8f': function (this: CPU): void {
    ADC.call(this, this.r.af.upper());
  },

  '0x90': function (this: CPU): void {
    SUB.call(this, this.r.bc.upper());
  },

  '0x91': function (this: CPU): void {
    SUB.call(this, this.r.bc.lower());
  },

  '0x92': function (this: CPU): void {
    SUB.call(this, this.r.de.upper());
  },

  '0x93': function (this: CPU): void {
    SUB.call(this, this.r.de.lower());
  },

  '0x94': function (this: CPU): void {
    SUB.call(this, this.r.hl.upper());
  },

  '0x95': function (this: CPU): void {
    SUB.call(this, this.r.hl.lower());
  },

  '0x96': function (this: CPU): void {
    SUB.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x97': function (this: CPU): void {
    SUB.call(this, this.r.af.upper());
  },

  '0x98': function (this: CPU): void {
    SBC.call(this, this.r.bc.upper());
  },

  '0x99': function (this: CPU): void {
    SBC.call(this, this.r.bc.lower());
  },

  '0x9a': function (this: CPU): void {
    SBC.call(this, this.r.de.upper());
  },

  '0x9b': function (this: CPU): void {
    SBC.call(this, this.r.de.lower());
  },

  '0x9c': function (this: CPU): void {
    SBC.call(this, this.r.hl.upper());
  },

  '0x9d': function (this: CPU): void {
    SBC.call(this, this.r.hl.lower());
  },

  '0x9e': function (this: CPU): void {
    SBC.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0x9f': function (this: CPU): void {
    SBC.call(this, this.r.af.upper());
  },

  '0xa0': function (this: CPU): void {
    AND.call(this, this.r.bc.upper());
  },

  '0xa1': function (this: CPU): void {
    AND.call(this, this.r.bc.lower());
  },

  '0xa2': function (this: CPU): void {
    AND.call(this, this.r.de.upper());
  },

  '0xa3': function (this: CPU): void {
    AND.call(this, this.r.de.lower());
  },

  '0xa4': function (this: CPU): void {
    AND.call(this, this.r.hl.upper());
  },

  '0xa5': function (this: CPU): void {
    AND.call(this, this.r.hl.lower());
  },

  '0xa6': function (this: CPU): void {
    AND.call(this, Memory.readByte(this.r.hl));
  },

  '0xa7': function (this: CPU): void {
    AND.call(this, this.r.af.upper());
  },

  '0xa8': function (this: CPU): void {
    XOR.call(this, this.r.bc.upper());
  },

  '0xa9': function (this: CPU): void {
    XOR.call(this, this.r.bc.lower());
  },

  '0xaa': function (this: CPU): void {
    XOR.call(this, this.r.de.upper());
  },

  '0xab': function (this: CPU): void {
    XOR.call(this, this.r.de.lower());
  },

  '0xac': function (this: CPU): void {
    XOR.call(this, this.r.hl.upper());
  },

  '0xad': function (this: CPU): void {
    XOR.call(this, this.r.hl.lower());
  },

  '0xae': function (this: CPU): void {
    XOR.call(this, Memory.readByte(this.r.hl));
  },

  '0xaf': function (this: CPU): void {
    XOR.call(this, this.r.af.upper());
  },

  '0xb0': function (this: CPU): void {
    OR.call(this, this.r.bc.upper());
  },

  '0xb1': function (this: CPU): void {
    OR.call(this, this.r.bc.lower());
  },

  '0xb2': function (this: CPU): void {
    OR.call(this, this.r.de.upper());
  },

  '0xb3': function (this: CPU): void {
    OR.call(this, this.r.de.lower());
  },

  '0xb4': function (this: CPU): void {
    OR.call(this, this.r.hl.upper());
  },

  '0xb5': function (this: CPU): void {
    OR.call(this, this.r.hl.lower());
  },

  '0xb6': function (this: CPU): void {
    OR.call(this, Memory.readByte(this.r.hl));
  },

  '0xb7': function (this: CPU): void {
    OR.call(this, this.r.af.upper());
  },

  '0xb8': function (this: CPU): void {
    CP.call(this, this.r.bc.upper());
  },

  '0xb9': function (this: CPU): void {
    CP.call(this, this.r.bc.lower());
  },

  '0xba': function (this: CPU): void {
    CP.call(this, this.r.de.upper());
  },

  '0xbb': function (this: CPU): void {
    CP.call(this, this.r.de.lower());
  },

  '0xbc': function (this: CPU): void {
    CP.call(this, this.r.hl.upper());
  },

  '0xbd': function (this: CPU): void {
    CP.call(this, this.r.hl.lower());
  },

  '0xbe': function (this: CPU): void {
    CP.call(this, toByte(Memory.readByte(this.r.hl)));
  },

  '0xbf': function (this: CPU): void {
    CP.call(this, this.r.af.upper());
  },

  '0xc0': function (this: CPU): boolean {
    return RET.call(this, !this.r.f.z);
  },

  '0xc1': function (this: CPU): void {
    POP.call(this, this.r.bc);
  },

  '0xc2': function (this: CPU): boolean {
    return Jpcc.call(this, !this.r.f.z);
  },

  '0xc3': function (this: CPU): void {
    this.pc = Memory.readWord(this.pc));
  },

  '0xc4': function (this: CPU): boolean {
    return CALL.call(this, !this.r.f.z);
  },

  '0xc5': function (this: CPU): void {
    PUSH.call(this, this.r.bc);
  },

  '0xc6': function (this: CPU): void {
    const value = toByte(Memory.readByte(this.pc));
    this.checkFullCarry(this.r.af.upper(), value);
    this.checkHalfCarry(this.r.af.upper(), value);
    this.r.af.addUpper(value);
    this.checkZFlag(this.r.af.upper());
    this.r.f.n = 0;
  },

  '0xc7': function (this: CPU): void {
    RST.call(this, 0x00);
  },

  '0xc8': function (this: CPU): boolean {
    if (this.r.f.z) {
      const address = Memory.readWord(this.sp);
      this.pc = adress);
      this.sp.add(2);
      return true;
    }
    return false;
  },

  '0xc9': function (this: CPU): void {
    RET.call(this, true);
  },

  '0xca': function (this: CPU): boolean {
    return Jpcc.call(this, this.r.f.z);
  },

  '0xcb': function (this: CPU): void {
    const opcode: number = Memory.readByte(this.pc);
    if (opcode in cbMap) {
      cbMap[opcode].call(this);
    } else {
      throw new Error('Tried to call out-of-range CB opcode.');
    }
  },

  '0xcc': function (this: CPU): boolean {
    return CALL.call(this, this.r.f.z);
  },

  '0xcd': function (this: CPU): void {
    CALL.call(this, true);
  },

  '0xce': function (this: CPU): void {
    ADC.call(this, toByte(Memory.readByte(this.pc)));
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
    return Jpcc.call(this, this.r.f.z);
  },

  '0xd3': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xd4': function (this: CPU): boolean {
    return CALL.call(this, !this.r.f.cy);
  },

  '0xd5': function (this: CPU): void {
    PUSH.call(this, this.r.de);
  },

  '0xd6': function (this: CPU): void {
    SUB.call(this, toByte(Memory.readByte(this.pc)));
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
    return Jpcc.call(this, this.r.f.cy);
  },

  '0xdb': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xdc': function (this: CPU): boolean {
    return CALL.call(this, this.r.f.cy);
  },

  '0xdd': function (this: CPU): void {
    throw new Error('Tried to call illegal opcode.');
  },

  '0xde': function (this: CPU): void {
    SBC.call(this, toByte(Memory.readByte(this.pc)));
  },

  '0xdf': function (this: CPU): void {
    RST.call(this, 0x18);
  },

  '0xe0': function (this: CPU): void {
    Memory.writeByte(0xff00 + Memory.readByte(this.pc), this.r.af.upper());
  },

  '0xe1': function (this: CPU): void {
    POP.call(this, this.r.hl);
  },

  '0xe2': function (this: CPU): void {
    Memory.writeByte(0xff00 + this.r.bc.lower(), this.r.af.upper());
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
  },

  '0xe7': function (this: CPU): void {
    RST.call(this, 0x20);
  },

  '0xe8': function (this: CPU): void {
    const operand = toWord(toSigned(Memory.readByte(this.pc)));
    this.checkFullCarry(this.sp, operand);
    this.checkHalfCarry(this.sp.upper(), operand.upper());
    this.sp.add(operand);
    this.r.f.z = 0;
    this.r.f.n = 0;
  },

  '0xe9': function (this: CPU): void {
    this.pc = tis.r.hl);
  },

  '0xea': function (this: CPU): void {
    Memory.writeByte(Memory.readWord(this.pc), this.r.af.upper());
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
  },

  '0xef': function (this: CPU): void {
    RST.call(this, 0x28);
  },

  '0xf0': function (this: CPU): void {
    const address = toByte(Memory.readByte(0xff00 + Memory.readByte(this.pc)));
    this.r.af.setUpper(address);
  },

  '0xf1': function (this: CPU): void {
    POP.call(this, this.r.af);
  },

  '0xf2': function (this: CPU): void {
    const address = toByte(0xff00 + this.r.bc.lower());
    this.r.af.setUpper(address);
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
  },

  '0xf7': function (this: CPU): void {
    RST.call(this, 0x30);
  },

  '0xf8': function (this: CPU): void {
    let incr = toWord(toSigned(Memory.readByte(this.pc)));
    this.checkHalfCarry(incr.upper(), this.sp.upper());
    this.checkFullCarry(incr, this.sp);
    incr.add(this.sp);
    this.r.hl = icr);
    this.r.f.z = 0;
    this.r.f.n = 0;
  },

  '0xf9': function (this: CPU): void {
    this.sp = tis.r.hl);
  },

  '0xfa': function (this: CPU): void {
    this.r.af.setUpper(toByte(Memory.readByte(Memory.readWord(this.pc))));
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
  },

  '0xff': function (this: CPU): void {
    RST.call(this, 0x38);
  },
};

const cbMap: OpcodeList = {
  '0x00': function (this: CPU): void {},
};
