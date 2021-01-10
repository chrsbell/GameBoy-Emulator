import axios from 'axios';
import CPU from './CPU';
import Memory from './Memory';
import GLRenderer from './GLRenderer';
import LCD, { Color } from './LCDController';
import type { Hex } from './Types';
import _ from 'lodash';

class Emulator {
  private cpu: CPU;
  private renderer: GLRenderer;
  private i: number = 0;
  private j: number = 0;
  constructor() {
    this.cpu = new CPU();
    this.update = this.update.bind(this);
  }
  initRenderer(canvas: HTMLCanvasElement) {
    if (!this.renderer) {
      this.renderer = new GLRenderer(canvas);
      console.log('Initialized GL Renderer.');
    }
  }
  load(rom: Array<Hex>) {
    Memory.loadFile(rom);
    this.update();
  }
  update() {
    let cyclesPerUpdate = this.cpu.clock / this.renderer.fps;
    let cycles = 0;
    let elapsed;

    // elapse time according to number of cpu cycles used
    while (cycles < cyclesPerUpdate) {
      elapsed = this.cpu.executeInstruction();
      cycles += elapsed;
      // need to update timers and lcd controller using elapsed cpu cycles
    }

    // test animation
    this.renderer.setPixel(this.i, this.j, _.sample(Color));
    this.i += 1;
    if (this.i === LCD.width) {
      this.j += 1;
      this.i = 0;
      if (this.j === LCD.height) {
        this.i = 0;
        this.j = 0;
      }
    }

    this.renderer.draw();
    setTimeout(this.update, 1000 / this.renderer.fps);
  }
}

export default Emulator;
