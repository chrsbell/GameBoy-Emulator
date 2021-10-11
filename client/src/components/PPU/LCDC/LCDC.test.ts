import LCDControl from '.';

describe('LCDControl', () => {
  it('sets the value of the lcdc', () => {
    const control = new LCDControl();
    control.update(170);
    expect(control.bgWindowEnable).toBe(0);
    expect(control.objEnable).toBe(1);
    expect(control.objSize).toBe(0);
    expect(control.bgTileMapArea).toBe(1);
    expect(control.bgWindowEnable).toBe(0);
    expect(control.windowEnable).toBe(1);
    expect(control.bgTileMapArea).toBe(0);
    expect(control.enable).toBe(1);
  });
});
