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

function backendByParam() {
  const api = getQueryParam('zapi');
  return api === 'develop' || api === 'develop01'
    ? console.log('Backend forced: develop01') || develop01
    : api === 'develop02'
    ? console.log('Backend forced: develop02') || develop02
    : api === 'staging'
    ? console.log('Backend forced: staging') || staging
    : console.log('Backend forced: production') || production;
}

function backendByEnv() {
  return process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? console.log('Backend Selector: PRODUCTION') || production
    : process.env.REACT_APP_VIRTRU_ENV === 'staging'
    ? console.log('Backend Selector: PRODUCTION') || staging
    : process.env.REACT_APP_VIRTRU_ENV === 'develop02'
    ? console.log('Backend Selector: develop02') || develop02
    : console.log('Backend Selector: develop') || develop01;
}

// If in prod, only use production backend.
// Otherwise, allow selecting sdk by `zapi` parameter.
const config =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? backendByEnv()
    : backendByParam() || backendByEnv();

export const { authOptions, clientConfig } = config;
