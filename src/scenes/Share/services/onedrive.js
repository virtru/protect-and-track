import awaitify from 'services/core/awaitify';
import { arrayBufferToBase64 } from 'utils/buffer';

// OneDrive apps can only redirect to a single host, so we need separate client ids for
// both local(host) and demos.developers.virtru.com
const CLIENT_ID = window.location.host.includes('local')
  ? 'a6419f7b-80cb-4d9a-abe1-4573cfd3709f'
  : '64d97da6-c38a-49d5-a472-7874958718ab';
const AUTHORIZATION_URI = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const REDIRECT_URI = window.location.href.split(/[?#]/)[0];

async function init() {
  //   return new ClientOAuth2({
  //   clientId: CLIENT_ID,
  //   authorizationUri: AUTHORIZATION_URI,
  //   redirectUri: REDIRECT_URI,
  // });
}

// Starts oauth flow. Note that this will reload the current page.
function initiateOauth(andThen) {
  const oauthUrl = new URL(AUTHORIZATION_URI);
  oauthUrl.search = new URLSearchParams({
    response_type: 'token',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'Files.ReadWrite.AppFolder', // Marked as 'preview'
    // https://docs.microsoft.com/en-us/onedrive/developer/rest-api/concepts/special-folders-appfolder?view=odsp-graph-online
  });

  function handleMesssage(e) {
    if (window.location.origin !== e.origin) {
      return;
    }

    const token = processOneDrive(e.data);
    if (!token) {
      // TODO if we don't find a valid token after x minutes or the window is closed,
      // report an error in the first argument to andThen.
      return;
    }

    // YAY! We found a token! Remove the handler to avoid conflicts with other auth callbacks
    window.removeEventListener('message', handleMesssage);
    if (andThen) {
      // we got a token, and have a callback
      andThen(false, token);
    }
  }

  window.addEventListener('message', handleMesssage);
  window.open(
    oauthUrl,
    'OneDriveAuthPopup',
    'dialog=yes,dependent=yes,scrollbars=yes,location=yes,width=600,height=600',
  );
}

// Handles the redirect-applied fragment, parsing it and removing the fragment string
function processOneDrive(authResponse) {
  const authResponseFragment = authResponse.split(/[?#]/)[1];
  const authResponseDecoded = authResponseFragment && decodeURI(authResponseFragment);
  if (!authResponseDecoded) {
    console.log('No auth fragment for onedrive found');
    return;
  }
  const authResponseJSON =
    '{' + authResponseDecoded.replace(/([^=]+)=([^&]+)&?/g, '"$1":"$2",').slice(0, -1) + '}';
  const authInfo = JSON.parse(authResponseJSON, (k, v) => (k === '' ? v : decodeURIComponent(v)));
  if (!authInfo) {
    console.log(`No authInfo found in ${authResponseJSON}`);
    return;
  }
  if (!authInfo.access_token) {
    console.log(`No access_token found in ${authResponseJSON}`);
    return;
  }
  const expiresInSeconds = parseInt(authInfo.expires_in);
  let expiration = new Date();
  expiration.setTime(expiration.getTime() + expiresInSeconds * 1000);
  localStorage.setItem(
    'virtru-onedrive-auth',
    JSON.stringify({
      token: authInfo.access_token,
      expiration: expiration.toUTCString(),
    }),
  );
  return authInfo.access_token;
}

async function signIn() {
  const auth = JSON.parse(localStorage.getItem('virtru-onedrive-auth'));
  if (!auth || !auth.token) {
    // TODO check expiration
    const doAuth = awaitify(initiateOauth);
    try {
      const token = await doAuth();
      return token;
    } catch (e) {
      throw e;
    }
  }
  return auth.token;
}

async function signOut() {
  localStorage.removeItem('virtru-onedrive-auth');
}

async function share(token, fileId, recipients) {
  if (!(fileId && token && recipients && recipients.length)) {
    console.log('invalid share request: ' + JSON.stringify(arguments));
    return;
  }
  const root = 'https://graph.microsoft.com/v1.0/me';
  const response = await fetch(`${root}/drive/items/${fileId}/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({
      recipients: recipients.map(email => ({ email })),
      message: 'Please view this Virtru encrypted content',
      // Arguably unnecessary
      requireSignIn: true,
      // Maybe we shouldn't enable this in the demo to avoid spamminess.
      sendInvitation: true,
      roles: ['read'],
    }),
  });
  if (!response.ok) {
    // TODO handle not ok responses
    console.log(response.ok);
    return;
  }
  return response.json();
}

async function upload(token, file) {
  // https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_put_content?view=odsp-graph-online
  if (!(token && file && file.name && file.payload)) {
    console.log('invalid upload request: ' + JSON.stringify(arguments));
    return;
  }
  const root = 'https://graph.microsoft.com/v1.0/me';
  const response = await fetch(`${root}/drive/special/approot:/${file.name}:/content`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/html',
      Authorization: `bearer ${token}`,
    },
    body: file.payload,
  });
  if (!response.ok) {
    // TODO handle not ok responses
    console.log(response.ok);
    return;
  }
  return response.json();
}

export default { init, share, upload, signIn, signOut };
