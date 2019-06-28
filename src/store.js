import { createConnectedStore } from 'undux';

export default createConnectedStore({
  appIdBundle: false,
  file: false,
  share: { state: 'unshared', host: false },
});
