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
  it(`matches the internal state of another emulator's cpu during bios`, async () => {
    // Arrange
    const cpu = new CPU();
    const saveState: Buffer = await fs.promises.readFile(
      path.join(GENERATED_FOLDER, 'tetris.gb', 'cpu.state')
    );

    let fileIndex = 0;

    const readSaveState = (): CPUInfo => {
      const cpuState = {} as CPUInfo;
      // CPU Info
      cpuState.a = saveState[fileIndex++];
      cpuState.f = saveState[fileIndex++];
      cpuState.b = saveState[fileIndex++];
      cpuState.c = saveState[fileIndex++];
      cpuState.d = saveState[fileIndex++];
      cpuState.e = saveState[fileIndex++];
      let hl = saveState[fileIndex++];
      hl |= saveState[fileIndex++] << 8;
      cpuState.hl = hl;
      let sp = saveState[fileIndex++];
      sp |= saveState[fileIndex++] << 8;
      cpuState.sp = sp;
      let pc = saveState[fileIndex++];
      pc |= saveState[fileIndex++] << 8;
      cpuState.pc = pc;

      cpuState.interrupt_master_enable = Boolean(saveState[fileIndex++]);
      cpuState.halted = Boolean(saveState[fileIndex++]);
      cpuState.stopped = Boolean(saveState[fileIndex++]);
      return cpuState;
    };

    // skip initial state
    readSaveState();

    for (let i = 0; i < saveState.length; i++) {
      debugger;
      // Act
      cpu.executeInstruction();
      const expected: CPUInfo = readSaveState();
      // Assert
      expect(cpu.pc).toEqual(expected.pc);
      expect(cpu.sp).toEqual(expected.sp);
      expect(cpu.r.hl).toEqual(expected.hl);
      expect(upper(cpu.r.af)).toEqual(expected.a);
      expect(upper(cpu.r.bc)).toEqual(expected.b);
      expect(lower(cpu.r.bc)).toEqual(expected.c);
      expect(upper(cpu.r.de)).toEqual(expected.d);
      expect(lower(cpu.r.de)).toEqual(expected.e);
      expect(cpu.r.f.value()).toEqual(expected.f);
    }
  });
});
