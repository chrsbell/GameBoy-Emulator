// @ts-nocheck
import {createCanvas} from 'canvas';
import CanvasRenderer from '.';

describe('CanvasRenderer', () => {
  it('creates an instance of CanvasRenderer', () => {
    expect(CanvasRenderer.screenWidth).toEqual(144);
    expect(CanvasRenderer.screenHeight).toEqual(160);
  });

  it('initializes the renderer', () => {
    CanvasRenderer.initialize(createCanvas(787, 720));
    expect(CanvasRenderer.isInitialized()).toBe(true);
  });

  it('sets a pixel', () => {});
});
