import OpcodeMap from './Map';
import {byte} from '../../Types';

/**
 * No operation.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function NOP(): byte {
  OpcodeMap[0x00]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBCid16i(): byte {
  OpcodeMap[0x01]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBCmAi(): byte {
  OpcodeMap[0x02]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCBCi(): byte {
  OpcodeMap[0x03]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCBi(): byte {
  OpcodeMap[0x04]();
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECBi(): byte {
  OpcodeMap[0x05]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBid8i(): byte {
  OpcodeMap[0x06]();
  return 8;
}

/**
 * Rotate A left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCA(): byte {
  OpcodeMap[0x07]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDa16mSPi(): byte {
  OpcodeMap[0x08]();
  return 20;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiBCi(): byte {
  OpcodeMap[0x09]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiBCm(): byte {
  OpcodeMap[0x0a]();
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECBCi(): byte {
  OpcodeMap[0x0b]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCCi(): byte {
  OpcodeMap[0x0c]();
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECCi(): byte {
  OpcodeMap[0x0d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCid8i(): byte {
  OpcodeMap[0x0e]();
  return 8;
}

/**
 * Rotate A right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCA(): byte {
  OpcodeMap[0x0f]();
  return 4;
}

/**
 *  Halt CPU & LCD display until button pressed.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function STOP(): byte {
  OpcodeMap[0x10]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDEid16i(): byte {
  OpcodeMap[0x11]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDEmAi(): byte {
  OpcodeMap[0x12]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCDEi(): byte {
  OpcodeMap[0x13]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCDi(): byte {
  OpcodeMap[0x14]();
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECDi(): byte {
  OpcodeMap[0x15]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDid8i(): byte {
  OpcodeMap[0x16]();
  return 8;
}

/**
 * Rotate A left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLA(): byte {
  OpcodeMap[0x17]();
  return 4;
}

/**
 * Jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function JRr8(): byte {
  OpcodeMap[0x18]();
  return 12;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiDEi(): byte {
  OpcodeMap[0x19]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiDEm(): byte {
  OpcodeMap[0x1a]();
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECDEi(): byte {
  OpcodeMap[0x1b]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCEi(): byte {
  OpcodeMap[0x1c]();
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECEi(): byte {
  OpcodeMap[0x1d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEid8i(): byte {
  OpcodeMap[0x1e]();
  return 8;
}

/**
 * Rotate A right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRA(): byte {
  OpcodeMap[0x1f]();
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCNZr8(): byte {
  const condition: boolean = OpcodeMap[0x20]();
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
function LDHLid16i(): byte {
  OpcodeMap[0x21]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLIncrmAi(): byte {
  OpcodeMap[0x22]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCHLi(): byte {
  OpcodeMap[0x23]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCHi(): byte {
  OpcodeMap[0x24]();
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECHi(): byte {
  OpcodeMap[0x25]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHid8i(): byte {
  OpcodeMap[0x26]();
  return 8;
}

/**
 * Decimal adjust register A.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, H, C
 */
