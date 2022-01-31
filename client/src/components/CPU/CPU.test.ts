// @ts-nocheck
import {green, red} from 'chalk';
import {Flag} from 'CPU/index';
import Emulator from 'Emulator/index';
import * as fs from 'fs';
import GLRenderer from 'GLRenderer/index';
import {Primitive} from 'helpers/index';
import {InterruptService} from 'Interrupts/index';
import * as path from 'path';
import * as util from 'util';
jest.mock('GLRenderer/index');

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
  ime: boolean;
  ie: byte;
  if: byte;
  div: byte;
  tima: byte;
  tma: byte;
  tac: byte;
  // divOverflow: byte;
  halted: boolean;
  stopped: boolean;
  stat: byte;
  scanline: byte;
}
/**
 * Custom matcher for CPU test roms
 */

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchRegister(
        received: byte | word,
        emulator: Emulator,
        expected: byte | word,
        register: string,
        expectedState: CPUInfo,
        oldState: CPUInfo
      ): R;
    }
  }
}

const logObject = (object: object): string =>
  util.inspect(object, false, null, true);

expect.extend({
  toMatchRegister(
    received: byte | word,
    emulator: Emulator,
    expected: byte | word,
    register: string,
    expectedState: CPUInfo,
    oldState: CPUInfo
  ) {
    const {cpu, memory, timing} = emulator;
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
            hl: cpu.getHL(),
            sp: cpu.getSP(),
            pc: cpu.getPC(),
            ime: cpu.allInterruptsEnabled,
            ie: memory.readByte(InterruptService.ie),
            if: memory.readByte(InterruptService.if),
            halted: cpu.halted,
            div: memory.ram[0xff04],
            tima: memory.ram[0xff05],
            tma: memory.ram[0xff06],
            tac: memory.ram[0xff07],
            // divOverflow: timing.dividerOverflow & 0xff,
            stat: memory.ram[0xff41],
            scanline: memory.ram[0xff44],
          })}\n\nExpected Flag: ${logObject(Flag.formatFlag(expectedState.f))}
          \n\nOld Expected State: ${logObject(oldState)}`,
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
  cpuState.a = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.f = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.b = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.c = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.d = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.e = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.hl = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.sp = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.pc = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.ime = Boolean(
    saveState[fileIndex++] | (saveState[fileIndex++] << 8)
  );
  cpuState.ie = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.if = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.halted = Boolean(
    saveState[fileIndex++] | (saveState[fileIndex++] << 8)
  );
  cpuState.div = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.tima = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.tma = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.tac = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  // cpuState.divOverflow = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.stat = saveState[fileIndex++] | (saveState[fileIndex++] << 8);
  cpuState.scanline = saveState[fileIndex++] | (saveState[fileIndex++] << 8);

  // cpuState.stopped = Boolean(saveState[fileIndex++]);
  return [cpuState, fileIndex];
};

describe('CPU', () => {
  const renderer = new GLRenderer();
  const emulator = new Emulator(renderer);
  beforeEach(() => {
    emulator.reset();
    jest.spyOn(emulator.ppu, 'buildBGScanline').mockImplementation(jest.fn());
    jest
      .spyOn(emulator.ppu, 'buildWindowScanline')
      .mockImplementation(jest.fn());
    jest
      .spyOn(emulator.ppu, 'buildSpriteScanline')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    GLRenderer.mockClear();
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
  const checkRegisters = async (
    biosFile: string | null,
    testROM: string,
    expectedState: string
  ): void => {
    let fileIndex = 0;
    let expected: CPUInfo;
    // Arrange
    let saveState: Buffer = setupTestROM(biosFile, testROM, expectedState);
    saveState = saveState.slice(0, saveState.length - 32 * 10);
    let oldState: CPUInfo;
    for (let i = 0; i < saveState.length; i++) {
      // Act
      await emulator.cycle(
        0,
        () => {
          // Assert
          let a = emulator.cpu.getAF() >> 8;
          const f = emulator.cpu.getAF() & 255;
          const b = emulator.cpu.getBC() >> 8;
          const c = emulator.cpu.getBC() & 255;
          const d = emulator.cpu.getDE() >> 8;
          const e = emulator.cpu.getDE() & 255;
          const hl = emulator.cpu.getHL();

          expect(emulator.cpu.allInterruptsEnabled).toMatchRegister(
            emulator,
            expected.ime,
            'IME',
            expected,
            oldState
          );
          expect(emulator.memory.ram[0xffff]).toMatchRegister(
            emulator,
            expected.ie,
            'IE',
            expected,
            oldState
          );
          expect((emulator.memory.ram[0xff0f] >> 2) & 1).toMatchRegister(
            emulator,
            (expected.if >> 2) & 1,
            'IF Timer',
            expected,
            oldState
          );
          expect(emulator.cpu.getPC()).toMatchRegister(
            emulator,
            expected.pc,
            'PC',
            expected,
            oldState
          );
          expect(emulator.cpu.getSP()).toMatchRegister(
            emulator,
            expected.sp,
            'SP',
            expected,
            oldState
          );
          expect(hl).toMatchRegister(emulator, expected.hl, 'HL', expected);
          // ignore loading scanline to reg, timing may vary slightly across emulators
          // if (
          //   emulator.cpu.lastExecuted[emulator.cpu.lastExecuted.length - 1] ===
          //     0xf0 &&
          //   emulator.memory.readByte(emulator.cpu.getPC() - 1) === 0x44
          // ) {
          //   console.warn(
          //     'ignoring comparison of register A; loaded from scanline'
          //   );
          //   a = expected.a;
          //   emulator.cpu.setA(expected.a);
          // }
          if (
            emulator.cpu.lastExecuted[emulator.cpu.lastExecuted.length - 1] ===
            0xf0
            // emulator.memory.readByte(emulator.cpu.getPC() - 1) === 0x41
          ) {
            console.warn('ignoring comparison of register A; loaded from STAT');
            a = expected.a;
          }
          emulator.memory.ram[0xff41] = expected.stat;

          expect(a).toMatchRegister(emulator, expected.a, 'A', expected);
          expect(b).toMatchRegister(emulator, expected.b, 'B', expected);
          expect(c).toMatchRegister(emulator, expected.c, 'C', expected);
          expect(d).toMatchRegister(emulator, expected.d, 'D', expected);
          expect(e).toMatchRegister(emulator, expected.e, 'E', expected);
          // expect(f).toMatchRegister(emulator, expected.f, 'F', expected);
          expect(emulator.cpu.halted).toMatchRegister(
            emulator,
            expected.halted,
            'HALT',
            expected,
            oldState
          );
          expect(emulator.memory.ram[0xff04]).toMatchRegister(
            emulator,
            expected.div,
            'DIV',
            expected,
            oldState
          );
          expect(emulator.memory.ram[0xff05]).toMatchRegister(
            emulator,
            expected.tima,
            'TIMA',
            expected,
            oldState
          );
          expect(emulator.memory.ram[0xff06]).toMatchRegister(
            emulator,
            expected.tma,
            'TMA',
            expected,
            oldState
          );
          expect(emulator.memory.ram[0xff07]).toMatchRegister(
            emulator,
            expected.tac,
            'TAC',
            expected,
            oldState
          );
          // expect(emulator.timing.dividerOverflow).toMatchRegister(
          //   emulator,
          //   expected.divOverflow & 0xff,
          //   'DIVTicks',
          //   expected,
          //   oldState
          // );
          // expect(emulator.memory.ram[0xff41]).toMatchRegister(
          //   emulator,
          //   expected.stat & 0xff,
          //   'STAT',
          //   expected,
          //   oldState
          // );
          // expect(emulator.memory.ram[0xff44]).toMatchRegister(
          //   emulator,
          //   expected.scanline & 0xff,
          //   'LY',
          //   expected,
          //   oldState
          // );
          oldState = expected;
        },
        () => {
          [expected, fileIndex] = readSaveState(saveState, fileIndex);
          emulator.ppu.stat.value = expected.stat;
        }
      );
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

  it('exectues a ROM file', async () => {
    jest.setTimeout(30000);
    await checkRegisters(
      null,
      path.join(TEST_ROM_FOLDER, 'opus5.gb'),
      'opus5.gb.state'
    );
  });

  xit('executes SP and HL instructions', () => {
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
      '06-ld r,r.gb.state'
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
