import Emulator from '.';
import CPU from '../CPU';

describe('Emulator', () => {
  const setupEmulator = () => new Emulator();
  it('creates a new instance', () => {
    const gb = setupEmulator();
    expect(gb).toBeDefined;
  });
});
