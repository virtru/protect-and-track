const develop01 = {
  kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
  easEndpoint: 'https://api-develop01.develop.virtru.com/accounts',
  acmEndpoint: 'https://api-develop01.develop.virtru.com/acm',
  readerUrl: 'https://secure-develop01.develop.virtru.com/start?htmlProtocol=1',
};

const develop02 = {
  kasEndpoint: 'https://api-develop02.develop.virtru.com/kas',
  easEndpoint: 'https://api-develop02.develop.virtru.com/accounts',
  acmEndpoint: 'https://api-develop02.develop.virtru.com/acm',
  readerUrl: 'https://secure-develop02.develop.virtru.com/start?htmlProtocol=1',
};

const staging = {
  kasEndpoint: 'https://api.staging.virtru.com/kas',
  easEndpoint: 'https://api.staging.virtru.com/accounts',
  acmEndpoint: 'https://api.staging.virtru.com/acm',
  readerUrl: 'https://secure.staging.virtru.com/start?htmlProtocol=1',
};

const production = {
  kasEndpoint: 'https://api.virtru.com/kas',
  easEndpoint: 'https://api.virtru.com/accounts',
  acmEndpoint: 'https://api.virtru.com/acm',
  readerUrl: 'https://secure.virtru.com/start?htmlProtocol=1',
};

const config =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? production
    : process.env.REACT_APP_VIRTRU_ENV === 'staging'
    ? staging
    : process.env.REACT_APP_VIRTRU_ENV === 'develop02'
    ? develop02
    : develop01;

export default config;
