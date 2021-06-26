import CPU from 'CPU/index';
import Primitive from 'helpers/Primitives';
import Memory from 'Memory/index';

function ADD(cpu: CPU, operand: byte): void {
  cpu.checkFullCarry8(Primitive.upper(cpu.r.af), operand);
  cpu.checkHalfCarry(Primitive.upper(cpu.r.af), operand);
  cpu.r.af = Primitive.addUpper(cpu.r.af, operand);
  cpu.checkZFlag(Primitive.upper(cpu.r.af));
  cpu.setNFlag(0);
}

function ADC(cpu: CPU, operand: byte): void {
  operand = Primitive.addByte(operand, <byte>cpu.getCYFlag());
  cpu.checkFullCarry8(Primitive.upper(cpu.r.af), operand);
  cpu.checkHalfCarry(Primitive.upper(cpu.r.af), operand);
  cpu.r.af = Primitive.addUpper(cpu.r.af, operand);
  cpu.checkZFlag(Primitive.upper(cpu.r.af));
  cpu.setNFlag(0);
}

function SUB(cpu: CPU, operand: byte): void {
  cpu.checkFullCarry8(Primitive.upper(cpu.r.af), operand, true);
  cpu.checkHalfCarry(Primitive.upper(cpu.r.af), operand, true);
  cpu.r.af = Primitive.toWord(Primitive.addUpper(cpu.r.af, -operand));
  cpu.checkZFlag(Primitive.upper(cpu.r.af));
  cpu.setNFlag(1);
}

function SBC(cpu: CPU, operand: byte): void {
  const carry = cpu.getCYFlag() ? -1 : 0;
  operand = Primitive.addByte(operand, carry);
  cpu.checkFullCarry8(Primitive.upper(cpu.r.af), operand, true);
  cpu.checkHalfCarry(Primitive.upper(cpu.r.af), operand, true);
  cpu.r.af = Primitive.toWord(Primitive.addUpper(cpu.r.af, -operand));
  cpu.checkZFlag(Primitive.upper(cpu.r.af));
  cpu.setNFlag(1);
}

function OR(cpu: CPU, operand: byte): void {
  const result = Primitive.upper(cpu.r.af) | operand;
  cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.toByte(result));
  cpu.checkZFlag(Primitive.upper(cpu.r.af));
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  cpu.setCYFlag(0);
}

function AND(cpu: CPU, operand: byte): void {
  const result = Primitive.upper(cpu.r.af) & operand;
  cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.toByte(result));
  cpu.checkZFlag(Primitive.upper(cpu.r.af));
  cpu.setNFlag(0);
  cpu.setHFlag(1);
  cpu.setCYFlag(0);
}

function XOR(cpu: CPU, operand: byte): void {
  const result = Primitive.upper(cpu.r.af) ^ operand;
  cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.toByte(result));
  cpu.checkZFlag(Primitive.upper(cpu.r.af));
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  cpu.setCYFlag(0);
}

function CP(cpu: CPU, operand: byte): void {
  cpu.checkFullCarry8(Primitive.upper(cpu.r.af), operand, true);
  cpu.checkHalfCarry(Primitive.upper(cpu.r.af), operand, true);
  const result: byte = Primitive.addByte(Primitive.upper(cpu.r.af), -operand);
  cpu.setNFlag(1);
  cpu.checkZFlag(result);
}

function CALL(cpu: CPU, memory: Memory, flag: boolean): boolean {
  if (flag) {
    cpu.sp = Primitive.addWord(cpu.sp, -2);
    memory.writeWord(cpu.sp, Primitive.toWord(cpu.pc + 2));
    cpu.pc = memory.readWord(cpu.pc);
    return true;
  }
  return false;
}

function PUSH(cpu: CPU, memory: Memory, register: word): void {
  cpu.sp = Primitive.addWord(cpu.sp, -1);
  memory.writeByte(cpu.sp, Primitive.upper(register));
  cpu.sp = Primitive.addWord(cpu.sp, -1);
  memory.writeByte(cpu.sp, Primitive.lower(register));
}

function POP(cpu: CPU, memory: Memory): word {
  const value: word = memory.readWord(cpu.sp);
  cpu.sp = Primitive.addWord(cpu.sp, 2);
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
    cpu.sp = Primitive.addWord(cpu.sp, 2);
    return true;
  }
  return false;
}

