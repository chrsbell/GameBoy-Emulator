import CPU from '..';
import {
  addByte,
  addLower,
  addUpper,
  addWord,
  byte,
  lower,
  OpcodeList,
  setLower,
  setUpper,
  toByte,
  toHex,
  toSigned,
  toWord,
  upper,
  word,
} from '../../../helpers/Primitives';
import Memory from '../../Memory';

function ADD(cpu: CPU, operand: byte): void {
  cpu.checkFullCarry8(upper(cpu.r.af), operand);
  cpu.checkHalfCarry(upper(cpu.r.af), operand);
  cpu.r.af = addUpper(cpu.r.af, operand);
  cpu.checkZFlag(upper(cpu.r.af));
  cpu.setNFlag(0);
}

function ADC(cpu: CPU, operand: byte): void {
  operand = addByte(operand, cpu.getCYFlag());
  cpu.checkFullCarry8(upper(cpu.r.af), operand);
  cpu.checkHalfCarry(upper(cpu.r.af), operand);
  cpu.r.af = addUpper(cpu.r.af, operand);
  cpu.checkZFlag(upper(cpu.r.af));
  cpu.setNFlag(0);
}

function SUB(cpu: CPU, operand: byte): void {
  cpu.checkFullCarry8(upper(cpu.r.af), operand, true);
  cpu.checkHalfCarry(upper(cpu.r.af), operand, true);
  cpu.r.af = toWord(addUpper(cpu.r.af, -operand));
  cpu.checkZFlag(upper(cpu.r.af));
  cpu.setNFlag(1);
}

function SBC(cpu: CPU, operand: byte): void {
  const carry = cpu.getCYFlag() ? -1 : 0;
  operand = addByte(operand, carry);
  cpu.checkFullCarry8(upper(cpu.r.af), operand, true);
  cpu.checkHalfCarry(upper(cpu.r.af), operand, true);
  cpu.r.af = toWord(addUpper(cpu.r.af, -operand));
  cpu.checkZFlag(upper(cpu.r.af));
  cpu.setNFlag(1);
}

function OR(cpu: CPU, operand: byte): void {
  const result = upper(cpu.r.af) | operand;
  cpu.r.af = setUpper(cpu.r.af, toByte(result));
  cpu.checkZFlag(upper(cpu.r.af));
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  cpu.setCYFlag(0);
}

function AND(cpu: CPU, operand: byte): void {
  const result = upper(cpu.r.af) & operand;
  cpu.r.af = setUpper(cpu.r.af, toByte(result));
  cpu.checkZFlag(upper(cpu.r.af));
  cpu.setNFlag(0);
  cpu.setHFlag(1);
  cpu.setCYFlag(0);
}

function XOR(cpu: CPU, operand: byte): void {
  const result = upper(cpu.r.af) ^ operand;
  cpu.r.af = setUpper(cpu.r.af, toByte(result));
  cpu.checkZFlag(upper(cpu.r.af));
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  cpu.setCYFlag(0);
}

function CP(cpu: CPU, operand: byte): void {
  cpu.checkFullCarry8(upper(cpu.r.af), operand, true);
  cpu.checkHalfCarry(upper(cpu.r.af), operand, true);
  const result: byte = addByte(upper(cpu.r.af), -operand);
  cpu.setNFlag(1);
  cpu.checkZFlag(result);
}

function CALL(cpu: CPU, memory: Memory, flag: boolean): boolean {
  if (flag) {
    cpu.sp = addWord(cpu.sp, -2);
    memory.writeWord(cpu.sp, toWord(cpu.pc + 2));
    cpu.pc = memory.readWord(cpu.pc);
    return true;
  }
  return false;
}

function PUSH(cpu: CPU, memory: Memory, register: word): void {
  cpu.sp = addWord(cpu.sp, -1);
  memory.writeByte(cpu.sp, upper(register));
  cpu.sp = addWord(cpu.sp, -1);
  memory.writeByte(cpu.sp, lower(register));
}

function POP(cpu: CPU, memory: Memory): word {
  const value: word = memory.readWord(cpu.sp);
  cpu.sp = addWord(cpu.sp, 2);
  return value;
}

function Jpcc(cpu: CPU, memory: Memory, flag: boolean): boolean {
  if (flag) {
    cpu.pc = memory.readWord(cpu.pc);
    return true;
  }
  return false;
}

function RET(cpu: CPU, memory: Memory, flag: boolean): boolean {
  if (flag) {
    cpu.pc = memory.readWord(cpu.sp);
    cpu.sp = addWord(cpu.sp, 2);
    return true;
  }
  return false;
}

function RST(cpu: CPU, memory: Memory, address: word): void {
  cpu.sp = addWord(cpu.sp, -2);
  memory.writeWord(cpu.sp, cpu.pc);
  cpu.pc = address;
}

