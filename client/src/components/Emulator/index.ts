import CPU, {
  getDivider,
  getInputClock,
  getTimerCounter,
  getTimerEnable,
  getTimerModulo,
  setDivider,
  setTimerCounter,
} from 'CPU/index';
import GLRenderer from 'GLRenderer/index';
import {benchmark} from 'helpers/index';
import Input, {Key} from 'Input/index';
import InterruptService from 'Interrupts/index';
import Memory from 'Memory/index';
import PPUBridge from 'Memory/PPUBridge';
import PPU from 'PPU/index';

class Emulator {
  public timeout!: number;
  private numExecuted = 0;
  public memory!: Memory;
  private renderer!: GLRenderer;
  public cpu!: CPU;
  private ppuBridge!: PPUBridge;
  public ppu!: PPU;
  private input!: Input;
  private interruptService!: InterruptService;
  private stopped = false;
  constructor(renderer: GLRenderer) {
    this.renderer = renderer;
    this.ppuBridge = new PPUBridge();
    this.interruptService = this.ppuBridge.interruptService;
    this.memory = this.ppuBridge.memory;
    this.cpu = new CPU(this.memory);
    this.ppu = this.ppuBridge.ppu;
    this.input = new Input();
    this.renderer.setPPU(this.ppuBridge.ppu);
    benchmark(this.ppuBridge);
    benchmark(this.memory);
    benchmark(this.cpu);
    benchmark(this.ppu);
    benchmark(this.input);
    benchmark(this.renderer);
    benchmark(this.interruptService);
    benchmark(this);
  }
  public reset = (): void => {
    this.memory.reset();
    this.cpu.reset();
    this.ppu.reset();
    window.clearInterval(this.timeout);
    this.renderer.clear();
  };
  public load = (bios: ByteArray | null, rom: Uint8Array): boolean => {
    this.memory.load(this.cpu, bios, rom);
    this.renderer.start();
    this.timeout = window.setInterval(this.update, 1);
    return true;
  };
  public update = (
    callback: (elapsed: number) => void = (): void => {}
  ): void => {
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
      const {cpu, ppu} = this;
      const {buildGraphics} = ppu;
      let cycles = 0;
      let dividerOverflow = 0;
      let timer = 0;
      const cyclesPerUpdate = this.cpu.clock;
      let elapsed = 0;
      // move this out of here
      const timerOverflow: NumNumIdx = {
        0: 4096,
        1: 262144,
        2: 65536,
        3: 16384,
      };
      let oldTimerModulo;

      while (cycles < cyclesPerUpdate) {
        while (dividerOverflow < 0xff) {
          oldTimerModulo = getTimerModulo();
          if (!cpu.halted) {
            elapsed = cpu.execute();
            cycles += elapsed;
          }
          buildGraphics(elapsed);
          dividerOverflow += elapsed;
          if (getTimerEnable()) {
            timer += elapsed;
            if (timer >= timerOverflow[getInputClock()]) {
              timer -= timerOverflow[getInputClock()];
              const newTimerCounter = getTimerCounter() + 1;
              if (newTimerCounter > 0xff) {
                this.interruptService.enable(InterruptService.flags.timer);
                setTimerCounter(oldTimerModulo);
              } else {
                setTimerCounter(newTimerCounter);
              }
            }
          }
          callback(elapsed);
        }
        setDivider((getDivider() + 1) & 0xff);
        dividerOverflow -= 0xff;
      }
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
