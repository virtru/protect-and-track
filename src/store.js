import createStore from 'redux-zero';

import ENCRYPT_STATES from 'constants/encryptStates';

let encryptState = ENCRYPT_STATES.UNPROTECTED;

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
const userId = activeAuth && activeAuth.split(':')[0];
const appId = activeAuth && activeAuth.split(':')[1];

let file = false;
let encrypted = false;

try {
  const encryptedFileData = JSON.parse(localStorage.getItem('virtru-demo-file-encrypted'));
  if (encryptedFileData) {
    const buffer = encryptedFileData && base64ToArrayBuffer(encryptedFileData.b64);
    encrypted = {
      payload: buffer,
      name: encryptedFileData.name,
      type: encryptedFileData.type,
    };
    encryptState = userId ? ENCRYPT_STATES.PROTECTED : ENCRYPT_STATES.PROTECTED_NO_AUTH;
  }

  const fileData = JSON.parse(localStorage.getItem('virtru-demo-file'));
  if (fileData) {
    const buffer = fileData && base64ToArrayBuffer(fileData.b64);
    file = {
      arrayBuffer: buffer,
      file: {
        name: fileData.fileName,
        type: fileData.fileType,
      },
    };
  }
} catch (err) {
  console.error(err);
}

export default createStore({
  appIdBundle: false,
  file,
  encrypted,
  encryptState,
  tdfLog: [],
  isLoading: true,
  share: { state: 'unshared', host: false },
  userId,
  appId,
  auditEvents: [],
  virtruClient: false,
});
