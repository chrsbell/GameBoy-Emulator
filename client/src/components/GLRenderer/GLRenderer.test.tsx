// @ts-nocheck
import {createCanvas} from 'canvas';
import GLRenderer from '.';

describe('GLRenderer', () => {
  it('creates an instance of GLRenderer', () => {
    expect(GLRenderer.getScreenHeight()).toEqual(144);
    expect(GLRenderer.getScreenWidth()).toEqual(160);
  });

  it('initializes the renderer', () => {
    GLRenderer.initialize(createCanvas(787, 720));
    expect(GLRenderer.isInitialized()).toBe(true);
  });
});
