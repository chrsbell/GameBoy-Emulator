export default jest.fn().mockImplementation(() => ({
  initialize: jest.fn(),
  draw: jest.fn(),
  start: jest.fn(),
  setPPU: jest.fn(),
}));
