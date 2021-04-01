import * as React from 'react';
import {useRef, useEffect, useState, FormEvent} from 'react';
import type {AppContext} from './AppTypes';
import axios, {AxiosRequestConfig} from 'axios';
import './Wrapper.css';

const Wrapper: React.FC<AppContext> = ({appDispatch}) => {
  const canvasRef: React.MutableRefObject<HTMLCanvasElement> = useRef(null!);
  const hiddenBIOSRef: React.MutableRefObject<HTMLInputElement> = useRef(null!);
  const hiddenROMRef: React.MutableRefObject<HTMLInputElement> = useRef(null!);
  const [ROMFile, setROMFile] = useState<Blob>(new Blob());
  const [BIOSFile, setBIOSFile] = useState<Blob>(new Blob());

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('rom', ROMFile);
    data.append('bios', BIOSFile);
    const options: AxiosRequestConfig = {
      headers: {'content-type': 'multipart/form-data'},
    };
    axios.post('/parse', data, options).then(res => {
      if (res.status === 201) {
        appDispatch({type: 'parsedROM', parsedROM: res.data.rom});
        appDispatch({type: 'parsedBIOS', parsedBIOS: res.data.bios});
      } else {
        console.error('Error parsing ROM on server.');
      }
    });
  };

  useEffect(() => {
    appDispatch({type: 'canvas', canvas: canvasRef.current});
    console.log('Canvas created.');
  }, []);

  return (
    <section className="container">
      <div className="flex-column">
        <nav className="flex-row">
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
            style={{display: 'none'}}
          />
          <input
            type="file"
            name="bios"
            ref={hiddenBIOSRef}
            onChange={e => setBIOSFile(e.target.files![0])}
            style={{display: 'none'}}
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
  );
};

export default Wrapper;
