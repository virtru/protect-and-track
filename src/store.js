import { createConnectedStore } from 'undux';

export default createConnectedStore({
  appIdBundle: false,
  share: { state: 'unshared', host: undefined },
  tdfLog: [],
});
