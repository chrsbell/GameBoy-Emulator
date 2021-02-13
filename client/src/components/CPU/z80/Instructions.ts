import Memory from '../../Memory';
import { Byte, Word } from '../../Types';
import CPU from '../';
import { debug } from 'webpack';
import { add } from 'lodash';

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

// const LDii = (r1: Word, r1Upper: boolean, writeVal: Byte) => {
//   let writeVal: Byte;
//   if (r2Upper) {
//     writeVal = r2.upper();
//   }
//   if (r1Upper) {
//     r1.setUpper(writeVal);
//   }
// }
// const LDmi = () =>

export default {
  map: {
    '0x00': function (this: CPU): void {},

    '0x01': function (this: CPU): void {
      this.R.BC.set(Memory.readWord(this.PC.value()));
    },

    '0x02': function (this: CPU): void {
      Memory.writeByte(this.R.BC.value(), this.R.AF.upper());
    },

    '0x03': function (this: CPU): void {
      this.R.BC.add(1);
    },

    '0x04': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.BC.upper(), operand);
      // perform addition
      operand.add(this.R.BC.upper().value());
      this.R.BC.setUpper(operand);

      this.checkZFlag(this.R.BC.upper());
      this.R.F.N.flag(0);
    },

    '0x05': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(-1);
      this.checkHalfCarry(this.R.BC.upper(), operand);
      operand.add(this.R.BC.upper().value());
      this.R.BC.setUpper(operand);

      this.checkZFlag(this.R.BC.upper());
      this.R.F.N.flag(1);
    },

    '0x06': function (this: CPU): void {
      // load into B from PC (immediate)
      this.R.BC.setUpper(new Byte(Memory.readByte(this.PC.value())));
    },

    '0x07': function (this: CPU): void {
      // check carry flag
      this.R.F.CY.flag(this.R.AF.upper().value() >> 7);
      // left shift
      const shifted = this.R.AF.upper().value() << 1;
      this.R.AF.setUpper(new Byte(shifted | (shifted >> 8)));
      // flag resets
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.Z.flag(0);
    },

    '0x08': function (this: CPU): void {
      Memory.writeWord(Memory.readWord(this.PC.value()), this.SP);
    },

    '0x09': function (this: CPU): void {
      this.checkFullCarry(this.R.HL, this.R.BC);
      this.checkHalfCarry(this.R.HL.upper(), this.R.BC.upper());
      this.R.HL.add(this.R.BC.value());
      this.R.F.N.flag(0);
    },

    '0x0a': function (this: CPU): void {
      this.R.AF.setUpper(new Byte(Memory.readByte(this.R.BC.value())));
    },

    '0x0b': function (this: CPU): void {
      this.R.BC.add(-1);
    },

    '0x0c': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.BC.lower(), operand);
      // perform addition
      operand.add(this.R.BC.lower().value());
      this.R.BC.setLower(operand);

      this.checkZFlag(this.R.BC.lower());
      this.R.F.N.flag(0);
    },

    '0x0d': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(-1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.BC.lower(), operand);
      // perform addition
      operand.add(this.R.BC.lower().value());
      this.R.BC.setLower(operand);

      this.checkZFlag(this.R.BC.lower());
      this.R.F.N.flag(1);
    },

    '0x0e': function (this: CPU): void {
      // load into C from PC (immediate)
      this.R.BC.setLower(new Byte(Memory.readByte(this.PC.value())));
    },

    '0x0f': function (this: CPU): void {
      // check carry flag
      const bitZero = this.R.AF.upper().value() & 1;
      this.R.F.CY.flag(bitZero);
      // right shift
      const shifted = this.R.AF.upper().value() >> 1;
      this.R.AF.setUpper(new Byte(shifted | (bitZero << 7)));
      // flag resets
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.Z.flag(0);
    },

    '0x10': function (this: CPU): void {
      console.log('Instruction halted.');
      throw new Error();
    },

    '0x11': function (this: CPU): void {
      this.R.DE.set(Memory.readWord(this.PC.value()));
    },

    '0x12': function (this: CPU): void {
      Memory.writeByte(this.R.DE.value(), this.R.AF.upper());
    },

    '0x13': function (this: CPU): void {
      this.R.DE.add(1);
    },

    '0x14': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.DE.upper(), operand);
      // perform addition
      operand.add(this.R.DE.upper().value());
      this.R.DE.setUpper(operand);

      this.checkZFlag(this.R.DE.upper());
      this.R.F.N.flag(0);
    },

    '0x15': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(-1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.DE.upper(), operand);
      // perform addition
      operand.add(this.R.DE.upper().value());
      this.R.DE.setUpper(operand);

      this.checkZFlag(this.R.DE.upper());
      this.R.F.N.flag(1);
    },

    '0x16': function (this: CPU): void {
      this.R.DE.setUpper(new Byte(Memory.readByte(this.PC.value())));
    },

    '0x17': function (this: CPU): void {
      // need to rotate left through the carry flag
      // get the old carry value
      const oldCY = this.R.F.CY.value();
      // set the carry flag to the 7th bit of A
      this.R.F.CY.flag(this.R.AF.upper().value() >> 7);
      // rotate left
      let shifted = this.R.AF.upper().value() << 1;
      // combine old flag and shifted, set to A
      this.R.AF.setUpper(new Byte(shifted | oldCY));
    },

    '0x18': function (this: CPU): void {
      this.PC.add(toSigned(Memory.readByte(this.PC.value())));
    },

    '0x19': function (this: CPU): void {
      this.checkFullCarry(this.R.HL, this.R.DE);
      this.checkHalfCarry(this.R.HL.upper(), this.R.DE.upper());
      this.R.HL.add(this.R.DE.value());
      this.R.F.N.flag(0);
    },

    '0x1a': function (this: CPU): void {
      this.R.AF.setUpper(new Byte(Memory.readByte(this.R.DE.value())));
    },

    '0x1b': function (this: CPU): void {
      this.R.DE.add(-1);
    },

    '0x1c': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.DE.lower(), operand);
      // perform addition
      operand.add(this.R.DE.lower().value());
      this.R.DE.setLower(operand);

      this.checkZFlag(this.R.DE.lower());
      this.R.F.N.flag(0);
    },

    '0x1d': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(-1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.DE.lower(), operand);
      // perform addition
      operand.add(this.R.DE.lower().value());
      this.R.DE.setLower(operand);

      this.checkZFlag(this.R.DE.lower());
      this.R.F.N.flag(1);
    },

    '0x1e': function (this: CPU): void {
      this.R.DE.setLower(new Byte(Memory.readByte(this.PC.value())));
    },

    '0x1f': function (this: CPU): void {
      // rotate right through the carry flag
      // get the old carry value
      const oldCY = this.R.F.CY.value();
      // set the carry flag to the 0th bit of A
      this.R.F.CY.flag(this.R.AF.upper().value() & 1);
      // rotate right
      let shifted = this.R.AF.upper().value() >> 1;
      // combine old flag and shifted, set to A
      this.R.AF.setUpper(new Byte(shifted | (oldCY << 7)));
    },

    '0x20': function (this: CPU): boolean {
      const incr = toSigned(Memory.readByte(this.PC.value()));
      // increment PC if zero flag was reset
      if (!this.R.F.Z.value()) {
        this.PC.add(incr);
        return true;
      }
      return false;
    },

    '0x21': function (this: CPU): void {
      this.R.HL.set(Memory.readWord(this.PC.value()));
    },

    '0x22': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.AF.upper());
      this.R.HL.add(1);
    },

    '0x23': function (this: CPU): void {
      this.R.HL.add(1);
    },

    '0x24': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.HL.upper(), operand);
      // perform addition
      operand.add(this.R.HL.upper().value());
      this.R.HL.setUpper(operand);

      this.checkZFlag(operand);
      this.R.F.N.flag(0);
    },

    '0x25': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(-1);
      // check for half carry on affected byte only
      this.checkHalfCarry(this.R.HL.upper(), operand);
      // perform addition
      operand.add(this.R.HL.upper().value());
      this.R.HL.setUpper(operand);

      this.checkZFlag(operand);
      this.R.F.N.flag(1);
    },

    '0x26': function (this: CPU): void {
      this.R.HL.setUpper(new Byte(Memory.readByte(this.PC.value())));
    },

    /**
     * DAA instruction taken from - https://forums.nesdev.com/viewtopic.php?t=15944#p196282
     */
    '0x27': function (this: CPU): void {
      // note: assumes a is a uint8_t and wraps from 0xff to 0
      if (!this.R.F.N.value()) {
        // after an addition, adjust if (half-)carry occurred or if result is out of bounds
        if (this.R.F.CY.value() || this.R.AF.upper().value() > 0x99) {
          this.R.AF.addUpper(0x60);
          this.R.F.CY.flag(1);
        }
        if (this.R.F.H.value() || (this.R.AF.upper().value() & 0x0f) > 0x09) {
          this.R.AF.addUpper(0x6);
        }
      } else {
        // after a subtraction, only adjust if (half-)carry occurred
        if (this.R.F.CY.value()) {
          this.R.AF.addUpper(-0x60);
        }
        if (this.R.F.H.value()) {
          this.R.AF.addUpper(-0x6);
        }
      }
      // these flags are always updated
      const AZero = this.R.AF.upper().value() === 0 ? 1 : 0;
      this.R.F.Z.flag(AZero); // the usual z flag
      this.R.F.H.flag(0); // h flag is always cleared
    },

    '0x28': function (this: CPU): boolean {
      const incr = toSigned(Memory.readByte(this.PC.value()));
      // increment PC if zero flag was set
      if (this.R.F.Z.value()) {
        this.PC.add(incr);
        return true;
      }
      return false;
    },

    '0x29': function (this: CPU): void {
      this.checkFullCarry(this.R.HL, this.R.HL);
      this.checkHalfCarry(this.R.HL.upper(), this.R.HL.upper());
      this.R.HL.add(this.R.HL.value());
      this.R.F.N.flag(0);
    },

    '0x2a': function (this: CPU): void {
      this.R.AF.setUpper(new Byte(Memory.readByte(this.R.HL.value())));
      this.R.HL.add(1);
    },

    '0x2b': function (this: CPU): void {
      this.R.HL.add(-1);
    },

    '0x2c': function (this: CPU): void {
      const operand = new Byte(1);
      this.checkHalfCarry(this.R.HL.lower(), operand);
      operand.add(this.R.HL.lower().value());
      this.R.HL.setLower(operand);
      this.checkZFlag(operand);
      this.R.F.N.flag(0);
    },

    '0x2d': function (this: CPU): void {
      const operand = new Byte(-1);
      this.checkHalfCarry(this.R.HL.lower(), operand);
      operand.add(this.R.HL.lower().value());
      this.R.HL.setLower(operand);
      this.checkZFlag(operand);
      this.R.F.N.flag(1);
    },

    '0x2e': function (this: CPU): void {
      this.R.HL.setLower(new Byte(Memory.readByte(this.PC.value())));
    },

    '0x2f': function (this: CPU): void {
      this.R.AF.setUpper(new Byte(~this.R.AF.upper()));
      this.R.F.N.flag(1);
      this.R.F.H.flag(1);
    },

    '0x30': function (this: CPU): boolean {
      const incr = toSigned(Memory.readByte(this.PC.value()));
      if (!this.R.F.CY.value()) {
        this.PC.add(incr);
        return true;
      }
      return false;
    },

    '0x31': function (this: CPU): void {
      this.SP.set(Memory.readWord(this.PC.value()));
    },

    '0x32': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.AF.upper());
      this.R.HL.add(-1);
    },

    '0x33': function (this: CPU): void {
      debugger;
      this.SP.add(1);
    },

    '0x34': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(1);
      const newVal: Byte = new Byte(Memory.readByte(this.R.HL.value()));
      // check for half carry on affected byte only
      this.checkHalfCarry(newVal, operand);
      operand.add(this.R.HL.value());
      Memory.writeByte(this.R.HL.value(), operand);

      this.checkZFlag(operand);
      this.R.F.N.flag(0);
    },

    '0x35': function (this: CPU): void {
      // convert operand to unsigned
      const operand = new Byte(-1);
      const newVal: Byte = new Byte(Memory.readByte(this.R.HL.value()));
      // check for half carry on affected byte only
      this.checkHalfCarry(newVal, operand);
      operand.add(this.R.HL.value());
      Memory.writeByte(this.R.HL.value(), operand);

      this.checkZFlag(operand);
      this.R.F.N.flag(1);
    },

    '0x36': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), new Byte(Memory.readByte(this.PC.value())));
    },

    '0x37': function (this: CPU): void {
      this.R.F.CY.flag(1);
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
    },

    '0x38': function (this: CPU): boolean {
      const incr = toSigned(Memory.readByte(this.PC.value()));
      if (this.R.F.CY.value()) {
        this.PC.add(incr);
        return true;
      }
      return false;
    },

    '0x39': function (this: CPU): void {
      this.checkFullCarry(this.R.HL, this.SP);
      this.checkHalfCarry(this.R.HL.upper(), this.SP.upper());
      this.R.HL.add(this.SP.value());
      this.R.F.N.flag(0);
    },

    '0x3a': function (this: CPU): void {
      this.R.AF.setUpper(new Byte(Memory.readByte(this.R.HL.value())));
      this.R.HL.add(-1);
    },

    '0x3b': function (this: CPU): void {
      this.SP.add(-1);
    },

    '0x3c': function (this: CPU): void {
      const operand = new Byte(1);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      operand.add(this.R.AF.upper().value());
      this.R.AF.setUpper(operand);
      this.checkZFlag(operand);
      this.R.F.N.flag(0);
    },

    '0x3d': function (this: CPU): void {
      const operand = new Byte(-1);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      operand.add(this.R.AF.upper().value());
      this.R.AF.setUpper(operand);
      this.checkZFlag(operand);
      this.R.F.N.flag(1);
    },

    '0x3e': function (this: CPU): void {
      this.R.AF.setUpper(new Byte(Memory.readByte(this.PC.value())));
    },

    '0x3f': function (this: CPU): void {
      const { value } = this.R.F.CY;
      if (value) {
        this.R.F.CY.flag(0);
      } else {
        this.R.F.CY.flag(1);
      }
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
    },

    '0x40': function (this: CPU): void {
      this.R.BC.setUpper(this.R.BC.upper());
    },

    '0x41': function (this: CPU): void {
      this.R.BC.setUpper(this.R.BC.lower());
    },

    '0x42': function (this: CPU): void {
      this.R.BC.setUpper(this.R.DE.upper());
    },

    '0x43': function (this: CPU): void {
      this.R.BC.setUpper(this.R.DE.lower());
    },

    '0x44': function (this: CPU): void {
      this.R.BC.setUpper(this.R.HL.upper());
    },

    '0x45': function (this: CPU): void {
      this.R.BC.setUpper(this.R.HL.lower());
    },

    '0x46': function (this: CPU): void {
      this.R.BC.setUpper(new Byte(Memory.readByte(this.R.HL.value())));
    },

    '0x47': function (this: CPU): void {
      this.R.BC.setUpper(this.R.AF.upper());
    },

    '0x48': function (this: CPU): void {
      this.R.BC.setLower(this.R.BC.upper());
    },

    '0x49': function (this: CPU): void {
      this.R.BC.setLower(this.R.BC.lower());
    },

    '0x4a': function (this: CPU): void {
      this.R.BC.setLower(this.R.DE.upper());
    },

    '0x4b': function (this: CPU): void {
      this.R.BC.setLower(this.R.DE.lower());
    },

    '0x4c': function (this: CPU): void {
      this.R.BC.setLower(this.R.HL.upper());
    },

    '0x4d': function (this: CPU): void {
      this.R.BC.setLower(this.R.HL.lower());
    },

    '0x4e': function (this: CPU): void {
      this.R.BC.setLower(new Byte(Memory.readByte(this.R.HL.value())));
    },

    '0x4f': function (this: CPU): void {
      this.R.BC.setLower(this.R.AF.upper());
    },

    '0x50': function (this: CPU): void {
      this.R.DE.setUpper(this.R.BC.upper());
    },

    '0x51': function (this: CPU): void {
      this.R.DE.setUpper(this.R.BC.lower());
    },

    '0x52': function (this: CPU): void {
      this.R.DE.setUpper(this.R.DE.upper());
    },

    '0x53': function (this: CPU): void {
      this.R.DE.setUpper(this.R.DE.lower());
    },

    '0x54': function (this: CPU): void {
      this.R.DE.setUpper(this.R.HL.upper());
    },

    '0x55': function (this: CPU): void {
      this.R.DE.setUpper(this.R.HL.lower());
    },

    '0x56': function (this: CPU): void {
      this.R.DE.setUpper(new Byte(Memory.readByte(this.R.HL.value())));
    },

    '0x57': function (this: CPU): void {
      this.R.DE.setUpper(this.R.AF.upper());
    },

    '0x58': function (this: CPU): void {
      this.R.DE.setLower(this.R.BC.upper());
    },

    '0x59': function (this: CPU): void {
      this.R.DE.setLower(this.R.BC.upper());
    },

    '0x5a': function (this: CPU): void {
      this.R.DE.setLower(this.R.DE.upper());
    },

    '0x5b': function (this: CPU): void {
      this.R.DE.setLower(this.R.DE.lower());
    },

    '0x5c': function (this: CPU): void {
      this.R.DE.setLower(this.R.HL.upper());
    },

    '0x5d': function (this: CPU): void {
      this.R.DE.setLower(this.R.HL.lower());
    },

    '0x5e': function (this: CPU): void {
      this.R.DE.setLower(new Byte(Memory.readByte(this.R.HL.value())));
    },

    '0x5f': function (this: CPU): void {
      this.R.DE.setLower(this.R.AF.upper());
    },

    '0x60': function (this: CPU): void {
      this.R.HL.setUpper(this.R.BC.upper());
    },

    '0x61': function (this: CPU): void {
      this.R.HL.setUpper(this.R.BC.lower());
    },

    '0x62': function (this: CPU): void {
      this.R.HL.setUpper(this.R.DE.upper());
    },

    '0x63': function (this: CPU): void {
      this.R.HL.setUpper(this.R.DE.lower());
    },

    '0x64': function (this: CPU): void {
      this.R.HL.setUpper(this.R.HL.upper());
    },

    '0x65': function (this: CPU): void {
      this.R.HL.setUpper(this.R.HL.lower());
    },

    '0x66': function (this: CPU): void {
      this.R.HL.setUpper(new Byte(Memory.readByte(this.R.HL.value())));
    },

    '0x67': function (this: CPU): void {
      this.R.HL.setUpper(this.R.AF.upper());
    },

    '0x68': function (this: CPU): void {
      this.R.HL.setLower(this.R.BC.upper());
    },

    '0x69': function (this: CPU): void {
      this.R.HL.setLower(this.R.BC.lower());
    },

    '0x6a': function (this: CPU): void {
      this.R.HL.setLower(this.R.DE.upper());
    },

    '0x6b': function (this: CPU): void {
      this.R.HL.setLower(this.R.DE.lower());
    },

    '0x6c': function (this: CPU): void {
      this.R.HL.setLower(this.R.HL.upper());
    },

    '0x6d': function (this: CPU): void {
      this.R.HL.setLower(this.R.HL.lower());
    },

    '0x6e': function (this: CPU): void {
      this.R.HL.setLower(new Byte(Memory.readByte(this.R.HL.value())));
    },

    '0x6f': function (this: CPU): void {
      this.R.HL.setLower(this.R.AF.upper());
    },

    '0x70': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.BC.upper());
    },

    '0x71': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.BC.lower());
    },

    '0x72': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.DE.upper());
    },

    '0x73': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.DE.lower());
    },

    '0x74': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.HL.upper());
    },

    '0x75': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.HL.lower());
    },

    '0x76': function (this: CPU): void {
      this.halted = true;
    },

    '0x77': function (this: CPU): void {
      Memory.writeByte(this.R.HL.value(), this.R.AF.upper());
    },

    '0x78': function (this: CPU): void {
      this.R.AF.setUpper(this.R.BC.upper());
    },

    '0x79': function (this: CPU): void {
      this.R.AF.setUpper(this.R.BC.lower());
    },

    '0x7a': function (this: CPU): void {
      this.R.AF.setUpper(this.R.DE.upper());
    },

    '0x7b': function (this: CPU): void {
      this.R.AF.setUpper(this.R.DE.lower());
    },

    '0x7c': function (this: CPU): void {
      this.R.AF.setUpper(this.R.HL.upper());
    },

    '0x7d': function (this: CPU): void {
      this.R.AF.setUpper(this.R.HL.lower());
    },

    '0x7e': function (this: CPU): void {
      this.R.AF.setUpper(new Byte(Memory.readByte(this.R.HL.value())));
    },

    '0x7f': function (this: CPU): void {
      this.R.AF.setUpper(this.R.AF.upper());
    },

    '0x80': function (this: CPU): void {
      this.checkFullCarry(this.R.AF.upper(), this.R.BC.upper());
      this.checkHalfCarry(this.R.AF.upper(), this.R.BC.upper());
      this.R.AF.addUpper(this.R.BC.upper().value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x81': function (this: CPU): void {
      this.checkFullCarry(this.R.AF.upper(), this.R.BC.lower());
      this.checkHalfCarry(this.R.AF.upper(), this.R.BC.lower());
      this.R.AF.addUpper(this.R.BC.lower().value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x82': function (this: CPU): void {
      this.checkFullCarry(this.R.AF.upper(), this.R.DE.upper());
      this.checkHalfCarry(this.R.AF.upper(), this.R.DE.upper());
      this.R.AF.addUpper(this.R.DE.upper().value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x83': function (this: CPU): void {
      this.checkFullCarry(this.R.AF.upper(), this.R.DE.lower());
      this.checkHalfCarry(this.R.AF.upper(), this.R.DE.lower());
      this.R.AF.addUpper(this.R.DE.lower().value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x84': function (this: CPU): void {
      this.checkFullCarry(this.R.AF.upper(), this.R.HL.upper());
      this.checkHalfCarry(this.R.AF.upper(), this.R.HL.upper());
      this.R.AF.addUpper(this.R.HL.upper().value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x85': function (this: CPU): void {
      this.checkFullCarry(this.R.AF.upper(), this.R.HL.lower());
      this.checkHalfCarry(this.R.AF.upper(), this.R.HL.lower());
      this.R.AF.addUpper(this.R.HL.lower().value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x86': function (this: CPU): void {
      const operand = new Byte(Memory.readByte(this.R.HL.value()));
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x87': function (this: CPU): void {
      this.checkFullCarry(this.R.AF.upper(), this.R.AF.upper());
      this.checkHalfCarry(this.R.AF.upper(), this.R.AF.upper());
      this.R.AF.addUpper(this.R.AF.upper().value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x88': function (this: CPU): void {
      const operand = this.R.BC.upper();
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x89': function (this: CPU): void {
      const operand = this.R.BC.lower();
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x8a': function (this: CPU): void {
      const operand = this.R.DE.upper();
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x8b': function (this: CPU): void {
      const operand = this.R.DE.lower();
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x8c': function (this: CPU): void {
      const operand = this.R.HL.upper();
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x8d': function (this: CPU): void {
      const operand = this.R.HL.lower();
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x8e': function (this: CPU): void {
      const operand = new Byte(Memory.readByte(this.R.HL.value()));
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x8f': function (this: CPU): void {
      const operand = this.R.AF.upper();
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0x90': function (this: CPU): void {
      const operand = this.R.BC.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x91': function (this: CPU): void {
      const operand = this.R.BC.lower();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x92': function (this: CPU): void {
      const operand = this.R.DE.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x93': function (this: CPU): void {
      const operand = this.R.DE.lower();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x94': function (this: CPU): void {
      const operand = this.R.HL.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x95': function (this: CPU): void {
      const operand = this.R.HL.lower();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x96': function (this: CPU): void {
      const operand = new Byte(Memory.readByte(this.R.HL.value()));
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x97': function (this: CPU): void {
      const operand = this.R.AF.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x98': function (this: CPU): void {
      const operand = this.R.BC.upper();
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x99': function (this: CPU): void {
      const operand = this.R.BC.lower();
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x9a': function (this: CPU): void {
      const operand = this.R.DE.upper();
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x9b': function (this: CPU): void {
      const operand = this.R.DE.lower();
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x9c': function (this: CPU): void {
      const operand = this.R.HL.upper();
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x9d': function (this: CPU): void {
      const operand = this.R.HL.lower();
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x9e': function (this: CPU): void {
      const operand = new Byte(Memory.readByte(this.R.HL.value()));
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0x9f': function (this: CPU): void {
      const operand = this.R.AF.upper();
      operand.negate();
      const carry = this.R.F.CY.value() ? -1 : 0;
      operand.add(carry);
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(1);
    },

    '0xa0': function (this: CPU): void {
      const result = this.R.AF.upper().value() & this.R.BC.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa1': function (this: CPU): void {
      const result = this.R.AF.upper().value() & this.R.BC.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa2': function (this: CPU): void {
      const result = this.R.AF.upper().value() & this.R.DE.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa3': function (this: CPU): void {
      const result = this.R.AF.upper().value() & this.R.DE.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa4': function (this: CPU): void {
      const result = this.R.AF.upper().value() & this.R.HL.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa5': function (this: CPU): void {
      const result = this.R.AF.upper().value() & this.R.HL.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa6': function (this: CPU): void {
      const result = this.R.AF.upper().value() & Memory.readByte(this.R.HL.value());
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa7': function (this: CPU): void {
      const result = this.R.AF.upper().value() & this.R.AF.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(1);
      this.R.F.CY.flag(0);
    },

    '0xa8': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ this.R.BC.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xa9': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ this.R.BC.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xaa': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ this.R.DE.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xab': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ this.R.DE.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xac': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ this.R.HL.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xad': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ this.R.HL.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xae': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ Memory.readByte(this.R.HL.value());
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xaf': function (this: CPU): void {
      const result = this.R.AF.upper().value() ^ this.R.AF.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb0': function (this: CPU): void {
      const result = this.R.AF.upper().value() | this.R.BC.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb1': function (this: CPU): void {
      const result = this.R.AF.upper().value() | this.R.BC.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb2': function (this: CPU): void {
      const result = this.R.AF.upper().value() | this.R.DE.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb3': function (this: CPU): void {
      const result = this.R.AF.upper().value() | this.R.DE.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb4': function (this: CPU): void {
      const result = this.R.AF.upper().value() | this.R.HL.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb5': function (this: CPU): void {
      const result = this.R.AF.upper().value() | this.R.HL.lower().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb6': function (this: CPU): void {
      const result = this.R.AF.upper().value() | Memory.readByte(this.R.HL.value());
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb7': function (this: CPU): void {
      const result = this.R.AF.upper().value() | this.R.AF.upper().value();
      this.R.AF.setUpper(new Byte(result));
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
      this.R.F.H.flag(0);
      this.R.F.CY.flag(0);
    },

    '0xb8': function (this: CPU): void {
      const operand = this.R.BC.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xb9': function (this: CPU): void {
      const operand = this.R.BC.lower();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xba': function (this: CPU): void {
      const operand = this.R.DE.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xbb': function (this: CPU): void {
      const operand = this.R.DE.lower();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xbc': function (this: CPU): void {
      const operand = this.R.HL.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xbd': function (this: CPU): void {
      const operand = this.R.HL.lower();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xbe': function (this: CPU): void {
      const operand = new Byte(Memory.readByte(this.R.HL.value()));
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xbf': function (this: CPU): void {
      const operand = this.R.AF.upper();
      operand.negate();
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      const result = new Byte(this.R.AF.upper().value() + operand.value());
      this.checkZFlag(result);
      this.R.F.N.flag(1);
    },

    '0xc0': function (this: CPU): boolean {
      if (!this.R.F.Z.value()) {
        this.PC.set(Memory.readWord(this.SP.value()));
        this.SP.add(2);
        return true;
      }
      return false;
    },

    '0xc1': function (this: CPU): void {
      const result = Memory.readWord(this.PC.value());
      this.R.BC.set(new Word(result));
      this.SP.add(2);
    },

    '0xc2': function (this: CPU): boolean {
      if (!this.R.F.Z.value()) {
        this.PC.set(Memory.readWord(this.PC.value()));
        return true;
      }
      return false;
    },

    '0xc3': function (this: CPU): void {
      this.PC.set(Memory.readWord(this.PC.value()));
    },

    '0xc4': function (this: CPU): boolean {
      if (!this.R.F.Z.value()) {
        this.SP.add(-2);
        Memory.writeWord(this.SP.value(), new Word(this.PC.value() + 2));
        this.PC.set(Memory.readWord(this.PC.value()));
        return true;
      }
      return false;
    },

    '0xc5': function (this: CPU): void {
      this.SP.add(-1);
      Memory.writeByte(this.SP.value(), this.R.BC.upper());
      this.SP.add(-1);
      Memory.writeByte(this.SP.value(), this.R.BC.lower());
    },

    '0xc6': function (this: CPU): void {
      const value = new Byte(Memory.readByte(this.PC.value()));
      this.checkFullCarry(this.R.AF.upper(), value);
      this.checkHalfCarry(this.R.AF.upper(), value);
      this.R.AF.addUpper(value.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0xc7': function (this: CPU): void {
      this.SP.add(-2);
      Memory.writeWord(this.SP.value(), this.PC);
      this.PC.set(0);
    },

    '0xc8': function (this: CPU): boolean {
      if (this.R.F.Z.value()) {
        const address = Memory.readWord(this.SP.value());
        this.PC.set(address);
        this.SP.add(2);
        return true;
      }
      return false;
    },

    '0xc9': function (this: CPU): boolean {
      if (this.R.F.CY.value()) {
        const address = Memory.readWord(this.SP.value());
        this.PC.set(address);
        this.SP.add(2);
        return true;
      }
      return false;
    },

    '0xca': function (this: CPU): boolean {
      if (this.R.F.Z.value()) {
        this.PC.set(Memory.readWord(this.PC.value()));
        return true;
      }
      return false;
    },

    '0xcb': function (this: CPU): void {},

    '0xcc': function (this: CPU): boolean {
      if (this.R.F.Z.value()) {
        this.SP.add(-2);
        Memory.writeWord(this.SP.value(), new Word(this.PC.value() + 2));
        this.PC.set(Memory.readWord(this.PC.value()));
        return true;
      }
      return false;
    },

    '0xcd': function (this: CPU): void {
      this.SP.add(-2);
      Memory.writeWord(this.SP.value(), new Word(this.PC.value() + 2));
      this.PC.set(Memory.readWord(this.PC.value()));
    },

    '0xce': function (this: CPU): void {
      const operand = new Byte(Memory.readByte(this.PC.value()));
      operand.add(this.R.F.CY.value());
      this.checkFullCarry(this.R.AF.upper(), operand);
      this.checkHalfCarry(this.R.AF.upper(), operand);
      this.R.AF.addUpper(operand.value());
      this.checkZFlag(this.R.AF.upper());
      this.R.F.N.flag(0);
    },

    '0xcf': function (this: CPU): void {
      this.SP.add(-2);
      Memory.writeWord(this.SP.value(), this.PC);
      this.PC.set(0x08);
    },

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
  },
  cbmap: {},
};
