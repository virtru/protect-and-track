import createStore from 'redux-zero';
import Virtru from 'virtru-tdf3-js';

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

console.log(auths, activeAuth);

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

  // Audit events associated with the current policy
  auditLog: [],

  // Application loading status
  isLoading: true,

  // Sharing status; maintained by the `Share` scene, see it for details
  share: { state: 'unshared', host: false },

  // Username; displayed in appbar
  userId: activeAuth && activeAuth.split(':')[0],

  // Enhanced TDF client library
  virtruClient: false,
});
