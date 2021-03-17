export type Action =
  | {type: 'canvas'; canvas: HTMLCanvasElement}
  | {type: 'parsedROM'; parsedROM: Uint8Array}
  | {type: 'parsedBIOS'; parsedBIOS: Uint8Array};

export interface AppContext {
  appState: AppState;
  appDispatch: React.Dispatch<Action>;
}

export interface AppState {
  canvas: HTMLCanvasElement;
  parsedROM: Uint8Array;
  parsedBIOS: Uint8Array;
}
