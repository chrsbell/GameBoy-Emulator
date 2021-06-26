declare interface Flavoring<FlavorT> {
  _type?: FlavorT;
}

declare type Primitive<T, FlavorT> = T & Flavoring<FlavorT>;

declare type bit = Primitive<number, 'bit'>;
declare type byte = Primitive<number, 'byte'>;
declare type word = Primitive<number, 'word'>;
declare type ByteArray = Uint8Array | Array<byte>;
declare interface OpcodeList {
  [key: string]: Function;
}

declare type Action =
  | {type: 'canvas'; canvas: HTMLCanvasElement}
  | {type: 'parsedROM'; parsedROM: Uint8Array}
  | {type: 'parsedBIOS'; parsedBIOS: Uint8Array};

declare interface AppContext {
  appState: AppState;
  appDispatch: React.Dispatch<Action>;
}

declare interface AppState {
  canvas: HTMLCanvasElement;
  parsedROM: Uint8Array;
  parsedBIOS: Uint8Array;
}

declare type RGB = Array<number>;

declare type ColorScheme = {
  white: RGB;
  lightGray: RGB;
  darkGray: RGB;
  black: RGB;
};

declare interface SizeCode {
  [key: number]: {size: number; numBanks: number};
}

declare interface CartridgeCode {
  [key: number]: string;
}
