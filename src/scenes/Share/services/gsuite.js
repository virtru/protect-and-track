/* global gapi */

import { loadGapi } from 'services/core/remoteLoad';
import awaitify from 'services/core/awaitify';

// API connectors.
// TODO(dmihalcik): Lock these down
const CLIENT_ID = '685840918809-jtvptmpgsvdkuqqbtjuvqi4ijujviivd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCDUsJwMdEhAuwoUX0yv0RhJOtGXAhLkqw';

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

async function upload(name, contentType, content) {
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
    mimeType: contentType,
  };
  const base64 = buffer => {
    return btoa(
      new Uint8Array(buffer).reduce((data, byte) => {
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
    'Content-Type: ' +
    contentType +
    '\r\n\r\n' +
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

export { init, upload };
