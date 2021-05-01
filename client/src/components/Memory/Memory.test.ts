import Memory from '.';
import CPU from '../CPU';

describe('Memory', () => {
  const memory = new Memory();
  const cpu = new CPU();
  beforeEach(() => {
    memory.reset();
    cpu.reset();
  });
  it('identifies MBC type 0 carts', () => {
    memory.load(cpu, null, new Uint8Array([...Array(8192).fill(0)]));
    expect(memory.cart.MBCType).toEqual(0);
  });
  it('identifies MBC type 1 carts', () => {
    const rom = new Uint8Array([...Array(8192).fill(0)]);
    rom[0x147] = 1;
    memory.load(cpu, null, rom);
    expect(memory.cart.MBCType).toEqual(1);
  });
});
