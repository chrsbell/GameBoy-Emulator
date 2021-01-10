import React, { useRef, useEffect, useState, useContext, FormEvent, CSSProperties } from 'react';
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
        dispatch({ type: 'parsed_rom', parsedROM: res.data });
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
      <form onSubmit={onSubmit}>
        <input type="file" name="rom" onChange={(e) => setROMFile(e.target.files[0])} />
        <input type="file" name="bios" onChange={(e) => setBIOSFile(e.target.files[0])} />
        <input type="submit" />
      </form>
      {/* Use a LCD size similar to GameBoy's */}
      <canvas width="787" height="720" ref={canvasRef} />
    </div>
  );
};

export default Wrapper;
