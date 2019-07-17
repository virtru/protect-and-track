import createStore from 'redux-zero';

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
try {
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

console.log(auths, activeAuth);

export default createStore({
  appIdBundle: false,
  file,
  encrypted: false,
  tdfLog: [],
  auditLog: [],
  isLoading: true,
  share: { state: 'unshared', host: false },
  userId: activeAuth && activeAuth.split(':')[0],
  virtruClient: false,
});
