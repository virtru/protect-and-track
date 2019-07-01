// @todo - add 'tdf3-js' module

const _pushAction = ({ store, action }) => {
  store.set('tdfLog')([...store.get('tdfLog'), action]);
};

export default {
  async encrypt({ fileName, store }) {
    const action = 'action';
    _pushAction({ store, action });
  },
};
