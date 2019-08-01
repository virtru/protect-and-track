import createStore from 'redux-zero';
import Virtru from 'virtru-sdk';
import { SHARE_PROVIDERS, SHARE_STATE } from 'constants/sharing';
import { base64ToArrayBuffer } from 'utils/buffer';

import ENCRYPT_STATES from 'constants/encryptStates';

let encryptState = ENCRYPT_STATES.UNPROTECTED;

const auths = JSON.parse(localStorage.getItem('virtru-client-auth')) || null;
const activeAuth = auths && Object.values(auths)[0];
const appId = activeAuth && activeAuth.split(':')[1];

let userId = getQueryParam('virtruAuthWidgetEmail');
let isLoggedIn = userId && Virtru.Auth.isLoggedIn({ email: userId });
let policy = false;
let file = false;
let encrypted = false;
let virtruClient = false;
let policyId = localStorage.getItem('virtru-demo-policyId');

if (isLoggedIn) {
  virtruClient = new Virtru.Client({ email: userId });
}

try {
  const encryptedFileData = JSON.parse(localStorage.getItem('virtru-demo-file-encrypted'));
  if (encryptedFileData) {
    const buffer = encryptedFileData && base64ToArrayBuffer(encryptedFileData.b64);
    encrypted = {
      payload: buffer,
      name: encryptedFileData.name,
      type: encryptedFileData.type,
    };
    encryptState = isLoggedIn ? ENCRYPT_STATES.PROTECTED : ENCRYPT_STATES.PROTECTED_NO_AUTH;
  }
} catch (err) {
  console.error(err);
}

try {
  const localData = JSON.parse(localStorage.getItem('virtru-demo-file'));
  if (localData) {
    const buffer = localData.b64 && base64ToArrayBuffer(localData.b64);
    file = {
      arrayBuffer: buffer,
      file: {
        name: localData.fileName,
        type: localData.fileType,
      },
    };
    const policyData = JSON.parse(localStorage.getItem('virtru-demo-policy'));
    policy =
      policyData && policyData.policy
        ? new Virtru.Policy(
            policyData.policyId,
            policyData.users,
            policyData.authorizations,
            policyData.expirationDeadline,
          )
        : new Virtru.PolicyBuilder().build();
  }
} catch (err) {
  console.error(err);
}

export default createStore({
  appIdBundle: false,

  // File content that the user has attached. May be encrypted or not...
  file,

  // Stage of the encryption process
  encryptState,

  // The encrypted payload of the current TDF
  encrypted,

  // The policy associated with the current document, if any
  policy,

  // TDF Event Logger Contents
  tdfLog: [],

  // Application loading status
  isLoading: true,

  // Current share provider displayed in the 'sharing' wizard
  share: false,

  // State for the differnet sharing providers
  ...(() => {
    let o = {};
    for (let k in SHARE_PROVIDERS) {
      const provider = SHARE_PROVIDERS[k];
      o['share_' + provider] = { state: SHARE_STATE.UNSHARED };
    }
    return o;
  })(),

  // Username; displayed in appbar
  userId,

  appId,

  // Audit events associated with the current policy
  auditEvents: [],

  // Enhanced TDF client library
  virtruClient,

  // Is the user logged in?
  isLoggedIn,

  // The policy ID
  policyId,
});

function getQueryParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
