import createStore from 'redux-zero';
import Virtru from 'virtru-sdk';
import uuid from 'uuid';
import { SHARE_PROVIDERS, SHARE_STATE } from 'constants/sharing';
import { base64ToArrayBuffer } from 'utils/buffer';
import checkIsMobile from 'utils/checkIsMobile';
import checkIsSupportedBrowser from 'utils/checkIsSupportedBrowser';

import ENCRYPT_STATES from 'constants/encryptStates';

let encryptState = ENCRYPT_STATES.UNPROTECTED;

const auths = JSON.parse(localStorage.getItem('virtru-client-auth')) || null;
const activeAuth = auths && Object.values(auths)[0];
const appId = activeAuth && activeAuth.split(':')[1];

const policyData = JSON.parse(localStorage.getItem('virtru-demo-policy'));
const fileData = JSON.parse(localStorage.getItem('virtru-demo-file'));

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

  // Restore existing encrypted file
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
  // Restore existing file
  if (fileData) {
    const buffer = fileData.b64 && base64ToArrayBuffer(fileData.b64);
    file = {
      arrayBuffer: buffer,
      file: {
        name: fileData.fileName,
        type: fileData.fileType,
      },
    };

    // Rebuild existing policy or create new one
    if (policyData) {
      const builder = new Virtru.PolicyBuilder();
      builder.setPolicyId(policyId || uuid.v4());
      if (!policyData.authorizations.includes('forward')) {
        builder.disableReshare();
      }
      if (policyData.expirationDeadline) {
        builder.enableExpirationDeadline(policyData.expirationDeadline);
      }
      if (policyData.users.length > 0) {
        builder.addUsersWithAccess(...policyData.users);
      }
      policy = builder.build();
    } else {
      policy = new Virtru.PolicyBuilder().withPolicyId(uuid.v4()).build();
    }
  }
} catch (err) {
  console.error(err);
}

export default createStore({
  appIdBundle: false,

  isMobile: checkIsMobile(),

  isSupportedBrowser: checkIsSupportedBrowser(),

  continueAnyway: !!localStorage.getItem('continueAnyway'),

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
  auditEvents: false,

  // Enhanced TDF client library
  virtruClient,

  // Is the user logged in?
  isLoggedIn,

  // The policy ID
  policyId,

  // Any current alerts that should be displayed atop the app
  alert: false,
});

function getQueryParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line no-useless-escape
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
