import Memory from 'Memory/index';
import PPU from '.';

describe('PPU', () => {
  const memory = new Memory();
  const ppu = new PPU(memory);
  beforeEach(() => {
    memory.reset();
    ppu.reset();
  });
  it('returns whether the lcd is enabled', () => {
    ppu.lcdc.update(128);
    expect(ppu.lcdEnabled()).toBe(true);
    ppu.lcdc.update(0);
    expect(ppu.lcdEnabled()).toBe(false);
  });
  describe('scanline register (ly)', () => {
    it('sets a scanline', () => {
      ppu.scanline = 1;
      expect(memory.readByte(0xff44)).toEqual(1);
    });
    it('gets a scanline', () => {
      ppu.scanline = 1;
      expect(ppu.scanline).toEqual(1);
    });
  });
  describe('scanline compare register (lyc)', () => {
    it('sets lyc', () => {
      ppu.scanlineCompare = 1;
      expect(memory.readByte(0xff45)).toEqual(1);
    });
    it('gets lyc', () => {
      ppu.scanlineCompare = 1;
      expect(ppu.scanlineCompare).toEqual(1);
    });
  });
  describe('STAT register', () => {
    it('sets the stat regsiter', () => {
      ppu.stat = 0b111110;
      expect(memory.readByte(0xff41)).toEqual(0b111110);
      expect(ppu.mode).toEqual(2);
    });
    it('gets the stat regsiter', () => {
      ppu.stat = 0b111110;
      expect(ppu.stat).toEqual(0b111110);
    });
  });
  describe('STAT modes', () => {
    it('sets the stat mode bits', () => {
      ppu.mode = 3;
      expect(ppu.stat).toEqual(3);
      expect(memory.readByte(0xff41)).toEqual(3);
    });
    it('gets the stat mode bits', () => {
      memory.writeByte(0xff41, 3);
      expect(ppu.stat).toEqual(3);
      expect(memory.readByte(0xff41)).toEqual(3);
    });
  });
  describe('Vertical Blanking', () => {
    it('updates the scanline after 456 dots', () => {
      ppu.clock = 456;
      ppu.scanline = 1;
      const vBlank = ppu['vBlank'];
      vBlank.call(ppu);
      expect(ppu.clock).toEqual(0);
      expect(ppu.scanline).toEqual(2);
    });
  });
});
