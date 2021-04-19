import CPU from '../';
import {byte} from '../../../Types';
import Memory from '../../Memory';
import OpcodeMap from './Map';

/**
 * No operation.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function NOP(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x00](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBCid16i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x01](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBCmAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x02](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCBCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x03](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x04](cpu, memory);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x05](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x06](cpu, memory);
  return 8;
}

/**
 * Rotate A left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCA(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x07](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDa16mSPi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x08](cpu, memory);
  return 20;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiBCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x09](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiBCm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0a](cpu, memory);
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECBCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0b](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0c](cpu, memory);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0e](cpu, memory);
  return 8;
}

/**
 * Rotate A right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCA(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0f](cpu, memory);
  return 4;
}

/**
 *  Halt CPU & LCD display until button pressed.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function STOP(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x10](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDEid16i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x11](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDEmAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x12](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCDEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x13](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x14](cpu, memory);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x15](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x16](cpu, memory);
  return 8;
}

/**
 * Rotate A left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLA(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x17](cpu, memory);
  return 4;
}

/**
 * Jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function JRr8(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x18](cpu, memory);
  return 12;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function ADDHLiDEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x19](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiDEm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1a](cpu, memory);
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECDEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1b](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1c](cpu, memory);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1e](cpu, memory);
  return 8;
}

/**
 * Rotate A right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRA(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1f](cpu, memory);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCNZr8(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0x20](cpu, memory);
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
function LDHLid16i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x21](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLIncrmAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x22](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCHLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x23](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x24](cpu, memory);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x25](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x26](cpu, memory);
  return 8;
}

/**
 * Decimal adjust register A.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, H, C
 */
function DAAA(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x27](cpu, memory);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCZr8(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0x28](cpu, memory);
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
function ADDHLiHLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x29](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLIncrm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2a](cpu, memory);
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECHLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2b](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2c](cpu, memory);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2e](cpu, memory);
  return 8;
}

/**
 * Complement A register. (Flip all bits.)
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H
 */
function CPLA(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2f](cpu, memory);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCNCr8(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0x30](cpu, memory);
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
function LDSPid16i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x31](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLDecrmAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x32](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function INCSPi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x33](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x34](cpu, memory);
  return 12;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x35](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmd8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x36](cpu, memory);
  return 12;
}

/**
 *  Set Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: N, H, C
 */
function SCF(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x37](cpu, memory);
  return 4;
}

