// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
