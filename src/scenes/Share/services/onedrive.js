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

async function signIn() {
  const oauthUrl = new URL('https://account.box.com/api/oauth2/authorize');
  oauthUrl.search = new URLSearchParams({
    response_type: 'token',
    client_id: CLIENT_ID,
    redirect_uri: window.location.href.split(/[?#]/)[0],
  });

  // TODO: consider using window.open
  window.location = oauthUrl;
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
