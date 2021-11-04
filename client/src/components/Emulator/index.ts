import CPU from 'CPU/index';
import GLRenderer from 'GLRenderer/index';
import {benchmark} from 'helpers/index';
import Input, {Key} from 'Input/index';
import InterruptService from 'Interrupts/index';
import Memory from 'Memory/index';
import PPUBridge from 'Memory/PPUBridge';
import PPU from 'PPU/index';

let timerCounter: byte = 0;
let divider: byte = 0;
let timerModulo: byte = 0;
let timerEnable: bit = 0;
let inputClock: byte = 0;
let dividerOverflow = 0;

let memoryRef!: Memory;
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
  // private emulationSpeed = 1;
  private cycles = 0;
  constructor(renderer: GLRenderer) {
    this.renderer = renderer;
    this.ppuBridge = new PPUBridge();
    this.interruptService = this.ppuBridge.interruptService;
    this.memory = this.ppuBridge.memory;
    memoryRef = this.memory;
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
    this.renderer.start();

    // window.setInterval(
    //   () =>
    //     console.log(
    //       `Emulator speed: ${Math.round(this.emulationSpeed * 100)}%`
    //     ),
    //   50
    // );
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
  public update = (
    callback: (elapsed: number) => void = (): void => {}
  ): void => {
    callback(1);
  };
  public cycle = (
    callback: (elapsed: number) => void = (): void => {}
  ): void => {
    if (this.input.pressed(Key.Space)) {
      if (!this.cpu.stopped) {
        this.input.debounce(Key.Space);
        this.cpu.stopped = !this.cpu.stopped;
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
    let timer = 0;
    let elapsed = 0;
    // move this out of here
    const timerOverflow: NumNumIdx = {
      0: 4096,
      1: 262144,
      2: 65536,
      3: 16384,
    };
    let oldTimerModulo;
    // adjust this depending on if loop moving too fast or slow
    for (let i = 0; i < 0x200; i++) {
      while (dividerOverflow <= 0xff && !this.cpu.stopped) {
        oldTimerModulo = timerModulo;
        if (!cpu.halted) {
          elapsed = cpu.execute();
          this.cycles += elapsed;
        }
        buildGraphics(elapsed);
        dividerOverflow += elapsed;
        if (timerEnable) {
          timer += elapsed;
          if (timer >= timerOverflow[inputClock]) {
            timer -= timerOverflow[inputClock];
            const newTimerCounter = timerCounter + 1;
            if (newTimerCounter > 0xff) {
              this.interruptService.enable(InterruptService.flags.timer);
              setTimerCounter(oldTimerModulo);
            } else {
              setTimerCounter(newTimerCounter);
            }
          }
        }
        if (dividerOverflow <= 0xff) callback(elapsed);
      }
      incrementDivider();
      dividerOverflow -= 0x100;
      callback(elapsed);
    }
    if (this.cycles > clock) {
      this.cycles = 0;
      // console.log(`Number of VBlank int: ${cpu.vblankCalls}`);
      // debugger;
      cpu.vblankCalls = 0;
    }
  };
}

const getTimerCounter = (): byte => timerCounter;
const getDivider = (): byte => divider;
const getTimerModulo = (): byte => timerModulo;
const getTimerEnable = (): bit => timerEnable;
const getInputClock = (): byte => inputClock;
const getDivOverflow = (): byte => dividerOverflow;

const incrementDivider = (): void => {
  divider += 1;
  divider &= 0xff;
  memoryRef.ram[0xff04] = divider;
};
const setDivider = (value: byte): void => {
  divider = value;
  memoryRef.ram[0xff04] = 0;
};
const setTimerCounter = (value: byte): void => {
  timerCounter = value;
  memoryRef.ram[0xff05] = value;
};
const setTimerModulo = (value: byte): void => {
  timerModulo = value;
  memoryRef.ram[0xff06] = value;
};
const setTimerEnable = (value: bit): void => {
  timerEnable = value;
  memoryRef.ram[0xff07] = (memoryRef.ram[0xff07] & 0b11) | (value << 2);
};
const setInputClock = (value: byte): void => {
  inputClock = value;
  memoryRef.ram[0xff07] = (memoryRef.ram[0xff07] & 0b100) | value;
};
const setTimerControl = (value: byte): void => {
  timerEnable = (value >> 2) & 1;
  inputClock = value & 0b11;
  memoryRef.ram[0xff07] = value;
};

export default Emulator;
export {
  getTimerCounter,
  getDivider,
  getTimerModulo,
  getTimerEnable,
  getInputClock,
  getDivOverflow,
  setTimerCounter,
  setDivider,
  setTimerModulo,
  setTimerEnable,
  setInputClock,
  setTimerControl,
};
