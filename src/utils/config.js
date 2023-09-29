import { getDefaultOidcClientConfig } from '@virtru-private/oidc-client-js';
import { getQueryParam } from './getQueryParam';

function fromOldEnvironment(e) {
  if (!e || e.startsWith('develop')) {
    return 'develop';
  }
  return e;
}

const environment = fromOldEnvironment(process.env.REACT_APP_VIRTRU_ENV);

const oidcConfig = {
  ...getDefaultOidcClientConfig({
    environment,
    redirectUri: window.location.href.split(/[?#]/)[0],
    postLogoutRedirectUri: window.location.href.split(/[?#]/)[0],
  }),
  clientId: process.env.REACT_APP_OIDC_CLIENT_ID,
  scope: 'openid profile email offline_access',
};

const develop = {
  authOptions: {
    accountsUrl: 'https://api.develop.virtru.com/accounts',
    acmUrl: 'https://api.develop.virtru.com/acm',
    apiUrl: 'https://api.develop.virtru.com',
  },
  clientConfig: {
    auditEndpoint: 'https://audit.develop.virtru.com',
    kasEndpoint: 'https://api.develop.virtru.com/kas',
    easEndpoint: 'https://api.develop.virtru.com/accounts',
    acmEndpoint: 'https://api.develop.virtru.com/acm',
    readerUrl: 'https://secure.develop.virtru.com/start?htmlProtocol=1',
  },
  oidc: oidcConfig,
  proxy: {
    url: 'https://sdk.develop.virtru.com/js/latest/proxy.html',
    origins: [
      'https://api.develop.virtru.com',
      'https://audit.develop.virtru.com',
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
    auditEndpoint: 'https://audit.staging.virtru.com',
    kasEndpoint: 'https://api.staging.virtru.com/kas',
    easEndpoint: 'https://api.staging.virtru.com/accounts',
    acmEndpoint: 'https://api.staging.virtru.com/acm',
    readerUrl: 'https://secure.staging.virtru.com/start?htmlProtocol=1',
  },
  oidc: oidcConfig,
  proxy: {
    url: 'https://sdk.staging.virtru.com/js/latest/proxy.html',
    origins: ['https://api.staging.virtru.com', 'https://audit.staging.virtru.com'],
  },
};

const production = {
  authOptions: {
    accountsUrl: 'https://api.virtru.com/accounts',
    acmUrl: 'https://api.virtru.com/acm',
    apiUrl: 'https://api.virtru.com',
  },
  clientConfig: {
    auditEndpoint: 'https://audit.virtru.com',
    kasEndpoint: 'https://api.virtru.com/kas',
    easEndpoint: 'https://api.virtru.com/accounts',
    acmEndpoint: 'https://api.virtru.com/acm',
    readerUrl: 'https://secure.virtru.com/start?htmlProtocol=1',
  },
  oidc: oidcConfig,
  proxy: undefined,
};

const backendByParam = () => {
  switch (getQueryParam('zapi')) {
    case 'develop':
    case 'dev':
    case 'develop01':
    case 'develop02':
    case 'd':
      console.log('Backend forced: develop');
      return develop;
    case 'staging':
    case 's':
      console.log('Backend forced: staging');
      return staging;
    case 'production':
    case 'prod':
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
    case 'staging':
      console.log('Backend selected: staging');
      return staging;
    default:
      console.log('Backend selected: develop (default)');
      return develop;
  }
};

// If in prod, only use production backend.
// Otherwise, allow selecting sdk by `zapi` parameter.
const config =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? backendByEnv()
    : backendByParam() || backendByEnv();

export const { authOptions, clientConfig, oidc, proxy } = config;