/**
 * Conditional jump to the relative address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JRCCr8(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0x38](cpu, memory);
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
function ADDHLiSPi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x39](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLDecrm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3a](cpu, memory);
  return 8;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DECSPi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3b](cpu, memory);
  return 8;
}

/**
 * Increment register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function INCAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3c](cpu, memory);
  return 4;
}

/**
 * Decrement register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function DECAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3e](cpu, memory);
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
function CCF(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3f](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x40](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x41](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x42](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x43](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x44](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x45](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x46](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDBiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x47](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x48](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x49](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4a](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4b](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4c](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4e](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4f](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x50](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x51](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x52](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x53](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x54](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x55](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x56](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDDiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x57](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x58](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x59](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5a](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5b](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5c](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5e](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDEiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5f](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x60](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x61](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x62](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x63](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x64](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x65](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x66](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x67](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x68](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x69](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6a](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6b](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6c](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6e](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDLiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6f](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x70](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x71](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x72](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x73](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x74](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x75](cpu, memory);
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function HALT(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x76](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHLmAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x77](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x78](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x79](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7a](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7b](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7c](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7d](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7e](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7f](cpu, memory);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x80](cpu, memory);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x81](cpu, memory);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x82](cpu, memory);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x83](cpu, memory);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x84](cpu, memory);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x85](cpu, memory);
  return 4;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x86](cpu, memory);
  return 8;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x87](cpu, memory);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x88](cpu, memory);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x89](cpu, memory);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8a](cpu, memory);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8b](cpu, memory);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8c](cpu, memory);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8d](cpu, memory);
  return 4;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8e](cpu, memory);
  return 8;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8f](cpu, memory);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x90](cpu, memory);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x91](cpu, memory);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x92](cpu, memory);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x93](cpu, memory);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x94](cpu, memory);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x95](cpu, memory);
  return 4;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x96](cpu, memory);
  return 8;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x97](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x98](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x99](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9a](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9b](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9c](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9d](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9e](cpu, memory);
  return 8;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAiAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9f](cpu, memory);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa0](cpu, memory);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa1](cpu, memory);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa2](cpu, memory);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa3](cpu, memory);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa4](cpu, memory);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa5](cpu, memory);
  return 4;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa6](cpu, memory);
  return 8;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa7](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa8](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa9](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xaa](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XOREi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xab](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xac](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xad](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xae](cpu, memory);
  return 8;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xaf](cpu, memory);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb0](cpu, memory);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb1](cpu, memory);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb2](cpu, memory);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function OREi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb3](cpu, memory);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb4](cpu, memory);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb5](cpu, memory);
  return 4;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb6](cpu, memory);
  return 8;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb7](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb8](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb9](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xba](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbb](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbc](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbd](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbe](cpu, memory);
  return 8;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbf](cpu, memory);
  return 4;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCNZ(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xc0](cpu, memory);
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
function POPIntoBCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc1](cpu, memory);
  return 12;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCNZa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xc2](cpu, memory);
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
function JPa16(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc3](cpu, memory);
  return 16;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCNZa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xc4](cpu, memory);
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
function PUSHRegisterBCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc5](cpu, memory);
  return 16;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDAid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc6](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi00Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc7](cpu, memory);
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCZ(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xc8](cpu, memory);
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
function RET(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc9](cpu, memory);
  return 16;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCZa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xca](cpu, memory);
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
function PREFIX(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xcb](cpu, memory);
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCZa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xcc](cpu, memory);
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
function CALL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xcd](cpu, memory);
  return 24;
}

/**
 * Add with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADCAid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xce](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi08Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xcf](cpu, memory);
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCNC(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xd0](cpu, memory);
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
function POPIntoDEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd1](cpu, memory);
  return 12;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCNCa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xd2](cpu, memory);
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalD3(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd3](cpu, memory);
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCNCa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xd4](cpu, memory);
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
function PUSHRegisterDEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd5](cpu, memory);
  return 16;
}

/**
 * Subtract.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SUBAid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd6](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi10Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd7](cpu, memory);
  return 16;
}

/**
 * Conditionally from a function.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function RETCC(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xd8](cpu, memory);
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
function RETI(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd9](cpu, memory);
  return 16;
}

/**
 * Conditional jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function JPCCa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xda](cpu, memory);
  if (!condition) {
    return 12;
  }
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalDB(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xdb](cpu, memory);
  return 4;
}

/**
 * Conditional function call to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
export function CALLCCa16(cpu: CPU, memory: Memory): byte {
  const condition: boolean = OpcodeMap[0xdc](cpu, memory);
  if (!condition) {
    return 12;
  }
  return 24;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalDD(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xdd](cpu, memory);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SBCAid8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xde](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi18Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xdf](cpu, memory);
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHa8mAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe0](cpu, memory);
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function POPIntoHLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe1](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDCmAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe2](cpu, memory);
  return 8;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalE3(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe3](cpu, memory);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalE4(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe4](cpu, memory);
  return 4;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterHLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe5](cpu, memory);
  return 16;
}

/**
 * Logical AND.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ANDd8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe6](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi20Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe7](cpu, memory);
  return 16;
}

/**
 * Add.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ADDSPir8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe8](cpu, memory);
  return 16;
}

/**
 * Jump to the absolute address.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function JPHL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe9](cpu, memory);
  return 4;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDa16mAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xea](cpu, memory);
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalEB(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xeb](cpu, memory);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalEC(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xec](cpu, memory);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalED(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xed](cpu, memory);
  return 4;
}

/**
 * Logical XOR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function XORd8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xee](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi28Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xef](cpu, memory);
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDHAia8m(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf0](cpu, memory);
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function POPIntoAFi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf1](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAiCm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf2](cpu, memory);
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function DI(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf3](cpu, memory);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalF4(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf4](cpu, memory);
  return 4;
}

/**
 * Push to the stack memory, data from the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function PUSHRegisterAFi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf5](cpu, memory);
  return 16;
}

/**
 * Logical OR.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function ORd8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf6](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi30Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf7](cpu, memory);
  return 16;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function LDHLiSPIncri(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf8](cpu, memory);
  return 12;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDSPiHLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf9](cpu, memory);
  return 8;
}

/**
 * Load data into the register.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function LDAia16m(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfa](cpu, memory);
  return 16;
}

/**
 * Enables interrupt handling.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function EI(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfb](cpu, memory);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalFC(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfc](cpu, memory);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function IllegalFD(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfd](cpu, memory);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function CPd8i(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfe](cpu, memory);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RSTAi38Hi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xff](cpu, memory);
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x00](cpu, memory);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x01](cpu, memory);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x02](cpu, memory);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x03](cpu, memory);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x04](cpu, memory);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x05](cpu, memory);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x06](cpu, memory);
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x07](cpu, memory);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x08](cpu, memory);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x09](cpu, memory);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0a](cpu, memory);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0b](cpu, memory);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0c](cpu, memory);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0d](cpu, memory);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0e](cpu, memory);
  return 16;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x0f](cpu, memory);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x10](cpu, memory);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x11](cpu, memory);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x12](cpu, memory);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x13](cpu, memory);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x14](cpu, memory);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x15](cpu, memory);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x16](cpu, memory);
  return 16;
}

/**
 * Rotate n left through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RLAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x17](cpu, memory);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x18](cpu, memory);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x19](cpu, memory);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1a](cpu, memory);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RREi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1b](cpu, memory);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1c](cpu, memory);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1d](cpu, memory);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1e](cpu, memory);
  return 16;
}

/**
 * Rotate n right through Carry flag.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function RRAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x1f](cpu, memory);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLABi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x20](cpu, memory);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLACi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x21](cpu, memory);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLADi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x22](cpu, memory);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x23](cpu, memory);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x24](cpu, memory);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLALi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x25](cpu, memory);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x26](cpu, memory);
  return 16;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SLAAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x27](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRABi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x28](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRACi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x29](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRADi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2a](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2b](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2c](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRALi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2d](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2e](cpu, memory);
  return 16;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRAAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x2f](cpu, memory);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x30](cpu, memory);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x31](cpu, memory);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x32](cpu, memory);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x33](cpu, memory);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x34](cpu, memory);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x35](cpu, memory);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x36](cpu, memory);
  return 16;
}

/**
 * Swap upper and lower nibbles.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SWAPAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x37](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x38](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x39](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3a](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3b](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3c](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3d](cpu, memory);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3e](cpu, memory);
  return 16;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H, C
 */
function SRLAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x3f](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x40](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x41](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x42](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x43](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x44](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x45](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x46](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT0iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x47](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x48](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x49](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4a](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4b](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4c](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4d](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4e](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT1iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x4f](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x50](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x51](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x52](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x53](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x54](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x55](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x56](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT2iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x57](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x58](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x59](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5a](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5b](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5c](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5d](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5e](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT3iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x5f](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x60](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x61](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x62](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x63](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x64](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x65](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x66](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT4iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x67](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x68](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x69](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6a](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6b](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6c](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6d](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6e](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT5iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x6f](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x70](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x71](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x72](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x73](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x74](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x75](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x76](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT6iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x77](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iBi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x78](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iCi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x79](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iDi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7a](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iEi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7b](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iHi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7c](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iLi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7d](cpu, memory);
  return 8;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iHLm(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7e](cpu, memory);
  return 12;
}

/**
 * Test bit in register
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags: Z, N, H
 */
function BIT7iAi(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x7f](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x80](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x81](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x82](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x83](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x84](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x85](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x86](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES0A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x87](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x88](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x89](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8a](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8b](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8c](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8d](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8e](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES1A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x8f](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x90](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x91](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x92](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x93](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x94](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x95](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x96](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES2A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x97](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x98](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x99](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9a](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9b](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9c](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9d](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9e](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES3A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0x9f](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa0](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa1](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa2](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa3](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa4](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa5](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa6](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES4A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa7](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa8](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xa9](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xaa](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xab](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xac](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xad](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xae](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES5A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xaf](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb0](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb1](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb2](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb3](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb4](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb5](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb6](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES6A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb7](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb8](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xb9](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xba](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbb](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbc](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbd](cpu, memory);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbe](cpu, memory);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function RES7A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xbf](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc0](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc1](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc2](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc3](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc4](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc5](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc6](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET0A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc7](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc8](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xc9](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xca](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xcb](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xcc](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xcd](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xce](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET1A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xcf](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd0](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd1](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd2](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd3](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd4](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd5](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd6](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET2A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd7](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd8](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xd9](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xda](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xdb](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xdc](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xdd](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xde](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET3A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xdf](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe0](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe1](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe2](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe3](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe4](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe5](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe6](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET4A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe7](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe8](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xe9](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xea](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xeb](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xec](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xed](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xee](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET5A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xef](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf0](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf1](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf2](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf3](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf4](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf5](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf6](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET6A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf7](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7B(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf8](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7C(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xf9](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7D(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfa](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7E(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfb](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7H(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfc](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7L(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfd](cpu, memory);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7HL(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xfe](cpu, memory);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - None
 * @returns {byte} - The number of system clock ticks required.
 * Affected flags:
 */
function SET7A(cpu: CPU, memory: Memory): byte {
  OpcodeMap[0xff](cpu, memory);
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
