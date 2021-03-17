import * as React from 'react';
import {useEffect, useReducer, useRef} from 'react';
import Emulator from '../Emulator';
import AppContext from './Context';
import GLRenderer from '../GLRenderer';
import Wrapper from './Wrapper';

interface AppState {
  canvas: HTMLCanvasElement;
  parsedROM: Uint8Array;
  parsedBIOS: Uint8Array;
}

type Action =
  | {type: 'canvas'; canvas: HTMLCanvasElement}
  | {type: 'parsedROM'; parsedROM: Uint8Array}
  | {type: 'parsedBIOS'; parsedBIOS: Uint8Array};

const initialState: AppState = {
  canvas: null as HTMLCanvasElement,
  parsedROM: null as Uint8Array,
  parsedBIOS: null as Uint8Array,
};

const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case 'canvas':
      return {
        ...state,
        canvas: action.canvas,
      };
    case 'parsedROM':
      return {
        ...state,
        parsedROM: action.parsedROM,
      };
    case 'parsedBIOS':
      return {
        ...state,
        parsedBIOS: action.parsedBIOS,
      };
    default:
      return {
        ...state,
      };
  }
};

const App = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const emulator = useRef(new Emulator());

  useEffect(() => {
    const {parsedROM, parsedBIOS} = appState;
    if (parsedROM && parsedBIOS) {
      if (emulator.current.load(parsedBIOS, parsedROM)) {
        emulator.current.update();
      }
    }
  }, [appState.parsedROM, appState.parsedBIOS]);

  useEffect(() => {
    if (appState.canvas && !GLRenderer.isInitialized()) {
      GLRenderer.initialize(appState.canvas);
    }
  }, [appState.canvas]);

  return (
    <AppContext.Provider value={{appState, dispatch}}>
      <Wrapper />
    </AppContext.Provider>
  );
};

export default App;
