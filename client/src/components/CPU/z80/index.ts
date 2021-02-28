import { OpcodeMap } from './Map';
import CPU from '../';

/**
 * No operation.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function NOP(this: CPU): number {
  OpcodeMap['0x00'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_BC_i_from_d16_i(this: CPU): number {
  OpcodeMap['0x01'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_BC_m_from_A_i(this: CPU): number {
  OpcodeMap['0x02'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function INC_BC_i(this: CPU): number {
  OpcodeMap['0x03'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_B_i(this: CPU): number {
  OpcodeMap['0x04'].call(this);
  return 4;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_B_i(this: CPU): number {
  OpcodeMap['0x05'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_d8_i(this: CPU): number {
  OpcodeMap['0x06'].call(this);
  return 8;
}

/**
 * Rotate A left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLCA(this: CPU): number {
  OpcodeMap['0x07'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_a16_m_from_SP_i(this: CPU): number {
  OpcodeMap['0x08'].call(this);
  return 20;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
function ADD_into_HL_i_from_BC_i(this: CPU): number {
  OpcodeMap['0x09'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_BC_m(this: CPU): number {
  OpcodeMap['0x0a'].call(this);
  return 8;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function DEC_BC_i(this: CPU): number {
  OpcodeMap['0x0b'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_C_i(this: CPU): number {
  OpcodeMap['0x0c'].call(this);
  return 4;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_C_i(this: CPU): number {
  OpcodeMap['0x0d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_d8_i(this: CPU): number {
  OpcodeMap['0x0e'].call(this);
  return 8;
}

/**
 * Rotate A right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRCA(this: CPU): number {
  OpcodeMap['0x0f'].call(this);
  return 4;
}

/**
 *  Halt CPU & LCD display until button pressed.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function STOP(this: CPU): number {
  OpcodeMap['0x10'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_DE_i_from_d16_i(this: CPU): number {
  OpcodeMap['0x11'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_DE_m_from_A_i(this: CPU): number {
  OpcodeMap['0x12'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function INC_DE_i(this: CPU): number {
  OpcodeMap['0x13'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_D_i(this: CPU): number {
  OpcodeMap['0x14'].call(this);
  return 4;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_D_i(this: CPU): number {
  OpcodeMap['0x15'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_d8_i(this: CPU): number {
  OpcodeMap['0x16'].call(this);
  return 8;
}

/**
 * Rotate A left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLA(this: CPU): number {
  OpcodeMap['0x17'].call(this);
  return 4;
}

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JR_r8(this: CPU): number {
  OpcodeMap['0x18'].call(this);
  return 12;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
function ADD_into_HL_i_from_DE_i(this: CPU): number {
  OpcodeMap['0x19'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_DE_m(this: CPU): number {
  OpcodeMap['0x1a'].call(this);
  return 8;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function DEC_DE_i(this: CPU): number {
  OpcodeMap['0x1b'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_E_i(this: CPU): number {
  OpcodeMap['0x1c'].call(this);
  return 4;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_E_i(this: CPU): number {
  OpcodeMap['0x1d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_d8_i(this: CPU): number {
  OpcodeMap['0x1e'].call(this);
  return 8;
}

/**
 * Rotate A right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRA(this: CPU): number {
  OpcodeMap['0x1f'].call(this);
  return 4;
}

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JR_C_NZ_r8(this: CPU): number {
  let condition: boolean = OpcodeMap['0x20'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(2);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_i_from_d16_i(this: CPU): number {
  OpcodeMap['0x21'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_incr_m_from_A_i(this: CPU): number {
  OpcodeMap['0x22'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function INC_HL_i(this: CPU): number {
  OpcodeMap['0x23'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_H_i(this: CPU): number {
  OpcodeMap['0x24'].call(this);
  return 4;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_H_i(this: CPU): number {
  OpcodeMap['0x25'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_d8_i(this: CPU): number {
  OpcodeMap['0x26'].call(this);
  return 8;
}

/**
 * Decimal adjust register A.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, H, C
 */
