import Instructions from './Instructions';
import CPU from '../CPU';

/**
 * No operation.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const NOP = (cpu: CPU): number => {
  Instructions.map[0x00].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_BC_i_from_d16_i = (cpu: CPU): number => {
  Instructions.map[0x01].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_BC_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x02].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const INC_BC_i = (cpu: CPU): number => {
  Instructions.map[0x03].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_B_i = (cpu: CPU): number => {
  Instructions.map[0x04].apply(cpu);
  return 4;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_B_i = (cpu: CPU): number => {
  Instructions.map[0x05].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x06].apply(cpu);
  return 8;
};

/**
 * Rotate A left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLCA = (cpu: CPU): number => {
  Instructions.map[0x07].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_a16_m_from_SP_i = (cpu: CPU): number => {
  Instructions.map[0x08].apply(cpu);
  return 20;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
const ADD_into_HL_i_from_BC_i = (cpu: CPU): number => {
  Instructions.map[0x09].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_BC_m = (cpu: CPU): number => {
  Instructions.map[0x0a].apply(cpu);
  return 8;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const DEC_BC_i = (cpu: CPU): number => {
  Instructions.map[0x0b].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_C_i = (cpu: CPU): number => {
  Instructions.map[0x0c].apply(cpu);
  return 4;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_C_i = (cpu: CPU): number => {
  Instructions.map[0x0d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x0e].apply(cpu);
  return 8;
};

/**
 * Rotate A right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRCA = (cpu: CPU): number => {
  Instructions.map[0x0f].apply(cpu);
  return 4;
};

/**
 *  Halt CPU & LCD display until button pressed.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const STOP = (cpu: CPU): number => {
  Instructions.map[0x10].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_DE_i_from_d16_i = (cpu: CPU): number => {
  Instructions.map[0x11].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_DE_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x12].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const INC_DE_i = (cpu: CPU): number => {
  Instructions.map[0x13].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_D_i = (cpu: CPU): number => {
  Instructions.map[0x14].apply(cpu);
  return 4;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_D_i = (cpu: CPU): number => {
  Instructions.map[0x15].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x16].apply(cpu);
  return 8;
};

/**
     * Rotate A left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RLA = (cpu: CPU): number => {
  Instructions.map[0x17].apply(cpu);
  return 4;
};

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JR_to_A_i__r8_i = (cpu: CPU): number => {
  Instructions.map[0x18].apply(cpu);
  return 12;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
const ADD_into_HL_i_from_DE_i = (cpu: CPU): number => {
  Instructions.map[0x19].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_DE_m = (cpu: CPU): number => {
  Instructions.map[0x1a].apply(cpu);
  return 8;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const DEC_DE_i = (cpu: CPU): number => {
  Instructions.map[0x1b].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_E_i = (cpu: CPU): number => {
  Instructions.map[0x1c].apply(cpu);
  return 4;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_E_i = (cpu: CPU): number => {
  Instructions.map[0x1d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x1e].apply(cpu);
  return 8;
};

/**
     * Rotate A right through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RRA = (cpu: CPU): number => {
  Instructions.map[0x1f].apply(cpu);
  return 4;
};

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JR_to_NZ_i__r8_i = (cpu: CPU): number => {
  Instructions.map[0x20].apply(cpu);
  return 12 || 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_i_from_d16_i = (cpu: CPU): number => {
  Instructions.map[0x21].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_incr_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x22].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const INC_HL_i = (cpu: CPU): number => {
  Instructions.map[0x23].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_H_i = (cpu: CPU): number => {
  Instructions.map[0x24].apply(cpu);
  return 4;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_H_i = (cpu: CPU): number => {
  Instructions.map[0x25].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x26].apply(cpu);
  return 8;
};

/**
 * Decimal adjust register A.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, H, C
 */
const DAA_A = (cpu: CPU): number => {
  Instructions.map[0x27].apply(cpu);
  return 4;
};

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JR_to_Z_i__r8_i = (cpu: CPU): number => {
  Instructions.map[0x28].apply(cpu);
  return 12 || 8;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
const ADD_into_HL_i_from_HL_i = (cpu: CPU): number => {
  Instructions.map[0x29].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_HL_incr_m = (cpu: CPU): number => {
  Instructions.map[0x2a].apply(cpu);
  return 8;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const DEC_HL_i = (cpu: CPU): number => {
  Instructions.map[0x2b].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_L_i = (cpu: CPU): number => {
  Instructions.map[0x2c].apply(cpu);
  return 4;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_L_i = (cpu: CPU): number => {
  Instructions.map[0x2d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x2e].apply(cpu);
  return 8;
};

/**
 * Complement A register. (Flip all bits.)
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H
 */
const CPL_A = (cpu: CPU): number => {
  Instructions.map[0x2f].apply(cpu);
  return 4;
};

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JR_to_NC_i__r8_i = (cpu: CPU): number => {
  Instructions.map[0x30].apply(cpu);
  return 12 || 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_SP_i_from_d16_i = (cpu: CPU): number => {
  Instructions.map[0x31].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_decr_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x32].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const INC_SP_i = (cpu: CPU): number => {
  Instructions.map[0x33].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_HL_m = (cpu: CPU): number => {
  Instructions.map[0x34].apply(cpu);
  return 12;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_HL_m = (cpu: CPU): number => {
  Instructions.map[0x35].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x36].apply(cpu);
  return 12;
};

/**
 *  Set Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
const SCF = (cpu: CPU): number => {
  Instructions.map[0x37].apply(cpu);
  return 4;
};

/**
 * Unconditional jump to the relative address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JR_to_C_i__r8_i = (cpu: CPU): number => {
  Instructions.map[0x38].apply(cpu);
  return 12 || 8;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: N, H, C
 */
const ADD_into_HL_i_from_SP_i = (cpu: CPU): number => {
  Instructions.map[0x39].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_HL_decr_m = (cpu: CPU): number => {
  Instructions.map[0x3a].apply(cpu);
  return 8;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const DEC_SP_i = (cpu: CPU): number => {
  Instructions.map[0x3b].apply(cpu);
  return 8;
};

/**
 * Increment register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const INC_A_i = (cpu: CPU): number => {
  Instructions.map[0x3c].apply(cpu);
  return 4;
};

/**
 * Decrement register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const DEC_A_i = (cpu: CPU): number => {
  Instructions.map[0x3d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0x3e].apply(cpu);
  return 8;
};

/**
     * Complement carry flag.
     * If C flag is set, then reset it.
     * If C flag is reset, then set it.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: N, H, C
    */
const CCF = (cpu: CPU): number => {
  Instructions.map[0x3f].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x40].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x41].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x42].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x43].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x44].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x45].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x46].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_B_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x47].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x48].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x49].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x4a].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x4b].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x4c].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x4d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x4e].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x4f].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x50].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x51].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x52].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x53].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x54].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x55].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x56].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_D_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x57].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x58].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x59].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x5a].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x5b].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x5c].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x5d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x5e].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_E_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x5f].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x60].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x61].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x62].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x63].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x64].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x65].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x66].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_H_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x67].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x68].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x69].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x6a].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x6b].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x6c].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x6d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x6e].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_L_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x6f].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x70].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x71].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x72].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x73].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x74].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x75].apply(cpu);
  return 8;
};

