import { LOGIN_PLATFORM, ACCOUNTS_APPID_BUNDLE_URL, LOGIN_URL } from 'constants/api';

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
