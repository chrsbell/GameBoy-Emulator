import Emulator from '.';

describe('Emulator', () => {
  it('creates a new instance', () => {
    let gb = new Emulator();
    expect(gb).toBeDefined;
  });
});