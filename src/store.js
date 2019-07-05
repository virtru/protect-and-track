import createStore from 'redux-zero';
import { importVirtru, importTdf } from './constans/methodLogs';

export default createStore({
  appIdBundle: false,
  file: false,
  tdfLog: [
    {
      title: 'Module Init',
      code: [importVirtru(), importTdf()].join('\n'),
    },
  ],
  share: { state: 'unshared', host: false },
});
