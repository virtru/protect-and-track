import 'jest-dom/extend-expect';
import '@testing-library/react/cleanup-after-each';

const matchMedia = {
  matches: false,
  _events: [],
  _triggerEvents() {
    this._events.forEach(event => event());
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
