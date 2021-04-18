import PPU from '.';
import Memory from '../Memory';

describe('PPU', () => {
  beforeEach(() => {
    Memory.reset();
    PPU.reset();
  });
  it('returns whether the lcd is enabled', () => {
    PPU.lcdc.update(128);
    expect(PPU.lcdEnabled()).toBe(true);
    PPU.lcdc.update(0);
    expect(PPU.lcdEnabled()).toBe(false);
  });
  describe('scanline register (ly)', () => {
    it('sets a scanline', () => {
      PPU.scanline = 1;
      expect(Memory.readByte(0xff44)).toEqual(1);
    });
    it('gets a scanline', () => {
      PPU.scanline = 1;
      expect(PPU.scanline).toEqual(1);
    });
  });
  describe('scanline compare register (lyc)', () => {
    it('sets lyc', () => {
      PPU.scanlineCompare = 1;
      expect(Memory.readByte(0xff45)).toEqual(1);
    });
    it('gets lyc', () => {
      PPU.scanlineCompare = 1;
      expect(PPU.scanlineCompare).toEqual(1);
    });
  });
  describe('STAT register', () => {
    it('sets the stat regsiter', () => {
      PPU.stat = 0b111110;
      expect(Memory.readByte(0xff41)).toEqual(0b111110);
      expect(PPU.mode).toEqual(2);
    });
    it('gets the stat regsiter', () => {
      PPU.stat = 0b111110;
      expect(PPU.stat).toEqual(0b111110);
    });
  });
  describe('STAT modes', () => {
    it('sets the stat mode bits', () => {
      PPU.mode = 3;
      expect(PPU.stat).toEqual(3);
      expect(Memory.readByte(0xff41)).toEqual(3);
    });
    it('gets the stat mode bits', () => {
      Memory.writeByte(0xff41, 3);
      expect(PPU.stat).toEqual(3);
      expect(Memory.readByte(0xff41)).toEqual(3);
    });
  });
  describe('Vertical Blanking', () => {
    it('updates the scanline after 456 dots', () => {
      PPU.clock = 456;
      PPU.scanline = 1;
      const vBlank = PPU['vBlank'] as any;
      vBlank.call(PPU);
      expect(PPU.clock).toEqual(0);
      expect(PPU.scanline).toEqual(2);
    });
  });
});
