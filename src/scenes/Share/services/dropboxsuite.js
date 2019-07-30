import { Dropbox } from 'dropbox';
const ClientOAuth2 = require('client-oauth2');

const CLIENT_ID = 'ssol0phott1nv4q';
const AUTHORIZATION_URI = 'https://www.dropbox.com/oauth2/authorize';
const AUTHORIZATION_TOKEN_URI = 'https://www.dropbox.com/oauth2/authorize';
const REDIRECT_URI = `${window.location.origin}/`;

function init() {
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
  const fname = file.name + (file.name.endsWith('.html') ? '' : '.html');
  return await dropBox.filesUpload({ path: '/' + fname, contents: file.payload });
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
