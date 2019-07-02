import * as logs from '../constans/methodLogs';

export default {
  encrypt({ filename, store, userIds }) {
    // @todo: add actual file encryption

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
    _pushAction({ store, action });
  },
};

function _pushAction({ store, action }) {
  store.set('tdfLog')([...store.get('tdfLog'), action]);
}
