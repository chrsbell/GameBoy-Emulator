import benchmark, {benchmarksEnabled} from '../../helpers/Performance';
import CanvasRenderer from '../CanvasRenderer';
import CPU from '../CPU';
import Memory from '../Memory';
import PPU from '../PPU';

class Emulator {
  private timerID!: ReturnType<typeof setTimeout>;
  private numExecuted = 0;
  private memory: Memory = <Memory>{};
  private cpu: CPU = <CPU>{};
  private ppu: PPU = <PPU>{};
  public constructor() {
    this.memory = new Memory();
    this.cpu = new CPU();
    this.ppu = new PPU(this.memory);
    this.ppu.setColorScheme(CanvasRenderer.colorScheme);
    if (benchmarksEnabled) {
      this.update = benchmark(this.update.bind(this), this);
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
    this.timerID = setInterval(this.update, 0);
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
    CanvasRenderer.draw();
  }
}

export default Emulator;
