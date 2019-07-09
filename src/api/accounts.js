const USE_SINGLE_ENDPOINT = false;
const LOGIN_PLATFORM = 'tdfdemo';

// TODO(DSAT-13): Pick the appropriate backend for the environment
const ACCOUNTS_URL = USE_SINGLE_ENDPOINT
  ? 'https://api-develop01.develop.virtru.com/accounts'
  : 'https://accounts-develop01.develop.virtru.com';
const ACCOUNTS_APPID_BUNDLE_URL = `${ACCOUNTS_URL}/api/currentAppIdBundle`;
const LOGIN_URL = `${ACCOUNTS_URL}/login?loginPlatform=${LOGIN_PLATFORM}&loginRedirectUrl=${window.location}`;
const LOGOUT_URL = `${ACCOUNTS_URL}/logout?loginPlatform=${LOGIN_PLATFORM}&loginRedirectUrl=${window.location}`;

export function getLoginUrl() {
  return LOGIN_URL;
}

export function getLogoutUrl() {
  return LOGOUT_URL;
}

export const redirectToLogin = async () => {
  window.location = LOGIN_URL;
};

export const getAppIdBundle = async () => {
  const response = await fetch(ACCOUNTS_APPID_BUNDLE_URL, {
    credentials: 'include',
    headers: {
      'X-Virtru-Client': LOGIN_PLATFORM,
    },
  });

  if (response.ok) {
    try {
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }
};
