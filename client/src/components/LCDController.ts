// constructs pixel data

enum Color {
  white,
  lightGray,
  darkGray,
  black,
}

class LCDController {
  private screen: Array<Number>;
  public width: number = 160;
  public height: number = 144;
  constructor() {
    this.screen = Array(this.width).fill(Array(this.height).fill(Color.white));
  }
}

export default new LCDController();
