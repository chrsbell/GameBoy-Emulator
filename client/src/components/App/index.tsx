import * as React from 'react';
import {useEffect, useReducer, useRef} from 'react';
import CanvasRenderer from '../CanvasRenderer';
import Emulator from '../Emulator';
import type {Action, AppContext, AppState} from './types';
import Wrapper from './Wrapper';

const initialState: AppState = {
  canvas: null!,
  parsedROM: new Uint8Array(),
  parsedBIOS: new Uint8Array(),
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

const App: React.FC = () => {
  const [appState, appDispatch] = useReducer(reducer, initialState);
  const emulator = useRef(new Emulator());

  useEffect(() => {
    if (appState.parsedROM.length) {
      emulator.current.load(appState.parsedBIOS, appState.parsedROM);
    }
  }, [appState.parsedROM, appState.parsedBIOS]);

  useEffect(() => {
    if (appState.canvas && !CanvasRenderer.initialized) {
      CanvasRenderer.initialize(appState.canvas);
    }
  }, [appState.canvas]);

  const reducerProps: AppContext = {
    appState,
    appDispatch,
  };

  return <Wrapper {...reducerProps} />;
};

export default App;
