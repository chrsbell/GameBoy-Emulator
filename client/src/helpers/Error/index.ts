import {DEBUG} from 'helpers/Debug';

const error = (text: string): void => {
  if (DEBUG) {
    console.warn(text);
  }
};

export default error;
