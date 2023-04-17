import { getDefaultOidcClientConfig } from '@virtru/oidc-client-js';
import { getQueryParam } from './getQueryParam';

const oidcConfigShared = {
  ...getDefaultOidcClientConfig({ environment: process.env.REACT_APP_VIRTRU_ENV || 'develop' }),
  clientId: process.env.REACT_APP_OIDC_CLIENT_ID,
  redirectUri: window.location.href.split(/[?#]/)[0],
  postLogoutRedirectUri: window.location.href.split(/[?#]/)[0],
  scope: 'openid profile email offline_access',
};

const develop01 = {
  authOptions: {
    accountsUrl: 'https://api-develop01.develop.virtru.com/accounts',
    acmUrl: 'https://api-develop01.develop.virtru.com/acm',
    apiUrl: 'https://api-develop01.develop.virtru.com',
  },
  clientConfig: {
    auditEndpoint: 'https://audit-develop01.develop.virtru.com',
    kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
    easEndpoint: 'https://api-develop01.develop.virtru.com/accounts',
    acmEndpoint: 'https://api-develop01.develop.virtru.com/acm',
    readerUrl: 'https://secure-develop01.develop.virtru.com/start?htmlProtocol=1',
  },
  oidc: {
    ...oidcConfigShared,
    authServiceBaseUrl: 'https://api.develop.virtru.com/auth',
    authorizationEndpoint: 'https://login.develop.virtru.com/oauth2/default/v1/authorize',
    tokenEndpoint: 'https://login.develop.virtru.com/oauth2/default/v1/token',
    revokeEndpoint: 'https://login.develop.virtru.com/oauth2/default/v1/revoke',
    logoutEndpoint: 'https://login.develop.virtru.com/oauth2/default/v1/logout',
    storageKeyUniqueId: 'pt-dev01',
  },
  proxy: {
    url: 'https://sdk-develop01.develop.virtru.com/js/latest/proxy.html',
    origins: [
      'https://api-develop01.develop.virtru.com',
      'https://audit-develop01.develop.virtru.com',
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
    auditEndpoint: 'https://audit-develop02.develop.virtru.com',
    kasEndpoint: 'https://api-develop02.develop.virtru.com/kas',
    easEndpoint: 'https://api-develop02.develop.virtru.com/accounts',
    acmEndpoint: 'https://api-develop02.develop.virtru.com/acm',
    readerUrl: 'https://secure-develop02.develop.virtru.com/start?htmlProtocol=1',
  },
  oidc: {
    ...develop01.oidc,
    storageKeyUniqueId: 'pt-dev02',
  },
  proxy: {
    url: 'https://sdk-develop02.develop.virtru.com/js/latest/proxy.html',
    origins: [
      'https://api-develop02.develop.virtru.com',
      'https://audit-develop02.develop.virtru.com',
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
  oidc: {
    ...oidcConfigShared,
    authServiceBaseUrl: 'https://api.staging.virtru.com/auth',

    authorizationEndpoint: 'https://virtru-staging.oktapreview.com/oauth2/default/v1/authorize',
    tokenEndpoint: 'https://virtru-staging.oktapreview.com/oauth2/default/v1/token',
    revokeEndpoint: 'https://virtru-staging.oktapreview.com/oauth2/default/v1/revoke',
    logoutEndpoint: 'https://virtru-staging.oktapreview.com/oauth2/default/v1/logout',
    storageKeyUniqueId: 'pt-staging',
  },
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
  oidc: {
    ...oidcConfigShared,
    authServiceBaseUrl: 'https://api.virtru.com/auth',
    authorizationEndpoint: 'https://virtrudev.okta.com/oauth2/default/v1/authorize',
    tokenEndpoint: 'https://virtrudev.okta.com/oauth2/default/v1/token',
    revokeEndpoint: 'https://virtrudev.okta.com/oauth2/default/v1/revoke',
    logoutEndpoint: 'https://virtrudev.okta.com/oauth2/default/v1/logout',
    storageKeyUniqueId: 'pt',
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
      console.log('Backend selected: develop01 (default)');
      return develop01;
  }
};

// If in prod, only use production backend.
// Otherwise, allow selecting sdk by `zapi` parameter.
const config =
  process.env.REACT_APP_VIRTRU_ENV === 'production'
    ? backendByEnv()
    : backendByParam() || backendByEnv();

export const { authOptions, clientConfig, oidc, proxy } = config;
