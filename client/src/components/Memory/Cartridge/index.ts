import {DEBUG} from 'helpers/Debug';
import Memory from 'Memory/index';

const ROMSizeCodeMap: SizeCode = {
  0x00: {size: 32768, numBanks: 2},
  0x01: {size: 65536, numBanks: 4},
  0x02: {size: 131072, numBanks: 8},
  0x03: {size: 262144, numBanks: 16},
  0x04: {size: 524288, numBanks: 32},
  0x05: {size: 1024000, numBanks: 64},
};

const RAMSizeCodeMap: SizeCode = {
  0x00: {size: 0, numBanks: 0},
  0x01: {size: 2048, numBanks: 1},
  0x02: {size: 8192, numBanks: 1},
  0x03: {size: 32768, numBanks: 4},
  0x04: {size: 131072, numBanks: 16},
  0x05: {size: 65536, numBanks: 8},
};

const CartridgeTypes: NumStrIdx = {
  0x00: 'ROM Only',
  0x01: 'MBC #1',
  0x02: 'MBC #1 + RAM',
  0x03: 'MBC #1 + RAM + Battery',
  0x05: 'MBC2',
  0x06: 'MBC2 + Battery',
  0x08: 'ROM + RAM',
  0x09: 'MBCM #1',
  0x0b: 'MBCM #1 + RAM',
  0x0c: 'MBCM #1 + RAM + Battery',
  0x0d: 'MBCM #1 + RAM + Battery',
  0x0f: 'MBC #3 + Timer + Battery',
  0x10: 'MBC #3 + Timer + RAM + Battery',
  0x11: 'MBC #3',
  0x12: 'MBC #3 + RAM',
  0x13: 'MBC #3 + RAM + Battery',
};

abstract class Cartridge {
  // entire cartridge ROM
  public rom: ByteArray = [];
  // each ROM Bank is 16kB
  public romBanks: Array<Uint8Array> = [];
  // the ROM size code
  public romSizeCode: byte = 0;
  // external RAM size code
  public ramSizeCode: byte = 0;
  public ramBanks: Array<Uint8Array> = [];
  public memory: Memory = null!;
  // current ROM bank
  // https://gbdev.io/pandocs/#_0000-3fff-rom-bank-00-20-40-60-read-only
  public currROMBank: byte = 1;
  // current RAM bank (1 bank for RAM with 2kB-8kB sizes)
  public currRAMBank: byte = 1;
  public mbcType: number;

  constructor(
    memory: Memory,
    rom: ByteArray,
    mbcType: number,
    romSizeCode: byte,
    ramSizeCode: byte
  ) {
    this.reset();
    this.memory = memory;
    this.rom = rom;
    this.mbcType = mbcType;
    this.romSizeCode = romSizeCode;
    this.ramSizeCode = ramSizeCode;
    if (DEBUG) {
      console.log('ROM Size:');
      console.dir(ROMSizeCodeMap[this.romSizeCode]);
      console.log('RAM Size:');
      console.dir(RAMSizeCodeMap[this.ramSizeCode]);
      console.log(`Cartridge Type: ${CartridgeTypes[this.mbcType]}`);
      console.log('Loaded ROM file.');
    }
  }
  public reset = (): void => {
    this.rom = null!;
    this.romBanks = [];
    this.romSizeCode = 0;
    this.ramSizeCode = 0;
    this.ramBanks = [];
    this.currROMBank = 1;
    this.currRAMBank = 1;
    this.mbcType = 0;
  };
  public abstract handleRegisterChanges(address: word, data: byte): void;
  public abstract initializeBanks(): void;
}

export default Cartridge;
export {ROMSizeCodeMap, RAMSizeCodeMap, CartridgeTypes};
