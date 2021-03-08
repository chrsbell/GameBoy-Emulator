import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import CPU from '.';
import Memory from '../Memory';
import { byte, word } from '../Types';
const ROM_FOLDER = path.join(__dirname, '..', '..', '..', '..', 'public', 'roms');
const GENERATED_FOLDER = path.join(__dirname, '..', '..', '..', 'test', 'generated');

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

      cpuStates[i].interrupt_master_enable = Boolean(pyboySave[fileIndex++]);
      cpuStates[i].halted = Boolean(pyboySave[fileIndex++]);
      cpuStates[i].stopped = Boolean(pyboySave[fileIndex++]);

      debugger;
    }
  });
});
