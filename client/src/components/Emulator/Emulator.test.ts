import Emulator from '.';
import CanvasRenderer from '../CanvasRenderer';

describe('Emulator', () => {
  const gb = new Emulator();
  const bios = new Uint8Array([...Array(8192).fill(1)]);
  const rom = new Uint8Array([...Array(8192).fill(1)]);
  const setupGb = () => gb.load(bios, rom);
  beforeEach(() => {
    gb.reset();
  });
  it('loads bios and rom files', () => {
    expect(setupGb()).toEqual(true);
  });
  it('updates', () => {
    setupGb();
    gb['cpu'].executeInstruction = jest.fn();
    gb['cpu'].checkInterrupts = jest.fn();
    gb['ppu'].buildGraphics = jest.fn();
    CanvasRenderer.draw = jest.fn();
    gb.update();
    // calls occur multiple times
    expect(gb['cpu'].executeInstruction).toHaveBeenCalled();
    expect(gb['ppu'].buildGraphics).toHaveBeenCalled();
    expect(gb['cpu'].checkInterrupts).toHaveBeenCalled();
    expect(CanvasRenderer.draw).toHaveBeenCalledTimes(1);
  });
});
