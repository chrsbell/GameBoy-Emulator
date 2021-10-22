import PPU from 'PPU/index';

const colorSchemes = {
  default: {
    0: [255, 255, 255, 255],
    1: [170, 170, 170, 255],
    2: [85, 85, 85, 255],
    3: [0, 0, 0, 255],
  },
  classic: {
    0: [155, 188, 15, 255],
    2: [139, 172, 15, 255],
    3: [48, 98, 48, 255],
    4: [16, 56, 16, 255],
  },
};

// use an image texture instead of this

class GLRenderer {
  private timeout!: number;
  private gl!: WebGL2RenderingContext;
  private vertexShader!: WebGLShader;
  private fragmentShader!: WebGLShader;
  private program!: WebGLProgram;
  private positionAttributeLocation!: GLint;
  private positionBuffer!: WebGLBuffer;
  private shadeAttributeLocation!: GLint;
  private shadeBuffer!: WebGLBuffer;
  private initialized = false;
  public static screenWidth = 160;
  public static screenHeight = 144;
  public ppu!: PPU;
  public colorScheme: ColorScheme = colorSchemes.default;

  constructor() {}

  /**
   * Initializes the renderer.
   */
  public initialize = (canvas: HTMLCanvasElement): void => {
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
        const xIncr = 2.0 / GLRenderer.screenWidth;
        const yIncr = 2.0 / GLRenderer.screenHeight;
        for (let x = 0; x < GLRenderer.screenWidth; x++) {
          for (let y = 0; y < GLRenderer.screenHeight; y++) {
            const topLeft = {x: -1.0 + x * xIncr, y: -1.0 + y * yIncr};
            // triangle #1
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
            shadeBuffer.push(...this.colorScheme[0]);
            shadeBuffer.push(...this.colorScheme[0]);
            shadeBuffer.push(...this.colorScheme[0]);
            // triangle #2
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x, topLeft.y + yIncr);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
            shadeBuffer.push(...this.colorScheme[0]);
            shadeBuffer.push(...this.colorScheme[0]);
            shadeBuffer.push(...this.colorScheme[0]);
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
  };

  /**
   * Compiles the shader program.
   */
  private createShader = (
    gl: WebGL2RenderingContext,
    type: number,
    source: string
  ): WebGLShader => {
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
  };

  /**
   * Attaches the shaders and links the program.
   */
  private createProgram = (
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram => {
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
  };

  public setPixel = (x: number, y: number, shade: RGB): void => {
    if (x >= 0 && x < GLRenderer.screenWidth) {
      if (y >= 0 && y < GLRenderer.screenHeight) {
        const {gl} = this;
        // sizeof(float) * num vertices per pixel * number of data points
        const start: number = y * 72 + x * 72 * GLRenderer.screenHeight;
        const data: Array<number> = [];
        for (let i = 0; i < 6; i++) {
          data.push(...shade);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shadeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, start, new Float32Array(data));
      }
    }
  };

  public clear = (): void => {};

  public setPPU = (ppu: PPU): void => {
    this.ppu = ppu;
  };

  public render = (): void => {
    this.timeout = window.requestAnimationFrame(this.draw);
  };

  public buildImage = (): void => {
    for (let y = 0; y < GLRenderer.screenHeight; y++) {
      for (let x = 0; x < GLRenderer.screenWidth; x++) {
        this.setPixel(x, y, this.colorScheme[this.ppu.pixelMap[y][x]]);
      }
    }
    // this.context.drawImage(this.canvasOffscreen, 0, 0);

    // setTimeout(this.draw, 100);
    // this.context.drawImage(this.image.getImage, 0, 0);
    // this.timeout = window.requestAnimationFrame(this.draw);
  };

  public draw = (): void => {
    const {gl} = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(
      gl.TRIANGLES,
      0,
      6 * GLRenderer.screenWidth * GLRenderer.screenHeight
    );
  };
}

export default GLRenderer;