function DAA_A(this: CPU): number {
  OpcodeMap['0x27'].call(this);
  return 4;
}

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JR_C_Z_r8(this: CPU): number {
  let condition: boolean = OpcodeMap['0x28'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(2);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 12;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
function ADD_into_HL_i_from_HL_i(this: CPU): number {
  OpcodeMap['0x29'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_HL_incr_m(this: CPU): number {
  OpcodeMap['0x2a'].call(this);
  return 8;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function DEC_HL_i(this: CPU): number {
  OpcodeMap['0x2b'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_L_i(this: CPU): number {
  OpcodeMap['0x2c'].call(this);
  return 4;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_L_i(this: CPU): number {
  OpcodeMap['0x2d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_d8_i(this: CPU): number {
  OpcodeMap['0x2e'].call(this);
  return 8;
}

/**
 * Complement A register. (Flip all bits.)
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H
 */
function CPL_A(this: CPU): number {
  OpcodeMap['0x2f'].call(this);
  return 4;
}

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JR_C_NC_r8(this: CPU): number {
  let condition: boolean = OpcodeMap['0x30'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(2);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_SP_i_from_d16_i(this: CPU): number {
  OpcodeMap['0x31'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_decr_m_from_A_i(this: CPU): number {
  OpcodeMap['0x32'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function INC_SP_i(this: CPU): number {
  OpcodeMap['0x33'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_HL_m(this: CPU): number {
  OpcodeMap['0x34'].call(this);
  return 12;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_HL_m(this: CPU): number {
  OpcodeMap['0x35'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_d8_i(this: CPU): number {
  OpcodeMap['0x36'].call(this);
  return 12;
}

/**
 *  Set Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
function SCF(this: CPU): number {
  OpcodeMap['0x37'].call(this);
  return 4;
}

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JR_C_C_r8(this: CPU): number {
  let condition: boolean = OpcodeMap['0x38'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(2);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 12;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
function ADD_into_HL_i_from_SP_i(this: CPU): number {
  OpcodeMap['0x39'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_HL_decr_m(this: CPU): number {
  OpcodeMap['0x3a'].call(this);
  return 8;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function DEC_SP_i(this: CPU): number {
  OpcodeMap['0x3b'].call(this);
  return 8;
}

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function INC_A_i(this: CPU): number {
  OpcodeMap['0x3c'].call(this);
  return 4;
}

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function DEC_A_i(this: CPU): number {
  OpcodeMap['0x3d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_d8_i(this: CPU): number {
  OpcodeMap['0x3e'].call(this);
  return 8;
}

/**
 * Complement carry flag.
 * If C flag is set, then reset it.
 * If C flag is reset, then set it.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
function CCF(this: CPU): number {
  OpcodeMap['0x3f'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_B_i(this: CPU): number {
  OpcodeMap['0x40'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_C_i(this: CPU): number {
  OpcodeMap['0x41'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_D_i(this: CPU): number {
  OpcodeMap['0x42'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_E_i(this: CPU): number {
  OpcodeMap['0x43'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_H_i(this: CPU): number {
  OpcodeMap['0x44'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_L_i(this: CPU): number {
  OpcodeMap['0x45'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x46'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_B_i_from_A_i(this: CPU): number {
  OpcodeMap['0x47'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_B_i(this: CPU): number {
  OpcodeMap['0x48'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_C_i(this: CPU): number {
  OpcodeMap['0x49'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_D_i(this: CPU): number {
  OpcodeMap['0x4a'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_E_i(this: CPU): number {
  OpcodeMap['0x4b'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_H_i(this: CPU): number {
  OpcodeMap['0x4c'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_L_i(this: CPU): number {
  OpcodeMap['0x4d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x4e'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_i_from_A_i(this: CPU): number {
  OpcodeMap['0x4f'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_B_i(this: CPU): number {
  OpcodeMap['0x50'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_C_i(this: CPU): number {
  OpcodeMap['0x51'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_D_i(this: CPU): number {
  OpcodeMap['0x52'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_E_i(this: CPU): number {
  OpcodeMap['0x53'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_H_i(this: CPU): number {
  OpcodeMap['0x54'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_L_i(this: CPU): number {
  OpcodeMap['0x55'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x56'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_D_i_from_A_i(this: CPU): number {
  OpcodeMap['0x57'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_B_i(this: CPU): number {
  OpcodeMap['0x58'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_C_i(this: CPU): number {
  OpcodeMap['0x59'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_D_i(this: CPU): number {
  OpcodeMap['0x5a'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_E_i(this: CPU): number {
  OpcodeMap['0x5b'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_H_i(this: CPU): number {
  OpcodeMap['0x5c'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_L_i(this: CPU): number {
  OpcodeMap['0x5d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x5e'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_E_i_from_A_i(this: CPU): number {
  OpcodeMap['0x5f'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_B_i(this: CPU): number {
  OpcodeMap['0x60'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_C_i(this: CPU): number {
  OpcodeMap['0x61'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_D_i(this: CPU): number {
  OpcodeMap['0x62'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_E_i(this: CPU): number {
  OpcodeMap['0x63'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_H_i(this: CPU): number {
  OpcodeMap['0x64'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_L_i(this: CPU): number {
  OpcodeMap['0x65'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x66'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_H_i_from_A_i(this: CPU): number {
  OpcodeMap['0x67'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_B_i(this: CPU): number {
  OpcodeMap['0x68'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_C_i(this: CPU): number {
  OpcodeMap['0x69'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_D_i(this: CPU): number {
  OpcodeMap['0x6a'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_E_i(this: CPU): number {
  OpcodeMap['0x6b'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_H_i(this: CPU): number {
  OpcodeMap['0x6c'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_L_i(this: CPU): number {
  OpcodeMap['0x6d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x6e'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_L_i_from_A_i(this: CPU): number {
  OpcodeMap['0x6f'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_B_i(this: CPU): number {
  OpcodeMap['0x70'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_C_i(this: CPU): number {
  OpcodeMap['0x71'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_D_i(this: CPU): number {
  OpcodeMap['0x72'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_E_i(this: CPU): number {
  OpcodeMap['0x73'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_H_i(this: CPU): number {
  OpcodeMap['0x74'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_L_i(this: CPU): number {
  OpcodeMap['0x75'].call(this);
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function HALT(this: CPU): number {
  OpcodeMap['0x76'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_HL_m_from_A_i(this: CPU): number {
  OpcodeMap['0x77'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_B_i(this: CPU): number {
  OpcodeMap['0x78'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_C_i(this: CPU): number {
  OpcodeMap['0x79'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_D_i(this: CPU): number {
  OpcodeMap['0x7a'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_E_i(this: CPU): number {
  OpcodeMap['0x7b'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_H_i(this: CPU): number {
  OpcodeMap['0x7c'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_L_i(this: CPU): number {
  OpcodeMap['0x7d'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x7e'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_A_i(this: CPU): number {
  OpcodeMap['0x7f'].call(this);
  return 4;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_B_i(this: CPU): number {
  OpcodeMap['0x80'].call(this);
  return 4;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_C_i(this: CPU): number {
  OpcodeMap['0x81'].call(this);
  return 4;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_D_i(this: CPU): number {
  OpcodeMap['0x82'].call(this);
  return 4;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_E_i(this: CPU): number {
  OpcodeMap['0x83'].call(this);
  return 4;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_H_i(this: CPU): number {
  OpcodeMap['0x84'].call(this);
  return 4;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_L_i(this: CPU): number {
  OpcodeMap['0x85'].call(this);
  return 4;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x86'].call(this);
  return 8;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_A_i(this: CPU): number {
  OpcodeMap['0x87'].call(this);
  return 4;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_B_i(this: CPU): number {
  OpcodeMap['0x88'].call(this);
  return 4;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_C_i(this: CPU): number {
  OpcodeMap['0x89'].call(this);
  return 4;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_D_i(this: CPU): number {
  OpcodeMap['0x8a'].call(this);
  return 4;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_E_i(this: CPU): number {
  OpcodeMap['0x8b'].call(this);
  return 4;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_H_i(this: CPU): number {
  OpcodeMap['0x8c'].call(this);
  return 4;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_L_i(this: CPU): number {
  OpcodeMap['0x8d'].call(this);
  return 4;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_HL_m(this: CPU): number {
  OpcodeMap['0x8e'].call(this);
  return 8;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_A_i(this: CPU): number {
  OpcodeMap['0x8f'].call(this);
  return 4;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_B_i(this: CPU): number {
  OpcodeMap['0x90'].call(this);
  return 4;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_C_i(this: CPU): number {
  OpcodeMap['0x91'].call(this);
  return 4;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_D_i(this: CPU): number {
  OpcodeMap['0x92'].call(this);
  return 4;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_E_i(this: CPU): number {
  OpcodeMap['0x93'].call(this);
  return 4;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_H_i(this: CPU): number {
  OpcodeMap['0x94'].call(this);
  return 4;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_L_i(this: CPU): number {
  OpcodeMap['0x95'].call(this);
  return 4;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_HL_m(this: CPU): number {
  OpcodeMap['0x96'].call(this);
  return 8;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_A_i(this: CPU): number {
  OpcodeMap['0x97'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_B_i(this: CPU): number {
  OpcodeMap['0x98'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_C_i(this: CPU): number {
  OpcodeMap['0x99'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_D_i(this: CPU): number {
  OpcodeMap['0x9a'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_E_i(this: CPU): number {
  OpcodeMap['0x9b'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_H_i(this: CPU): number {
  OpcodeMap['0x9c'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_L_i(this: CPU): number {
  OpcodeMap['0x9d'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_HL_m(this: CPU): number {
  OpcodeMap['0x9e'].call(this);
  return 8;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_A_i(this: CPU): number {
  OpcodeMap['0x9f'].call(this);
  return 4;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_B_i(this: CPU): number {
  OpcodeMap['0xa0'].call(this);
  return 4;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_C_i(this: CPU): number {
  OpcodeMap['0xa1'].call(this);
  return 4;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_D_i(this: CPU): number {
  OpcodeMap['0xa2'].call(this);
  return 4;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_E_i(this: CPU): number {
  OpcodeMap['0xa3'].call(this);
  return 4;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_H_i(this: CPU): number {
  OpcodeMap['0xa4'].call(this);
  return 4;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_L_i(this: CPU): number {
  OpcodeMap['0xa5'].call(this);
  return 4;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_HL_m(this: CPU): number {
  OpcodeMap['0xa6'].call(this);
  return 8;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_A_i(this: CPU): number {
  OpcodeMap['0xa7'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_B_i(this: CPU): number {
  OpcodeMap['0xa8'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_C_i(this: CPU): number {
  OpcodeMap['0xa9'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_D_i(this: CPU): number {
  OpcodeMap['0xaa'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_E_i(this: CPU): number {
  OpcodeMap['0xab'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_H_i(this: CPU): number {
  OpcodeMap['0xac'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_L_i(this: CPU): number {
  OpcodeMap['0xad'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_HL_m(this: CPU): number {
  OpcodeMap['0xae'].call(this);
  return 8;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_A_i(this: CPU): number {
  OpcodeMap['0xaf'].call(this);
  return 4;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_B_i(this: CPU): number {
  OpcodeMap['0xb0'].call(this);
  return 4;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_C_i(this: CPU): number {
  OpcodeMap['0xb1'].call(this);
  return 4;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_D_i(this: CPU): number {
  OpcodeMap['0xb2'].call(this);
  return 4;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_E_i(this: CPU): number {
  OpcodeMap['0xb3'].call(this);
  return 4;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_H_i(this: CPU): number {
  OpcodeMap['0xb4'].call(this);
  return 4;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_L_i(this: CPU): number {
  OpcodeMap['0xb5'].call(this);
  return 4;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_HL_m(this: CPU): number {
  OpcodeMap['0xb6'].call(this);
  return 8;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_A_i(this: CPU): number {
  OpcodeMap['0xb7'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_B_i(this: CPU): number {
  OpcodeMap['0xb8'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_C_i(this: CPU): number {
  OpcodeMap['0xb9'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_D_i(this: CPU): number {
  OpcodeMap['0xba'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_E_i(this: CPU): number {
  OpcodeMap['0xbb'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_H_i(this: CPU): number {
  OpcodeMap['0xbc'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_L_i(this: CPU): number {
  OpcodeMap['0xbd'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_HL_m(this: CPU): number {
  OpcodeMap['0xbe'].call(this);
  return 8;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_A_i(this: CPU): number {
  OpcodeMap['0xbf'].call(this);
  return 4;
}

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RET_C_NZ(this: CPU): number {
  let condition: boolean = OpcodeMap['0xc0'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(1);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 20;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function POP_off_SP_into_BC_i(this: CPU): number {
  OpcodeMap['0xc1'].call(this);
  return 12;
}

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JP_C_NZ_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xc2'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 16;
}

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JP_a16(this: CPU): number {
  OpcodeMap['0xc3'].call(this);
  return 16;
}

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function CALL_C_NZ_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xc4'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 24;
}

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function PUSH_onto_SP_register_BC_i(this: CPU): number {
  OpcodeMap['0xc5'].call(this);
  return 16;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_A_i_from_d8_i(this: CPU): number {
  OpcodeMap['0xc6'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_00H_i(this: CPU): number {
  OpcodeMap['0xc7'].call(this);
  return 16;
}

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RET_C_Z(this: CPU): number {
  let condition: boolean = OpcodeMap['0xc8'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(1);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 20;
}

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RET(this: CPU): number {
  OpcodeMap['0xc9'].call(this);
  return 16;
}

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JP_C_Z_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xca'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 16;
}

/**
 * Execute a CB-prefixed instruction.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function PREFIX(this: CPU): number {
  OpcodeMap['0xcb'].call(this);
  return 4;
}

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function CALL_C_Z_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xcc'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 24;
}

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function CALL(this: CPU): number {
  OpcodeMap['0xcd'].call(this);
  return 24;
}

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADC_into_A_i_from_d8_i(this: CPU): number {
  OpcodeMap['0xce'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_08H_i(this: CPU): number {
  OpcodeMap['0xcf'].call(this);
  return 16;
}

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RET_C_NC(this: CPU): number {
  let condition: boolean = OpcodeMap['0xd0'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(1);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 20;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function POP_off_SP_into_DE_i(this: CPU): number {
  OpcodeMap['0xd1'].call(this);
  return 12;
}

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JP_C_NC_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xd2'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_D3(this: CPU): number {
  OpcodeMap['0xd3'].call(this);
  return 4;
}

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function CALL_C_NC_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xd4'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 24;
}

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function PUSH_onto_SP_register_DE_i(this: CPU): number {
  OpcodeMap['0xd5'].call(this);
  return 16;
}

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SUB_from_A_i_value_d8_i(this: CPU): number {
  OpcodeMap['0xd6'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_10H_i(this: CPU): number {
  OpcodeMap['0xd7'].call(this);
  return 16;
}

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RET_C_C(this: CPU): number {
  let condition: boolean = OpcodeMap['0xd8'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(1);
    return 8;
  }
  // if condition passed, elapse larger number of m cycles
  return 20;
}

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RETI(this: CPU): number {
  OpcodeMap['0xd9'].call(this);
  return 16;
}

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JP_C_C_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xda'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_DB(this: CPU): number {
  OpcodeMap['0xdb'].call(this);
  return 4;
}

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function CALL_C_C_a16(this: CPU): number {
  let condition: boolean = OpcodeMap['0xdc'].call(this);
  if (!condition) {
    // add the default increment to PC
    this.PC.add(3);
    return 12;
  }
  // if condition passed, elapse larger number of m cycles
  return 24;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_DD(this: CPU): number {
  OpcodeMap['0xdd'].call(this);
  return 4;
}

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SBC_from_A_i_value_d8_i(this: CPU): number {
  OpcodeMap['0xde'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_18H_i(this: CPU): number {
  OpcodeMap['0xdf'].call(this);
  return 16;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LDH_into_a8_m_from_A_i(this: CPU): number {
  OpcodeMap['0xe0'].call(this);
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function POP_off_SP_into_HL_i(this: CPU): number {
  OpcodeMap['0xe1'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_C_m_from_A_i(this: CPU): number {
  OpcodeMap['0xe2'].call(this);
  return 8;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_E3(this: CPU): number {
  OpcodeMap['0xe3'].call(this);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_E4(this: CPU): number {
  OpcodeMap['0xe4'].call(this);
  return 4;
}

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function PUSH_onto_SP_register_HL_i(this: CPU): number {
  OpcodeMap['0xe5'].call(this);
  return 16;
}

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function AND_A_with_d8_i(this: CPU): number {
  OpcodeMap['0xe6'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_20H_i(this: CPU): number {
  OpcodeMap['0xe7'].call(this);
  return 16;
}

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function ADD_into_SP_i_from_r8_i(this: CPU): number {
  OpcodeMap['0xe8'].call(this);
  return 16;
}

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function JP_HL(this: CPU): number {
  OpcodeMap['0xe9'].call(this);
  return 4;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_a16_m_from_A_i(this: CPU): number {
  OpcodeMap['0xea'].call(this);
  return 16;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_EB(this: CPU): number {
  OpcodeMap['0xeb'].call(this);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_EC(this: CPU): number {
  OpcodeMap['0xec'].call(this);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_ED(this: CPU): number {
  OpcodeMap['0xed'].call(this);
  return 4;
}

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function XOR_A_with_d8_i(this: CPU): number {
  OpcodeMap['0xee'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_28H_i(this: CPU): number {
  OpcodeMap['0xef'].call(this);
  return 16;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LDH_into_A_i_from_a8_m(this: CPU): number {
  OpcodeMap['0xf0'].call(this);
  return 12;
}

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function POP_off_SP_into_AF_i(this: CPU): number {
  OpcodeMap['0xf1'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_C_m(this: CPU): number {
  OpcodeMap['0xf2'].call(this);
  return 8;
}

/**
 * Disables interrupt handling.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function DI(this: CPU): number {
  OpcodeMap['0xf3'].call(this);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_F4(this: CPU): number {
  OpcodeMap['0xf4'].call(this);
  return 4;
}

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function PUSH_onto_SP_register_AF_i(this: CPU): number {
  OpcodeMap['0xf5'].call(this);
  return 16;
}

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function OR_A_with_d8_i(this: CPU): number {
  OpcodeMap['0xf6'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_30H_i(this: CPU): number {
  OpcodeMap['0xf7'].call(this);
  return 16;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function LD_into_HL_i_from_SP_incr_i(this: CPU): number {
  OpcodeMap['0xf8'].call(this);
  return 12;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_SP_i_from_HL_i(this: CPU): number {
  OpcodeMap['0xf9'].call(this);
  return 8;
}

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function LD_into_A_i_from_a16_m(this: CPU): number {
  OpcodeMap['0xfa'].call(this);
  return 16;
}

/**
 * Enables interrupt handling.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function EI(this: CPU): number {
  OpcodeMap['0xfb'].call(this);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_FC(this: CPU): number {
  OpcodeMap['0xfc'].call(this);
  return 4;
}

/**
 * Invalid opcode.
 * Affected flags:
 */
function ILLEGAL_FD(this: CPU): number {
  OpcodeMap['0xfd'].call(this);
  return 4;
}

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function CP_A_with_d8_i(this: CPU): number {
  OpcodeMap['0xfe'].call(this);
  return 8;
}

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RST_to_A_i_from_38H_i(this: CPU): number {
  OpcodeMap['0xff'].call(this);
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_B_i(this: CPU): number {
  OpcodeMap['0x00'].call(this);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_C_i(this: CPU): number {
  OpcodeMap['0x01'].call(this);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_D_i(this: CPU): number {
  OpcodeMap['0x02'].call(this);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_E_i(this: CPU): number {
  OpcodeMap['0x03'].call(this);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_H_i(this: CPU): number {
  OpcodeMap['0x04'].call(this);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_L_i(this: CPU): number {
  OpcodeMap['0x05'].call(this);
  return 8;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_HL_m(this: CPU): number {
  OpcodeMap['0x06'].call(this);
  return 16;
}

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RLC_A_i(this: CPU): number {
  OpcodeMap['0x07'].call(this);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_B_i(this: CPU): number {
  OpcodeMap['0x08'].call(this);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_C_i(this: CPU): number {
  OpcodeMap['0x09'].call(this);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_D_i(this: CPU): number {
  OpcodeMap['0x0a'].call(this);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_E_i(this: CPU): number {
  OpcodeMap['0x0b'].call(this);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_H_i(this: CPU): number {
  OpcodeMap['0x0c'].call(this);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_L_i(this: CPU): number {
  OpcodeMap['0x0d'].call(this);
  return 8;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_HL_m(this: CPU): number {
  OpcodeMap['0x0e'].call(this);
  return 16;
}

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RRC_A_i(this: CPU): number {
  OpcodeMap['0x0f'].call(this);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_B_i(this: CPU): number {
  OpcodeMap['0x10'].call(this);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_C_i(this: CPU): number {
  OpcodeMap['0x11'].call(this);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_D_i(this: CPU): number {
  OpcodeMap['0x12'].call(this);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_E_i(this: CPU): number {
  OpcodeMap['0x13'].call(this);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_H_i(this: CPU): number {
  OpcodeMap['0x14'].call(this);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_L_i(this: CPU): number {
  OpcodeMap['0x15'].call(this);
  return 8;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_HL_m(this: CPU): number {
  OpcodeMap['0x16'].call(this);
  return 16;
}

/**
 * Rotate n left through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RL_A_i(this: CPU): number {
  OpcodeMap['0x17'].call(this);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_B_i(this: CPU): number {
  OpcodeMap['0x18'].call(this);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_C_i(this: CPU): number {
  OpcodeMap['0x19'].call(this);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_D_i(this: CPU): number {
  OpcodeMap['0x1a'].call(this);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_E_i(this: CPU): number {
  OpcodeMap['0x1b'].call(this);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_H_i(this: CPU): number {
  OpcodeMap['0x1c'].call(this);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_L_i(this: CPU): number {
  OpcodeMap['0x1d'].call(this);
  return 8;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_HL_m(this: CPU): number {
  OpcodeMap['0x1e'].call(this);
  return 16;
}

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function RR_A_i(this: CPU): number {
  OpcodeMap['0x1f'].call(this);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_B_i(this: CPU): number {
  OpcodeMap['0x20'].call(this);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_C_i(this: CPU): number {
  OpcodeMap['0x21'].call(this);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_D_i(this: CPU): number {
  OpcodeMap['0x22'].call(this);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_E_i(this: CPU): number {
  OpcodeMap['0x23'].call(this);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_H_i(this: CPU): number {
  OpcodeMap['0x24'].call(this);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_L_i(this: CPU): number {
  OpcodeMap['0x25'].call(this);
  return 8;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_HL_m(this: CPU): number {
  OpcodeMap['0x26'].call(this);
  return 16;
}

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SLA_A_i(this: CPU): number {
  OpcodeMap['0x27'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_B_i(this: CPU): number {
  OpcodeMap['0x28'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_C_i(this: CPU): number {
  OpcodeMap['0x29'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_D_i(this: CPU): number {
  OpcodeMap['0x2a'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_E_i(this: CPU): number {
  OpcodeMap['0x2b'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_H_i(this: CPU): number {
  OpcodeMap['0x2c'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_L_i(this: CPU): number {
  OpcodeMap['0x2d'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_HL_m(this: CPU): number {
  OpcodeMap['0x2e'].call(this);
  return 16;
}

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRA_A_i(this: CPU): number {
  OpcodeMap['0x2f'].call(this);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_B_i(this: CPU): number {
  OpcodeMap['0x30'].call(this);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_C_i(this: CPU): number {
  OpcodeMap['0x31'].call(this);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_D_i(this: CPU): number {
  OpcodeMap['0x32'].call(this);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_E_i(this: CPU): number {
  OpcodeMap['0x33'].call(this);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_H_i(this: CPU): number {
  OpcodeMap['0x34'].call(this);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_L_i(this: CPU): number {
  OpcodeMap['0x35'].call(this);
  return 8;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_HL_m(this: CPU): number {
  OpcodeMap['0x36'].call(this);
  return 16;
}

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SWAP_A_i(this: CPU): number {
  OpcodeMap['0x37'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_B_i(this: CPU): number {
  OpcodeMap['0x38'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_C_i(this: CPU): number {
  OpcodeMap['0x39'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_D_i(this: CPU): number {
  OpcodeMap['0x3a'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_E_i(this: CPU): number {
  OpcodeMap['0x3b'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_H_i(this: CPU): number {
  OpcodeMap['0x3c'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_L_i(this: CPU): number {
  OpcodeMap['0x3d'].call(this);
  return 8;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_HL_m(this: CPU): number {
  OpcodeMap['0x3e'].call(this);
  return 16;
}

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
function SRL_A_i(this: CPU): number {
  OpcodeMap['0x3f'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_B_i(this: CPU): number {
  OpcodeMap['0x40'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_C_i(this: CPU): number {
  OpcodeMap['0x41'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_D_i(this: CPU): number {
  OpcodeMap['0x42'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_E_i(this: CPU): number {
  OpcodeMap['0x43'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_H_i(this: CPU): number {
  OpcodeMap['0x44'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_L_i(this: CPU): number {
  OpcodeMap['0x45'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x46'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_0_i_of_A_i(this: CPU): number {
  OpcodeMap['0x47'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_B_i(this: CPU): number {
  OpcodeMap['0x48'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_C_i(this: CPU): number {
  OpcodeMap['0x49'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_D_i(this: CPU): number {
  OpcodeMap['0x4a'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_E_i(this: CPU): number {
  OpcodeMap['0x4b'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_H_i(this: CPU): number {
  OpcodeMap['0x4c'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_L_i(this: CPU): number {
  OpcodeMap['0x4d'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x4e'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_1_i_of_A_i(this: CPU): number {
  OpcodeMap['0x4f'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_B_i(this: CPU): number {
  OpcodeMap['0x50'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_C_i(this: CPU): number {
  OpcodeMap['0x51'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_D_i(this: CPU): number {
  OpcodeMap['0x52'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_E_i(this: CPU): number {
  OpcodeMap['0x53'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_H_i(this: CPU): number {
  OpcodeMap['0x54'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_L_i(this: CPU): number {
  OpcodeMap['0x55'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x56'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_2_i_of_A_i(this: CPU): number {
  OpcodeMap['0x57'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_B_i(this: CPU): number {
  OpcodeMap['0x58'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_C_i(this: CPU): number {
  OpcodeMap['0x59'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_D_i(this: CPU): number {
  OpcodeMap['0x5a'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_E_i(this: CPU): number {
  OpcodeMap['0x5b'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_H_i(this: CPU): number {
  OpcodeMap['0x5c'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_L_i(this: CPU): number {
  OpcodeMap['0x5d'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x5e'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_3_i_of_A_i(this: CPU): number {
  OpcodeMap['0x5f'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_B_i(this: CPU): number {
  OpcodeMap['0x60'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_C_i(this: CPU): number {
  OpcodeMap['0x61'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_D_i(this: CPU): number {
  OpcodeMap['0x62'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_E_i(this: CPU): number {
  OpcodeMap['0x63'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_H_i(this: CPU): number {
  OpcodeMap['0x64'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_L_i(this: CPU): number {
  OpcodeMap['0x65'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x66'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_4_i_of_A_i(this: CPU): number {
  OpcodeMap['0x67'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_B_i(this: CPU): number {
  OpcodeMap['0x68'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_C_i(this: CPU): number {
  OpcodeMap['0x69'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_D_i(this: CPU): number {
  OpcodeMap['0x6a'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_E_i(this: CPU): number {
  OpcodeMap['0x6b'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_H_i(this: CPU): number {
  OpcodeMap['0x6c'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_L_i(this: CPU): number {
  OpcodeMap['0x6d'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x6e'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_5_i_of_A_i(this: CPU): number {
  OpcodeMap['0x6f'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_B_i(this: CPU): number {
  OpcodeMap['0x70'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_C_i(this: CPU): number {
  OpcodeMap['0x71'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_D_i(this: CPU): number {
  OpcodeMap['0x72'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_E_i(this: CPU): number {
  OpcodeMap['0x73'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_H_i(this: CPU): number {
  OpcodeMap['0x74'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_L_i(this: CPU): number {
  OpcodeMap['0x75'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x76'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_6_i_of_A_i(this: CPU): number {
  OpcodeMap['0x77'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_B_i(this: CPU): number {
  OpcodeMap['0x78'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_C_i(this: CPU): number {
  OpcodeMap['0x79'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_D_i(this: CPU): number {
  OpcodeMap['0x7a'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_E_i(this: CPU): number {
  OpcodeMap['0x7b'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_H_i(this: CPU): number {
  OpcodeMap['0x7c'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_L_i(this: CPU): number {
  OpcodeMap['0x7d'].call(this);
  return 8;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_HL_m(this: CPU): number {
  OpcodeMap['0x7e'].call(this);
  return 12;
}

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
function BIT_test_7_i_of_A_i(this: CPU): number {
  OpcodeMap['0x7f'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_B(this: CPU): number {
  OpcodeMap['0x80'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_C(this: CPU): number {
  OpcodeMap['0x81'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_D(this: CPU): number {
  OpcodeMap['0x82'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_E(this: CPU): number {
  OpcodeMap['0x83'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_H(this: CPU): number {
  OpcodeMap['0x84'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_L(this: CPU): number {
  OpcodeMap['0x85'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_HL(this: CPU): number {
  OpcodeMap['0x86'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit0_of_A(this: CPU): number {
  OpcodeMap['0x87'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_B(this: CPU): number {
  OpcodeMap['0x88'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_C(this: CPU): number {
  OpcodeMap['0x89'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_D(this: CPU): number {
  OpcodeMap['0x8a'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_E(this: CPU): number {
  OpcodeMap['0x8b'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_H(this: CPU): number {
  OpcodeMap['0x8c'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_L(this: CPU): number {
  OpcodeMap['0x8d'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_HL(this: CPU): number {
  OpcodeMap['0x8e'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit1_of_A(this: CPU): number {
  OpcodeMap['0x8f'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_B(this: CPU): number {
  OpcodeMap['0x90'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_C(this: CPU): number {
  OpcodeMap['0x91'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_D(this: CPU): number {
  OpcodeMap['0x92'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_E(this: CPU): number {
  OpcodeMap['0x93'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_H(this: CPU): number {
  OpcodeMap['0x94'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_L(this: CPU): number {
  OpcodeMap['0x95'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_HL(this: CPU): number {
  OpcodeMap['0x96'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit2_of_A(this: CPU): number {
  OpcodeMap['0x97'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_B(this: CPU): number {
  OpcodeMap['0x98'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_C(this: CPU): number {
  OpcodeMap['0x99'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_D(this: CPU): number {
  OpcodeMap['0x9a'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_E(this: CPU): number {
  OpcodeMap['0x9b'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_H(this: CPU): number {
  OpcodeMap['0x9c'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_L(this: CPU): number {
  OpcodeMap['0x9d'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_HL(this: CPU): number {
  OpcodeMap['0x9e'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit3_of_A(this: CPU): number {
  OpcodeMap['0x9f'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_B(this: CPU): number {
  OpcodeMap['0xa0'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_C(this: CPU): number {
  OpcodeMap['0xa1'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_D(this: CPU): number {
  OpcodeMap['0xa2'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_E(this: CPU): number {
  OpcodeMap['0xa3'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_H(this: CPU): number {
  OpcodeMap['0xa4'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_L(this: CPU): number {
  OpcodeMap['0xa5'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_HL(this: CPU): number {
  OpcodeMap['0xa6'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit4_of_A(this: CPU): number {
  OpcodeMap['0xa7'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_B(this: CPU): number {
  OpcodeMap['0xa8'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_C(this: CPU): number {
  OpcodeMap['0xa9'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_D(this: CPU): number {
  OpcodeMap['0xaa'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_E(this: CPU): number {
  OpcodeMap['0xab'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_H(this: CPU): number {
  OpcodeMap['0xac'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_L(this: CPU): number {
  OpcodeMap['0xad'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_HL(this: CPU): number {
  OpcodeMap['0xae'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit5_of_A(this: CPU): number {
  OpcodeMap['0xaf'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_B(this: CPU): number {
  OpcodeMap['0xb0'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_C(this: CPU): number {
  OpcodeMap['0xb1'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_D(this: CPU): number {
  OpcodeMap['0xb2'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_E(this: CPU): number {
  OpcodeMap['0xb3'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_H(this: CPU): number {
  OpcodeMap['0xb4'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_L(this: CPU): number {
  OpcodeMap['0xb5'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_HL(this: CPU): number {
  OpcodeMap['0xb6'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit6_of_A(this: CPU): number {
  OpcodeMap['0xb7'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_B(this: CPU): number {
  OpcodeMap['0xb8'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_C(this: CPU): number {
  OpcodeMap['0xb9'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_D(this: CPU): number {
  OpcodeMap['0xba'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_E(this: CPU): number {
  OpcodeMap['0xbb'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_H(this: CPU): number {
  OpcodeMap['0xbc'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_L(this: CPU): number {
  OpcodeMap['0xbd'].call(this);
  return 8;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_HL(this: CPU): number {
  OpcodeMap['0xbe'].call(this);
  return 16;
}

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function RES_bit7_of_A(this: CPU): number {
  OpcodeMap['0xbf'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_B(this: CPU): number {
  OpcodeMap['0xc0'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_C(this: CPU): number {
  OpcodeMap['0xc1'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_D(this: CPU): number {
  OpcodeMap['0xc2'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_E(this: CPU): number {
  OpcodeMap['0xc3'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_H(this: CPU): number {
  OpcodeMap['0xc4'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_L(this: CPU): number {
  OpcodeMap['0xc5'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_HL(this: CPU): number {
  OpcodeMap['0xc6'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit0_of_A(this: CPU): number {
  OpcodeMap['0xc7'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_B(this: CPU): number {
  OpcodeMap['0xc8'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_C(this: CPU): number {
  OpcodeMap['0xc9'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_D(this: CPU): number {
  OpcodeMap['0xca'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_E(this: CPU): number {
  OpcodeMap['0xcb'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_H(this: CPU): number {
  OpcodeMap['0xcc'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_L(this: CPU): number {
  OpcodeMap['0xcd'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_HL(this: CPU): number {
  OpcodeMap['0xce'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit1_of_A(this: CPU): number {
  OpcodeMap['0xcf'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_B(this: CPU): number {
  OpcodeMap['0xd0'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_C(this: CPU): number {
  OpcodeMap['0xd1'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_D(this: CPU): number {
  OpcodeMap['0xd2'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_E(this: CPU): number {
  OpcodeMap['0xd3'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_H(this: CPU): number {
  OpcodeMap['0xd4'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_L(this: CPU): number {
  OpcodeMap['0xd5'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_HL(this: CPU): number {
  OpcodeMap['0xd6'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit2_of_A(this: CPU): number {
  OpcodeMap['0xd7'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_B(this: CPU): number {
  OpcodeMap['0xd8'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_C(this: CPU): number {
  OpcodeMap['0xd9'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_D(this: CPU): number {
  OpcodeMap['0xda'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_E(this: CPU): number {
  OpcodeMap['0xdb'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_H(this: CPU): number {
  OpcodeMap['0xdc'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_L(this: CPU): number {
  OpcodeMap['0xdd'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_HL(this: CPU): number {
  OpcodeMap['0xde'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit3_of_A(this: CPU): number {
  OpcodeMap['0xdf'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_B(this: CPU): number {
  OpcodeMap['0xe0'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_C(this: CPU): number {
  OpcodeMap['0xe1'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_D(this: CPU): number {
  OpcodeMap['0xe2'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_E(this: CPU): number {
  OpcodeMap['0xe3'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_H(this: CPU): number {
  OpcodeMap['0xe4'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_L(this: CPU): number {
  OpcodeMap['0xe5'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_HL(this: CPU): number {
  OpcodeMap['0xe6'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit4_of_A(this: CPU): number {
  OpcodeMap['0xe7'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_B(this: CPU): number {
  OpcodeMap['0xe8'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_C(this: CPU): number {
  OpcodeMap['0xe9'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_D(this: CPU): number {
  OpcodeMap['0xea'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_E(this: CPU): number {
  OpcodeMap['0xeb'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_H(this: CPU): number {
  OpcodeMap['0xec'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_L(this: CPU): number {
  OpcodeMap['0xed'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_HL(this: CPU): number {
  OpcodeMap['0xee'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit5_of_A(this: CPU): number {
  OpcodeMap['0xef'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_B(this: CPU): number {
  OpcodeMap['0xf0'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_C(this: CPU): number {
  OpcodeMap['0xf1'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_D(this: CPU): number {
  OpcodeMap['0xf2'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_E(this: CPU): number {
  OpcodeMap['0xf3'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_H(this: CPU): number {
  OpcodeMap['0xf4'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_L(this: CPU): number {
  OpcodeMap['0xf5'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_HL(this: CPU): number {
  OpcodeMap['0xf6'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit6_of_A(this: CPU): number {
  OpcodeMap['0xf7'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_B(this: CPU): number {
  OpcodeMap['0xf8'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_C(this: CPU): number {
  OpcodeMap['0xf9'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_D(this: CPU): number {
  OpcodeMap['0xfa'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_E(this: CPU): number {
  OpcodeMap['0xfb'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_H(this: CPU): number {
  OpcodeMap['0xfc'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_L(this: CPU): number {
  OpcodeMap['0xfd'].call(this);
  return 8;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_HL(this: CPU): number {
  OpcodeMap['0xfe'].call(this);
  return 16;
}

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
function SET_bit7_of_A(this: CPU): number {
  OpcodeMap['0xff'].call(this);
  return 8;
}

export default {
  0x00: NOP,
  0x01: LD_into_BC_i_from_d16_i,
  0x02: LD_into_BC_m_from_A_i,
  0x03: INC_BC_i,
  0x04: INC_B_i,
  0x05: DEC_B_i,
  0x06: LD_into_B_i_from_d8_i,
  0x07: RLCA,
  0x08: LD_into_a16_m_from_SP_i,
  0x09: ADD_into_HL_i_from_BC_i,
  0x0a: LD_into_A_i_from_BC_m,
  0x0b: DEC_BC_i,
  0x0c: INC_C_i,
  0x0d: DEC_C_i,
  0x0e: LD_into_C_i_from_d8_i,
  0x0f: RRCA,
  0x10: STOP,
  0x11: LD_into_DE_i_from_d16_i,
  0x12: LD_into_DE_m_from_A_i,
  0x13: INC_DE_i,
  0x14: INC_D_i,
  0x15: DEC_D_i,
  0x16: LD_into_D_i_from_d8_i,
  0x17: RLA,
  0x18: JR_r8,
  0x19: ADD_into_HL_i_from_DE_i,
  0x1a: LD_into_A_i_from_DE_m,
  0x1b: DEC_DE_i,
  0x1c: INC_E_i,
  0x1d: DEC_E_i,
  0x1e: LD_into_E_i_from_d8_i,
  0x1f: RRA,
  0x20: JR_C_NZ_r8,
  0x21: LD_into_HL_i_from_d16_i,
  0x22: LD_into_HL_incr_m_from_A_i,
  0x23: INC_HL_i,
  0x24: INC_H_i,
  0x25: DEC_H_i,
  0x26: LD_into_H_i_from_d8_i,
  0x27: DAA_A,
  0x28: JR_C_Z_r8,
  0x29: ADD_into_HL_i_from_HL_i,
  0x2a: LD_into_A_i_from_HL_incr_m,
  0x2b: DEC_HL_i,
  0x2c: INC_L_i,
  0x2d: DEC_L_i,
  0x2e: LD_into_L_i_from_d8_i,
  0x2f: CPL_A,
  0x30: JR_C_NC_r8,
  0x31: LD_into_SP_i_from_d16_i,
  0x32: LD_into_HL_decr_m_from_A_i,
  0x33: INC_SP_i,
  0x34: INC_HL_m,
  0x35: DEC_HL_m,
  0x36: LD_into_HL_m_from_d8_i,
  0x37: SCF,
  0x38: JR_C_C_r8,
  0x39: ADD_into_HL_i_from_SP_i,
  0x3a: LD_into_A_i_from_HL_decr_m,
  0x3b: DEC_SP_i,
  0x3c: INC_A_i,
  0x3d: DEC_A_i,
  0x3e: LD_into_A_i_from_d8_i,
  0x3f: CCF,
  0x40: LD_into_B_i_from_B_i,
  0x41: LD_into_B_i_from_C_i,
  0x42: LD_into_B_i_from_D_i,
  0x43: LD_into_B_i_from_E_i,
  0x44: LD_into_B_i_from_H_i,
  0x45: LD_into_B_i_from_L_i,
  0x46: LD_into_B_i_from_HL_m,
  0x47: LD_into_B_i_from_A_i,
  0x48: LD_into_C_i_from_B_i,
  0x49: LD_into_C_i_from_C_i,
  0x4a: LD_into_C_i_from_D_i,
  0x4b: LD_into_C_i_from_E_i,
  0x4c: LD_into_C_i_from_H_i,
  0x4d: LD_into_C_i_from_L_i,
  0x4e: LD_into_C_i_from_HL_m,
  0x4f: LD_into_C_i_from_A_i,
  0x50: LD_into_D_i_from_B_i,
  0x51: LD_into_D_i_from_C_i,
  0x52: LD_into_D_i_from_D_i,
  0x53: LD_into_D_i_from_E_i,
  0x54: LD_into_D_i_from_H_i,
  0x55: LD_into_D_i_from_L_i,
  0x56: LD_into_D_i_from_HL_m,
  0x57: LD_into_D_i_from_A_i,
  0x58: LD_into_E_i_from_B_i,
  0x59: LD_into_E_i_from_C_i,
  0x5a: LD_into_E_i_from_D_i,
  0x5b: LD_into_E_i_from_E_i,
  0x5c: LD_into_E_i_from_H_i,
  0x5d: LD_into_E_i_from_L_i,
  0x5e: LD_into_E_i_from_HL_m,
  0x5f: LD_into_E_i_from_A_i,
  0x60: LD_into_H_i_from_B_i,
  0x61: LD_into_H_i_from_C_i,
  0x62: LD_into_H_i_from_D_i,
  0x63: LD_into_H_i_from_E_i,
  0x64: LD_into_H_i_from_H_i,
  0x65: LD_into_H_i_from_L_i,
  0x66: LD_into_H_i_from_HL_m,
  0x67: LD_into_H_i_from_A_i,
  0x68: LD_into_L_i_from_B_i,
  0x69: LD_into_L_i_from_C_i,
  0x6a: LD_into_L_i_from_D_i,
  0x6b: LD_into_L_i_from_E_i,
  0x6c: LD_into_L_i_from_H_i,
  0x6d: LD_into_L_i_from_L_i,
  0x6e: LD_into_L_i_from_HL_m,
  0x6f: LD_into_L_i_from_A_i,
  0x70: LD_into_HL_m_from_B_i,
  0x71: LD_into_HL_m_from_C_i,
  0x72: LD_into_HL_m_from_D_i,
  0x73: LD_into_HL_m_from_E_i,
  0x74: LD_into_HL_m_from_H_i,
  0x75: LD_into_HL_m_from_L_i,
  0x76: HALT,
  0x77: LD_into_HL_m_from_A_i,
  0x78: LD_into_A_i_from_B_i,
  0x79: LD_into_A_i_from_C_i,
  0x7a: LD_into_A_i_from_D_i,
  0x7b: LD_into_A_i_from_E_i,
  0x7c: LD_into_A_i_from_H_i,
  0x7d: LD_into_A_i_from_L_i,
  0x7e: LD_into_A_i_from_HL_m,
  0x7f: LD_into_A_i_from_A_i,
  0x80: ADD_into_A_i_from_B_i,
  0x81: ADD_into_A_i_from_C_i,
  0x82: ADD_into_A_i_from_D_i,
  0x83: ADD_into_A_i_from_E_i,
  0x84: ADD_into_A_i_from_H_i,
  0x85: ADD_into_A_i_from_L_i,
  0x86: ADD_into_A_i_from_HL_m,
  0x87: ADD_into_A_i_from_A_i,
  0x88: ADC_into_A_i_from_B_i,
  0x89: ADC_into_A_i_from_C_i,
  0x8a: ADC_into_A_i_from_D_i,
  0x8b: ADC_into_A_i_from_E_i,
  0x8c: ADC_into_A_i_from_H_i,
  0x8d: ADC_into_A_i_from_L_i,
  0x8e: ADC_into_A_i_from_HL_m,
  0x8f: ADC_into_A_i_from_A_i,
  0x90: SUB_from_A_i_value_B_i,
  0x91: SUB_from_A_i_value_C_i,
  0x92: SUB_from_A_i_value_D_i,
  0x93: SUB_from_A_i_value_E_i,
  0x94: SUB_from_A_i_value_H_i,
  0x95: SUB_from_A_i_value_L_i,
  0x96: SUB_from_A_i_value_HL_m,
  0x97: SUB_from_A_i_value_A_i,
  0x98: SBC_from_A_i_value_B_i,
  0x99: SBC_from_A_i_value_C_i,
  0x9a: SBC_from_A_i_value_D_i,
  0x9b: SBC_from_A_i_value_E_i,
  0x9c: SBC_from_A_i_value_H_i,
  0x9d: SBC_from_A_i_value_L_i,
  0x9e: SBC_from_A_i_value_HL_m,
  0x9f: SBC_from_A_i_value_A_i,
  0xa0: AND_A_with_B_i,
  0xa1: AND_A_with_C_i,
  0xa2: AND_A_with_D_i,
  0xa3: AND_A_with_E_i,
  0xa4: AND_A_with_H_i,
  0xa5: AND_A_with_L_i,
  0xa6: AND_A_with_HL_m,
  0xa7: AND_A_with_A_i,
  0xa8: XOR_A_with_B_i,
  0xa9: XOR_A_with_C_i,
  0xaa: XOR_A_with_D_i,
  0xab: XOR_A_with_E_i,
  0xac: XOR_A_with_H_i,
  0xad: XOR_A_with_L_i,
  0xae: XOR_A_with_HL_m,
  0xaf: XOR_A_with_A_i,
  0xb0: OR_A_with_B_i,
  0xb1: OR_A_with_C_i,
  0xb2: OR_A_with_D_i,
  0xb3: OR_A_with_E_i,
  0xb4: OR_A_with_H_i,
  0xb5: OR_A_with_L_i,
  0xb6: OR_A_with_HL_m,
  0xb7: OR_A_with_A_i,
  0xb8: CP_A_with_B_i,
  0xb9: CP_A_with_C_i,
  0xba: CP_A_with_D_i,
  0xbb: CP_A_with_E_i,
  0xbc: CP_A_with_H_i,
  0xbd: CP_A_with_L_i,
  0xbe: CP_A_with_HL_m,
  0xbf: CP_A_with_A_i,
  0xc0: RET_C_NZ,
  0xc1: POP_off_SP_into_BC_i,
  0xc2: JP_C_NZ_a16,
  0xc3: JP_a16,
  0xc4: CALL_C_NZ_a16,
  0xc5: PUSH_onto_SP_register_BC_i,
  0xc6: ADD_into_A_i_from_d8_i,
  0xc7: RST_to_A_i_from_00H_i,
  0xc8: RET_C_Z,
  0xc9: RET,
  0xca: JP_C_Z_a16,
  0xcb: PREFIX,
  0xcc: CALL_C_Z_a16,
  0xcd: CALL,
  0xce: ADC_into_A_i_from_d8_i,
  0xcf: RST_to_A_i_from_08H_i,
  0xd0: RET_C_NC,
  0xd1: POP_off_SP_into_DE_i,
  0xd2: JP_C_NC_a16,
  0xd3: ILLEGAL_D3,
  0xd4: CALL_C_NC_a16,
  0xd5: PUSH_onto_SP_register_DE_i,
  0xd6: SUB_from_A_i_value_d8_i,
  0xd7: RST_to_A_i_from_10H_i,
  0xd8: RET_C_C,
  0xd9: RETI,
  0xda: JP_C_C_a16,
  0xdb: ILLEGAL_DB,
  0xdc: CALL_C_C_a16,
  0xdd: ILLEGAL_DD,
  0xde: SBC_from_A_i_value_d8_i,
  0xdf: RST_to_A_i_from_18H_i,
  0xe0: LDH_into_a8_m_from_A_i,
  0xe1: POP_off_SP_into_HL_i,
  0xe2: LD_into_C_m_from_A_i,
  0xe3: ILLEGAL_E3,
  0xe4: ILLEGAL_E4,
  0xe5: PUSH_onto_SP_register_HL_i,
  0xe6: AND_A_with_d8_i,
  0xe7: RST_to_A_i_from_20H_i,
  0xe8: ADD_into_SP_i_from_r8_i,
  0xe9: JP_HL,
  0xea: LD_into_a16_m_from_A_i,
  0xeb: ILLEGAL_EB,
  0xec: ILLEGAL_EC,
  0xed: ILLEGAL_ED,
  0xee: XOR_A_with_d8_i,
  0xef: RST_to_A_i_from_28H_i,
  0xf0: LDH_into_A_i_from_a8_m,
  0xf1: POP_off_SP_into_AF_i,
  0xf2: LD_into_A_i_from_C_m,
  0xf3: DI,
  0xf4: ILLEGAL_F4,
  0xf5: PUSH_onto_SP_register_AF_i,
  0xf6: OR_A_with_d8_i,
  0xf7: RST_to_A_i_from_30H_i,
  0xf8: LD_into_HL_i_from_SP_incr_i,
  0xf9: LD_into_SP_i_from_HL_i,
  0xfa: LD_into_A_i_from_a16_m,
  0xfb: EI,
  0xfc: ILLEGAL_FC,
  0xfd: ILLEGAL_FD,
  0xfe: CP_A_with_d8_i,
  0xff: RST_to_A_i_from_38H_i,
};

const cbOpcodes = {
  0x00: RLC_B_i,
  0x01: RLC_C_i,
  0x02: RLC_D_i,
  0x03: RLC_E_i,
  0x04: RLC_H_i,
  0x05: RLC_L_i,
  0x06: RLC_HL_m,
  0x07: RLC_A_i,
  0x08: RRC_B_i,
  0x09: RRC_C_i,
  0x0a: RRC_D_i,
  0x0b: RRC_E_i,
  0x0c: RRC_H_i,
  0x0d: RRC_L_i,
  0x0e: RRC_HL_m,
  0x0f: RRC_A_i,
  0x10: RL_B_i,
  0x11: RL_C_i,
  0x12: RL_D_i,
  0x13: RL_E_i,
  0x14: RL_H_i,
  0x15: RL_L_i,
  0x16: RL_HL_m,
  0x17: RL_A_i,
  0x18: RR_B_i,
  0x19: RR_C_i,
  0x1a: RR_D_i,
  0x1b: RR_E_i,
  0x1c: RR_H_i,
  0x1d: RR_L_i,
  0x1e: RR_HL_m,
  0x1f: RR_A_i,
  0x20: SLA_B_i,
  0x21: SLA_C_i,
  0x22: SLA_D_i,
  0x23: SLA_E_i,
  0x24: SLA_H_i,
  0x25: SLA_L_i,
  0x26: SLA_HL_m,
  0x27: SLA_A_i,
  0x28: SRA_B_i,
  0x29: SRA_C_i,
  0x2a: SRA_D_i,
  0x2b: SRA_E_i,
  0x2c: SRA_H_i,
  0x2d: SRA_L_i,
  0x2e: SRA_HL_m,
  0x2f: SRA_A_i,
  0x30: SWAP_B_i,
  0x31: SWAP_C_i,
  0x32: SWAP_D_i,
  0x33: SWAP_E_i,
  0x34: SWAP_H_i,
  0x35: SWAP_L_i,
  0x36: SWAP_HL_m,
  0x37: SWAP_A_i,
  0x38: SRL_B_i,
  0x39: SRL_C_i,
  0x3a: SRL_D_i,
  0x3b: SRL_E_i,
  0x3c: SRL_H_i,
  0x3d: SRL_L_i,
  0x3e: SRL_HL_m,
  0x3f: SRL_A_i,
  0x40: BIT_test_0_i_of_B_i,
  0x41: BIT_test_0_i_of_C_i,
  0x42: BIT_test_0_i_of_D_i,
  0x43: BIT_test_0_i_of_E_i,
  0x44: BIT_test_0_i_of_H_i,
  0x45: BIT_test_0_i_of_L_i,
  0x46: BIT_test_0_i_of_HL_m,
  0x47: BIT_test_0_i_of_A_i,
  0x48: BIT_test_1_i_of_B_i,
  0x49: BIT_test_1_i_of_C_i,
  0x4a: BIT_test_1_i_of_D_i,
  0x4b: BIT_test_1_i_of_E_i,
  0x4c: BIT_test_1_i_of_H_i,
  0x4d: BIT_test_1_i_of_L_i,
  0x4e: BIT_test_1_i_of_HL_m,
  0x4f: BIT_test_1_i_of_A_i,
  0x50: BIT_test_2_i_of_B_i,
  0x51: BIT_test_2_i_of_C_i,
  0x52: BIT_test_2_i_of_D_i,
  0x53: BIT_test_2_i_of_E_i,
  0x54: BIT_test_2_i_of_H_i,
  0x55: BIT_test_2_i_of_L_i,
  0x56: BIT_test_2_i_of_HL_m,
  0x57: BIT_test_2_i_of_A_i,
  0x58: BIT_test_3_i_of_B_i,
  0x59: BIT_test_3_i_of_C_i,
  0x5a: BIT_test_3_i_of_D_i,
  0x5b: BIT_test_3_i_of_E_i,
  0x5c: BIT_test_3_i_of_H_i,
  0x5d: BIT_test_3_i_of_L_i,
  0x5e: BIT_test_3_i_of_HL_m,
  0x5f: BIT_test_3_i_of_A_i,
  0x60: BIT_test_4_i_of_B_i,
  0x61: BIT_test_4_i_of_C_i,
  0x62: BIT_test_4_i_of_D_i,
  0x63: BIT_test_4_i_of_E_i,
  0x64: BIT_test_4_i_of_H_i,
  0x65: BIT_test_4_i_of_L_i,
  0x66: BIT_test_4_i_of_HL_m,
  0x67: BIT_test_4_i_of_A_i,
  0x68: BIT_test_5_i_of_B_i,
  0x69: BIT_test_5_i_of_C_i,
  0x6a: BIT_test_5_i_of_D_i,
  0x6b: BIT_test_5_i_of_E_i,
  0x6c: BIT_test_5_i_of_H_i,
  0x6d: BIT_test_5_i_of_L_i,
  0x6e: BIT_test_5_i_of_HL_m,
  0x6f: BIT_test_5_i_of_A_i,
  0x70: BIT_test_6_i_of_B_i,
  0x71: BIT_test_6_i_of_C_i,
  0x72: BIT_test_6_i_of_D_i,
  0x73: BIT_test_6_i_of_E_i,
  0x74: BIT_test_6_i_of_H_i,
  0x75: BIT_test_6_i_of_L_i,
  0x76: BIT_test_6_i_of_HL_m,
  0x77: BIT_test_6_i_of_A_i,
  0x78: BIT_test_7_i_of_B_i,
  0x79: BIT_test_7_i_of_C_i,
  0x7a: BIT_test_7_i_of_D_i,
  0x7b: BIT_test_7_i_of_E_i,
  0x7c: BIT_test_7_i_of_H_i,
  0x7d: BIT_test_7_i_of_L_i,
  0x7e: BIT_test_7_i_of_HL_m,
  0x7f: BIT_test_7_i_of_A_i,
  0x80: RES_bit0_of_B,
  0x81: RES_bit0_of_C,
  0x82: RES_bit0_of_D,
  0x83: RES_bit0_of_E,
  0x84: RES_bit0_of_H,
  0x85: RES_bit0_of_L,
  0x86: RES_bit0_of_HL,
  0x87: RES_bit0_of_A,
  0x88: RES_bit1_of_B,
  0x89: RES_bit1_of_C,
  0x8a: RES_bit1_of_D,
  0x8b: RES_bit1_of_E,
  0x8c: RES_bit1_of_H,
  0x8d: RES_bit1_of_L,
  0x8e: RES_bit1_of_HL,
  0x8f: RES_bit1_of_A,
  0x90: RES_bit2_of_B,
  0x91: RES_bit2_of_C,
  0x92: RES_bit2_of_D,
  0x93: RES_bit2_of_E,
  0x94: RES_bit2_of_H,
  0x95: RES_bit2_of_L,
  0x96: RES_bit2_of_HL,
  0x97: RES_bit2_of_A,
  0x98: RES_bit3_of_B,
  0x99: RES_bit3_of_C,
  0x9a: RES_bit3_of_D,
  0x9b: RES_bit3_of_E,
  0x9c: RES_bit3_of_H,
  0x9d: RES_bit3_of_L,
  0x9e: RES_bit3_of_HL,
  0x9f: RES_bit3_of_A,
  0xa0: RES_bit4_of_B,
  0xa1: RES_bit4_of_C,
  0xa2: RES_bit4_of_D,
  0xa3: RES_bit4_of_E,
  0xa4: RES_bit4_of_H,
  0xa5: RES_bit4_of_L,
  0xa6: RES_bit4_of_HL,
  0xa7: RES_bit4_of_A,
  0xa8: RES_bit5_of_B,
  0xa9: RES_bit5_of_C,
  0xaa: RES_bit5_of_D,
  0xab: RES_bit5_of_E,
  0xac: RES_bit5_of_H,
  0xad: RES_bit5_of_L,
  0xae: RES_bit5_of_HL,
  0xaf: RES_bit5_of_A,
  0xb0: RES_bit6_of_B,
  0xb1: RES_bit6_of_C,
  0xb2: RES_bit6_of_D,
  0xb3: RES_bit6_of_E,
  0xb4: RES_bit6_of_H,
  0xb5: RES_bit6_of_L,
  0xb6: RES_bit6_of_HL,
  0xb7: RES_bit6_of_A,
  0xb8: RES_bit7_of_B,
  0xb9: RES_bit7_of_C,
  0xba: RES_bit7_of_D,
  0xbb: RES_bit7_of_E,
  0xbc: RES_bit7_of_H,
  0xbd: RES_bit7_of_L,
  0xbe: RES_bit7_of_HL,
  0xbf: RES_bit7_of_A,
  0xc0: SET_bit0_of_B,
  0xc1: SET_bit0_of_C,
  0xc2: SET_bit0_of_D,
  0xc3: SET_bit0_of_E,
  0xc4: SET_bit0_of_H,
  0xc5: SET_bit0_of_L,
  0xc6: SET_bit0_of_HL,
  0xc7: SET_bit0_of_A,
  0xc8: SET_bit1_of_B,
  0xc9: SET_bit1_of_C,
  0xca: SET_bit1_of_D,
  0xcb: SET_bit1_of_E,
  0xcc: SET_bit1_of_H,
  0xcd: SET_bit1_of_L,
  0xce: SET_bit1_of_HL,
  0xcf: SET_bit1_of_A,
  0xd0: SET_bit2_of_B,
  0xd1: SET_bit2_of_C,
  0xd2: SET_bit2_of_D,
  0xd3: SET_bit2_of_E,
  0xd4: SET_bit2_of_H,
  0xd5: SET_bit2_of_L,
  0xd6: SET_bit2_of_HL,
  0xd7: SET_bit2_of_A,
  0xd8: SET_bit3_of_B,
  0xd9: SET_bit3_of_C,
  0xda: SET_bit3_of_D,
  0xdb: SET_bit3_of_E,
  0xdc: SET_bit3_of_H,
  0xdd: SET_bit3_of_L,
  0xde: SET_bit3_of_HL,
  0xdf: SET_bit3_of_A,
  0xe0: SET_bit4_of_B,
  0xe1: SET_bit4_of_C,
  0xe2: SET_bit4_of_D,
  0xe3: SET_bit4_of_E,
  0xe4: SET_bit4_of_H,
  0xe5: SET_bit4_of_L,
  0xe6: SET_bit4_of_HL,
  0xe7: SET_bit4_of_A,
  0xe8: SET_bit5_of_B,
  0xe9: SET_bit5_of_C,
  0xea: SET_bit5_of_D,
  0xeb: SET_bit5_of_E,
  0xec: SET_bit5_of_H,
  0xed: SET_bit5_of_L,
  0xee: SET_bit5_of_HL,
  0xef: SET_bit5_of_A,
  0xf0: SET_bit6_of_B,
  0xf1: SET_bit6_of_C,
  0xf2: SET_bit6_of_D,
  0xf3: SET_bit6_of_E,
  0xf4: SET_bit6_of_H,
  0xf5: SET_bit6_of_L,
  0xf6: SET_bit6_of_HL,
  0xf7: SET_bit6_of_A,
  0xf8: SET_bit7_of_B,
  0xf9: SET_bit7_of_C,
  0xfa: SET_bit7_of_D,
  0xfb: SET_bit7_of_E,
  0xfc: SET_bit7_of_H,
  0xfd: SET_bit7_of_L,
  0xfe: SET_bit7_of_HL,
  0xff: SET_bit7_of_A,
};
