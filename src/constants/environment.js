const ENVS = {
  develop01: {
    stage: 'develop01',
    apiEndpoint: 'https://api-develop01.develop.virtru.com',
    kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
    acmEndpoint: 'https://acm-develop01.develop.virtru.com',
    easEndpoint: 'https://accounts-develop01.develop.virtru.com',
    eventsEndpoint: 'https://events-develop01.develop.virtru.com',
    proxyEndpoint: 'https://sdk-develop01.develop.virtru.com/js/latest/proxy.html',
    sdkUrlBase: 'https://sdk-develop01.develop.virtru.com/js/latest/virtru-sdk.min.js',
    auditUrl: 'https://audit-develop01.develop.virtru.com/api/messages',
  },
  staging: {
    stage: 'staging',
    apiEndpoint: 'https://api.staging.virtru.com',
    kasEndpoint: 'https://api.staging.virtru.com/kas',
    acmEndpoint: 'https://acm.staging.virtru.com',
    easEndpoint: 'https://accounts.staging.virtru.com',
    eventsEndpoint: 'https://events.staging.virtru.com',
    proxyEndpoint: 'https://sdk.staging.virtru.com/js/latest/proxy.html',
    sdkUrlBase: 'https://sdk.staging.virtru.com/js/latest/virtru-sdk.min.js',
    auditUrl: 'https://audit.staging.virtru.com/api/messages',
  },
  production: {
    stage: 'production',
    apiEndpoint: 'https://api.virtru.com',
    kasEndpoint: 'https://api.virtru.com/kas',
    acmEndpoint: 'https://acm.virtru.com',
    easEndpoint: 'https://accounts.virtru.com',
    eventsEndpoint: 'https://events.virtru.com',
    proxyEndpoint: 'https://sdk.virtru.com/js/latest/proxy.html',
    sdkUrlBase: 'https://sdk.virtru.com/js/latest/virtru-sdk.min.js',
    auditUrl: 'https://audit.virtru.com/api/messages',
  },
};

export default () => {
  const stage = process.env.REACT_APP_VIRTRU_ENV || 'develop01';
  return ENVS[stage];
};
