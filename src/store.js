import createStore from 'redux-zero';
import { clientIntialize } from './constans/methodLogs';

export default createStore({
  appIdBundle: false,
  file: false,
  tdfLog: [],
  share: { state: 'unshared', host: false },
});
