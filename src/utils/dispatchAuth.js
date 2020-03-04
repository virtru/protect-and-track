/**
 * Handle the case where we are loading in a popover and pass the oauth2 information to the `opener`.
 *
 * Add listener to load window for getting Dropbox access token from url
 * When we trying to login to Dropbox we need to redirect user to dropbox page.
 * So we open new window with url (generate by Dropbox api) and redirect url (our current page)
 * After user log in in dropbox, dropbox will redirect user to our page with params. We getting url and send it by postMessage
 */
export default function() {
  if (!window.opener && !window.parent) {
    return false;
  }

  const hasAccessToken = window.location.hash && window.location.hash.includes('access');

  if (!hasAccessToken) {
    return false;
  }

  window.addEventListener('load', () => {
    if (window.parent !== window.top) {
      window.opener = window.opener || window.parent;
    }

    if (window.opener) {
      window.opener.postMessage(window.location.href, window.location.origin);
      window.close();
    }
  });
  console.log('Auth redirect for share dialog...');
  return true;
}
