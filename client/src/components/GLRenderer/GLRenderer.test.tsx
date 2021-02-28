const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {createCanvas} = require('canvas');
import * as React from 'react';
import GLRenderer from '.'

describe('GLRenderer', () => {

  it('creates an instance of GLRenderer', () => {
    expect(GLRenderer.getScreenHeight()).toEqual(144);
    expect(GLRenderer.getScreenWidth()).toEqual(160);
  });

  it('compiles', () => {
    GLRenderer.initialize(createCanvas(787, 720));
    expect(GLRenderer.isInitialized()).toBe(true);
  })

})