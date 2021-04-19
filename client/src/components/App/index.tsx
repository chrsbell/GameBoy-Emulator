import * as React from 'react';
import {useEffect, useReducer, useRef} from 'react';
import CanvasRenderer from '../CanvasRenderer';
import Emulator from '../Emulator';
import type {Action, AppContext, AppState} from './AppTypes';
import Wrapper from './Wrapper';

const initialState: AppState = {
  canvas: null!,
  parsedROM: null!,
  parsedBIOS: null!,
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
    const {parsedROM, parsedBIOS} = appState;
    if (parsedROM && parsedBIOS) {
      emulator.current.load(parsedBIOS, parsedROM);
    }
  }, [appState]);

  useEffect(() => {
    if (appState.canvas && !CanvasRenderer.initialized) {
      CanvasRenderer.initialize(appState.canvas, Math.round(787 / 160));
    }
  }, [appState.canvas]);

  const reducerProps: AppContext = {
    appState,
    appDispatch,
  };

  return <Wrapper {...reducerProps} />;
};

export default App;
