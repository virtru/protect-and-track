import getQueryParam from 'utils/getQueryParam';

// If in prod, only use current SDK.
// Otherwise, allow selecting sdk by `zver` parameter.
function sdkByParam() {
  const ver = getQueryParam('zver');
  return ver === 'lts'
    ? console.log('SDK Selector: LTS') || require('virtru-sdk-lts')
    : console.log('SDK Selector: CURRENT') || require('virtru-sdk-current');
}

const sdk =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? console.log('SDK Selector: PRODUCTION') || require('virtru-sdk-current')
    : sdkByParam();

export default {
  ...sdk,
};
