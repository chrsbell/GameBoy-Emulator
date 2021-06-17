import Memory, {byteArray} from '.';
import CPU from '../CPU';

describe('Memory', () => {
  const memory = new Memory();
  const cpu = new CPU();
  beforeEach(() => {
    memory.reset();
    cpu.reset();
  });
  const setupMBC0 = (bios: byteArray = []): void => {
    memory.load(cpu, bios, new Uint8Array([...Array(32768).fill(0)]));
  };
  const setupMBC1 = (bios: byteArray = []): void => {
    const rom = new Uint8Array([...Array(65536).fill(0)]);
    rom[0x147] = 1;
    memory.load(cpu, bios, rom);
  };

  it('identifies MBC type 0 carts', () => {
    setupMBC0();
    expect(memory.cart.mbcType).toEqual(0);
  });
  it('identifies MBC type 1 carts', () => {
    setupMBC1();
    expect(memory.cart.mbcType).toEqual(1);
  });
  it('reads/writes bytes to bios', () => {
    setupMBC0(new Uint8Array([...Array(0x100).fill(2)]));
    for (let i = 0; i <= 0xff; i++) {
      // writes do nothing
      memory.writeByte(i, 1);
      expect(memory.readByte(i)).toEqual(2);
      expect(memory.inBios).toBe(true);
    }
    // exited bios from write to 0x100
    memory.readByte(0x100);
    expect(memory.inBios).toBe(false);
  });
  it('reads/writes bytes to vRAM', () => {
    setupMBC0();
    for (let i = 0x8000; i <= 0x9fff; i++) {
      memory.writeByte(i, 1);
      expect(memory.readByte(i)).toBe(1);
    }
  });
  it('reads/writes bytes to wRAM', () => {
    setupMBC0();
    for (let i = 0xc000; i <= 0xdfff; i++) {
      memory.writeByte(i, 1);
      expect(memory.readByte(i)).toBe(1);
    }
  });
  it('reads/writes bytes to OAM', () => {
    setupMBC0();
    for (let i = 0xfe00; i <= 0xfe9f; i++) {
      memory.writeByte(i, 1);
      expect(memory.readByte(i)).toBe(1);
    }
  });
  it('reads/writes bytes to ioRAM', () => {
    setupMBC0();
    for (let i = 0xff00; i < 0xff44; i++) {
      memory.writeByte(i, 1);
      expect(memory.readByte(i)).toBe(1);
    }
    // scanline reset
    memory.writeByte(0xff44, 1);
    expect(memory.readByte(0xff44)).toBe(0);
    for (let i = 0xff45; i <= 0xff7f; i++) {
      memory.writeByte(i, 1);
      expect(memory.readByte(i)).toBe(1);
    }
  });
  it('reads/writes bytes to hRAM', () => {
    setupMBC0();
    for (let i = 0xff80; i < 0xfffe; i++) {
      memory.writeByte(i, 1);
      expect(memory.readByte(i)).toBe(1);
    }
  });
  it('reads/writes words', () => {
    setupMBC0();
    memory.writeWord(0x8000, 0xa000);
    expect(memory.readWord(0x8000)).toEqual(0xa000);
  });
});
