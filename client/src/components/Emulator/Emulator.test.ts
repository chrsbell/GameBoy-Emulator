import Emulator from '.';
import Memory from '../Memory';
import CPU from '../CPU';
import PPU from '../PPU';
import GLRenderer from '../GLRenderer';

describe('Emulator', () => {
  const gb = new Emulator();
  const bios = new Uint8Array([...Array(8192).fill(1)]);
  const rom = new Uint8Array([...Array(8192).fill(1)]);
  beforeEach(() => {
    Memory.reset();
    CPU.reset();
    PPU.reset();
  });
  it('loads bios and rom files', () => {
    const gb = new Emulator();
    expect(gb.load(bios, rom)).toEqual(true);
  });
  it('updates', () => {
    CPU.executeInstruction = jest.fn();
    PPU.buildGraphics = jest.fn();
    CPU.checkInterrupts = jest.fn();
    GLRenderer.draw = jest.fn();
    gb.update();
    // calls occur multiple times
    expect(CPU.executeInstruction).toHaveBeenCalled();
    expect(PPU.buildGraphics).toHaveBeenCalled();
    expect(CPU.checkInterrupts).toHaveBeenCalled();
  });
});
