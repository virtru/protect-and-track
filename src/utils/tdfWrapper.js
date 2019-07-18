import Virtru from 'virtru-tdf3-js';
import TDF from 'tdf3-js';
import { bindActions } from 'redux-zero/utils';
import moment from 'moment';

import * as logs from 'constants/methodLogs';
import envs from 'constants/environment';
import store from '../store';

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
  // @todo remove hardcode, audit events should be pushed from api
  fetchAuditLogAction: () => ({
    auditLog: [
      {
        auditDataType: 'FILE.ACCESS_SUCCEEDED',
        userId: 'foo@bar.com',
        timestamp: '2019-07-15T14:48:22+00:00',
        recordId: 0,
      },
      {
        auditDataType: 'FILE.ACCESS_SUCCEEDED',
        userId: 'foo@bar.com',
        timestamp: '2019-07-15T14:48:22+00:00',
        recordId: 1,
      },
    ],
  }),
};

const boundActions = bindActions(actions, store);

function _pushAction(action) {
  action.timestamp = moment();
  boundActions.pushLogAction(action);
}

function buildClient(userEmail) {
  const redirectUrl = window.location.href;
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
async function encrypt({ client, fileData, filename, userEmail, asHtml }) {
  const { startUrl } = getEnvironment();

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

  // TODO - DSAT-44: Stream the file instead of storing in buffer. This will allow
  // us to handle large files.
  const buffer = await streamToBuffer(ct);

  if (!asHtml) {
    return buffer;
  }

  // TODO: add interval request on audit events and put them in store
  boundActions.fetchAuditLogAction();

  const manifestString = ''; // TODO: Confirmed with Tyler this is not needed for now
  return {
    encryptedFile: TDF.wrapHtml(buffer, manifestString, `${startUrl}?htmlProtocol=1`),
    policyId: policy._policyId,
  };
}

async function authenticate(email) {
  const client = buildClient(email);
  await client.clientConfig.authProvider._initAuthForProvider();
  return client;
}

function unwrapHtml(file) {
  _pushAction({
    title: 'Load TDF',
    code: logs.unwrapHtml(),
  });
  return TDF.unwrapHtml(file);
}

export { encrypt, authenticate, unwrapHtml };
