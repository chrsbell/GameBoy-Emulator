import {byte, setBit, word} from '../../Types';
import Memory from '../Memory';

interface GBInterrupt {
  vBlank: number;
  lcdStat: number;
  timer: number;
  serial: number;
  joypad: number;
  ie: word;
  if: word;
}

const Interrupt: GBInterrupt = {
  vBlank: 0,
  lcdStat: 1,
  timer: 2,
  serial: 3,
  joypad: 4,
  ie: 0xffff,
  if: 0xff0f,
};

/**
 * Enables the interrupt corresponding to the index.
 */
export const enableInterrupt = (memory: Memory, index: number): void => {
  const register: byte = memory.readByte(0xff0f);
  memory.writeByte(0xff0f, setBit(register, index));
};

export default Interrupt;
