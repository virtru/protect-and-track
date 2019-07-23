const ENVS = {
  develop01: {
    stage: 'develop01',
    kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
    acmEndpoint: 'https://acm-develop01.develop.virtru.com',
    easEndpoint: 'https://accounts-develop01.develop.virtru.com',
    startUrl: 'https://secure-develop01.develop.virtru.com/start',
    auditUrl: 'https://audit-develop01.develop.virtru.com/api/messages',
  },
  staging: {
    stage: 'staging',
    kasEndpoint: 'https://api.staging.virtru.com/kas',
    acmEndpoint: 'https://acm.staging.virtru.com',
    easEndpoint: 'https://accounts.staging.virtru.com',
    startUrl: 'https://secure.staging.virtru.com/start',
    auditUrl: 'https://audit.staging.virtru.com/api/messages',
  },
  production: {
    stage: 'production',
    kasEndpoint: 'https://api.virtru.com/kas',
    acmEndpoint: 'https://acm.virtru.com',
    easEndpoint: 'https://accounts.virtru.com',
    startUrl: 'https://secure.virtru.com/start',
    auditUrl: 'https://audit.virtru.com/api/messages',
  },
};

export default () => {
  const stage = process.env.REACT_APP_VIRTRU_ENV || 'develop01';
  return ENVS[stage];
};
