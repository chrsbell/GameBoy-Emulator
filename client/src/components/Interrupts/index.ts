import {byte, word, setBit} from '../Types';
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
export const enableInterrupt = (index: number): void => {
  const register: byte = Memory.readByte(0xff0f);
  Memory.writeByte(0xff0f, setBit(register, index));
};

export default Interrupt;
