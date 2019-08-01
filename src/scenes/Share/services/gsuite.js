/* global gapi */

import { loadGapi } from 'services/core/remoteLoad';
import awaitify from 'services/core/awaitify';

// API connectors.
// To edit: https://console.developers.google.com/apis/api/drive.googleapis.com/overview
const CLIENT_ID = '685840918809-jtvptmpgsvdkuqqbtjuvqi4ijujviivd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDCMZYdYYNTdYy_qC1V1a-JcuiouQBLi4A';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES =
  // List files; used for demo
  // TODO(dmihalcik) remove
  'https://www.googleapis.com/auth/drive.metadata.readonly' +
  // Update access to files created by the app.
  ' https://www.googleapis.com/auth/drive.file';

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
async function initClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });
}

async function init() {
  await loadGapi();
  const load = awaitify(gapi.load);
  await load('client:auth2');
  await initClient();
  return gapi;
}

async function signIn() {
  const authResponse = await gapi.auth2.getAuthInstance().signIn();
  console.log(JSON.stringify(authResponse));
  return authResponse.w3.U3; // Grab email from google auth
}

async function signOut() {
  return gapi.auth2.getAuthInstance().signOut();
}

async function share(fileId, recipients) {
  if (!recipients.length) {
    return;
  }
  const makeRequest = user => ({
    path: `drive/v2/files/${fileId}/permissions`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'user',
      value: user,
      role: 'reader',
    }),
  });
  if (recipients.length === 1) {
    return await gapi.client.request(makeRequest(recipients[0]));
  }
  const httpBatch = gapi.client.newBatch();
  recipients.map(rcpt => httpBatch.add(gapi.client.request(makeRequest(rcpt))));
  return await httpBatch;
}

/**
 * @param {String} name the file name
 * @param {*} content ArrayBuffer object containing the TDF.html content
 */
async function upload(name, content) {
  // NOTE(DSAT-1): Unfortunately, AFAICT the current `drive.files.create` method in GAPI
  // does not support POST content. See relevant discussions:
  //   * https://stackoverflow.com/questions/51775917
  //   * https://stackoverflow.com/questions/34905363
  //
  // Instead, create a gapi `request` explicitly for the following POST:
  //   * https://developers.google.com/drive/api/v3/reference/files/create
  const boundary = '-------34905363';
  const delimiter = '\r\n--' + boundary + '\r\n';
  const close_delim = '\r\n--' + boundary + '--';
  const metadata = {
    name: name,
    mimeType: 'text/html',
  };
  const base64 = buffer => {
    return btoa(
      buffer.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, ''),
    );
  };
  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Transfer-Encoding: base64\r\n' +
    'Content-Type: text/html\r\n\r\n' +
    base64(content) +
    close_delim;

  const request = {
    path: '/upload/drive/v3/files',
    method: 'POST',
    params: { uploadType: 'multipart' },
    headers: {
      'Content-Type': 'multipart/related; boundary="' + boundary + '"',
    },
    body: multipartRequestBody,
  };

  return await gapi.client.request(request);
}

export default { init, share, upload, signIn, signOut };
