import CPU from 'CPU/index';
import GLRenderer from 'GLRenderer/index';
// import {benchmark} from 'helpers/Performance';
import {InterruptService} from 'Interrupts/index';
import {Memory} from 'Memory/index';
import {PPU} from 'PPU/index';
import {Timing} from 'Timing/index';

class Emulator {
  public timeout!: number;
  public memory!: Memory;
  private renderer!: GLRenderer;
  public cpu!: CPU;
  public ppu!: PPU;
  private interruptService!: InterruptService;
  private timing: Timing;
  private cycles = 0;
  private prevStartTime = 0;
  private expectedFrameTime = 1000 / 500; // how long it should take the emulator to render a frame
  private divTicksPerFrame = PPU.dotsPerFrame / 256;
  private fps = 0;
  private elapsedFrames = 0;

  constructor(renderer: GLRenderer, settings?: Settings) {
    this.renderer = renderer;
    this.interruptService = new InterruptService();
    this.memory = new Memory();
    this.timing = new Timing();
    this.cpu = new CPU();
    this.ppu = new PPU();

    this.renderer.init(this.ppu);
    this.interruptService.init(this.memory);
    this.memory.init(this.ppu, this.timing);
    this.timing.init(this.memory, this.interruptService);
    this.cpu.init(this.memory);
    this.ppu.init(this.memory, this.interruptService);
    if (settings?.benchmarksEnabled) {
      // benchmark(this.memory);
      // benchmark(this.cpu);
      // benchmark(this.ppu);
      // benchmark(this.renderer);
      // benchmark(this.interruptService);
      // benchmark(this);
    }
    this.renderer.start();
  }
  public reset = (): void => {
    this.memory.reset();
    this.cpu.reset();
    this.ppu.reset();
    window.clearInterval(this.timeout);
  };
  public load = (bios: ByteArray | null, rom: Uint8Array): boolean => {
    this.memory.load(this.cpu, bios, rom);
    this.timeout = window.requestAnimationFrame(
      async elapsedTime => await this.cycle(elapsedTime)
    );
    window.setInterval(() => console.log(`FPS: ${this.fps}`), 1000);
    window.clearInterval(this.ppu.timeout);
    this.ppu.clearPixelMap();

    return true;
  };
  public cycle = async (
    elapsedTime: number,
    testCallback: () => void = (): void => {},
    preTestSetup: () => void = (): void => {}
  ): Promise<void> => {
    const delta = elapsedTime - this.prevStartTime;

    this.fps = (1000 / delta) * 60;
    this.prevStartTime = elapsedTime;

    await (async (): Promise<void> => {
      for (let frame = 0; this.cycles < CPU.clock; frame++) {
        await this.tickFrame(testCallback, preTestSetup);
      }
    })();

    this.ppu.numVblankInt = 0;

    this.cycles -= CPU.clock;

    this.timeout = window.requestAnimationFrame(
      async elapsedTime => await this.cycle(elapsedTime)
    );
  };

  private tickFrame = (
    testCallback: () => void = (): void => {},
    preTestSetup: () => void = (): void => {}
  ): Promise<void> => {
    const startTime = performance.now();
    for (let clock = 0; clock < this.divTicksPerFrame; clock++) {
      this.timing.tickDivider(
        this.cpu,
        () => {
          if (!this.cpu.stopped) {
            const elapsed = this.cpu.execute();
            this.cycles += elapsed;
            this.ppu.buildGraphics(elapsed);
            return elapsed;
          } else {
            if (this.cpu.enteredStop) {
              this.timing.divider = 0;
              this.cpu.enteredStop = false;
            }
            // just build graphics (double check if shouldn't modify interrupts in ppu while in stop mode)
            this.ppu.buildGraphics(4);
            return 4;
          }
        },
        testCallback,
        preTestSetup
      );
      // Input.update(this.cpu);
    }
    const actualFrameTime = performance.now() - startTime;
    // delay until next frame if necessary
    return new Promise(resolve =>
      setTimeout(() => {
        resolve();
      }, this.expectedFrameTime - actualFrameTime)
    );
  };
}

export default Emulator;