const OpcodeMap: OpcodeList = {
  0x00: function (cpu: CPU, memory: Memory): void {},

  0x01: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = memory.readWord(cpu.pc);
    cpu.pc += 2;
  },

  0x02: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.bc, upper(cpu.r.af));
  },

  0x03: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = addWord(cpu.r.bc, 1);
  },

  0x04: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(upper(cpu.r.bc), operand);
    // perform addition
    operand = addByte(operand, upper(cpu.r.bc));
    cpu.r.bc = setUpper(cpu.r.bc, operand);

    cpu.checkZFlag(upper(cpu.r.bc));
    cpu.setNFlag(0);
  },

  0x05: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(upper(cpu.r.bc), 1, true);
    cpu.r.bc = addUpper(cpu.r.bc, toByte(-1));
    cpu.checkZFlag(upper(cpu.r.bc));
    cpu.setNFlag(1);
  },

  0x06: function (cpu: CPU, memory: Memory): void {
    // load into B from pc (immediate)
    cpu.r.bc = setUpper(cpu.r.bc, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x07: function (cpu: CPU, memory: Memory): void {
    // check carry flag
    cpu.setCYFlag(upper(cpu.r.af) >> 7);
    // left shift
    const shifted: byte = upper(cpu.r.af) << 1;
    cpu.r.af = setUpper(cpu.r.af, toByte(shifted | (shifted >> 8)));
    // flag resets
    cpu.setNFlag(0);
    cpu.setHFlag(0);
    cpu.setZFlag(0);
  },

  0x08: function (cpu: CPU, memory: Memory): void {
    memory.writeWord(memory.readWord(cpu.pc), cpu.sp);
  },

  0x09: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.r.bc);
    cpu.checkHalfCarry(upper(cpu.r.hl), upper(cpu.r.bc));
    cpu.r.hl = addWord(cpu.r.hl, cpu.r.bc);
    cpu.setNFlag(0);
  },

  0x0a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, toByte(memory.readByte(cpu.r.bc)));
  },

  0x0b: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = addWord(cpu.r.bc, -1);
  },

  0x0c: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(lower(cpu.r.bc), operand);
    // perform addition
    operand = addByte(operand, lower(cpu.r.bc));
    cpu.r.bc = setLower(cpu.r.bc, operand);

    cpu.checkZFlag(lower(cpu.r.bc));
    cpu.setNFlag(0);
  },

  0x0d: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    cpu.checkHalfCarry(lower(cpu.r.bc), 1, true);
    cpu.r.bc = addLower(cpu.r.bc, toByte(-1));
    cpu.checkZFlag(lower(cpu.r.bc));
    cpu.setNFlag(1);
  },

  0x0e: function (cpu: CPU, memory: Memory): void {
    // load into C from pc (immediate)
    cpu.r.bc = setLower(cpu.r.bc, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x0f: function (cpu: CPU, memory: Memory): void {
    // check carry flag
    const bitZero = upper(cpu.r.af) & 1;
    cpu.setCYFlag(bitZero);
    // right shift
    const shifted: byte = upper(cpu.r.af) >> 1;
    cpu.r.af = setUpper(cpu.r.af, toByte(shifted | (bitZero << 7)));
    // flag resets
    cpu.setNFlag(0);
    cpu.setHFlag(0);
    cpu.setZFlag(0);
  },

  0x10: function (cpu: CPU, memory: Memory): void {
    cpu.halted = true;
    console.log('Instruction halted.');
    throw new Error();
  },

  0x11: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = memory.readWord(cpu.pc);
    cpu.pc += 2;
  },

  0x12: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.de, upper(cpu.r.af));
  },

  0x13: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = addWord(cpu.r.de, 1);
  },

  0x14: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(upper(cpu.r.de), operand);
    // perform addition
    operand = addByte(operand, upper(cpu.r.de));
    cpu.r.de = setUpper(cpu.r.de, operand);

    cpu.checkZFlag(upper(cpu.r.de));
    cpu.setNFlag(0);
  },

  0x15: function (cpu: CPU, memory: Memory): void {
    // check for half carry on affected byte only
    cpu.checkHalfCarry(upper(cpu.r.de), 1, true);
    cpu.r.de = addUpper(cpu.r.de, toByte(-1));
    cpu.checkZFlag(upper(cpu.r.de));
    cpu.setNFlag(1);
  },

  0x16: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x17: function (cpu: CPU, memory: Memory): void {
    // need to rotate left through the carry flag
    // get the old carry value
    const oldCY = cpu.getCYFlag();
    // set the carry flag to the 7th bit of A
    cpu.setCYFlag(upper(cpu.r.af) >> 7);
    // rotate left
    const shifted = upper(cpu.r.af) << 1;
    // combine old flag and shifted, set to A
    cpu.r.af = setUpper(cpu.r.af, toByte(shifted | oldCY));
    cpu.setHFlag(0);
    cpu.setNFlag(0);
    cpu.setZFlag(0);
  },

  0x18: function (cpu: CPU, memory: Memory): void {
    cpu.pc = addWord(cpu.pc, toSigned(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x19: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.r.de);
    cpu.checkHalfCarry(upper(cpu.r.hl), upper(cpu.r.de));
    cpu.r.hl = addWord(cpu.r.hl, cpu.r.de);
    cpu.setNFlag(0);
  },

  0x1a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, toByte(memory.readByte(cpu.r.de)));
  },

  0x1b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = addWord(cpu.r.de, -1);
  },

  0x1c: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(lower(cpu.r.de), operand);
    // perform addition
    operand = addByte(operand, lower(cpu.r.de));
    cpu.r.de = setLower(cpu.r.de, operand);

    cpu.checkZFlag(lower(cpu.r.de));
    cpu.setNFlag(0);
  },

  0x1d: function (cpu: CPU, memory: Memory): void {
    // check for half carry on affected byte only
    cpu.checkHalfCarry(lower(cpu.r.de), 1, true);
    cpu.r.de = addLower(cpu.r.de, toByte(-1));
    cpu.checkZFlag(lower(cpu.r.de));
    cpu.setNFlag(1);
  },

  0x1e: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x1f: function (cpu: CPU, memory: Memory): void {
    // rotate right through the carry flag
    // get the old carry value
    const oldCY = cpu.getCYFlag();
    // set the carry flag to the 0th bit of A
    cpu.setCYFlag(upper(cpu.r.af) & 1);
    // rotate right
    const shifted = upper(cpu.r.af) >> 1;
    // combine old flag and shifted, set to A
    cpu.r.af = setUpper(cpu.r.af, toByte(shifted | (oldCY << 7)));
    cpu.setHFlag(0);
    cpu.setNFlag(0);
    cpu.setZFlag(0);
  },

  0x20: function (cpu: CPU, memory: Memory): boolean {
    const incr = toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;

    if (!cpu.getZFlag()) {
      // increment pc if zero flag was reset
      cpu.pc = addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x21: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = memory.readWord(cpu.pc);
    cpu.pc += 2;
  },

  0x22: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, upper(cpu.r.af));
    cpu.r.hl = addWord(cpu.r.hl, 1);
  },

  0x23: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = addWord(cpu.r.hl, 1);
  },

  0x24: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(upper(cpu.r.hl), operand);
    // perform addition
    operand = addByte(operand, upper(cpu.r.hl));
    cpu.r.hl = setUpper(cpu.r.hl, operand);

    cpu.checkZFlag(operand);
    cpu.setNFlag(0);
  },

  0x25: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(upper(cpu.r.hl), 1, true);
    cpu.r.hl = addUpper(cpu.r.hl, toByte(-1));
    cpu.checkZFlag(upper(cpu.r.hl));
    cpu.setNFlag(1);
  },

  0x26: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  /**
   * DAA instruction taken from - https://forums.nesdev.com/viewtopic.php?t=15944#p196282
   */
  0x27: function (cpu: CPU, memory: Memory): void {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    if (!cpu.getNFlag()) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (cpu.getCYFlag() || upper(cpu.r.af) > 0x99) {
        cpu.r.af = addUpper(cpu.r.af, 0x60);
        cpu.setCYFlag(1);
      }
      if (cpu.getHFlag() || (upper(cpu.r.af) & 0x0f) > 0x09) {
        cpu.r.af = addUpper(cpu.r.af, 0x6);
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (cpu.getCYFlag()) {
        cpu.r.af = addUpper(cpu.r.af, -0x60);
      }
      if (cpu.getHFlag()) {
        cpu.r.af = addUpper(cpu.r.af, -0x6);
      }
    }
    // these flags are always updated
    cpu.checkZFlag(upper(cpu.r.af));
    cpu.setHFlag(0); // h flag is always cleared
  },

  0x28: function (cpu: CPU, memory: Memory): boolean {
    const incr = toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;
    if (cpu.getZFlag()) {
      cpu.pc = addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x29: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.r.hl);
    cpu.checkHalfCarry(upper(cpu.r.hl), upper(cpu.r.hl));
    cpu.r.hl = addWord(cpu.r.hl, cpu.r.hl);
    cpu.setNFlag(0);
  },

  0x2a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, toByte(memory.readByte(cpu.r.hl)));
    cpu.r.hl = addWord(cpu.r.hl, 1);
  },

  0x2b: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = addWord(cpu.r.hl, -1);
  },

  0x2c: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(lower(cpu.r.hl), 1);
    cpu.r.hl = addLower(cpu.r.hl, 1);
    cpu.checkZFlag(lower(cpu.r.hl));
    cpu.setNFlag(0);
  },

  0x2d: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(lower(cpu.r.hl), 1, true);
    cpu.r.hl = addLower(cpu.r.hl, toByte(-1));
    cpu.checkZFlag(lower(cpu.r.hl));
    cpu.setNFlag(1);
  },

  0x2e: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x2f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, toByte(~upper(cpu.r.af)));
    cpu.setNFlag(1);
    cpu.setHFlag(1);
  },

  0x30: function (cpu: CPU, memory: Memory): boolean {
    const incr = toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;
    if (!cpu.getCYFlag()) {
      cpu.pc = addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x31: function (cpu: CPU, memory: Memory): void {
    cpu.sp = memory.readWord(cpu.pc);
    cpu.pc += 2;
  },

  0x32: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, upper(cpu.r.af));
    cpu.r.hl = addWord(cpu.r.hl, -1);
  },

  0x33: function (cpu: CPU, memory: Memory): void {
    cpu.sp = addWord(cpu.sp, 1);
  },

  0x34: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    const newVal: byte = toByte(memory.readByte(cpu.r.hl));
    // check for half carry on affected byte only
    cpu.checkHalfCarry(newVal, operand);
    operand = addByte(operand, newVal);
    memory.writeByte(cpu.r.hl, operand);

    cpu.checkZFlag(operand);
    cpu.setNFlag(0);
  },

  0x35: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let newVal: byte = toByte(memory.readByte(cpu.r.hl));
    // check for half carry on affected byte only
    cpu.checkHalfCarry(newVal, 1, true);
    newVal = addByte(newVal, toByte(-1));
    memory.writeByte(cpu.r.hl, newVal);
    cpu.checkZFlag(newVal);
    cpu.setNFlag(1);
  },

  0x36: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x37: function (cpu: CPU, memory: Memory): void {
    cpu.setCYFlag(1);
    cpu.setNFlag(0);
    cpu.setHFlag(0);
  },

  0x38: function (cpu: CPU, memory: Memory): boolean {
    const incr = toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;
    if (cpu.getCYFlag()) {
      cpu.pc = addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x39: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.sp);
    cpu.checkHalfCarry(upper(cpu.r.hl), upper(cpu.sp));
    cpu.r.hl = addWord(cpu.r.hl, cpu.sp);
    cpu.setNFlag(0);
  },

  0x3a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, toByte(memory.readByte(cpu.r.hl)));
    cpu.r.hl = addWord(cpu.r.hl, -1);
  },

  0x3b: function (cpu: CPU, memory: Memory): void {
    cpu.sp = addWord(cpu.sp, -1);
  },

  0x3c: function (cpu: CPU, memory: Memory): void {
    let operand: byte = 1;
    cpu.checkHalfCarry(upper(cpu.r.af), operand);
    operand = addByte(operand, upper(cpu.r.af));
    cpu.r.af = setUpper(cpu.r.af, operand);
    cpu.checkZFlag(operand);
    cpu.setNFlag(0);
  },

  0x3d: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(upper(cpu.r.af), 1, true);
    cpu.r.af = addUpper(cpu.r.af, toByte(-1));
    cpu.checkZFlag(upper(cpu.r.af));
    cpu.setNFlag(1);
  },

  0x3e: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x3f: function (cpu: CPU, memory: Memory): void {
    if (cpu.getCYFlag()) {
      cpu.setCYFlag(0);
    } else {
      cpu.setCYFlag(1);
    }
    cpu.setNFlag(0);
    cpu.setHFlag(0);
  },

  0x40: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, upper(cpu.r.bc));
  },

  0x41: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, lower(cpu.r.bc));
  },

  0x42: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, upper(cpu.r.de));
  },

  0x43: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, lower(cpu.r.de));
  },

  0x44: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, upper(cpu.r.hl));
  },

  0x45: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, lower(cpu.r.hl));
  },

  0x46: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, toByte(memory.readByte(cpu.r.hl)));
  },

  0x47: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, upper(cpu.r.af));
  },

  0x48: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, upper(cpu.r.bc));
  },

  0x49: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, lower(cpu.r.bc));
  },

  0x4a: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, upper(cpu.r.de));
  },

  0x4b: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, lower(cpu.r.de));
  },

  0x4c: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, upper(cpu.r.hl));
  },

  0x4d: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, lower(cpu.r.hl));
  },

  0x4e: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, toByte(memory.readByte(cpu.r.hl)));
  },

  0x4f: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, upper(cpu.r.af));
  },

  0x50: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, upper(cpu.r.bc));
  },

  0x51: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, lower(cpu.r.bc));
  },

  0x52: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, upper(cpu.r.de));
  },

  0x53: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, lower(cpu.r.de));
  },

  0x54: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, upper(cpu.r.hl));
  },

  0x55: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, lower(cpu.r.hl));
  },

  0x56: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, toByte(memory.readByte(cpu.r.hl)));
  },

  0x57: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, upper(cpu.r.af));
  },

  0x58: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, upper(cpu.r.bc));
  },

  0x59: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, upper(cpu.r.bc));
  },

  0x5a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, upper(cpu.r.de));
  },

  0x5b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, lower(cpu.r.de));
  },

  0x5c: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, upper(cpu.r.hl));
  },

  0x5d: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, lower(cpu.r.hl));
  },

  0x5e: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, toByte(memory.readByte(cpu.r.hl)));
  },

  0x5f: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, upper(cpu.r.af));
  },

  0x60: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, upper(cpu.r.bc));
  },

  0x61: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, lower(cpu.r.bc));
  },

  0x62: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, upper(cpu.r.de));
  },

  0x63: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, lower(cpu.r.de));
  },

  0x64: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, upper(cpu.r.hl));
  },

  0x65: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, lower(cpu.r.hl));
  },

  0x66: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, toByte(memory.readByte(cpu.r.hl)));
  },

  0x67: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, upper(cpu.r.af));
  },

  0x68: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, upper(cpu.r.bc));
  },

  0x69: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, lower(cpu.r.bc));
  },

  0x6a: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, upper(cpu.r.de));
  },

  0x6b: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, lower(cpu.r.de));
  },

  0x6c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, upper(cpu.r.hl));
  },

  0x6d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, lower(cpu.r.hl));
  },

  0x6e: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, toByte(memory.readByte(cpu.r.hl)));
  },

  0x6f: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, upper(cpu.r.af));
  },

  0x70: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, upper(cpu.r.bc));
  },

  0x71: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, lower(cpu.r.bc));
  },

  0x72: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, upper(cpu.r.de));
  },

  0x73: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, lower(cpu.r.de));
  },

  0x74: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, upper(cpu.r.hl));
  },

  0x75: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, lower(cpu.r.hl));
  },

  0x76: function (cpu: CPU, memory: Memory): void {
    cpu.halted = true;
  },

  0x77: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, upper(cpu.r.af));
  },

  0x78: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, upper(cpu.r.bc));
  },

  0x79: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, lower(cpu.r.bc));
  },

  0x7a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, upper(cpu.r.de));
  },

  0x7b: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, lower(cpu.r.de));
  },

  0x7c: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, upper(cpu.r.hl));
  },

  0x7d: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, lower(cpu.r.hl));
  },

  0x7e: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, toByte(memory.readByte(cpu.r.hl)));
  },

  0x7f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, upper(cpu.r.af));
  },

  0x80: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, upper(cpu.r.bc));
  },

  0x81: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, lower(cpu.r.bc));
  },

  0x82: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, upper(cpu.r.de));
  },

  0x83: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, lower(cpu.r.de));
  },

  0x84: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, upper(cpu.r.hl));
  },

  0x85: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, lower(cpu.r.hl));
  },

  0x86: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, toByte(memory.readByte(cpu.r.hl)));
  },

  0x87: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, upper(cpu.r.af));
  },

  0x88: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, upper(cpu.r.bc));
  },

  0x89: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, lower(cpu.r.bc));
  },

  0x8a: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, upper(cpu.r.de));
  },

  0x8b: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, lower(cpu.r.de));
  },

  0x8c: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, upper(cpu.r.hl));
  },

  0x8d: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, lower(cpu.r.hl));
  },

  0x8e: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, toByte(memory.readByte(cpu.r.hl)));
  },

  0x8f: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, upper(cpu.r.af));
  },

  0x90: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, upper(cpu.r.bc));
  },

  0x91: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, lower(cpu.r.bc));
  },

  0x92: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, upper(cpu.r.de));
  },

  0x93: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, lower(cpu.r.de));
  },

  0x94: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, upper(cpu.r.hl));
  },

  0x95: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, lower(cpu.r.hl));
  },

  0x96: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, toByte(memory.readByte(cpu.r.hl)));
  },

  0x97: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, upper(cpu.r.af));
  },

  0x98: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, upper(cpu.r.bc));
  },

  0x99: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, lower(cpu.r.bc));
  },

  0x9a: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, upper(cpu.r.de));
  },

  0x9b: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, lower(cpu.r.de));
  },

  0x9c: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, upper(cpu.r.hl));
  },

  0x9d: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, lower(cpu.r.hl));
  },

  0x9e: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, toByte(memory.readByte(cpu.r.hl)));
  },

  0x9f: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, upper(cpu.r.af));
  },

  0xa0: function (cpu: CPU, memory: Memory): void {
    AND(cpu, upper(cpu.r.bc));
  },

  0xa1: function (cpu: CPU, memory: Memory): void {
    AND(cpu, lower(cpu.r.bc));
  },

  0xa2: function (cpu: CPU, memory: Memory): void {
    AND(cpu, upper(cpu.r.de));
  },

  0xa3: function (cpu: CPU, memory: Memory): void {
    AND(cpu, lower(cpu.r.de));
  },

  0xa4: function (cpu: CPU, memory: Memory): void {
    AND(cpu, upper(cpu.r.hl));
  },

  0xa5: function (cpu: CPU, memory: Memory): void {
    AND(cpu, lower(cpu.r.hl));
  },

  0xa6: function (cpu: CPU, memory: Memory): void {
    AND(cpu, memory.readByte(cpu.r.hl));
  },

  0xa7: function (cpu: CPU, memory: Memory): void {
    AND(cpu, upper(cpu.r.af));
  },

  0xa8: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, upper(cpu.r.bc));
  },

  0xa9: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, lower(cpu.r.bc));
  },

  0xaa: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, upper(cpu.r.de));
  },

  0xab: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, lower(cpu.r.de));
  },

  0xac: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, upper(cpu.r.hl));
  },

  0xad: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, lower(cpu.r.hl));
  },

  0xae: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, memory.readByte(cpu.r.hl));
  },

  0xaf: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, upper(cpu.r.af));
  },

  0xb0: function (cpu: CPU, memory: Memory): void {
    OR(cpu, upper(cpu.r.bc));
  },

  0xb1: function (cpu: CPU, memory: Memory): void {
    OR(cpu, lower(cpu.r.bc));
  },

  0xb2: function (cpu: CPU, memory: Memory): void {
    OR(cpu, upper(cpu.r.de));
  },

  0xb3: function (cpu: CPU, memory: Memory): void {
    OR(cpu, lower(cpu.r.de));
  },

  0xb4: function (cpu: CPU, memory: Memory): void {
    OR(cpu, upper(cpu.r.hl));
  },

  0xb5: function (cpu: CPU, memory: Memory): void {
    OR(cpu, lower(cpu.r.hl));
  },

  0xb6: function (cpu: CPU, memory: Memory): void {
    OR(cpu, memory.readByte(cpu.r.hl));
  },

  0xb7: function (cpu: CPU, memory: Memory): void {
    OR(cpu, upper(cpu.r.af));
  },

  0xb8: function (cpu: CPU, memory: Memory): void {
    CP(cpu, upper(cpu.r.bc));
  },

  0xb9: function (cpu: CPU, memory: Memory): void {
    CP(cpu, lower(cpu.r.bc));
  },

  0xba: function (cpu: CPU, memory: Memory): void {
    CP(cpu, upper(cpu.r.de));
  },

  0xbb: function (cpu: CPU, memory: Memory): void {
    CP(cpu, lower(cpu.r.de));
  },

  0xbc: function (cpu: CPU, memory: Memory): void {
    CP(cpu, upper(cpu.r.hl));
  },

  0xbd: function (cpu: CPU, memory: Memory): void {
    CP(cpu, lower(cpu.r.hl));
  },

  0xbe: function (cpu: CPU, memory: Memory): void {
    CP(cpu, toByte(memory.readByte(cpu.r.hl)));
  },

  0xbf: function (cpu: CPU, memory: Memory): void {
    CP(cpu, upper(cpu.r.af));
  },

  0xc0: function (cpu: CPU, memory: Memory): boolean {
    return RET(cpu, memory, !cpu.getZFlag());
  },

  0xc1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = POP(cpu, memory);
  },

  0xc2: function (cpu: CPU, memory: Memory): boolean {
    if (Jpcc(cpu, memory, !cpu.getZFlag())) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xc3: function (cpu: CPU, memory: Memory): void {
    cpu.pc = memory.readWord(cpu.pc);
  },

  0xc4: function (cpu: CPU, memory: Memory): boolean {
    if (CALL(cpu, memory, !cpu.getZFlag())) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xc5: function (cpu: CPU, memory: Memory): void {
    PUSH(cpu, memory, cpu.r.bc);
  },

  0xc6: function (cpu: CPU, memory: Memory): void {
    const value = toByte(memory.readByte(cpu.pc));
    cpu.checkFullCarry8(upper(cpu.r.af), value);
    cpu.checkHalfCarry(upper(cpu.r.af), value);
    cpu.r.af = addUpper(cpu.r.af, value);
    cpu.checkZFlag(upper(cpu.r.af));
    cpu.pc += 1;
    cpu.setNFlag(0);
  },

  0xc7: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x00);
  },

  0xc8: function (cpu: CPU, memory: Memory): boolean {
    if (cpu.getZFlag()) {
      const address: word = memory.readWord(cpu.sp);
      cpu.pc = address;
      cpu.sp = addWord(cpu.sp, 2);
      return true;
    }
    return false;
  },

  0xc9: function (cpu: CPU, memory: Memory): void {
    RET(cpu, memory, true);
  },

  0xca: function (cpu: CPU, memory: Memory): boolean {
    if (Jpcc(cpu, memory, cpu.getZFlag() === 0)) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xcb: function (cpu: CPU, memory: Memory): void {
    const opcode: byte = memory.readByte(cpu.pc);
    cpu.addCalledInstruction(`CB: ${toHex(opcode)}`);
    cbMap[opcode](cpu, memory);
    cpu.pc += 1;
  },

  0xcc: function (cpu: CPU, memory: Memory): boolean {
    if (CALL(cpu, memory, cpu.getZFlag() === 1)) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xcd: function (cpu: CPU, memory: Memory): void {
    CALL(cpu, memory, true);
  },

  0xce: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0xcf: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x08);
  },

  0xd0: function (cpu: CPU, memory: Memory): boolean {
    return RET(cpu, memory, !cpu.getCYFlag());
  },

  0xd1: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = POP(cpu, memory);
  },

  0xd2: function (cpu: CPU, memory: Memory): boolean {
    if (Jpcc(cpu, memory, cpu.getZFlag() === 0)) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xd3: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xd4: function (cpu: CPU, memory: Memory): boolean {
    if (CALL(cpu, memory, !cpu.getCYFlag())) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xd5: function (cpu: CPU, memory: Memory): void {
    PUSH(cpu, memory, cpu.r.de);
  },

  0xd6: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, memory.readByte(cpu.pc));
    cpu.pc += 1;
  },

  0xd7: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x10);
  },

  0xd8: function (cpu: CPU, memory: Memory): boolean {
    return RET(cpu, memory, cpu.getCYFlag() === 1);
  },

  0xd9: function (cpu: CPU, memory: Memory): void {
    RET(cpu, memory, true);
    cpu.setInterruptsGlobal(true);
  },

  0xda: function (cpu: CPU, memory: Memory): boolean {
    if (Jpcc(cpu, memory, cpu.getCYFlag() === 0)) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xdb: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xdc: function (cpu: CPU, memory: Memory): boolean {
    if (CALL(cpu, memory, cpu.getCYFlag() === 1)) {
      return true;
    }
    cpu.pc += 2;
    return false;
  },

  0xdd: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xde: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0xdf: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x18);
  },

  0xe0: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(0xff00 + memory.readByte(cpu.pc), upper(cpu.r.af));
    cpu.pc += 1;
  },

  0xe1: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = POP(cpu, memory);
  },

  0xe2: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(0xff00 + lower(cpu.r.bc), upper(cpu.r.af));
  },

  0xe3: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xe4: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xe5: function (cpu: CPU, memory: Memory): void {
    PUSH(cpu, memory, cpu.r.hl);
  },

  0xe6: function (cpu: CPU, memory: Memory): void {
    AND(cpu, memory.readByte(cpu.pc));
    cpu.pc += 1;
  },

  0xe7: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x20);
  },

  0xe8: function (cpu: CPU, memory: Memory): void {
    const operand = toWord(toSigned(memory.readByte(cpu.pc)));
    cpu.checkFullCarry16(cpu.sp, operand);
    cpu.checkHalfCarry(upper(cpu.sp), upper(operand));
    cpu.sp = addWord(cpu.sp, operand);
    cpu.pc += 1;
    cpu.setZFlag(0);
    cpu.setNFlag(0);
  },

  0xe9: function (cpu: CPU, memory: Memory): void {
    cpu.pc = cpu.r.hl;
  },

  0xea: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(memory.readWord(cpu.pc), upper(cpu.r.af));
    cpu.pc += 2;
  },

  0xeb: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xec: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xed: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xee: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0xef: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x28);
  },

  0xf0: function (cpu: CPU, memory: Memory): void {
    const data = memory.readByte(0xff00 + memory.readByte(cpu.pc));
    // console.log(
    //   `Tried to read address ${Number(
    //     0xff00 + memory.readByte(cpu.pc)
    //   ).toString(16)}`
    // );
    cpu.r.af = setUpper(cpu.r.af, data);
    cpu.pc += 1;
  },

  0xf1: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = POP(cpu, memory);
  },

  0xf2: function (cpu: CPU, memory: Memory): void {
    const data = memory.readByte(0xff00 + lower(cpu.r.bc));
    cpu.r.af = setUpper(cpu.r.af, data);
  },

  0xf3: function (cpu: CPU, memory: Memory): void {
    cpu.setInterruptsGlobal(false);
  },

  0xf4: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xf5: function (cpu: CPU, memory: Memory): void {
    PUSH(cpu, memory, cpu.r.af);
  },

  0xf6: function (cpu: CPU, memory: Memory): void {
    OR(cpu, memory.readByte(cpu.pc));
    cpu.pc += 1;
  },

  0xf7: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x30);
  },

  0xf8: function (cpu: CPU, memory: Memory): void {
    let incr = toWord(toSigned(memory.readByte(cpu.pc)));
    cpu.checkHalfCarry(upper(incr), upper(cpu.sp));
    cpu.checkFullCarry16(incr, cpu.sp);
    cpu.pc += 1;
    incr = addWord(incr, cpu.sp);
    cpu.r.hl = incr;
    cpu.setZFlag(0);
    cpu.setNFlag(0);
  },

  0xf9: function (cpu: CPU, memory: Memory): void {
    cpu.sp = cpu.r.hl;
  },

  0xfa: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(
      cpu.r.af,
      toByte(memory.readByte(memory.readWord(cpu.pc)))
    );
    cpu.pc += 2;
  },

  0xfb: function (cpu: CPU, memory: Memory): void {
    cpu.setInterruptsGlobal(true);
  },

  0xfc: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xfd: function (cpu: CPU, memory: Memory): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xfe: function (cpu: CPU, memory: Memory): void {
    CP(cpu, memory.readByte(cpu.pc));
    cpu.pc += 1;
  },

  0xff: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x38);
  },
};

