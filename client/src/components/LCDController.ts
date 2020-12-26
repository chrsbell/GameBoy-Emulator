// constructs pixel data

export const Color = {
  white: [160 / 255, 207 / 255, 10 / 255],
  lightGray: [140 / 255, 191 / 255, 11 / 255],
  darkGray: [46 / 255, 115 / 255, 31 / 255],
  black: [2 / 255, 63 / 255, 1 / 255],
};

class LCDController {
  private screen: Array<Number>;
  public width: number = 160;
  public height: number = 144;
  constructor() {
    this.screen = Array(this.width).fill(Array(this.height).fill(Color.white));
  }
}

export default new LCDController();
