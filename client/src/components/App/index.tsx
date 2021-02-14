import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { useEffect, useReducer, useRef } from 'react';
import Emulator from '../Emulator';
import GLRenderer from '../GLRenderer';
import AppContext from './Context';
import Wrapper from './Wrapper';
import { Byte, ByteArray } from '../Types';

interface AppState {
  canvas: HTMLCanvasElement;
  parsedROM: ByteArray;
  parsedBIOS: ByteArray;
}

const initialState: AppState = {
  canvas: null as HTMLCanvasElement,
  parsedROM: null as ByteArray,
  parsedBIOS: null as ByteArray,
};

const reducer = (state: AppState, action: any) => {
  switch (action.type) {
    case 'canvas':
      return {
        ...state,
        canvas: action.canvas,
      };
    case 'parsed_rom':
      return {
        ...state,
        parsedROM: action.parsedROM,
      };
    case 'parsed_bios':
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
    const { parsedROM, parsedBIOS } = appState;
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
    <AppContext.Provider value={{ appState, dispatch }}>
      <Wrapper />
    </AppContext.Provider>
  );
};

export default App;
