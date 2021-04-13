import benchmark, {benchmarksEnabled} from '../Performance';

// could render data as an image texture
type RGB = Array<number>;

export const Colors = {
  white: [0.62745, 0.81176, 0.03922] as RGB,
  lightGray: [0.54902, 0.54902, 0.04314] as RGB,
  darkGray: [0.18039, 0.45098, 0.12157] as RGB,
  black: [0.00784, 0.24706, 0.00392] as RGB,
};

class GLRenderer {
  public fps = 60;
  private gl!: WebGL2RenderingContext;
  private vertexShader!: WebGLShader;
  private fragmentShader!: WebGLShader;
  private program!: WebGLProgram;
  private positionAttributeLocation!: GLint;
  private positionBuffer!: WebGLBuffer;
  private shadeAttributeLocation!: GLint;
  private shadeBuffer!: WebGLBuffer;
  private initialized = false;
  private screenWidth = 160;
  private screenHeight = 144;

  public constructor() {
    if (benchmarksEnabled) this.draw = benchmark(this.draw.bind(this));
  }

  /**
   * @returns whether the renderer is initialized.
   */
  public isInitialized() {
    return this.initialized;
  }

  /**
   * Initializes the renderer.
   */
  public initialize(canvas: HTMLCanvasElement) {
    if (canvas && !this.initialized) {
      this.gl = canvas.getContext('webgl2')!;
      const gl: WebGL2RenderingContext = this.gl;
      const vertexElement: HTMLElement = document.getElementById(
        'vertex-shader'
      ) as HTMLElement;
      const fragmentElement: HTMLElement = document.getElementById(
        'fragment-shader'
      ) as HTMLElement;
      if (!vertexElement || !fragmentElement) {
        throw new Error(`Couldn't find shader source.`);
      }

      if (gl) {
        this.vertexShader = this.createShader(
          gl,
          gl.VERTEX_SHADER,
          vertexElement.innerHTML
        );
        this.fragmentShader = this.createShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentElement.innerHTML
        );
        this.program = this.createProgram(
          gl,
          this.vertexShader,
          this.fragmentShader
        );
        gl.useProgram(this.program);

        this.positionAttributeLocation = gl.getAttribLocation(
          this.program,
          'a_position'
        );
        gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.shadeAttributeLocation = gl.getAttribLocation(
          this.program,
          'a_shade'
        );
        gl.enableVertexAttribArray(this.shadeAttributeLocation);

        // bind buffers and describe/send their data
        this.positionBuffer = gl.createBuffer()!;
        this.shadeBuffer = gl.createBuffer()!;

        const pixelBuffer = [];
        const shadeBuffer = [];
        const xIncr = 2.0 / this.screenWidth;
        const yIncr = 2.0 / this.screenHeight;
        for (let x = 0; x < this.screenWidth; x++) {
          for (let y = 0; y < this.screenHeight; y++) {
            const topLeft = {x: -1.0 + x * xIncr, y: -1.0 + y * yIncr};
            // triangle #1
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
            shadeBuffer.push(...Colors.black);
            shadeBuffer.push(...Colors.black);
            shadeBuffer.push(...Colors.black);
            // triangle #2
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x, topLeft.y + yIncr);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
            shadeBuffer.push(...Colors.black);
            shadeBuffer.push(...Colors.black);
            shadeBuffer.push(...Colors.black);
          }
        }
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
          this.positionAttributeLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(pixelBuffer),
          gl.STATIC_DRAW
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shadeBuffer);
        gl.vertexAttribPointer(
          this.shadeAttributeLocation,
          3,
          type,
          normalize,
          stride,
          offset
        );
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(shadeBuffer),
          gl.DYNAMIC_DRAW
        );
      }
      console.log('Initialized GL Renderer.');
      this.initialized = true;
    }
  }

  /**
   * Compiles the shader program.
   */
  private createShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string
  ): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return -1;
  }

  /**
   * Attaches the shaders and links the program.
   */
  private createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program: WebGLProgram = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return -1;
  }

  /**
   * Set a pixel of the virtual screen
   */
  public setPixel(x: number, y: number, shade: RGB): void {
    if (x >= 0 && x < this.screenWidth) {
      if (y >= 0 && y < this.screenHeight) {
        const {gl} = this;
        // sizeof(float) * num vertices per pixel * number of data points
        const start: number = y * 72 + x * 72 * this.screenHeight;
        const data: Array<number> = [];
        for (let i = 0; i < 6; i++) {
          data.push(...shade);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shadeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, start, new Float32Array(data));
      }
    }
  }

  /**
   * @returns the screen width.
   */
  public getScreenWidth(): number {
    return this.screenWidth;
  }

  /**
   * @returns the screen height.
   */
  public getScreenHeight(): number {
    return this.screenHeight;
  }

  /**
   * The main render loop.
   */
  public draw(): void {
    const {gl} = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * this.screenWidth * this.screenHeight);
  }
}

export default new GLRenderer();
