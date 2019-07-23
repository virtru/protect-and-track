const USE_SINGLE_ENDPOINT = false;
const LOGIN_PLATFORM = 'tdfdemo';

// TODO(DSAT-13): Pick the appropriate backend for the environment
const ACCOUNTS_URL = USE_SINGLE_ENDPOINT
  ? 'https://api-develop01.develop.virtru.com/accounts'
  : 'https://accounts-develop01.develop.virtru.com';
const ACCOUNTS_APPID_BUNDLE_URL = `${ACCOUNTS_URL}/api/currentAppIdBundle`;
const LOGIN_URL = `${ACCOUNTS_URL}/login?loginPlatform=${LOGIN_PLATFORM}&loginRedirectUrl=${window.location}`;
const LOGOUT_URL = `${ACCOUNTS_URL}/logout?loginPlatform=${LOGIN_PLATFORM}&loginRedirectUrl=${window.location}`;

// Constants for the share state in the store.
const SHARING = {
  PROVIDERS: {
    BOX: 'box',
    DROPBOX: 'dropbox',
    GOOGLEDRIVE: 'googledrive',
    ONEDRIVE: 'onedrive',
  },
  STATE: {
    UNSHARED: 'unshared',
    AUTHORIZING: 'authorizing',
    UPLOADING: 'uploading',
    SHARING: 'sharing',
    SHARED: 'shared',
  },
};

export { LOGIN_PLATFORM, ACCOUNTS_APPID_BUNDLE_URL, LOGIN_URL, LOGOUT_URL, SHARING };
