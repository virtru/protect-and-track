import createStore from 'redux-zero';

export default createStore({
  appIdBundle: false,
  file: false,
  tdfLog: [],
  isLoading: true,
  share: { state: 'unshared', host: false },
  userId: false,
  virtruClient: false,
});
