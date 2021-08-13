import CanvasRenderer from 'CanvasRenderer/index';
import CPU from 'CPU/index';
import {logBenchmarks} from 'helpers/Performance';
import Input from 'Input/index';
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
    // benchmark(this.ppuBridge);
    // benchmark(this.memory);
    // benchmark(this.cpu);
    // benchmark(this.ppu);
    // benchmark(this.input);
    // benchmark(this.canvasRenderer);
    // benchmark(this.interruptService);
    // benchmark(this);
  }
  public reset = (): void => {
    this.memory.reset();
    this.cpu.reset();
    this.ppu.reset();
  };
  public load = (bios: ByteArray, rom: Uint8Array): boolean => {
    this.memory.load(this.cpu, bios, rom);
    if (!this.memory.inBios) this.cpu.execute = this.cpu.executeInstruction;
    if (this.timeout !== null) window.cancelAnimationFrame(this.timeout);
    this.update();
    this.timeout = window.setInterval(this.update, 1);
    return true;
  };
  public update = (): void => {
    // if (!this.stopped) {
    //   if (this.input.pressed(Key.Space)) {
    //     this.input.debounce(Key.Space);
    //     this.stopped = true;
    //     console.log('stopped emulator');
    //   }
    let cycles = 0;
    const cyclesPerUpdate = this.cpu.clock;
    let elapsed = 0;
    if (this.numExecuted > this.cpu.clock) {
      logBenchmarks();
      this.numExecuted = 0;
    }
    // elapse time according to number of cpu cycles used
    while (cycles < cyclesPerUpdate) {
      // this.numExecuted += 6;
      // cycles += 6;
      if (!this.cpu.halted) {
        elapsed = this.cpu.execute();
        this.numExecuted += elapsed;
        cycles += elapsed;
      }
      //   } else {
      //     console.log('CPU is halted.');
      //   }
      this.ppu.buildGraphics(elapsed);
      // if (this.cpu.allInterruptsEnabled) {
      //   if (this.memory.ram[0xff0f]) {
      //     const interruptsTriggered =
      //       this.memory.ram[0xff0f] & this.memory.ram[0xffff];
      //     if (interruptsTriggered) {
      //       this.cpu.handleInterrupts(this.memory, interruptsTriggered);
      //     }
      //   }
      // }
      // }
      // this.cpu.checkInterrupts();
    }
    this.canvasRenderer.buildImage();
  };
  // else {
  //   if (this.input.pressed(Key.Space)) {
  //     this.input.debounce(Key.Space);
  //     console.log('unpaused emulator');
  //     this.stopped = false;
  //   }
  // }
  // };
}

export default Emulator;
