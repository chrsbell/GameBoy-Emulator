import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {DEBUG} from '../../../helpers/Debug';
import styles from '../../../sass/index.module.scss';
import type {AppContext} from '../types';

const Wrapper: React.FC<AppContext> = ({appDispatch}) => {
  const canvasRef: React.MutableRefObject<HTMLCanvasElement> = useRef(null!);
  const hiddenBIOSRef: React.MutableRefObject<HTMLInputElement> = useRef(null!);
  const hiddenROMRef: React.MutableRefObject<HTMLInputElement> = useRef(null!);
  const [ROMFile, setROMFile] = useState<Blob>(null!);
  const [BIOSFile, setBIOSFile] = useState<Blob>(null!);
  const onSubmit = (): void => {
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
      <section className={styles['container']}>
        <div className={styles['flex-column']}>
          <nav>
            <button
              onClick={(): void => {
                hiddenROMRef.current.click();
              }}
            >
              Upload ROM
            </button>
            <button
              onClick={(): void => {
                hiddenBIOSRef.current.click();
              }}
            >
              BIOS File
            </button>
            <input
              type="file"
              name="rom"
              ref={hiddenROMRef}
              onChange={(e): void => setROMFile(e.target.files![0])}
            />
            <input
              type="file"
              name="bios"
              ref={hiddenBIOSRef}
              onChange={(e): void => setBIOSFile(e.target.files![0])}
            />
            <button type="button" onClick={onSubmit}>
              Upload
            </button>
          </nav>
          <div className={styles['shell']}>
            <div className={styles['shell-half']}>
              <div className={styles['power']} />
              <div className={styles['display']}>
                <canvas
                  width={styles['canvasWidth']}
                  height={styles['canvasHeight']}
                  ref={canvasRef}
                />
              </div>
            </div>
            <div className={styles['shell-half']}>
              <div className={styles.controls} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Wrapper;