/**
     * Disables interrupt handling.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags:
    */
const HALT = (cpu: CPU): number => {
  Instructions.map[0x76].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_HL_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x77].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x78].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x79].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x7a].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x7b].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x7c].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x7d].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x7e].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x7f].apply(cpu);
  return 4;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x80].apply(cpu);
  return 4;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x81].apply(cpu);
  return 4;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x82].apply(cpu);
  return 4;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x83].apply(cpu);
  return 4;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x84].apply(cpu);
  return 4;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x85].apply(cpu);
  return 4;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x86].apply(cpu);
  return 8;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x87].apply(cpu);
  return 4;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_B_i = (cpu: CPU): number => {
  Instructions.map[0x88].apply(cpu);
  return 4;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_C_i = (cpu: CPU): number => {
  Instructions.map[0x89].apply(cpu);
  return 4;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_D_i = (cpu: CPU): number => {
  Instructions.map[0x8a].apply(cpu);
  return 4;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_E_i = (cpu: CPU): number => {
  Instructions.map[0x8b].apply(cpu);
  return 4;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_H_i = (cpu: CPU): number => {
  Instructions.map[0x8c].apply(cpu);
  return 4;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_L_i = (cpu: CPU): number => {
  Instructions.map[0x8d].apply(cpu);
  return 4;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_HL_m = (cpu: CPU): number => {
  Instructions.map[0x8e].apply(cpu);
  return 8;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_A_i = (cpu: CPU): number => {
  Instructions.map[0x8f].apply(cpu);
  return 4;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_B_i = (cpu: CPU): number => {
  Instructions.map[0x90].apply(cpu);
  return 4;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_C_i = (cpu: CPU): number => {
  Instructions.map[0x91].apply(cpu);
  return 4;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_D_i = (cpu: CPU): number => {
  Instructions.map[0x92].apply(cpu);
  return 4;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_E_i = (cpu: CPU): number => {
  Instructions.map[0x93].apply(cpu);
  return 4;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_H_i = (cpu: CPU): number => {
  Instructions.map[0x94].apply(cpu);
  return 4;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_L_i = (cpu: CPU): number => {
  Instructions.map[0x95].apply(cpu);
  return 4;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_HL_m = (cpu: CPU): number => {
  Instructions.map[0x96].apply(cpu);
  return 8;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_A_i = (cpu: CPU): number => {
  Instructions.map[0x97].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_B_i = (cpu: CPU): number => {
  Instructions.map[0x98].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_C_i = (cpu: CPU): number => {
  Instructions.map[0x99].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_D_i = (cpu: CPU): number => {
  Instructions.map[0x9a].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_E_i = (cpu: CPU): number => {
  Instructions.map[0x9b].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_H_i = (cpu: CPU): number => {
  Instructions.map[0x9c].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_L_i = (cpu: CPU): number => {
  Instructions.map[0x9d].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_HL_m = (cpu: CPU): number => {
  Instructions.map[0x9e].apply(cpu);
  return 8;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_A_i = (cpu: CPU): number => {
  Instructions.map[0x9f].apply(cpu);
  return 4;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_B = (cpu: CPU): number => {
  Instructions.map[0xa0].apply(cpu);
  return 4;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_C = (cpu: CPU): number => {
  Instructions.map[0xa1].apply(cpu);
  return 4;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_D = (cpu: CPU): number => {
  Instructions.map[0xa2].apply(cpu);
  return 4;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_E = (cpu: CPU): number => {
  Instructions.map[0xa3].apply(cpu);
  return 4;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_H = (cpu: CPU): number => {
  Instructions.map[0xa4].apply(cpu);
  return 4;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_L = (cpu: CPU): number => {
  Instructions.map[0xa5].apply(cpu);
  return 4;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_HL = (cpu: CPU): number => {
  Instructions.map[0xa6].apply(cpu);
  return 8;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_A = (cpu: CPU): number => {
  Instructions.map[0xa7].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_B = (cpu: CPU): number => {
  Instructions.map[0xa8].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_C = (cpu: CPU): number => {
  Instructions.map[0xa9].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_D = (cpu: CPU): number => {
  Instructions.map[0xaa].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_E = (cpu: CPU): number => {
  Instructions.map[0xab].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_H = (cpu: CPU): number => {
  Instructions.map[0xac].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_L = (cpu: CPU): number => {
  Instructions.map[0xad].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_HL = (cpu: CPU): number => {
  Instructions.map[0xae].apply(cpu);
  return 8;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_A = (cpu: CPU): number => {
  Instructions.map[0xaf].apply(cpu);
  return 4;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_B = (cpu: CPU): number => {
  Instructions.map[0xb0].apply(cpu);
  return 4;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_C = (cpu: CPU): number => {
  Instructions.map[0xb1].apply(cpu);
  return 4;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_D = (cpu: CPU): number => {
  Instructions.map[0xb2].apply(cpu);
  return 4;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_E = (cpu: CPU): number => {
  Instructions.map[0xb3].apply(cpu);
  return 4;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_H = (cpu: CPU): number => {
  Instructions.map[0xb4].apply(cpu);
  return 4;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_L = (cpu: CPU): number => {
  Instructions.map[0xb5].apply(cpu);
  return 4;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_HL = (cpu: CPU): number => {
  Instructions.map[0xb6].apply(cpu);
  return 8;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_A = (cpu: CPU): number => {
  Instructions.map[0xb7].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_B = (cpu: CPU): number => {
  Instructions.map[0xb8].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_C = (cpu: CPU): number => {
  Instructions.map[0xb9].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_D = (cpu: CPU): number => {
  Instructions.map[0xba].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_E = (cpu: CPU): number => {
  Instructions.map[0xbb].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_H = (cpu: CPU): number => {
  Instructions.map[0xbc].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_L = (cpu: CPU): number => {
  Instructions.map[0xbd].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_HL = (cpu: CPU): number => {
  Instructions.map[0xbe].apply(cpu);
  return 8;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_A = (cpu: CPU): number => {
  Instructions.map[0xbf].apply(cpu);
  return 4;
};

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RET_to_A_i__NZ_i = (cpu: CPU): number => {
  Instructions.map[0xc0].apply(cpu);
  return 20 || 8;
};

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const POP_off_SP_into_BC_i = (cpu: CPU): number => {
  Instructions.map[0xc1].apply(cpu);
  return 12;
};

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JP_to_NZ_i__a16_i = (cpu: CPU): number => {
  Instructions.map[0xc2].apply(cpu);
  return 16 || 12;
};

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JP_to_A_i__a16_i = (cpu: CPU): number => {
  Instructions.map[0xc3].apply(cpu);
  return 16;
};

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const CALL_to_NZ_i_from_a16_i = (cpu: CPU): number => {
  Instructions.map[0xc4].apply(cpu);
  return 24 || 12;
};

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const PUSH_onto_SP_register_BC_i = (cpu: CPU): number => {
  Instructions.map[0xc5].apply(cpu);
  return 16;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_A_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0xc6].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_00H_i = (cpu: CPU): number => {
  Instructions.map[0xc7].apply(cpu);
  return 16;
};

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RET_to_A_i__Z_i = (cpu: CPU): number => {
  Instructions.map[0xc8].apply(cpu);
  return 20 || 8;
};

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RET = (cpu: CPU): number => {
  Instructions.map[0xc9].apply(cpu);
  return 16;
};

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JP_to_Z_i__a16_i = (cpu: CPU): number => {
  Instructions.map[0xca].apply(cpu);
  return 16 || 12;
};

/**
 * Execute a CB-prefixed instruction.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const PREFIX = (cpu: CPU): number => {
  Instructions.map[0xcb].apply(cpu);
  return 4;
};

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const CALL_to_Z_i_from_a16_i = (cpu: CPU): number => {
  Instructions.map[0xcc].apply(cpu);
  return 24 || 12;
};

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const CALL_to_A_i_from_a16_i = (cpu: CPU): number => {
  Instructions.map[0xcd].apply(cpu);
  return 24;
};

/**
 * Add with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADC_into_A_i_from_d8_i = (cpu: CPU): number => {
  Instructions.map[0xce].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_08H_i = (cpu: CPU): number => {
  Instructions.map[0xcf].apply(cpu);
  return 16;
};

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RET_to_A_i__NC_i = (cpu: CPU): number => {
  Instructions.map[0xd0].apply(cpu);
  return 20 || 8;
};

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const POP_off_SP_into_DE_i = (cpu: CPU): number => {
  Instructions.map[0xd1].apply(cpu);
  return 12;
};

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JP_to_NC_i__a16_i = (cpu: CPU): number => {
  Instructions.map[0xd2].apply(cpu);
  return 16 || 12;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_D3 = (cpu: CPU): number => {
  Instructions.map[0xd3].apply(cpu);
  return 4;
};

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const CALL_to_NC_i_from_a16_i = (cpu: CPU): number => {
  Instructions.map[0xd4].apply(cpu);
  return 24 || 12;
};

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const PUSH_onto_SP_register_DE_i = (cpu: CPU): number => {
  Instructions.map[0xd5].apply(cpu);
  return 16;
};

/**
 * Subtract.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SUB_from_A_i_value_d8_i = (cpu: CPU): number => {
  Instructions.map[0xd6].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_10H_i = (cpu: CPU): number => {
  Instructions.map[0xd7].apply(cpu);
  return 16;
};

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RET_to_A_i__C_i = (cpu: CPU): number => {
  Instructions.map[0xd8].apply(cpu);
  return 20 || 8;
};

/**
 * Return from a function.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RETI = (cpu: CPU): number => {
  Instructions.map[0xd9].apply(cpu);
  return 16;
};

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JP_to_C_i__a16_i = (cpu: CPU): number => {
  Instructions.map[0xda].apply(cpu);
  return 16 || 12;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_DB = (cpu: CPU): number => {
  Instructions.map[0xdb].apply(cpu);
  return 4;
};

/**
 * Function call to the absolute address.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const CALL_to_C_i_from_a16_i = (cpu: CPU): number => {
  Instructions.map[0xdc].apply(cpu);
  return 24 || 12;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_DD = (cpu: CPU): number => {
  Instructions.map[0xdd].apply(cpu);
  return 4;
};

/**
 * Subtract with carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SBC_from_A_i_value_d8_i = (cpu: CPU): number => {
  Instructions.map[0xde].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_18H_i = (cpu: CPU): number => {
  Instructions.map[0xdf].apply(cpu);
  return 16;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LDH_into_a8_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0xe0].apply(cpu);
  return 12;
};

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const POP_off_SP_into_HL_i = (cpu: CPU): number => {
  Instructions.map[0xe1].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_C_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0xe2].apply(cpu);
  return 8;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_E3 = (cpu: CPU): number => {
  Instructions.map[0xe3].apply(cpu);
  return 4;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_E4 = (cpu: CPU): number => {
  Instructions.map[0xe4].apply(cpu);
  return 4;
};

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const PUSH_onto_SP_register_HL_i = (cpu: CPU): number => {
  Instructions.map[0xe5].apply(cpu);
  return 16;
};

/**
 * Logical AND.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const AND_A_with_d8 = (cpu: CPU): number => {
  Instructions.map[0xe6].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_20H_i = (cpu: CPU): number => {
  Instructions.map[0xe7].apply(cpu);
  return 16;
};

/**
 * Add.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const ADD_into_SP_i_from_r8_i = (cpu: CPU): number => {
  Instructions.map[0xe8].apply(cpu);
  return 16;
};

/**
 * Unconditional jump to the absolute address specified by the 16-bit operand
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const JP_to_A_i__HL_i = (cpu: CPU): number => {
  Instructions.map[0xe9].apply(cpu);
  return 4;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_a16_m_from_A_i = (cpu: CPU): number => {
  Instructions.map[0xea].apply(cpu);
  return 16;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_EB = (cpu: CPU): number => {
  Instructions.map[0xeb].apply(cpu);
  return 4;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_EC = (cpu: CPU): number => {
  Instructions.map[0xec].apply(cpu);
  return 4;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_ED = (cpu: CPU): number => {
  Instructions.map[0xed].apply(cpu);
  return 4;
};

/**
 * Logical XOR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const XOR_A_with_d8 = (cpu: CPU): number => {
  Instructions.map[0xee].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_28H_i = (cpu: CPU): number => {
  Instructions.map[0xef].apply(cpu);
  return 16;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LDH_into_A_i_from_a8_m = (cpu: CPU): number => {
  Instructions.map[0xf0].apply(cpu);
  return 12;
};

/**
 * Pops to the 16-bit register, data from the stack memory.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const POP_off_SP_into_AF_i = (cpu: CPU): number => {
  Instructions.map[0xf1].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_C_m = (cpu: CPU): number => {
  Instructions.map[0xf2].apply(cpu);
  return 8;
};

/**
 * Disables interrupt handling.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const DI = (cpu: CPU): number => {
  Instructions.map[0xf3].apply(cpu);
  return 4;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_F4 = (cpu: CPU): number => {
  Instructions.map[0xf4].apply(cpu);
  return 4;
};

/**
 * Push to the stack memory, data from the 16-bit register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const PUSH_onto_SP_register_AF_i = (cpu: CPU): number => {
  Instructions.map[0xf5].apply(cpu);
  return 16;
};

/**
 * Logical OR.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const OR_A_with_d8 = (cpu: CPU): number => {
  Instructions.map[0xf6].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_30H_i = (cpu: CPU): number => {
  Instructions.map[0xf7].apply(cpu);
  return 16;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const LD_into_HL_i_from_SP_incr_i = (cpu: CPU): number => {
  Instructions.map[0xf8].apply(cpu);
  return 12;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_SP_i_from_HL_i = (cpu: CPU): number => {
  Instructions.map[0xf9].apply(cpu);
  return 8;
};

/**
 * Load data into the register.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const LD_into_A_i_from_a16_m = (cpu: CPU): number => {
  Instructions.map[0xfa].apply(cpu);
  return 16;
};

/**
 * Disables interrupt handling.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const EI = (cpu: CPU): number => {
  Instructions.map[0xfb].apply(cpu);
  return 4;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_FC = (cpu: CPU): number => {
  Instructions.map[0xfc].apply(cpu);
  return 4;
};

/**
 * Invalid opcode.
 * Affected flags:
 */
const ILLEGAL_FD = (cpu: CPU): number => {
  Instructions.map[0xfd].apply(cpu);
  return 4;
};

/**
 * Compare A with regiseter.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const CP_A_with_d8 = (cpu: CPU): number => {
  Instructions.map[0xfe].apply(cpu);
  return 8;
};

/**
 * Unconditional function call to the absolute fixed address
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RST_to_A_i_from_38H_i = (cpu: CPU): number => {
  Instructions.map[0xff].apply(cpu);
  return 16;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_B_i = (cpu: CPU): number => {
  Instructions.map[0x00].apply(cpu);
  return 8;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_C_i = (cpu: CPU): number => {
  Instructions.map[0x01].apply(cpu);
  return 8;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_D_i = (cpu: CPU): number => {
  Instructions.map[0x02].apply(cpu);
  return 8;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_E_i = (cpu: CPU): number => {
  Instructions.map[0x03].apply(cpu);
  return 8;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_H_i = (cpu: CPU): number => {
  Instructions.map[0x04].apply(cpu);
  return 8;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_L_i = (cpu: CPU): number => {
  Instructions.map[0x05].apply(cpu);
  return 8;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_HL_m = (cpu: CPU): number => {
  Instructions.map[0x06].apply(cpu);
  return 16;
};

/**
 * Rotate n left. Old bit 7 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RLC_A_i = (cpu: CPU): number => {
  Instructions.map[0x07].apply(cpu);
  return 8;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_B_i = (cpu: CPU): number => {
  Instructions.map[0x08].apply(cpu);
  return 8;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_C_i = (cpu: CPU): number => {
  Instructions.map[0x09].apply(cpu);
  return 8;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_D_i = (cpu: CPU): number => {
  Instructions.map[0x0a].apply(cpu);
  return 8;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_E_i = (cpu: CPU): number => {
  Instructions.map[0x0b].apply(cpu);
  return 8;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_H_i = (cpu: CPU): number => {
  Instructions.map[0x0c].apply(cpu);
  return 8;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_L_i = (cpu: CPU): number => {
  Instructions.map[0x0d].apply(cpu);
  return 8;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_HL_m = (cpu: CPU): number => {
  Instructions.map[0x0e].apply(cpu);
  return 16;
};

/**
 * Rotate n right. Old bit 0 to Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RRC_A_i = (cpu: CPU): number => {
  Instructions.map[0x0f].apply(cpu);
  return 8;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_B_i = (cpu: CPU): number => {
  Instructions.map[0x10].apply(cpu);
  return 8;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_C_i = (cpu: CPU): number => {
  Instructions.map[0x11].apply(cpu);
  return 8;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_D_i = (cpu: CPU): number => {
  Instructions.map[0x12].apply(cpu);
  return 8;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_E_i = (cpu: CPU): number => {
  Instructions.map[0x13].apply(cpu);
  return 8;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_H_i = (cpu: CPU): number => {
  Instructions.map[0x14].apply(cpu);
  return 8;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_L_i = (cpu: CPU): number => {
  Instructions.map[0x15].apply(cpu);
  return 8;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_HL_m = (cpu: CPU): number => {
  Instructions.map[0x16].apply(cpu);
  return 16;
};

/**
     * Rotate n left through Carry flag.
     * @param - CPU class.
     * @returns - Number of system clock ticks used.

    * Affected flags: Z, N, H, C
    */
const RL_A_i = (cpu: CPU): number => {
  Instructions.map[0x17].apply(cpu);
  return 8;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_B_i = (cpu: CPU): number => {
  Instructions.map[0x18].apply(cpu);
  return 8;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_C_i = (cpu: CPU): number => {
  Instructions.map[0x19].apply(cpu);
  return 8;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_D_i = (cpu: CPU): number => {
  Instructions.map[0x1a].apply(cpu);
  return 8;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_E_i = (cpu: CPU): number => {
  Instructions.map[0x1b].apply(cpu);
  return 8;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_H_i = (cpu: CPU): number => {
  Instructions.map[0x1c].apply(cpu);
  return 8;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_L_i = (cpu: CPU): number => {
  Instructions.map[0x1d].apply(cpu);
  return 8;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_HL_m = (cpu: CPU): number => {
  Instructions.map[0x1e].apply(cpu);
  return 16;
};

/**
 * Rotate n right through Carry flag.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const RR_A_i = (cpu: CPU): number => {
  Instructions.map[0x1f].apply(cpu);
  return 8;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_B_i = (cpu: CPU): number => {
  Instructions.map[0x20].apply(cpu);
  return 8;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_C_i = (cpu: CPU): number => {
  Instructions.map[0x21].apply(cpu);
  return 8;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_D_i = (cpu: CPU): number => {
  Instructions.map[0x22].apply(cpu);
  return 8;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_E_i = (cpu: CPU): number => {
  Instructions.map[0x23].apply(cpu);
  return 8;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_H_i = (cpu: CPU): number => {
  Instructions.map[0x24].apply(cpu);
  return 8;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_L_i = (cpu: CPU): number => {
  Instructions.map[0x25].apply(cpu);
  return 8;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_HL_m = (cpu: CPU): number => {
  Instructions.map[0x26].apply(cpu);
  return 16;
};

/**
 * Shift n left into Carry. LSB of n set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SLA_A_i = (cpu: CPU): number => {
  Instructions.map[0x27].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_B_i = (cpu: CPU): number => {
  Instructions.map[0x28].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_C_i = (cpu: CPU): number => {
  Instructions.map[0x29].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_D_i = (cpu: CPU): number => {
  Instructions.map[0x2a].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_E_i = (cpu: CPU): number => {
  Instructions.map[0x2b].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_H_i = (cpu: CPU): number => {
  Instructions.map[0x2c].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_L_i = (cpu: CPU): number => {
  Instructions.map[0x2d].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_HL_m = (cpu: CPU): number => {
  Instructions.map[0x2e].apply(cpu);
  return 16;
};

/**
 * Shift n right into Carry. MSB doesn't change.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRA_A_i = (cpu: CPU): number => {
  Instructions.map[0x2f].apply(cpu);
  return 8;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_B_i = (cpu: CPU): number => {
  Instructions.map[0x30].apply(cpu);
  return 8;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_C_i = (cpu: CPU): number => {
  Instructions.map[0x31].apply(cpu);
  return 8;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_D_i = (cpu: CPU): number => {
  Instructions.map[0x32].apply(cpu);
  return 8;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_E_i = (cpu: CPU): number => {
  Instructions.map[0x33].apply(cpu);
  return 8;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_H_i = (cpu: CPU): number => {
  Instructions.map[0x34].apply(cpu);
  return 8;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_L_i = (cpu: CPU): number => {
  Instructions.map[0x35].apply(cpu);
  return 8;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_HL_m = (cpu: CPU): number => {
  Instructions.map[0x36].apply(cpu);
  return 16;
};

/**
 * Swap upper and lower nibbles.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SWAP_A_i = (cpu: CPU): number => {
  Instructions.map[0x37].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_B_i = (cpu: CPU): number => {
  Instructions.map[0x38].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_C_i = (cpu: CPU): number => {
  Instructions.map[0x39].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_D_i = (cpu: CPU): number => {
  Instructions.map[0x3a].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_E_i = (cpu: CPU): number => {
  Instructions.map[0x3b].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_H_i = (cpu: CPU): number => {
  Instructions.map[0x3c].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_L_i = (cpu: CPU): number => {
  Instructions.map[0x3d].apply(cpu);
  return 8;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_HL_m = (cpu: CPU): number => {
  Instructions.map[0x3e].apply(cpu);
  return 16;
};

/**
 * Shift n right into Carry. MSB set to 0.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H, C
 */
const SRL_A_i = (cpu: CPU): number => {
  Instructions.map[0x3f].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x40].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x41].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x42].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x43].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x44].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x45].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x46].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_0_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x47].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x48].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x49].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x4a].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x4b].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x4c].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x4d].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x4e].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_1_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x4f].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x50].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x51].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x52].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x53].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x54].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x55].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x56].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_2_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x57].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x58].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x59].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x5a].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x5b].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x5c].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x5d].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x5e].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_3_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x5f].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x60].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x61].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x62].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x63].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x64].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x65].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x66].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_4_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x67].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x68].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x69].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x6a].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x6b].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x6c].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x6d].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x6e].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_5_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x6f].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x70].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x71].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x72].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x73].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x74].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x75].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x76].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_6_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x77].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_B_i = (cpu: CPU): number => {
  Instructions.map[0x78].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_C_i = (cpu: CPU): number => {
  Instructions.map[0x79].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_D_i = (cpu: CPU): number => {
  Instructions.map[0x7a].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_E_i = (cpu: CPU): number => {
  Instructions.map[0x7b].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_H_i = (cpu: CPU): number => {
  Instructions.map[0x7c].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_L_i = (cpu: CPU): number => {
  Instructions.map[0x7d].apply(cpu);
  return 8;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_HL_m = (cpu: CPU): number => {
  Instructions.map[0x7e].apply(cpu);
  return 12;
};

/**
 * Test bit in register
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags: Z, N, H
 */
const BIT_test_7_i_of_A_i = (cpu: CPU): number => {
  Instructions.map[0x7f].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_B = (cpu: CPU): number => {
  Instructions.map[0x80].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_C = (cpu: CPU): number => {
  Instructions.map[0x81].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_D = (cpu: CPU): number => {
  Instructions.map[0x82].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_E = (cpu: CPU): number => {
  Instructions.map[0x83].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_H = (cpu: CPU): number => {
  Instructions.map[0x84].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_L = (cpu: CPU): number => {
  Instructions.map[0x85].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_HL = (cpu: CPU): number => {
  Instructions.map[0x86].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit0_of_A = (cpu: CPU): number => {
  Instructions.map[0x87].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_B = (cpu: CPU): number => {
  Instructions.map[0x88].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_C = (cpu: CPU): number => {
  Instructions.map[0x89].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_D = (cpu: CPU): number => {
  Instructions.map[0x8a].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_E = (cpu: CPU): number => {
  Instructions.map[0x8b].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_H = (cpu: CPU): number => {
  Instructions.map[0x8c].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_L = (cpu: CPU): number => {
  Instructions.map[0x8d].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_HL = (cpu: CPU): number => {
  Instructions.map[0x8e].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit1_of_A = (cpu: CPU): number => {
  Instructions.map[0x8f].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_B = (cpu: CPU): number => {
  Instructions.map[0x90].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_C = (cpu: CPU): number => {
  Instructions.map[0x91].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_D = (cpu: CPU): number => {
  Instructions.map[0x92].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_E = (cpu: CPU): number => {
  Instructions.map[0x93].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_H = (cpu: CPU): number => {
  Instructions.map[0x94].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_L = (cpu: CPU): number => {
  Instructions.map[0x95].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_HL = (cpu: CPU): number => {
  Instructions.map[0x96].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit2_of_A = (cpu: CPU): number => {
  Instructions.map[0x97].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_B = (cpu: CPU): number => {
  Instructions.map[0x98].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_C = (cpu: CPU): number => {
  Instructions.map[0x99].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_D = (cpu: CPU): number => {
  Instructions.map[0x9a].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_E = (cpu: CPU): number => {
  Instructions.map[0x9b].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_H = (cpu: CPU): number => {
  Instructions.map[0x9c].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_L = (cpu: CPU): number => {
  Instructions.map[0x9d].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_HL = (cpu: CPU): number => {
  Instructions.map[0x9e].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit3_of_A = (cpu: CPU): number => {
  Instructions.map[0x9f].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_B = (cpu: CPU): number => {
  Instructions.map[0xa0].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_C = (cpu: CPU): number => {
  Instructions.map[0xa1].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_D = (cpu: CPU): number => {
  Instructions.map[0xa2].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_E = (cpu: CPU): number => {
  Instructions.map[0xa3].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_H = (cpu: CPU): number => {
  Instructions.map[0xa4].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_L = (cpu: CPU): number => {
  Instructions.map[0xa5].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_HL = (cpu: CPU): number => {
  Instructions.map[0xa6].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit4_of_A = (cpu: CPU): number => {
  Instructions.map[0xa7].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_B = (cpu: CPU): number => {
  Instructions.map[0xa8].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_C = (cpu: CPU): number => {
  Instructions.map[0xa9].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_D = (cpu: CPU): number => {
  Instructions.map[0xaa].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_E = (cpu: CPU): number => {
  Instructions.map[0xab].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_H = (cpu: CPU): number => {
  Instructions.map[0xac].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_L = (cpu: CPU): number => {
  Instructions.map[0xad].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_HL = (cpu: CPU): number => {
  Instructions.map[0xae].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit5_of_A = (cpu: CPU): number => {
  Instructions.map[0xaf].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_B = (cpu: CPU): number => {
  Instructions.map[0xb0].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_C = (cpu: CPU): number => {
  Instructions.map[0xb1].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_D = (cpu: CPU): number => {
  Instructions.map[0xb2].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_E = (cpu: CPU): number => {
  Instructions.map[0xb3].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_H = (cpu: CPU): number => {
  Instructions.map[0xb4].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_L = (cpu: CPU): number => {
  Instructions.map[0xb5].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_HL = (cpu: CPU): number => {
  Instructions.map[0xb6].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit6_of_A = (cpu: CPU): number => {
  Instructions.map[0xb7].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_B = (cpu: CPU): number => {
  Instructions.map[0xb8].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_C = (cpu: CPU): number => {
  Instructions.map[0xb9].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_D = (cpu: CPU): number => {
  Instructions.map[0xba].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_E = (cpu: CPU): number => {
  Instructions.map[0xbb].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_H = (cpu: CPU): number => {
  Instructions.map[0xbc].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_L = (cpu: CPU): number => {
  Instructions.map[0xbd].apply(cpu);
  return 8;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_HL = (cpu: CPU): number => {
  Instructions.map[0xbe].apply(cpu);
  return 16;
};

/**
 * Reset bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const RES_bit7_of_A = (cpu: CPU): number => {
  Instructions.map[0xbf].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_B = (cpu: CPU): number => {
  Instructions.map[0xc0].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_C = (cpu: CPU): number => {
  Instructions.map[0xc1].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_D = (cpu: CPU): number => {
  Instructions.map[0xc2].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_E = (cpu: CPU): number => {
  Instructions.map[0xc3].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_H = (cpu: CPU): number => {
  Instructions.map[0xc4].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_L = (cpu: CPU): number => {
  Instructions.map[0xc5].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_HL = (cpu: CPU): number => {
  Instructions.map[0xc6].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit0_of_A = (cpu: CPU): number => {
  Instructions.map[0xc7].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_B = (cpu: CPU): number => {
  Instructions.map[0xc8].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_C = (cpu: CPU): number => {
  Instructions.map[0xc9].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_D = (cpu: CPU): number => {
  Instructions.map[0xca].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_E = (cpu: CPU): number => {
  Instructions.map[0xcb].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_H = (cpu: CPU): number => {
  Instructions.map[0xcc].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_L = (cpu: CPU): number => {
  Instructions.map[0xcd].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_HL = (cpu: CPU): number => {
  Instructions.map[0xce].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit1_of_A = (cpu: CPU): number => {
  Instructions.map[0xcf].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_B = (cpu: CPU): number => {
  Instructions.map[0xd0].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_C = (cpu: CPU): number => {
  Instructions.map[0xd1].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_D = (cpu: CPU): number => {
  Instructions.map[0xd2].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_E = (cpu: CPU): number => {
  Instructions.map[0xd3].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_H = (cpu: CPU): number => {
  Instructions.map[0xd4].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_L = (cpu: CPU): number => {
  Instructions.map[0xd5].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_HL = (cpu: CPU): number => {
  Instructions.map[0xd6].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit2_of_A = (cpu: CPU): number => {
  Instructions.map[0xd7].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_B = (cpu: CPU): number => {
  Instructions.map[0xd8].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_C = (cpu: CPU): number => {
  Instructions.map[0xd9].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_D = (cpu: CPU): number => {
  Instructions.map[0xda].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_E = (cpu: CPU): number => {
  Instructions.map[0xdb].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_H = (cpu: CPU): number => {
  Instructions.map[0xdc].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_L = (cpu: CPU): number => {
  Instructions.map[0xdd].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_HL = (cpu: CPU): number => {
  Instructions.map[0xde].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit3_of_A = (cpu: CPU): number => {
  Instructions.map[0xdf].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_B = (cpu: CPU): number => {
  Instructions.map[0xe0].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_C = (cpu: CPU): number => {
  Instructions.map[0xe1].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_D = (cpu: CPU): number => {
  Instructions.map[0xe2].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_E = (cpu: CPU): number => {
  Instructions.map[0xe3].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_H = (cpu: CPU): number => {
  Instructions.map[0xe4].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_L = (cpu: CPU): number => {
  Instructions.map[0xe5].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_HL = (cpu: CPU): number => {
  Instructions.map[0xe6].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit4_of_A = (cpu: CPU): number => {
  Instructions.map[0xe7].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_B = (cpu: CPU): number => {
  Instructions.map[0xe8].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_C = (cpu: CPU): number => {
  Instructions.map[0xe9].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_D = (cpu: CPU): number => {
  Instructions.map[0xea].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_E = (cpu: CPU): number => {
  Instructions.map[0xeb].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_H = (cpu: CPU): number => {
  Instructions.map[0xec].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_L = (cpu: CPU): number => {
  Instructions.map[0xed].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_HL = (cpu: CPU): number => {
  Instructions.map[0xee].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit5_of_A = (cpu: CPU): number => {
  Instructions.map[0xef].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_B = (cpu: CPU): number => {
  Instructions.map[0xf0].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_C = (cpu: CPU): number => {
  Instructions.map[0xf1].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_D = (cpu: CPU): number => {
  Instructions.map[0xf2].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_E = (cpu: CPU): number => {
  Instructions.map[0xf3].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_H = (cpu: CPU): number => {
  Instructions.map[0xf4].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_L = (cpu: CPU): number => {
  Instructions.map[0xf5].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_HL = (cpu: CPU): number => {
  Instructions.map[0xf6].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit6_of_A = (cpu: CPU): number => {
  Instructions.map[0xf7].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_B = (cpu: CPU): number => {
  Instructions.map[0xf8].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_C = (cpu: CPU): number => {
  Instructions.map[0xf9].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_D = (cpu: CPU): number => {
  Instructions.map[0xfa].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_E = (cpu: CPU): number => {
  Instructions.map[0xfb].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_H = (cpu: CPU): number => {
  Instructions.map[0xfc].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_L = (cpu: CPU): number => {
  Instructions.map[0xfd].apply(cpu);
  return 8;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_HL = (cpu: CPU): number => {
  Instructions.map[0xfe].apply(cpu);
  return 16;
};

/**
 * Set bit b in register r.
 * @param - CPU class.
 * @returns - Number of system clock ticks used.
 * Affected flags:
 */
const SET_bit7_of_A = (cpu: CPU): number => {
  Instructions.map[0xff].apply(cpu);
  return 8;
};

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
  0x18: JR_to_A_i__r8_i,
  0x19: ADD_into_HL_i_from_DE_i,
  0x1a: LD_into_A_i_from_DE_m,
  0x1b: DEC_DE_i,
  0x1c: INC_E_i,
  0x1d: DEC_E_i,
  0x1e: LD_into_E_i_from_d8_i,
  0x1f: RRA,
  0x20: JR_to_NZ_i__r8_i,
  0x21: LD_into_HL_i_from_d16_i,
  0x22: LD_into_HL_incr_m_from_A_i,
  0x23: INC_HL_i,
  0x24: INC_H_i,
  0x25: DEC_H_i,
  0x26: LD_into_H_i_from_d8_i,
  0x27: DAA_A,
  0x28: JR_to_Z_i__r8_i,
  0x29: ADD_into_HL_i_from_HL_i,
  0x2a: LD_into_A_i_from_HL_incr_m,
  0x2b: DEC_HL_i,
  0x2c: INC_L_i,
  0x2d: DEC_L_i,
  0x2e: LD_into_L_i_from_d8_i,
  0x2f: CPL_A,
  0x30: JR_to_NC_i__r8_i,
  0x31: LD_into_SP_i_from_d16_i,
  0x32: LD_into_HL_decr_m_from_A_i,
  0x33: INC_SP_i,
  0x34: INC_HL_m,
  0x35: DEC_HL_m,
  0x36: LD_into_HL_m_from_d8_i,
  0x37: SCF,
  0x38: JR_to_C_i__r8_i,
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
  0xa0: AND_A_with_B,
  0xa1: AND_A_with_C,
  0xa2: AND_A_with_D,
  0xa3: AND_A_with_E,
  0xa4: AND_A_with_H,
  0xa5: AND_A_with_L,
  0xa6: AND_A_with_HL,
  0xa7: AND_A_with_A,
  0xa8: XOR_A_with_B,
  0xa9: XOR_A_with_C,
  0xaa: XOR_A_with_D,
  0xab: XOR_A_with_E,
  0xac: XOR_A_with_H,
  0xad: XOR_A_with_L,
  0xae: XOR_A_with_HL,
  0xaf: XOR_A_with_A,
  0xb0: OR_A_with_B,
  0xb1: OR_A_with_C,
  0xb2: OR_A_with_D,
  0xb3: OR_A_with_E,
  0xb4: OR_A_with_H,
  0xb5: OR_A_with_L,
  0xb6: OR_A_with_HL,
  0xb7: OR_A_with_A,
  0xb8: CP_A_with_B,
  0xb9: CP_A_with_C,
  0xba: CP_A_with_D,
  0xbb: CP_A_with_E,
  0xbc: CP_A_with_H,
  0xbd: CP_A_with_L,
  0xbe: CP_A_with_HL,
  0xbf: CP_A_with_A,
  0xc0: RET_to_A_i__NZ_i,
  0xc1: POP_off_SP_into_BC_i,
  0xc2: JP_to_NZ_i__a16_i,
  0xc3: JP_to_A_i__a16_i,
  0xc4: CALL_to_NZ_i_from_a16_i,
  0xc5: PUSH_onto_SP_register_BC_i,
  0xc6: ADD_into_A_i_from_d8_i,
  0xc7: RST_to_A_i_from_00H_i,
  0xc8: RET_to_A_i__Z_i,
  0xc9: RET,
  0xca: JP_to_Z_i__a16_i,
  0xcb: PREFIX,
  0xcc: CALL_to_Z_i_from_a16_i,
  0xcd: CALL_to_A_i_from_a16_i,
  0xce: ADC_into_A_i_from_d8_i,
  0xcf: RST_to_A_i_from_08H_i,
  0xd0: RET_to_A_i__NC_i,
  0xd1: POP_off_SP_into_DE_i,
  0xd2: JP_to_NC_i__a16_i,
  0xd3: ILLEGAL_D3,
  0xd4: CALL_to_NC_i_from_a16_i,
  0xd5: PUSH_onto_SP_register_DE_i,
  0xd6: SUB_from_A_i_value_d8_i,
  0xd7: RST_to_A_i_from_10H_i,
  0xd8: RET_to_A_i__C_i,
  0xd9: RETI,
  0xda: JP_to_C_i__a16_i,
  0xdb: ILLEGAL_DB,
  0xdc: CALL_to_C_i_from_a16_i,
  0xdd: ILLEGAL_DD,
  0xde: SBC_from_A_i_value_d8_i,
  0xdf: RST_to_A_i_from_18H_i,
  0xe0: LDH_into_a8_m_from_A_i,
  0xe1: POP_off_SP_into_HL_i,
  0xe2: LD_into_C_m_from_A_i,
  0xe3: ILLEGAL_E3,
  0xe4: ILLEGAL_E4,
  0xe5: PUSH_onto_SP_register_HL_i,
  0xe6: AND_A_with_d8,
  0xe7: RST_to_A_i_from_20H_i,
  0xe8: ADD_into_SP_i_from_r8_i,
  0xe9: JP_to_A_i__HL_i,
  0xea: LD_into_a16_m_from_A_i,
  0xeb: ILLEGAL_EB,
  0xec: ILLEGAL_EC,
  0xed: ILLEGAL_ED,
  0xee: XOR_A_with_d8,
  0xef: RST_to_A_i_from_28H_i,
  0xf0: LDH_into_A_i_from_a8_m,
  0xf1: POP_off_SP_into_AF_i,
  0xf2: LD_into_A_i_from_C_m,
  0xf3: DI,
  0xf4: ILLEGAL_F4,
  0xf5: PUSH_onto_SP_register_AF_i,
  0xf6: OR_A_with_d8,
  0xf7: RST_to_A_i_from_30H_i,
  0xf8: LD_into_HL_i_from_SP_incr_i,
  0xf9: LD_into_SP_i_from_HL_i,
  0xfa: LD_into_A_i_from_a16_m,
  0xfb: EI,
  0xfc: ILLEGAL_FC,
  0xfd: ILLEGAL_FD,
  0xfe: CP_A_with_d8,
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
