import CPU from '../CPU';
import Memory from '../Memory';
import PPU from '../PPU';
import CanvasRenderer from '../CanvasRenderer';
import benchmark, {getBenchmarks, benchmarksEnabled} from '../Performance';
import _ from 'lodash';

class Emulator {
  private x = 0;
  private y = 0;
  private timerID!: ReturnType<typeof setTimeout>;
  private numExecuted = 0;
  public constructor() {
    if (benchmarksEnabled) {
      this.update = benchmark(this.update.bind(this));
    }
  }
  /**
   * Loads a bios and ROM file into the Memory module.
   * @returns - boolean, whether ROM was loaded
   * Stops the currently updating function.
   */
  public load(bios: Uint8Array | null, rom: Uint8Array): boolean {
    Memory.load(bios, rom);
    clearTimeout(this.timerID);
    return true;
  }
  /**
   * Executes the next set of opcodes and calls renderer update method.
   * Calls itself at regular intervals according to the renderer's FPS, updating
   * the ID of setTimeout each time.
   */
  public update() {
    const cyclesPerUpdate = CPU.clock / CanvasRenderer.fps;
    let cycles = 0;
    let elapsed;
    this.logBenchmarks();
    // elapse time according to number of cpu cycles used
    while (cycles < cyclesPerUpdate) {
      elapsed = CPU.executeInstruction();
      this.numExecuted += elapsed;
      cycles += elapsed;
      // need to update timers using elapsed cpu cycles
      PPU.buildGraphics(elapsed);
      CPU.checkInterrupts();
    }
    // CanvasRenderer.testAnimation();
    CanvasRenderer.draw();
    this.timerID = setTimeout(this.update, 0);
  }
  /**
   * Utility function to benchmark the emulator.
   */
  private logBenchmarks(): void {
    if (this.numExecuted > CPU.clock) {
      const times = getBenchmarks();
      _.map(times, (val, key) => [
        `Average ${key} function call duration: ${
          (val.elapsed / val.calledTimes) * 1000
        }ms`,
        val.elapsed / val.calledTimes,
      ])
        .sort((a: Array<any>, b: Array<any>) => b[1] - a[1])
        .map((val: Array<any>) => console.log(val[0]));
      console.log('1 second passed');
      this.numExecuted = 0;
    }
  }
}

export default Emulator;
