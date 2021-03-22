import {byte, word} from '../Types';
import LCDControl from './Control';
import Memory from '../Memory';

class LCD {
  private lcdc: LCDControl = new LCDControl();
}

export default new LCD();
