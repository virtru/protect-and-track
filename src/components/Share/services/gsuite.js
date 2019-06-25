/* global gapi */

import { loadGapi } from 'services/core/remoteLoad';
import awaitify from 'services/core/awaitify';

// API connectors.
// TODO(dmihalcik): Lock these down
const CLIENT_ID = '685840918809-jtvptmpgsvdkuqqbtjuvqi4ijujviivd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCDUsJwMdEhAuwoUX0yv0RhJOtGXAhLkqw';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';


/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
async function initClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  });
}

async function init() {
  await loadGapi();
  const load = awaitify(gapi.load);
  await load('client:auth2');
  await initClient();
}

export { init };

