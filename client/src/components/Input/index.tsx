const Key: StrStrIdx = {Space: 'Space', W: 'KeyW', Escape: 'Escape'};

class Input {
  private keyState: StrBoolIdx = {};
  private keyDebounce: StrBoolIdx = {};
  private keyDebounceTimeout: StrNumIdx = {};
  private static DEBOUNCE_DELAY = 100;

  public mouseX = 0;
  public mouseY = 0;
  constructor() {
    window.addEventListener('keydown', this.setKey);
    window.addEventListener('keyup', this.resetKey);
    window.addEventListener('mousemove', this.setMousePosition);
  }
  public reset = (): void => {
    window.removeEventListener('keydown', this.setKey);
    window.removeEventListener('keyup', this.resetKey);
    window.removeEventListener('mousemove', this.setMousePosition);
  };
  private setMousePosition = (e: MouseEvent): void => {
    this.mouseX = e.x;
    this.mouseY = e.y;
  };
  public unsetKey = (key: string): void => {
    this.keyState[key] = false;
  };
  public debounce = (key: string): void => {
    this.keyDebounce[key] = true;
    window.clearTimeout(this.keyDebounceTimeout[key]);
    this.keyDebounceTimeout[key] = -1;
  };
  private setKey = (e: KeyboardEvent): void => {
    this.keyState[e.code] = true;
  };
  private resetKey = (e: KeyboardEvent): void => {
    this.keyState[e.code] = false;
    if (this.keyDebounceTimeout[e.code] < 0)
      this.keyDebounceTimeout[e.code] = window.setTimeout(
        () => (this.keyDebounce[e.code] = false),
        Input.DEBOUNCE_DELAY
      );
  };
  public down = (code: string): boolean => this.keyState[code] ?? false;
  public pressed = (key: string): boolean =>
    this.down(key) && !this.keyDebounce[key];
}

export default Input;
export {Key};
