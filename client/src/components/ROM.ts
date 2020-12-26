import type { Hex } from './Types';

class ROM {
  private buffer: Array<Hex>;
  /**
   * Initializes the ROM buffer
   */
  constructor() {
    this.buffer = Array(0x200000).fill(0);
  }
  /**
   * Load a file into ROM
   */
  loadFile(rom: Array<Hex>) {
    console.log('Loaded file into ROM memory.');
  }
}

export default new ROM();
