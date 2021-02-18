const path = require('path');
const fs = require('fs');
import _ from 'lodash';
import CPU from '.';
import Memory from '../Memory';
import { Byte, Word, ByteArray } from '../Types';
debugger;
const ROM_FOLDER = path.join(__dirname, '..', '..', '..', '..', 'public', 'roms');
const GENERATED_FOLDER = path.join(__dirname, '..', '..', '..', 'test', 'generated');
// let server: http.Server;
// beforeEach(function () {
//   server = require('./server');
// });
// afterEach(function () {
//   server.close();
// });

const VIDEO_RAM = 8192;
const OBJECT_ATTRIBUTE_MEMORY = 0xa0;

interface CPUInfo {
  SP: Word;
  PC: Word;
  A: Byte;
  F: Byte;
  B: Byte;
  C: Byte;
  D: Byte;
  E: Byte;
  HL: Word;
  interrupt_master_enable: boolean;
  halted: boolean;
  stopped: boolean;
}

interface ScreenInfo {
  VRAM: ByteArray;
  OAM: ByteArray;
  LCDC: Byte;
  BGP: Byte;
  OBP0: Byte;
  OBP1: Byte;
  SCY: Byte;
  SCX: Byte;
  WY: Byte;
  WX: Byte;
}

interface TimerInfo {
  DIV: Byte;
  TIMA: Byte;
  DIV_counter: Word;
  TIMA_counter: Word;
  TMA: Byte;
  TAC: Byte;
}

const ROWS = 144;
const INTERNAL_RAM0 = 8192;
const NON_IO_INTERNAL_RAM0 = 0x60;
const IO_PORTS = 0x4c;
const NON_IO_INTERNAL_RAM1 = 0x34;
const INTERNAL_RAM1 = 0x7f;
const INTERRUPT_ENABLE_REGISTER = 1;

const getCPUInfo = () => {};

describe('cpu functionality', () => {
  it('matches the internal state of another emulator', async () => {
    const cpu = new CPU();
    expect(CPU).toBeDefined();

    const BIOSFile: Buffer = fs.readFileSync(path.join(ROM_FOLDER, 'bios.bin'));
    const ROMFile: Buffer = fs.readFileSync(path.join(ROM_FOLDER, 'tetris.gb'));

    let buffer = await fs.promises.readFile(path.join(GENERATED_FOLDER, 'tetris.gb', 'save.state'));

    let fileIndex = 0;
    const stateVersion = buffer[fileIndex++];
    const bootROMEnabled = buffer[fileIndex++];

    Memory.load(new ByteArray([...BIOSFile]), new ByteArray([...ROMFile]));
    expect(Memory).toBeDefined();

    for (let i = 0; i < 100; i++) {
      let cpuInfo: CPUInfo = {} as CPUInfo;
      let screenInfo: ScreenInfo = {} as ScreenInfo;

      // CPU Info
      cpuInfo.A = buffer[fileIndex++];
      cpuInfo.F = buffer[fileIndex++];
      cpuInfo.B = buffer[fileIndex++];
      cpuInfo.C = buffer[fileIndex++];
      cpuInfo.D = buffer[fileIndex++];
      cpuInfo.E = buffer[fileIndex++];
      cpuInfo.HL = buffer[fileIndex++];
      cpuInfo.HL += buffer[fileIndex++];
      cpuInfo.SP = buffer[fileIndex++];
      cpuInfo.SP += buffer[fileIndex++];
      cpuInfo.PC = buffer[fileIndex++];
      cpuInfo.PC += buffer[fileIndex++];

      // LCD Info
      screenInfo.VRAM = new ByteArray(VIDEO_RAM);
      for (let i = 0; i < VIDEO_RAM; i++) {
        screenInfo.VRAM[i] = buffer[fileIndex++];
      }

      screenInfo.OAM = new ByteArray(OBJECT_ATTRIBUTE_MEMORY);
      for (let i = 0; i < OBJECT_ATTRIBUTE_MEMORY; i++) {
        screenInfo.OAM[i] = buffer[fileIndex++];
      }

      screenInfo.LCDC = buffer[fileIndex++];
      screenInfo.BGP = buffer[fileIndex++];
      screenInfo.OBP0 = buffer[fileIndex++];
      screenInfo.OBP1 = buffer[fileIndex++];
      screenInfo.SCY = buffer[fileIndex++];
      screenInfo.SCX = buffer[fileIndex++];
      screenInfo.WY = buffer[fileIndex++];
      screenInfo.WX = buffer[fileIndex++];

      // Ignore scanline info for now
      for (let i = 0; i < ROWS; i++) {
        fileIndex++;
      }

      // Memory info
      for (let i = 0; i < INTERNAL_RAM0; i++) {
        buffer[fileIndex++];
      }
      for (let i = 0; i < NON_IO_INTERNAL_RAM0; i++) {
        buffer[fileIndex++];
      }
      for (let i = 0; i < IO_PORTS; i++) {
        buffer[fileIndex++];
      }
      for (let i = 0; i < INTERNAL_RAM1; i++) {
        buffer[fileIndex++];
      }
      for (let i = 0; i < NON_IO_INTERNAL_RAM1; i++) {
        buffer[fileIndex++];
      }
      for (let i = 0; i < INTERRUPT_ENABLE_REGISTER; i++) {
        buffer[fileIndex++];
      }

      // Timer info

      // DIV
      // TIMA
      // f.write_16bit(DIV_counter
      // f.write_16bit(TIMA_counter
      // TMA
      // TAC

      cpu.executeInstruction();
    }
  });
});
