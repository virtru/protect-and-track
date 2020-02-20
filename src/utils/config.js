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

const config =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? production
    : process.env.REACT_APP_VIRTRU_ENV === 'staging'
    ? staging
    : process.env.REACT_APP_VIRTRU_ENV === 'develop02'
    ? develop02
    : develop01;

export const { authOptions, clientConfig } = config;
