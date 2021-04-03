import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import _ from 'lodash';
const chalk = require('chalk');
import CPU from '.';
import Memory from '../Memory';
import {byte, word, upper, lower, setLower, toHex} from '../Types';
import Flag from './Flag';

const ROM_FOLDER = path.join(
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
        expected: byte | word,
        register: string,
        expectedState: CPUInfo
      ): R;
    }
  }
}

const logObject = (object: Object) => util.inspect(object, false, null, true);
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
    expected: byte | word,
    register: string,
    expectedState: CPUInfo
  ) {
    if (received === expected) {
      return {
        message: () => 'Success',
        pass: true,
      };
    } else {
      const logged: string | byte | word = received;

      return {
        message: () =>
          `Expected register ${chalk.green(register)} value ${chalk.red(
            logged
          )} to equal ${chalk.green(expected)} after instructions: \n\n${[
            ...new Set([...CPU.lastExecuted]),
          ]
            .map(instr => _.sample(consoleColors)(toHex(instr)))
            .reverse()
            .join(' ')}\n\nExpected CPU State: ${logObject(
            expectedState
          )}\n\nExpected Flag: ${logObject(expectedState.f)}`,
        pass: false,
      };
    }
  },
});

/**
 * Loads a test ROM and the expected cpu state.
 * @returns {Buffer}
 */
const setupTestROM = (testROM: string): Buffer => {
  const ROMFile: Buffer = fs.readFileSync(path.join(ROM_FOLDER, testROM));
  Memory.load(null, new Uint8Array([...ROMFile]));
  return fs.readFileSync(path.join(GENERATED_FOLDER, `${testROM}.state`));
};

/**
 * Extracts the next expected CPU state from a save state.
 * @returns {Array}
 */
const readSaveState = (
  saveState: Buffer,
  fileIndex: number
): [CPUInfo, number] => {
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
  return [cpuState, fileIndex];
};

describe('CPU', () => {
  beforeEach(() => {
    Memory.reset();
    CPU.reset();
  });

  xit('executes an instruction', () => {
    Memory.load(null, new Uint8Array([...Array(8192 * 2).fill(0)]));
    const memReadSpy = jest.spyOn(Memory, 'readByte');
    // to do: NOP instruction spy
    const cycles = CPU.executeInstruction();
    expect(memReadSpy).toHaveBeenCalledTimes(1);
    expect(cycles).toEqual(4);
  });

  /**
   * Compares save states from a test ROM to the cpu's state
   */
  const checkRegisters = (testROM: string) => {
    let fileIndex = 0;
    let expected: CPUInfo;
    // Arrange
    const saveState: Buffer = setupTestROM(testROM);
    // skip initial state
    [expected, fileIndex] = readSaveState(saveState, fileIndex);
    for (let i = 0; i < saveState.length; i++) {
      // Act
      CPU.executeInstruction();
      [expected, fileIndex] = readSaveState(saveState, fileIndex);
      // Assert
      expect(CPU.pc).toMatchRegister(expected.pc, 'PC', expected);
      expect(CPU.sp).toMatchRegister(expected.sp, 'SP', expected);
      expect(CPU.r.hl).toMatchRegister(expected.hl, 'HL', expected);
      expect(upper(CPU.r.af)).toMatchRegister(expected.a, 'A', expected);
      expect(upper(CPU.r.bc)).toMatchRegister(expected.b, 'B', expected);
      expect(lower(CPU.r.bc)).toMatchRegister(expected.c, 'C', expected);
      expect(upper(CPU.r.de)).toMatchRegister(expected.d, 'D', expected);
      expect(lower(CPU.r.de)).toMatchRegister(expected.e, 'E', expected);
      expect(lower(CPU.r.af)).toMatchRegister(expected.f, 'F', expected);
    }
  };

  it('executes SP and HL instructions', () => {
    checkRegisters('03-op sp,hl.gb');
  });

  xit('executes immediate instructions', () => {
    checkRegisters('04-op r,imm.gb');
  });

  xit('executes BC/DE/HL arithmetic', () => {
    checkRegisters('05-op rp.gb');
  });

  xit('executes LD r,r ($40-$7F)', () => {
    checkRegisters('06-ld r,r.gb');
  });

  xit('executes miscellaneous instructions', () => {
    checkRegisters('08-misc instrs.gb');
  });

  xit('executes register instructions pt. 1', () => {
    checkRegisters('09-op r,r.gb');
  });

  xit('executes register instructions pt. 2', () => {
    checkRegisters('10-bit ops.gb');
  });

  xit('executes HL/BC/DE instructions.', () => {
    checkRegisters('11-op a,(hl).gb');
  });
});
