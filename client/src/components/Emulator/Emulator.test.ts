import Emulator from '.';

describe('Emulator', () => {
  it('creates a new instance', () => {
    const gb = new Emulator();
    expect(gb).toBeDefined;
  });
});
