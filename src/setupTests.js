import '@testing-library/jest-dom';
import { TextDecoder } from 'node:util';
import { afterAll, vi } from 'vitest';

// eslint-disable-next-line no-undef
globalThis.TextDecoder ??= TextDecoder;

const matchMedia = {
  matches: false,
  _events: [],
  _triggerEvents() {
    this._events.forEach((event) => event());
  },
  addListener(listener) {
    this._events.push(listener);
  },
  removeListener: vi.fn(),
};
window.matchMedia = () => matchMedia;
window.PR = {
  prettyPrint: vi.fn(),
};
window.alert = vi.fn();

vi.mock('redux-zero/react', () => vi.importActual('../__mocks__/reduxZeroReact'));

afterAll(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  matchMedia._events = [];
});
