// @ts-nocheck
import {createCanvas} from 'canvas';
import CanvasRenderer from '.';

describe('CanvasRenderer', () => {
  it('initializes the renderer', () => {
    const canvas = new CanvasRenderer();
    canvas.initialize(createCanvas(787, 720));
    expect(canvas.initialized).toBe(true);
  });

  it('sets a pixel', () => {});
});
