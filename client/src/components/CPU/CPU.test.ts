import * as chalk from 'chalk';
import CPU from 'CPU/index';
import * as fs from 'fs';
import Primitive from 'helpers/Primitives';
import _ from 'lodash';
import * as path from 'path';
import * as util from 'util';
import Memory from '../Memory';
import PPU from '../PPU';
import Flag, {formatFlag} from './Flag';

const TEST_ROM_FOLDER = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'test',
  'gb-test-roms',
  'cpu_instrs',
  'individual'
);
const GENERATED_FOLDER = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'test',
  'generated'
);
const ROM_FOLDER = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'public',
  'roms'
);

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
/**
 * Custom matcher for CPU test roms
 */

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchRegister(
        cpu: CPU,
        expected: byte | word,
        register: string,
        expectedState: CPUInfo
      ): R;
    }
  }
}

const logObject = (object: object): string =>
  util.inspect(object, false, null, true);

const consoleColors = [
  chalk.red,
  chalk.blue,
  chalk.green,
  chalk.cyan,
  chalk.magenta,
];

expect.extend({
  toMatchRegister(
    received: byte | word,
    cpu: CPU,
    expected: byte | word,
    register: string,
    expectedState: CPUInfo
  ) {
    if (received === expected) {
      return {
        message: (): string => 'Success',
        pass: true,
      };
    } else {
      let logged: string | byte | word = received;
      if (register === 'F') {
        logged = logObject(new Flag(cpu, <byte>received));
      }
      return {
        message: (): string =>
          `Expected register ${chalk.green(register)} value ${chalk.red(
            logged
          )} to equal ${chalk.green(
            expected
          )} after instructions: \n\n${cpu.lastExecuted
            .map(instr => _.sample(consoleColors)(instr))
            .join(' ')}\n\nExpected CPU State: ${logObject(
            expectedState
          )}\n\nActual CPU State: ${logObject(
            cpu
          )}\n\nExpected Flag: ${logObject(formatFlag(expectedState.f))}`,
        pass: false,
      };
    }
  },
});

/**
 * Extracts the next expected CPU state from a save state.
 * @returns {Array}
 */
const readSaveState = (
  saveState: Buffer,
  fileIndex: number
): [CPUInfo, number] => {
  const cpuState = <CPUInfo>{};
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
  return [cpuState, fileIndex];
};

