interface SizeCode {
  [key: number]: {size: number; numBanks: number};
}

export const ROMSizeCodeMap: SizeCode = {
  0x00: {size: 32768, numBanks: 2},
  0x01: {size: 65536, numBanks: 4},
  0x02: {size: 131072, numBanks: 8},
  0x03: {size: 262144, numBanks: 16},
  0x04: {size: 524288, numBanks: 32},
  0x05: {size: 1024000, numBanks: 64},
};

export const RAMSizeCodeMap: SizeCode = {
  0x00: {size: 0, numBanks: 0},
  0x01: {size: 2048, numBanks: 1},
  0x02: {size: 8192, numBanks: 1},
  0x03: {size: 32768, numBanks: 4},
  0x04: {size: 131072, numBanks: 16},
  0x05: {size: 65536, numBanks: 8},
};

interface CartridgeCode {
  [key: number]: string;
}

export const CartridgeTypes: CartridgeCode = {
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
