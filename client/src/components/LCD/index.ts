import {byte, word} from '../Types';
import LCDControl from './Control';

class LCD {
  private lcdc: LCDControl = new LCDControl();
}

export default new LCD();
