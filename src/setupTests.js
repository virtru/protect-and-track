import '@testing-library/jest-dom';
import { TextDecoder } from 'node:util';

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
  removeListener: jest.fn(),
};
window.matchMedia = () => matchMedia;
window.PR = {
  prettyPrint: jest.fn(),
};
window.alert = jest.fn();

jest.mock('redux-zero/react', () => jest.requireActual('../__mocks__/reduxZeroReact'));

afterEach(() => {
  jest.restoreAllMocks();
  matchMedia._events = [];
});

global.TextEncoder = class {
  constructor() {} // eslint-disable-line no-useless-constructor
  encode() {}
  decode() {}
};
