import Renderer from './Renderer';

class GLRenderer extends Renderer {
  private gl: WebGL2RenderingContext;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;
  private positionAttributeLocation: GLint;
  private positionBuffer: WebGLBuffer;

  constructor(canvas: HTMLCanvasElement) {
    super();
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
        // bind position buffer and describe/send its data
        this.positionBuffer = gl.createBuffer();

        // this.vaoObjOne = gl.createVertexArray();
        // this.vaoObjTwo = gl.createVertexArray();
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        // gl.bindVertexArray(this.vaoObjOne);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
          this.positionAttributeLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        const objOnePos = [0, -0.5, 0, 0.5, 0.7, 0];
        // gl.bufferData(gl.ARRAY_BUFFER, 4 * 12, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(objOnePos));
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // gl.bindVertexArray(this.vaoObjTwo);
        const objTwoPos = [-1, 0.5, 0, 1.0, 0.7, 0.5];
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objTwoPos), gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 6, new Float32Array(objTwoPos));
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
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

  createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
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

  draw() {
    const { gl } = this;
    // gl.bindVertexArray(this.vao);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.drawArrays(primitiveType, 0, count);
    // gl.drawArrays(primitiveType, 4 * 2 * 8, count);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}

export default GLRenderer;