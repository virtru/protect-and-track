import { OidcClient } from '@virtru/oidc-client-js';
import createStore from 'redux-zero';
import moment from 'moment';
import '../node_modules/virtru-sdk/dist/virtru-sdk.web.js';
// import '../node_modules/virtru-sdk/dist/virtru-sdk.web.js';
import { oidc as oidcConfig, clientConfig } from './utils/config';
import { SHARE_PROVIDERS, SHARE_STATE } from './constants/sharing';
import { isMobile } from './utils/checkIsMobile';
import { isSupportedBrowser } from './utils/checkIsSupportedBrowser';
import { restoreUserId } from './utils/oidc';

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

const oidcClient = new OidcClient(oidcConfig);
const userId = restoreUserId(oidcConfig);
let authState = userId ? 'loggedin' : false;
let virtruClient = false;

if (authState) {
  console.log(`Creating virtruClient in store`);
  const authProvider = new Virtru.OidcProvider(oidcClient);
  virtruClient = new Virtru.Client({ ...clientConfig, email: userId, authProvider });
} else {
  // remove the email from localstorage
  console.log(`Skipping virtruClient in store`);
  localStorage.removeItem('virtru-demo-email');
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

  oidcClient,

  redirectCodes: [],

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

  // Audit events associated with the current policy
  auditEvents: false,

  // Enhanced TDF client library
  virtruClient,

  // Is the user logged in?
  authState,

  // The policy ID
  //policyId,

  // Any current alerts that should be displayed atop the app
  alert: false,

  userId,
});
