import axios from 'axios';
import CPU from '../CPU/CPU';
import Memory from '../Memory/Memory';
import GLRenderer from '../GLRenderer/GLRenderer';
import LCD, { Color } from '../LCDController/LCDController';
import { ByteArray } from '../Types';
import _ from 'lodash';

class Emulator {
  private cpu: CPU;
  private i: number = 0;
  private j: number = 0;
  public constructor() {
    this.cpu = new CPU();
    this.update = this.update.bind(this);
  }
  public initRenderer(canvas: HTMLCanvasElement) {
    if (!GLRenderer.isInitialized()) {
      GLRenderer.initialize(canvas);
      console.log('Initialized GL Renderer.');
    }
  }
  public load(bios: ByteArray, rom: ByteArray) {
    Memory.load(bios, rom);
    this.update();
  }
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
    // GLRenderer.setPixel(this.i, this.j, _.sample(Color));
    this.i += 1;
    if (this.i === LCD.width) {
      this.j += 1;
      this.i = 0;
      if (this.j === LCD.height) {
        this.i = 0;
        this.j = 0;
      }
    }

    GLRenderer.draw();
    setTimeout(this.update, 1000 / GLRenderer.fps);
  }
}

export default Emulator;
