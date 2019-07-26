import awaitify from 'services/core/awaitify';

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

  // TODO: consider using window.open
  window.addEventListener('message', e => {
    processOneDrive(e.data) && andThen && andThen();
  });
  window.open(
    oauthUrl,
    'OneDriveAuthPopup',
    'dialog=yes,dependent=yes,scrollbars=yes,location=yes,width=600,height=600',
  );
}

// Handles the redirect-applied fragment, parsing it and removing the fragment string
function processOneDrive(authResponse) {
  console.log(`processOneDrive('${authResponse}')`);
  const authResponseJSON =
    '{' + authResponse.replace(/([^=]+)=([^&]+)&?/g, '"$1":"$2",').slice(0, -1) + '}';
  const authInfo = JSON.parse(authResponseJSON, (k, v) => (k === '' ? v : decodeURIComponent(v)));
  if (!authInfo) {
    console.log('No authInfo found');
  }
  if (!authInfo.access_token) {
    console.log('No access_token found');
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
  return true;
}

async function signIn() {
  const auth = JSON.parse(localStorage.getItem('virtru-onedrive-auth'));
  if (!auth) {
    // TODO check expiration
    const doAuth = awaitify(initiateOauth);
    await doAuth();
  }
  return true;
}

async function signOut() {
  // TODO signout
}

async function share(accessToken, fileId, recipients) {
  // TODO share
}

async function upload(accessToken, file) {
  // TODO upload
}

export default { init, share, upload, signIn, signOut };
