export default jest.fn().mockImplementation(() => ({
  initialize: jest.fn(),
  render: jest.fn(),
  buildImage: jest.fn(),
  drawOnScreen: jest.fn(),
  setPPU: jest.fn(),
  clear: jest.fn(),
}));
