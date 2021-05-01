import CPU from '../';
import {instructionHelpers as helpers} from './Map';

describe('helper functions', () => {
  const cpu = new CPU();
  beforeEach(() => {
    cpu.reset();
  });
  describe('rotate instructions', () => {
    const checkFlags = () => {
      expect(cpu.getZFlag()).toBe(0);
      expect(cpu.getNFlag()).toBe(0);
      expect(cpu.getHFlag()).toBe(0);
    };
    describe('rotate left', () => {
      beforeEach(() => (cpu.r.af = 0));
      it('rotates a register left', () => {
        const reg = 0b00000001;
        const expected = 0b00000010;
        expect(helpers.RLCn(cpu, reg)).toBe(expected);
        expect(cpu.getCYFlag()).toBe(0);
        checkFlags();
      });
      it('rotates a register left and sets CY', () => {
        const reg = 0b10000001;
        const expected = 0b00000011;
        expect(helpers.RLCn(cpu, reg)).toBe(expected);
        expect(cpu.getCYFlag()).toBe(1);
        checkFlags();
      });
      describe('through carry', () => {
        it('rotates a register left when CY is not set, and sets CY', () => {
          const reg = 0b10000001;
          cpu.setCYFlag(0);
          const expected = 0b00000010;
          expect(helpers.RLn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(1);
          checkFlags();
        });
        it('rotates a register left when CY is not set', () => {
          const reg = 0b00000001;
          cpu.setCYFlag(0);
          const expected = 0b00000010;
          expect(helpers.RLn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(0);
          checkFlags();
        });
        it('rotates a register left when CY is set, and sets CY', () => {
          const reg = 0b10000001;
          cpu.setCYFlag(1);
          const expected = 0b00000011;
          expect(helpers.RLn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(1);
          checkFlags();
        });
        it('rotates a register left when CY is set', () => {
          const reg = 0b00000001;
          cpu.setCYFlag(1);
          const expected = 0b00000011;
          expect(helpers.RLn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(0);
          checkFlags();
        });
      });
    });
    describe('rotate right', () => {
      beforeEach(() => (cpu.r.af = 0));
      it('rotates a register right', () => {
        const reg = 0b00000010;
        const expected = 0b00000001;
        expect(helpers.RRCn(cpu, reg)).toBe(expected);
        expect(cpu.getCYFlag()).toBe(0);
        checkFlags();
      });
      it('rotates a register right and sets CY', () => {
        const reg = 0b00000001;
        const expected = 0b10000000;
        expect(helpers.RRCn(cpu, reg)).toBe(expected);
        expect(cpu.getCYFlag()).toBe(1);
        checkFlags();
      });
      describe('through carry', () => {
        it('rotates a register right when CY is not set, and sets CY', () => {
          const reg = 0b10000001;
          cpu.setCYFlag(0);
          const expected = 0b01000000;
          expect(helpers.RRn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(1);
          checkFlags();
        });
        it('rotates a register right when CY is not set', () => {
          const reg = 0b10000010;
          cpu.setCYFlag(0);
          const expected = 0b01000001;
          expect(helpers.RRn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(0);
          checkFlags();
        });
        it('rotates a register right when CY is set', () => {
          const reg = 0b10000010;
          cpu.setCYFlag(1);
          const expected = 0b11000001;
          expect(helpers.RRn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(0);
          checkFlags();
        });
        it('rotates a register right when CY is set, and sets CY', () => {
          const reg = 0b10000001;
          cpu.setCYFlag(1);
          const expected = 0b11000000;
          expect(helpers.RRn(cpu, reg)).toBe(expected);
          expect(cpu.getCYFlag()).toBe(1);
          checkFlags();
        });
      });
    });
  });
  describe('shift left', () => {
    it('shifts a register left and sets least significant bit to 0', () => {});
  });
});
