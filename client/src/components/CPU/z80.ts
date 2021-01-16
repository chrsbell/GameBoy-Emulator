export default {
  /**
   * No operation.
   */
  NOP: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_BC_i_from_d16_i: (): number => {
    return 12;
  },

  /**
   * Load data into the register.
   */
  LD_into_BC_m_from_A_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_a16_m_from_SP_i: (): number => {
    return 20;
  },

  /**
   * Add.
   */
  ADD_into_HL_i_from_BC_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_BC_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_DE_i_from_d16_i: (): number => {
    return 12;
  },

  /**
   * Load data into the register.
   */
  LD_into_DE_m_from_A_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional jump to the relative address.
   */
  JR_to_A_i__r8_i: (): number => {
    return 12;
  },

  /**
   * Add.
   */
  ADD_into_HL_i_from_DE_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_DE_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional jump to the relative address.
   */
  JR_to_NZ_i__r8_i: (): number => {
    return 12, 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_i_from_d16_i: (): number => {
    return 12;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_incr_m_from_A_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional jump to the relative address.
   */
  JR_to_Z_i__r8_i: (): number => {
    return 12, 8;
  },

  /**
   * Add.
   */
  ADD_into_HL_i_from_HL_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_HL_incr_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional jump to the relative address.
   */
  JR_to_NC_i__r8_i: (): number => {
    return 12, 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_SP_i_from_d16_i: (): number => {
    return 12;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_decr_m_from_A_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_d8_i: (): number => {
    return 12;
  },

  /**
   * Unconditional jump to the relative address.
   */
  JR_to_C_i__r8_i: (): number => {
    return 12, 8;
  },

  /**
   * Add.
   */
  ADD_into_HL_i_from_SP_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_HL_decr_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_B_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_D_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_E_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_H_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_L_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_B_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_C_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_D_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_E_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_H_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_L_i: (): number => {
    return 8;
  },

  /**
   * Disables interrupt handling.
   */
  HALT: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_m_from_A_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_B_i: (): number => {
    return 4;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_C_i: (): number => {
    return 4;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_D_i: (): number => {
    return 4;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_E_i: (): number => {
    return 4;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_H_i: (): number => {
    return 4;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_L_i: (): number => {
    return 4;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_HL_m: (): number => {
    return 8;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_A_i: (): number => {
    return 4;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_B_i: (): number => {
    return 4;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_C_i: (): number => {
    return 4;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_D_i: (): number => {
    return 4;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_E_i: (): number => {
    return 4;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_H_i: (): number => {
    return 4;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_L_i: (): number => {
    return 4;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_HL_m: (): number => {
    return 8;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_A_i: (): number => {
    return 4;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_B_i: (): number => {
    return 4;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_C_i: (): number => {
    return 4;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_D_i: (): number => {
    return 4;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_E_i: (): number => {
    return 4;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_H_i: (): number => {
    return 4;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_L_i: (): number => {
    return 4;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_HL_m: (): number => {
    return 8;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_A_i: (): number => {
    return 4;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__B_i: (): number => {
    return 4;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__C_i: (): number => {
    return 4;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__D_i: (): number => {
    return 4;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__E_i: (): number => {
    return 4;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__H_i: (): number => {
    return 4;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__L_i: (): number => {
    return 4;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__HL_m: (): number => {
    return 8;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__A_i: (): number => {
    return 4;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__B_i: (): number => {
    return 4;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__C_i: (): number => {
    return 4;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__D_i: (): number => {
    return 4;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__E_i: (): number => {
    return 4;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__H_i: (): number => {
    return 4;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__L_i: (): number => {
    return 4;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__HL_m: (): number => {
    return 8;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__A_i: (): number => {
    return 4;
  },

  /**
   * Return from a function.
   */
  RET_to_A_i__NZ_i: (): number => {
    return 20, 8;
  },

  /**
   * Pops to the 16-bit register, data from the stack memory.
   */
  POP_off_SP_into_BC_i: (): number => {
    return 12;
  },

  /**
   * Unconditional jump to the absolute address specified by the 16-bit operand
   */
  JP_to_NZ_i__a16_i: (): number => {
    return 16, 12;
  },

  /**
   * Unconditional jump to the absolute address specified by the 16-bit operand
   */
  JP_to_A_i__a16_i: (): number => {
    return 16;
  },

  /**
   * Function call to the absolute address.
   */
  CALL_to_NZ_i_from_a16_i: (): number => {
    return 24, 12;
  },

  /**
   * Push to the stack memory, data from the 16-bit register.
   */
  PUSH_onto_SP_register_BC_i: (): number => {
    return 16;
  },

  /**
   * Add.
   */
  ADD_into_A_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_00H_i: (): number => {
    return 16;
  },

  /**
   * Return from a function.
   */
  RET_to_A_i__Z_i: (): number => {
    return 20, 8;
  },

  /**
   * Return from a function.
   */
  RET: (): number => {
    return 16;
  },

  /**
   * Unconditional jump to the absolute address specified by the 16-bit operand
   */
  JP_to_Z_i__a16_i: (): number => {
    return 16, 12;
  },

  /**
   * Function call to the absolute address.
   */
  CALL_to_Z_i_from_a16_i: (): number => {
    return 24, 12;
  },

  /**
   * Function call to the absolute address.
   */
  CALL_to_A_i_from_a16_i: (): number => {
    return 24;
  },

  /**
   * Add with carry flag.
   */
  ADC_into_A_i_from_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_08H_i: (): number => {
    return 16;
  },

  /**
   * Return from a function.
   */
  RET_to_A_i__NC_i: (): number => {
    return 20, 8;
  },

  /**
   * Pops to the 16-bit register, data from the stack memory.
   */
  POP_off_SP_into_DE_i: (): number => {
    return 12;
  },

  /**
   * Unconditional jump to the absolute address specified by the 16-bit operand
   */
  JP_to_NC_i__a16_i: (): number => {
    return 16, 12;
  },

  /**
   * Function call to the absolute address.
   */
  CALL_to_NC_i_from_a16_i: (): number => {
    return 24, 12;
  },

  /**
   * Push to the stack memory, data from the 16-bit register.
   */
  PUSH_onto_SP_register_DE_i: (): number => {
    return 16;
  },

  /**
   * Subtract.
   */
  SUB_from_A_i_value_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_10H_i: (): number => {
    return 16;
  },

  /**
   * Return from a function.
   */
  RET_to_A_i__C_i: (): number => {
    return 20, 8;
  },

  /**
   * Return from a function.
   */
  RETI: (): number => {
    return 16;
  },

  /**
   * Unconditional jump to the absolute address specified by the 16-bit operand
   */
  JP_to_C_i__a16_i: (): number => {
    return 16, 12;
  },

  /**
   * Function call to the absolute address.
   */
  CALL_to_C_i_from_a16_i: (): number => {
    return 24, 12;
  },

  /**
   * Subtract with carry flag.
   */
  SBC_from_A_i_value_d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_18H_i: (): number => {
    return 16;
  },

  /**
   * Pops to the 16-bit register, data from the stack memory.
   */
  POP_off_SP_into_HL_i: (): number => {
    return 12;
  },

  /**
   * Load data into the register.
   */
  LD_into_C_m_from_A_i: (): number => {
    return 8;
  },

  /**
   * Push to the stack memory, data from the 16-bit register.
   */
  PUSH_onto_SP_register_HL_i: (): number => {
    return 16;
  },

  /**
   * Logical AND.
   */
  AND_with_A_i__d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_20H_i: (): number => {
    return 16;
  },

  /**
   * Add.
   */
  ADD_into_SP_i_from_r8_i: (): number => {
    return 16;
  },

  /**
   * Unconditional jump to the absolute address specified by the 16-bit operand
   */
  JP_to_A_i__HL_i: (): number => {
    return 4;
  },

  /**
   * Load data into the register.
   */
  LD_into_a16_m_from_A_i: (): number => {
    return 16;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_28H_i: (): number => {
    return 16;
  },

  /**
   * Pops to the 16-bit register, data from the stack memory.
   */
  POP_off_SP_into_AF_i: (): number => {
    return 12;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_C_m: (): number => {
    return 8;
  },

  /**
   * Disables interrupt handling.
   */
  DI: (): number => {
    return 4;
  },

  /**
   * Push to the stack memory, data from the 16-bit register.
   */
  PUSH_onto_SP_register_AF_i: (): number => {
    return 16;
  },

  /**
   * Logical OR.
   */
  OR_with_A_i__d8_i: (): number => {
    return 8;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_30H_i: (): number => {
    return 16;
  },

  /**
   * Load data into the register.
   */
  LD_into_HL_i_from_SP_incr_i: (): number => {
    return 12;
  },

  /**
   * Load data into the register.
   */
  LD_into_SP_i_from_HL_i: (): number => {
    return 8;
  },

  /**
   * Load data into the register.
   */
  LD_into_A_i_from_a16_m: (): number => {
    return 16;
  },

  /**
   * Disables interrupt handling.
   */
  EI: (): number => {
    return 4;
  },

  /**
   * Unconditional function call to the absolute fixed address
   */
  RST_to_A_i_from_38H_i: (): number => {
    return 16;
  },
};
const map = {
  0x00: z80.NOP,
  0x01: z80.LD_into_BC_i_from_d16_i,
  0x02: z80.LD_into_BC_m_from_A_i,
  0x06: z80.LD_into_B_i_from_d8_i,
  0x08: z80.LD_into_a16_m_from_SP_i,
  0x09: z80.ADD_into_HL_i_from_BC_i,
  0x0a: z80.LD_into_A_i_from_BC_m,
  0x0e: z80.LD_into_C_i_from_d8_i,
  0x11: z80.LD_into_DE_i_from_d16_i,
  0x12: z80.LD_into_DE_m_from_A_i,
  0x16: z80.LD_into_D_i_from_d8_i,
  0x18: z80.JR_to_A_i__r8_i,
  0x19: z80.ADD_into_HL_i_from_DE_i,
  0x1a: z80.LD_into_A_i_from_DE_m,
  0x1e: z80.LD_into_E_i_from_d8_i,
  0x20: z80.JR_to_NZ_i__r8_i,
  0x21: z80.LD_into_HL_i_from_d16_i,
  0x22: z80.LD_into_HL_incr_m_from_A_i,
  0x26: z80.LD_into_H_i_from_d8_i,
  0x28: z80.JR_to_Z_i__r8_i,
  0x29: z80.ADD_into_HL_i_from_HL_i,
  0x2a: z80.LD_into_A_i_from_HL_incr_m,
  0x2e: z80.LD_into_L_i_from_d8_i,
  0x30: z80.JR_to_NC_i__r8_i,
  0x31: z80.LD_into_SP_i_from_d16_i,
  0x32: z80.LD_into_HL_decr_m_from_A_i,
  0x36: z80.LD_into_HL_m_from_d8_i,
  0x38: z80.JR_to_C_i__r8_i,
  0x39: z80.ADD_into_HL_i_from_SP_i,
  0x3a: z80.LD_into_A_i_from_HL_decr_m,
  0x3e: z80.LD_into_A_i_from_d8_i,
  0x40: z80.LD_into_B_i_from_B_i,
  0x41: z80.LD_into_B_i_from_C_i,
  0x42: z80.LD_into_B_i_from_D_i,
  0x43: z80.LD_into_B_i_from_E_i,
  0x44: z80.LD_into_B_i_from_H_i,
  0x45: z80.LD_into_B_i_from_L_i,
  0x46: z80.LD_into_B_i_from_HL_m,
  0x47: z80.LD_into_B_i_from_A_i,
  0x48: z80.LD_into_C_i_from_B_i,
  0x49: z80.LD_into_C_i_from_C_i,
  0x4a: z80.LD_into_C_i_from_D_i,
  0x4b: z80.LD_into_C_i_from_E_i,
  0x4c: z80.LD_into_C_i_from_H_i,
  0x4d: z80.LD_into_C_i_from_L_i,
  0x4e: z80.LD_into_C_i_from_HL_m,
  0x4f: z80.LD_into_C_i_from_A_i,
  0x50: z80.LD_into_D_i_from_B_i,
  0x51: z80.LD_into_D_i_from_C_i,
  0x52: z80.LD_into_D_i_from_D_i,
  0x53: z80.LD_into_D_i_from_E_i,
  0x54: z80.LD_into_D_i_from_H_i,
  0x55: z80.LD_into_D_i_from_L_i,
  0x56: z80.LD_into_D_i_from_HL_m,
  0x57: z80.LD_into_D_i_from_A_i,
  0x58: z80.LD_into_E_i_from_B_i,
  0x59: z80.LD_into_E_i_from_C_i,
  0x5a: z80.LD_into_E_i_from_D_i,
  0x5b: z80.LD_into_E_i_from_E_i,
  0x5c: z80.LD_into_E_i_from_H_i,
  0x5d: z80.LD_into_E_i_from_L_i,
  0x5e: z80.LD_into_E_i_from_HL_m,
  0x5f: z80.LD_into_E_i_from_A_i,
  0x60: z80.LD_into_H_i_from_B_i,
  0x61: z80.LD_into_H_i_from_C_i,
  0x62: z80.LD_into_H_i_from_D_i,
  0x63: z80.LD_into_H_i_from_E_i,
  0x64: z80.LD_into_H_i_from_H_i,
  0x65: z80.LD_into_H_i_from_L_i,
  0x66: z80.LD_into_H_i_from_HL_m,
  0x67: z80.LD_into_H_i_from_A_i,
  0x68: z80.LD_into_L_i_from_B_i,
  0x69: z80.LD_into_L_i_from_C_i,
  0x6a: z80.LD_into_L_i_from_D_i,
  0x6b: z80.LD_into_L_i_from_E_i,
  0x6c: z80.LD_into_L_i_from_H_i,
  0x6d: z80.LD_into_L_i_from_L_i,
  0x6e: z80.LD_into_L_i_from_HL_m,
  0x6f: z80.LD_into_L_i_from_A_i,
  0x70: z80.LD_into_HL_m_from_B_i,
  0x71: z80.LD_into_HL_m_from_C_i,
  0x72: z80.LD_into_HL_m_from_D_i,
  0x73: z80.LD_into_HL_m_from_E_i,
  0x74: z80.LD_into_HL_m_from_H_i,
  0x75: z80.LD_into_HL_m_from_L_i,
  0x76: z80.HALT,
  0x77: z80.LD_into_HL_m_from_A_i,
  0x78: z80.LD_into_A_i_from_B_i,
  0x79: z80.LD_into_A_i_from_C_i,
  0x7a: z80.LD_into_A_i_from_D_i,
  0x7b: z80.LD_into_A_i_from_E_i,
  0x7c: z80.LD_into_A_i_from_H_i,
  0x7d: z80.LD_into_A_i_from_L_i,
  0x7e: z80.LD_into_A_i_from_HL_m,
  0x7f: z80.LD_into_A_i_from_A_i,
  0x80: z80.ADD_into_A_i_from_B_i,
  0x81: z80.ADD_into_A_i_from_C_i,
  0x82: z80.ADD_into_A_i_from_D_i,
  0x83: z80.ADD_into_A_i_from_E_i,
  0x84: z80.ADD_into_A_i_from_H_i,
  0x85: z80.ADD_into_A_i_from_L_i,
  0x86: z80.ADD_into_A_i_from_HL_m,
  0x87: z80.ADD_into_A_i_from_A_i,
  0x88: z80.ADC_into_A_i_from_B_i,
  0x89: z80.ADC_into_A_i_from_C_i,
  0x8a: z80.ADC_into_A_i_from_D_i,
  0x8b: z80.ADC_into_A_i_from_E_i,
  0x8c: z80.ADC_into_A_i_from_H_i,
  0x8d: z80.ADC_into_A_i_from_L_i,
  0x8e: z80.ADC_into_A_i_from_HL_m,
  0x8f: z80.ADC_into_A_i_from_A_i,
  0x90: z80.SUB_from_A_i_value_B_i,
  0x91: z80.SUB_from_A_i_value_C_i,
  0x92: z80.SUB_from_A_i_value_D_i,
  0x93: z80.SUB_from_A_i_value_E_i,
  0x94: z80.SUB_from_A_i_value_H_i,
  0x95: z80.SUB_from_A_i_value_L_i,
  0x96: z80.SUB_from_A_i_value_HL_m,
  0x97: z80.SUB_from_A_i_value_A_i,
  0x98: z80.SBC_from_A_i_value_B_i,
  0x99: z80.SBC_from_A_i_value_C_i,
  0x9a: z80.SBC_from_A_i_value_D_i,
  0x9b: z80.SBC_from_A_i_value_E_i,
  0x9c: z80.SBC_from_A_i_value_H_i,
  0x9d: z80.SBC_from_A_i_value_L_i,
  0x9e: z80.SBC_from_A_i_value_HL_m,
  0x9f: z80.SBC_from_A_i_value_A_i,
  0xa0: z80.AND_with_A_i__B_i,
  0xa1: z80.AND_with_A_i__C_i,
  0xa2: z80.AND_with_A_i__D_i,
  0xa3: z80.AND_with_A_i__E_i,
  0xa4: z80.AND_with_A_i__H_i,
  0xa5: z80.AND_with_A_i__L_i,
  0xa6: z80.AND_with_A_i__HL_m,
  0xa7: z80.AND_with_A_i__A_i,
  0xb0: z80.OR_with_A_i__B_i,
  0xb1: z80.OR_with_A_i__C_i,
  0xb2: z80.OR_with_A_i__D_i,
  0xb3: z80.OR_with_A_i__E_i,
  0xb4: z80.OR_with_A_i__H_i,
  0xb5: z80.OR_with_A_i__L_i,
  0xb6: z80.OR_with_A_i__HL_m,
  0xb7: z80.OR_with_A_i__A_i,
  0xc0: z80.RET_to_A_i__NZ_i,
  0xc1: z80.POP_off_SP_into_BC_i,
  0xc2: z80.JP_to_NZ_i__a16_i,
  0xc3: z80.JP_to_A_i__a16_i,
  0xc4: z80.CALL_to_NZ_i_from_a16_i,
  0xc5: z80.PUSH_onto_SP_register_BC_i,
  0xc6: z80.ADD_into_A_i_from_d8_i,
  0xc7: z80.RST_to_A_i_from_00H_i,
  0xc8: z80.RET_to_A_i__Z_i,
  0xc9: z80.RET,
  0xca: z80.JP_to_Z_i__a16_i,
  0xcc: z80.CALL_to_Z_i_from_a16_i,
  0xcd: z80.CALL_to_A_i_from_a16_i,
  0xce: z80.ADC_into_A_i_from_d8_i,
  0xcf: z80.RST_to_A_i_from_08H_i,
  0xd0: z80.RET_to_A_i__NC_i,
  0xd1: z80.POP_off_SP_into_DE_i,
  0xd2: z80.JP_to_NC_i__a16_i,
  0xd4: z80.CALL_to_NC_i_from_a16_i,
  0xd5: z80.PUSH_onto_SP_register_DE_i,
  0xd6: z80.SUB_from_A_i_value_d8_i,
  0xd7: z80.RST_to_A_i_from_10H_i,
  0xd8: z80.RET_to_A_i__C_i,
  0xd9: z80.RETI,
  0xda: z80.JP_to_C_i__a16_i,
  0xdc: z80.CALL_to_C_i_from_a16_i,
  0xde: z80.SBC_from_A_i_value_d8_i,
  0xdf: z80.RST_to_A_i_from_18H_i,
  0xe1: z80.POP_off_SP_into_HL_i,
  0xe2: z80.LD_into_C_m_from_A_i,
  0xe5: z80.PUSH_onto_SP_register_HL_i,
  0xe6: z80.AND_with_A_i__d8_i,
  0xe7: z80.RST_to_A_i_from_20H_i,
  0xe8: z80.ADD_into_SP_i_from_r8_i,
  0xe9: z80.JP_to_A_i__HL_i,
  0xea: z80.LD_into_a16_m_from_A_i,
  0xef: z80.RST_to_A_i_from_28H_i,
  0xf1: z80.POP_off_SP_into_AF_i,
  0xf2: z80.LD_into_A_i_from_C_m,
  0xf3: z80.DI,
  0xf5: z80.PUSH_onto_SP_register_AF_i,
  0xf6: z80.OR_with_A_i__d8_i,
  0xf7: z80.RST_to_A_i_from_30H_i,
  0xf8: z80.LD_into_HL_i_from_SP_incr_i,
  0xf9: z80.LD_into_SP_i_from_HL_i,
  0xfa: z80.LD_into_A_i_from_a16_m,
  0xfb: z80.EI,
  0xff: z80.RST_to_A_i_from_38H_i,
};
