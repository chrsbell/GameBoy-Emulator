import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {DEBUG} from '../../helpers/Debug';
import type {AppContext} from './AppTypes';
import './styles.scss';

// const css = styles;
// console.log(css);
const Wrapper: React.FC<AppContext> = ({appDispatch}) => {
  const canvasRef: React.MutableRefObject<HTMLCanvasElement> = useRef(null!);
  const hiddenBIOSRef: React.MutableRefObject<HTMLInputElement> = useRef(null!);
  const hiddenROMRef: React.MutableRefObject<HTMLInputElement> = useRef(null!);
  const [ROMFile, setROMFile] = useState<Blob>(null!);
  const [BIOSFile, setBIOSFile] = useState<Blob>(null!);
  const onSubmit = () => {
    if (BIOSFile) {
      BIOSFile.arrayBuffer().then(buffer => {
        appDispatch({
          type: 'parsedBIOS',
          parsedBIOS: new Uint8Array(buffer),
        });
      });
    }
    if (ROMFile) {
      ROMFile.arrayBuffer().then(buffer => {
        appDispatch({
          type: 'parsedROM',
          parsedROM: new Uint8Array(buffer),
        });
      });
    }
  };

  useEffect(() => {
    appDispatch({type: 'canvas', canvas: canvasRef.current});
    DEBUG && console.log('Canvas created.');
  }, [appDispatch]);

  return (
    <>
      {/* <style>{css}</style> */}
      <section className="container">
        <div className="flex-column">
          <nav>
            <button
              onClick={() => {
                hiddenROMRef.current.click();
              }}
            >
              Upload ROM
            </button>
            <button
              onClick={() => {
                hiddenBIOSRef.current.click();
              }}
            >
              BIOS File
            </button>
            <input
              type="file"
              name="rom"
              ref={hiddenROMRef}
              onChange={e => setROMFile(e.target.files![0])}
            />
            <input
              type="file"
              name="bios"
              ref={hiddenBIOSRef}
              onChange={e => setBIOSFile(e.target.files![0])}
            />
            <button type="button" onClick={onSubmit}>
              Upload
            </button>
          </nav>
          <div id="canvas" />
          {/* Use a LCD size similar to GameBoy's */}
          <canvas width="787" height="720" ref={canvasRef} />
        </div>
      </section>
    </>
  );
};

export default Wrapper;
