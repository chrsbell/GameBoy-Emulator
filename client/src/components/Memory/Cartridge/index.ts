import {DEBUG} from '../../../helpers/Debug';
import type {byte, word} from '../../../helpers/Primitives';
import Memory from '../index';
import {CartridgeTypes, RAMSizeCodeMap, ROMSizeCodeMap} from './const';

abstract class Cartridge {
  // entire cartridge ROM
  public rom: Uint8Array = null!;
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

  public constructor(
    memory: Memory,
    rom: Uint8Array,
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
    this.initializeBanks();
    if (DEBUG) {
      console.log('ROM Size:');
      console.dir(ROMSizeCodeMap[this.romSizeCode]);
      console.log('RAM Size:');
      console.dir(RAMSizeCodeMap[this.ramSizeCode]);
      console.log(`Cartridge Type: ${CartridgeTypes[this.mbcType]}`);
      console.log('Loaded ROM file.');
    }
  }
  public reset() {
    this.rom = null!;
    this.romBanks = [];
    this.romSizeCode = 0;
    this.ramSizeCode = 0;
    this.ramBanks = [];
    this.currROMBank = 1;
    this.currRAMBank = 1;
    this.mbcType = 0;
  }
  public abstract handleRegisterChanges(address: word, data: byte): void;
  public abstract initializeBanks(): void;
}

export default Cartridge;
