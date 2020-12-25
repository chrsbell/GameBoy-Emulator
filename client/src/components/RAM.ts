class RAM {
  private buffer: Array<Number>;
 /**
 * Initializes the RAM buffer
 */
  constructor() {
    this.buffer = Array(0xFFFF + 1).fill(0);
  }
}

export default new RAM();