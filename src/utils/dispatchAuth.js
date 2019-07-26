import { OwnerFlow } from 'client-oauth2';

/**
 * Handle the case where we are loading in a popover and pass the oauth2 information to the `opener`.
 *
 * Add listener to load window for getting Dropbox access token from url
 * When we trying to login to Dropbox we need to redirect user to dropbox page.
 * So we open new window with url (generate by Dropbox api) and redirect url (our current page)
 * After user log in in dropbox, dropbox will redirect user to our page with params. We getting url and send it by postMessage
 */
export default function() {
  console.log(`document.referrer = [${document.referrer}]`);
  if (!window.opener && !window.parent) {
    return false;
  }
  const postAndClose = message => {
    if (window.parent !== window.top) {
      window.opener = window.opener || window.parent;
    }

    if (window.opener && message) {
      window.opener.postMessage(message, window.location.origin);
      window.close();
    }
  };

  let handler = false;
  if (document.referrer.startsWith('https://login.microsoftonline.com')) {
    const msg = window.location.hash && window.location.hash.substring(1);
    // TODO maybe handle error codes here???
    handler = () => {
      postAndClose(msg);
    };
  } else if (document.referrer.includes('https://login.dropbox.com')) {
    handler = () => {
      postAndClose(window.location.href);
    };
  }

  if (handler) {
    window.addEventListener('load', handler);
    return true;
  }
}
