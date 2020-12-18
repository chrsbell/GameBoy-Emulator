// The LCD Controller contains the BG/Window and OAM buffers

class LCDController {
  constructor() {
    this._oam = Array(256).fill(Array(256).fill(0));
    this._windowBuffer = Array(256).fill(Array(256).fill(0));
  }
}

export default LCDController;