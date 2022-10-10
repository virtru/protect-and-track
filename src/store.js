import createStore from 'redux-zero';
import moment from 'moment';
import * as Virtru from 'virtru-sdk';

import { clientConfig } from './utils/config';
import { SHARE_PROVIDERS, SHARE_STATE } from './constants/sharing';
import { isMobile } from './utils/checkIsMobile';
import { isSupportedBrowser } from './utils/checkIsSupportedBrowser';
import { getQueryParam } from './utils/getQueryParam';

const auths = JSON.parse(localStorage.getItem('virtru-client-auth')) || null;
const activeAuth = auths && Object.values(auths)[0];
const appId = activeAuth && activeAuth.split(':')[1];

let tdfLog;
try {
  tdfLog = JSON.parse(localStorage.getItem('virtru-demo-sdk-log')) || [];
  tdfLog.forEach((log) => {
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
  // Strip out auth widget specified virtruAuthWidgetEmail
  const search = window.location.search
    .replace(/([?&])virtruAuthWidgetEmail(=[^&#]+&?)/, '$1')
    .replace(/[?&]$/, '');
  const hash = window.location.hash;
  window.history.replaceState({}, document.title, pathname + search + hash);
}

let isLoggedIn = email && Virtru.Auth.isLoggedIn({ email });
let virtruClient = false;

if (isLoggedIn) {
  console.log(`Creating virtruClient in store`);
  virtruClient = new Virtru.Client({ ...clientConfig, email });
  userId = email;
} else {
  // remove the email from localstorage
  localStorage.removeItem('virtru-demo-email');
  userId = false;
}

export default createStore({
  isMobile: isMobile(),

  isSupportedBrowser: isSupportedBrowser(),

  continueAnyway: !!localStorage.getItem('continueAnyway'),

  // File content that the user has attached. May be encrypted or not...
  //file,

  // Stage of the encryption process
  //encryptState,

  // The encrypted payload of the current TDF
  //encrypted,

  // The policy associated with the current document, if any
  //policy,

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
  //policyId,

  // Any current alerts that should be displayed atop the app
  alert: false,
});
