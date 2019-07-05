import Virtru from 'virtru-tdf3-js';
import TDF from 'tdf3-js';
import { bindActions } from 'redux-zero/utils';

import * as logs from '../constans/methodLogs';
import store from '../store';

const envs = {
  develop01: {
    stage: 'develop01',
    kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
    acmEndpoint: 'https://acm-develop01.develop.virtru.com',
    easEndpoint: 'https://accounts-develop01.develop.virtru.com',
    startUrl: 'https://secure-develop01.develop.virtru.com/start',
  },
  staging: {
    stage: 'staging',
    kasEndpoint: 'https://api.staging.virtru.com/kas',
    acmEndpoint: 'https://acm.staging.virtru.com',
    easEndpoint: 'https://accounts.staging.virtru.com',
    startUrl: 'https://secure.staging.virtru.com/start',
  },
  production: {
    stage: 'production',
    kasEndpoint: 'https://api.virtru.com/kas',
    acmEndpoint: 'https://acm.virtru.com',
    easEndpoint: 'https://accounts.virtru.com',
    startUrl: 'https://secure.virtru.com/start',
  },
};

function getEnvironment() {
  const stage = process.env.VIRTRU_ENV || 'develop01';
  return envs[stage];
}

async function streamToBuffer(stream) {
  const bufs = [];
  stream.on('data', function(d) {
    bufs.push(d);
  });
  return new Promise(resolve => {
    stream.on('end', function() {
      resolve(Buffer.concat(bufs));
    });
  });
}

const actions = {
  pushLogAction: ({ tdfLog }, value) => ({ tdfLog: [...tdfLog, value] }),
};

const boundActions = bindActions(actions, store);

function _pushAction(action) {
  boundActions.pushLogAction(action);
}

function buildClient(userEmail) {
  const redirectUrl = 'local.virtru.com';
  const { acmEndpoint, kasEndpoint, easEndpoint, stage } = getEnvironment();

  _pushAction({
    title: 'Authenticate',
    code: logs.authenticateWithGoogle(userEmail, redirectUrl, stage),
  });
  const provider = new Virtru.Client.AuthProviders.GoogleAuthProvider(
    userEmail,
    redirectUrl,
    stage,
  );

  _pushAction({
    title: 'Create Virtru Client',
    code: logs.createVirtruClient({
      acmEndpoint,
      kasEndpoint,
      easEndpoint,
    }),
  });
  const client = new Virtru.Client.VirtruClient({
    acmEndpoint,
    kasEndpoint,
    easEndpoint,
    authProvider: provider,
  });

  return client;
}

/**
 * Encrypt a file
 * @param {Buffer} fileData
 * @param {String} filename
 * @param {String} userEmail
 * @param {Boolean} asHtml
 */
async function encrypt(fileData, filename, userEmail, asHtml) {
  const { startUrl } = getEnvironment();
  const client = buildClient(userEmail);

  _pushAction({
    title: 'Create Mock Stream',
    code: logs.createMockStream(),
  });
  const contentStream = TDF.createMockStream(fileData);

  _pushAction({
    title: 'Build Virtru Policy',
    code: logs.buildVirtruPolicy(),
  });
  const policy = new Virtru.Client.VirtruPolicyBuilder().build();

  _pushAction({
    title: 'Build Virtru Encryption Params',
    code: logs.buildVirtruEncryptParams(filename),
  });
  const encryptParams = new Virtru.Client.VirtruEncryptParamsBuilder()
    .withStreamSource(contentStream)
    .withPolicy(policy)
    .withDisplayFilename(filename)
    .build();

  _pushAction({
    title: 'Encrypt File',
    code: logs.encryptFile(encryptParams),
  });
  const ct = await client.encrypt(encryptParams);
  const buffer = await streamToBuffer(ct);

  if (!asHtml) {
    return buffer;
  }

  const manifestString = ''; // TODO: Confirmed with Tyler this is not needed for now
  return TDF.wrapHtml(buffer, manifestString, `${startUrl}?htmlProtocol=1`);
}

export default encrypt;
