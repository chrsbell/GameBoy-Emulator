import Wrapper from 'App/Wrapper';
import CanvasRenderer from 'CanvasRenderer/index';
import Emulator from 'Emulator/index';
import * as React from 'react';
import {useEffect, useReducer, useRef} from 'react';

const initialState: AppState = {
  canvas: null!,
  parsedROM: new Uint8Array(),
  parsedBIOS: new Uint8Array(),
};

const reducer = (state: AppState, action: Action): AppState => {
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

const App = (): JSX.Element => {
  const [appState, appDispatch] = useReducer(reducer, initialState);
  const emulator: React.MutableRefObject<Emulator> = useRef(null!);

  useEffect(() => {
    if (appState.parsedROM.length) {
      emulator.current.load(appState.parsedBIOS, appState.parsedROM);
    }
  }, [appState.parsedROM, appState.parsedBIOS]);

  useEffect(() => {
    if (appState.canvas && !emulator.current) {
      const canvasRenderer = new CanvasRenderer();
      canvasRenderer.initialize(appState.canvas);
      emulator.current = new Emulator(canvasRenderer);
    }
  }, [appState.canvas]);

  const reducerProps: AppContext = {
    appState,
    appDispatch,
  };

  return <Wrapper {...reducerProps} />;
};

export default App;
