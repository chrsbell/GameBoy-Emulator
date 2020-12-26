import React, { useRef, useEffect, useState, useContext, FormEvent } from 'react';
import Context from './Context';
import axios, { AxiosRequestConfig } from 'axios';

const Wrapper = () => {
  const { dispatch, appState } = useContext(Context);
  const canvasRef = useRef(null);
  const [file, setFile] = useState(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    let data = new FormData();
    data.append('rom', file);
    const options: AxiosRequestConfig = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    axios.post('/parse', data, options).then((res) => {
      if (res.status === 201) {
        debugger;
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
    <>
      <div id="canvas" />
      <form onSubmit={onSubmit}>
        <input type="file" name="rom" onChange={(e) => setFile(e.target.files[0])} />
        <input type="submit" />
      </form>
      <canvas width="787" height="720" ref={canvasRef} />
    </>
  );
};

export default Wrapper;
