import Cartridge from 'Memory/Cartridge';
import Memory from 'Memory/index';
class MBC0 extends Cartridge {
  constructor(
    memory: Memory,
    rom: ByteArray,
    mbcType: number,
    romSizeCode: byte,
    ramSizeCode: byte
  ) {
    super(memory, rom, mbcType, romSizeCode, ramSizeCode);
    this.initializeBanks();
  }
  public initializeBanks = (): void => {
    this.ramBanks = new Array(1);
    this.ramBanks[0] = new Uint8Array(0x2000);
    this.romBanks = new Array(2);
    this.romBanks[1] = new Uint8Array(this.rom.slice(0x4000, 0x8000));
  };
  // No special handling needed for MBC 0 carts
  public handleRegisterChanges = (): void => {};
}

export default MBC0;
