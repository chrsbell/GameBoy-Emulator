import axios from 'axios';
import CPU from './CPU';
import ROM from './ROM';
import Renderer from './Renderer'
import GLRenderer from './GLRenderer';

class App {
  private cpu: CPU;
  private renderer: Renderer;
  constructor() {
    this.cpu = new CPU();
    // need to query for canvas, use jquery
    this.renderer = new GLRenderer();
    ROM.loadFile();
    this.update = this.update.bind(this);
    this.update();
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

export default App;