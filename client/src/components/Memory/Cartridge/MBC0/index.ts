import Cartridge from '../index';
import {RAMSizeCodeMap} from '../const';

class MBC0 extends Cartridge {
  public initializeBanks(): void {
    this.ramBanks = new Array(1);
    const ramSize = RAMSizeCodeMap[this.ramSizeCode].size;
    this.ramBanks[0] = new Uint8Array(ramSize);
    this.romBanks = new Array(1);
    this.romBanks[0] = new Uint8Array(this.rom.slice(0x4000, 0x8000));
  }
  // No special handling needed for MBC 0 carts
  public handleRegisterChanges(): void {}
}

export default MBC0;
