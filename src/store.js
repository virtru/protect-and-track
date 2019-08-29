// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import createStore from 'redux-zero';
import Virtru from 'virtru-sdk';
import moment from 'moment';
import uuid from 'uuid';

import { SHARE_PROVIDERS, SHARE_STATE } from 'constants/sharing';
import { base64ToArrayBuffer } from 'utils/buffer';
import checkIsMobile from 'utils/checkIsMobile';
import checkIsSupportedBrowser from 'utils/checkIsSupportedBrowser';
import ENCRYPT_STATES from 'constants/encryptStates';
import analytics, { trackLogin, EVENT_NAMES } from 'utils/analytics';

analytics.track({
  event: EVENT_NAMES.DEMO_LAND,
});

let encryptState = ENCRYPT_STATES.UNPROTECTED;

const auths = JSON.parse(localStorage.getItem('virtru-client-auth')) || null;
const activeAuth = auths && Object.values(auths)[0];
const appId = activeAuth && activeAuth.split(':')[1];

const policyData = JSON.parse(localStorage.getItem('virtru-demo-policy'));
const fileData = JSON.parse(localStorage.getItem('virtru-demo-file'));

let tdfLog;
try {
  tdfLog = JSON.parse(localStorage.getItem('virtru-demo-sdk-log')) || [];
  tdfLog.forEach(log => {
    log.timestamp = moment(log.timestamp);
  });
} catch (err) {
  console.error(err);
  tdfLog = [];
}

let userId = getQueryParam('virtruAuthWidgetEmail');
let email = localStorage.getItem('virtru-demo-email');
if (userId) {
  email = userId;
  localStorage.setItem('virtru-demo-email', userId);
  const pathname = window.location.pathname;
  const search = window.location.search
    .replace(/([?&])virtruAuthWidgetEmail(=[^&#]+&?)/, '$1')
    .replace(/[?&]$/, '');
  const hash = window.location.hash;
  window.history.replaceState({}, document.title, pathname + search + hash);
}

let isLoggedIn = email && Virtru.Auth.isLoggedIn({ email });
let policy = false;
let file = false;
let encrypted = false;
let virtruClient = false;
let policyId = localStorage.getItem('virtru-demo-policyId');
let encryptedFileData;

// Restore encrypted file
try {
  encryptedFileData = JSON.parse(localStorage.getItem('virtru-demo-file-encrypted'));

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

// Restore unencrypted file
try {
  if (fileData) {
    const buffer = fileData.b64 && base64ToArrayBuffer(fileData.b64);
    file = {
      arrayBuffer: buffer,
      file: {
        name: fileData.fileName,
        type: fileData.fileType,
      },
    };

    // Virtru: create a new policy builder
    const builder = new Virtru.PolicyBuilder();
    builder.setPolicyId(uuid.v4());
    if (policyData !== null && typeof policyData === 'object') {
      if (policyId) {
        // Virtru: restore policy id from localstorage
        builder.setPolicyId(policyId);
      }
      if (!policyData.authorizations.includes('forward')) {
        // Virtru: disable resharing
        builder.disableReshare();
      }
      if (policyData.expirationDeadline) {
        // Virtru: enable expiration deadline
        builder.enableExpirationDeadline(policyData.expirationDeadline);
      }
      if (policyData.users.length > 0) {
        // Virtru: add users with access to policy
        builder.addUsersWithAccess(...policyData.users);
      }
    }
    // Virtru: build the policy
    policy = builder.build();
  }
} catch (err) {
  console.error(err);
}

// Restore the logged in user
if (isLoggedIn) {
  userId = email;
  // Virtru: Create a new client with the logged in user
  virtruClient = new Virtru.Client({ email });
  trackLogin({ userId, file });
} else {
  // remove the email from localstorage
  localStorage.removeItem('virtru-demo-email');
  userId = false;
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
  tdfLog,

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
