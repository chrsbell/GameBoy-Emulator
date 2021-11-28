import CPU from 'CPU/index';
import GLRenderer from 'GLRenderer/index';
import Input, {Key} from 'Input/index';
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
  private input!: Input;
  private interruptService!: InterruptService;
  private timing: Timing;
  // private emulationSpeed = 1;
  private cycles = 0;
  constructor(renderer: GLRenderer) {
    this.renderer = renderer;
    this.interruptService = new InterruptService();
    this.memory = new Memory();
    this.timing = new Timing();
    this.cpu = new CPU();
    this.input = new Input();
    this.ppu = new PPU();

    this.renderer.init(this.ppu);
    this.interruptService.init(this.memory);
    this.memory.init(this.ppu, this.timing);
    this.timing.init(this.memory, this.interruptService);
    this.cpu.init(this.memory);
    this.ppu.init(this.memory, this.interruptService);
    // benchmark(this.ppuBridge);
    // benchmark(this.memory);
    // benchmark(this.cpu);
    // benchmark(this.ppu);
    // benchmark(this.input);
    // benchmark(this.renderer);
    // benchmark(this.interruptService);
    // benchmark(this);
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
    this.timeout = window.setInterval(this.cycle, 0);
    window.clearInterval(this.ppu.timeout);
    this.ppu.clearPixelMap();

    return true;
  };
  public cycle = (testCallback: () => void = (): void => {}): void => {
    if (this.input.pressed(Key.Space)) {
      if (!this.cpu.stopped) {
        this.input.debounce(Key.Space);
        this.cpu.stopped = true;
        console.log('stopped emulator');
      } else {
        this.input.debounce(Key.Space);
        console.log('unpaused emulator');
        this.cpu.stopped = false;
      }
    }
    if (this.input.pressed(Key.Escape)) {
      console.log('emulator reset');
      this.reset();
      return;
    }
    const {cpu, ppu} = this;
    const {clock} = CPU;
    const {buildGraphics} = ppu;

    // adjust this depending on if loop moving too fast or slow
    for (let i = 0; i < 0x200; i++) {
      this.timing.tickDivider(
        cpu,
        () => {
          console.log(`SCY: ${this.memory.ram[0xff42]}`);
          console.log(`SCX: ${this.memory.ram[0xff43]}`);
          const elapsed = cpu.execute();
          this.cycles += elapsed;
          buildGraphics(elapsed);
          return elapsed;
        },
        testCallback
      );
    }
    if (this.cycles > clock) {
      this.cycles -= clock;
    }
  };
}

export default Emulator;
