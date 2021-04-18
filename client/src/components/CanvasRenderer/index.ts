import benchmark, {benchmarksEnabled} from '../../helpers/Performance';
import {sample} from 'lodash';

export type RGB = Array<number>;

const testAnimation = {
  x: 0,
  y: 0,
};

export const Colors = {
  white: [255, 255, 255, 255] as RGB,
  lightGray: [170, 170, 170, 255] as RGB,
  darkGray: [85, 85, 85, 255] as RGB,
  black: [0, 0, 0, 255] as RGB,
};

class CanvasRenderer {
  public fps = 60;
  private image!: ImageData;
  private context!: CanvasRenderingContext2D;
  private _initialized = false;
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
    if (benchmarksEnabled) this.draw = benchmark(this.draw.bind(this));
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
    this.setPixel(testAnimation.x, testAnimation.y, sample(Colors) as RGB);
  }
}

export default new CanvasRenderer();
