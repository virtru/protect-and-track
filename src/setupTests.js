import 'jest-dom/extend-expect';
import '@testing-library/react/cleanup-after-each';

const matchMedia = () => ({
  matches: false,
  addListener: jest.fn(),
  removeListener: jest.fn(),
});
window.matchMedia = matchMedia;

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  window.matchMedia = matchMedia;
});
