import createStore from 'redux-zero';
import {clientIntialize} from './constans/methodLogs';

export default createStore({
  appIdBundle: false,
  file: false,
  tdfLog: [{
    title: 'Module init',
    code: clientIntialize(),
  }],
  share: { state: 'unshared', host: false },
});
