import {DEBUG} from 'helpers/index';

const error = (text: string): void => {
  if (DEBUG) {
    console.warn(text);
  }
};

export default error;
