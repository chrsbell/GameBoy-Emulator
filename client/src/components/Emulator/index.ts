import CanvasRenderer from 'CanvasRenderer/index';
import CPU from 'CPU/index';
import benchmark from 'helpers/Performance';
import Input, {Key} from 'Input/index';
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
  private stopped = false;
  constructor(canvasRenderer: CanvasRenderer) {
    this.canvasRenderer = canvasRenderer;
    this.cpu = new CPU();
    this.ppuBridge = new PPUBridge();
    this.memory = this.ppuBridge.memory;
    this.ppu = this.ppuBridge.ppu;
    this.canvasRenderer.setPPU(this.ppuBridge.ppu);
    this.update = benchmark(this, 'update');
  }
  public reset = (): void => {
    this.memory.reset();
    this.cpu.reset();
    this.ppu.reset();
  };
  public load = (bios: ByteArray, rom: Uint8Array): boolean => {
    this.memory.load(this.cpu, bios, rom);
    if (this.timeout !== null) window.cancelAnimationFrame(this.timeout);
    this.update();
    this.timeout = window.setInterval(this.update);
    return true;
  };
  public update = (): void => {
    if (!this.stopped) {
      if (Input.pressed(Key.Space)) {
        Input.debounce(Key.Space);
        this.stopped = true;
        console.log('stopped emulator');
      }
      let cycles = 0;
      const cyclesPerUpdate = this.cpu.clock;
      let elapsed = 0;
      if (this.numExecuted > this.cpu.clock) {
        // logBenchmarks();
        // for (let i = 0; i < 30; i++) {
        //   console.log(`tile #${i}`);
        //   console.table(this.ppu.tileData[i]);
        // }
        this.numExecuted = 0;
      }
      // elapse time according to number of cpu cycles used
      while (cycles < cyclesPerUpdate) {
        if (!this.cpu.halted) {
          elapsed = this.cpu.executeInstruction(this.memory);
          this.numExecuted += elapsed;
          cycles += elapsed;
        } else {
          console.log('CPU is halted.');
        }
        this.ppuBridge.ppu.buildGraphics(elapsed);
        this.cpu.checkInterrupts(this.memory);
      }
      this.canvasRenderer.draw();
      this.canvasRenderer.drawOnScreen();
    } else {
      if (Input.pressed(Key.Space)) {
        Input.debounce(Key.Space);
        console.log('unpaused emulator');
        this.stopped = false;
      }
    }
    // }
    // this.canvasRenderer.draw(this.ppu);
    // cycles = 0;
    // elapsed = 0;
    // setTimeout(this.update, 0);
    // this.update();
    // this.timeout = window.requestAnimationFrame(this.update);
    // }
  };
}

export default Emulator;
