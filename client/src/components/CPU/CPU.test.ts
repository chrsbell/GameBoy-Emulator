// @ts-nocheck
import CanvasRenderer from 'CanvasRenderer/index';
import {green, red} from 'chalk';
import CPU, {Flag} from 'CPU/index';
import Emulator from 'Emulator/index';
import * as fs from 'fs';
import {Primitive} from 'helpers/index';
import * as path from 'path';
import * as util from 'util';
jest.mock('CanvasRenderer/index');

const TEST_ROM_FOLDER = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'client',
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
const ROM_FOLDER = path.join(__dirname, '..', '..', '..', '..', 'roms');
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
  ie: boolean;
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
        logged = logObject(Flag.formatFlag(<byte>received));
      }
      return {
        message: (): string =>
          `Expected register ${green(register)} value ${red(
            logged
          )} to equal ${green(
            register === 'F'
              ? logObject(Flag.formatFlag(<byte>expected))
              : expected
          )} after instructions: \n\n${cpu.lastExecuted
            .map(instr => red(Primitive.toHex(instr)))
            .reverse()
            .join(' ')}\n\nExpected CPU State: ${logObject(
            expectedState
          )}\n\nActual CPU State: ${logObject({
            a: cpu.getAF() >> 8,
            f: cpu.getAF() & 255,
            b: cpu.getBC() >> 8,
            c: cpu.getBC() & 255,
            d: cpu.getDE() >> 8,
            e: cpu.getDE() & 255,
            hl: cpu.getHL() >> 8,
            sp: cpu.getSP(),
            pc: cpu.getPC(),
            interruptsEnabled: cpu.getIE(),
            halted: cpu.halted,
          })}\n\nExpected Flag: ${logObject(Flag.formatFlag(expectedState.f))}`,
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

  cpuState.ie = Boolean(saveState[fileIndex++]);
  cpuState.halted = Boolean(saveState[fileIndex++]);
  cpuState.stopped = Boolean(saveState[fileIndex++]);
  return [cpuState, fileIndex];
};

describe('CPU', () => {
  const canvas = new CanvasRenderer();
  // canvas.initialize(createCanvas(787, 720));
  const emulator = new Emulator(canvas);
  beforeEach(() => {
    emulator.reset();
    jest.spyOn(emulator.ppu, 'renderTiles').mockImplementation(jest.fn());
  });

  afterEach(() => {
    CanvasRenderer.mockClear();
    jest.restoreAllMocks();
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
      emulator.load(BIOSFile, new Uint8Array([...ROMFile]));
    } else {
      emulator.load([], new Uint8Array([...ROMFile]));
    }
    // will be manually stepping through emulator
    window.clearInterval(emulator.timeout);
    return fs.readFileSync(path.join(GENERATED_FOLDER, `${expectedState}`));
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
    emulator.ppu;
    for (let i = 0; i < saveState.length; i++) {
      // Act
      emulator.update(() => {
        [expected, fileIndex] = readSaveState(saveState, fileIndex);

        // Assert
        const a = emulator.cpu.getAF() >> 8;
        const f = emulator.cpu.getAF() & 255;
        const b = emulator.cpu.getBC() >> 8;
        const c = emulator.cpu.getBC() & 255;
        const d = emulator.cpu.getDE() >> 8;
        const e = emulator.cpu.getDE() & 255;
        const hl = emulator.cpu.getHL();
        expect(emulator.cpu.getPC()).toMatchRegister(
          emulator.cpu.getPC(),
          expected.pc,
          'PC',
          expected
        );
        expect(emulator.cpu.getSP()).toMatchRegister(
          emulator.cpu.getSP(),
          expected.sp,
          'SP',
          expected
        );
        expect(hl).toMatchRegister(emulator.cpu, expected.hl, 'HL', expected);
        expect(a).toMatchRegister(emulator.cpu, expected.a, 'A', expected);
        expect(b).toMatchRegister(emulator.cpu, expected.b, 'B', expected);
        expect(c).toMatchRegister(emulator.cpu, expected.c, 'C', expected);
        expect(d).toMatchRegister(emulator.cpu, expected.d, 'D', expected);
        expect(e).toMatchRegister(emulator.cpu, expected.e, 'E', expected);
        expect(f).toMatchRegister(emulator.cpu, expected.f, 'F', expected);
      });
    }
  };

  xit('executes an instruction', () => {
    emulator.load([], new Uint8Array([...Array(8192 * 2).fill(0)]));
    const memReadSpy = jest.spyOn(emulator.memory, 'readByte');
    // should have called NOP instruction
    emulator.update((elapsed: number) => {
      expect(memReadSpy).toHaveBeenCalledTimes(3);
      expect(elapsed).toEqual(4);
    });
  });

  xit('exectues a ROM file', () => {
    checkRegisters(null, path.join(TEST_ROM_FOLDER, 'tetris.gb'), 'tetris.gb');
  });

  it('executes SP and HL instructions', () => {
    checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, '03-op sp,hl.gb'),
      '03-op sp,hl.gb.state'
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
      '08-misc instrs.gb.state'
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

  // describe('flags', () => {
  //   const ppuBridge = new PPUBridge();
  //   const cpu = new CPU(ppuBridge.memory);
  //   describe('flags', () => {
  //     beforeEach(() => (r.af = 0));
  //     it('sets/unsets/gets the z flag', () => {
  //       cpu.setZFlag(1);
  //       expect(r.af).toBe(128);

  //       expect(cpu.getZFlag()).toBe(1);

  //       cpu.setZFlag(0);
  //       expect(r.af).toBe(0);
  //     });
  //     it('sets/unsets/gets the cy flag', () => {
  //       cpu.setCYFlag(1);
  //       expect(r.af).toBe(16);

  //       expect(cpu.getCYFlag()).toBe(1);

  //       cpu.setCYFlag(0);
  //       expect(r.af).toBe(0);
  //     });
  //     it('sets/unsets/gets the h flag', () => {
  //       cpu.setHFlag(1);
  //       expect(r.af).toBe(32);

  //       expect(cpu.getHFlag()).toBe(1);

  //       cpu.setHFlag(0);
  //       expect(r.af).toBe(0);
  //     });
  //     it('sets/unsets/gets the n flag', () => {
  //       cpu.setNFlag(1);
  //       expect(r.af).toBe(64);

  //       expect(cpu.getNFlag()).toBe(1);

  //       cpu.setNFlag(0);
  //       expect(r.af).toBe(0);
  //     });
  //   });
  // });

  // describe('half carry', () => {
  //   beforeEach(() => (r.af = 0));
  //   it('checks half carry on addition ops', () => {
  //     cpu.checkHalfCarry(62, 34);
  //     expect(Primitive.lower(r.af) >> 5).toBe(1);
  //     cpu.checkHalfCarry(61, 34);
  //     expect(Primitive.lower(r.af) >> 5).toBe(0);
  //   });
  //   it('checks for half carry on subtraction ops', () => {
  //     cpu.checkHalfCarry(11, 15, true);
  //     expect(Primitive.lower(r.af) >> 5).toBe(1);
  //     cpu.checkHalfCarry(11, 9, true);
  //     expect(Primitive.lower(r.af) >> 5).toBe(0);
  //   });
  // });
});
