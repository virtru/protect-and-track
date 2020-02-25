import getQueryParam from 'utils/getQueryParam';
import Virtru from 'utils/sdk';

const develop01 = {
  authOptions: {
    accountsUrl: 'https://api-develop01.develop.virtru.com/accounts',
    acmUrl: 'https://api-develop01.develop.virtru.com/acm',
    apiUrl: 'https://api-develop01.develop.virtru.com',
  },
  clientConfig: {
    kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
    easEndpoint: 'https://api-develop01.develop.virtru.com/accounts',
    acmEndpoint: 'https://api-develop01.develop.virtru.com/acm',
    readerUrl: 'https://secure-develop01.develop.virtru.com/start?htmlProtocol=1',
  },
  proxy: {
    url: 'https://sdk.develop01.virtru.com/js/latest/proxy.html',
    origins: [
      'https://accounts.develop01.virtru.com',
      'https://acm.develop01.virtru.com',
      'https://eas.develop01.virtru.com',
      'https://api.develop01.virtru.com',
    ],
  },
};

const develop02 = {
  authOptions: {
    accountsUrl: 'https://api-develop02.develop.virtru.com/accounts',
    acmUrl: 'https://api-develop02.develop.virtru.com/acm',
    apiUrl: 'https://api-develop02.develop.virtru.com',
  },
  clientConfig: {
    kasEndpoint: 'https://api-develop02.develop.virtru.com/kas',
    easEndpoint: 'https://api-develop02.develop.virtru.com/accounts',
    acmEndpoint: 'https://api-develop02.develop.virtru.com/acm',
    readerUrl: 'https://secure-develop02.develop.virtru.com/start?htmlProtocol=1',
  },
  proxy: {
    url: 'https://sdk.develop02.virtru.com/js/latest/proxy.html',
    origins: [
      'https://accounts.develop02.virtru.com',
      'https://acm.develop02.virtru.com',
      'https://eas.develop02.virtru.com',
      'https://api.develop02.virtru.com',
    ],
  },
};

const staging = {
  authOptions: {
    accountsUrl: 'https://api.staging.virtru.com/accounts',
    acmUrl: 'https://api.staging.virtru.com/acm',
    apiUrl: 'https://api.staging.virtru.com',
  },
  clientConfig: {
    kasEndpoint: 'https://api.staging.virtru.com/kas',
    easEndpoint: 'https://api.staging.virtru.com/accounts',
    acmEndpoint: 'https://api.staging.virtru.com/acm',
    readerUrl: 'https://secure.staging.virtru.com/start?htmlProtocol=1',
  },
  proxy: {
    url: 'https://sdk.staging.virtru.com/js/latest/proxy.html',
    origins: [
      'https://accounts.staging.virtru.com',
      'https://acm.staging.virtru.com',
      'https://eas.staging.virtru.com',
      'https://api.staging.virtru.com',
    ],
  },
};

const production = {
  authOptions: {
    accountsUrl: 'https://api.virtru.com/accounts',
    acmUrl: 'https://api.virtru.com/acm',
    apiUrl: 'https://api.virtru.com',
  },
  clientConfig: {
    kasEndpoint: 'https://api.virtru.com/kas',
    easEndpoint: 'https://api.virtru.com/accounts',
    acmEndpoint: 'https://api.virtru.com/acm',
    readerUrl: 'https://secure.virtru.com/start?htmlProtocol=1',
  },
  proxy: undefined,
};

const backendByParam = () => {
  switch (getQueryParam('zapi')) {
    case 'develop':
    case 'develop01':
    case 'd':
      console.log('Backend forced: develop01');
      return develop01;
    case 'develop02':
      console.log('Backend forced: develop02');
      return develop02;
    case 'staging':
    case 's':
      console.log('Backend forced: staging');
      return staging;
    case 'production':
    case 'p':
      console.log('Backend forced: production');
      return production;
    default:
      return false;
  }
};

const backendByEnv = () => {
  switch (process.env.REACT_APP_VIRTRU_ENV) {
    case 'production':
      console.log('Backend selected: production');
      return production;
    case 'develop02':
      console.log('Backend selected: develop02');
      return develop02;
    case 'staging':
      console.log('Backend selected: staging');
      return staging;
    default:
      console.log('Backend selected: develop01');
      return develop01;
  }
};

// If in prod, only use production backend.
// Otherwise, allow selecting sdk by `zapi` parameter.
const config =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? backendByEnv()
    : backendByParam() || backendByEnv();

if (process.env.REACT_APP_VIRTRU_ENV !== 'production' && config.proxy && Virtru.XHRProxy) {
  Virtru.XHRProxy.useProxyIfBrowser(config.proxy.url, config.proxy.origins);
}

export const { authOptions, clientConfig, proxy } = config;
