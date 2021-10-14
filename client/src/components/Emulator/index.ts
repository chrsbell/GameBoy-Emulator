import CanvasRenderer from 'CanvasRenderer/index';
import CPU from 'CPU/index';
import benchmark from 'helpers/Performance';
import Input, {Key} from 'Input/index';
import InterruptService from 'Interrupts/index';
import Memory from 'Memory/index';
import PPUBridge from 'Memory/PPUBridge';
import PPU from 'PPU/index';

class Emulator {
  private timeout!: number;
  private numExecuted = 0;
  private memory!: Memory;
  private canvasRenderer!: CanvasRenderer;
  private cpu!: CPU;
  private ppuBridge!: PPUBridge;
  private ppu!: PPU;
  private input!: Input;
  private interruptService!: InterruptService;
  private stopped = false;
  constructor(canvasRenderer: CanvasRenderer) {
    this.canvasRenderer = canvasRenderer;
    this.ppuBridge = new PPUBridge();
    this.interruptService = this.ppuBridge.interruptService;
    this.memory = this.ppuBridge.memory;
    this.cpu = new CPU(this.memory);
    this.ppu = this.ppuBridge.ppu;
    this.input = new Input();
    this.canvasRenderer.setPPU(this.ppuBridge.ppu);
    benchmark(this.ppuBridge);
    benchmark(this.memory);
    benchmark(this.cpu);
    benchmark(this.ppu);
    benchmark(this.input);
    benchmark(this.canvasRenderer);
    benchmark(this.interruptService);
    benchmark(this);
  }
  public reset = (): void => {
    this.memory.reset();
    this.cpu.reset();
    this.ppu.reset();
    window.clearInterval(this.timeout);
    this.canvasRenderer.clear();
  };
  public load = (bios: ByteArray, rom: Uint8Array): boolean => {
    this.memory.load(this.cpu, bios, rom);
    this.canvasRenderer.render();
    this.timeout = window.setInterval(this.update, 1);
    return true;
  };
  public update = (): void => {
    if (!this.stopped) {
      if (this.input.pressed(Key.Space)) {
        this.input.debounce(Key.Space);
        this.stopped = true;
        console.log('stopped emulator');
      }
      if (this.input.pressed(Key.Escape)) {
        console.log('emulator reset');
        this.reset();
        return;
      }
      const {cpu, ppu, canvasRenderer, memory} = this;
      const {checkInterrupts} = cpu;
      const {buildGraphics} = ppu;
      let cycles = 0;
      const cyclesPerUpdate = this.cpu.clock;
      let elapsed = 0;
      // elapse time according to number of cpu cycles used
      while (cycles < cyclesPerUpdate) {
        if (!cpu.halted) {
          elapsed = cpu.execute();
          cycles += elapsed;
        }
        buildGraphics(elapsed);
        cycles += checkInterrupts(memory);
      }
      canvasRenderer.buildImage();
    } else {
      if (this.input.pressed(Key.Space)) {
        this.input.debounce(Key.Space);
        console.log('unpaused emulator');
        this.stopped = false;
      }
    }
  };
}

export default Emulator;
