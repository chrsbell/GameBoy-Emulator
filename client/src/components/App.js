import CPU from './CPU';
import GLRenderer from './Renderer';

class App {
  constructor() {
    this._cpu = new CPU();
    // need to query for canvas, use jquery
    this.renderer = new GLRenderer(null);
    //
  }
}

export default App;