function RLCn(cpu: CPU, reg: byte): byte {
  cpu.setCYFlag(reg >> 7);
  const shifted: number = reg << 1;
  const result: byte = toByte(shifted | (shifted >> 8));
  cpu.checkZFlag(result);
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  return result;
}

function RLn(cpu: CPU, reg: byte): byte {
  const oldCY = cpu.getCYFlag();
  cpu.setCYFlag(reg >> 7);
  const shifted = reg << 1;
  const result = toByte(shifted | oldCY);
  cpu.checkZFlag(result);
  cpu.setHFlag(0);
  cpu.setNFlag(0);
  return result;
}

function RRCn(cpu: CPU, reg: byte): byte {
  const bitZero = reg & 1;
  cpu.setCYFlag(bitZero);
  const shifted: byte = reg >> 1;
  const result: byte = toByte(shifted | (bitZero << 7));
  cpu.checkZFlag(result);
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  return result;
}

function RRn(cpu: CPU, reg: byte): byte {
  const oldCY = cpu.getCYFlag();
  cpu.setCYFlag(reg & 1);
  const shifted = reg >> 1;
  const result: byte = toByte(shifted | (oldCY << 7));
  cpu.checkZFlag(result);
  cpu.setHFlag(0);
  cpu.setNFlag(0);
  return result;
}

