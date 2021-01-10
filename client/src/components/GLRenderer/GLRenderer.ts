import LCD, { Color } from '../LCDController/LCDController';

// could render data as an image texture

class GLRenderer {
  public fps: number = 60;
  private gl: WebGL2RenderingContext;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;
  private positionAttributeLocation: GLint;
  private positionBuffer: WebGLBuffer;
  private shadeAttributeLocation: GLint;
  private shadeBuffer: WebGLBuffer;

  constructor(canvas: HTMLCanvasElement) {
    if (canvas) {
      this.gl = canvas.getContext('webgl2');
      const gl: WebGL2RenderingContext = this.gl;
      if (gl) {
        this.vertexShader = this.createShader(
          gl,
          gl.VERTEX_SHADER,
          document.querySelector('#vertex-shader').innerHTML
        );
        this.fragmentShader = this.createShader(
          gl,
          gl.FRAGMENT_SHADER,
          document.querySelector('#fragment-shader').innerHTML
        );
        this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
        gl.useProgram(this.program);

        this.positionAttributeLocation = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.shadeAttributeLocation = gl.getAttribLocation(this.program, 'a_shade');
        gl.enableVertexAttribArray(this.shadeAttributeLocation);

        // bind buffers and describe/send their data
        this.positionBuffer = gl.createBuffer();
        this.shadeBuffer = gl.createBuffer();

        let pixelBuffer = [];
        let shadeBuffer = [];
        const xIncr = 2.0 / LCD.width;
        const yIncr = 2.0 / LCD.height;
        for (let x = 0; x < LCD.width; x++) {
          for (let y = 0; y < LCD.height; y++) {
            let topLeft = { x: -1.0 + x * xIncr, y: -1.0 + y * yIncr };
            // triangle #1
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
            shadeBuffer.push(...Color.black);
            shadeBuffer.push(...Color.black);
            shadeBuffer.push(...Color.black);
            // triangle #2
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x, topLeft.y + yIncr);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
            shadeBuffer.push(...Color.black);
            shadeBuffer.push(...Color.black);
            shadeBuffer.push(...Color.black);
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

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pixelBuffer), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shadeBuffer);
        gl.vertexAttribPointer(this.shadeAttributeLocation, 3, type, normalize, stride, offset);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shadeBuffer), gl.DYNAMIC_DRAW);
      }
    }
  }

  createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    const program: WebGLProgram = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  /**
   * Set a pixel of the virtual screen
   */
  setPixel(x: number, y: number, shade: Array<number>) {
    if (x >= 0 && x < LCD.width) {
      if (y >= 0 && y < LCD.height) {
        const { gl } = this;
        // sizeof(float) * num vertices per pixel * number of data points
        const start = y * 72 + x * 72 * LCD.height;
        let data = [];
        for (let i = 0; i < 6; i++) {
          data.push(...shade);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shadeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, start, new Float32Array(data));
      }
    }
  }

  draw() {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * LCD.width * LCD.height);
  }
}

export default GLRenderer;
