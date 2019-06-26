const USE_SINGLE_ENDPOINT = true;

const ACCOUNTS_URL = USE_SINGLE_ENDPOINT ? 'https://api-develop01.develop.virtru.com/accounts' : 'https://accounts-develop01.develop.virtru.com';
const ACCOUNTS_APPID_BUNDLE_URL = `${ACCOUNTS_URL}/api/currentAppIdBundle`;
const LOGIN_URL = `${ACCOUNTS_URL}/login?loginPlatform=tdf-demo&loginRedirectUrl=${window.location}`;

export const redirectToLogin = async () => {
  console.log('REDIRECT!');
  // window.location = LOGIN_URL;
}

export const getAppIdBundle = async () => {
  const response = await fetch(ACCOUNTS_APPID_BUNDLE_URL, {
    credentials: 'include',
    headers: {
      'X-Virtru-Client': 'dashboard',
    }
  });

  console.log(response.type);
  if (response.body.length) {
    return response.json();
  }

  // Go to accounts login page if no appId is returned
  redirectToLogin();
};