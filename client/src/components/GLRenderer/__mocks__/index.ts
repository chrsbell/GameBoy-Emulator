export default jest.fn().mockImplementation(() => ({
  setCanvas: jest.fn(),
  init: jest.fn(),
  draw: jest.fn(),
  start: jest.fn(),
}));