function SLAn(cpu: CPU, reg: byte): byte {
  cpu.setCYFlag(reg << 7);
  const result = toByte(reg << 1);
  cpu.checkZFlag(result);
  cpu.setHFlag(0);
  cpu.setNFlag(0);
  return result;
}

function SRAn(cpu: CPU, reg: byte): byte {
  cpu.setCYFlag(reg & 1);
  // shift to right, but keep the most sig bit
  const msb: byte = reg >> 7;
  const result: byte = (reg >> 1) | msb;
  cpu.checkZFlag(result);
  cpu.setHFlag(0);
  cpu.setNFlag(0);
  return result;
}

function SRLn(cpu: CPU, reg: byte): byte {
  cpu.setCYFlag(reg & 1);
  const result: byte = reg >> 1;
  cpu.checkZFlag(result);
  cpu.setHFlag(0);
  cpu.setNFlag(0);
  return result;
}

function BIT(cpu: CPU, bit: number, reg: byte): void {
  cpu.checkZFlag((reg >> bit) & 1);
  cpu.setNFlag(0);
  cpu.setHFlag(1);
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

function SWAP(cpu: CPU, reg: byte) {
  const upper = reg >> 4;
  const lower = reg & 0xf;
  const result = (lower << 4) | upper;
  cpu.checkZFlag(result);
  return result;
}

const cbMap: OpcodeList = {
  0x00: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RLCn(cpu, upper(cpu.r.bc)));
  },
  0x01: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RLCn(cpu, lower(cpu.r.bc)));
  },
  0x02: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RLCn(cpu, upper(cpu.r.de)));
  },
  0x03: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RLCn(cpu, lower(cpu.r.de)));
  },
  0x04: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RLCn(cpu, upper(cpu.r.hl)));
  },
  0x05: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RLCn(cpu, lower(cpu.r.hl)));
  },
  0x06: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RLCn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x07: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RLCn(cpu, upper(cpu.r.af)));
  },
  0x08: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RRCn(cpu, upper(cpu.r.bc)));
  },
  0x09: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RRCn(cpu, lower(cpu.r.bc)));
  },
  0x0a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RRCn(cpu, upper(cpu.r.de)));
  },
  0x0b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RRCn(cpu, lower(cpu.r.de)));
  },
  0x0c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RRCn(cpu, upper(cpu.r.hl)));
  },
  0x0d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RRCn(cpu, lower(cpu.r.hl)));
  },
  0x0e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RRCn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x0f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RRCn(cpu, upper(cpu.r.af)));
  },
  0x10: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RLn(cpu, upper(cpu.r.bc)));
  },
  0x11: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RLn(cpu, lower(cpu.r.bc)));
  },
  0x12: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RLn(cpu, upper(cpu.r.de)));
  },
  0x13: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RLn(cpu, lower(cpu.r.de)));
  },
  0x14: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RLn(cpu, upper(cpu.r.hl)));
  },
  0x15: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RLn(cpu, lower(cpu.r.hl)));
  },
  0x16: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RLn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x17: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RLn(cpu, upper(cpu.r.af)));
  },
  0x18: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RLn(cpu, upper(cpu.r.bc)));
  },
  0x19: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RRn(cpu, lower(cpu.r.bc)));
  },
  0x1a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RRn(cpu, upper(cpu.r.de)));
  },
  0x1b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RRn(cpu, lower(cpu.r.de)));
  },
  0x1c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RRn(cpu, upper(cpu.r.hl)));
  },
  0x1d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RRn(cpu, lower(cpu.r.hl)));
  },
  0x1e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RRn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x1f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RRn(cpu, upper(cpu.r.af)));
  },
  0x20: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SLAn(cpu, upper(cpu.r.bc)));
  },
  0x21: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SLAn(cpu, lower(cpu.r.bc)));
  },
  0x22: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SLAn(cpu, upper(cpu.r.de)));
  },
  0x23: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SLAn(cpu, lower(cpu.r.de)));
  },
  0x24: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SLAn(cpu, upper(cpu.r.hl)));
  },
  0x25: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SLAn(cpu, lower(cpu.r.hl)));
  },
  0x26: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SLAn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x27: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SLAn(cpu, upper(cpu.r.af)));
  },
  0x28: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SRAn(cpu, upper(cpu.r.bc)));
  },
  0x29: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SRAn(cpu, lower(cpu.r.bc)));
  },
  0x2a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SRAn(cpu, upper(cpu.r.de)));
  },
  0x2b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SRAn(cpu, lower(cpu.r.de)));
  },
  0x2c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SRAn(cpu, upper(cpu.r.hl)));
  },
  0x2d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SRAn(cpu, lower(cpu.r.hl)));
  },
  0x2e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SRAn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x2f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SRAn(cpu, upper(cpu.r.af)));
  },
  0x30: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SWAP(cpu, upper(cpu.r.bc)));
  },
  0x31: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SWAP(cpu, lower(cpu.r.bc)));
  },
  0x32: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SWAP(cpu, upper(cpu.r.de)));
  },
  0x33: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SWAP(cpu, lower(cpu.r.de)));
  },
  0x34: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SWAP(cpu, upper(cpu.r.hl)));
  },
  0x35: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SWAP(cpu, lower(cpu.r.hl)));
  },
  0x36: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SWAP(cpu, memory.readByte(cpu.r.hl)));
  },
  0x37: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SWAP(cpu, upper(cpu.r.af)));
  },
  0x38: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SRLn(cpu, upper(cpu.r.bc)));
  },
  0x39: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SRLn(cpu, lower(cpu.r.bc)));
  },
  0x3a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SRLn(cpu, upper(cpu.r.de)));
  },
  0x3b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SRLn(cpu, lower(cpu.r.de)));
  },
  0x3c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SRLn(cpu, upper(cpu.r.hl)));
  },
  0x3d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SRLn(cpu, lower(cpu.r.hl)));
  },
  0x3e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SRLn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x3f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SRLn(cpu, upper(cpu.r.af)));
  },
  0x40: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, upper(cpu.r.bc));
  },
  0x41: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, lower(cpu.r.bc));
  },
  0x42: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, upper(cpu.r.de));
  },
  0x43: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, lower(cpu.r.de));
  },
  0x44: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, upper(cpu.r.hl));
  },
  0x45: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, lower(cpu.r.hl));
  },
  0x46: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, memory.readByte(cpu.r.hl));
  },
  0x47: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, upper(cpu.r.af));
  },
  0x48: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, upper(cpu.r.bc));
  },
  0x49: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, lower(cpu.r.bc));
  },
  0x4a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, upper(cpu.r.de));
  },
  0x4b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, lower(cpu.r.de));
  },
  0x4c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, upper(cpu.r.hl));
  },
  0x4d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, lower(cpu.r.hl));
  },
  0x4e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, memory.readByte(cpu.r.hl));
  },
  0x4f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, upper(cpu.r.af));
  },
  0x50: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, upper(cpu.r.bc));
  },
  0x51: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, lower(cpu.r.bc));
  },
  0x52: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, upper(cpu.r.de));
  },
  0x53: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, lower(cpu.r.de));
  },
  0x54: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, upper(cpu.r.hl));
  },
  0x55: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, lower(cpu.r.hl));
  },
  0x56: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, memory.readByte(cpu.r.hl));
  },
  0x57: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, upper(cpu.r.af));
  },
  0x58: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, upper(cpu.r.bc));
  },
  0x59: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, lower(cpu.r.bc));
  },
  0x5a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, upper(cpu.r.de));
  },
  0x5b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, lower(cpu.r.de));
  },
  0x5c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, upper(cpu.r.hl));
  },
  0x5d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, lower(cpu.r.hl));
  },
  0x5e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, memory.readByte(cpu.r.hl));
  },
  0x5f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, upper(cpu.r.af));
  },
  0x60: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, upper(cpu.r.bc));
  },
  0x61: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, lower(cpu.r.bc));
  },
  0x62: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, upper(cpu.r.de));
  },
  0x63: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, lower(cpu.r.de));
  },
  0x64: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, upper(cpu.r.hl));
  },
  0x65: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, lower(cpu.r.hl));
  },
  0x66: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, memory.readByte(cpu.r.hl));
  },
  0x67: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, upper(cpu.r.af));
  },
  0x68: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, upper(cpu.r.bc));
  },
  0x69: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, lower(cpu.r.bc));
  },
  0x6a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, upper(cpu.r.de));
  },
  0x6b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, lower(cpu.r.de));
  },
  0x6c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, upper(cpu.r.hl));
  },
  0x6d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, lower(cpu.r.hl));
  },
  0x6e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, memory.readByte(cpu.r.hl));
  },
  0x6f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, upper(cpu.r.af));
  },
  0x70: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, upper(cpu.r.bc));
  },
  0x71: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, lower(cpu.r.bc));
  },
  0x72: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, upper(cpu.r.de));
  },
  0x73: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, lower(cpu.r.de));
  },
  0x74: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, upper(cpu.r.hl));
  },
  0x75: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, lower(cpu.r.hl));
  },
  0x76: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, memory.readByte(cpu.r.hl));
  },
  0x77: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, upper(cpu.r.af));
  },
  0x78: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, upper(cpu.r.bc));
  },
  0x79: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, lower(cpu.r.bc));
  },
  0x7a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, upper(cpu.r.de));
  },
  0x7b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, lower(cpu.r.de));
  },
  0x7c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, upper(cpu.r.hl));
  },
  0x7d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, lower(cpu.r.hl));
  },
  0x7e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, memory.readByte(cpu.r.hl));
  },
  0x7f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, upper(cpu.r.af));
  },
  0x80: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES0(upper(cpu.r.bc)));
  },
  0x81: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES0(lower(cpu.r.bc)));
  },
  0x82: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES0(upper(cpu.r.de)));
  },
  0x83: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES0(lower(cpu.r.de)));
  },
  0x84: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES0(upper(cpu.r.hl)));
  },
  0x85: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES0(lower(cpu.r.hl)));
  },
  0x86: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES0(memory.readByte(cpu.r.hl)));
  },
  0x87: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES0(upper(cpu.r.af)));
  },
  0x88: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES1(upper(cpu.r.bc)));
  },
  0x89: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES1(lower(cpu.r.bc)));
  },
  0x8a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES1(upper(cpu.r.de)));
  },
  0x8b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES1(lower(cpu.r.de)));
  },
  0x8c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES1(upper(cpu.r.hl)));
  },
  0x8d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES1(lower(cpu.r.hl)));
  },
  0x8e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES1(memory.readByte(cpu.r.hl)));
  },
  0x8f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES1(upper(cpu.r.af)));
  },
  0x90: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES2(upper(cpu.r.bc)));
  },
  0x91: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES2(lower(cpu.r.bc)));
  },
  0x92: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES2(upper(cpu.r.de)));
  },
  0x93: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES2(lower(cpu.r.de)));
  },
  0x94: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES2(upper(cpu.r.hl)));
  },
  0x95: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES2(lower(cpu.r.hl)));
  },
  0x96: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES2(memory.readByte(cpu.r.hl)));
  },
  0x97: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES2(upper(cpu.r.af)));
  },
  0x98: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES3(upper(cpu.r.bc)));
  },
  0x99: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES3(lower(cpu.r.bc)));
  },
  0x9a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES3(upper(cpu.r.de)));
  },
  0x9b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES3(lower(cpu.r.de)));
  },
  0x9c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES3(upper(cpu.r.hl)));
  },
  0x9d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES3(lower(cpu.r.hl)));
  },
  0x9e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES3(memory.readByte(cpu.r.hl)));
  },
  0x9f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES3(upper(cpu.r.af)));
  },
  0xa0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES4(upper(cpu.r.bc)));
  },
  0xa1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES4(lower(cpu.r.bc)));
  },
  0xa2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES4(upper(cpu.r.de)));
  },
  0xa3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES4(lower(cpu.r.de)));
  },
  0xa4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES4(upper(cpu.r.hl)));
  },
  0xa5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES4(lower(cpu.r.hl)));
  },
  0xa6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES4(memory.readByte(cpu.r.hl)));
  },
  0xa7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES4(upper(cpu.r.af)));
  },
  0xa8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES5(upper(cpu.r.bc)));
  },
  0xa9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES5(lower(cpu.r.bc)));
  },
  0xaa: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES5(upper(cpu.r.de)));
  },
  0xab: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES5(lower(cpu.r.de)));
  },
  0xac: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES5(upper(cpu.r.hl)));
  },
  0xad: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES5(lower(cpu.r.hl)));
  },
  0xae: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES5(memory.readByte(cpu.r.hl)));
  },
  0xaf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES5(upper(cpu.r.af)));
  },
  0xb0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES6(upper(cpu.r.bc)));
  },
  0xb1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES6(lower(cpu.r.bc)));
  },
  0xb2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES6(upper(cpu.r.de)));
  },
  0xb3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES6(lower(cpu.r.de)));
  },
  0xb4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES6(upper(cpu.r.hl)));
  },
  0xb5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES6(lower(cpu.r.hl)));
  },
  0xb6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES6(memory.readByte(cpu.r.hl)));
  },
  0xb7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES6(upper(cpu.r.af)));
  },
  0xb8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, RES7(upper(cpu.r.bc)));
  },
  0xb9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, RES7(lower(cpu.r.bc)));
  },
  0xba: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, RES7(upper(cpu.r.de)));
  },
  0xbb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, RES7(lower(cpu.r.de)));
  },
  0xbc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, RES7(upper(cpu.r.hl)));
  },
  0xbd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, RES7(lower(cpu.r.hl)));
  },
  0xbe: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES7(memory.readByte(cpu.r.hl)));
  },
  0xbf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, RES7(upper(cpu.r.af)));
  },
  0xc0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(0, upper(cpu.r.bc)));
  },
  0xc1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SET(0, lower(cpu.r.bc)));
  },
  0xc2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(0, upper(cpu.r.de)));
  },
  0xc3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(0, lower(cpu.r.de)));
  },
  0xc4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(0, upper(cpu.r.hl)));
  },
  0xc5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SET(0, lower(cpu.r.hl)));
  },
  0xc6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(0, memory.readByte(cpu.r.hl)));
  },
  0xc7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(0, lower(cpu.r.af)));
  },
  0xc8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(1, upper(cpu.r.bc)));
  },
  0xc9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SET(1, lower(cpu.r.bc)));
  },
  0xca: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(1, upper(cpu.r.de)));
  },
  0xcb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(1, lower(cpu.r.de)));
  },
  0xcc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(1, upper(cpu.r.hl)));
  },
  0xcd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SET(1, lower(cpu.r.hl)));
  },
  0xce: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(1, memory.readByte(cpu.r.hl)));
  },
  0xcf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(1, upper(cpu.r.af)));
  },
  0xd0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(2, upper(cpu.r.bc)));
  },
  0xd1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(2, lower(cpu.r.bc)));
  },
  0xd2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(2, upper(cpu.r.de)));
  },
  0xd3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(2, lower(cpu.r.de)));
  },
  0xd4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(2, upper(cpu.r.hl)));
  },
  0xd5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SET(2, lower(cpu.r.hl)));
  },
  0xd6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(2, memory.readByte(cpu.r.hl)));
  },
  0xd7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(2, upper(cpu.r.af)));
  },
  0xd8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(3, upper(cpu.r.bc)));
  },
  0xd9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SET(3, lower(cpu.r.bc)));
  },
  0xda: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(3, upper(cpu.r.de)));
  },
  0xdb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(3, lower(cpu.r.de)));
  },
  0xdc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(3, upper(cpu.r.hl)));
  },
  0xdd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SET(3, lower(cpu.r.hl)));
  },
  0xde: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(3, memory.readByte(cpu.r.hl)));
  },
  0xdf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(3, upper(cpu.r.af)));
  },
  0xe0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(4, upper(cpu.r.bc)));
  },
  0xe1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SET(4, lower(cpu.r.bc)));
  },
  0xe2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(4, upper(cpu.r.de)));
  },
  0xe3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(4, lower(cpu.r.de)));
  },
  0xe4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(4, upper(cpu.r.hl)));
  },
  0xe5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SET(4, lower(cpu.r.hl)));
  },
  0xe6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(4, memory.readByte(cpu.r.hl)));
  },
  0xe7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(4, upper(cpu.r.af)));
  },
  0xe8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(5, upper(cpu.r.bc)));
  },
  0xe9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SET(5, lower(cpu.r.bc)));
  },
  0xea: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(5, upper(cpu.r.de)));
  },
  0xeb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(5, lower(cpu.r.de)));
  },
  0xec: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(5, upper(cpu.r.hl)));
  },
  0xed: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(5, lower(cpu.r.hl)));
  },
  0xee: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(5, memory.readByte(cpu.r.hl)));
  },
  0xef: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(5, upper(cpu.r.af)));
  },
  0xf0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(6, upper(cpu.r.bc)));
  },
  0xf1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SET(6, lower(cpu.r.bc)));
  },
  0xf2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(6, upper(cpu.r.de)));
  },
  0xf3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(6, lower(cpu.r.de)));
  },
  0xf4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(6, upper(cpu.r.hl)));
  },
  0xf5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SET(6, lower(cpu.r.hl)));
  },
  0xf6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(6, memory.readByte(cpu.r.hl)));
  },
  0xf7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(6, upper(cpu.r.af)));
  },
  0xf8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setUpper(cpu.r.bc, SET(7, upper(cpu.r.bc)));
  },
  0xf9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = setLower(cpu.r.bc, SET(7, lower(cpu.r.bc)));
  },
  0xfa: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setUpper(cpu.r.de, SET(7, upper(cpu.r.de)));
  },
  0xfb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = setLower(cpu.r.de, SET(7, lower(cpu.r.de)));
  },
  0xfc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setUpper(cpu.r.hl, SET(7, upper(cpu.r.hl)));
  },
  0xfd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = setLower(cpu.r.hl, SET(7, lower(cpu.r.hl)));
  },
  0xfe: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(7, memory.readByte(cpu.r.hl)));
  },
  0xff: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = setUpper(cpu.r.af, SET(7, upper(cpu.r.af)));
  },
};

export default OpcodeMap;

export const instructionHelpers = {
  PUSH,
  RLCn,
  RLn,
  RRCn,
  RRn,
  SLAn,
  SRAn,
  BIT,
};
