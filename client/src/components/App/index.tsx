import * as React from 'react';
import {useEffect, useReducer, useRef} from 'react';
import Emulator from '../Emulator';
import GLRenderer from '../GLRenderer';
import Wrapper from './Wrapper';
import type {AppState, Action} from './types';

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

  const reducerProps = {
    appState,
    appDispatch,
  };

  return <Wrapper {...reducerProps} />;
};

export default App;
