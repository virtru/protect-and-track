import { getQueryParam } from './getQueryParam';
import { proxy } from 'utils/config';

let Virtru;

// If in prod, only use current SDK.
// Otherwise, allow selecting sdk by `zver` parameter.
function sdkByParam() {
  const ver = getQueryParam('zver');

  if (ver === 'lts') {
    Virtru = require('virtru-sdk-lts');
    console.log(`SDK Selector: LTS [${Virtru.Version}]`);
  } else {
    Virtru = require('virtru-sdk-current');
    console.log(`SDK Selector: CURRENT [${Virtru.Version}]`);
  }

  // Configure proxy for environment
  configProxy();

  return Virtru;
}

// Configure Proxy if running in alternate environment
function configProxy() {
  if (proxy) Virtru.XHRProxy.useProxyIfBrowser(proxy.url, proxy.origins);
}

const sdk =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? console.log('SDK Selector: PRODUCTION') || require('virtru-sdk-current')
    : sdkByParam();

export default sdk;
