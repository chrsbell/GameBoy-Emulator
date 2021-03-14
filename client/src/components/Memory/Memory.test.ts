import Memory from '.';

describe('Memory', () => {
  beforeEach(() => {
    Memory.reset();
  });
  it('initializes the Memory module', () => {
    expect(Memory).toBeDefined();
  });
  it('identifies MBC type 0 carts', () => {
    Memory.load(null, new Uint8Array([...Array(8192).fill(0)]));
    expect(Memory.cart.MBCType).toEqual(0);
  });
  it('identifies MBC type 0 carts', () => {
    const rom = new Uint8Array([...Array(8192).fill(0)]);
    rom[0x147] = 1;
    Memory.load(null, rom);
    expect(Memory.cart.MBCType).toEqual(1);
  });
});
