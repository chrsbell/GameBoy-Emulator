const Key: KeyCode = {Space: 'Space', W: 'KeyW', Escape: 'Escape'};

class Input {
  private keystate: KeyState = {};
  private keydebounce: KeyState = {};
  private keydebounceTimeout: KeyDebounceTimeout = {};
  private static DEBOUNCE_DELAY = 100;

  public mouseX = 0;
  public mouseY = 0;
  constructor() {
    // Object.values(Key).forEach(code => (this.keystate[code] = false));
    window.addEventListener('keydown', this.setKey);
    window.addEventListener('keyup', this.resetKey);
    window.addEventListener('mousemove', this.setMousePosition);
  }
  public reset = (): void => {
    // Object.values(Key).forEach(code => delete this.keystate[code]);
    window.removeEventListener('keydown', this.setKey);
    window.removeEventListener('keyup', this.resetKey);
    window.removeEventListener('mousemove', this.setMousePosition);
  };
  private setMousePosition = (e: MouseEvent): void => {
    this.mouseX = e.x;
    this.mouseY = e.y;
  };
  public unsetKey = (key: string): void => {
    this.keystate[key] = false;
  };
  public debounce = (key: string): void => {
    this.keydebounce[key] = true;
    window.clearTimeout(this.keydebounceTimeout[key]);
    this.keydebounceTimeout[key] = -1;
  };
  private setKey = (e: KeyboardEvent): void => {
    this.keystate[e.code] = true;
  };
  private resetKey = (e: KeyboardEvent): void => {
    this.keystate[e.code] = false;
    if (this.keydebounceTimeout[e.code] < 0)
      this.keydebounceTimeout[e.code] = window.setTimeout(
        () => (this.keydebounce[e.code] = false),
        Input.DEBOUNCE_DELAY
      );
  };
  public down = (code: string): boolean => this.keystate[code] ?? false;
  public pressed = (key: string): boolean =>
    this.down(key) && !this.keydebounce[key];
}

export default Input;
export {Key};
