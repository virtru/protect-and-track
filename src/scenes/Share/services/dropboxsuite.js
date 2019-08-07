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

import { Dropbox } from 'dropbox';
const ClientOAuth2 = require('client-oauth2');

// NOTE(deployment) You must set this environment variable to support sharing.
// Pulled in as an app from the dropbox devlopers console. To create one,
// go to https://www.dropbox.com/developers/apps and click 'create app'
// Choose the Dropbox API
// If you want 'sharing' to work, you must select Full Dropbox access :-(
// You'll need t o enable t for development, set your redirect URI to your deployment
// location, and allow implicit grants.
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID_DROPBOX;
const AUTHORIZATION_URI = 'https://www.dropbox.com/oauth2/authorize';
const AUTHORIZATION_TOKEN_URI = 'https://www.dropbox.com/oauth2/authorize';
const REDIRECT_URI = window.location.href.split(/[?#]/)[0];

function init() {
  if (!CLIENT_ID) {
    console.info('Dropbox integration not enabled');
    return false;
  }
  return new ClientOAuth2({
    clientId: CLIENT_ID,
    authorizationUri: AUTHORIZATION_URI,
    accessTokenUri: AUTHORIZATION_TOKEN_URI,
    redirectUri: REDIRECT_URI,
  });
}

async function signIn() {
  const dropBoxAuth = init();
  const url = dropBoxAuth.token.getUri();
  window.open(
    url,
    'DropBoxAuthPopup',
    'dialog=yes,dependent=yes,scrollbars=yes,location=yes,width=600,height=600',
  );
  return await getToken(dropBoxAuth);
}

async function signOut() {}

async function share(accessToken, fileId, recipients) {
  const dropBox = new Dropbox(accessToken);
  const members = recipients.map(email => {
    return {
      '.tag': 'email',
      email,
    };
  });
  return await dropBox.sharingAddFileMember({ file: fileId, members });
}

async function upload(accessToken, file) {
  const dropBox = new Dropbox(accessToken);
  let fname = file.name + (file.name.endsWith('.html') ? '' : '.html');

  // Construct a new filename with a random number to avoid conflict errors
  const nameSplit = fname.split('.');
  const random = Math.floor(Math.random() * 1000);
  const insertionPoint = nameSplit.length - (nameSplit.length < 3 ? 1 : 2);
  nameSplit.splice(insertionPoint, 0, random);
  const newName = nameSplit.join('.');

  return await dropBox.filesUpload({ path: '/' + newName, contents: file.payload });
}

/**
 * Add listener to message type event for getting url with access token from dropbox after log in
 * (see src/utils/dropBoxPostMessage.js)
 * @param dropBoxAuth
 * @returns {Promise<any>}
 */
function getToken(dropBoxAuth) {
  return new Promise(resolve => {
    async function dropboxMessageListener(e) {
      if (window.location.origin === e.origin) {
        const token = await dropBoxAuth.token.getToken(e.data);
        window.removeEventListener('message', dropboxMessageListener, false);
        resolve(token);
      }
    }
    window.addEventListener('message', dropboxMessageListener, false);
  });
}

export default { init, share, upload, signIn, signOut };
