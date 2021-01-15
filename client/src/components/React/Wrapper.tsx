import * as React from 'react';
import { useRef, useEffect, useState, useContext, FormEvent, CSSProperties } from 'react';
import Context from './Context';
import axios, { AxiosRequestConfig } from 'axios';

const FlexColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '5vh',
};

const Wrapper = () => {
  const { dispatch, appState } = useContext(Context);
  const canvasRef = useRef(null);
  const hiddenBIOSRef = useRef(null);
  const hiddenROMRef = useRef(null);
  const [ROMFile, setROMFile] = useState(null);
  const [BIOSFile, setBIOSFile] = useState(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    let data = new FormData();
    data.append('rom', ROMFile);
    data.append('bios', BIOSFile);
    const options: AxiosRequestConfig = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    axios.post('/parse', data, options).then((res) => {
      if (res.status === 201) {
        dispatch({ type: 'parsed_rom', parsedROM: res.data.rom });
        dispatch({ type: 'parsed_bios', parsedBIOS: res.data.bios });
      } else {
        console.error('Error parsing ROM on server.');
      }
    });
  };

  useEffect(() => {
    dispatch({ type: 'canvas', canvas: canvasRef.current });
    console.log('Canvas created.');
  }, []);

  return (
    <div style={FlexColumn}>
      <div id="canvas" />
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
        onChange={(e) => setROMFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        name="bios"
        ref={hiddenBIOSRef}
        onChange={(e) => setBIOSFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <button type="button" onClick={onSubmit}>
        Upload
      </button>
      {/* Use a LCD size similar to GameBoy's */}
      <canvas width="787" height="720" ref={canvasRef} />
    </div>
  );
};

export default Wrapper;
