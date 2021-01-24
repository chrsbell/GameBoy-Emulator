import axios from 'axios';
import CPU from '../CPU/CPU';
import Memory from '../Memory/Memory';
import GLRenderer, { Colors } from '../GLRenderer/GLRenderer';
import { ByteArray } from '../Types';
import * as _ from 'lodash';

class Emulator {
  private cpu: CPU;
  private i: number = 0;
  private j: number = 0;
  private timerID: ReturnType<typeof setTimeout>;
  public constructor() {
    this.cpu = new CPU();
    this.update = this.update.bind(this);
  }
  /**
   * Loads a bios and ROM file into the Memory module.
   * Stops the currently updating function.
   */
  public load(bios: ByteArray, rom: ByteArray) {
    Memory.load(bios, rom);
    clearTimeout(this.timerID);
    this.update();
  }
  /**
   * Executes the next set of opcodes and calls renderer update method.
   * Calls itself at regular intervals according to the renderer's FPS, updating
   * the ID of setTimeout each time.
   */
  public update() {
    let cyclesPerUpdate = this.cpu.clock / GLRenderer.fps;
    let cycles = 0;
    let elapsed;

    // elapse time according to number of cpu cycles used
    while (cycles < cyclesPerUpdate) {
      elapsed = this.cpu.executeInstruction();
      cycles += elapsed;
      // need to update timers and lcd controller using elapsed cpu cycles
    }

    // test animation
    GLRenderer.setPixel(this.i, this.j, _.sample(Colors));
    this.i += 1;
    if (this.i === GLRenderer.getScreenWidth()) {
      this.j += 1;
      this.i = 0;
      if (this.j === GLRenderer.getScreenHeight()) {
        this.i = 0;
        this.j = 0;
      }
    }

    GLRenderer.draw();
    this.timerID = setTimeout(this.update, 1000 / GLRenderer.fps);
  }
}

export default Emulator;
