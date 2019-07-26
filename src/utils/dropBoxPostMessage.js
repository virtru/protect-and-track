/**
 * Add listener to load window for getting Dropbox access token from url
 * When we trying to login to Dropbox we need to redirect user to dropbox page.
 * So we open new window with url (generate by Dropbox api) and redirect url (our current page)
 * After user log in in dropbox, dropbox will redirect user to our page with params. We getting url and send it by postMessage
 *
 */
export default function() {
  window.addEventListener('load', function() {
    const message = window.location.href;

    if (window.parent !== window.top) {
      window.opener = window.opener || window.parent;
    }

    if (window.opener && message) {
      window.opener.postMessage(message, window.location.origin);
      window.close();
    }
  });
}
