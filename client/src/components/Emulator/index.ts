import CPU from '../CPU';
import Memory from '../Memory';
import PPU from '../PPU';
import GLRenderer, {Colors} from '../GLRenderer';
import * as _ from 'lodash';

class Emulator {
  private i = 0;
  private j = 0;
  private timerID!: ReturnType<typeof setTimeout>;
  public constructor() {
    this.update = this.update.bind(this);
  }
  /**
   * Loads a bios and ROM file into the Memory module.
   * @returns - boolean, whether ROM was loaded
   * Stops the currently updating function.
   */
  public load(bios: Uint8Array, rom: Uint8Array): boolean {
    Memory.load(bios, rom);
    clearTimeout(this.timerID);
    return true;
  }
  /**
   * Executes the next set of opcodes and calls renderer update method.
   * Calls itself at regular intervals according to the renderer's FPS, updating
   * the ID of setTimeout each time.
   */
  public update() {
    const cyclesPerUpdate = CPU.clock / GLRenderer.fps;
    let cycles = 0;
    let elapsed;

    // elapse time according to number of cpu cycles used
    while (cycles < cyclesPerUpdate) {
      elapsed = CPU.executeInstruction();
      cycles += elapsed;
      // need to update timers using elapsed cpu cycles
      PPU.buildGraphics(elapsed);
      CPU.checkInterrupts();
    }

    GLRenderer.draw();
    this.timerID = setTimeout(this.update, 1000 / GLRenderer.fps);
  }
}

export default Emulator;
