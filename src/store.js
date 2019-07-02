import createStore from 'redux-zero';

export default createStore({
  appIdBundle: false,
  share: { state: 'unshared', host: undefined },
  tdfLog: [],
});
