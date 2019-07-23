import createStore from 'redux-zero';
import Virtru from 'virtru-tdf3-js';
import { SHARING } from 'constants/api';

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

const auths = JSON.parse(localStorage.getItem('virtru-client-auth')) || null;
const activeAuth = auths && Object.values(auths)[0];
let file = false;
let policy = false;
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
    policy =
      localData.policy &&
      new Virtru.Client.VirtruPolicy(
        localData.policy._policyId,
        localData.policy._users,
        localData.policy._authZFlags,
        localData.policy._deadline,
      );
  }
} catch (err) {
  console.error(err);
}

export default createStore({
  appIdBundle: false,

  // File content that the user has attached. May be encrypted or not...
  file,

  //
  encrypted: false,

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
    for (let k in SHARING.PROVIDERS) {
      const provider = SHARING.PROVIDERS[k];
      o['share_' + provider] = { state: SHARING.STATE.UNSHARED };
    }
    return o;
  })(),

  // Username; displayed in appbar
  userId: activeAuth && activeAuth.split(':')[0],

  appId: activeAuth && activeAuth.split(':')[1],

  // Audit events associated with the current policy
  auditEvents: [],

  // Enhanced TDF client library
  virtruClient: false,
});
