import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import CPU from '.';
import Memory from '../Memory';

import { byte, word, upper, lower } from '../Types';
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

beforeAll(() => {
  const BIOSFile: Buffer = fs.readFileSync(path.join(ROM_FOLDER, 'bios.bin'));
  const ROMFile: Buffer = fs.readFileSync(path.join(ROM_FOLDER, 'tetris.gb'));

  Memory.load(new Uint8Array([...BIOSFile]), new Uint8Array([...ROMFile]));
  expect(Memory).toBeDefined();
});

describe('CPU', () => {
  it('matches the internal state of another emulator', async () => {
    const cpu = new CPU();

    let pyboySave = await fs.promises.readFile(
      path.join(GENERATED_FOLDER, 'tetris.gb', 'cpu.state')
    );

    let fileIndex = 0;

    const parseCPUState = (): CPUInfo => {
      const cpuState = {} as CPUInfo;
      // CPU Info
      cpuState.a = pyboySave[fileIndex++];
      cpuState.f = pyboySave[fileIndex++];
      cpuState.b = pyboySave[fileIndex++];
      cpuState.c = pyboySave[fileIndex++];
      cpuState.d = pyboySave[fileIndex++];
      cpuState.e = pyboySave[fileIndex++];
      let hl = pyboySave[fileIndex++];
      hl |= pyboySave[fileIndex++] << 8;
      cpuState.hl = hl;
      let sp = pyboySave[fileIndex++];
      sp |= pyboySave[fileIndex++] << 8;
      cpuState.sp = sp;
      let pc = pyboySave[fileIndex++];
      pc |= pyboySave[fileIndex++] << 8;
      cpuState.pc = pc;

      cpuState.interrupt_master_enable = Boolean(pyboySave[fileIndex++]);
      cpuState.halted = Boolean(pyboySave[fileIndex++]);
      cpuState.stopped = Boolean(pyboySave[fileIndex++]);
      return cpuState;
    };

    // skip initial state
    parseCPUState();

    for (let i = 0; i < 100; i++) {
      cpu.executeInstruction();
      let expected: CPUInfo = parseCPUState();
      expect(expected.pc).toEqual(cpu.pc);
      expect(expected.sp).toEqual(cpu.sp);
      expect(expected.hl).toEqual(cpu.r.hl);
      expect(expected.a).toEqual(upper(cpu.r.af));
      expect(expected.b).toEqual(upper(cpu.r.bc));
      expect(expected.c).toEqual(lower(cpu.r.bc));
      expect(expected.d).toEqual(upper(cpu.r.de));
      expect(expected.e).toEqual(lower(cpu.r.de));
      debugger;
      expect(expected.f).toEqual(cpu.r.f.value());
    }
  });
});
