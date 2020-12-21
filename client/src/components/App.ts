import CPU from './CPU';
import Renderer from './Renderer'
import GLRenderer from './GLRenderer';

class App {
  private cpu: CPU;
  private renderer: Renderer;
  constructor() {
    this.cpu = new CPU();
    // need to query for canvas, use jquery
    this.renderer = new GLRenderer(null);
  }
}

export default App;