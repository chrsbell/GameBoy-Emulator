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

let y = 0;
class GLRenderer {
  private timeout!: number;
  private gl!: WebGL2RenderingContext;
  private vertexShader!: WebGLShader;
  private fragmentShader!: WebGLShader;
  private program!: WebGLProgram;
  private positionAttributeLocation!: GLint;
  private positionBuffer!: WebGLBuffer;
  private textureCoordBuffer!: WebGLBuffer;
  private textureCoordAttributeLocation!: GLint;
  private samplerUniformLocation!: GLint;
  // private pixelBuffer!: WebGLBuffer;
  private screenTexture!: WebGLTexture;
  private initialized = false;
  public static screenWidth = 160;
  public static screenHeight = 144;
  public ppu!: PPU;
  public colorScheme: ColorScheme = colorSchemes.default;

  constructor() {}

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
          'aPosition'
        );
        gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.textureCoordAttributeLocation = gl.getAttribLocation(
          this.program,
          'aTextureCoord'
        );
        gl.enableVertexAttribArray(this.textureCoordAttributeLocation);

        this.positionBuffer = gl.createBuffer()!;
        // this.pixelBuffer = gl.createBuffer()!;
        this.textureCoordBuffer = gl.createBuffer()!;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
          this.positionAttributeLocation,
          2,
          gl.FLOAT, //benchmark this vs float
          false,
          0,
          0
        );
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]),
          gl.STATIC_DRAW
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        const a = [];
        for (let i = 0; i < 23040; i++) {
          a.push(...[255, 255, 255, 255]);
        }

        // a[12] = 255;
        // a[13] = 0;
        // a[14] = 0;
        // a[15] = 255;

        // a.push(
        //   ...[
        //     255, 0, 0,
        //     // Math.floor(Math.random() * 255),
        //     // Math.floor(Math.random() * 255),
        //     255,
        //   ]
        // );

        // gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, this.pixelBuffer);
        // gl.bufferData(
        //   gl.PIXEL_UNPACK_BUFFER,
        //   new Uint8Array(a),
        //   gl.STREAM_DRAW
        // );
        // gl.bufferSubData(
        //   gl.PIXEL_UNPACK_BUFFER,
        //   90000,
        //   new Uint8Array([0, 0, 255, 255])
        // );

        // gl.bufferSubData(gl.PIXEL_UNPACK_BUFFER, 4, new Uint8Array(a));

        this.screenTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          GLRenderer.screenWidth,
          GLRenderer.screenHeight,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array(a)
        );

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.vertexAttribPointer(
          this.textureCoordAttributeLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]),
          gl.STATIC_DRAW
        );
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      this.initialized = true;
      console.log('Initialized GL Renderer.');
    }
  };

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

  public setPixel = (x: number, y: number, shade: RGBA): void => {
    const {gl} = this;
    if (x >= 0 && x < GLRenderer.screenWidth) {
      if (y >= 0 && y < GLRenderer.screenHeight) {
        // sizeof(byte) * color * number of data points
        // const start: number = x * 4 + y * 4 * GLRenderer.screenWidth;
        // gl.bufferSubData(gl.PIXEL_UNPACK_BUFFER, start, new Uint8Array(shade));
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          x,
          y,
          1,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array(shade)
          // new ImageData(new Uint8ClampedArray(shade), 1, 1)
        );
        // gl.bindBuffer(gl.PIXEL_PACK_BUFFER, 0);
        // gl.activeTexture(gl.TEXTURE0);

        // this.screenTexture = gl.createTexture()!;
        // gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);
        // gl.texImage2D(
        //   gl.TEXTURE_2D,
        //   0,
        //   gl.RGBA,
        //   GLRenderer.screenWidth,
        //   GLRenderer.screenHeight,
        //   0,
        //   gl.RGBA,
        //   gl.UNSIGNED_BYTE,
        //   0
        // );
        // gl.texImage2D(
        //   gl.TEXTURE_2D,
        //   0,
        //   gl.RGBA,
        //   300,
        //   150,
        //   0,
        //   gl.RGBA,
        //   gl.UNSIGNED_BYTE,
        //   0
        // );
      }
    }
  };

  public clear = (): void => {};

  public setPPU = (ppu: PPU): void => {
    this.ppu = ppu;
  };

  public start = (): void => {
    this.timeout = window.requestAnimationFrame(this.draw);
  };

  public unpackTexture = (): void => {
    const {gl} = this;
    gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);
    const data = new Uint8Array(92160);
    const offset = this.ppu.scrollX & 7;
    let pointer = 0;
    for (let y = 0; y < GLRenderer.screenHeight; y++) {
      const scanline = this.ppu.pixelMap[y];
      for (let i = 7 - offset; i >= 0; i--) {
        const color = this.colorScheme[(scanline[0] >> (i * 2)) & 0b11];
        data[pointer] = color[0];
        data[pointer + 1] = color[1];
        data[pointer + 3] = color[3];
        data[pointer + 2] = color[2];
        pointer += 4;
      }
      for (let tile = 1; tile < 20; tile++) {
        for (let i = 7; i >= 0; i--) {
          const color = this.colorScheme[(scanline[tile] >> (i * 2)) & 0b11];
          data[pointer] = color[0];
          data[pointer + 1] = color[1];
          data[pointer + 2] = color[2];
          data[pointer + 3] = color[3];
          pointer += 4;
        }
      }
      for (let i = 8 - offset; i < 8; i++) {
        const color = this.colorScheme[(scanline[20] >> (i * 2)) & 0b11];
        data[pointer] = color[0];
        data[pointer + 1] = color[1];
        data[pointer + 2] = color[2];
        data[pointer + 3] = color[3];
        pointer += 4;
      }
    }
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      GLRenderer.screenWidth,
      GLRenderer.screenHeight,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(data)
    );
  };

  public draw = (): void => {
    this.unpackTexture();
    const {gl} = this;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1i(this.samplerUniformLocation, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.timeout = window.requestAnimationFrame(this.draw);
  };
}

export default GLRenderer;
