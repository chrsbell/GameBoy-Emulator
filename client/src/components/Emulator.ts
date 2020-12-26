import axios from 'axios';
import CPU from './CPU';
import ROM from './ROM';
import GLRenderer from './GLRenderer';
import type { Hex } from './Types';

class Emulator {
  private cpu: CPU;
  private renderer: GLRenderer;
  constructor() {
    this.cpu = new CPU();
    // need to query for canvas, use jquery
    // this.renderer = new GLRenderer();
    // ROM.loadFile();
    this.update = this.update.bind(this);
    // this.update();
  }
  initRenderer(canvas: HTMLCanvasElement) {
    if (!this.renderer) {
      this.renderer = new GLRenderer(canvas);
      console.log('Initialized GL Renderer.');
    }
  }
  load(rom: Array<Hex>) {
    this.update();
    ROM.loadFile(rom);
  }
  update() {
    let cyclesPerUpdate = this.cpu.clock / this.renderer.fps;
    let cycles = 0;
    let elapsed;
    /*while (cycles < cyclesPerUpdate) {
      elapsed = this.cpu.executeInstruction();
      cycles += elapsed;
      // update timers and lcd controller using elapsed cpu cycles
    }*/
    this.renderer.draw();
    setTimeout(this.update, 1000 / this.renderer.fps);
  }
}

export default Emulator;
