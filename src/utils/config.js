import getQueryParam from 'utils/getQueryParam';

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
};

const backendByParam = () => {
  switch (getQueryParam('zapi')) {
    case 'develop':
    case 'develop01':
      console.log('Backend forced: develop01');
      return develop01;
    case 'develop02':
      console.log('Backend forced: develop02');
      return develop02;
    case 'staging':
      console.log('Backend forced: staging');
      return staging;
    default:
      console.log('Backend forced: production');
      return production;
  }
};

const backendByEnv = () => {
  switch (process.env.REACT_APP_VIRTRU_ENV) {
    case 'production':
      console.log('Backend Selector: production');
      return production;
    case 'develop02':
      console.log('Backend Selector: develop02');
      return develop02;
    case 'staging':
      console.log('Backend forced: staging');
      return staging;
    default:
      console.log('Backend Selector: develop01');
      return develop01;
  }
};

// If in prod, only use production backend.
// Otherwise, allow selecting sdk by `zapi` parameter.
const config =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? backendByEnv()
    : backendByParam() || backendByEnv();

export const { authOptions, clientConfig } = config;