function RST(cpu: CPU, memory: Memory, address: word): void {
  cpu.sp = Primitive.addWord(cpu.sp, -2);
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
    memory.writeByte(cpu.r.bc, Primitive.upper(cpu.r.af));
  },

  0x03: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.addWord(cpu.r.bc, 1);
  },

  0x04: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(Primitive.upper(cpu.r.bc), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(cpu.r.bc));
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, operand);

    cpu.checkZFlag(Primitive.upper(cpu.r.bc));
    cpu.setNFlag(0);
  },

  0x05: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(Primitive.upper(cpu.r.bc), 1, true);
    cpu.r.bc = Primitive.addUpper(cpu.r.bc, Primitive.toByte(-1));
    cpu.checkZFlag(Primitive.upper(cpu.r.bc));
    cpu.setNFlag(1);
  },

  0x06: function (cpu: CPU, memory: Memory): void {
    // load into B from pc (immediate)
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      Primitive.toByte(memory.readByte(cpu.pc))
    );
    cpu.pc += 1;
  },

  0x07: function (cpu: CPU, memory: Memory): void {
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
  },

  0x08: function (cpu: CPU, memory: Memory): void {
    memory.writeWord(memory.readWord(cpu.pc), cpu.sp);
  },

  0x09: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.r.bc);
    cpu.checkHalfCarry(Primitive.upper(cpu.r.hl), Primitive.upper(cpu.r.bc));
    cpu.r.hl = Primitive.addWord(cpu.r.hl, cpu.r.bc);
    cpu.setNFlag(0);
  },

  0x0a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(memory.readByte(cpu.r.bc))
    );
  },

  0x0b: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.addWord(cpu.r.bc, -1);
  },

  0x0c: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(Primitive.lower(cpu.r.bc), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.lower(cpu.r.bc));
    cpu.r.bc = Primitive.setLower(cpu.r.bc, operand);

    cpu.checkZFlag(Primitive.lower(cpu.r.bc));
    cpu.setNFlag(0);
  },

  0x0d: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    cpu.checkHalfCarry(Primitive.lower(cpu.r.bc), 1, true);
    cpu.r.bc = Primitive.addLower(cpu.r.bc, Primitive.toByte(-1));
    cpu.checkZFlag(Primitive.lower(cpu.r.bc));
    cpu.setNFlag(1);
  },

  0x0e: function (cpu: CPU, memory: Memory): void {
    // load into C from pc (immediate)
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      Primitive.toByte(memory.readByte(cpu.pc))
    );
    cpu.pc += 1;
  },

  0x0f: function (cpu: CPU, memory: Memory): void {
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
    memory.writeByte(cpu.r.de, Primitive.upper(cpu.r.af));
  },

  0x13: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.addWord(cpu.r.de, 1);
  },

  0x14: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(Primitive.upper(cpu.r.de), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(cpu.r.de));
    cpu.r.de = Primitive.setUpper(cpu.r.de, operand);

    cpu.checkZFlag(Primitive.upper(cpu.r.de));
    cpu.setNFlag(0);
  },

  0x15: function (cpu: CPU, memory: Memory): void {
    // check for half carry on affected byte only
    cpu.checkHalfCarry(Primitive.upper(cpu.r.de), 1, true);
    cpu.r.de = Primitive.addUpper(cpu.r.de, Primitive.toByte(-1));
    cpu.checkZFlag(Primitive.upper(cpu.r.de));
    cpu.setNFlag(1);
  },

  0x16: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      Primitive.toByte(memory.readByte(cpu.pc))
    );
    cpu.pc += 1;
  },

  0x17: function (cpu: CPU, memory: Memory): void {
    // need to rotate left through the carry flag
    // get the old carry value
    const oldCY = cpu.getCYFlag();
    // set the carry flag to the 7th bit of A
    cpu.setCYFlag(Primitive.upper(cpu.r.af) >> 7);
    // rotate left
    const shifted = Primitive.upper(cpu.r.af) << 1;
    // combine old flag and shifted, set to A
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.toByte(shifted | oldCY));
    cpu.setHFlag(0);
    cpu.setNFlag(0);
    cpu.setZFlag(0);
  },

  0x18: function (cpu: CPU, memory: Memory): void {
    cpu.pc = Primitive.addWord(
      cpu.pc,
      Primitive.toSigned(memory.readByte(cpu.pc))
    );
    cpu.pc += 1;
  },

  0x19: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.r.de);
    cpu.checkHalfCarry(Primitive.upper(cpu.r.hl), Primitive.upper(cpu.r.de));
    cpu.r.hl = Primitive.addWord(cpu.r.hl, cpu.r.de);
    cpu.setNFlag(0);
  },

  0x1a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(memory.readByte(cpu.r.de))
    );
  },

  0x1b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.addWord(cpu.r.de, -1);
  },

  0x1c: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(Primitive.lower(cpu.r.de), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.lower(cpu.r.de));
    cpu.r.de = Primitive.setLower(cpu.r.de, operand);

    cpu.checkZFlag(Primitive.lower(cpu.r.de));
    cpu.setNFlag(0);
  },

  0x1d: function (cpu: CPU, memory: Memory): void {
    // check for half carry on affected byte only
    cpu.checkHalfCarry(Primitive.lower(cpu.r.de), 1, true);
    cpu.r.de = Primitive.addLower(cpu.r.de, Primitive.toByte(-1));
    cpu.checkZFlag(Primitive.lower(cpu.r.de));
    cpu.setNFlag(1);
  },

  0x1e: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      Primitive.toByte(memory.readByte(cpu.pc))
    );
    cpu.pc += 1;
  },

  0x1f: function (cpu: CPU, memory: Memory): void {
    // rotate right through the carry flag
    // get the old carry value
    const oldCY = cpu.getCYFlag();
    // set the carry flag to the 0th bit of A
    cpu.setCYFlag(Primitive.upper(cpu.r.af) & 1);
    // rotate right
    const shifted = Primitive.upper(cpu.r.af) >> 1;
    // combine old flag and shifted, set to A
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(shifted | (oldCY << 7))
    );
    cpu.setHFlag(0);
    cpu.setNFlag(0);
    cpu.setZFlag(0);
  },

  0x20: function (cpu: CPU, memory: Memory): boolean {
    const incr = Primitive.toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;

    if (!cpu.getZFlag()) {
      // increment pc if zero flag was reset
      cpu.pc = Primitive.addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x21: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = memory.readWord(cpu.pc);
    cpu.pc += 2;
  },

  0x22: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.upper(cpu.r.af));
    cpu.r.hl = Primitive.addWord(cpu.r.hl, 1);
  },

  0x23: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.addWord(cpu.r.hl, 1);
  },

  0x24: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    cpu.checkHalfCarry(Primitive.upper(cpu.r.hl), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(cpu.r.hl));
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, operand);

    cpu.checkZFlag(operand);
    cpu.setNFlag(0);
  },

  0x25: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(Primitive.upper(cpu.r.hl), 1, true);
    cpu.r.hl = Primitive.addUpper(cpu.r.hl, Primitive.toByte(-1));
    cpu.checkZFlag(Primitive.upper(cpu.r.hl));
    cpu.setNFlag(1);
  },

  0x26: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      Primitive.toByte(memory.readByte(cpu.pc))
    );
    cpu.pc += 1;
  },

  /**
   * DAA instruction taken from - https://forums.nesdev.com/viewtopic.php?t=15944#p196282
   */
  0x27: function (cpu: CPU, memory: Memory): void {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    if (!cpu.getNFlag()) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (cpu.getCYFlag() || Primitive.upper(cpu.r.af) > 0x99) {
        cpu.r.af = Primitive.addUpper(cpu.r.af, 0x60);
        cpu.setCYFlag(1);
      }
      if (cpu.getHFlag() || (Primitive.upper(cpu.r.af) & 0x0f) > 0x09) {
        cpu.r.af = Primitive.addUpper(cpu.r.af, 0x6);
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (cpu.getCYFlag()) {
        cpu.r.af = Primitive.addUpper(cpu.r.af, -0x60);
      }
      if (cpu.getHFlag()) {
        cpu.r.af = Primitive.addUpper(cpu.r.af, -0x6);
      }
    }
    // these flags are always updated
    cpu.checkZFlag(Primitive.upper(cpu.r.af));
    cpu.setHFlag(0); // h flag is always cleared
  },

  0x28: function (cpu: CPU, memory: Memory): boolean {
    const incr = Primitive.toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;
    if (cpu.getZFlag()) {
      cpu.pc = Primitive.addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x29: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.r.hl);
    cpu.checkHalfCarry(Primitive.upper(cpu.r.hl), Primitive.upper(cpu.r.hl));
    cpu.r.hl = Primitive.addWord(cpu.r.hl, cpu.r.hl);
    cpu.setNFlag(0);
  },

  0x2a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
    cpu.r.hl = Primitive.addWord(cpu.r.hl, 1);
  },

  0x2b: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.addWord(cpu.r.hl, -1);
  },

  0x2c: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(Primitive.lower(cpu.r.hl), 1);
    cpu.r.hl = Primitive.addLower(cpu.r.hl, 1);
    cpu.checkZFlag(Primitive.lower(cpu.r.hl));
    cpu.setNFlag(0);
  },

  0x2d: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(Primitive.lower(cpu.r.hl), 1, true);
    cpu.r.hl = Primitive.addLower(cpu.r.hl, Primitive.toByte(-1));
    cpu.checkZFlag(Primitive.lower(cpu.r.hl));
    cpu.setNFlag(1);
  },

  0x2e: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      Primitive.toByte(memory.readByte(cpu.pc))
    );
    cpu.pc += 1;
  },

  0x2f: function (cpu: CPU): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(~Primitive.upper(cpu.r.af))
    );
    cpu.setNFlag(1);
    cpu.setHFlag(1);
  },

  0x30: function (cpu: CPU, memory: Memory): boolean {
    const incr = Primitive.toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;
    if (!cpu.getCYFlag()) {
      cpu.pc = Primitive.addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x31: function (cpu: CPU, memory: Memory): void {
    cpu.sp = memory.readWord(cpu.pc);
    cpu.pc += 2;
  },

  0x32: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.upper(cpu.r.af));
    cpu.r.hl = Primitive.addWord(cpu.r.hl, -1);
  },

  0x33: function (cpu: CPU, memory: Memory): void {
    cpu.sp = Primitive.addWord(cpu.sp, 1);
  },

  0x34: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let operand: byte = 1;
    const newVal: byte = Primitive.toByte(memory.readByte(cpu.r.hl));
    // check for half carry on affected byte only
    cpu.checkHalfCarry(newVal, operand);
    operand = Primitive.addByte(operand, newVal);
    memory.writeByte(cpu.r.hl, operand);

    cpu.checkZFlag(operand);
    cpu.setNFlag(0);
  },

  0x35: function (cpu: CPU, memory: Memory): void {
    // convert operand to unsigned
    let newVal: byte = Primitive.toByte(memory.readByte(cpu.r.hl));
    // check for half carry on affected byte only
    cpu.checkHalfCarry(newVal, 1, true);
    newVal = Primitive.addByte(newVal, Primitive.toByte(-1));
    memory.writeByte(cpu.r.hl, newVal);
    cpu.checkZFlag(newVal);
    cpu.setNFlag(1);
  },

  0x36: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0x37: function (cpu: CPU, memory: Memory): void {
    cpu.setCYFlag(1);
    cpu.setNFlag(0);
    cpu.setHFlag(0);
  },

  0x38: function (cpu: CPU, memory: Memory): boolean {
    const incr = Primitive.toSigned(memory.readByte(cpu.pc));
    cpu.pc += 1;
    if (cpu.getCYFlag()) {
      cpu.pc = Primitive.addWord(cpu.pc, incr);
      return true;
    }
    return false;
  },

  0x39: function (cpu: CPU, memory: Memory): void {
    cpu.checkFullCarry16(cpu.r.hl, cpu.sp);
    cpu.checkHalfCarry(Primitive.upper(cpu.r.hl), Primitive.upper(cpu.sp));
    cpu.r.hl = Primitive.addWord(cpu.r.hl, cpu.sp);
    cpu.setNFlag(0);
  },

  0x3a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
    cpu.r.hl = Primitive.addWord(cpu.r.hl, -1);
  },

  0x3b: function (cpu: CPU, memory: Memory): void {
    cpu.sp = Primitive.addWord(cpu.sp, -1);
  },

  0x3c: function (cpu: CPU, memory: Memory): void {
    let operand: byte = 1;
    cpu.checkHalfCarry(Primitive.upper(cpu.r.af), operand);
    operand = Primitive.addByte(operand, Primitive.upper(cpu.r.af));
    cpu.r.af = Primitive.setUpper(cpu.r.af, operand);
    cpu.checkZFlag(operand);
    cpu.setNFlag(0);
  },

  0x3d: function (cpu: CPU, memory: Memory): void {
    cpu.checkHalfCarry(Primitive.upper(cpu.r.af), 1, true);
    cpu.r.af = Primitive.addUpper(cpu.r.af, Primitive.toByte(-1));
    cpu.checkZFlag(Primitive.upper(cpu.r.af));
    cpu.setNFlag(1);
  },

  0x3e: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(memory.readByte(cpu.pc))
    );
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
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, Primitive.upper(cpu.r.bc));
  },

  0x41: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, Primitive.lower(cpu.r.bc));
  },

  0x42: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, Primitive.upper(cpu.r.de));
  },

  0x43: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, Primitive.lower(cpu.r.de));
  },

  0x44: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, Primitive.upper(cpu.r.hl));
  },

  0x45: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, Primitive.lower(cpu.r.hl));
  },

  0x46: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
  },

  0x47: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, Primitive.upper(cpu.r.af));
  },

  0x48: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, Primitive.upper(cpu.r.bc));
  },

  0x49: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, Primitive.lower(cpu.r.bc));
  },

  0x4a: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, Primitive.upper(cpu.r.de));
  },

  0x4b: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, Primitive.lower(cpu.r.de));
  },

  0x4c: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, Primitive.upper(cpu.r.hl));
  },

  0x4d: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, Primitive.lower(cpu.r.hl));
  },

  0x4e: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
  },

  0x4f: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, Primitive.upper(cpu.r.af));
  },

  0x50: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, Primitive.upper(cpu.r.bc));
  },

  0x51: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, Primitive.lower(cpu.r.bc));
  },

  0x52: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, Primitive.upper(cpu.r.de));
  },

  0x53: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, Primitive.lower(cpu.r.de));
  },

  0x54: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, Primitive.upper(cpu.r.hl));
  },

  0x55: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, Primitive.lower(cpu.r.hl));
  },

  0x56: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
  },

  0x57: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, Primitive.upper(cpu.r.af));
  },

  0x58: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, Primitive.upper(cpu.r.bc));
  },

  0x59: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, Primitive.upper(cpu.r.bc));
  },

  0x5a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, Primitive.upper(cpu.r.de));
  },

  0x5b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, Primitive.lower(cpu.r.de));
  },

  0x5c: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, Primitive.upper(cpu.r.hl));
  },

  0x5d: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, Primitive.lower(cpu.r.hl));
  },

  0x5e: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
  },

  0x5f: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, Primitive.upper(cpu.r.af));
  },

  0x60: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, Primitive.upper(cpu.r.bc));
  },

  0x61: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, Primitive.lower(cpu.r.bc));
  },

  0x62: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, Primitive.upper(cpu.r.de));
  },

  0x63: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, Primitive.lower(cpu.r.de));
  },

  0x64: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, Primitive.upper(cpu.r.hl));
  },

  0x65: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, Primitive.lower(cpu.r.hl));
  },

  0x66: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
  },

  0x67: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, Primitive.upper(cpu.r.af));
  },

  0x68: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, Primitive.upper(cpu.r.bc));
  },

  0x69: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, Primitive.lower(cpu.r.bc));
  },

  0x6a: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, Primitive.upper(cpu.r.de));
  },

  0x6b: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, Primitive.lower(cpu.r.de));
  },

  0x6c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, Primitive.upper(cpu.r.hl));
  },

  0x6d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, Primitive.lower(cpu.r.hl));
  },

  0x6e: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
  },

  0x6f: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, Primitive.upper(cpu.r.af));
  },

  0x70: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.upper(cpu.r.bc));
  },

  0x71: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.lower(cpu.r.bc));
  },

  0x72: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.upper(cpu.r.de));
  },

  0x73: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.lower(cpu.r.de));
  },

  0x74: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.upper(cpu.r.hl));
  },

  0x75: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.lower(cpu.r.hl));
  },

  0x76: function (cpu: CPU, memory: Memory): void {
    cpu.halted = true;
  },

  0x77: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, Primitive.upper(cpu.r.af));
  },

  0x78: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.upper(cpu.r.bc));
  },

  0x79: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.lower(cpu.r.bc));
  },

  0x7a: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.upper(cpu.r.de));
  },

  0x7b: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.lower(cpu.r.de));
  },

  0x7c: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.upper(cpu.r.hl));
  },

  0x7d: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.lower(cpu.r.hl));
  },

  0x7e: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(memory.readByte(cpu.r.hl))
    );
  },

  0x7f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, Primitive.upper(cpu.r.af));
  },

  0x80: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.upper(cpu.r.bc));
  },

  0x81: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.lower(cpu.r.bc));
  },

  0x82: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.upper(cpu.r.de));
  },

  0x83: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.lower(cpu.r.de));
  },

  0x84: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.upper(cpu.r.hl));
  },

  0x85: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.lower(cpu.r.hl));
  },

  0x86: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.toByte(memory.readByte(cpu.r.hl)));
  },

  0x87: function (cpu: CPU, memory: Memory): void {
    ADD(cpu, Primitive.upper(cpu.r.af));
  },

  0x88: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.upper(cpu.r.bc));
  },

  0x89: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.lower(cpu.r.bc));
  },

  0x8a: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.upper(cpu.r.de));
  },

  0x8b: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.lower(cpu.r.de));
  },

  0x8c: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.upper(cpu.r.hl));
  },

  0x8d: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.lower(cpu.r.hl));
  },

  0x8e: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.toByte(memory.readByte(cpu.r.hl)));
  },

  0x8f: function (cpu: CPU, memory: Memory): void {
    ADC(cpu, Primitive.upper(cpu.r.af));
  },

  0x90: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.upper(cpu.r.bc));
  },

  0x91: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.lower(cpu.r.bc));
  },

  0x92: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.upper(cpu.r.de));
  },

  0x93: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.lower(cpu.r.de));
  },

  0x94: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.upper(cpu.r.hl));
  },

  0x95: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.lower(cpu.r.hl));
  },

  0x96: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.toByte(memory.readByte(cpu.r.hl)));
  },

  0x97: function (cpu: CPU, memory: Memory): void {
    SUB(cpu, Primitive.upper(cpu.r.af));
  },

  0x98: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.upper(cpu.r.bc));
  },

  0x99: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.lower(cpu.r.bc));
  },

  0x9a: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.upper(cpu.r.de));
  },

  0x9b: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.lower(cpu.r.de));
  },

  0x9c: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.upper(cpu.r.hl));
  },

  0x9d: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.lower(cpu.r.hl));
  },

  0x9e: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.toByte(memory.readByte(cpu.r.hl)));
  },

  0x9f: function (cpu: CPU, memory: Memory): void {
    SBC(cpu, Primitive.upper(cpu.r.af));
  },

  0xa0: function (cpu: CPU, memory: Memory): void {
    AND(cpu, Primitive.upper(cpu.r.bc));
  },

  0xa1: function (cpu: CPU, memory: Memory): void {
    AND(cpu, Primitive.lower(cpu.r.bc));
  },

  0xa2: function (cpu: CPU, memory: Memory): void {
    AND(cpu, Primitive.upper(cpu.r.de));
  },

  0xa3: function (cpu: CPU, memory: Memory): void {
    AND(cpu, Primitive.lower(cpu.r.de));
  },

  0xa4: function (cpu: CPU, memory: Memory): void {
    AND(cpu, Primitive.upper(cpu.r.hl));
  },

  0xa5: function (cpu: CPU, memory: Memory): void {
    AND(cpu, Primitive.lower(cpu.r.hl));
  },

  0xa6: function (cpu: CPU, memory: Memory): void {
    AND(cpu, memory.readByte(cpu.r.hl));
  },

  0xa7: function (cpu: CPU, memory: Memory): void {
    AND(cpu, Primitive.upper(cpu.r.af));
  },

  0xa8: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, Primitive.upper(cpu.r.bc));
  },

  0xa9: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, Primitive.lower(cpu.r.bc));
  },

  0xaa: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, Primitive.upper(cpu.r.de));
  },

  0xab: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, Primitive.lower(cpu.r.de));
  },

  0xac: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, Primitive.upper(cpu.r.hl));
  },

  0xad: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, Primitive.lower(cpu.r.hl));
  },

  0xae: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, memory.readByte(cpu.r.hl));
  },

  0xaf: function (cpu: CPU, memory: Memory): void {
    XOR(cpu, Primitive.upper(cpu.r.af));
  },

  0xb0: function (cpu: CPU, memory: Memory): void {
    OR(cpu, Primitive.upper(cpu.r.bc));
  },

  0xb1: function (cpu: CPU, memory: Memory): void {
    OR(cpu, Primitive.lower(cpu.r.bc));
  },

  0xb2: function (cpu: CPU, memory: Memory): void {
    OR(cpu, Primitive.upper(cpu.r.de));
  },

  0xb3: function (cpu: CPU, memory: Memory): void {
    OR(cpu, Primitive.lower(cpu.r.de));
  },

  0xb4: function (cpu: CPU, memory: Memory): void {
    OR(cpu, Primitive.upper(cpu.r.hl));
  },

  0xb5: function (cpu: CPU, memory: Memory): void {
    OR(cpu, Primitive.lower(cpu.r.hl));
  },

  0xb6: function (cpu: CPU, memory: Memory): void {
    OR(cpu, memory.readByte(cpu.r.hl));
  },

  0xb7: function (cpu: CPU, memory: Memory): void {
    OR(cpu, Primitive.upper(cpu.r.af));
  },

  0xb8: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.upper(cpu.r.bc));
  },

  0xb9: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.lower(cpu.r.bc));
  },

  0xba: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.upper(cpu.r.de));
  },

  0xbb: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.lower(cpu.r.de));
  },

  0xbc: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.upper(cpu.r.hl));
  },

  0xbd: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.lower(cpu.r.hl));
  },

  0xbe: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.toByte(memory.readByte(cpu.r.hl)));
  },

  0xbf: function (cpu: CPU, memory: Memory): void {
    CP(cpu, Primitive.upper(cpu.r.af));
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
    const value = Primitive.toByte(memory.readByte(cpu.pc));
    cpu.checkFullCarry8(Primitive.upper(cpu.r.af), value);
    cpu.checkHalfCarry(Primitive.upper(cpu.r.af), value);
    cpu.r.af = Primitive.addUpper(cpu.r.af, value);
    cpu.checkZFlag(Primitive.upper(cpu.r.af));
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
      cpu.sp = Primitive.addWord(cpu.sp, 2);
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
    cpu.addCalledInstruction(`CB: ${Primitive.toHex(opcode)}`);
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
    ADC(cpu, Primitive.toByte(memory.readByte(cpu.pc)));
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
    SBC(cpu, Primitive.toByte(memory.readByte(cpu.pc)));
    cpu.pc += 1;
  },

  0xdf: function (cpu: CPU, memory: Memory): void {
    RST(cpu, memory, 0x18);
  },

  0xe0: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(
      0xff00 + memory.readByte(cpu.pc),
      Primitive.upper(cpu.r.af)
    );
    cpu.pc += 1;
  },

  0xe1: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = POP(cpu, memory);
  },

  0xe2: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(
      0xff00 + Primitive.lower(cpu.r.bc),
      Primitive.upper(cpu.r.af)
    );
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
    const operand = Primitive.toWord(
      Primitive.toSigned(memory.readByte(cpu.pc))
    );
    cpu.checkFullCarry16(cpu.sp, operand);
    cpu.checkHalfCarry(Primitive.upper(cpu.sp), Primitive.upper(operand));
    cpu.sp = Primitive.addWord(cpu.sp, operand);
    cpu.pc += 1;
    cpu.setZFlag(0);
    cpu.setNFlag(0);
  },

  0xe9: function (cpu: CPU, memory: Memory): void {
    cpu.pc = cpu.r.hl;
  },

  0xea: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(memory.readWord(cpu.pc), Primitive.upper(cpu.r.af));
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
    XOR(cpu, Primitive.toByte(memory.readByte(cpu.pc)));
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
    cpu.r.af = Primitive.setUpper(cpu.r.af, data);
    cpu.pc += 1;
    if (cpu.pc === 565) debugger;
  },

  0xf1: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = POP(cpu, memory);
  },

  0xf2: function (cpu: CPU, memory: Memory): void {
    const data = memory.readByte(0xff00 + Primitive.lower(cpu.r.bc));
    cpu.r.af = Primitive.setUpper(cpu.r.af, data);
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
    let incr = Primitive.toWord(Primitive.toSigned(memory.readByte(cpu.pc)));
    cpu.checkHalfCarry(Primitive.upper(incr), Primitive.upper(cpu.sp));
    cpu.checkFullCarry16(incr, cpu.sp);
    cpu.pc += 1;
    incr = Primitive.addWord(incr, cpu.sp);
    cpu.r.hl = incr;
    cpu.setZFlag(0);
    cpu.setNFlag(0);
  },

  0xf9: function (cpu: CPU, memory: Memory): void {
    cpu.sp = cpu.r.hl;
  },

  0xfa: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      Primitive.toByte(memory.readByte(memory.readWord(cpu.pc)))
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
  const result: byte = Primitive.toByte(shifted | (shifted >> 8));
  cpu.checkZFlag(result);
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  return result;
}

