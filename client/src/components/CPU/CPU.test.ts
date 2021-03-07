const path = require('path');
const fs = require('fs');
import _ from 'lodash';
import CPU from '.';
import Memory from '../Memory';
import { byte, word } from '../Types';
const ROM_FOLDER = path.join(__dirname, '..', '..', '..', '..', 'public', 'roms');
const GENERATED_FOLDER = path.join(__dirname, '..', '..', '..', 'test', 'generated');

const VIDEO_RAM = 8192;
const OBJECT_ATTRIBUTE_MEMORY = 0xa0;

interface CPUInfo {
  sp: word;
  pc: word;
  a: byte;
  f: byte;
  b: byte;
  c: byte;
  d: byte;
  e: byte;
  hl: word;
  interrupt_master_enable: boolean;
  halted: boolean;
  stopped: boolean;
}

interface ScreenInfo {
  VRAM: Uint8Array;
  OAM: Uint8Array;
  LCDC: byte;
  BGP: byte;
  OBP0: byte;
  OBP1: byte;
  SCY: byte;
  SCX: byte;
  WY: byte;
  WX: byte;
}

interface TimerInfo {
  DIV: byte;
  TIMA: byte;
  DIV_counter: word;
  TIMA_counter: word;
  TMA: byte;
  TAC: byte;
}

const ROWS = 144;
const INTERNAL_RAM0 = 8192;
const NON_IO_INTERNAL_RAM0 = 0x60;
const IO_PORTS = 0x4c;
const NON_IO_INTERNAL_RAM1 = 0x34;
const INTERNAL_RAM1 = 0x7f;
const INTERRUPT_ENABLE_REGISTER = 1;

beforeAll(() => {
  const BIOSFile: Buffer = fs.readFileSync(path.join(ROM_FOLDER, 'bios.bin'));
  const ROMFile: Buffer = fs.readFileSync(path.join(ROM_FOLDER, 'tetris.gb'));

  Memory.load(new Uint8Array([...BIOSFile]), new Uint8Array([...ROMFile]));
  Memory.inBios = false;
  expect(Memory).toBeDefined();
});

describe('CPU', () => {
  it('matches the internal state of another emulator', async () => {
    const cpu = new CPU();
    expect(CPU).toBeDefined();

    let pyboySave = await fs.promises.readFile(
      path.join(GENERATED_FOLDER, 'tetris.gb', 'save.state')
    );

    let fileIndex = 0;

    let cpuStates: Array<CPUInfo> = Array(100);

    debugger;

    for (let i = 0; i < 100; i++) {
      cpu.executeInstruction();

      cpuStates[i] = {} as CPUInfo;
      const stateVersion = pyboySave[fileIndex++];
      const bootROMEnabled = pyboySave[fileIndex++];
      // CPU Info
      cpuStates[i].a = pyboySave[fileIndex++];
      cpuStates[i].f = pyboySave[fileIndex++];
      cpuStates[i].b = pyboySave[fileIndex++];
      cpuStates[i].c = pyboySave[fileIndex++];
      cpuStates[i].d = pyboySave[fileIndex++];
      cpuStates[i].e = pyboySave[fileIndex++];
      let hl = pyboySave[fileIndex++];
      hl |= pyboySave[fileIndex++] << 8;
      cpuStates[i].hl = hl;
      let sp = pyboySave[fileIndex++];
      sp |= pyboySave[fileIndex++] << 8;
      cpuStates[i].sp = pyboySave[fileIndex++];
      cpuStates[i].sp = sp;
      let pc = pyboySave[fileIndex++];
      pc |= pyboySave[fileIndex++] << 8;
      cpuStates[i].pc = pc;

      cpuStates[i].interrupt_master_enable = pyboySave[fileIndex++];
      cpuStates[i].halted = pyboySave[fileIndex++];
      cpuStates[i].stopped = pyboySave[fileIndex++];

      // // LCD Info
      // screenInfo.VRAM= Array(VIDEO_RAM;
      // for (let i = 0; i < VIDEO_RAM; i++) {
      //   screenInfo.VRAM[i] = pyboySave[fileIndex++];
      // }

      // screenInfo.OAM= Array(OBJECT_ATTRIBUTE_MEMORY;
      // for (let i = 0; i < OBJECT_ATTRIBUTE_MEMORY; i++) {
      //   screenInfo.OAM[i] = pyboySave[fileIndex++];
      // }

      // screenInfo.LCDC = pyboySave[fileIndex++];
      // screenInfo.BGP = pyboySave[fileIndex++];
      // screenInfo.OBP0 = pyboySave[fileIndex++];
      // screenInfo.OBP1 = pyboySave[fileIndex++];
      // screenInfo.SCY = pyboySave[fileIndex++];
      // screenInfo.SCX = pyboySave[fileIndex++];
      // screenInfo.WY = pyboySave[fileIndex++];
      // screenInfo.WX = pyboySave[fileIndex++];

      // // Ignore scanline info for now
      // for (let i = 0; i < ROWS; i++) {
      //   fileIndex++;
      // }

      // // Memory info
      // for (let i = 0; i < INTERNAL_RAM0; i++) {
      //   pyboySave[fileIndex++];
      // }
      // for (let i = 0; i < NON_IO_INTERNAL_RAM0; i++) {
      //   pyboySave[fileIndex++];
      // }
      // for (let i = 0; i < IO_PORTS; i++) {
      //   pyboySave[fileIndex++];
      // }
      // for (let i = 0; i < INTERNAL_RAM1; i++) {
      //   pyboySave[fileIndex++];
      // }
      // for (let i = 0; i < NON_IO_INTERNAL_RAM1; i++) {
      //   pyboySave[fileIndex++];
      // }
      // for (let i = 0; i < INTERRUPT_ENABLE_REGISTER; i++) {
      //   pyboySave[fileIndex++];
      // }

      // // Timer info

      // timerInfo.DIV = pyboySave[fileIndex++];
      // timerInfo.TIMA = pyboySave[fileIndex++];
      // timerInfo.DIV_counter = pyboySave[fileIndex++];
      // timerInfo.DIV_counter += pyboySave[fileIndex++];
      // timerInfo.TMA = pyboySave[fileIndex++];
      // timerInfo.TAC = pyboySave[fileIndex++];
    }
  });
});