function DAAA(): byte {
  OpcodeMap[0x27]();
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCZr8(): byte {
  const condition: boolean = OpcodeMap[0x28]();
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
function ADDHLiHLi(): byte {
  OpcodeMap[0x29]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLIncrm(): byte {
  OpcodeMap[0x2a]();
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECHLi(): byte {
  OpcodeMap[0x2b]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCLi(): byte {
  OpcodeMap[0x2c]();
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECLi(): byte {
  OpcodeMap[0x2d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLid8i(): byte {
  OpcodeMap[0x2e]();
  return 8;
}

/**
 * Complement A register. (Flip all bits.)
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H
 */
function CPLA(): byte {
  OpcodeMap[0x2f]();
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCNCr8(): byte {
  const condition: boolean = OpcodeMap[0x30]();
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
function LDSPid16i(): byte {
  OpcodeMap[0x31]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLDecrmAi(): byte {
  OpcodeMap[0x32]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCSPi(): byte {
  OpcodeMap[0x33]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCHLm(): byte {
  OpcodeMap[0x34]();
  return 12;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECHLm(): byte {
  OpcodeMap[0x35]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmd8i(): byte {
  OpcodeMap[0x36]();
  return 12;
}

/**
 *  Set Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function SCF(): byte {
  OpcodeMap[0x37]();
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCCr8(): byte {
  const condition: boolean = OpcodeMap[0x38]();
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
function ADDHLiSPi(): byte {
  OpcodeMap[0x39]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLDecrm(): byte {
  OpcodeMap[0x3a]();
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECSPi(): byte {
  OpcodeMap[0x3b]();
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCAi(): byte {
  OpcodeMap[0x3c]();
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECAi(): byte {
  OpcodeMap[0x3d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAid8i(): byte {
  OpcodeMap[0x3e]();
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
function CCF(): byte {
  OpcodeMap[0x3f]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiBi(): byte {
  OpcodeMap[0x40]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiCi(): byte {
  OpcodeMap[0x41]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiDi(): byte {
  OpcodeMap[0x42]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiEi(): byte {
  OpcodeMap[0x43]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiHi(): byte {
  OpcodeMap[0x44]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiLi(): byte {
  OpcodeMap[0x45]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiHLm(): byte {
  OpcodeMap[0x46]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiAi(): byte {
  OpcodeMap[0x47]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiBi(): byte {
  OpcodeMap[0x48]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiCi(): byte {
  OpcodeMap[0x49]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiDi(): byte {
  OpcodeMap[0x4a]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiEi(): byte {
  OpcodeMap[0x4b]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiHi(): byte {
  OpcodeMap[0x4c]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiLi(): byte {
  OpcodeMap[0x4d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiHLm(): byte {
  OpcodeMap[0x4e]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiAi(): byte {
  OpcodeMap[0x4f]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiBi(): byte {
  OpcodeMap[0x50]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiCi(): byte {
  OpcodeMap[0x51]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiDi(): byte {
  OpcodeMap[0x52]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiEi(): byte {
  OpcodeMap[0x53]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiHi(): byte {
  OpcodeMap[0x54]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiLi(): byte {
  OpcodeMap[0x55]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiHLm(): byte {
  OpcodeMap[0x56]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiAi(): byte {
  OpcodeMap[0x57]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiBi(): byte {
  OpcodeMap[0x58]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiCi(): byte {
  OpcodeMap[0x59]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiDi(): byte {
  OpcodeMap[0x5a]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiEi(): byte {
  OpcodeMap[0x5b]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiHi(): byte {
  OpcodeMap[0x5c]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiLi(): byte {
  OpcodeMap[0x5d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiHLm(): byte {
  OpcodeMap[0x5e]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiAi(): byte {
  OpcodeMap[0x5f]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiBi(): byte {
  OpcodeMap[0x60]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiCi(): byte {
  OpcodeMap[0x61]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiDi(): byte {
  OpcodeMap[0x62]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiEi(): byte {
  OpcodeMap[0x63]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiHi(): byte {
  OpcodeMap[0x64]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiLi(): byte {
  OpcodeMap[0x65]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiHLm(): byte {
  OpcodeMap[0x66]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiAi(): byte {
  OpcodeMap[0x67]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiBi(): byte {
  OpcodeMap[0x68]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiCi(): byte {
  OpcodeMap[0x69]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiDi(): byte {
  OpcodeMap[0x6a]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiEi(): byte {
  OpcodeMap[0x6b]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiHi(): byte {
  OpcodeMap[0x6c]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiLi(): byte {
  OpcodeMap[0x6d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiHLm(): byte {
  OpcodeMap[0x6e]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiAi(): byte {
  OpcodeMap[0x6f]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmBi(): byte {
  OpcodeMap[0x70]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmCi(): byte {
  OpcodeMap[0x71]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmDi(): byte {
  OpcodeMap[0x72]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmEi(): byte {
  OpcodeMap[0x73]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmHi(): byte {
  OpcodeMap[0x74]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmLi(): byte {
  OpcodeMap[0x75]();
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function HALT(): byte {
  OpcodeMap[0x76]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmAi(): byte {
  OpcodeMap[0x77]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiBi(): byte {
  OpcodeMap[0x78]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiCi(): byte {
  OpcodeMap[0x79]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiDi(): byte {
  OpcodeMap[0x7a]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiEi(): byte {
  OpcodeMap[0x7b]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHi(): byte {
  OpcodeMap[0x7c]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiLi(): byte {
  OpcodeMap[0x7d]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLm(): byte {
  OpcodeMap[0x7e]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiAi(): byte {
  OpcodeMap[0x7f]();
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiBi(): byte {
  OpcodeMap[0x80]();
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiCi(): byte {
  OpcodeMap[0x81]();
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiDi(): byte {
  OpcodeMap[0x82]();
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiEi(): byte {
  OpcodeMap[0x83]();
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiHi(): byte {
  OpcodeMap[0x84]();
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiLi(): byte {
  OpcodeMap[0x85]();
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiHLm(): byte {
  OpcodeMap[0x86]();
  return 8;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiAi(): byte {
  OpcodeMap[0x87]();
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiBi(): byte {
  OpcodeMap[0x88]();
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiCi(): byte {
  OpcodeMap[0x89]();
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiDi(): byte {
  OpcodeMap[0x8a]();
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiEi(): byte {
  OpcodeMap[0x8b]();
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiHi(): byte {
  OpcodeMap[0x8c]();
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiLi(): byte {
  OpcodeMap[0x8d]();
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiHLm(): byte {
  OpcodeMap[0x8e]();
  return 8;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiAi(): byte {
  OpcodeMap[0x8f]();
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiBi(): byte {
  OpcodeMap[0x90]();
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiCi(): byte {
  OpcodeMap[0x91]();
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiDi(): byte {
  OpcodeMap[0x92]();
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiEi(): byte {
  OpcodeMap[0x93]();
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiHi(): byte {
  OpcodeMap[0x94]();
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiLi(): byte {
  OpcodeMap[0x95]();
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiHLm(): byte {
  OpcodeMap[0x96]();
  return 8;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiAi(): byte {
  OpcodeMap[0x97]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiBi(): byte {
  OpcodeMap[0x98]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiCi(): byte {
  OpcodeMap[0x99]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiDi(): byte {
  OpcodeMap[0x9a]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiEi(): byte {
  OpcodeMap[0x9b]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiHi(): byte {
  OpcodeMap[0x9c]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiLi(): byte {
  OpcodeMap[0x9d]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiHLm(): byte {
  OpcodeMap[0x9e]();
  return 8;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiAi(): byte {
  OpcodeMap[0x9f]();
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDBi(): byte {
  OpcodeMap[0xa0]();
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDCi(): byte {
  OpcodeMap[0xa1]();
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDDi(): byte {
  OpcodeMap[0xa2]();
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDEi(): byte {
  OpcodeMap[0xa3]();
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDHi(): byte {
  OpcodeMap[0xa4]();
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDLi(): byte {
  OpcodeMap[0xa5]();
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDHLm(): byte {
  OpcodeMap[0xa6]();
  return 8;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDAi(): byte {
  OpcodeMap[0xa7]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORBi(): byte {
  OpcodeMap[0xa8]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORCi(): byte {
  OpcodeMap[0xa9]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORDi(): byte {
  OpcodeMap[0xaa]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XOREi(): byte {
  OpcodeMap[0xab]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORHi(): byte {
  OpcodeMap[0xac]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORLi(): byte {
  OpcodeMap[0xad]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORHLm(): byte {
  OpcodeMap[0xae]();
  return 8;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORAi(): byte {
  OpcodeMap[0xaf]();
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORBi(): byte {
  OpcodeMap[0xb0]();
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORCi(): byte {
  OpcodeMap[0xb1]();
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORDi(): byte {
  OpcodeMap[0xb2]();
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function OREi(): byte {
  OpcodeMap[0xb3]();
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORHi(): byte {
  OpcodeMap[0xb4]();
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORLi(): byte {
  OpcodeMap[0xb5]();
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORHLm(): byte {
  OpcodeMap[0xb6]();
  return 8;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORAi(): byte {
  OpcodeMap[0xb7]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPBi(): byte {
  OpcodeMap[0xb8]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPCi(): byte {
  OpcodeMap[0xb9]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPDi(): byte {
  OpcodeMap[0xba]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPEi(): byte {
  OpcodeMap[0xbb]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPHi(): byte {
  OpcodeMap[0xbc]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPLi(): byte {
  OpcodeMap[0xbd]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPHLm(): byte {
  OpcodeMap[0xbe]();
  return 8;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPAi(): byte {
  OpcodeMap[0xbf]();
  return 4;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCNZ(): byte {
  const condition: boolean = OpcodeMap[0xc0]();
  if (!condition) {
    return 8;
  }
  return 20;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function POPIntoBCi(): byte {
  OpcodeMap[0xc1]();
  return 12;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCNZa16(): byte {
  const condition: boolean = OpcodeMap[0xc2]();
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
function JPa16(): byte {
  OpcodeMap[0xc3]();
  return 16;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCNZa16(): byte {
  const condition: boolean = OpcodeMap[0xc4]();
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
function PUSHRegisterBCi(): byte {
  OpcodeMap[0xc5]();
  return 16;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAid8i(): byte {
  OpcodeMap[0xc6]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi00Hi(): byte {
  OpcodeMap[0xc7]();
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCZ(): byte {
  const condition: boolean = OpcodeMap[0xc8]();
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
function RET(): byte {
  OpcodeMap[0xc9]();
  return 16;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCZa16(): byte {
  const condition: boolean = OpcodeMap[0xca]();
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
function PREFIX(): byte {
  OpcodeMap[0xcb]();
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCZa16(): byte {
  const condition: boolean = OpcodeMap[0xcc]();
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
function CALL(): byte {
  OpcodeMap[0xcd]();
  return 24;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAid8i(): byte {
  OpcodeMap[0xce]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi08Hi(): byte {
  OpcodeMap[0xcf]();
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCNC(): byte {
  const condition: boolean = OpcodeMap[0xd0]();
  if (!condition) {
    return 8;
  }
  return 20;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function POPIntoDEi(): byte {
  OpcodeMap[0xd1]();
  return 12;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCNCa16(): byte {
  const condition: boolean = OpcodeMap[0xd2]();
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalD3(): byte {
  OpcodeMap[0xd3]();
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCNCa16(): byte {
  const condition: boolean = OpcodeMap[0xd4]();
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
function PUSHRegisterDEi(): byte {
  OpcodeMap[0xd5]();
  return 16;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAid8i(): byte {
  OpcodeMap[0xd6]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi10Hi(): byte {
  OpcodeMap[0xd7]();
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCC(): byte {
  const condition: boolean = OpcodeMap[0xd8]();
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
function RETI(): byte {
  OpcodeMap[0xd9]();
  return 16;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCCa16(): byte {
  const condition: boolean = OpcodeMap[0xda]();
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalDB(): byte {
  OpcodeMap[0xdb]();
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCCa16(): byte {
  const condition: boolean = OpcodeMap[0xdc]();
  if (!condition) {
    return 12;
  }
  return 24;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalDD(): byte {
  OpcodeMap[0xdd]();
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAid8i(): byte {
  OpcodeMap[0xde]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi18Hi(): byte {
  OpcodeMap[0xdf]();
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHa8mAi(): byte {
  OpcodeMap[0xe0]();
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function POPIntoHLi(): byte {
  OpcodeMap[0xe1]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCmAi(): byte {
  OpcodeMap[0xe2]();
  return 8;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalE3(): byte {
  OpcodeMap[0xe3]();
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalE4(): byte {
  OpcodeMap[0xe4]();
  return 4;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterHLi(): byte {
  OpcodeMap[0xe5]();
  return 16;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDd8i(): byte {
  OpcodeMap[0xe6]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi20Hi(): byte {
  OpcodeMap[0xe7]();
  return 16;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDSPir8i(): byte {
  OpcodeMap[0xe8]();
  return 16;
}

/**
 * Jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function JPHL(): byte {
  OpcodeMap[0xe9]();
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDa16mAi(): byte {
  OpcodeMap[0xea]();
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalEB(): byte {
  OpcodeMap[0xeb]();
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalEC(): byte {
  OpcodeMap[0xec]();
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalED(): byte {
  OpcodeMap[0xed]();
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORd8i(): byte {
  OpcodeMap[0xee]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi28Hi(): byte {
  OpcodeMap[0xef]();
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHAia8m(): byte {
  OpcodeMap[0xf0]();
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function POPIntoAFi(): byte {
  OpcodeMap[0xf1]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiCm(): byte {
  OpcodeMap[0xf2]();
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DI(): byte {
  OpcodeMap[0xf3]();
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalF4(): byte {
  OpcodeMap[0xf4]();
  return 4;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterAFi(): byte {
  OpcodeMap[0xf5]();
  return 16;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORd8i(): byte {
  OpcodeMap[0xf6]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi30Hi(): byte {
  OpcodeMap[0xf7]();
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function LDHLiSPIncri(): byte {
  OpcodeMap[0xf8]();
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDSPiHLi(): byte {
  OpcodeMap[0xf9]();
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAia16m(): byte {
  OpcodeMap[0xfa]();
  return 16;
}

/**
 * Enables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function EI(): byte {
  OpcodeMap[0xfb]();
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalFC(): byte {
  OpcodeMap[0xfc]();
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalFD(): byte {
  OpcodeMap[0xfd]();
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPd8i(): byte {
  OpcodeMap[0xfe]();
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi38Hi(): byte {
  OpcodeMap[0xff]();
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCBi(): byte {
  OpcodeMap[0x00]();
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCCi(): byte {
  OpcodeMap[0x01]();
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCDi(): byte {
  OpcodeMap[0x02]();
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCEi(): byte {
  OpcodeMap[0x03]();
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCHi(): byte {
  OpcodeMap[0x04]();
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCLi(): byte {
  OpcodeMap[0x05]();
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCHLm(): byte {
  OpcodeMap[0x06]();
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCAi(): byte {
  OpcodeMap[0x07]();
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCBi(): byte {
  OpcodeMap[0x08]();
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCCi(): byte {
  OpcodeMap[0x09]();
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCDi(): byte {
  OpcodeMap[0x0a]();
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCEi(): byte {
  OpcodeMap[0x0b]();
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCHi(): byte {
  OpcodeMap[0x0c]();
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCLi(): byte {
  OpcodeMap[0x0d]();
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCHLm(): byte {
  OpcodeMap[0x0e]();
  return 16;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCAi(): byte {
  OpcodeMap[0x0f]();
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLBi(): byte {
  OpcodeMap[0x10]();
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCi(): byte {
  OpcodeMap[0x11]();
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLDi(): byte {
  OpcodeMap[0x12]();
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLEi(): byte {
  OpcodeMap[0x13]();
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLHi(): byte {
  OpcodeMap[0x14]();
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLLi(): byte {
  OpcodeMap[0x15]();
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLHLm(): byte {
  OpcodeMap[0x16]();
  return 16;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLAi(): byte {
  OpcodeMap[0x17]();
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRBi(): byte {
  OpcodeMap[0x18]();
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCi(): byte {
  OpcodeMap[0x19]();
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRDi(): byte {
  OpcodeMap[0x1a]();
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RREi(): byte {
  OpcodeMap[0x1b]();
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRHi(): byte {
  OpcodeMap[0x1c]();
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRLi(): byte {
  OpcodeMap[0x1d]();
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRHLm(): byte {
  OpcodeMap[0x1e]();
  return 16;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRAi(): byte {
  OpcodeMap[0x1f]();
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLABi(): byte {
  OpcodeMap[0x20]();
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLACi(): byte {
  OpcodeMap[0x21]();
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLADi(): byte {
  OpcodeMap[0x22]();
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAEi(): byte {
  OpcodeMap[0x23]();
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAHi(): byte {
  OpcodeMap[0x24]();
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLALi(): byte {
  OpcodeMap[0x25]();
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAHLm(): byte {
  OpcodeMap[0x26]();
  return 16;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAAi(): byte {
  OpcodeMap[0x27]();
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRABi(): byte {
  OpcodeMap[0x28]();
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRACi(): byte {
  OpcodeMap[0x29]();
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRADi(): byte {
  OpcodeMap[0x2a]();
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAEi(): byte {
  OpcodeMap[0x2b]();
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAHi(): byte {
  OpcodeMap[0x2c]();
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRALi(): byte {
  OpcodeMap[0x2d]();
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAHLm(): byte {
  OpcodeMap[0x2e]();
  return 16;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAAi(): byte {
  OpcodeMap[0x2f]();
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPBi(): byte {
  OpcodeMap[0x30]();
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPCi(): byte {
  OpcodeMap[0x31]();
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPDi(): byte {
  OpcodeMap[0x32]();
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPEi(): byte {
  OpcodeMap[0x33]();
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPHi(): byte {
  OpcodeMap[0x34]();
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPLi(): byte {
  OpcodeMap[0x35]();
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPHLm(): byte {
  OpcodeMap[0x36]();
  return 16;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPAi(): byte {
  OpcodeMap[0x37]();
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLBi(): byte {
  OpcodeMap[0x38]();
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLCi(): byte {
  OpcodeMap[0x39]();
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLDi(): byte {
  OpcodeMap[0x3a]();
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLEi(): byte {
  OpcodeMap[0x3b]();
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLHi(): byte {
  OpcodeMap[0x3c]();
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLLi(): byte {
  OpcodeMap[0x3d]();
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLHLm(): byte {
  OpcodeMap[0x3e]();
  return 16;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLAi(): byte {
  OpcodeMap[0x3f]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iBi(): byte {
  OpcodeMap[0x40]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iCi(): byte {
  OpcodeMap[0x41]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iDi(): byte {
  OpcodeMap[0x42]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iEi(): byte {
  OpcodeMap[0x43]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iHi(): byte {
  OpcodeMap[0x44]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iLi(): byte {
  OpcodeMap[0x45]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iHLm(): byte {
  OpcodeMap[0x46]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iAi(): byte {
  OpcodeMap[0x47]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iBi(): byte {
  OpcodeMap[0x48]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iCi(): byte {
  OpcodeMap[0x49]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iDi(): byte {
  OpcodeMap[0x4a]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iEi(): byte {
  OpcodeMap[0x4b]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iHi(): byte {
  OpcodeMap[0x4c]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iLi(): byte {
  OpcodeMap[0x4d]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iHLm(): byte {
  OpcodeMap[0x4e]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iAi(): byte {
  OpcodeMap[0x4f]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iBi(): byte {
  OpcodeMap[0x50]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iCi(): byte {
  OpcodeMap[0x51]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iDi(): byte {
  OpcodeMap[0x52]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iEi(): byte {
  OpcodeMap[0x53]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iHi(): byte {
  OpcodeMap[0x54]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iLi(): byte {
  OpcodeMap[0x55]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iHLm(): byte {
  OpcodeMap[0x56]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iAi(): byte {
  OpcodeMap[0x57]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iBi(): byte {
  OpcodeMap[0x58]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iCi(): byte {
  OpcodeMap[0x59]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iDi(): byte {
  OpcodeMap[0x5a]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iEi(): byte {
  OpcodeMap[0x5b]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iHi(): byte {
  OpcodeMap[0x5c]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iLi(): byte {
  OpcodeMap[0x5d]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iHLm(): byte {
  OpcodeMap[0x5e]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iAi(): byte {
  OpcodeMap[0x5f]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iBi(): byte {
  OpcodeMap[0x60]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iCi(): byte {
  OpcodeMap[0x61]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iDi(): byte {
  OpcodeMap[0x62]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iEi(): byte {
  OpcodeMap[0x63]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iHi(): byte {
  OpcodeMap[0x64]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iLi(): byte {
  OpcodeMap[0x65]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iHLm(): byte {
  OpcodeMap[0x66]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iAi(): byte {
  OpcodeMap[0x67]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iBi(): byte {
  OpcodeMap[0x68]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iCi(): byte {
  OpcodeMap[0x69]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iDi(): byte {
  OpcodeMap[0x6a]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iEi(): byte {
  OpcodeMap[0x6b]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iHi(): byte {
  OpcodeMap[0x6c]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iLi(): byte {
  OpcodeMap[0x6d]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iHLm(): byte {
  OpcodeMap[0x6e]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iAi(): byte {
  OpcodeMap[0x6f]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iBi(): byte {
  OpcodeMap[0x70]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iCi(): byte {
  OpcodeMap[0x71]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iDi(): byte {
  OpcodeMap[0x72]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iEi(): byte {
  OpcodeMap[0x73]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iHi(): byte {
  OpcodeMap[0x74]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iLi(): byte {
  OpcodeMap[0x75]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iHLm(): byte {
  OpcodeMap[0x76]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iAi(): byte {
  OpcodeMap[0x77]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iBi(): byte {
  OpcodeMap[0x78]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iCi(): byte {
  OpcodeMap[0x79]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iDi(): byte {
  OpcodeMap[0x7a]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iEi(): byte {
  OpcodeMap[0x7b]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iHi(): byte {
  OpcodeMap[0x7c]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iLi(): byte {
  OpcodeMap[0x7d]();
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iHLm(): byte {
  OpcodeMap[0x7e]();
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iAi(): byte {
  OpcodeMap[0x7f]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0B(): byte {
  OpcodeMap[0x80]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0C(): byte {
  OpcodeMap[0x81]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0D(): byte {
  OpcodeMap[0x82]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0E(): byte {
  OpcodeMap[0x83]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0H(): byte {
  OpcodeMap[0x84]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0L(): byte {
  OpcodeMap[0x85]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0HL(): byte {
  OpcodeMap[0x86]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0A(): byte {
  OpcodeMap[0x87]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1B(): byte {
  OpcodeMap[0x88]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1C(): byte {
  OpcodeMap[0x89]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1D(): byte {
  OpcodeMap[0x8a]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1E(): byte {
  OpcodeMap[0x8b]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1H(): byte {
  OpcodeMap[0x8c]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1L(): byte {
  OpcodeMap[0x8d]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1HL(): byte {
  OpcodeMap[0x8e]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1A(): byte {
  OpcodeMap[0x8f]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2B(): byte {
  OpcodeMap[0x90]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2C(): byte {
  OpcodeMap[0x91]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2D(): byte {
  OpcodeMap[0x92]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2E(): byte {
  OpcodeMap[0x93]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2H(): byte {
  OpcodeMap[0x94]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2L(): byte {
  OpcodeMap[0x95]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2HL(): byte {
  OpcodeMap[0x96]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2A(): byte {
  OpcodeMap[0x97]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3B(): byte {
  OpcodeMap[0x98]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3C(): byte {
  OpcodeMap[0x99]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3D(): byte {
  OpcodeMap[0x9a]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3E(): byte {
  OpcodeMap[0x9b]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3H(): byte {
  OpcodeMap[0x9c]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3L(): byte {
  OpcodeMap[0x9d]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3HL(): byte {
  OpcodeMap[0x9e]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3A(): byte {
  OpcodeMap[0x9f]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4B(): byte {
  OpcodeMap[0xa0]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4C(): byte {
  OpcodeMap[0xa1]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4D(): byte {
  OpcodeMap[0xa2]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4E(): byte {
  OpcodeMap[0xa3]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4H(): byte {
  OpcodeMap[0xa4]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4L(): byte {
  OpcodeMap[0xa5]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4HL(): byte {
  OpcodeMap[0xa6]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4A(): byte {
  OpcodeMap[0xa7]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5B(): byte {
  OpcodeMap[0xa8]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5C(): byte {
  OpcodeMap[0xa9]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5D(): byte {
  OpcodeMap[0xaa]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5E(): byte {
  OpcodeMap[0xab]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5H(): byte {
  OpcodeMap[0xac]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5L(): byte {
  OpcodeMap[0xad]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5HL(): byte {
  OpcodeMap[0xae]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5A(): byte {
  OpcodeMap[0xaf]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6B(): byte {
  OpcodeMap[0xb0]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6C(): byte {
  OpcodeMap[0xb1]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6D(): byte {
  OpcodeMap[0xb2]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6E(): byte {
  OpcodeMap[0xb3]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6H(): byte {
  OpcodeMap[0xb4]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6L(): byte {
  OpcodeMap[0xb5]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6HL(): byte {
  OpcodeMap[0xb6]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6A(): byte {
  OpcodeMap[0xb7]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7B(): byte {
  OpcodeMap[0xb8]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7C(): byte {
  OpcodeMap[0xb9]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7D(): byte {
  OpcodeMap[0xba]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7E(): byte {
  OpcodeMap[0xbb]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7H(): byte {
  OpcodeMap[0xbc]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7L(): byte {
  OpcodeMap[0xbd]();
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7HL(): byte {
  OpcodeMap[0xbe]();
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7A(): byte {
  OpcodeMap[0xbf]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0B(): byte {
  OpcodeMap[0xc0]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0C(): byte {
  OpcodeMap[0xc1]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0D(): byte {
  OpcodeMap[0xc2]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0E(): byte {
  OpcodeMap[0xc3]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0H(): byte {
  OpcodeMap[0xc4]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0L(): byte {
  OpcodeMap[0xc5]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0HL(): byte {
  OpcodeMap[0xc6]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0A(): byte {
  OpcodeMap[0xc7]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1B(): byte {
  OpcodeMap[0xc8]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1C(): byte {
  OpcodeMap[0xc9]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1D(): byte {
  OpcodeMap[0xca]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1E(): byte {
  OpcodeMap[0xcb]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1H(): byte {
  OpcodeMap[0xcc]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1L(): byte {
  OpcodeMap[0xcd]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1HL(): byte {
  OpcodeMap[0xce]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1A(): byte {
  OpcodeMap[0xcf]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2B(): byte {
  OpcodeMap[0xd0]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2C(): byte {
  OpcodeMap[0xd1]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2D(): byte {
  OpcodeMap[0xd2]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2E(): byte {
  OpcodeMap[0xd3]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2H(): byte {
  OpcodeMap[0xd4]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2L(): byte {
  OpcodeMap[0xd5]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2HL(): byte {
  OpcodeMap[0xd6]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2A(): byte {
  OpcodeMap[0xd7]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3B(): byte {
  OpcodeMap[0xd8]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3C(): byte {
  OpcodeMap[0xd9]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3D(): byte {
  OpcodeMap[0xda]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3E(): byte {
  OpcodeMap[0xdb]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3H(): byte {
  OpcodeMap[0xdc]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3L(): byte {
  OpcodeMap[0xdd]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3HL(): byte {
  OpcodeMap[0xde]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3A(): byte {
  OpcodeMap[0xdf]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4B(): byte {
  OpcodeMap[0xe0]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4C(): byte {
  OpcodeMap[0xe1]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4D(): byte {
  OpcodeMap[0xe2]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4E(): byte {
  OpcodeMap[0xe3]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4H(): byte {
  OpcodeMap[0xe4]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4L(): byte {
  OpcodeMap[0xe5]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4HL(): byte {
  OpcodeMap[0xe6]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4A(): byte {
  OpcodeMap[0xe7]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5B(): byte {
  OpcodeMap[0xe8]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5C(): byte {
  OpcodeMap[0xe9]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5D(): byte {
  OpcodeMap[0xea]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5E(): byte {
  OpcodeMap[0xeb]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5H(): byte {
  OpcodeMap[0xec]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5L(): byte {
  OpcodeMap[0xed]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5HL(): byte {
  OpcodeMap[0xee]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5A(): byte {
  OpcodeMap[0xef]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6B(): byte {
  OpcodeMap[0xf0]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6C(): byte {
  OpcodeMap[0xf1]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6D(): byte {
  OpcodeMap[0xf2]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6E(): byte {
  OpcodeMap[0xf3]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6H(): byte {
  OpcodeMap[0xf4]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6L(): byte {
  OpcodeMap[0xf5]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6HL(): byte {
  OpcodeMap[0xf6]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6A(): byte {
  OpcodeMap[0xf7]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7B(): byte {
  OpcodeMap[0xf8]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7C(): byte {
  OpcodeMap[0xf9]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7D(): byte {
  OpcodeMap[0xfa]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7E(): byte {
  OpcodeMap[0xfb]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7H(): byte {
  OpcodeMap[0xfc]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7L(): byte {
  OpcodeMap[0xfd]();
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7HL(): byte {
  OpcodeMap[0xfe]();
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7A(): byte {
  OpcodeMap[0xff]();
  return 8;
}

export default {
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
