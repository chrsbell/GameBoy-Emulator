import {instructionHelpers as helpers} from './Map';
import CPU from '../';
import Flag from '../Flag';
import {lower} from '../../../Types';

describe('helper functions', () => {
  describe('flags', () => {
    beforeEach(() => (CPU.r.af = 0));
    it('sets/unsets/gets the z flag', () => {
      helpers.setZFlag(1);
      expect(CPU.r.af).toBe(128);

      expect(helpers.getZFlag()).toBe(1);

      helpers.setZFlag(0);
      expect(CPU.r.af).toBe(0);
    });
    it('sets/unsets/gets the cy flag', () => {
      helpers.setCYFlag(1);
      expect(CPU.r.af).toBe(16);

      expect(helpers.getCYFlag()).toBe(1);

      helpers.setCYFlag(0);
      expect(CPU.r.af).toBe(0);
    });
    it('sets/unsets/gets the h flag', () => {
      helpers.setHFlag(1);
      expect(CPU.r.af).toBe(32);

      expect(helpers.getHFlag()).toBe(1);

      helpers.setHFlag(0);
      expect(CPU.r.af).toBe(0);
    });
    it('sets/unsets/gets the n flag', () => {
      helpers.setNFlag(1);
      expect(CPU.r.af).toBe(64);

      expect(helpers.getNFlag()).toBe(1);

      helpers.setNFlag(0);
      expect(CPU.r.af).toBe(0);
    });
  });
  describe('half carry', () => {
    beforeEach(() => (CPU.r.af = 0));
    it('checks half carry on addition ops', () => {
      helpers.checkHalfCarry(62, 34);
      expect(new Flag(lower(CPU.r.af)).h).toBe(1);
      helpers.checkHalfCarry(61, 34);
      expect(new Flag(lower(CPU.r.af)).h).toBe(0);
    });
    it('checks for half carry on subtraction ops', () => {
      helpers.checkHalfCarry(11, 15, true);
      expect(new Flag(lower(CPU.r.af)).h).toBe(1);
      helpers.checkHalfCarry(11, 9, true);
      expect(new Flag(lower(CPU.r.af)).h).toBe(0);
    });
  });

  describe('rotate instructions', () => {
    const checkFlags = () => {
      expect(helpers.getZFlag()).toBe(0);
      expect(helpers.getNFlag()).toBe(0);
      expect(helpers.getHFlag()).toBe(0);
    };
    describe('rotate left', () => {
      beforeEach(() => (CPU.r.af = 0));
      it('rotates a register left', () => {
        const reg = 0b00000001;
        const expected = 0b00000010;
        expect(helpers.RLCn(reg)).toBe(expected);
        expect(helpers.getCYFlag()).toBe(0);
        checkFlags();
      });
      it('rotates a register left and sets CY', () => {
        const reg = 0b10000001;
        const expected = 0b00000011;
        expect(helpers.RLCn(reg)).toBe(expected);
        expect(helpers.getCYFlag()).toBe(1);
        checkFlags();
      });
      describe('through carry', () => {
        it('rotates a register left when CY is not set, and sets CY', () => {
          const reg = 0b10000001;
          helpers.setCYFlag(0);
          const expected = 0b00000010;
          expect(helpers.RLn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(1);
          checkFlags();
        });
        it('rotates a register left when CY is not set', () => {
          const reg = 0b00000001;
          helpers.setCYFlag(0);
          const expected = 0b00000010;
          expect(helpers.RLn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(0);
          checkFlags();
        });
        it('rotates a register left when CY is set, and sets CY', () => {
          const reg = 0b10000001;
          helpers.setCYFlag(1);
          const expected = 0b00000011;
          expect(helpers.RLn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(1);
          checkFlags();
        });
        it('rotates a register left when CY is set', () => {
          const reg = 0b00000001;
          helpers.setCYFlag(1);
          const expected = 0b00000011;
          expect(helpers.RLn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(0);
          checkFlags();
        });
      });
    });
    describe('rotate right', () => {
      beforeEach(() => (CPU.r.af = 0));
      it('rotates a register right', () => {
        const reg = 0b00000010;
        const expected = 0b00000001;
        expect(helpers.RRCn(reg)).toBe(expected);
        expect(helpers.getCYFlag()).toBe(0);
        checkFlags();
      });
      it('rotates a register right and sets CY', () => {
        const reg = 0b00000001;
        const expected = 0b10000000;
        expect(helpers.RRCn(reg)).toBe(expected);
        expect(helpers.getCYFlag()).toBe(1);
        checkFlags();
      });
      describe('through carry', () => {
        it('rotates a register right when CY is not set, and sets CY', () => {
          const reg = 0b10000001;
          helpers.setCYFlag(0);
          const expected = 0b01000000;
          expect(helpers.RRn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(1);
          checkFlags();
        });
        it('rotates a register right when CY is not set', () => {
          const reg = 0b10000010;
          helpers.setCYFlag(0);
          const expected = 0b01000001;
          expect(helpers.RRn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(0);
          checkFlags();
        });
        it('rotates a register right when CY is set', () => {
          const reg = 0b10000010;
          helpers.setCYFlag(1);
          const expected = 0b11000001;
          expect(helpers.RRn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(0);
          checkFlags();
        });
        it('rotates a register right when CY is set, and sets CY', () => {
          const reg = 0b10000001;
          helpers.setCYFlag(1);
          const expected = 0b11000000;
          expect(helpers.RRn(reg)).toBe(expected);
          expect(helpers.getCYFlag()).toBe(1);
          checkFlags();
        });
      });
    });
  });
  describe('shift left', () => {
    it('shifts a register left and sets least significant bit to 0', () => {});
  });
});
