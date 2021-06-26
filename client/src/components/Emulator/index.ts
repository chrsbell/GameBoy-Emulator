import CanvasRenderer from 'CanvasRenderer/index';
import CPU from 'CPU/index';
import benchmark, {benchmarksEnabled} from 'helpers/Performance';
import Memory from 'Memory/index';
import PPU from 'PPU/index';

class Emulator {
  private timeout!: number;
  private numExecuted = 0;
  private memory: Memory = <Memory>{};
  private cpu: CPU = <CPU>{};
  private ppu: PPU = <PPU>{};
  constructor() {
    this.memory = new Memory();
    this.cpu = new CPU();
    this.ppu = new PPU(this.memory);
    this.ppu.setColorScheme(CanvasRenderer.colorScheme);
    if (benchmarksEnabled) {
      this.update = benchmark(this.update.bind(this), this);
    }
  }
  public reset = (): void => {
    this.memory.reset();
    this.cpu.reset();
    this.ppu.reset();
  };
  /**
   * Loads a bios and ROM file into the Memory module and stops the currently updating function.
   * @returns {boolean}
   */
  public load = (bios: ByteArray, rom: Uint8Array): boolean => {
    this.memory.load(this.cpu, bios, rom);
    if (this.timeout !== null) window.cancelAnimationFrame(this.timeout);
    this.timeout = window.requestAnimationFrame(this.update);
    return true;
  };
  /**
   * Executes the next set of opcodes and calls renderer update method.
   */
  public update = (): void => {
    const cyclesPerUpdate = this.cpu.clock / CanvasRenderer.fps;
    let cycles = 0;
    let elapsed = 0;
    if (this.numExecuted > this.cpu.clock) {
      // logBenchmarks();
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
      this.ppu.buildGraphics(elapsed);
      this.cpu.checkInterrupts(this.memory);
    }
    this.timeout = window.requestAnimationFrame(this.update);
  };
}

export default Emulator;
