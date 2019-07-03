import createStore from 'redux-zero';

export default createStore({
  appIdBundle: false,
  file: false,
  tdfLog: [],
  share: { state: 'unshared', host: false },
});
