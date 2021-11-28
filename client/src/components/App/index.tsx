import Wrapper from 'App/Wrapper';
import Emulator from 'Emulator/index';
import GLRenderer from 'GLRenderer/index';
import * as React from 'react';
import {useEffect, useReducer, useRef} from 'react';

const initialState: AppState = {
  canvas: null,
  parsedROM: null,
  parsedBIOS: null,
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
  const emulator: React.MutableRefObject<Emulator | null> = useRef(null);

  useEffect(() => {
    if (appState?.parsedROM?.length) {
      emulator.current?.load(
        appState?.parsedBIOS as Uint8Array,
        appState?.parsedROM as Uint8Array
      );
    }
  }, [appState.parsedROM, appState.parsedBIOS]);

  useEffect(() => {
    if (appState.canvas && !emulator.current) {
      const renderer: GLRenderer = new GLRenderer();
      renderer.setCanvas(appState.canvas);
      emulator.current = new Emulator(renderer);
    }
  }, [appState.canvas]);

  return <Wrapper {...{appDispatch}} />;
};

export default App;
