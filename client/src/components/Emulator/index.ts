import CPU from '../CPU';
import Memory from '../Memory';
import PPU from '../PPU';
import CanvasRenderer from '../CanvasRenderer';
import benchmark, {
  getBenchmarks,
  benchmarksEnabled,
} from '../../helpers/Performance';
import {map} from 'lodash';

class Emulator {
  private x = 0;
  private y = 0;
  private timerID!: ReturnType<typeof setTimeout>;
  private numExecuted = 0;
  private memory: Memory = <Memory>{};
  private cpu: CPU = <CPU>{};
  private ppu: PPU = <PPU>{};
  public constructor() {
    this.memory = new Memory();
    this.cpu = new CPU();
    this.ppu = new PPU(this.memory);
    if (benchmarksEnabled) {
      this.update = benchmark(this.update.bind(this));
    }
  }
  public reset() {
    this.memory.reset();
    this.cpu.reset();
    this.ppu.reset();
  }
  /**
   * Loads a bios and ROM file into the Memory module and stops the currently updating function.
   * @returns {boolean}
   */
  public load(bios: Uint8Array | null, rom: Uint8Array): boolean {
    this.memory.load(this.cpu, bios, rom);
    clearTimeout(this.timerID);
    this.timerID = setInterval(this.update, 1);
    return true;
  }
  /**
   * Executes the next set of opcodes and calls renderer update method.
   * Calls itself at regular intervals according to the renderer's FPS, updating
   * the ID of setTimeout each time.
   */
  public update() {
    const cyclesPerUpdate = this.cpu.clock / CanvasRenderer.fps;
    let cycles = 0;
    let elapsed;
    this.logBenchmarks();
    // elapse time according to number of cpu cycles used
    while (cycles < cyclesPerUpdate) {
      elapsed = this.cpu.executeInstruction(this.memory);
      this.numExecuted += elapsed;
      cycles += elapsed;
      // need to update timers using elapsed cpu cycles
      this.ppu.buildGraphics(elapsed);
      this.cpu.checkInterrupts(this.memory);
    }
    // CanvasRenderer.testAnimation();
    CanvasRenderer.draw();
  }
  /**
   * Utility function to benchmark the emulator.
   */
  private logBenchmarks(): void {
    if (this.numExecuted > this.cpu.clock) {
      const times = getBenchmarks();
      map(times, (val, key) => [
        `Average ${key} function call duration: ${
          (val.elapsed / val.calledTimes) * 1000
        }ms`,
        val.elapsed / val.calledTimes,
      ])
        .sort((a: Array<any>, b: Array<any>) => b[1] - a[1])
        .map((val: Array<any>) => console.log(val[0]));
      console.log('1 second passed in emulator time.');
      this.numExecuted = 0;
    }
  }
}

export default Emulator;
