import { createConnectedStore } from 'undux';

export default createConnectedStore({
  share: { state: 'unshared', host: undefined },
});
