import createStore from 'redux-zero';
import { clientIntialize } from './constans/methodLogs';

export default createStore({
  appIdBundle: false,
  file: false,
  tdfLog: [],
  isLoading: true,
  share: { state: 'unshared', host: false },
});
