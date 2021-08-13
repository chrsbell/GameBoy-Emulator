import Primitive from 'helpers/Primitives';

const OpcodeMap: OpcodeList = {
  0x00: function (): void {},

  0x01: function (): void {
    this.r.bc = this.memory.readWord(this.pc);
    this.pc += 2;
  },

  0x02: function (): void {
    this.memory.writeByte(this.r.bc, Primitive.upper(this.r.af));
  },

  0x03: function (): void {
    this.r.bc = Primitive.addWord(this.r.bc, 1);
  },

  0x04: function (): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    this.checkHalfCarryAdd(Primitive.upper(this.r.bc), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(this.r.bc));
    this.r.bc = Primitive.setUpper(this.r.bc, operand);

    this.checkZFlag(Primitive.upper(this.r.bc));
    this.setNFlag(0);
  },

  0x05: function (): void {
    this.checkHalfCarrySub(Primitive.upper(this.r.bc), 1);
    this.r.bc = Primitive.addUpper(this.r.bc, Primitive.toByte(-1));
    this.checkZFlag(Primitive.upper(this.r.bc));
    this.setNFlag(1);
  },

  0x06: function (): void {
    // load into B from pc (immediate)
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x07: function (): void {
    // check carry flag
    this.setCYFlag(Primitive.upper(this.r.af) >> 7);
    // left shift
    const shifted: byte = Primitive.upper(this.r.af) << 1;
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(shifted | (shifted >> 8))
    );
    // flag resets
    this.setNFlag(0);
    this.setHFlag(0);
    this.setZFlag(0);
  },

  0x08: function (): void {
    this.memory.writeWord(this.memory.readWord(this.pc), this.sp);
  },

  0x09: function (): void {
    this.checkFullCarryAdd16(this.r.hl, this.r.bc);
    this.checkHalfCarryAdd(
      Primitive.upper(this.r.hl),
      Primitive.upper(this.r.bc)
    );
    this.r.hl = Primitive.addWord(this.r.hl, this.r.bc);
    this.setNFlag(0);
  },

  0x0a: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(this.memory.readByte(this.r.bc))
    );
  },

  0x0b: function (): void {
    this.r.bc = Primitive.addWord(this.r.bc, -1);
  },

  0x0c: function (): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    this.checkHalfCarryAdd(Primitive.lower(this.r.bc), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.lower(this.r.bc));
    this.r.bc = Primitive.setLower(this.r.bc, operand);

    this.checkZFlag(Primitive.lower(this.r.bc));
    this.setNFlag(0);
  },

  0x0d: function (): void {
    // convert operand to unsigned
    this.checkHalfCarrySub(Primitive.lower(this.r.bc), 1);
    this.r.bc = Primitive.addLower(this.r.bc, Primitive.toByte(-1));
    this.checkZFlag(Primitive.lower(this.r.bc));
    this.setNFlag(1);
  },

  0x0e: function (): void {
    // load into C from pc (immediate)
    this.r.bc = Primitive.setLower(
      this.r.bc,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x0f: function (): void {
    // check carry flag
    const bitZero = Primitive.upper(this.r.af) & 1;
    this.setCYFlag(bitZero);
    // right shift
    const shifted: byte = Primitive.upper(this.r.af) >> 1;
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(shifted | (bitZero << 7))
    );
    // flag resets
    this.setNFlag(0);
    this.setHFlag(0);
    this.setZFlag(0);
  },

  0x10: function (): void {
    this.halted = true;
    console.log('Instruction halted.');
    throw new Error();
  },

  0x11: function (): void {
    this.r.de = this.memory.readWord(this.pc);
    this.pc += 2;
  },

  0x12: function (): void {
    this.memory.writeByte(this.r.de, Primitive.upper(this.r.af));
  },

  0x13: function (): void {
    this.r.de = Primitive.addWord(this.r.de, 1);
  },

  0x14: function (): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    this.checkHalfCarryAdd(Primitive.upper(this.r.de), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(this.r.de));
    this.r.de = Primitive.setUpper(this.r.de, operand);

    this.checkZFlag(Primitive.upper(this.r.de));
    this.setNFlag(0);
  },

  0x15: function (): void {
    // check for half carry on affected byte only
    this.checkHalfCarrySub(Primitive.upper(this.r.de), 1);
    this.r.de = Primitive.addUpper(this.r.de, Primitive.toByte(-1));
    this.checkZFlag(Primitive.upper(this.r.de));
    this.setNFlag(1);
  },

  0x16: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x17: function (): void {
    // need to rotate left through the carry flag
    // get the old carry value
    const oldCY = this.getCYFlag();
    // set the carry flag to the 7th bit of A
    this.setCYFlag(Primitive.upper(this.r.af) >> 7);
    // rotate left
    const shifted = Primitive.upper(this.r.af) << 1;
    // combine old flag and shifted, set to A
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(shifted | oldCY)
    );
    this.setHFlag(0);
    this.setNFlag(0);
    this.setZFlag(0);
  },

  0x18: function (): void {
    this.pc = Primitive.addWord(
      this.pc,
      Primitive.toSigned(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x19: function (): void {
    this.checkFullCarryAdd16(this.r.hl, this.r.de);
    this.checkHalfCarryAdd(
      Primitive.upper(this.r.hl),
      Primitive.upper(this.r.de)
    );
    this.r.hl = Primitive.addWord(this.r.hl, this.r.de);
    this.setNFlag(0);
  },

  0x1a: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(this.memory.readByte(this.r.de))
    );
  },

  0x1b: function (): void {
    this.r.de = Primitive.addWord(this.r.de, -1);
  },

  0x1c: function (): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    this.checkHalfCarryAdd(Primitive.lower(this.r.de), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.lower(this.r.de));
    this.r.de = Primitive.setLower(this.r.de, operand);

    this.checkZFlag(Primitive.lower(this.r.de));
    this.setNFlag(0);
  },

  0x1d: function (): void {
    // check for half carry on affected byte only
    this.checkHalfCarrySub(Primitive.lower(this.r.de), 1);
    this.r.de = Primitive.addLower(this.r.de, Primitive.toByte(-1));
    this.checkZFlag(Primitive.lower(this.r.de));
    this.setNFlag(1);
  },

  0x1e: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x1f: function (): void {
    // rotate right through the carry flag
    // get the old carry value
    const oldCY = this.getCYFlag();
    // set the carry flag to the 0th bit of A
    this.setCYFlag(Primitive.upper(this.r.af) & 1);
    // rotate right
    const shifted = Primitive.upper(this.r.af) >> 1;
    // combine old flag and shifted, set to A
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(shifted | (oldCY << 7))
    );
    this.setHFlag(0);
    this.setNFlag(0);
    this.setZFlag(0);
  },

  0x20: function (): boolean {
    const incr = Primitive.toSigned(this.memory.readByte(this.pc));
    this.pc += 1;

    if (!this.getZFlag()) {
      // increment pc if zero flag was reset
      this.pc = Primitive.addWord(this.pc, incr);
      return true;
    }
    return false;
  },

  0x21: function (): void {
    this.r.hl = this.memory.readWord(this.pc);
    this.pc += 2;
  },

  0x22: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.upper(this.r.af));
    this.r.hl = Primitive.addWord(this.r.hl, 1);
  },

  0x23: function (): void {
    this.r.hl = Primitive.addWord(this.r.hl, 1);
  },

  0x24: function (): void {
    // convert operand to unsigned
    let operand: byte = 1;
    // check for half carry on affected byte only
    this.checkHalfCarryAdd(Primitive.upper(this.r.hl), operand);
    // perform addition
    operand = Primitive.addByte(operand, Primitive.upper(this.r.hl));
    this.r.hl = Primitive.setUpper(this.r.hl, operand);

    this.checkZFlag(operand);
    this.setNFlag(0);
  },

  0x25: function (): void {
    this.checkHalfCarrySub(Primitive.upper(this.r.hl), 1);
    this.r.hl = Primitive.addUpper(this.r.hl, Primitive.toByte(-1));
    this.checkZFlag(Primitive.upper(this.r.hl));
    this.setNFlag(1);
  },

  0x26: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  /**
   * DAA instruction taken from - https://forums.nesdev.com/viewtopic.php?t=15944#p196282
   */
  0x27: function (): void {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    if (!this.getNFlag()) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (this.getCYFlag() || Primitive.upper(this.r.af) > 0x99) {
        this.r.af = Primitive.addUpper(this.r.af, 0x60);
        this.setCYFlag(1);
      }
      if (this.getHFlag() || (Primitive.upper(this.r.af) & 0x0f) > 0x09) {
        this.r.af = Primitive.addUpper(this.r.af, 0x6);
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (this.getCYFlag()) {
        this.r.af = Primitive.addUpper(this.r.af, -0x60);
      }
      if (this.getHFlag()) {
        this.r.af = Primitive.addUpper(this.r.af, -0x6);
      }
    }
    // these flags are always updated
    this.checkZFlag(Primitive.upper(this.r.af));
    this.setHFlag(0); // h flag is always cleared
  },

  0x28: function (): boolean {
    const incr = Primitive.toSigned(this.memory.readByte(this.pc));
    this.pc += 1;
    if (this.getZFlag()) {
      this.pc = Primitive.addWord(this.pc, incr);
      return true;
    }
    return false;
  },

  0x29: function (): void {
    this.checkFullCarryAdd16(this.r.hl, this.r.hl);
    this.checkHalfCarryAdd(
      Primitive.upper(this.r.hl),
      Primitive.upper(this.r.hl)
    );
    this.r.hl = Primitive.addWord(this.r.hl, this.r.hl);
    this.setNFlag(0);
  },

  0x2a: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
    this.r.hl = Primitive.addWord(this.r.hl, 1);
  },

  0x2b: function (): void {
    this.r.hl = Primitive.addWord(this.r.hl, -1);
  },

  0x2c: function (): void {
    this.checkHalfCarryAdd(Primitive.lower(this.r.hl), 1);
    this.r.hl = Primitive.addLower(this.r.hl, 1);
    this.checkZFlag(Primitive.lower(this.r.hl));
    this.setNFlag(0);
  },

  0x2d: function (): void {
    this.checkHalfCarrySub(Primitive.lower(this.r.hl), 1);
    this.r.hl = Primitive.addLower(this.r.hl, Primitive.toByte(-1));
    this.checkZFlag(Primitive.lower(this.r.hl));
    this.setNFlag(1);
  },

  0x2e: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x2f: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(~Primitive.upper(this.r.af))
    );
    this.setNFlag(1);
    this.setHFlag(1);
  },

  0x30: function (): boolean {
    const incr = Primitive.toSigned(this.memory.readByte(this.pc));
    this.pc += 1;
    if (!this.getCYFlag()) {
      this.pc = Primitive.addWord(this.pc, incr);
      return true;
    }
    return false;
  },

  0x31: function (): void {
    this.sp = this.memory.readWord(this.pc);
    this.pc += 2;
  },

  0x32: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.upper(this.r.af));
    this.r.hl = Primitive.addWord(this.r.hl, -1);
  },

  0x33: function (): void {
    this.sp = Primitive.addWord(this.sp, 1);
  },

  0x34: function (): void {
    // convert operand to unsigned
    let operand: byte = 1;
    const newVal: byte = Primitive.toByte(this.memory.readByte(this.r.hl));
    // check for half carry on affected byte only
    this.checkHalfCarryAdd(newVal, operand);
    operand = Primitive.addByte(operand, newVal);
    this.memory.writeByte(this.r.hl, operand);

    this.checkZFlag(operand);
    this.setNFlag(0);
  },

  0x35: function (): void {
    // convert operand to unsigned
    let newVal: byte = Primitive.toByte(this.memory.readByte(this.r.hl));
    // check for half carry on affected byte only
    this.checkHalfCarrySub(newVal, 1);
    newVal = Primitive.addByte(newVal, Primitive.toByte(-1));
    this.memory.writeByte(this.r.hl, newVal);
    this.checkZFlag(newVal);
    this.setNFlag(1);
  },

  0x36: function (): void {
    this.memory.writeByte(
      this.r.hl,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x37: function (): void {
    this.setCYFlag(1);
    this.setNFlag(0);
    this.setHFlag(0);
  },

  0x38: function (): boolean {
    const incr = Primitive.toSigned(this.memory.readByte(this.pc));
    this.pc += 1;
    if (this.getCYFlag()) {
      this.pc = Primitive.addWord(this.pc, incr);
      return true;
    }
    return false;
  },

  0x39: function (): void {
    this.checkFullCarryAdd16(this.r.hl, this.sp);
    this.checkHalfCarryAdd(
      Primitive.upper(this.r.hl),
      Primitive.upper(this.sp)
    );
    this.r.hl = Primitive.addWord(this.r.hl, this.sp);
    this.setNFlag(0);
  },

  0x3a: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
    this.r.hl = Primitive.addWord(this.r.hl, -1);
  },

  0x3b: function (): void {
    this.sp = Primitive.addWord(this.sp, -1);
  },

  0x3c: function (): void {
    let operand: byte = 1;
    this.checkHalfCarryAdd(Primitive.upper(this.r.af), operand);
    operand = Primitive.addByte(operand, Primitive.upper(this.r.af));
    this.r.af = Primitive.setUpper(this.r.af, operand);
    this.checkZFlag(operand);
    this.setNFlag(0);
  },

  0x3d: function (): void {
    this.checkHalfCarrySub(Primitive.upper(this.r.af), 1);
    this.r.af = Primitive.addUpper(this.r.af, Primitive.toByte(-1));
    this.checkZFlag(Primitive.upper(this.r.af));
    this.setNFlag(1);
  },

  0x3e: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(this.memory.readByte(this.pc))
    );
    this.pc += 1;
  },

  0x3f: function (): void {
    if (this.getCYFlag()) {
      this.setCYFlag(0);
    } else {
      this.setCYFlag(1);
    }
    this.setNFlag(0);
    this.setHFlag(0);
  },

  0x40: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, Primitive.upper(this.r.bc));
  },

  0x41: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, Primitive.lower(this.r.bc));
  },

  0x42: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, Primitive.upper(this.r.de));
  },

  0x43: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, Primitive.lower(this.r.de));
  },

  0x44: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, Primitive.upper(this.r.hl));
  },

  0x45: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, Primitive.lower(this.r.hl));
  },

  0x46: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
  },

  0x47: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, Primitive.upper(this.r.af));
  },

  0x48: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, Primitive.upper(this.r.bc));
  },

  0x49: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, Primitive.lower(this.r.bc));
  },

  0x4a: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, Primitive.upper(this.r.de));
  },

  0x4b: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, Primitive.lower(this.r.de));
  },

  0x4c: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, Primitive.upper(this.r.hl));
  },

  0x4d: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, Primitive.lower(this.r.hl));
  },

  0x4e: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
  },

  0x4f: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, Primitive.upper(this.r.af));
  },

  0x50: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, Primitive.upper(this.r.bc));
  },

  0x51: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, Primitive.lower(this.r.bc));
  },

  0x52: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, Primitive.upper(this.r.de));
  },

  0x53: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, Primitive.lower(this.r.de));
  },

  0x54: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, Primitive.upper(this.r.hl));
  },

  0x55: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, Primitive.lower(this.r.hl));
  },

  0x56: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
  },

  0x57: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, Primitive.upper(this.r.af));
  },

  0x58: function (): void {
    this.r.de = Primitive.setLower(this.r.de, Primitive.upper(this.r.bc));
  },

  0x59: function (): void {
    this.r.de = Primitive.setLower(this.r.de, Primitive.upper(this.r.bc));
  },

  0x5a: function (): void {
    this.r.de = Primitive.setLower(this.r.de, Primitive.upper(this.r.de));
  },

  0x5b: function (): void {
    this.r.de = Primitive.setLower(this.r.de, Primitive.lower(this.r.de));
  },

  0x5c: function (): void {
    this.r.de = Primitive.setLower(this.r.de, Primitive.upper(this.r.hl));
  },

  0x5d: function (): void {
    this.r.de = Primitive.setLower(this.r.de, Primitive.lower(this.r.hl));
  },

  0x5e: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
  },

  0x5f: function (): void {
    this.r.de = Primitive.setLower(this.r.de, Primitive.upper(this.r.af));
  },

  0x60: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, Primitive.upper(this.r.bc));
  },

  0x61: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, Primitive.lower(this.r.bc));
  },

  0x62: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, Primitive.upper(this.r.de));
  },

  0x63: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, Primitive.lower(this.r.de));
  },

  0x64: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, Primitive.upper(this.r.hl));
  },

  0x65: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, Primitive.lower(this.r.hl));
  },

  0x66: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
  },

  0x67: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, Primitive.upper(this.r.af));
  },

  0x68: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, Primitive.upper(this.r.bc));
  },

  0x69: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, Primitive.lower(this.r.bc));
  },

  0x6a: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, Primitive.upper(this.r.de));
  },

  0x6b: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, Primitive.lower(this.r.de));
  },

  0x6c: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, Primitive.upper(this.r.hl));
  },

  0x6d: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, Primitive.lower(this.r.hl));
  },

  0x6e: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
  },

  0x6f: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, Primitive.upper(this.r.af));
  },

  0x70: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.upper(this.r.bc));
  },

  0x71: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.lower(this.r.bc));
  },

  0x72: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.upper(this.r.de));
  },

  0x73: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.lower(this.r.de));
  },

  0x74: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.upper(this.r.hl));
  },

  0x75: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.lower(this.r.hl));
  },

  0x76: function (): void {
    this.halted = true;
  },

  0x77: function (): void {
    this.memory.writeByte(this.r.hl, Primitive.upper(this.r.af));
  },

  0x78: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, Primitive.upper(this.r.bc));
  },

  0x79: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, Primitive.lower(this.r.bc));
  },

  0x7a: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, Primitive.upper(this.r.de));
  },

  0x7b: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, Primitive.lower(this.r.de));
  },

  0x7c: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, Primitive.upper(this.r.hl));
  },

  0x7d: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, Primitive.lower(this.r.hl));
  },

  0x7e: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(this.memory.readByte(this.r.hl))
    );
  },

  0x7f: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, Primitive.upper(this.r.af));
  },

  0x80: function (): void {
    ADD(Primitive.upper(this.r.bc));
  },

  0x81: function (): void {
    ADD(Primitive.lower(this.r.bc));
  },

  0x82: function (): void {
    ADD(Primitive.upper(this.r.de));
  },

  0x83: function (): void {
    ADD(Primitive.lower(this.r.de));
  },

  0x84: function (): void {
    ADD(Primitive.upper(this.r.hl));
  },

  0x85: function (): void {
    ADD(Primitive.lower(this.r.hl));
  },

  0x86: function (): void {
    ADD(Primitive.toByte(this.memory.readByte(this.r.hl)));
  },

  0x87: function (): void {
    ADD(Primitive.upper(this.r.af));
  },

  0x88: function (): void {
    ADC(Primitive.upper(this.r.bc));
  },

  0x89: function (): void {
    ADC(Primitive.lower(this.r.bc));
  },

  0x8a: function (): void {
    ADC(Primitive.upper(this.r.de));
  },

  0x8b: function (): void {
    ADC(Primitive.lower(this.r.de));
  },

  0x8c: function (): void {
    ADC(Primitive.upper(this.r.hl));
  },

  0x8d: function (): void {
    ADC(Primitive.lower(this.r.hl));
  },

  0x8e: function (): void {
    ADC(Primitive.toByte(this.memory.readByte(this.r.hl)));
  },

  0x8f: function (): void {
    ADC(Primitive.upper(this.r.af));
  },

  0x90: function (): void {
    SUB(Primitive.upper(this.r.bc));
  },

  0x91: function (): void {
    SUB(Primitive.lower(this.r.bc));
  },

  0x92: function (): void {
    SUB(Primitive.upper(this.r.de));
  },

  0x93: function (): void {
    SUB(Primitive.lower(this.r.de));
  },

  0x94: function (): void {
    SUB(Primitive.upper(this.r.hl));
  },

  0x95: function (): void {
    SUB(Primitive.lower(this.r.hl));
  },

  0x96: function (): void {
    SUB(Primitive.toByte(this.memory.readByte(this.r.hl)));
  },

  0x97: function (): void {
    SUB(Primitive.upper(this.r.af));
  },

  0x98: function (): void {
    SBC(Primitive.upper(this.r.bc));
  },

  0x99: function (): void {
    SBC(Primitive.lower(this.r.bc));
  },

  0x9a: function (): void {
    SBC(Primitive.upper(this.r.de));
  },

  0x9b: function (): void {
    SBC(Primitive.lower(this.r.de));
  },

  0x9c: function (): void {
    SBC(Primitive.upper(this.r.hl));
  },

  0x9d: function (): void {
    SBC(Primitive.lower(this.r.hl));
  },

  0x9e: function (): void {
    SBC(Primitive.toByte(this.memory.readByte(this.r.hl)));
  },

  0x9f: function (): void {
    SBC(Primitive.upper(this.r.af));
  },

  0xa0: function (): void {
    AND(Primitive.upper(this.r.bc));
  },

  0xa1: function (): void {
    AND(Primitive.lower(this.r.bc));
  },

  0xa2: function (): void {
    AND(Primitive.upper(this.r.de));
  },

  0xa3: function (): void {
    AND(Primitive.lower(this.r.de));
  },

  0xa4: function (): void {
    AND(Primitive.upper(this.r.hl));
  },

  0xa5: function (): void {
    AND(Primitive.lower(this.r.hl));
  },

  0xa6: function (): void {
    AND(this.memory.readByte(this.r.hl));
  },

  0xa7: function (): void {
    AND(Primitive.upper(this.r.af));
  },

  0xa8: function (): void {
    XOR(Primitive.upper(this.r.bc));
  },

  0xa9: function (): void {
    XOR(Primitive.lower(this.r.bc));
  },

  0xaa: function (): void {
    XOR(Primitive.upper(this.r.de));
  },

  0xab: function (): void {
    XOR(Primitive.lower(this.r.de));
  },

  0xac: function (): void {
    XOR(Primitive.upper(this.r.hl));
  },

  0xad: function (): void {
    XOR(Primitive.lower(this.r.hl));
  },

  0xae: function (): void {
    XOR(this.memory.readByte(this.r.hl));
  },

  0xaf: function (): void {
    XOR(Primitive.upper(this.r.af));
  },

  0xb0: function (): void {
    OR(Primitive.upper(this.r.bc));
  },

  0xb1: function (): void {
    OR(Primitive.lower(this.r.bc));
  },

  0xb2: function (): void {
    OR(Primitive.upper(this.r.de));
  },

  0xb3: function (): void {
    OR(Primitive.lower(this.r.de));
  },

  0xb4: function (): void {
    OR(Primitive.upper(this.r.hl));
  },

  0xb5: function (): void {
    OR(Primitive.lower(this.r.hl));
  },

  0xb6: function (): void {
    OR(this.memory.readByte(this.r.hl));
  },

  0xb7: function (): void {
    OR(Primitive.upper(this.r.af));
  },

  0xb8: function (): void {
    CP(Primitive.upper(this.r.bc));
  },

  0xb9: function (): void {
    CP(Primitive.lower(this.r.bc));
  },

  0xba: function (): void {
    CP(Primitive.upper(this.r.de));
  },

  0xbb: function (): void {
    CP(Primitive.lower(this.r.de));
  },

  0xbc: function (): void {
    CP(Primitive.upper(this.r.hl));
  },

  0xbd: function (): void {
    CP(Primitive.lower(this.r.hl));
  },

  0xbe: function (): void {
    CP(Primitive.toByte(this.memory.readByte(this.r.hl)));
  },

  0xbf: function (): void {
    CP(Primitive.upper(this.r.af));
  },

  0xc0: function (): boolean {
    return RET(!this.getZFlag());
  },

  0xc1: function (): void {
    this.r.bc = POP(cpu);
  },

  0xc2: function (): boolean {
    if (Jpcc(!this.getZFlag())) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xc3: function (): void {
    this.pc = this.memory.readWord(this.pc);
  },

  0xc4: function (): boolean {
    if (CALL(!this.getZFlag())) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xc5: function (): void {
    PUSH(this.r.bc);
  },

  0xc6: function (): void {
    const value = Primitive.toByte(this.memory.readByte(this.pc));
    this.checkFullCarryAdd8(Primitive.upper(this.r.af), value);
    this.checkHalfCarryAdd(Primitive.upper(this.r.af), value);
    this.r.af = Primitive.addUpper(this.r.af, value);
    this.checkZFlag(Primitive.upper(this.r.af));
    this.pc += 1;
    this.setNFlag(0);
  },

  0xc7: function (): void {
    RST(0x00);
  },

  0xc8: function (): boolean {
    if (this.getZFlag()) {
      const address: word = this.memory.readWord(this.sp);
      this.pc = address;
      this.sp = Primitive.addWord(this.sp, 2);
      return true;
    }
    return false;
  },

  0xc9: function (): void {
    RET(true);
  },

  0xca: function (): boolean {
    if (Jpcc(this.getZFlag() === 0)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xcb: function (): void {
    const opcode: byte = this.memory.readByte(this.pc);
    cbMap[opcode](cpu);
    this.pc += 1;
  },

  0xcc: function (): boolean {
    if (CALL(this.getZFlag() === 1)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xcd: function (): void {
    CALL(true);
  },

  0xce: function (): void {
    ADC(Primitive.toByte(this.memory.readByte(this.pc)));
    this.pc += 1;
  },

  0xcf: function (): void {
    RST(0x08);
  },

  0xd0: function (): boolean {
    return RET(!this.getCYFlag());
  },

  0xd1: function (): void {
    this.r.de = POP(cpu);
  },

  0xd2: function (): boolean {
    if (Jpcc(this.getZFlag() === 0)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xd3: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xd4: function (): boolean {
    if (CALL(!this.getCYFlag())) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xd5: function (): void {
    PUSH(this.r.de);
  },

  0xd6: function (): void {
    SUB(this.memory.readByte(this.pc));
    this.pc += 1;
  },

  0xd7: function (): void {
    RST(0x10);
  },

  0xd8: function (): boolean {
    return RET(this.getCYFlag() === 1);
  },

  0xd9: function (): void {
    RET(true);
    this.setInterruptsGlobal(true);
  },

  0xda: function (): boolean {
    if (Jpcc(this.getCYFlag() === 0)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xdb: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xdc: function (): boolean {
    if (CALL(this.getCYFlag() === 1)) {
      return true;
    }
    this.pc += 2;
    return false;
  },

  0xdd: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xde: function (): void {
    SBC(Primitive.toByte(this.memory.readByte(this.pc)));
    this.pc += 1;
  },

  0xdf: function (): void {
    RST(0x18);
  },

  0xe0: function (): void {
    this.memory.writeByte(
      0xff00 + this.memory.readByte(this.pc),
      Primitive.upper(this.r.af)
    );
    this.pc += 1;
  },

  0xe1: function (): void {
    this.r.hl = POP(cpu);
  },

  0xe2: function (): void {
    this.memory.writeByte(
      0xff00 + Primitive.lower(this.r.bc),
      Primitive.upper(this.r.af)
    );
  },

  0xe3: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xe4: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xe5: function (): void {
    PUSH(this.r.hl);
  },

  0xe6: function (): void {
    AND(this.memory.readByte(this.pc));
    this.pc += 1;
  },

  0xe7: function (): void {
    RST(0x20);
  },

  0xe8: function (): void {
    const operand = Primitive.toWord(
      Primitive.toSigned(this.memory.readByte(this.pc))
    );
    this.checkFullCarryAdd16(this.sp, operand);
    this.checkHalfCarryAdd(Primitive.upper(this.sp), Primitive.upper(operand));
    this.sp = Primitive.addWord(this.sp, operand);
    this.pc += 1;
    this.setZFlag(0);
    this.setNFlag(0);
  },

  0xe9: function (): void {
    this.pc = this.r.hl;
  },

  0xea: function (): void {
    this.memory.writeByte(
      this.memory.readWord(this.pc),
      Primitive.upper(this.r.af)
    );
    this.pc += 2;
  },

  0xeb: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xec: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xed: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xee: function (): void {
    XOR(Primitive.toByte(this.memory.readByte(this.pc)));
    this.pc += 1;
  },

  0xef: function (): void {
    RST(0x28);
  },

  0xf0: function (): void {
    const data = this.memory.readByte(0xff00 + this.memory.readByte(this.pc));
    // console.log(
    //   `Tried to read address ${Number(
    //     0xff00 + this.memory.readByte(this.pc)
    //   ).toString(16)}`
    // );
    this.r.af = Primitive.setUpper(this.r.af, data);
    this.pc += 1;
    // if (this.pc === 565) debugger;
  },

  0xf1: function (): void {
    this.r.af = POP(cpu);
  },

  0xf2: function (): void {
    const data = this.memory.readByte(0xff00 + Primitive.lower(this.r.bc));
    this.r.af = Primitive.setUpper(this.r.af, data);
  },

  0xf3: function (): void {
    this.setInterruptsGlobal(false);
  },

  0xf4: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xf5: function (): void {
    PUSH(this.r.af);
  },

  0xf6: function (): void {
    OR(this.memory.readByte(this.pc));
    this.pc += 1;
  },

  0xf7: function (): void {
    RST(0x30);
  },

  0xf8: function (): void {
    let incr = Primitive.toWord(
      Primitive.toSigned(this.memory.readByte(this.pc))
    );
    this.checkHalfCarryAdd(Primitive.upper(incr), Primitive.upper(this.sp));
    this.checkFullCarryAdd16(incr, this.sp);
    this.pc += 1;
    incr = Primitive.addWord(incr, this.sp);
    this.r.hl = incr;
    this.setZFlag(0);
    this.setNFlag(0);
  },

  0xf9: function (): void {
    this.sp = this.r.hl;
  },

  0xfa: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      Primitive.toByte(this.memory.readByte(this.memory.readWord(this.pc)))
    );
    this.pc += 2;
  },

  0xfb: function (): void {
    this.setInterruptsGlobal(true);
  },

  0xfc: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xfd: function (): void {
    // throw new Error('Tried to call illegal opcode.');
  },

  0xfe: function (): void {
    CP(this.memory.readByte(this.pc));
    this.pc += 1;
  },

  0xff: function (): void {
    RST(0x38);
  },
};

function RLCn(reg: byte): byte {
  this.setCYFlag(reg >> 7);
  const shifted: number = reg << 1;
  const result: byte = Primitive.toByte(shifted | (shifted >> 8));
  this.checkZFlag(result);
  this.setNFlag(0);
  this.setHFlag(0);
  return result;
}

function RLn(reg: byte): byte {
  const cy = this.getCYFlag();
  const {newFlag, value} = precomputed.rln[cy][reg];
  this.setCYFlag(newFlag);
  this.checkZFlag(value);
  this.setHFlag(0);
  this.setNFlag(0);
  return value;
}

function RRCn(reg: byte): byte {
  const bitZero = reg & 1;
  this.setCYFlag(bitZero);
  const shifted: byte = reg >> 1;
  const result: byte = Primitive.toByte(shifted | (bitZero << 7));
  this.checkZFlag(result);
  this.setNFlag(0);
  this.setHFlag(0);
  return result;
}

function RRn(reg: byte): byte {
  const oldCY = this.getCYFlag();
  this.setCYFlag(reg & 1);
  const shifted = reg >> 1;
  const result: byte = Primitive.toByte(shifted | (oldCY << 7));
  this.checkZFlag(result);
  this.setHFlag(0);
  this.setNFlag(0);
  return result;
}

function SLAn(reg: byte): byte {
  this.setCYFlag(reg << 7);
  const result = Primitive.toByte(reg << 1);
  this.checkZFlag(result);
  this.setHFlag(0);
  this.setNFlag(0);
  return result;
}

function SRAn(reg: byte): byte {
  this.setCYFlag(reg & 1);
  // shift to right, but keep the most sig bit
  const msb: byte = reg >> 7;
  const result: byte = (reg >> 1) | msb;
  this.checkZFlag(result);
  this.setHFlag(0);
  this.setNFlag(0);
  return result;
}

function SRLn(reg: byte): byte {
  this.setCYFlag(reg & 1);
  const result: byte = reg >> 1;
  this.checkZFlag(result);
  this.setHFlag(0);
  this.setNFlag(0);
  return result;
}

function BIT(bit: number, reg: byte): void {
  this.checkZFlag((reg >> bit) & 1);
  this.setNFlag(0);
  this.setHFlag(1);
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
  const upper = reg >> 4;
  const lower = reg & 0xf;
  const result = (lower << 4) | upper;
  this.checkZFlag(result);
  return result;
}

const cbMap: OpcodeList = {
  0x00: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RLCn(Primitive.upper(this.r.bc)));
  },
  0x01: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RLCn(Primitive.lower(this.r.bc)));
  },
  0x02: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RLCn(Primitive.upper(this.r.de)));
  },
  0x03: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RLCn(Primitive.lower(this.r.de)));
  },
  0x04: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RLCn(Primitive.upper(this.r.hl)));
  },
  0x05: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RLCn(Primitive.lower(this.r.hl)));
  },
  0x06: function (): void {
    this.memory.writeByte(this.r.hl, RLCn(this.memory.readByte(this.r.hl)));
  },
  0x07: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RLCn(Primitive.upper(this.r.af)));
  },
  0x08: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RRCn(Primitive.upper(this.r.bc)));
  },
  0x09: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RRCn(Primitive.lower(this.r.bc)));
  },
  0x0a: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RRCn(Primitive.upper(this.r.de)));
  },
  0x0b: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RRCn(Primitive.lower(this.r.de)));
  },
  0x0c: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RRCn(Primitive.upper(this.r.hl)));
  },
  0x0d: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RRCn(Primitive.lower(this.r.hl)));
  },
  0x0e: function (): void {
    this.memory.writeByte(this.r.hl, RRCn(this.memory.readByte(this.r.hl)));
  },
  0x0f: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RRCn(Primitive.upper(this.r.af)));
  },
  0x10: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RLn(Primitive.upper(this.r.bc)));
  },
  0x11: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RLn(Primitive.lower(this.r.bc)));
  },
  0x12: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RLn(Primitive.upper(this.r.de)));
  },
  0x13: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RLn(Primitive.lower(this.r.de)));
  },
  0x14: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RLn(Primitive.upper(this.r.hl)));
  },
  0x15: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RLn(Primitive.lower(this.r.hl)));
  },
  0x16: function (): void {
    this.memory.writeByte(this.r.hl, RLn(this.memory.readByte(this.r.hl)));
  },
  0x17: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RLn(Primitive.upper(this.r.af)));
  },
  0x18: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RLn(Primitive.upper(this.r.bc)));
  },
  0x19: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RRn(Primitive.lower(this.r.bc)));
  },
  0x1a: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RRn(Primitive.upper(this.r.de)));
  },
  0x1b: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RRn(Primitive.lower(this.r.de)));
  },
  0x1c: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RRn(Primitive.upper(this.r.hl)));
  },
  0x1d: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RRn(Primitive.lower(this.r.hl)));
  },
  0x1e: function (): void {
    this.memory.writeByte(this.r.hl, RRn(this.memory.readByte(this.r.hl)));
  },
  0x1f: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RRn(Primitive.upper(this.r.af)));
  },
  0x20: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, SLAn(Primitive.upper(this.r.bc)));
  },
  0x21: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, SLAn(Primitive.lower(this.r.bc)));
  },
  0x22: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, SLAn(Primitive.upper(this.r.de)));
  },
  0x23: function (): void {
    this.r.de = Primitive.setLower(this.r.de, SLAn(Primitive.lower(this.r.de)));
  },
  0x24: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, SLAn(Primitive.upper(this.r.hl)));
  },
  0x25: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, SLAn(Primitive.lower(this.r.hl)));
  },
  0x26: function (): void {
    this.memory.writeByte(this.r.hl, SLAn(this.memory.readByte(this.r.hl)));
  },
  0x27: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, SLAn(Primitive.upper(this.r.af)));
  },
  0x28: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, SRAn(Primitive.upper(this.r.bc)));
  },
  0x29: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, SRAn(Primitive.lower(this.r.bc)));
  },
  0x2a: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, SRAn(Primitive.upper(this.r.de)));
  },
  0x2b: function (): void {
    this.r.de = Primitive.setLower(this.r.de, SRAn(Primitive.lower(this.r.de)));
  },
  0x2c: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, SRAn(Primitive.upper(this.r.hl)));
  },
  0x2d: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, SRAn(Primitive.lower(this.r.hl)));
  },
  0x2e: function (): void {
    this.memory.writeByte(this.r.hl, SRAn(this.memory.readByte(this.r.hl)));
  },
  0x2f: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, SRAn(Primitive.upper(this.r.af)));
  },
  0x30: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, SWAP(Primitive.upper(this.r.bc)));
  },
  0x31: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, SWAP(Primitive.lower(this.r.bc)));
  },
  0x32: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, SWAP(Primitive.upper(this.r.de)));
  },
  0x33: function (): void {
    this.r.de = Primitive.setLower(this.r.de, SWAP(Primitive.lower(this.r.de)));
  },
  0x34: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, SWAP(Primitive.upper(this.r.hl)));
  },
  0x35: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, SWAP(Primitive.lower(this.r.hl)));
  },
  0x36: function (): void {
    this.memory.writeByte(this.r.hl, SWAP(this.memory.readByte(this.r.hl)));
  },
  0x37: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, SWAP(Primitive.upper(this.r.af)));
  },
  0x38: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, SRLn(Primitive.upper(this.r.bc)));
  },
  0x39: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, SRLn(Primitive.lower(this.r.bc)));
  },
  0x3a: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, SRLn(Primitive.upper(this.r.de)));
  },
  0x3b: function (): void {
    this.r.de = Primitive.setLower(this.r.de, SRLn(Primitive.lower(this.r.de)));
  },
  0x3c: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, SRLn(Primitive.upper(this.r.hl)));
  },
  0x3d: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, SRLn(Primitive.lower(this.r.hl)));
  },
  0x3e: function (): void {
    this.memory.writeByte(this.r.hl, SRLn(this.memory.readByte(this.r.hl)));
  },
  0x3f: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, SRLn(Primitive.upper(this.r.af)));
  },
  0x40: function (): void {
    BIT(0, Primitive.upper(this.r.bc));
  },
  0x41: function (): void {
    BIT(0, Primitive.lower(this.r.bc));
  },
  0x42: function (): void {
    BIT(0, Primitive.upper(this.r.de));
  },
  0x43: function (): void {
    BIT(0, Primitive.lower(this.r.de));
  },
  0x44: function (): void {
    BIT(0, Primitive.upper(this.r.hl));
  },
  0x45: function (): void {
    BIT(0, Primitive.lower(this.r.hl));
  },
  0x46: function (): void {
    BIT(0, this.memory.readByte(this.r.hl));
  },
  0x47: function (): void {
    BIT(0, Primitive.upper(this.r.af));
  },
  0x48: function (): void {
    BIT(1, Primitive.upper(this.r.bc));
  },
  0x49: function (): void {
    BIT(1, Primitive.lower(this.r.bc));
  },
  0x4a: function (): void {
    BIT(1, Primitive.upper(this.r.de));
  },
  0x4b: function (): void {
    BIT(1, Primitive.lower(this.r.de));
  },
  0x4c: function (): void {
    BIT(1, Primitive.upper(this.r.hl));
  },
  0x4d: function (): void {
    BIT(1, Primitive.lower(this.r.hl));
  },
  0x4e: function (): void {
    BIT(1, this.memory.readByte(this.r.hl));
  },
  0x4f: function (): void {
    BIT(1, Primitive.upper(this.r.af));
  },
  0x50: function (): void {
    BIT(2, Primitive.upper(this.r.bc));
  },
  0x51: function (): void {
    BIT(2, Primitive.lower(this.r.bc));
  },
  0x52: function (): void {
    BIT(2, Primitive.upper(this.r.de));
  },
  0x53: function (): void {
    BIT(2, Primitive.lower(this.r.de));
  },
  0x54: function (): void {
    BIT(2, Primitive.upper(this.r.hl));
  },
  0x55: function (): void {
    BIT(2, Primitive.lower(this.r.hl));
  },
  0x56: function (): void {
    BIT(2, this.memory.readByte(this.r.hl));
  },
  0x57: function (): void {
    BIT(2, Primitive.upper(this.r.af));
  },
  0x58: function (): void {
    BIT(3, Primitive.upper(this.r.bc));
  },
  0x59: function (): void {
    BIT(3, Primitive.lower(this.r.bc));
  },
  0x5a: function (): void {
    BIT(3, Primitive.upper(this.r.de));
  },
  0x5b: function (): void {
    BIT(3, Primitive.lower(this.r.de));
  },
  0x5c: function (): void {
    BIT(3, Primitive.upper(this.r.hl));
  },
  0x5d: function (): void {
    BIT(3, Primitive.lower(this.r.hl));
  },
  0x5e: function (): void {
    BIT(3, this.memory.readByte(this.r.hl));
  },
  0x5f: function (): void {
    BIT(3, Primitive.upper(this.r.af));
  },
  0x60: function (): void {
    BIT(4, Primitive.upper(this.r.bc));
  },
  0x61: function (): void {
    BIT(4, Primitive.lower(this.r.bc));
  },
  0x62: function (): void {
    BIT(4, Primitive.upper(this.r.de));
  },
  0x63: function (): void {
    BIT(4, Primitive.lower(this.r.de));
  },
  0x64: function (): void {
    BIT(4, Primitive.upper(this.r.hl));
  },
  0x65: function (): void {
    BIT(4, Primitive.lower(this.r.hl));
  },
  0x66: function (): void {
    BIT(4, this.memory.readByte(this.r.hl));
  },
  0x67: function (): void {
    BIT(4, Primitive.upper(this.r.af));
  },
  0x68: function (): void {
    BIT(5, Primitive.upper(this.r.bc));
  },
  0x69: function (): void {
    BIT(5, Primitive.lower(this.r.bc));
  },
  0x6a: function (): void {
    BIT(5, Primitive.upper(this.r.de));
  },
  0x6b: function (): void {
    BIT(5, Primitive.lower(this.r.de));
  },
  0x6c: function (): void {
    BIT(5, Primitive.upper(this.r.hl));
  },
  0x6d: function (): void {
    BIT(5, Primitive.lower(this.r.hl));
  },
  0x6e: function (): void {
    BIT(5, this.memory.readByte(this.r.hl));
  },
  0x6f: function (): void {
    BIT(5, Primitive.upper(this.r.af));
  },
  0x70: function (): void {
    BIT(6, Primitive.upper(this.r.bc));
  },
  0x71: function (): void {
    BIT(6, Primitive.lower(this.r.bc));
  },
  0x72: function (): void {
    BIT(6, Primitive.upper(this.r.de));
  },
  0x73: function (): void {
    BIT(6, Primitive.lower(this.r.de));
  },
  0x74: function (): void {
    BIT(6, Primitive.upper(this.r.hl));
  },
  0x75: function (): void {
    BIT(6, Primitive.lower(this.r.hl));
  },
  0x76: function (): void {
    BIT(6, this.memory.readByte(this.r.hl));
  },
  0x77: function (): void {
    BIT(6, Primitive.upper(this.r.af));
  },
  0x78: function (): void {
    BIT(7, Primitive.upper(this.r.bc));
  },
  0x79: function (): void {
    BIT(7, Primitive.lower(this.r.bc));
  },
  0x7a: function (): void {
    BIT(7, Primitive.upper(this.r.de));
  },
  0x7b: function (): void {
    BIT(7, Primitive.lower(this.r.de));
  },
  0x7c: function (): void {
    BIT(7, Primitive.upper(this.r.hl));
  },
  0x7d: function (): void {
    BIT(7, Primitive.lower(this.r.hl));
  },
  0x7e: function (): void {
    BIT(7, this.memory.readByte(this.r.hl));
  },
  0x7f: function (): void {
    BIT(7, Primitive.upper(this.r.af));
  },
  0x80: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES0(Primitive.upper(this.r.bc)));
  },
  0x81: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES0(Primitive.lower(this.r.bc)));
  },
  0x82: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES0(Primitive.upper(this.r.de)));
  },
  0x83: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES0(Primitive.lower(this.r.de)));
  },
  0x84: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES0(Primitive.upper(this.r.hl)));
  },
  0x85: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES0(Primitive.lower(this.r.hl)));
  },
  0x86: function (): void {
    this.memory.writeByte(this.r.hl, RES0(this.memory.readByte(this.r.hl)));
  },
  0x87: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES0(Primitive.upper(this.r.af)));
  },
  0x88: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES1(Primitive.upper(this.r.bc)));
  },
  0x89: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES1(Primitive.lower(this.r.bc)));
  },
  0x8a: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES1(Primitive.upper(this.r.de)));
  },
  0x8b: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES1(Primitive.lower(this.r.de)));
  },
  0x8c: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES1(Primitive.upper(this.r.hl)));
  },
  0x8d: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES1(Primitive.lower(this.r.hl)));
  },
  0x8e: function (): void {
    this.memory.writeByte(this.r.hl, RES1(this.memory.readByte(this.r.hl)));
  },
  0x8f: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES1(Primitive.upper(this.r.af)));
  },
  0x90: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES2(Primitive.upper(this.r.bc)));
  },
  0x91: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES2(Primitive.lower(this.r.bc)));
  },
  0x92: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES2(Primitive.upper(this.r.de)));
  },
  0x93: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES2(Primitive.lower(this.r.de)));
  },
  0x94: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES2(Primitive.upper(this.r.hl)));
  },
  0x95: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES2(Primitive.lower(this.r.hl)));
  },
  0x96: function (): void {
    this.memory.writeByte(this.r.hl, RES2(this.memory.readByte(this.r.hl)));
  },
  0x97: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES2(Primitive.upper(this.r.af)));
  },
  0x98: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES3(Primitive.upper(this.r.bc)));
  },
  0x99: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES3(Primitive.lower(this.r.bc)));
  },
  0x9a: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES3(Primitive.upper(this.r.de)));
  },
  0x9b: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES3(Primitive.lower(this.r.de)));
  },
  0x9c: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES3(Primitive.upper(this.r.hl)));
  },
  0x9d: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES3(Primitive.lower(this.r.hl)));
  },
  0x9e: function (): void {
    this.memory.writeByte(this.r.hl, RES3(this.memory.readByte(this.r.hl)));
  },
  0x9f: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES3(Primitive.upper(this.r.af)));
  },
  0xa0: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES4(Primitive.upper(this.r.bc)));
  },
  0xa1: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES4(Primitive.lower(this.r.bc)));
  },
  0xa2: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES4(Primitive.upper(this.r.de)));
  },
  0xa3: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES4(Primitive.lower(this.r.de)));
  },
  0xa4: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES4(Primitive.upper(this.r.hl)));
  },
  0xa5: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES4(Primitive.lower(this.r.hl)));
  },
  0xa6: function (): void {
    this.memory.writeByte(this.r.hl, RES4(this.memory.readByte(this.r.hl)));
  },
  0xa7: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES4(Primitive.upper(this.r.af)));
  },
  0xa8: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES5(Primitive.upper(this.r.bc)));
  },
  0xa9: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES5(Primitive.lower(this.r.bc)));
  },
  0xaa: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES5(Primitive.upper(this.r.de)));
  },
  0xab: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES5(Primitive.lower(this.r.de)));
  },
  0xac: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES5(Primitive.upper(this.r.hl)));
  },
  0xad: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES5(Primitive.lower(this.r.hl)));
  },
  0xae: function (): void {
    this.memory.writeByte(this.r.hl, RES5(this.memory.readByte(this.r.hl)));
  },
  0xaf: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES5(Primitive.upper(this.r.af)));
  },
  0xb0: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES6(Primitive.upper(this.r.bc)));
  },
  0xb1: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES6(Primitive.lower(this.r.bc)));
  },
  0xb2: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES6(Primitive.upper(this.r.de)));
  },
  0xb3: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES6(Primitive.lower(this.r.de)));
  },
  0xb4: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES6(Primitive.upper(this.r.hl)));
  },
  0xb5: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES6(Primitive.lower(this.r.hl)));
  },
  0xb6: function (): void {
    this.memory.writeByte(this.r.hl, RES6(this.memory.readByte(this.r.hl)));
  },
  0xb7: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES6(Primitive.upper(this.r.af)));
  },
  0xb8: function (): void {
    this.r.bc = Primitive.setUpper(this.r.bc, RES7(Primitive.upper(this.r.bc)));
  },
  0xb9: function (): void {
    this.r.bc = Primitive.setLower(this.r.bc, RES7(Primitive.lower(this.r.bc)));
  },
  0xba: function (): void {
    this.r.de = Primitive.setUpper(this.r.de, RES7(Primitive.upper(this.r.de)));
  },
  0xbb: function (): void {
    this.r.de = Primitive.setLower(this.r.de, RES7(Primitive.lower(this.r.de)));
  },
  0xbc: function (): void {
    this.r.hl = Primitive.setUpper(this.r.hl, RES7(Primitive.upper(this.r.hl)));
  },
  0xbd: function (): void {
    this.r.hl = Primitive.setLower(this.r.hl, RES7(Primitive.lower(this.r.hl)));
  },
  0xbe: function (): void {
    this.memory.writeByte(this.r.hl, RES7(this.memory.readByte(this.r.hl)));
  },
  0xbf: function (): void {
    this.r.af = Primitive.setUpper(this.r.af, RES7(Primitive.upper(this.r.af)));
  },
  0xc0: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(0, Primitive.upper(this.r.bc))
    );
  },
  0xc1: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      SET(0, Primitive.lower(this.r.bc))
    );
  },
  0xc2: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(0, Primitive.upper(this.r.de))
    );
  },
  0xc3: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(0, Primitive.lower(this.r.de))
    );
  },
  0xc4: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(0, Primitive.upper(this.r.hl))
    );
  },
  0xc5: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      SET(0, Primitive.lower(this.r.hl))
    );
  },
  0xc6: function (): void {
    this.memory.writeByte(this.r.hl, SET(0, this.memory.readByte(this.r.hl)));
  },
  0xc7: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(0, Primitive.lower(this.r.af))
    );
  },
  0xc8: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(1, Primitive.upper(this.r.bc))
    );
  },
  0xc9: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      SET(1, Primitive.lower(this.r.bc))
    );
  },
  0xca: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(1, Primitive.upper(this.r.de))
    );
  },
  0xcb: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(1, Primitive.lower(this.r.de))
    );
  },
  0xcc: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(1, Primitive.upper(this.r.hl))
    );
  },
  0xcd: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      SET(1, Primitive.lower(this.r.hl))
    );
  },
  0xce: function (): void {
    this.memory.writeByte(this.r.hl, SET(1, this.memory.readByte(this.r.hl)));
  },
  0xcf: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(1, Primitive.upper(this.r.af))
    );
  },
  0xd0: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(2, Primitive.upper(this.r.bc))
    );
  },
  0xd1: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(2, Primitive.lower(this.r.bc))
    );
  },
  0xd2: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(2, Primitive.upper(this.r.de))
    );
  },
  0xd3: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(2, Primitive.lower(this.r.de))
    );
  },
  0xd4: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(2, Primitive.upper(this.r.hl))
    );
  },
  0xd5: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      SET(2, Primitive.lower(this.r.hl))
    );
  },
  0xd6: function (): void {
    this.memory.writeByte(this.r.hl, SET(2, this.memory.readByte(this.r.hl)));
  },
  0xd7: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(2, Primitive.upper(this.r.af))
    );
  },
  0xd8: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(3, Primitive.upper(this.r.bc))
    );
  },
  0xd9: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      SET(3, Primitive.lower(this.r.bc))
    );
  },
  0xda: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(3, Primitive.upper(this.r.de))
    );
  },
  0xdb: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(3, Primitive.lower(this.r.de))
    );
  },
  0xdc: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(3, Primitive.upper(this.r.hl))
    );
  },
  0xdd: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      SET(3, Primitive.lower(this.r.hl))
    );
  },
  0xde: function (): void {
    this.memory.writeByte(this.r.hl, SET(3, this.memory.readByte(this.r.hl)));
  },
  0xdf: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(3, Primitive.upper(this.r.af))
    );
  },
  0xe0: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(4, Primitive.upper(this.r.bc))
    );
  },
  0xe1: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      SET(4, Primitive.lower(this.r.bc))
    );
  },
  0xe2: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(4, Primitive.upper(this.r.de))
    );
  },
  0xe3: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(4, Primitive.lower(this.r.de))
    );
  },
  0xe4: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(4, Primitive.upper(this.r.hl))
    );
  },
  0xe5: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      SET(4, Primitive.lower(this.r.hl))
    );
  },
  0xe6: function (): void {
    this.memory.writeByte(this.r.hl, SET(4, this.memory.readByte(this.r.hl)));
  },
  0xe7: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(4, Primitive.upper(this.r.af))
    );
  },
  0xe8: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(5, Primitive.upper(this.r.bc))
    );
  },
  0xe9: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      SET(5, Primitive.lower(this.r.bc))
    );
  },
  0xea: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(5, Primitive.upper(this.r.de))
    );
  },
  0xeb: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(5, Primitive.lower(this.r.de))
    );
  },
  0xec: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(5, Primitive.upper(this.r.hl))
    );
  },
  0xed: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(5, Primitive.lower(this.r.hl))
    );
  },
  0xee: function (): void {
    this.memory.writeByte(this.r.hl, SET(5, this.memory.readByte(this.r.hl)));
  },
  0xef: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(5, Primitive.upper(this.r.af))
    );
  },
  0xf0: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(6, Primitive.upper(this.r.bc))
    );
  },
  0xf1: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      SET(6, Primitive.lower(this.r.bc))
    );
  },
  0xf2: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(6, Primitive.upper(this.r.de))
    );
  },
  0xf3: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(6, Primitive.lower(this.r.de))
    );
  },
  0xf4: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(6, Primitive.upper(this.r.hl))
    );
  },
  0xf5: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      SET(6, Primitive.lower(this.r.hl))
    );
  },
  0xf6: function (): void {
    this.memory.writeByte(this.r.hl, SET(6, this.memory.readByte(this.r.hl)));
  },
  0xf7: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(6, Primitive.upper(this.r.af))
    );
  },
  0xf8: function (): void {
    this.r.bc = Primitive.setUpper(
      this.r.bc,
      SET(7, Primitive.upper(this.r.bc))
    );
  },
  0xf9: function (): void {
    this.r.bc = Primitive.setLower(
      this.r.bc,
      SET(7, Primitive.lower(this.r.bc))
    );
  },
  0xfa: function (): void {
    this.r.de = Primitive.setUpper(
      this.r.de,
      SET(7, Primitive.upper(this.r.de))
    );
  },
  0xfb: function (): void {
    this.r.de = Primitive.setLower(
      this.r.de,
      SET(7, Primitive.lower(this.r.de))
    );
  },
  0xfc: function (): void {
    this.r.hl = Primitive.setUpper(
      this.r.hl,
      SET(7, Primitive.upper(this.r.hl))
    );
  },
  0xfd: function (): void {
    this.r.hl = Primitive.setLower(
      this.r.hl,
      SET(7, Primitive.lower(this.r.hl))
    );
  },
  0xfe: function (): void {
    this.memory.writeByte(this.r.hl, SET(7, this.memory.readByte(this.r.hl)));
  },
  0xff: function (): void {
    this.r.af = Primitive.setUpper(
      this.r.af,
      SET(7, Primitive.upper(this.r.af))
    );
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

interface PrecomputedType {
  [key: string]: {
    [key: number]: {
      [key: number]: {
        newFlag: number;
        value: number;
      };
    };
  };
}

const precomputed: PrecomputedType = {
  rln: {
    '0': {
      '0': {newFlag: 0, value: 0},
      '1': {newFlag: 0, value: 2},
      '2': {newFlag: 0, value: 4},
      '3': {newFlag: 0, value: 6},
      '4': {newFlag: 0, value: 8},
      '5': {newFlag: 0, value: 10},
      '6': {newFlag: 0, value: 12},
      '7': {newFlag: 0, value: 14},
      '8': {newFlag: 0, value: 16},
      '9': {newFlag: 0, value: 18},
      '10': {newFlag: 0, value: 20},
      '11': {newFlag: 0, value: 22},
      '12': {newFlag: 0, value: 24},
      '13': {newFlag: 0, value: 26},
      '14': {newFlag: 0, value: 28},
      '15': {newFlag: 0, value: 30},
      '16': {newFlag: 0, value: 32},
      '17': {newFlag: 0, value: 34},
      '18': {newFlag: 0, value: 36},
      '19': {newFlag: 0, value: 38},
      '20': {newFlag: 0, value: 40},
      '21': {newFlag: 0, value: 42},
      '22': {newFlag: 0, value: 44},
      '23': {newFlag: 0, value: 46},
      '24': {newFlag: 0, value: 48},
      '25': {newFlag: 0, value: 50},
      '26': {newFlag: 0, value: 52},
      '27': {newFlag: 0, value: 54},
      '28': {newFlag: 0, value: 56},
      '29': {newFlag: 0, value: 58},
      '30': {newFlag: 0, value: 60},
      '31': {newFlag: 0, value: 62},
      '32': {newFlag: 0, value: 64},
      '33': {newFlag: 0, value: 66},
      '34': {newFlag: 0, value: 68},
      '35': {newFlag: 0, value: 70},
      '36': {newFlag: 0, value: 72},
      '37': {newFlag: 0, value: 74},
      '38': {newFlag: 0, value: 76},
      '39': {newFlag: 0, value: 78},
      '40': {newFlag: 0, value: 80},
      '41': {newFlag: 0, value: 82},
      '42': {newFlag: 0, value: 84},
      '43': {newFlag: 0, value: 86},
      '44': {newFlag: 0, value: 88},
      '45': {newFlag: 0, value: 90},
      '46': {newFlag: 0, value: 92},
      '47': {newFlag: 0, value: 94},
      '48': {newFlag: 0, value: 96},
      '49': {newFlag: 0, value: 98},
      '50': {newFlag: 0, value: 100},
      '51': {newFlag: 0, value: 102},
      '52': {newFlag: 0, value: 104},
      '53': {newFlag: 0, value: 106},
      '54': {newFlag: 0, value: 108},
      '55': {newFlag: 0, value: 110},
      '56': {newFlag: 0, value: 112},
      '57': {newFlag: 0, value: 114},
      '58': {newFlag: 0, value: 116},
      '59': {newFlag: 0, value: 118},
      '60': {newFlag: 0, value: 120},
      '61': {newFlag: 0, value: 122},
      '62': {newFlag: 0, value: 124},
      '63': {newFlag: 0, value: 126},
      '64': {newFlag: 0, value: 128},
      '65': {newFlag: 0, value: 130},
      '66': {newFlag: 0, value: 132},
      '67': {newFlag: 0, value: 134},
      '68': {newFlag: 0, value: 136},
      '69': {newFlag: 0, value: 138},
      '70': {newFlag: 0, value: 140},
      '71': {newFlag: 0, value: 142},
      '72': {newFlag: 0, value: 144},
      '73': {newFlag: 0, value: 146},
      '74': {newFlag: 0, value: 148},
      '75': {newFlag: 0, value: 150},
      '76': {newFlag: 0, value: 152},
      '77': {newFlag: 0, value: 154},
      '78': {newFlag: 0, value: 156},
      '79': {newFlag: 0, value: 158},
      '80': {newFlag: 0, value: 160},
      '81': {newFlag: 0, value: 162},
      '82': {newFlag: 0, value: 164},
      '83': {newFlag: 0, value: 166},
      '84': {newFlag: 0, value: 168},
      '85': {newFlag: 0, value: 170},
      '86': {newFlag: 0, value: 172},
      '87': {newFlag: 0, value: 174},
      '88': {newFlag: 0, value: 176},
      '89': {newFlag: 0, value: 178},
      '90': {newFlag: 0, value: 180},
      '91': {newFlag: 0, value: 182},
      '92': {newFlag: 0, value: 184},
      '93': {newFlag: 0, value: 186},
      '94': {newFlag: 0, value: 188},
      '95': {newFlag: 0, value: 190},
      '96': {newFlag: 0, value: 192},
      '97': {newFlag: 0, value: 194},
      '98': {newFlag: 0, value: 196},
      '99': {newFlag: 0, value: 198},
      '100': {newFlag: 0, value: 200},
      '101': {newFlag: 0, value: 202},
      '102': {newFlag: 0, value: 204},
      '103': {newFlag: 0, value: 206},
      '104': {newFlag: 0, value: 208},
      '105': {newFlag: 0, value: 210},
      '106': {newFlag: 0, value: 212},
      '107': {newFlag: 0, value: 214},
      '108': {newFlag: 0, value: 216},
      '109': {newFlag: 0, value: 218},
      '110': {newFlag: 0, value: 220},
      '111': {newFlag: 0, value: 222},
      '112': {newFlag: 0, value: 224},
      '113': {newFlag: 0, value: 226},
      '114': {newFlag: 0, value: 228},
      '115': {newFlag: 0, value: 230},
      '116': {newFlag: 0, value: 232},
      '117': {newFlag: 0, value: 234},
      '118': {newFlag: 0, value: 236},
      '119': {newFlag: 0, value: 238},
      '120': {newFlag: 0, value: 240},
      '121': {newFlag: 0, value: 242},
      '122': {newFlag: 0, value: 244},
      '123': {newFlag: 0, value: 246},
      '124': {newFlag: 0, value: 248},
      '125': {newFlag: 0, value: 250},
      '126': {newFlag: 0, value: 252},
      '127': {newFlag: 0, value: 254},
      '128': {newFlag: 1, value: 0},
      '129': {newFlag: 1, value: 2},
      '130': {newFlag: 1, value: 4},
      '131': {newFlag: 1, value: 6},
      '132': {newFlag: 1, value: 8},
      '133': {newFlag: 1, value: 10},
      '134': {newFlag: 1, value: 12},
      '135': {newFlag: 1, value: 14},
      '136': {newFlag: 1, value: 16},
      '137': {newFlag: 1, value: 18},
      '138': {newFlag: 1, value: 20},
      '139': {newFlag: 1, value: 22},
      '140': {newFlag: 1, value: 24},
      '141': {newFlag: 1, value: 26},
      '142': {newFlag: 1, value: 28},
      '143': {newFlag: 1, value: 30},
      '144': {newFlag: 1, value: 32},
      '145': {newFlag: 1, value: 34},
      '146': {newFlag: 1, value: 36},
      '147': {newFlag: 1, value: 38},
      '148': {newFlag: 1, value: 40},
      '149': {newFlag: 1, value: 42},
      '150': {newFlag: 1, value: 44},
      '151': {newFlag: 1, value: 46},
      '152': {newFlag: 1, value: 48},
      '153': {newFlag: 1, value: 50},
      '154': {newFlag: 1, value: 52},
      '155': {newFlag: 1, value: 54},
      '156': {newFlag: 1, value: 56},
      '157': {newFlag: 1, value: 58},
      '158': {newFlag: 1, value: 60},
      '159': {newFlag: 1, value: 62},
      '160': {newFlag: 1, value: 64},
      '161': {newFlag: 1, value: 66},
      '162': {newFlag: 1, value: 68},
      '163': {newFlag: 1, value: 70},
      '164': {newFlag: 1, value: 72},
      '165': {newFlag: 1, value: 74},
      '166': {newFlag: 1, value: 76},
      '167': {newFlag: 1, value: 78},
      '168': {newFlag: 1, value: 80},
      '169': {newFlag: 1, value: 82},
      '170': {newFlag: 1, value: 84},
      '171': {newFlag: 1, value: 86},
      '172': {newFlag: 1, value: 88},
      '173': {newFlag: 1, value: 90},
      '174': {newFlag: 1, value: 92},
      '175': {newFlag: 1, value: 94},
      '176': {newFlag: 1, value: 96},
      '177': {newFlag: 1, value: 98},
      '178': {newFlag: 1, value: 100},
      '179': {newFlag: 1, value: 102},
      '180': {newFlag: 1, value: 104},
      '181': {newFlag: 1, value: 106},
      '182': {newFlag: 1, value: 108},
      '183': {newFlag: 1, value: 110},
      '184': {newFlag: 1, value: 112},
      '185': {newFlag: 1, value: 114},
      '186': {newFlag: 1, value: 116},
      '187': {newFlag: 1, value: 118},
      '188': {newFlag: 1, value: 120},
      '189': {newFlag: 1, value: 122},
      '190': {newFlag: 1, value: 124},
      '191': {newFlag: 1, value: 126},
      '192': {newFlag: 1, value: 128},
      '193': {newFlag: 1, value: 130},
      '194': {newFlag: 1, value: 132},
      '195': {newFlag: 1, value: 134},
      '196': {newFlag: 1, value: 136},
      '197': {newFlag: 1, value: 138},
      '198': {newFlag: 1, value: 140},
      '199': {newFlag: 1, value: 142},
      '200': {newFlag: 1, value: 144},
      '201': {newFlag: 1, value: 146},
      '202': {newFlag: 1, value: 148},
      '203': {newFlag: 1, value: 150},
      '204': {newFlag: 1, value: 152},
      '205': {newFlag: 1, value: 154},
      '206': {newFlag: 1, value: 156},
      '207': {newFlag: 1, value: 158},
      '208': {newFlag: 1, value: 160},
      '209': {newFlag: 1, value: 162},
      '210': {newFlag: 1, value: 164},
      '211': {newFlag: 1, value: 166},
      '212': {newFlag: 1, value: 168},
      '213': {newFlag: 1, value: 170},
      '214': {newFlag: 1, value: 172},
      '215': {newFlag: 1, value: 174},
      '216': {newFlag: 1, value: 176},
      '217': {newFlag: 1, value: 178},
      '218': {newFlag: 1, value: 180},
      '219': {newFlag: 1, value: 182},
      '220': {newFlag: 1, value: 184},
      '221': {newFlag: 1, value: 186},
      '222': {newFlag: 1, value: 188},
      '223': {newFlag: 1, value: 190},
      '224': {newFlag: 1, value: 192},
      '225': {newFlag: 1, value: 194},
      '226': {newFlag: 1, value: 196},
      '227': {newFlag: 1, value: 198},
      '228': {newFlag: 1, value: 200},
      '229': {newFlag: 1, value: 202},
      '230': {newFlag: 1, value: 204},
      '231': {newFlag: 1, value: 206},
      '232': {newFlag: 1, value: 208},
      '233': {newFlag: 1, value: 210},
      '234': {newFlag: 1, value: 212},
      '235': {newFlag: 1, value: 214},
      '236': {newFlag: 1, value: 216},
      '237': {newFlag: 1, value: 218},
      '238': {newFlag: 1, value: 220},
      '239': {newFlag: 1, value: 222},
      '240': {newFlag: 1, value: 224},
      '241': {newFlag: 1, value: 226},
      '242': {newFlag: 1, value: 228},
      '243': {newFlag: 1, value: 230},
      '244': {newFlag: 1, value: 232},
      '245': {newFlag: 1, value: 234},
      '246': {newFlag: 1, value: 236},
      '247': {newFlag: 1, value: 238},
      '248': {newFlag: 1, value: 240},
      '249': {newFlag: 1, value: 242},
      '250': {newFlag: 1, value: 244},
      '251': {newFlag: 1, value: 246},
      '252': {newFlag: 1, value: 248},
      '253': {newFlag: 1, value: 250},
      '254': {newFlag: 1, value: 252},
    },
    '1': {
      '0': {newFlag: 0, value: 1},
      '1': {newFlag: 0, value: 3},
      '2': {newFlag: 0, value: 5},
      '3': {newFlag: 0, value: 7},
      '4': {newFlag: 0, value: 9},
      '5': {newFlag: 0, value: 11},
      '6': {newFlag: 0, value: 13},
      '7': {newFlag: 0, value: 15},
      '8': {newFlag: 0, value: 17},
      '9': {newFlag: 0, value: 19},
      '10': {newFlag: 0, value: 21},
      '11': {newFlag: 0, value: 23},
      '12': {newFlag: 0, value: 25},
      '13': {newFlag: 0, value: 27},
      '14': {newFlag: 0, value: 29},
      '15': {newFlag: 0, value: 31},
      '16': {newFlag: 0, value: 33},
      '17': {newFlag: 0, value: 35},
      '18': {newFlag: 0, value: 37},
      '19': {newFlag: 0, value: 39},
      '20': {newFlag: 0, value: 41},
      '21': {newFlag: 0, value: 43},
      '22': {newFlag: 0, value: 45},
      '23': {newFlag: 0, value: 47},
      '24': {newFlag: 0, value: 49},
      '25': {newFlag: 0, value: 51},
      '26': {newFlag: 0, value: 53},
      '27': {newFlag: 0, value: 55},
      '28': {newFlag: 0, value: 57},
      '29': {newFlag: 0, value: 59},
      '30': {newFlag: 0, value: 61},
      '31': {newFlag: 0, value: 63},
      '32': {newFlag: 0, value: 65},
      '33': {newFlag: 0, value: 67},
      '34': {newFlag: 0, value: 69},
      '35': {newFlag: 0, value: 71},
      '36': {newFlag: 0, value: 73},
      '37': {newFlag: 0, value: 75},
      '38': {newFlag: 0, value: 77},
      '39': {newFlag: 0, value: 79},
      '40': {newFlag: 0, value: 81},
      '41': {newFlag: 0, value: 83},
      '42': {newFlag: 0, value: 85},
      '43': {newFlag: 0, value: 87},
      '44': {newFlag: 0, value: 89},
      '45': {newFlag: 0, value: 91},
      '46': {newFlag: 0, value: 93},
      '47': {newFlag: 0, value: 95},
      '48': {newFlag: 0, value: 97},
      '49': {newFlag: 0, value: 99},
      '50': {newFlag: 0, value: 101},
      '51': {newFlag: 0, value: 103},
      '52': {newFlag: 0, value: 105},
      '53': {newFlag: 0, value: 107},
      '54': {newFlag: 0, value: 109},
      '55': {newFlag: 0, value: 111},
      '56': {newFlag: 0, value: 113},
      '57': {newFlag: 0, value: 115},
      '58': {newFlag: 0, value: 117},
      '59': {newFlag: 0, value: 119},
      '60': {newFlag: 0, value: 121},
      '61': {newFlag: 0, value: 123},
      '62': {newFlag: 0, value: 125},
      '63': {newFlag: 0, value: 127},
      '64': {newFlag: 0, value: 129},
      '65': {newFlag: 0, value: 131},
      '66': {newFlag: 0, value: 133},
      '67': {newFlag: 0, value: 135},
      '68': {newFlag: 0, value: 137},
      '69': {newFlag: 0, value: 139},
      '70': {newFlag: 0, value: 141},
      '71': {newFlag: 0, value: 143},
      '72': {newFlag: 0, value: 145},
      '73': {newFlag: 0, value: 147},
      '74': {newFlag: 0, value: 149},
      '75': {newFlag: 0, value: 151},
      '76': {newFlag: 0, value: 153},
      '77': {newFlag: 0, value: 155},
      '78': {newFlag: 0, value: 157},
      '79': {newFlag: 0, value: 159},
      '80': {newFlag: 0, value: 161},
      '81': {newFlag: 0, value: 163},
      '82': {newFlag: 0, value: 165},
      '83': {newFlag: 0, value: 167},
      '84': {newFlag: 0, value: 169},
      '85': {newFlag: 0, value: 171},
      '86': {newFlag: 0, value: 173},
      '87': {newFlag: 0, value: 175},
      '88': {newFlag: 0, value: 177},
      '89': {newFlag: 0, value: 179},
      '90': {newFlag: 0, value: 181},
      '91': {newFlag: 0, value: 183},
      '92': {newFlag: 0, value: 185},
      '93': {newFlag: 0, value: 187},
      '94': {newFlag: 0, value: 189},
      '95': {newFlag: 0, value: 191},
      '96': {newFlag: 0, value: 193},
      '97': {newFlag: 0, value: 195},
      '98': {newFlag: 0, value: 197},
      '99': {newFlag: 0, value: 199},
      '100': {newFlag: 0, value: 201},
      '101': {newFlag: 0, value: 203},
      '102': {newFlag: 0, value: 205},
      '103': {newFlag: 0, value: 207},
      '104': {newFlag: 0, value: 209},
      '105': {newFlag: 0, value: 211},
      '106': {newFlag: 0, value: 213},
      '107': {newFlag: 0, value: 215},
      '108': {newFlag: 0, value: 217},
      '109': {newFlag: 0, value: 219},
      '110': {newFlag: 0, value: 221},
      '111': {newFlag: 0, value: 223},
      '112': {newFlag: 0, value: 225},
      '113': {newFlag: 0, value: 227},
      '114': {newFlag: 0, value: 229},
      '115': {newFlag: 0, value: 231},
      '116': {newFlag: 0, value: 233},
      '117': {newFlag: 0, value: 235},
      '118': {newFlag: 0, value: 237},
      '119': {newFlag: 0, value: 239},
      '120': {newFlag: 0, value: 241},
      '121': {newFlag: 0, value: 243},
      '122': {newFlag: 0, value: 245},
      '123': {newFlag: 0, value: 247},
      '124': {newFlag: 0, value: 249},
      '125': {newFlag: 0, value: 251},
      '126': {newFlag: 0, value: 253},
      '127': {newFlag: 0, value: 255},
      '128': {newFlag: 1, value: 1},
      '129': {newFlag: 1, value: 3},
      '130': {newFlag: 1, value: 5},
      '131': {newFlag: 1, value: 7},
      '132': {newFlag: 1, value: 9},
      '133': {newFlag: 1, value: 11},
      '134': {newFlag: 1, value: 13},
      '135': {newFlag: 1, value: 15},
      '136': {newFlag: 1, value: 17},
      '137': {newFlag: 1, value: 19},
      '138': {newFlag: 1, value: 21},
      '139': {newFlag: 1, value: 23},
      '140': {newFlag: 1, value: 25},
      '141': {newFlag: 1, value: 27},
      '142': {newFlag: 1, value: 29},
      '143': {newFlag: 1, value: 31},
      '144': {newFlag: 1, value: 33},
      '145': {newFlag: 1, value: 35},
      '146': {newFlag: 1, value: 37},
      '147': {newFlag: 1, value: 39},
      '148': {newFlag: 1, value: 41},
      '149': {newFlag: 1, value: 43},
      '150': {newFlag: 1, value: 45},
      '151': {newFlag: 1, value: 47},
      '152': {newFlag: 1, value: 49},
      '153': {newFlag: 1, value: 51},
      '154': {newFlag: 1, value: 53},
      '155': {newFlag: 1, value: 55},
      '156': {newFlag: 1, value: 57},
      '157': {newFlag: 1, value: 59},
      '158': {newFlag: 1, value: 61},
      '159': {newFlag: 1, value: 63},
      '160': {newFlag: 1, value: 65},
      '161': {newFlag: 1, value: 67},
      '162': {newFlag: 1, value: 69},
      '163': {newFlag: 1, value: 71},
      '164': {newFlag: 1, value: 73},
      '165': {newFlag: 1, value: 75},
      '166': {newFlag: 1, value: 77},
      '167': {newFlag: 1, value: 79},
      '168': {newFlag: 1, value: 81},
      '169': {newFlag: 1, value: 83},
      '170': {newFlag: 1, value: 85},
      '171': {newFlag: 1, value: 87},
      '172': {newFlag: 1, value: 89},
      '173': {newFlag: 1, value: 91},
      '174': {newFlag: 1, value: 93},
      '175': {newFlag: 1, value: 95},
      '176': {newFlag: 1, value: 97},
      '177': {newFlag: 1, value: 99},
      '178': {newFlag: 1, value: 101},
      '179': {newFlag: 1, value: 103},
      '180': {newFlag: 1, value: 105},
      '181': {newFlag: 1, value: 107},
      '182': {newFlag: 1, value: 109},
      '183': {newFlag: 1, value: 111},
      '184': {newFlag: 1, value: 113},
      '185': {newFlag: 1, value: 115},
      '186': {newFlag: 1, value: 117},
      '187': {newFlag: 1, value: 119},
      '188': {newFlag: 1, value: 121},
      '189': {newFlag: 1, value: 123},
      '190': {newFlag: 1, value: 125},
      '191': {newFlag: 1, value: 127},
      '192': {newFlag: 1, value: 129},
      '193': {newFlag: 1, value: 131},
      '194': {newFlag: 1, value: 133},
      '195': {newFlag: 1, value: 135},
      '196': {newFlag: 1, value: 137},
      '197': {newFlag: 1, value: 139},
      '198': {newFlag: 1, value: 141},
      '199': {newFlag: 1, value: 143},
      '200': {newFlag: 1, value: 145},
      '201': {newFlag: 1, value: 147},
      '202': {newFlag: 1, value: 149},
      '203': {newFlag: 1, value: 151},
      '204': {newFlag: 1, value: 153},
      '205': {newFlag: 1, value: 155},
      '206': {newFlag: 1, value: 157},
      '207': {newFlag: 1, value: 159},
      '208': {newFlag: 1, value: 161},
      '209': {newFlag: 1, value: 163},
      '210': {newFlag: 1, value: 165},
      '211': {newFlag: 1, value: 167},
      '212': {newFlag: 1, value: 169},
      '213': {newFlag: 1, value: 171},
      '214': {newFlag: 1, value: 173},
      '215': {newFlag: 1, value: 175},
      '216': {newFlag: 1, value: 177},
      '217': {newFlag: 1, value: 179},
      '218': {newFlag: 1, value: 181},
      '219': {newFlag: 1, value: 183},
      '220': {newFlag: 1, value: 185},
      '221': {newFlag: 1, value: 187},
      '222': {newFlag: 1, value: 189},
      '223': {newFlag: 1, value: 191},
      '224': {newFlag: 1, value: 193},
      '225': {newFlag: 1, value: 195},
      '226': {newFlag: 1, value: 197},
      '227': {newFlag: 1, value: 199},
      '228': {newFlag: 1, value: 201},
      '229': {newFlag: 1, value: 203},
      '230': {newFlag: 1, value: 205},
      '231': {newFlag: 1, value: 207},
      '232': {newFlag: 1, value: 209},
      '233': {newFlag: 1, value: 211},
      '234': {newFlag: 1, value: 213},
      '235': {newFlag: 1, value: 215},
      '236': {newFlag: 1, value: 217},
      '237': {newFlag: 1, value: 219},
      '238': {newFlag: 1, value: 221},
      '239': {newFlag: 1, value: 223},
      '240': {newFlag: 1, value: 225},
      '241': {newFlag: 1, value: 227},
      '242': {newFlag: 1, value: 229},
      '243': {newFlag: 1, value: 231},
      '244': {newFlag: 1, value: 233},
      '245': {newFlag: 1, value: 235},
      '246': {newFlag: 1, value: 237},
      '247': {newFlag: 1, value: 239},
      '248': {newFlag: 1, value: 241},
      '249': {newFlag: 1, value: 243},
      '250': {newFlag: 1, value: 245},
      '251': {newFlag: 1, value: 247},
      '252': {newFlag: 1, value: 249},
      '253': {newFlag: 1, value: 251},
      '254': {newFlag: 1, value: 253},
    },
  },
};
