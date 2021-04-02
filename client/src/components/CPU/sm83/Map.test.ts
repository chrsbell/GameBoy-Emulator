import {
  setZFlag,
  getZFlag,
  setCYFlag,
  getCYFlag,
  setHFlag,
  getHFlag,
  setNFlag,
  getNFlag,
} from './Map';
import CPU from '../';

describe('helper functions', () => {
  describe('flags', () => {
    beforeEach(() => {
      CPU.r.af = 0;
    });
    it('sets/unsets/gets the z flag', () => {
      setZFlag(1);
      expect(CPU.r.af).toBe(128);

      expect(getZFlag()).toBe(1);

      setZFlag(0);
      expect(CPU.r.af).toBe(0);
    });
    it('sets/unsets/gets the cy flag', () => {
      setCYFlag(1);
      expect(CPU.r.af).toBe(16);

      expect(getCYFlag()).toBe(1);

      setCYFlag(0);
      expect(CPU.r.af).toBe(0);
    });
    it('sets/unsets/gets the h flag', () => {
      setHFlag(1);
      expect(CPU.r.af).toBe(32);

      expect(getHFlag()).toBe(1);

      setHFlag(0);
      expect(CPU.r.af).toBe(0);
    });
    it('sets/unsets/gets the n flag', () => {
      setNFlag(1);
      expect(CPU.r.af).toBe(64);

      expect(getNFlag()).toBe(1);

      setNFlag(0);
      expect(CPU.r.af).toBe(0);
    });
  });
});
