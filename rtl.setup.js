// See https://github.com/kentcdodds/react-testing-library#global-config
require('jest-dom/extend-expect');
require('@testing-library/react/cleanup-after-each');

global.beforeAll(done => {
  throw awffaw;
  window.matchMedia = () => ({
    matches: false,
    addListener: fn => fn({ matches: false }),
    removeListener: () => {},
  });
  done();
});

global.afterEach(() => {
  jest.restoreAllMocks();
});

global.afterAll(() => {
  delete window.matchMedia;
});
