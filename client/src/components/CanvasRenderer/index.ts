import {sample} from 'lodash';
import benchmark, {benchmarksEnabled} from '../../helpers/Performance';

export type RGB = Array<number>;

const testAnimation = {
  x: 0,
  y: 0,
};

export type ColorScheme = {
  white: RGB;
  lightGray: RGB;
  darkGray: RGB;
  black: RGB;
};

const colorSchemes = {
  default: {
    white: <RGB>[255, 255, 255, 255],
    lightGray: <RGB>[170, 170, 170, 255],
    darkGray: <RGB>[85, 85, 85, 255],
    black: <RGB>[0, 0, 0, 255],
  },
  classic: {
    white: <RGB>[155, 188, 15, 255],
    lightGray: <RGB>[139, 172, 15, 255],
    darkGray: <RGB>[48, 98, 48, 255],
    black: <RGB>[16, 56, 16, 255],
  },
};

class CanvasRenderer {
  public fps = 240;
  private image!: ImageData;
  private context!: CanvasRenderingContext2D;
  private _initialized = false;
  private _colorScheme: ColorScheme = colorSchemes.default;
  public get colorScheme(): ColorScheme {
    return this._colorScheme;
  }
  public set colorScheme(value: ColorScheme) {
    this._colorScheme = value;
  }
  // how many pixels should an individual image pixel take up? e.g. NxN
  private scaleFactor = 1;
  public get initialized() {
    return this._initialized;
  }
  public set initialized(value) {
    this._initialized = value;
  }
  public screenWidth = 160;
  public screenHeight = 144;

  public constructor() {
    if (benchmarksEnabled) {
      this.setPixel = benchmark(this.setPixel.bind(this), this);
      this.draw = benchmark(this.draw.bind(this), this);
    }
  }

  public initialize(canvas: HTMLCanvasElement, scaleFactor = 1) {
    if (canvas && !this.initialized) {
      this.scaleFactor = scaleFactor;
      this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
      this.image = this.context.createImageData(
        this.screenWidth * this.scaleFactor,
        this.screenHeight * this.scaleFactor
      );
      this.initialized = true;
    }
  }

  public setPixel(x: number, y: number, color: RGB): void {
    x *= this.scaleFactor;
    y *= this.scaleFactor;

    for (let startX = x; startX < x + this.scaleFactor; startX++) {
      for (let startY = y; startY < y + this.scaleFactor; startY++) {
        const scaledY = startY * this.scaleFactor;
        const scaledX = startX;
        const offset = scaledY * this.screenWidth * 4 + scaledX * 4;

        this.image.data[offset] = color[0];
        this.image.data[offset + 1] = color[1];
        this.image.data[offset + 2] = color[2];
        this.image.data[offset + 3] = color[3];
      }
    }
  }

  public draw() {
    this.context.putImageData(this.image, 0, 0);
  }

  public testAnimation() {
    testAnimation.x += 1;
    if (testAnimation.x === this.screenWidth) {
      testAnimation.y += 1;
      testAnimation.x = 0;
    }
    if (testAnimation.y === this.screenHeight) {
      testAnimation.x = 0;
      testAnimation.y = 0;
    }
    this.setPixel(
      testAnimation.x,
      testAnimation.y,
      <RGB>sample(this.colorScheme)
    );
  }
}

export default new CanvasRenderer();
