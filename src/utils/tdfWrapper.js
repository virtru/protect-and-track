import * as logs from '../constans/methodLogs';
import store from '../store';
import { bindActions } from "redux-zero/utils";

const actions = {
  pushLogAction: ({tdfLog}, value) => ({ tdfLog: [ ...tdfLog, value] }),
};

const boundActions = bindActions(actions, store);

export default {
  encrypt({ filename, userIds }) {
    // @todo: add actual file encryption here. Replicate file encryption flow for logs.
    // @todo: Current flow taken from here https://developer.virtru.com/docs/encrypting-files

    // logging encryption flow
    const action = {
      title: 'Encrypting File',
      code: [
        logs.initEncryptParams(),
        logs.setFilename(filename),
        logs.setPermisions(userIds),
        logs.finilizeEncryptParams(),
        logs.encryptRequest(),
      ].join('\n'),
    };
    _pushAction(action);
  },
};

function _pushAction(action) {
  boundActions.pushLogAction(action);
}