describe('CPU', () => {
  const cpu = new CPU();
  const memory = new Memory();
  const ppu = new PPU(memory);
  beforeEach(() => {
    memory.reset();
    cpu.reset();
    ppu.reset();
  });

  /**
   * Loads a test ROM and the expected cpu state.
   * @returns {Buffer}
   */
  const setupTestROM = (
    biosFile: string | null,
    testROM: string,
    expectedState: string
  ): Buffer => {
    const ROMFile: Buffer = fs.readFileSync(testROM);
    if (biosFile) {
      const BIOSFile: Buffer = fs.readFileSync(biosFile);
      memory.load(cpu, BIOSFile, new Uint8Array([...ROMFile]));
    } else {
      memory.load(cpu, [], new Uint8Array([...ROMFile]));
    }
    return fs.readFileSync(
      path.join(GENERATED_FOLDER, `${expectedState}.state`)
    );
  };

  /**
   * Compares save states from a test ROM to the cpu's state
   */
  const checkRegisters = (
    biosFile: string | null,
    testROM: string,
    expectedState: string
  ): void => {
    let fileIndex = 0;
    let expected: CPUInfo;
    // Arrange
    const saveState: Buffer = setupTestROM(biosFile, testROM, expectedState);
    // skip initial state
    [expected, fileIndex] = readSaveState(saveState, fileIndex);
    debugger;
    for (let i = 0; i < saveState.length; i++) {
      // Act
      debugger;
      cpu.executeInstruction(memory);
      // PPU.buildGraphics(cycles);
      // cpu.checkInterrupts();
      [expected, fileIndex] = readSaveState(saveState, fileIndex);
      // if (cpu.lastExecuted[0] === '0xf0') {
      //   cpu.pc = expected.pc;
      //   cpu.sp = expected.sp;
      //   cpu.r.af = (expected.a << 8) | expected.f;
      //   cpu.r.bc = (expected.b << 8) | expected.c;
      //   cpu.r.de = (expected.d << 8) | expected.e;
      //   cpu.r.hl = expected.hl;
      // }

      // Assert
      expect(cpu.pc).toMatchRegister(cpu, expected.pc, 'PC', expected);
      expect(cpu.sp).toMatchRegister(cpu, expected.sp, 'SP', expected);
      expect(cpu.r.hl).toMatchRegister(cpu, expected.hl, 'HL', expected);
      expect(Primitive.upper(cpu.r.af)).toMatchRegister(
        cpu,
        expected.a,
        'A',
        expected
      );
      expect(Primitive.upper(cpu.r.bc)).toMatchRegister(
        cpu,
        expected.b,
        'B',
        expected
      );
      expect(Primitive.lower(cpu.r.bc)).toMatchRegister(
        cpu,
        expected.c,
        'C',
        expected
      );
      expect(Primitive.upper(cpu.r.de)).toMatchRegister(
        cpu,
        expected.d,
        'D',
        expected
      );
      expect(Primitive.lower(cpu.r.de)).toMatchRegister(
        cpu,
        expected.e,
        'E',
        expected
      );
      expect(Primitive.lower(cpu.r.af)).toMatchRegister(
        cpu,
        expected.f,
        'F',
        expected
      );
    }
  };

  xit('executes an instruction', () => {
    memory.load(cpu, [], new Uint8Array([...Array(8192 * 2).fill(0)]));
    const memReadSpy = jest.spyOn(memory, 'readByte');
    // to do: NOP instruction spy
    const cycles = cpu.executeInstruction(memory);
    expect(memReadSpy).toHaveBeenCalledTimes(1);
    expect(cycles).toEqual(4);
  });

  it('exectues a ROM file', () => {
    checkRegisters(null, path.join(TEST_ROM_FOLDER, 'tetris.gb'), 'tetris.gb');
  });

  xit('executes SP and HL instructions', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '03-op sp,hl.gb'),
      '03-op sp,hl.gb'
    );
  });

  xit('executes immediate instructions', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '04-op r,imm.gb'),
      '04-op r,imm.gb'
    );
  });

  xit('executes BC/DE/HL arithmetic', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '05-op rp.gb'),
      '05-op rp.gb'
    );
  });

  xit('executes LD r,r ($40-$7F)', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '06-ld r,r.gb'),
      '06-ld r,r.gb'
    );
  });

  xit('executes miscellaneous instructions', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '08-misc instrs.gb'),
      '08-misc instrs.gb'
    );
  });

  xit('executes register instructions pt. 1', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '09-op r,r.gb'),
      '09-op r,r.gb.state'
    );
  });

  xit('executes register instructions pt. 2', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '10-bit ops.gb'),
      '10-bit ops.gb.state'
    );
  });

  xit('executes HL/BC/DE instructions.', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '11-op a,(hl).gb'),
      '11-op a,(hl).gb'
    );
  });

  xit('executes the bios', () => {
    checkRegisters(
      path.join(ROM_FOLDER, 'bios.bin'),
      path.join(ROM_FOLDER, 'tetris.gb'),
      'bios.gb'
    );
  });

  describe('flags', () => {
    const cpu = new CPU();
    describe('flags', () => {
      beforeEach(() => (cpu.r.af = 0));
      it('sets/unsets/gets the z flag', () => {
        cpu.setZFlag(1);
        expect(cpu.r.af).toBe(128);

        expect(cpu.getZFlag()).toBe(1);

        cpu.setZFlag(0);
        expect(cpu.r.af).toBe(0);
      });
      it('sets/unsets/gets the cy flag', () => {
        cpu.setCYFlag(1);
        expect(cpu.r.af).toBe(16);

        expect(cpu.getCYFlag()).toBe(1);

        cpu.setCYFlag(0);
        expect(cpu.r.af).toBe(0);
      });
      it('sets/unsets/gets the h flag', () => {
        cpu.setHFlag(1);
        expect(cpu.r.af).toBe(32);

        expect(cpu.getHFlag()).toBe(1);

        cpu.setHFlag(0);
        expect(cpu.r.af).toBe(0);
      });
      it('sets/unsets/gets the n flag', () => {
        cpu.setNFlag(1);
        expect(cpu.r.af).toBe(64);

        expect(cpu.getNFlag()).toBe(1);

        cpu.setNFlag(0);
        expect(cpu.r.af).toBe(0);
      });
    });
  });

  describe('half carry', () => {
    beforeEach(() => (cpu.r.af = 0));
    it('checks half carry on addition ops', () => {
      cpu.checkHalfCarry(62, 34);
      expect(Primitive.lower(cpu.r.af) >> 5).toBe(1);
      cpu.checkHalfCarry(61, 34);
      expect(Primitive.lower(cpu.r.af) >> 5).toBe(0);
    });
    it('checks for half carry on subtraction ops', () => {
      cpu.checkHalfCarry(11, 15, true);
      expect(Primitive.lower(cpu.r.af) >> 5).toBe(1);
      cpu.checkHalfCarry(11, 9, true);
      expect(Primitive.lower(cpu.r.af) >> 5).toBe(0);
    });
  });
});
