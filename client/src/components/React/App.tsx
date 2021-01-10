import ReactDOM from 'react-dom';
import React, { useEffect, useReducer, useRef } from 'react';
import Emulator from '../Emulator/Emulator';
import AppContext from './Context';
import Wrapper from './Wrapper';

import type { Hex } from '../Types';

interface AppState {
  canvas: HTMLCanvasElement;
  parsedROM: Array<Hex>;
}

const initialState: AppState = {
  canvas: null as HTMLCanvasElement,
  parsedROM: null as Array<Hex>,
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
        parsedROM: action.parsedROM.slice(0),
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
    const { parsedROM } = appState;
    if (appState.parsedROM) {
      emulator.current.load(parsedROM);
    }
  }, [appState.parsedROM]);

  useEffect(() => {
    if (appState.canvas) {
      emulator.current.initRenderer(appState.canvas);
    }
  }, [appState.canvas]);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      <Wrapper />
    </AppContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
