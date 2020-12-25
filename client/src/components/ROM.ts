class ROM {
  private buffer: Array<Number>;
  /**
  * Initializes the ROM buffer
  */
  constructor() {
    this.buffer = Array(0x200000).fill(0);
  }
  /**
  * Load a file into ROM
  */
  loadFile() {

  }
}

export default new ROM();