function RLn(cpu: CPU, reg: byte): byte {
  const oldCY = cpu.getCYFlag();
  cpu.setCYFlag(reg >> 7);
  const shifted = reg << 1;
  const result = Primitive.toByte(shifted | oldCY);
  cpu.checkZFlag(result);
  cpu.setHFlag(0);
  cpu.setNFlag(0);
  return result;
}

function RRCn(cpu: CPU, reg: byte): byte {
  const bitZero = reg & 1;
  cpu.setCYFlag(bitZero);
  const shifted: byte = reg >> 1;
  const result: byte = Primitive.toByte(shifted | (bitZero << 7));
  cpu.checkZFlag(result);
  cpu.setNFlag(0);
  cpu.setHFlag(0);
  return result;
}

function RRn(cpu: CPU, reg: byte): byte {
  const oldCY = cpu.getCYFlag();
  cpu.setCYFlag(reg & 1);
  const shifted = reg >> 1;
  const result: byte = Primitive.toByte(shifted | (oldCY << 7));
  cpu.checkZFlag(result);
  cpu.setHFlag(0);
  cpu.setNFlag(0);
  return result;
}

function SLAn(cpu: CPU, reg: byte): byte {
  cpu.setCYFlag(reg << 7);
  const result = Primitive.toByte(reg << 1);
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

function SWAP(cpu: CPU, reg: byte): byte {
  const upper = reg >> 4;
  const lower = reg & 0xf;
  const result = (lower << 4) | upper;
  cpu.checkZFlag(result);
  return result;
}

const cbMap: OpcodeList = {
  0x00: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      RLCn(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x01: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      RLCn(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x02: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      RLCn(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x03: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      RLCn(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x04: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      RLCn(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x05: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      RLCn(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x06: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RLCn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x07: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      RLCn(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x08: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      RRCn(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x09: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      RRCn(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x0a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      RRCn(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x0b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      RRCn(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x0c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      RRCn(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x0d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      RRCn(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x0e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RRCn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x0f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      RRCn(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x10: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      RLn(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x11: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      RLn(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x12: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      RLn(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x13: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      RLn(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x14: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      RLn(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x15: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      RLn(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x16: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RLn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x17: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      RLn(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x18: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      RLn(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x19: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      RRn(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x1a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      RRn(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x1b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      RRn(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x1c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      RRn(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x1d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      RRn(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x1e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RRn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x1f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      RRn(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x20: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      SLAn(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x21: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      SLAn(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x22: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      SLAn(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x23: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      SLAn(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x24: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      SLAn(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x25: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      SLAn(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x26: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SLAn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x27: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      SLAn(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x28: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      SRAn(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x29: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      SRAn(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x2a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      SRAn(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x2b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      SRAn(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x2c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      SRAn(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x2d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      SRAn(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x2e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SRAn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x2f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      SRAn(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x30: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      SWAP(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x31: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      SWAP(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x32: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      SWAP(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x33: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      SWAP(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x34: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      SWAP(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x35: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      SWAP(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x36: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SWAP(cpu, memory.readByte(cpu.r.hl)));
  },
  0x37: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      SWAP(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x38: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(
      cpu.r.bc,
      SRLn(cpu, Primitive.upper(cpu.r.bc))
    );
  },
  0x39: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(
      cpu.r.bc,
      SRLn(cpu, Primitive.lower(cpu.r.bc))
    );
  },
  0x3a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(
      cpu.r.de,
      SRLn(cpu, Primitive.upper(cpu.r.de))
    );
  },
  0x3b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(
      cpu.r.de,
      SRLn(cpu, Primitive.lower(cpu.r.de))
    );
  },
  0x3c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(
      cpu.r.hl,
      SRLn(cpu, Primitive.upper(cpu.r.hl))
    );
  },
  0x3d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(
      cpu.r.hl,
      SRLn(cpu, Primitive.lower(cpu.r.hl))
    );
  },
  0x3e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SRLn(cpu, memory.readByte(cpu.r.hl)));
  },
  0x3f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(
      cpu.r.af,
      SRLn(cpu, Primitive.upper(cpu.r.af))
    );
  },
  0x40: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, Primitive.upper(cpu.r.bc));
  },
  0x41: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, Primitive.lower(cpu.r.bc));
  },
  0x42: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, Primitive.upper(cpu.r.de));
  },
  0x43: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, Primitive.lower(cpu.r.de));
  },
  0x44: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, Primitive.upper(cpu.r.hl));
  },
  0x45: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, Primitive.lower(cpu.r.hl));
  },
  0x46: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, memory.readByte(cpu.r.hl));
  },
  0x47: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 0, Primitive.upper(cpu.r.af));
  },
  0x48: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, Primitive.upper(cpu.r.bc));
  },
  0x49: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, Primitive.lower(cpu.r.bc));
  },
  0x4a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, Primitive.upper(cpu.r.de));
  },
  0x4b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, Primitive.lower(cpu.r.de));
  },
  0x4c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, Primitive.upper(cpu.r.hl));
  },
  0x4d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, Primitive.lower(cpu.r.hl));
  },
  0x4e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, memory.readByte(cpu.r.hl));
  },
  0x4f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 1, Primitive.upper(cpu.r.af));
  },
  0x50: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, Primitive.upper(cpu.r.bc));
  },
  0x51: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, Primitive.lower(cpu.r.bc));
  },
  0x52: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, Primitive.upper(cpu.r.de));
  },
  0x53: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, Primitive.lower(cpu.r.de));
  },
  0x54: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, Primitive.upper(cpu.r.hl));
  },
  0x55: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, Primitive.lower(cpu.r.hl));
  },
  0x56: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, memory.readByte(cpu.r.hl));
  },
  0x57: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 2, Primitive.upper(cpu.r.af));
  },
  0x58: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, Primitive.upper(cpu.r.bc));
  },
  0x59: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, Primitive.lower(cpu.r.bc));
  },
  0x5a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, Primitive.upper(cpu.r.de));
  },
  0x5b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, Primitive.lower(cpu.r.de));
  },
  0x5c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, Primitive.upper(cpu.r.hl));
  },
  0x5d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, Primitive.lower(cpu.r.hl));
  },
  0x5e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, memory.readByte(cpu.r.hl));
  },
  0x5f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 3, Primitive.upper(cpu.r.af));
  },
  0x60: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, Primitive.upper(cpu.r.bc));
  },
  0x61: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, Primitive.lower(cpu.r.bc));
  },
  0x62: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, Primitive.upper(cpu.r.de));
  },
  0x63: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, Primitive.lower(cpu.r.de));
  },
  0x64: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, Primitive.upper(cpu.r.hl));
  },
  0x65: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, Primitive.lower(cpu.r.hl));
  },
  0x66: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, memory.readByte(cpu.r.hl));
  },
  0x67: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 4, Primitive.upper(cpu.r.af));
  },
  0x68: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, Primitive.upper(cpu.r.bc));
  },
  0x69: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, Primitive.lower(cpu.r.bc));
  },
  0x6a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, Primitive.upper(cpu.r.de));
  },
  0x6b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, Primitive.lower(cpu.r.de));
  },
  0x6c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, Primitive.upper(cpu.r.hl));
  },
  0x6d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, Primitive.lower(cpu.r.hl));
  },
  0x6e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, memory.readByte(cpu.r.hl));
  },
  0x6f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 5, Primitive.upper(cpu.r.af));
  },
  0x70: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, Primitive.upper(cpu.r.bc));
  },
  0x71: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, Primitive.lower(cpu.r.bc));
  },
  0x72: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, Primitive.upper(cpu.r.de));
  },
  0x73: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, Primitive.lower(cpu.r.de));
  },
  0x74: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, Primitive.upper(cpu.r.hl));
  },
  0x75: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, Primitive.lower(cpu.r.hl));
  },
  0x76: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, memory.readByte(cpu.r.hl));
  },
  0x77: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 6, Primitive.upper(cpu.r.af));
  },
  0x78: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, Primitive.upper(cpu.r.bc));
  },
  0x79: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, Primitive.lower(cpu.r.bc));
  },
  0x7a: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, Primitive.upper(cpu.r.de));
  },
  0x7b: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, Primitive.lower(cpu.r.de));
  },
  0x7c: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, Primitive.upper(cpu.r.hl));
  },
  0x7d: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, Primitive.lower(cpu.r.hl));
  },
  0x7e: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, memory.readByte(cpu.r.hl));
  },
  0x7f: function (cpu: CPU, memory: Memory): void {
    BIT(cpu, 7, Primitive.upper(cpu.r.af));
  },
  0x80: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES0(Primitive.upper(cpu.r.bc)));
  },
  0x81: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES0(Primitive.lower(cpu.r.bc)));
  },
  0x82: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES0(Primitive.upper(cpu.r.de)));
  },
  0x83: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES0(Primitive.lower(cpu.r.de)));
  },
  0x84: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES0(Primitive.upper(cpu.r.hl)));
  },
  0x85: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES0(Primitive.lower(cpu.r.hl)));
  },
  0x86: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES0(memory.readByte(cpu.r.hl)));
  },
  0x87: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES0(Primitive.upper(cpu.r.af)));
  },
  0x88: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES1(Primitive.upper(cpu.r.bc)));
  },
  0x89: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES1(Primitive.lower(cpu.r.bc)));
  },
  0x8a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES1(Primitive.upper(cpu.r.de)));
  },
  0x8b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES1(Primitive.lower(cpu.r.de)));
  },
  0x8c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES1(Primitive.upper(cpu.r.hl)));
  },
  0x8d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES1(Primitive.lower(cpu.r.hl)));
  },
  0x8e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES1(memory.readByte(cpu.r.hl)));
  },
  0x8f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES1(Primitive.upper(cpu.r.af)));
  },
  0x90: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES2(Primitive.upper(cpu.r.bc)));
  },
  0x91: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES2(Primitive.lower(cpu.r.bc)));
  },
  0x92: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES2(Primitive.upper(cpu.r.de)));
  },
  0x93: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES2(Primitive.lower(cpu.r.de)));
  },
  0x94: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES2(Primitive.upper(cpu.r.hl)));
  },
  0x95: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES2(Primitive.lower(cpu.r.hl)));
  },
  0x96: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES2(memory.readByte(cpu.r.hl)));
  },
  0x97: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES2(Primitive.upper(cpu.r.af)));
  },
  0x98: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES3(Primitive.upper(cpu.r.bc)));
  },
  0x99: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES3(Primitive.lower(cpu.r.bc)));
  },
  0x9a: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES3(Primitive.upper(cpu.r.de)));
  },
  0x9b: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES3(Primitive.lower(cpu.r.de)));
  },
  0x9c: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES3(Primitive.upper(cpu.r.hl)));
  },
  0x9d: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES3(Primitive.lower(cpu.r.hl)));
  },
  0x9e: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES3(memory.readByte(cpu.r.hl)));
  },
  0x9f: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES3(Primitive.upper(cpu.r.af)));
  },
  0xa0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES4(Primitive.upper(cpu.r.bc)));
  },
  0xa1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES4(Primitive.lower(cpu.r.bc)));
  },
  0xa2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES4(Primitive.upper(cpu.r.de)));
  },
  0xa3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES4(Primitive.lower(cpu.r.de)));
  },
  0xa4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES4(Primitive.upper(cpu.r.hl)));
  },
  0xa5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES4(Primitive.lower(cpu.r.hl)));
  },
  0xa6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES4(memory.readByte(cpu.r.hl)));
  },
  0xa7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES4(Primitive.upper(cpu.r.af)));
  },
  0xa8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES5(Primitive.upper(cpu.r.bc)));
  },
  0xa9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES5(Primitive.lower(cpu.r.bc)));
  },
  0xaa: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES5(Primitive.upper(cpu.r.de)));
  },
  0xab: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES5(Primitive.lower(cpu.r.de)));
  },
  0xac: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES5(Primitive.upper(cpu.r.hl)));
  },
  0xad: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES5(Primitive.lower(cpu.r.hl)));
  },
  0xae: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES5(memory.readByte(cpu.r.hl)));
  },
  0xaf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES5(Primitive.upper(cpu.r.af)));
  },
  0xb0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES6(Primitive.upper(cpu.r.bc)));
  },
  0xb1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES6(Primitive.lower(cpu.r.bc)));
  },
  0xb2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES6(Primitive.upper(cpu.r.de)));
  },
  0xb3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES6(Primitive.lower(cpu.r.de)));
  },
  0xb4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES6(Primitive.upper(cpu.r.hl)));
  },
  0xb5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES6(Primitive.lower(cpu.r.hl)));
  },
  0xb6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES6(memory.readByte(cpu.r.hl)));
  },
  0xb7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES6(Primitive.upper(cpu.r.af)));
  },
  0xb8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, RES7(Primitive.upper(cpu.r.bc)));
  },
  0xb9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, RES7(Primitive.lower(cpu.r.bc)));
  },
  0xba: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, RES7(Primitive.upper(cpu.r.de)));
  },
  0xbb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, RES7(Primitive.lower(cpu.r.de)));
  },
  0xbc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, RES7(Primitive.upper(cpu.r.hl)));
  },
  0xbd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, RES7(Primitive.lower(cpu.r.hl)));
  },
  0xbe: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, RES7(memory.readByte(cpu.r.hl)));
  },
  0xbf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, RES7(Primitive.upper(cpu.r.af)));
  },
  0xc0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(0, Primitive.upper(cpu.r.bc)));
  },
  0xc1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, SET(0, Primitive.lower(cpu.r.bc)));
  },
  0xc2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(0, Primitive.upper(cpu.r.de)));
  },
  0xc3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(0, Primitive.lower(cpu.r.de)));
  },
  0xc4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(0, Primitive.upper(cpu.r.hl)));
  },
  0xc5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, SET(0, Primitive.lower(cpu.r.hl)));
  },
  0xc6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(0, memory.readByte(cpu.r.hl)));
  },
  0xc7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(0, Primitive.lower(cpu.r.af)));
  },
  0xc8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(1, Primitive.upper(cpu.r.bc)));
  },
  0xc9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, SET(1, Primitive.lower(cpu.r.bc)));
  },
  0xca: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(1, Primitive.upper(cpu.r.de)));
  },
  0xcb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(1, Primitive.lower(cpu.r.de)));
  },
  0xcc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(1, Primitive.upper(cpu.r.hl)));
  },
  0xcd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, SET(1, Primitive.lower(cpu.r.hl)));
  },
  0xce: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(1, memory.readByte(cpu.r.hl)));
  },
  0xcf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(1, Primitive.upper(cpu.r.af)));
  },
  0xd0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(2, Primitive.upper(cpu.r.bc)));
  },
  0xd1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(2, Primitive.lower(cpu.r.bc)));
  },
  0xd2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(2, Primitive.upper(cpu.r.de)));
  },
  0xd3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(2, Primitive.lower(cpu.r.de)));
  },
  0xd4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(2, Primitive.upper(cpu.r.hl)));
  },
  0xd5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, SET(2, Primitive.lower(cpu.r.hl)));
  },
  0xd6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(2, memory.readByte(cpu.r.hl)));
  },
  0xd7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(2, Primitive.upper(cpu.r.af)));
  },
  0xd8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(3, Primitive.upper(cpu.r.bc)));
  },
  0xd9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, SET(3, Primitive.lower(cpu.r.bc)));
  },
  0xda: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(3, Primitive.upper(cpu.r.de)));
  },
  0xdb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(3, Primitive.lower(cpu.r.de)));
  },
  0xdc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(3, Primitive.upper(cpu.r.hl)));
  },
  0xdd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, SET(3, Primitive.lower(cpu.r.hl)));
  },
  0xde: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(3, memory.readByte(cpu.r.hl)));
  },
  0xdf: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(3, Primitive.upper(cpu.r.af)));
  },
  0xe0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(4, Primitive.upper(cpu.r.bc)));
  },
  0xe1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, SET(4, Primitive.lower(cpu.r.bc)));
  },
  0xe2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(4, Primitive.upper(cpu.r.de)));
  },
  0xe3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(4, Primitive.lower(cpu.r.de)));
  },
  0xe4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(4, Primitive.upper(cpu.r.hl)));
  },
  0xe5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, SET(4, Primitive.lower(cpu.r.hl)));
  },
  0xe6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(4, memory.readByte(cpu.r.hl)));
  },
  0xe7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(4, Primitive.upper(cpu.r.af)));
  },
  0xe8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(5, Primitive.upper(cpu.r.bc)));
  },
  0xe9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, SET(5, Primitive.lower(cpu.r.bc)));
  },
  0xea: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(5, Primitive.upper(cpu.r.de)));
  },
  0xeb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(5, Primitive.lower(cpu.r.de)));
  },
  0xec: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(5, Primitive.upper(cpu.r.hl)));
  },
  0xed: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(5, Primitive.lower(cpu.r.hl)));
  },
  0xee: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(5, memory.readByte(cpu.r.hl)));
  },
  0xef: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(5, Primitive.upper(cpu.r.af)));
  },
  0xf0: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(6, Primitive.upper(cpu.r.bc)));
  },
  0xf1: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, SET(6, Primitive.lower(cpu.r.bc)));
  },
  0xf2: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(6, Primitive.upper(cpu.r.de)));
  },
  0xf3: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(6, Primitive.lower(cpu.r.de)));
  },
  0xf4: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(6, Primitive.upper(cpu.r.hl)));
  },
  0xf5: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, SET(6, Primitive.lower(cpu.r.hl)));
  },
  0xf6: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(6, memory.readByte(cpu.r.hl)));
  },
  0xf7: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(6, Primitive.upper(cpu.r.af)));
  },
  0xf8: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setUpper(cpu.r.bc, SET(7, Primitive.upper(cpu.r.bc)));
  },
  0xf9: function (cpu: CPU, memory: Memory): void {
    cpu.r.bc = Primitive.setLower(cpu.r.bc, SET(7, Primitive.lower(cpu.r.bc)));
  },
  0xfa: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setUpper(cpu.r.de, SET(7, Primitive.upper(cpu.r.de)));
  },
  0xfb: function (cpu: CPU, memory: Memory): void {
    cpu.r.de = Primitive.setLower(cpu.r.de, SET(7, Primitive.lower(cpu.r.de)));
  },
  0xfc: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setUpper(cpu.r.hl, SET(7, Primitive.upper(cpu.r.hl)));
  },
  0xfd: function (cpu: CPU, memory: Memory): void {
    cpu.r.hl = Primitive.setLower(cpu.r.hl, SET(7, Primitive.lower(cpu.r.hl)));
  },
  0xfe: function (cpu: CPU, memory: Memory): void {
    memory.writeByte(cpu.r.hl, SET(7, memory.readByte(cpu.r.hl)));
  },
  0xff: function (cpu: CPU, memory: Memory): void {
    cpu.r.af = Primitive.setUpper(cpu.r.af, SET(7, Primitive.upper(cpu.r.af)));
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
